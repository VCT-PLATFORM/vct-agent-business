import { BaseAgent } from '../agents/BaseAgent.js';
import type { AgentConfig } from '../agents/BaseAgent.js';
import { SkillLoader } from '../runtime/SkillLoader.js';

/**
 * AgentFactory — Creates and caches agent instances by department/role.
 *
 * Uses SkillLoader to dynamically load SKILL.md files and produce
 * fully-configured BaseAgent instances ready for execution.
 */
export class AgentFactory {
  private readonly skillLoader: SkillLoader;
  private readonly model: AgentConfig['model'];
  private readonly workspaceRoot: string;
  private readonly maxTokens: number;
  private readonly temperature: number;
  private readonly cache = new Map<string, BaseAgent>();

  constructor(options: {
    model: AgentConfig['model'];
    workspaceRoot: string;
    maxTokens?: number;
    temperature?: number;
  }) {
    this.model = options.model;
    this.workspaceRoot = options.workspaceRoot;
    this.maxTokens = options.maxTokens ?? 4096;
    this.temperature = options.temperature ?? 0.3;
    this.skillLoader = new SkillLoader(options.workspaceRoot);
  }

  /**
   * Create (or retrieve from cache) an agent for the given department/role.
   */
  create(department: string, role: string): BaseAgent {
    const cacheKey = `${department}/${role}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    // Load SKILL.md → meta + system prompt
    const { meta, systemPrompt } = this.skillLoader.load(department, role);

    // Create agent
    const agent = new BaseAgent({
      department,
      role,
      skillMeta: meta,
      systemPrompt,
      model: this.model,
      workspaceRoot: this.workspaceRoot,
      maxTokens: this.maxTokens,
      temperature: this.temperature,
    });

    this.cache.set(cacheKey, agent);
    return agent;
  }

  /**
   * List all departments and roles available.
   */
  listAvailable(): Array<{ department: string; role: string }> {
    return this.skillLoader.listAvailable();
  }

  /**
   * Get total number of cached (initialized) agents.
   */
  getActiveCount(): number {
    return this.cache.size;
  }

  /**
   * Clear the agent cache (useful for reloading skills).
   */
  clearCache(): void {
    this.cache.clear();
  }
}
