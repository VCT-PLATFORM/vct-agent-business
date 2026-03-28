#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const contextFile = path.resolve(__dirname, '../COMPANY_CONTEXT.md');
const outDir = path.resolve(__dirname, '../knowledge');
const outFile = path.resolve(outDir, 'compressed_context.json');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

if (!fs.existsSync(contextFile)) {
  console.error('File COMPANY_CONTEXT.md không tồn tại.');
  process.exit(1);
}

const content = fs.readFileSync(contextFile, 'utf8');

// The logic here is highly specialized for VCT Platform's COMPANY_CONTEXT.md.
// It searches for markdown headings (##) and compresses bullets/tables underneath them into JSON fields.
const data = {
  vct_context: true,
  last_compressed: new Date().toISOString(),
  sections: {}
};

let currentSection = 'meta';
data.sections[currentSection] = [];

const lines = content.split('\n');
for (const line of lines) {
  const tLine = line.trim();
  if (tLine.length === 0 || tLine.startsWith('>') || tLine.startsWith('---')) continue;
  
  if (tLine.startsWith('## ')) {
    currentSection = tLine.substring(3).replace(/[^\w\s\u00C0-\u1EF9]/g, '').trim();
    data.sections[currentSection] = [];
    continue;
  }
  
  if (tLine.startsWith('### ')) {
    data.sections[currentSection].push({ _subsection: tLine.substring(4).trim() });
    continue;
  }
  
  // Condense table rows / bold tags / lists.
  // We remove unnecessary conversational fillers.
  if (tLine.startsWith('- ') || tLine.startsWith('* ') || tLine.match(/^\d\.\s/)) {
    data.sections[currentSection].push(tLine.replace(/^[-*\d.]\s/, '').replace(/\*\*/g, ''));
  } else if (tLine.startsWith('| ') && !tLine.includes('---')) {
    data.sections[currentSection].push(tLine.replace(/\|\s/g, '').replace(/\s\|/g, ': ').trim());
  }
}

// Write the lightweight JSON
fs.writeFileSync(outFile, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Nén Text thành công! File: ${outFile}`);
