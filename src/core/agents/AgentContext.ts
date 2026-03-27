/**
 * AgentContext — Shared execution context passed between agents in the orchestration chain.
 *
 * This is the "shared brain" that allows downstream agents to see what upstream agents produced.
 * It's immutable from the perspective of individual agents — only MasterAgent/TaskController modifies it.
 */
export interface AgentContext {
  /** The master objective from the user's original request */
  readonly objective: string;

  /** Map of role → output from completed agents */
  readonly outputs: Map<string, string>;

  /** Shared facts that all agents should know */
  readonly sharedFacts: string[];

  /** Full interaction history log (append-only) */
  readonly history: AgentInteraction[];

  /** The active workflow ID if applicable (e.g., "WF-202") */
  readonly activeWorkflow?: string;

  /** The active SOP IDs being enforced */
  readonly activeSops: string[];
}

/**
 * A single interaction record in the history.
 */
export interface AgentInteraction {
  role: string;
  department: string;
  task: string;
  output: string;
  timestamp: string;
  durationMs: number;
}

/**
 * Create a fresh context for a new orchestration run.
 */
export function createContext(objective: string): AgentContext {
  return {
    objective,
    outputs: new Map(),
    sharedFacts: [],
    history: [],
    activeSops: [],
  };
}

/**
 * Add an agent's result to the context (returns a new context object).
 */
export function addResultToContext(
  ctx: AgentContext,
  role: string,
  department: string,
  task: string,
  output: string,
  durationMs: number,
): AgentContext {
  const newOutputs = new Map(ctx.outputs);
  newOutputs.set(role, output);

  return {
    ...ctx,
    outputs: newOutputs,
    history: [
      ...ctx.history,
      {
        role,
        department,
        task,
        output,
        timestamp: new Date().toISOString(),
        durationMs,
      },
    ],
  };
}

/**
 * Add shared facts to context.
 */
export function addFactsToContext(ctx: AgentContext, facts: string[]): AgentContext {
  return {
    ...ctx,
    sharedFacts: [...ctx.sharedFacts, ...facts],
  };
}

/**
 * Set workflow and SOPs on context.
 */
export function setWorkflowContext(
  ctx: AgentContext,
  workflow: string,
  sops: string[],
): AgentContext {
  return {
    ...ctx,
    activeWorkflow: workflow,
    activeSops: sops,
  };
}
