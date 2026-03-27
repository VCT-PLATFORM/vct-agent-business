import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { AgentFactory } from '../agents/AgentFactory.js';
import { createContext, addResultToContext, setWorkflowContext } from '../agents/AgentContext.js';
import type { AgentContext } from '../agents/AgentContext.js';
import { DependencyGraph } from './DependencyGraph.js';
import type { DelegationTask } from './DependencyGraph.js';
import { ReportAggregator } from './ReportAggregator.js';
import { DebateEngine } from './DebateEngine.js';
import { ConfigLoader } from '../runtime/ConfigLoader.js';
import { SOPEnforcer } from '../runtime/SOPEnforcer.js';

/**
 * Delegation plan schema — what the LLM returns when analyzing a request.
 */
const DelegationPlanSchema = z.object({
  understanding: z.string().describe('Tóm tắt yêu cầu của người dùng'),
  relevant_workflow: z.string().optional().describe('ID của Workflow phù hợp (VD: WF-202)'),
  relevant_sops: z.array(z.string()).describe('Danh sách SOP IDs (VD: ["SOP-201", "SOP-202"])'),
  requires_debate: z.boolean().describe('True nếu cần phản biện đa tác nhân'),
  debate_topic: z.string().optional().describe('Chủ đề debate nếu requires_debate = true'),
  delegation_plan: z.array(z.object({
    step_order: z.number(),
    department: z.string().describe('Mã phòng ban (VD: marketing-sales, technology-product)'),
    assigned_role: z.string().describe('Mã vai trò (VD: cmo, marketing-manager, content-writer)'),
    task_description: z.string().describe('Tác vụ cụ thể, actionable cho agent'),
    required_inputs: z.array(z.string()).describe('Input cần có trước khi bắt đầu'),
    expected_outputs: z.array(z.string()).describe('Deliverable phải tạo ra'),
  })),
});

type DelegationPlan = z.infer<typeof DelegationPlanSchema>;

/**
 * MasterAgent — The Chief of Staff / CEO Orchestrator.
 *
 * Single entry point for the User. Analyzes requests, determines workflows,
 * delegates to specialized agents, runs debates when needed, and synthesizes reports.
 */
export class MasterAgent {
  private readonly model: Parameters<typeof generateText>[0]['model'];
  private readonly factory: AgentFactory;
  private readonly configLoader: ConfigLoader;
  private readonly reportAggregator: ReportAggregator;
  private readonly debateEngine: DebateEngine;
  private readonly sopEnforcer: SOPEnforcer;
  private readonly debug: boolean;

  /**
   * Callback for logging progress events (used by CLI).
   */
  onProgress?: (event: ProgressEvent) => void;

  constructor(options: {
    model: Parameters<typeof generateText>[0]['model'];
    workspaceRoot: string;
    debug?: boolean;
  }) {
    this.model = options.model;
    this.debug = options.debug ?? false;

    this.configLoader = new ConfigLoader(options.workspaceRoot);
    this.configLoader.load();

    this.factory = new AgentFactory({
      model: options.model,
      workspaceRoot: options.workspaceRoot,
      maxTokens: this.configLoader.load().maxTokens,
      temperature: this.configLoader.load().temperature,
    });

    this.reportAggregator = new ReportAggregator(options.model);
    this.debateEngine = new DebateEngine(this.factory);
    this.sopEnforcer = new SOPEnforcer(options.workspaceRoot);
  }

