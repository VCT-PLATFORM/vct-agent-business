import { generateText } from 'ai';
import { AgentFactory } from '../agents/AgentFactory.js';
import type { AgentContext } from '../agents/AgentContext.js';
import { createContext, addResultToContext } from '../agents/AgentContext.js';

/**
 * DebateEngine — Multi-agent debate protocol (mirrors SOP-002).
 *
 * Implements the 6-round Red Team methodology from CROSS_DEPARTMENT_PROTOCOLS.md:
 * 1. PROPOSE   — Proposing department presents their plan
 * 2. CHALLENGE — Challenger department critiques
 * 3. EVIDENCE  — Proposer provides data/evidence
 * 4. COUNTER   — Challenger provides counter-evidence
 * 5. MODERATE  — Neutral moderator (CEO/Data) summarizes both sides
 * 6. DECIDE    — Final decision with rationale
 */

export interface DebateConfig {
  topic: string;
  proposer: { department: string; role: string };
  challengers: Array<{ department: string; role: string; focus: string }>;
  moderator: { department: string; role: string };
  model: Parameters<typeof generateText>[0]['model'];
}

export interface DebateRound {
  round: number;
  phase: string;
  speaker: string;
  content: string;
}

export interface DebateResult {
  topic: string;
  rounds: DebateRound[];
  finalVerdict: string;
  consensusScore: number; // 0-100
}

export class DebateEngine {
  private readonly factory: AgentFactory;

  constructor(factory: AgentFactory) {
    this.factory = factory;
  }

