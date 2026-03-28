const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const SHEET_ID = '1vpapB9lquRvrbfeNRgPAnLjBZCDioUbCA05wosw5pJc';
const SHEETS = ['Setup_COA', 'Setup_Contact', 'Setup_Project', 'Journal_Entries', 'Budget_Plan', 'Recon_Bank'];

async function main() {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '.credentials', 'gcp-service-account.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    let output = '';

    for (const sheetName of SHEETS) {
        output += `\n${'='.repeat(60)}\n`;
        output += `Sheet: ${sheetName}\n`;
        output += '='.repeat(60) + '\n';
        try {
            const res = await sheets.spreadsheets.values.get({
                spreadsheetId: SHEET_ID,
                range: sheetName,
            });
            const rows = res.data.values;
            if (!rows || rows.length === 0) {
                output += '(Trống)\n';
                continue;
            }
            output += `Dòng: ${rows.length}\n\n`;
            rows.forEach((row, i) => {
                output += `  [${i}] ${row.join(' | ')}\n`;
            });
        } catch (e) {
            output += `ERROR: ${e.message.substring(0, 150)}\n`;
        }
    }

    fs.writeFileSync(path.join(__dirname, 'sheets-dump.txt'), output, 'utf8');
    console.log('Done. Output saved to sheets-dump.txt');
}

const timeout = setTimeout(() => { console.error('TIMEOUT'); process.exit(1); }, 30000);
main().then(() => { clearTimeout(timeout); process.exit(0); })
      .catch(e => { clearTimeout(timeout); console.error('FATAL:', e.message); process.exit(1); });
