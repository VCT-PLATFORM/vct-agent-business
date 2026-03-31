/**
 * VCT Platform — Terminal Social Manager (CLI)
 * Option A: Queue Management via Code Interface
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');

const BOARD_DIR = path.join(__dirname, '..', 'shared_knowledge', 'marketing', 'social_board');
const DRAFTS_DIR = path.join(BOARD_DIR, 'drafts');
const APPROVED_DIR = path.join(BOARD_DIR, 'approved');
const REJECTED_DIR = path.join(BOARD_DIR, 'rejected');

[DRAFTS_DIR, APPROVED_DIR, REJECTED_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function drawHeader() {
  console.clear();
  console.log('==============================================');
  console.log('      🚀 VCT SOCIAL MEDIA MANAGER (CLI) 🚀     ');
  console.log('==============================================');
}

function listDrafts() {
  return fs.readdirSync(DRAFTS_DIR).filter(file => file.endsWith('.json'));
}

async function publishPost(configFile) {
  return new Promise((resolve) => {
    console.log(`\n⏳ Publishing post using config: ${configFile}...`);
    const scriptPath = path.join(__dirname, 'publish_post.js');
    const child = spawn('node', [scriptPath, '--config', configFile], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    child.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

function processDrafts() {
  const drafts = listDrafts();
  
  if (drafts.length === 0) {
    drawHeader();
    console.log('✅ Queue is empty. No pending drafts required your attention.');
    console.log('==============================================');
    process.exit(0);
  }

  const currentFile = drafts[0];
  const filePath = path.join(DRAFTS_DIR, currentFile);
  
  let config;
  try {
    config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`❌ Corrupted JSON Draft: ${currentFile}. Moving to rejected.`);
    fs.renameSync(filePath, path.join(REJECTED_DIR, currentFile));
    return processDrafts();
  }

  drawHeader();
  console.log(`\n📂 PENDING DRAFT: ${currentFile}`);
  console.log('----------------------------------------------');
  console.log(`📍 Image Path: ${config.image || '[Text Only]'}`);
  console.log(`\n📝 Caption Preview:\n${config.message}`);
  console.log('----------------------------------------------');
  
  rl.question('Action? [A]pprove & Post, [R]eject, [S]kip, [Q]uit: ', async (answer) => {
    const act = answer.trim().toUpperCase();
    
    if (act === 'A') {
      const approvedPath = path.join(APPROVED_DIR, currentFile);
      fs.renameSync(filePath, approvedPath);
      console.log(`\n✅ Draft Approved. Sending to Facebook...`);
      
      const success = await publishPost(approvedPath);
      if (success) {
        // Move to published or leave as is. For now, it's approved and published.
        rl.question('\nPress ENTER to continue...', () => processDrafts());
      } else {
        console.error('\n❌ Primary error occurred during posting.');
        rl.question('\nPress ENTER to continue...', () => processDrafts());
      }
    } else if (act === 'R') {
      const rejectedPath = path.join(REJECTED_DIR, currentFile);
      fs.renameSync(filePath, rejectedPath);
      console.log(`\n❌ Draft Rejected.`);
      setTimeout(() => processDrafts(), 1000);
    } else if (act === 'S') {
      console.log('\n⏩ Skipping draft...');
      // To skip, just exit loop or rotate queue. Here we just exit for simplicity of this demo.
      rl.close();
    } else if (act === 'Q') {
      console.log('\n👋 Exiting Social Manager.');
      rl.close();
    } else {
      console.log('Invalid input.');
      processDrafts();
    }
  });
}

// Start
processDrafts();
