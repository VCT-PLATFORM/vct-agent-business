import { generateText } from 'ai';
import { AgentMemory } from './AgentMemory.js';
import type { AgentContext } from './AgentContext.js';

/**
 * Metadata extracted from a SKILL.md frontmatter.
 */
export interface AgentSkillMeta {
  name: string;
  description: string;
  role: 'Executive' | 'Manager' | 'Specialist';
  seniority: string;
  locale: string;
}

/**
 * Configuration for creating an agent.
 */
export interface AgentConfig {
  department: string;
  role: string;
  skillMeta: AgentSkillMeta;
  systemPrompt: string;
  model: Parameters<typeof generateText>[0]['model'];
  workspaceRoot: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Result returned by an agent after execution.
 */
export interface AgentResult {
  role: string;
  department: string;
  task: string;
  output: string;
  timestamp: string;
  durationMs: number;
}

/**
 * BaseAgent — Abstract foundation for all 35 agent roles.
 *
 * Every agent in the VCT Enterprise AI system extends this class.
 * It provides:
 * - LLM execution via Vercel AI SDK
 * - Persistent memory per agent
 * - Shared context across agent chain
 * - Output structure with metadata
 */
export class BaseAgent {
  readonly department: string;
  readonly role: string;
  readonly skillMeta: AgentSkillMeta;
  protected readonly systemPrompt: string;
  protected readonly model: AgentConfig['model'];
  protected readonly memory: AgentMemory;
  protected readonly maxTokens: number;
  protected readonly temperature: number;

  constructor(config: AgentConfig) {
    this.department = config.department;
    this.role = config.role;
    this.skillMeta = config.skillMeta;
    this.systemPrompt = config.systemPrompt;
    this.model = config.model;
    this.memory = new AgentMemory(
      config.workspaceRoot,
      config.department,
      config.role,
    );
    this.maxTokens = config.maxTokens ?? 4096;
    this.temperature = config.temperature ?? 0.3;
  }

  /**
   * Execute a task with shared context from the orchestration chain.
   * This is the primary entry point called by TaskController.
   */
  async execute(task: string, context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();

    // 1. Load recent memories for context
    const recentMemories = this.memory.loadRecentDecisions(10);
    const departmentMemory = this.memory.loadSharedMemory();

    // 2. Build the full prompt
    const fullPrompt = this.buildPrompt(task, context, recentMemories, departmentMemory);

    // 3. Call LLM
    const { text } = await generateText({
      model: this.model,
      system: this.systemPrompt,
      prompt: fullPrompt,
      maxTokens: this.maxTokens,
      temperature: this.temperature,
    });

    const durationMs = Date.now() - startTime;

    // 4. Persist to memory
    this.memory.saveDecision(task, text);

    // 5. Return structured result
    return {
      role: this.role,
      department: this.department,
      task,
      output: text,
      timestamp: new Date().toISOString(),
      durationMs,
    };
  }

  /**
   * Build the full prompt with task, context, and memories.
   */
  protected buildPrompt(
    task: string,
    context: AgentContext,
    recentMemories: string[],
    departmentMemory: string,
  ): string {
    const parts: string[] = [];

    // Master objective
    parts.push(`## 🎯 Master Objective\n${context.objective}\n`);

    // Previous agent outputs (chain-of-thought)
    if (context.outputs.size > 0) {
      parts.push('## 📋 Previous Agent Outputs');
      for (const [role, result] of context.outputs) {
        parts.push(`### ${role}\n${result}\n`);
      }
    }

    // Shared facts
    if (context.sharedFacts.length > 0) {
      parts.push(`## 📌 Shared Facts\n${context.sharedFacts.map(f => `- ${f}`).join('\n')}\n`);
    }

    // Department shared memory
    if (departmentMemory) {
      parts.push(`## 🏢 Department Context\n${departmentMemory}\n`);
    }

    // Recent personal memories
    if (recentMemories.length > 0) {
      parts.push(`## 🧠 Your Recent Decisions\n${recentMemories.slice(0, 3).join('\n---\n')}\n`);
    }

    // The actual task
    parts.push(`## ✅ YOUR TASK\n${task}\n`);

    // Output quality reminder
    parts.push(
      '## ⚠️ Output Standards\n' +
      '- ✅ **Actionable** — Dùng ngay, không cần xử lý thêm.\n' +
      '- ✅ **Professional** — Đạt chuẩn trình cho CEO/Board.\n' +
      '- ✅ **Justified** — Có lý do và data hỗ trợ.\n' +
      '- ✅ **Vietnamese** — Trả lời bằng tiếng Việt trừ khi nội dung yêu cầu tiếng Anh.\n'
    );

    return parts.join('\n');
  }

  /**
   * Get a display-friendly identifier for this agent.
   */
  getDisplayName(): string {
    return `[${this.department}/${this.role}]`;
  }
}