  /**
   * Run a full 6-round debate.
   */
  async runDebate(config: DebateConfig): Promise<DebateResult> {
    const rounds: DebateRound[] = [];
    let context = createContext(`DEBATE: ${config.topic}`);

    // ── Round 1: PROPOSE ──
    const proposerAgent = this.factory.create(config.proposer.department, config.proposer.role);
    const proposal = await proposerAgent.execute(
      `Bạn là bên ĐỀ XUẤT trong cuộc phản biện.\n\n` +
      `CHỦ ĐỀ: ${config.topic}\n\n` +
      `Hãy trình bày đề xuất của bạn một cách chi tiết, bao gồm:\n` +
      `1. Mô tả đề xuất\n2. Lý do tại sao\n3. Lợi ích dự kiến\n4. Kế hoạch thực hiện\n5. Metrics đo lường thành công`,
      context,
    );
    rounds.push({ round: 1, phase: 'PROPOSE', speaker: proposerAgent.getDisplayName(), content: proposal.output });
    context = addResultToContext(context, proposal.role, proposal.department, proposal.task, proposal.output, proposal.durationMs);

    // ── Round 2: CHALLENGE ──
    for (const challenger of config.challengers) {
      const challengerAgent = this.factory.create(challenger.department, challenger.role);
      const challenge = await challengerAgent.execute(
        `Bạn là bên PHẢN BIỆN trong cuộc debate. Góc nhìn chuyên môn: ${challenger.focus}\n\n` +
        `CHỦ ĐỀ: ${config.topic}\n\n` +
        `Đề xuất cần phản biện đã được trình bày ở trên.\n` +
        `Hãy phản biện từ góc nhìn ${challenger.focus}:\n` +
        `1. Điểm yếu / rủi ro trong đề xuất\n2. Chi phí ẩn hoặc trade-offs\n3. Scenarios xấu nhất\n4. Đề xuất cải thiện (nếu có)`,
        context,
      );
      rounds.push({ round: 2, phase: 'CHALLENGE', speaker: challengerAgent.getDisplayName(), content: challenge.output });
      context = addResultToContext(context, challenge.role, challenge.department, challenge.task, challenge.output, challenge.durationMs);
    }

    // ── Round 3: EVIDENCE (Proposer responds) ──
    const evidence = await proposerAgent.execute(
      `Bạn đã nhận được các phản biện từ các phòng ban.\n\n` +
      `Hãy respond bằng EVIDENCE cụ thể:\n` +
      `1. Data/số liệu chứng minh\n2. Case studies tương tự\n3. Giải đáp từng điểm phản biện\n4. Điều chỉnh đề xuất (nếu cần)`,
      context,
    );
    rounds.push({ round: 3, phase: 'EVIDENCE', speaker: proposerAgent.getDisplayName(), content: evidence.output });
    context = addResultToContext(context, evidence.role, evidence.department, evidence.task, evidence.output, evidence.durationMs);

    // ── Round 4: COUNTER (Challengers respond to evidence) ──
    for (const challenger of config.challengers) {
      const challengerAgent = this.factory.create(challenger.department, challenger.role);
      const counter = await challengerAgent.execute(
        `Bên đề xuất đã cung cấp evidence để phản hồi.\n\n` +
        `Hãy đánh giá evidence đó:\n` +
        `1. Evidence nào thuyết phục?\n2. Evidence nào chưa đủ mạnh?\n3. Bạn có thay đổi lập trường không? Tại sao?`,
        context,
      );
      rounds.push({ round: 4, phase: 'COUNTER', speaker: challengerAgent.getDisplayName(), content: counter.output });
      context = addResultToContext(context, counter.role, counter.department, counter.task, counter.output, counter.durationMs);
    }

    // ── Round 5: MODERATE ──
    const moderatorAgent = this.factory.create(config.moderator.department, config.moderator.role);
    const moderation = await moderatorAgent.execute(
      `Bạn là MODERATOR trung lập.\n\n` +
      `Tổng hợp toàn bộ cuộc debate:\n` +
      `1. Tóm tắt quan điểm mỗi bên\n2. Điểm đồng thuận\n3. Điểm bất đồng còn lại\n4. Consensus Score (0-100): bao nhiêu % hai bên đồng ý?\n5. Đề xuất quyết định cuối cùng`,
      context,
    );
    rounds.push({ round: 5, phase: 'MODERATE', speaker: moderatorAgent.getDisplayName(), content: moderation.output });
    context = addResultToContext(context, moderation.role, moderation.department, moderation.task, moderation.output, moderation.durationMs);

    // ── Round 6: DECIDE (CEO/Final Authority) ──
    const ceoAgent = this.factory.create('strategy-office', 'ceo');
    const decision = await ceoAgent.execute(
      `Bạn là CEO — người ra QUYẾT ĐỊNH CUỐI CÙNG.\n\n` +
      `Sau khi xem xét toàn bộ cuộc phản biện, hãy:\n` +
      `1. Quyết định: APPROVE / REJECT / MODIFY\n2. Lý do chính\n3. Điều kiện kèm theo (nếu có)\n4. Action plan tiếp theo\n5. Trigger để reconsider (nếu data thay đổi)`,
      context,
    );
    rounds.push({ round: 6, phase: 'DECIDE', speaker: ceoAgent.getDisplayName(), content: decision.output });

    // Extract consensus score (attempt to parse from moderator output)
    const scoreMatch = moderation.output.match(/(\d{1,3})\s*%/);
    const consensusScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 50;

    return {
      topic: config.topic,
      rounds,
      finalVerdict: decision.output,
      consensusScore: Math.min(100, Math.max(0, consensusScore)),
    };
  }

  /**
   * Format debate result as a readable report.
   */
  static formatReport(result: DebateResult): string {
    const lines = [
      `# 🏛️ Multi-Agent Debate Report`,
      `**Chủ đề:** ${result.topic}`,
      `**Consensus Score:** ${result.consensusScore}%`,
      '',
    ];

    for (const round of result.rounds) {
      lines.push(`## Round ${round.round}: ${round.phase}`);
      lines.push(`**Speaker:** ${round.speaker}`);
      lines.push('');
      lines.push(round.content);
      lines.push('\n---\n');
    }

    lines.push('## 🎯 Final Verdict');
    lines.push(result.finalVerdict);

    return lines.join('\n');
  }
}
