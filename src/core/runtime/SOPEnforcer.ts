import * as fs from 'fs';
import * as path from 'path';

/**
 * SOPEnforcer — Validates agent outputs against SOP requirements.
 *
 * Each SOP defines required sections, checklists, and output formats.
 * The enforcer loads the relevant SOP and checks if the agent's output
 * contains the required elements.
 */
export class SOPEnforcer {
  private readonly sopDir: string;
  private readonly sopCache = new Map<string, string>();

  constructor(workspaceRoot: string) {
    this.sopDir = path.join(workspaceRoot, '_agent', 'sop');
  }

  /**
   * Load an SOP by its ID (e.g., "SOP-202").
   */
  loadSOP(sopId: string): string | null {
    const cached = this.sopCache.get(sopId);
    if (cached) return cached;

    // SOP ID format: SOP-XYZ → file in XX-category/SOP-XYZ_name.md
    const sopFile = this.findSOPFile(sopId);
    if (!sopFile) return null;

    try {
      const content = fs.readFileSync(sopFile, 'utf8');
      this.sopCache.set(sopId, content);
      return content;
    } catch {
      return null;
    }
  }

  /**
   * Validate an agent's output against a specific SOP.
   * Returns validation results.
   */
  validate(output: string, sopId: string): SOPValidationResult {
    const sop = this.loadSOP(sopId);
    if (!sop) {
      return {
        valid: true,
        sopId,
        violations: [],
        warnings: [`SOP ${sopId} not found — skipping validation.`],
      };
    }

    const violations: string[] = [];
    const warnings: string[] = [];

    // Check for required sections (lines starting with ## in the SOP's output template)
    const requiredSections = this.extractRequiredSections(sop);
    for (const section of requiredSections) {
      if (!output.toLowerCase().includes(section.toLowerCase())) {
        violations.push(`Missing required section: "${section}"`);
      }
    }

    // Check for checklist completeness
    const checklistItems = this.extractChecklistItems(sop);
    if (checklistItems.length > 0) {
      const mentionedCount = checklistItems.filter(
        item => output.toLowerCase().includes(item.toLowerCase()),
      ).length;

      if (mentionedCount < checklistItems.length * 0.5) {
        warnings.push(
          `Only ${mentionedCount}/${checklistItems.length} SOP checklist items addressed.`,
        );
      }
    }

    // Check minimum length (outputs that are too short are likely incomplete)
    if (output.length < 200) {
      warnings.push('Output is very short — may lack sufficient detail for enterprise standard.');
    }

    return {
      valid: violations.length === 0,
      sopId,
      violations,
      warnings,
    };
  }

  /**
   * Find the SOP file by its ID across all category directories.
   */
  private findSOPFile(sopId: string): string | null {
    if (!fs.existsSync(this.sopDir)) return null;

    const categories = fs.readdirSync(this.sopDir, { withFileTypes: true })
      .filter(d => d.isDirectory());

    for (const cat of categories) {
      const catPath = path.join(this.sopDir, cat.name);
      const files = fs.readdirSync(catPath).filter(f => f.startsWith(sopId));
      if (files.length > 0) {
        return path.join(catPath, files[0]);
      }
    }

    return null;
  }

  /**
   * Extract required section headers from an SOP's deliverable template.
   */
  private extractRequiredSections(sopContent: string): string[] {
    const sections: string[] = [];
    const templateSection = sopContent.indexOf('## Deliverable') !== -1
      || sopContent.indexOf('## Output') !== -1;

    if (templateSection) {
      // Look for markdown headers in the template section
      const lines = sopContent.split('\n');
      let inTemplate = false;
      for (const line of lines) {
        if (line.includes('Deliverable') || line.includes('Output Template') || line.includes('Đầu ra')) {
          inTemplate = true;
          continue;
        }
        if (inTemplate && line.startsWith('## ') && !line.includes('Deliverable')) {
          inTemplate = false;
          break;
        }
        if (inTemplate && line.startsWith('### ')) {
          sections.push(line.replace(/^###\s*/, '').trim());
        }
      }
    }

    return sections;
  }

  /**
   * Extract checklist items (lines starting with - [ ]) from SOP.
   */
  private extractChecklistItems(sopContent: string): string[] {
    const items: string[] = [];
    const lines = sopContent.split('\n');

    for (const line of lines) {
      const match = line.match(/^-\s*\[[ x]\]\s*\*\*(.+?)\*\*/);
      if (match) {
        items.push(match[1]);
      }
    }

    return items;
  }
}

/**
 * Result of SOP validation.
 */
export interface SOPValidationResult {
  valid: boolean;
  sopId: string;
  violations: string[];
  warnings: string[];
}
