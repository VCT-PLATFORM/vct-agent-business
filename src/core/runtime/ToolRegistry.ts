/**
 * ToolRegistry — Extensible tool system for agent capabilities.
 *
 * Tools are functions that agents can invoke during execution.
 * The registry manages tool registration, permission, and execution.
 *
 * Current built-in tools:
 * - readFile: Read workspace files
 * - listDirectory: List directory contents
 * - searchContent: Search content in files
 *
 * Future expansion point for: web search, API calls, calculations, etc.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface Tool {
  name: string;
  description: string;
  execute: (params: Record<string, string>) => Promise<string>;
}

/**
 * Permission matrix: which departments/roles can use which tools.
 */
type ToolPermission = {
  allowedDepts: string[] | '*';
  allowedRoles: string[] | '*';
};

export class ToolRegistry {
  private readonly tools = new Map<string, Tool>();
  private readonly permissions = new Map<string, ToolPermission>();
  private readonly workspaceRoot: string;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot;
    this.registerBuiltinTools();
  }

  /**
   * Register a new tool.
   */
  register(tool: Tool, permission?: ToolPermission): void {
    this.tools.set(tool.name, tool);
    if (permission) {
      this.permissions.set(tool.name, permission);
    }
  }

  /**
   * Check if a role has permission to use a tool.
   */
  canUse(toolName: string, department: string, role: string): boolean {
    const perm = this.permissions.get(toolName);
    if (!perm) return true; // No permission defined = open

    const deptOk = perm.allowedDepts === '*' || perm.allowedDepts.includes(department);
    const roleOk = perm.allowedRoles === '*' || perm.allowedRoles.includes(role);

    return deptOk && roleOk;
  }

  /**
   * Execute a tool by name.
   */
  async execute(
    toolName: string,
    params: Record<string, string>,
    department: string,
    role: string,
  ): Promise<string> {
    const tool = this.tools.get(toolName);
    if (!tool) return `[Error] Tool "${toolName}" not found.`;

    if (!this.canUse(toolName, department, role)) {
      return `[Error] ${role} in ${department} does not have permission to use "${toolName}".`;
    }

    try {
      return await tool.execute(params);
    } catch (err) {
      return `[Error] Tool "${toolName}" failed: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  /**
   * List all available tools for a given role.
   */
  listFor(department: string, role: string): string[] {
    const available: string[] = [];
    for (const [name] of this.tools) {
      if (this.canUse(name, department, role)) {
        available.push(name);
      }
    }
    return available;
  }

  /**
   * Register built-in tools.
   */
  private registerBuiltinTools(): void {
    // Tool: Read a file from the workspace
    this.register({
      name: 'readFile',
      description: 'Read the contents of a file in the workspace',
      execute: async (params) => {
        const filePath = path.resolve(this.workspaceRoot, params.path || '');
        if (!fs.existsSync(filePath)) return `[File not found: ${params.path}]`;
        return fs.readFileSync(filePath, 'utf8');
      },
    });

    // Tool: List directory contents
    this.register({
      name: 'listDirectory',
      description: 'List files and folders in a directory',
      execute: async (params) => {
        const dirPath = path.resolve(this.workspaceRoot, params.path || '.');
        if (!fs.existsSync(dirPath)) return `[Directory not found: ${params.path}]`;
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        return entries
          .map(e => `${e.isDirectory() ? '📁' : '📄'} ${e.name}`)
          .join('\n');
      },
    });

    // Tool: Search for text in files
    this.register({
      name: 'searchContent',
      description: 'Search for text content across workspace files',
      execute: async (params) => {
        const query = params.query || '';
        const searchDir = path.resolve(this.workspaceRoot, params.path || '_agent');
        const results: string[] = [];

        const search = (dir: string, depth = 0): void => {
          if (depth > 3 || results.length >= 10) return;
          if (!fs.existsSync(dir)) return;

          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const entry of entries) {
            if (results.length >= 10) break;
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory() && !entry.name.startsWith('.')) {
              search(fullPath, depth + 1);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
              try {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.toLowerCase().includes(query.toLowerCase())) {
                  results.push(`📄 ${path.relative(this.workspaceRoot, fullPath)}`);
                }
              } catch { /* skip unreadable files */ }
            }
          }
        };

        search(searchDir);
        return results.length > 0
          ? `Found "${query}" in:\n${results.join('\n')}`
          : `No results for "${query}"`;
      },
    });
  }
}
