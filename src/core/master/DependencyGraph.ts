/**
 * DependencyGraph — Enables parallel execution of independent agent tasks.
 *
 * Given a delegation plan, builds a DAG (Directed Acyclic Graph) to identify
 * which tasks can run in parallel vs which must run sequentially.
 */

export interface DelegationTask {
  stepOrder: number;
  department: string;
  assignedRole: string;
  taskDescription: string;
  requiredInputs: string[];
  expectedOutputs: string[];
  dependsOn: number[];  // step_order of tasks this depends on
}

interface ExecutionBatch {
  batchIndex: number;
  tasks: DelegationTask[];
}

export class DependencyGraph {
  private readonly tasks: Map<number, DelegationTask> = new Map();

  /**
   * Add tasks to the graph.
   */
  addTasks(tasks: DelegationTask[]): void {
    for (const task of tasks) {
      this.tasks.set(task.stepOrder, task);
    }
  }

  /**
   * Compute execution batches — tasks in the same batch can run in parallel.
   * Returns batches in execution order.
   */
  computeBatches(): ExecutionBatch[] {
    const batches: ExecutionBatch[] = [];
    const completed = new Set<number>();
    const remaining = new Map(this.tasks);

    let batchIndex = 0;
    const maxIterations = this.tasks.size + 1; // Safety limit
    let iteration = 0;

    while (remaining.size > 0 && iteration < maxIterations) {
      iteration++;
      const batch: DelegationTask[] = [];

      for (const [stepOrder, task] of remaining) {
        const depsResolved = task.dependsOn.every(dep => completed.has(dep));
        if (depsResolved) {
          batch.push(task);
        }
      }

      if (batch.length === 0) {
        // Circular dependency detected — force sequential execution
        const first = remaining.values().next().value;
        if (first) batch.push(first);
        else break;
      }

      for (const task of batch) {
        remaining.delete(task.stepOrder);
        completed.add(task.stepOrder);
      }

      batches.push({ batchIndex, tasks: batch });
      batchIndex++;
    }

    return batches;
  }

  /**
   * Infer dependencies from requiredInputs ↔ expectedOutputs matching.
   * Call this after addTasks() to auto-wire dependencies.
   */
  inferDependencies(): void {
    const outputMap = new Map<string, number>(); // output name → step that produces it

    // Build output registry
    for (const [stepOrder, task] of this.tasks) {
      for (const output of task.expectedOutputs) {
        outputMap.set(output.toLowerCase(), stepOrder);
      }
    }

    // Wire dependencies
    for (const [, task] of this.tasks) {
      for (const input of task.requiredInputs) {
        const producerStep = outputMap.get(input.toLowerCase());
        if (producerStep !== undefined && producerStep !== task.stepOrder) {
          if (!task.dependsOn.includes(producerStep)) {
            task.dependsOn.push(producerStep);
          }
        }
      }
    }
  }

  /**
   * Get a visual representation of the execution plan.
   */
  visualize(): string {
    const batches = this.computeBatches();
    const lines: string[] = ['📊 Execution Plan (Parallel Optimization)\n'];

    for (const batch of batches) {
      const isParallel = batch.tasks.length > 1;
      lines.push(`── Batch ${batch.batchIndex + 1} ${isParallel ? '(⚡ PARALLEL)' : '(Sequential)'} ──`);
      for (const task of batch.tasks) {
        const deps = task.dependsOn.length > 0 ? ` ← depends on step ${task.dependsOn.join(', ')}` : '';
        lines.push(`   Step ${task.stepOrder}: [${task.department}/${task.assignedRole}] ${task.taskDescription.substring(0, 60)}...${deps}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }
}
