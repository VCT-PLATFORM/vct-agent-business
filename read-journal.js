const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const CREDENTIALS_PATH = path.join(__dirname, '_agent', '..', '.credentials', 'gcp-service-account.json');
const SPREADSHEET_ID = '1vpapB9lquRvrbfeNRgPAnLjBZCDioUbCA05wosw5pJc';

async function main() {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '.credentials', 'gcp-service-account.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const res = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'Journal_Entries' });
    fs.writeFileSync('d:\\journal.json', JSON.stringify(res.data.values, null, 2), 'utf8');
}
main().catch(console.error);