  /**
   * Build the Master Agent's system prompt with full institutional knowledge.
   */
  private getSystemPrompt(): string {
    const knowledge = this.configLoader.getInstitutionalKnowledge();
    return [
      'Bạn là Master Agent (Chánh Văn phòng / Chief of Staff) của VCT Platform Enterprise AI System.',
      'Bạn là đầu mối DUY NHẤT tiếp nhận yêu cầu từ Chủ tịch (User).',
      '',
      'BẠN KHÔNG TRỰC TIẾP THỰC THI tác vụ cụ thể.',
      'Thay vào đó, bạn:',
      '1. ANALYZE — Phân tích yêu cầu.',
      '2. IDENTIFY — Xác định Workflow (WF-xxx) và SOP (SOP-xxx) phù hợp.',
      '3. PLAN — Chia thành kế hoạch ủy quyền chi tiết.',
      '4. DELEGATE — Giao cho đúng agent chuyên trách.',
      '',
      '--- INSTITUTIONAL KNOWLEDGE ---',
      knowledge,
      '',
      '--- ROUTING RULES ---',
      'Departments: strategy-office, marketing-sales, finance-accounting, technology-product, operations-pm, human-resources, legal-compliance, data-intelligence',
      '',
      'QUAN TRỌNG:',
      '- Mỗi task PHẢI chỉ rõ department (folder name) và role (folder name)',
      '- Department và role phải match chính xác với folder names trong _agent/skills/',
      '- Nếu yêu cầu là quyết định lớn (>$50K, >6 tháng impact) → set requires_debate = true',
      '- Trả về delegation plan dưới dạng sequential tasks (có thể parallelizable dựa trên inputs/outputs)',
    ].join('\n');
  }

  /**
   * Step 1: Analyze the user request and create a delegation plan.
   */
  async analyzeRequest(userPrompt: string): Promise<DelegationPlan> {
    this.emit({ type: 'analyzing', message: `Phân tích yêu cầu: "${userPrompt.substring(0, 80)}..."` });

    const { object: plan } = await generateObject({
      model: this.model,
      system: this.getSystemPrompt(),
      prompt: [
        'Phân tích yêu cầu sau và tạo Delegation Plan.',
        '',
        `YÊU CẦU: "${userPrompt}"`,
        '',
        'Trả về plan với các trường đầy đủ. Mỗi step phải có department và role chính xác.',
      ].join('\n'),
      schema: DelegationPlanSchema,
      maxTokens: 4096,
      temperature: 0.2,
    });

    this.emit({ type: 'planned', message: `Plan: ${plan.delegation_plan.length} tasks, WF: ${plan.relevant_workflow || 'N/A'}` });
    return plan;
  }

  /**
   * Step 2: Execute the full orchestration pipeline.
   */
  async orchestrate(userPrompt: string): Promise<OrchestrationResult> {
    // 1. Analyze & Plan
    const plan = await this.analyzeRequest(userPrompt);

    if (this.debug) {
      console.log('[MasterAgent] Full plan:', JSON.stringify(plan, null, 2));
    }

    // 2. Initialize context
    let context = createContext(plan.understanding);
    context = setWorkflowContext(context, plan.relevant_workflow || '', plan.relevant_sops);

    // 3. Check if debate is needed
    if (plan.requires_debate && plan.debate_topic) {
      this.emit({ type: 'debate', message: `Khởi động phản biện: "${plan.debate_topic}"` });
      const debateResult = await this.debateEngine.runDebate({
        topic: plan.debate_topic,
        proposer: { department: plan.delegation_plan[0]?.department || 'strategy-office', role: plan.delegation_plan[0]?.assigned_role || 'ceo' },
        challengers: [
          { department: 'finance-accounting', role: 'cfo', focus: 'ROI & Chi phí' },
        ],
        moderator: { department: 'data-intelligence', role: 'head-of-data' },
        model: this.model,
      });
      context = addResultToContext(context, 'debate-engine', 'cross-department', plan.debate_topic, DebateEngine.formatReport(debateResult), 0);
    }

    // 4. Build dependency graph for parallel execution
    const graph = new DependencyGraph();
    const tasks: DelegationTask[] = plan.delegation_plan.map(t => ({
      stepOrder: t.step_order,
      department: t.department,
      assignedRole: t.assigned_role,
      taskDescription: t.task_description,
      requiredInputs: t.required_inputs,
      expectedOutputs: t.expected_outputs,
      dependsOn: [],
    }));
    graph.addTasks(tasks);
    graph.inferDependencies();
    const batches = graph.computeBatches();

    this.emit({ type: 'executing', message: graph.visualize() });

    // 5. Execute batches
    for (const batch of batches) {
      const isParallel = batch.tasks.length > 1;

      if (isParallel) {
        // Run parallel tasks concurrently
        const promises = batch.tasks.map(async (task) => {
          this.emit({ type: 'delegating', message: `⚡ [Parallel] → ${task.assignedRole}` });
          const agent = this.factory.create(task.department, task.assignedRole);
          return agent.execute(task.taskDescription, context);
        });

        const results = await Promise.all(promises);
        for (const result of results) {
          this.validateAgentOutput(result.output, plan.relevant_sops);
          context = addResultToContext(context, result.role, result.department, result.task, result.output, result.durationMs);
          this.emit({ type: 'completed', message: `✅ ${result.role} (${(result.durationMs / 1000).toFixed(1)}s)` });
        }
      } else {
        // Run sequential task
        const task = batch.tasks[0];
        this.emit({ type: 'delegating', message: `→ ${task.assignedRole}` });
        const agent = this.factory.create(task.department, task.assignedRole);
        const result = await agent.execute(task.taskDescription, context);
        this.validateAgentOutput(result.output, plan.relevant_sops);
        context = addResultToContext(context, result.role, result.department, result.task, result.output, result.durationMs);
        this.emit({ type: 'completed', message: `✅ ${result.role} (${(result.durationMs / 1000).toFixed(1)}s)` });
      }
    }

    // 6. Synthesize executive report
    this.emit({ type: 'synthesizing', message: 'Tổng hợp báo cáo...' });
    const finalReport = await this.reportAggregator.synthesize(context, userPrompt);
    const quickSummary = await this.reportAggregator.quickSummary(context);

    return {
      plan,
      context,
      finalReport,
      quickSummary,
      agentsUsed: Array.from(context.outputs.keys()),
      totalDurationMs: context.history.reduce((sum, h) => sum + h.durationMs, 0),
    };
  }

