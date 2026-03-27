import * as readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import { MasterAgent } from './MasterAgent.js';
import { ConfigLoader } from '../runtime/ConfigLoader.js';
import type { ProgressEvent } from './MasterAgent.js';

// ─── Constants ───────────────────────────────────────────────────────
const VERSION = '1.0.0';
const WORKSPACE_ROOT = process.cwd();

// ─── Parse CLI Arguments ─────────────────────────────────────────────
interface CLIArgs {
  mock: boolean;
  dryRun: boolean;
  debug: boolean;
  department?: string;
  role?: string;
  workflow?: string;
  help: boolean;
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const parsed: CLIArgs = { mock: false, dryRun: false, debug: false, help: false };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--mock': parsed.mock = true; break;
      case '--dry-run': parsed.dryRun = true; break;
      case '--debug': parsed.debug = true; break;
      case '--help': case '-h': parsed.help = true; break;
      case '--department': case '-d': parsed.department = args[++i]; break;
      case '--role': case '-r': parsed.role = args[++i]; break;
      case '--workflow': case '-w': parsed.workflow = args[++i]; break;
    }
  }

  return parsed;
}

// ─── Mock Model ──────────────────────────────────────────────────────
/**
 * Creates a mock model that simulates AI responses for testing without API keys.
 */
function createMockModel() {
  return {
    doGenerate: async (options: any) => {
      const prompt = typeof options?.prompt === 'string'
        ? options.prompt
        : JSON.stringify(options?.prompt || '');

      // Simulate thinking time
      await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

      // Return a realistic mock response
      return {
        text: generateMockResponse(prompt),
        finishReason: 'stop',
        usage: { promptTokens: 500, completionTokens: 300 },
      };
    },
    specificationVersion: 'v1' as const,
    provider: 'mock',
    modelId: 'mock-enterprise-v1',
    defaultObjectGenerationMode: 'json' as const,
  };
}

function generateMockResponse(prompt: string): string {
  return [
    '## 📋 Kết quả Thực thi (Mock Mode)',
    '',
    '### Phân tích',
    `Yêu cầu đã được phân tích và xử lý thành công trong chế độ mock.`,
    '',
    '### Deliverables',
    '1. ✅ Tài liệu phân tích đã hoàn thành',
    '2. ✅ Kế hoạch hành động đã được soạn thảo',
    '3. ✅ Metrics đo lường đã được xác định',
    '',
    '### Next Steps',
    '- Chuyển sang chế độ real (thêm API key vào .env) để nhận kết quả thực tế',
    '',
    '> ⚠️ Đây là dữ liệu giả lập. Chạy lại với API key thật để có kết quả production.',
  ].join('\n');
}

// ─── Create Real Model ───────────────────────────────────────────────
async function createRealModel() {
  const { google } = await import('@ai-sdk/google');
  const configLoader = new ConfigLoader(WORKSPACE_ROOT);
  const cfg = configLoader.load();
  return google(cfg.model);
}

// ─── Progress Event Handler ──────────────────────────────────────────
let currentSpinner: ReturnType<typeof ora> | null = null;

function handleProgress(event: ProgressEvent): void {
  if (currentSpinner) {
    currentSpinner.stop();
    currentSpinner = null;
  }

  const icons: Record<string, string> = {
    analyzing: '🧠',
    planned: '📋',
    debate: '🏛️',
    executing: '⚡',
    delegating: '📨',
    completed: '✅',
    synthesizing: '📊',
    warning: '⚠️',
  };

  const icon = icons[event.type] || '•';

  switch (event.type) {
    case 'analyzing':
    case 'synthesizing':
      currentSpinner = ora({
        text: chalk.cyan(`${icon} ${event.message}`),
        spinner: 'dots12',
      }).start();
      break;

    case 'delegating':
      currentSpinner = ora({
        text: chalk.yellow(`${icon} ${event.message}`),
        spinner: 'dots',
      }).start();
      break;

    case 'completed':
      console.log(chalk.green(`   ${icon} ${event.message}`));
      break;

    case 'planned':
    case 'executing':
      console.log(chalk.blue(`${icon} ${event.message}`));
      break;

    case 'debate':
      console.log(chalk.magenta(`${icon} ${event.message}`));
      break;

    case 'warning':
      console.log(chalk.yellow(`${icon} ${event.message}`));
      break;
  }
}

// ─── Print Banner ────────────────────────────────────────────────────
function printBanner(args: CLIArgs): void {
  console.log('');
  console.log(chalk.bold.cyan('╔══════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║') + chalk.bold.white('  🏢 VCT ENTERPRISE AI — Master Agent Interface     ') + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + chalk.gray(`     v${VERSION} • 35 Agents • 8 Departments • 45 SOPs   `) + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('╚══════════════════════════════════════════════════════╝'));
  console.log('');

  if (args.mock) {
    console.log(chalk.yellow('  ⚠️  MOCK MODE — Không cần API key. Kết quả giả lập.'));
    console.log('');
  }

  console.log(chalk.gray('  Tôi là Chánh Văn phòng AI của bạn. Hãy ra lệnh — tôi sẽ'));
  console.log(chalk.gray('  phân tích, ủy quyền, và tổng hợp kết quả từ đội quân agent.'));
  console.log('');
  console.log(chalk.gray('  Commands:'));
  console.log(chalk.gray('    • Gõ bất kỳ yêu cầu nào bằng ngôn ngữ tự nhiên'));
  console.log(chalk.gray('    • "agents"  — Xem danh sách agent'));
  console.log(chalk.gray('    • "exit"    — Thoát'));
  console.log('');
}

