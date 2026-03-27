import { generateText } from 'ai';
import type { AgentContext } from '../agents/AgentContext.js';

/**
 * ReportAggregator — Synthesizes multi-agent outputs into executive-grade reports.
 *
 * Takes the accumulated context from an orchestration run and produces
 * a final summary that follows REPORTING_STANDARDS.md quality rules.
 */
export class ReportAggregator {
  private readonly model: Parameters<typeof generateText>[0]['model'];

  constructor(model: Parameters<typeof generateText>[0]['model']) {
    this.model = model;
  }

  /**
   * Generate an executive summary from completed orchestration context.
   */
  async synthesize(context: AgentContext, originalRequest: string): Promise<string> {
    const agentOutputs = Array.from(context.outputs.entries())
      .map(([role, output]) => `### ${role}\n${output}`)
      .join('\n\n---\n\n');

    const { text } = await generateText({
      model: this.model,
      system: [
        'Bạn là Chánh Văn phòng (Chief of Staff) của VCT Platform.',
        'Nhiệm vụ: Tổng hợp kết quả từ các phòng ban thành báo cáo cấp CEO.',
        '',
        'Quy tắc báo cáo:',
        '1. Đúng hạn — Tóm tắt ngắn gọn, không dài dòng.',
        '2. So What? — Mỗi phát hiện phải kèm insight actionable.',
        '3. Action-oriented — Kết thúc bằng "Next Steps" cụ thể.',
        '4. No surprises — Highlight rủi ro ngay đầu báo cáo.',
        '5. Viết bằng tiếng Việt, chuyên nghiệp, đủ chuẩn trình CEO/Board.',
      ].join('\n'),
      prompt: [
        '## Yêu cầu ban đầu của Chủ tịch',
        originalRequest,
        '',
        '## Workflow đã thực thi',
        context.activeWorkflow || 'Không xác định',
        '',
        '## SOPs đã áp dụng',
        context.activeSops.join(', ') || 'Không có',
        '',
        '## Kết quả từ các Phòng ban',
        agentOutputs,
        '',
        '## Yêu cầu Output',
        'Hãy viết BÁO CÁO TỔNG HỢP theo format sau:',
        '',
        '### 📌 TL;DR (1-2 câu)',
        '### 📊 Tóm tắt Kết quả',
        '- Liệt kê key findings từ mỗi phòng ban',
        '### ⚠️ Rủi ro & Cảnh báo',
        '- Bất kỳ red flag nào',
        '### ✅ Next Steps',
        '- Action items cụ thể + Owner + Deadline',
        '### 📈 Metrics Cần Theo dõi',
        '- KPIs relevant',
      ].join('\n'),
      maxTokens: 4096,
      temperature: 0.2,
    });

    return text;
  }

  /**
   * Generate a quick summary (for CLI display).
   */
  async quickSummary(context: AgentContext): Promise<string> {
    const roles = Array.from(context.outputs.keys());
    const totalDuration = context.history.reduce((sum, h) => sum + h.durationMs, 0);

    const header = [
      `📊 Orchestration Complete`,
      `   Agents activated: ${roles.length} (${roles.join(', ')})`,
      `   Total duration: ${(totalDuration / 1000).toFixed(1)}s`,
      `   Workflow: ${context.activeWorkflow || 'N/A'}`,
      `   SOPs enforced: ${context.activeSops.length}`,
    ].join('\n');

    return header;
  }
}
