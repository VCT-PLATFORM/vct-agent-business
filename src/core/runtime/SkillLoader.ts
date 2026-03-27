import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import type { AgentSkillMeta } from '../agents/BaseAgent.js';

/**
 * SkillLoader — Parses SKILL.md files into system prompts and metadata.
 *
 * Each agent's SKILL.md uses YAML frontmatter for metadata and Markdown for the full
 * persona/expertise definition. This loader extracts both to build the agent's identity.
 */
export class SkillLoader {
  private readonly skillsDir: string;
  private readonly cache = new Map<string, { meta: AgentSkillMeta; systemPrompt: string }>();

  constructor(workspaceRoot: string) {
    this.skillsDir = path.join(workspaceRoot, '_agent', 'skills');
  }

  /**
   * Load and parse a SKILL.md for a specific department/role.
   * Results are cached to avoid re-reading the filesystem.
   */
  load(department: string, role: string): { meta: AgentSkillMeta; systemPrompt: string } {
    const cacheKey = `${department}/${role}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const skillPath = path.join(this.skillsDir, department, role, 'SKILL.md');

    if (!fs.existsSync(skillPath)) {
      // Fallback: generate a basic system prompt
      const fallback = {
        meta: {
          name: role,
          description: `Senior ${role} in ${department} department`,
          role: 'Specialist' as const,
          seniority: '10+ years',
          locale: 'vi-VN',
        },
        systemPrompt: this.buildFallbackPrompt(department, role),
      };
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    const raw = fs.readFileSync(skillPath, 'utf8');
    const { data, content } = matter(raw);

    const meta: AgentSkillMeta = {
      name: data.name || role,
      description: data.description || '',
      role: data.metadata?.role || 'Specialist',
      seniority: data.metadata?.seniority || '10+ years',
      locale: data.metadata?.locale || 'vi-VN',
    };

    const systemPrompt = this.buildSystemPrompt(meta, content);

    const result = { meta, systemPrompt };
    this.cache.set(cacheKey, result);
    return result;
  }

  /**
   * Build a full system prompt from parsed SKILL.md content.
   */
  private buildSystemPrompt(meta: AgentSkillMeta, skillContent: string): string {
    return [
      `You are the ${meta.name} at VCT Platform — an enterprise AI organization.`,
      `Role Level: ${meta.role} | Experience: ${meta.seniority} | Locale: ${meta.locale}`,
      '',
      '--- SKILL DEFINITION ---',
      skillContent.trim(),
      '',
      '--- OPERATING RULES ---',
      '1. Always respond in Vietnamese unless the content specifically requires English.',
      '2. Every output must be ACTIONABLE — ready to use without further processing.',
      '3. Every claim must be JUSTIFIED with reasoning or data.',
      '4. Format output professionally — suitable for CEO/Board presentation.',
      '5. If you lack information, state explicitly what you need rather than guessing.',
      '6. Reference relevant SOPs or workflows when applicable.',
    ].join('\n');
  }

  /**
   * Fallback system prompt when SKILL.md doesn't exist.
   */
  private buildFallbackPrompt(department: string, role: string): string {
    return [
      `You are a senior ${role} in the ${department} department at VCT Platform.`,
      'You have 10+ years of professional experience in your domain.',
      'Respond in Vietnamese. Be professional, actionable, and data-driven.',
      'Format all outputs to be presentation-ready for executive review.',
    ].join('\n');
  }

  /**
   * List all available skills (departments and roles).
   */
  listAvailable(): Array<{ department: string; role: string }> {
    const results: Array<{ department: string; role: string }> = [];

    if (!fs.existsSync(this.skillsDir)) return results;

    const departments = fs.readdirSync(this.skillsDir, { withFileTypes: true })
      .filter(d => d.isDirectory());

    for (const dept of departments) {
      const roles = fs.readdirSync(path.join(this.skillsDir, dept.name), { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith('_'));

      for (const role of roles) {
        const skillPath = path.join(this.skillsDir, dept.name, role.name, 'SKILL.md');
        if (fs.existsSync(skillPath)) {
          results.push({ department: dept.name, role: role.name });
        }
      }
    }

    return results;
  }
}