function printHelp(): void {
  console.log(`
${chalk.bold('VCT Enterprise AI — CLI Usage')}

${chalk.bold('Usage:')} npm run dev [options]

${chalk.bold('Options:')}
  --mock              Run with mock model (no API key required)
  --dry-run           Show execution plan without running
  --debug             Enable verbose debug logging
  -d, --department    Target a specific department
  -r, --role          Target a specific agent role
  -w, --workflow      Trigger a specific workflow (e.g., WF-202)
  -h, --help          Show this help message

${chalk.bold('Examples:')}
  npm run dev -- --mock
  npm run dev -- --dry-run
  npm run dev -- --mock --debug
`);
}

// ─── List Agents Command ─────────────────────────────────────────────
function listAgents(agent: MasterAgent): void {
  const agents = agent.getAvailableAgents();
  const byDept = new Map<string, string[]>();

  for (const a of agents) {
    const list = byDept.get(a.department) || [];
    list.push(a.role);
    byDept.set(a.department, list);
  }

  console.log('');
  console.log(chalk.bold.cyan('🏢 Available Agent Army'));
  console.log(chalk.gray('━'.repeat(50)));

  for (const [dept, roles] of byDept) {
    console.log(chalk.bold.white(`\n  📁 ${dept}`));
    for (const role of roles) {
      console.log(chalk.gray(`     👤 ${role}`));
    }
  }

  console.log(chalk.gray(`\n  Total: ${agents.length} agents across ${byDept.size} departments`));
  console.log('');
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  const args = parseArgs();

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  // Validate config
  const configLoader = new ConfigLoader(WORKSPACE_ROOT);
  const issues = configLoader.validate();

  if (!args.mock && issues.some(i => i.includes('API_KEY'))) {
    console.log(chalk.red('\n❌ Lỗi: Thiếu API key.'));
    console.log(chalk.yellow('   Thêm GOOGLE_GENERATIVE_AI_API_KEY vào file .env'));
    console.log(chalk.yellow('   Hoặc chạy với --mock để test không cần API key.\n'));
    process.exit(1);
  }

  // Create model
  let model: any;
  if (args.mock) {
    model = createMockModel();
  } else {
    try {
      model = await createRealModel();
    } catch (err) {
      console.log(chalk.red(`\n❌ Không thể khởi tạo AI model: ${err instanceof Error ? err.message : String(err)}`));
      console.log(chalk.yellow('   Thử chạy với --mock để test.\n'));
      process.exit(1);
    }
  }

  // Create Master Agent
  const masterAgent = new MasterAgent({
    model,
    workspaceRoot: WORKSPACE_ROOT,
    debug: args.debug,
  });

  masterAgent.onProgress = handleProgress;

  printBanner(args);

  // ─── REPL Loop ───────────────────────────────────────────────────
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = () => chalk.bold.green('CEO ▸ ');

  const askQuestion = () => {
    rl.question(prompt(), async (input: string) => {
      const trimmed = input.trim();

      if (!trimmed) {
        askQuestion();
        return;
      }

      if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
        console.log(chalk.gray('\n  👋 Goodbye, Mr. Chairman.\n'));
        rl.close();
        return;
      }

      if (trimmed.toLowerCase() === 'agents') {
        listAgents(masterAgent);
        askQuestion();
        return;
      }

      try {
        if (args.dryRun) {
          // Dry-run mode: only show plan
          const planOutput = await masterAgent.dryRun(trimmed);
          if (currentSpinner) currentSpinner.stop();
          console.log('');
          console.log(chalk.cyan(planOutput));
          console.log('');
        } else {
          // Full execution
          const result = await masterAgent.orchestrate(trimmed);
          if (currentSpinner) currentSpinner.stop();

          console.log('');
          console.log(chalk.gray('━'.repeat(60)));
          console.log(chalk.bold.cyan('\n👔 BÁO CÁO TỔNG HỢP\n'));
          console.log(result.finalReport);
          console.log('');
          console.log(chalk.gray('━'.repeat(60)));
          console.log(chalk.gray(result.quickSummary));
          console.log('');
        }
      } catch (error) {
        if (currentSpinner) currentSpinner.stop();
        console.log(chalk.red(`\n❌ Lỗi: ${error instanceof Error ? error.message : String(error)}`));

        if (args.debug && error instanceof Error) {
          console.log(chalk.gray(error.stack || ''));
        }

        console.log('');
      }

      askQuestion();
    });
  };

  askQuestion();
}

// ─── Entry Point ─────────────────────────────────────────────────────
main().catch((err) => {
  console.error(chalk.red('Fatal error:'), err);
  process.exit(1);
});
