const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const CREDENTIALS_PATH = path.join(__dirname, '.credentials', 'gcp-service-account.json');
const SPREADSHEET_ID = '1vpapB9lquRvrbfeNRgPAnLjBZCDioUbCA05wosw5pJc';

async function testDriveExport() {
    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
    const client = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: client });

    const destPath = path.join(__dirname, 'test-download.xlsx');
    const dest = fs.createWriteStream(destPath);

    return new Promise((resolve, reject) => {
        drive.files.export({
            fileId: SPREADSHEET_ID,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }, { responseType: 'stream' }, (err, res) => {
            if (err) return reject(err);
            res.data
                .on('end', () => resolve(destPath))
                .on('error', err => reject(err))
                .pipe(dest);
        });
    });
}

testDriveExport().then(console.log).catch(console.error);
