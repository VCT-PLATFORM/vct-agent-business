import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

/**
 * VCT Platform configuration loaded from .env and static files.
 */
export interface VCTConfig {
  /** AI model identifier (e.g., "gemini-2.0-flash") */
  model: string;
  /** Max tokens per agent response */
  maxTokens: number;
  /** LLM temperature (0.0 - 1.0) */
  temperature: number;
  /** Number of memories to load per agent */
  memoryWindow: number;
  /** Debug mode flag */
  debug: boolean;
  /** Workspace root path */
  workspaceRoot: string;
  /** Company context loaded from COMPANY_CONTEXT.md */
  companyContext: string;
  /** Agents manifest loaded from AGENTS_MANIFEST.md */
  agentsManifest: string;
  /** Workflows index loaded from workflows/README.md */
  workflowsIndex: string;
  /** SOPs index loaded from sop/README.md */
  sopsIndex: string;
  /** Cross-department protocols */
  crossDeptProtocols: string;
}

/**
 * ConfigLoader — Central configuration manager for the VCT Agent system.
 *
 * Loads environment variables and static Markdown documents that form
 * the "institutional knowledge" of the organization.
 */
export class ConfigLoader {
  private config: VCTConfig | null = null;

  constructor(private readonly workspaceRoot: string) {}

  /**
   * Load all configuration. Call once at startup.
   */
  load(): VCTConfig {
    if (this.config) return this.config;

    // Load .env
    config({ path: path.join(this.workspaceRoot, '.env') });

    const readFile = (relativePath: string): string => {
      const fullPath = path.join(this.workspaceRoot, relativePath);
      if (!fs.existsSync(fullPath)) return '';
      try {
        return fs.readFileSync(fullPath, 'utf8');
      } catch {
        return '';
      }
    };

    this.config = {
      model: process.env.VCT_MODEL || 'gemini-2.0-flash',
      maxTokens: parseInt(process.env.VCT_MAX_TOKENS || '4096', 10),
      temperature: parseFloat(process.env.VCT_TEMPERATURE || '0.3'),
      memoryWindow: parseInt(process.env.VCT_MEMORY_WINDOW || '10', 10),
      debug: process.env.VCT_DEBUG === 'true',
      workspaceRoot: this.workspaceRoot,
      companyContext: readFile('_agent/COMPANY_CONTEXT.md'),
      agentsManifest: readFile('_agent/AGENTS_MANIFEST.md'),
      workflowsIndex: readFile('_agent/workflows/README.md'),
      sopsIndex: readFile('_agent/sop/README.md'),
      crossDeptProtocols: readFile('_agent/CROSS_DEPARTMENT_PROTOCOLS.md'),
    };

    return this.config;
  }

  /**
   * Validate that critical configs exist. Returns list of issues.
   */
  validate(): string[] {
    const issues: string[] = [];
    const cfg = this.load();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      issues.push('Missing GOOGLE_GENERATIVE_AI_API_KEY in .env — AI features will not work.');
    }

    if (!cfg.companyContext) {
      issues.push('COMPANY_CONTEXT.md not found — agents lack company knowledge.');
    }

    if (!cfg.agentsManifest) {
      issues.push('AGENTS_MANIFEST.md not found — agent routing will fail.');
    }

    return issues;
  }

  /**
   * Get the full institutional knowledge as a single prompt segment.
   */
  getInstitutionalKnowledge(): string {
    const cfg = this.load();
    return [
      '# VCT Platform — Institutional Knowledge',
      '',
      '## Company Context',
      cfg.companyContext,
      '',
      '## Organization Structure',
      cfg.agentsManifest,
      '',
      '## Available Workflows',
      cfg.workflowsIndex,
      '',
      '## Available SOPs',
      cfg.sopsIndex,
      '',
      '## Cross-Department Protocols',
      cfg.crossDeptProtocols,
    ].join('\n');
  }
}
