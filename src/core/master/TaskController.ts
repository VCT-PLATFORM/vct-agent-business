import { AgentFactory } from '../agents/AgentFactory.js';
import type { AgentContext } from '../agents/AgentContext.js';
import type { AgentResult } from '../agents/BaseAgent.js';
import { AgentMemory } from '../agents/AgentMemory.js';

/**
 * TaskController — Routes and manages individual agent task execution.
 *
 * Acts as the intermediary between MasterAgent's delegation plan and
 * the actual agent instances. Handles:
 * - Agent creation via AgentFactory
 * - Context preparation (department memory, skill loading)
 * - Task execution and result collection
 * - Memory persistence
 */
export class TaskController {
  private readonly factory: AgentFactory;
  private readonly workspaceRoot: string;

  constructor(factory: AgentFactory, workspaceRoot: string) {
    this.factory = factory;
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Route a task to a specific agent by department/role.
   * Creates the agent (or retrieves from cache), executes the task,
   * and returns the structured result.
   */
  async routeToAgent(
    department: string,
    role: string,
    taskDescription: string,
    context: AgentContext,
  ): Promise<AgentResult> {
    // Create/retrieve the agent
    const agent = this.factory.create(department, role);

    // Execute the task
    const result = await agent.execute(taskDescription, context);

    // Store in shared department memory
    const sharedMemory = new AgentMemory(this.workspaceRoot, department, role);
    sharedMemory.appendSharedMemory(
      `**${role}** completed: ${taskDescription.substring(0, 100)}...`
    );

    return result;
  }

  /**
   * Route multiple tasks in parallel.
   * All tasks in the batch must be independent (no inter-dependencies).
   */
  async routeParallel(
    tasks: Array<{ department: string; role: string; taskDescription: string }>,
    context: AgentContext,
  ): Promise<AgentResult[]> {
    const promises = tasks.map(task =>
      this.routeToAgent(task.department, task.role, task.taskDescription, context),
    );
    return Promise.all(promises);
  }

  /**
   * Get a summary of available agents in the system.
   */
  getAvailableAgents(): Array<{ department: string; role: string }> {
    return this.factory.listAvailable();
  }

  /**
   * Get the count of currently initialized agents.
   */
  getActiveAgentCount(): number {
    return this.factory.getActiveCount();
  }
}
