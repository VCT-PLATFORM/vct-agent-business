import * as fs from 'fs';
import * as path from 'path';

/**
 * AgentMemory — Persistent memory system for each agent.
 *
 * Each agent has:
 * - Personal memory: `_agent/skills/<dept>/<role>/memory/decisions/`
 * - Shared department memory: `_agent/skills/<dept>/_shared_memory/`
 *
 * Memory is stored as Markdown files for human readability and agent consumption.
 */
export class AgentMemory {
  private readonly personalMemoryDir: string;
  private readonly sharedMemoryDir: string;

  constructor(workspaceRoot: string, department: string, role: string) {
    this.personalMemoryDir = path.join(
      workspaceRoot, '_agent', 'skills', department, role, 'memory', 'decisions',
    );
    this.sharedMemoryDir = path.join(
      workspaceRoot, '_agent', 'skills', department, '_shared_memory',
    );
  }

  /**
   * Save a decision/execution record to the agent's personal memory.
   */
  saveDecision(task: string, result: string): void {
    if (!fs.existsSync(this.personalMemoryDir)) {
      fs.mkdirSync(this.personalMemoryDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
    const filePath = path.join(this.personalMemoryDir, `exec_${timestamp}.md`);

    const content = [
      '# Task Execution Record',
      `**Date:** ${new Date().toISOString()}`,
      '',
      '## Task',
      task,
      '',
      '## Result',
      result,
    ].join('\n');

    fs.writeFileSync(filePath, content, 'utf8');
  }

  /**
   * Load the N most recent decision records (sorted by filename = timestamp).
   */
  loadRecentDecisions(count: number = 10): string[] {
    if (!fs.existsSync(this.personalMemoryDir)) return [];

    const files = fs.readdirSync(this.personalMemoryDir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse()
      .slice(0, count);

    return files.map(f => {
      try {
        return fs.readFileSync(path.join(this.personalMemoryDir, f), 'utf8');
      } catch {
        return '';
      }
    }).filter(Boolean);
  }

  /**
   * Load shared department memory (README.md from _shared_memory/).
   */
  loadSharedMemory(): string {
    const readmePath = path.join(this.sharedMemoryDir, 'README.md');
    if (!fs.existsSync(readmePath)) return '';

    try {
      return fs.readFileSync(readmePath, 'utf8');
    } catch {
      return '';
    }
  }

  /**
   * Append to shared department memory.
   */
  appendSharedMemory(entry: string): void {
    if (!fs.existsSync(this.sharedMemoryDir)) {
      fs.mkdirSync(this.sharedMemoryDir, { recursive: true });
    }

    const filePath = path.join(this.sharedMemoryDir, 'shared_log.md');
    const timestamp = new Date().toISOString();
    const formatted = `\n---\n**[${timestamp}]**\n${entry}\n`;

    fs.appendFileSync(filePath, formatted, 'utf8');
  }

  /**
   * Get count of stored memories.
   */
  getMemoryCount(): number {
    if (!fs.existsSync(this.personalMemoryDir)) return 0;
    return fs.readdirSync(this.personalMemoryDir).filter(f => f.endsWith('.md')).length;
  }
}