  /**
   * Dry-run mode: analyze and show plan without executing.
   */
  async dryRun(userPrompt: string): Promise<string> {
    const plan = await this.analyzeRequest(userPrompt);

    const graph = new DependencyGraph();
    const tasks: DelegationTask[] = plan.delegation_plan.map(t => ({
      stepOrder: t.step_order,
      department: t.department,
      assignedRole: t.assigned_role,
      taskDescription: t.task_description,
      requiredInputs: t.required_inputs,
      expectedOutputs: t.expected_outputs,
      dependsOn: [],
    }));
    graph.addTasks(tasks);
    graph.inferDependencies();

    return [
      `📋 DRY RUN — Execution Plan`,
      `Understanding: ${plan.understanding}`,
      `Workflow: ${plan.relevant_workflow || 'N/A'}`,
      `SOPs: ${plan.relevant_sops.join(', ')}`,
      `Debate Required: ${plan.requires_debate ? 'YES' : 'No'}`,
      '',
      graph.visualize(),
    ].join('\n');
  }

  /**
   * Validate agent output against relevant SOPs.
   */
  private validateAgentOutput(output: string, sopIds: string[]): void {
    for (const sopId of sopIds) {
      const result = this.sopEnforcer.validate(output, sopId);
      if (!result.valid) {
        this.emit({ type: 'warning', message: `⚠️ SOP ${sopId} violations: ${result.violations.join(', ')}` });
      }
      for (const warn of result.warnings) {
        this.emit({ type: 'warning', message: `⚠️ ${warn}` });
      }
    }
  }

  /**
   * Emit progress events.
   */
  private emit(event: ProgressEvent): void {
    if (this.onProgress) this.onProgress(event);
    if (this.debug) console.log(`[MasterAgent:${event.type}] ${event.message}`);
  }

  /**
   * Get factory info.
   */
  getAvailableAgents() {
    return this.factory.listAvailable();
  }
}

/**
 * Progress event emitted during orchestration.
 */
export interface ProgressEvent {
  type: 'analyzing' | 'planned' | 'debate' | 'executing' | 'delegating' | 'completed' | 'synthesizing' | 'warning';
  message: string;
}

/**
 * Full result of an orchestration run.
 */
export interface OrchestrationResult {
  plan: DelegationPlan;
  context: AgentContext;
  finalReport: string;
  quickSummary: string;
  agentsUsed: string[];
  totalDurationMs: number;
}
