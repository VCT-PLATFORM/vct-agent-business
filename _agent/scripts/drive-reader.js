/**
 * Google Drive Reader — VCT Platform AI
 * Cho phép Agent Jen duyệt, đọc, và tải file từ Google Drive của Chairman.
 * 
 * Sử dụng:
 *   node _agent/scripts/drive-reader.js list              → Liệt kê tất cả thư mục/file được chia sẻ
 *   node _agent/scripts/drive-reader.js list <folderId>   → Liệt kê nội dung 1 thư mục cụ thể
 *   node _agent/scripts/drive-reader.js read <fileId>     → Đọc nội dung file (Google Docs/Sheets/Text)
 *   node _agent/scripts/drive-reader.js download <fileId> → Tải file về thư mục local
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, '..', '..', '.credentials', 'gcp-service-account.json');

async function getAuthClient() {
    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
    return auth.getClient();
}

async function listFiles(folderId) {
    const authClient = await getAuthClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    let query = folderId 
        ? `'${folderId}' in parents and trashed = false`
        : `trashed = false`;

    const res = await drive.files.list({
        q: query,
        pageSize: 50,
        fields: 'files(id, name, mimeType, modifiedTime, size)',
        orderBy: 'folder,name',
    });

    const files = res.data.files;
    if (!files || files.length === 0) {
        console.log('📂 Không tìm thấy file/thư mục nào được chia sẻ với Jen.');
        console.log('👉 Hãy Share thư mục Google Drive cho email:');
        console.log('   jen-drive-reader-733@soy-sound-479601-e7.iam.gserviceaccount.com');
        return;
    }

    console.log(`📂 Tìm thấy ${files.length} mục:\n`);
    files.forEach((file, i) => {
        const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
        const icon = isFolder ? '📁' : '📄';
        const size = file.size ? `(${(file.size / 1024).toFixed(1)} KB)` : '';
        console.log(`  ${icon} ${file.name} ${size}`);
        console.log(`     ID: ${file.id} | Loại: ${file.mimeType}`);
        console.log(`     Sửa cuối: ${file.modifiedTime}\n`);
    });
}

async function readFile(fileId) {
    const authClient = await getAuthClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    // Lấy metadata trước để biết loại file
    const meta = await drive.files.get({ fileId, fields: 'name,mimeType' });
    const mimeType = meta.data.mimeType;
    const name = meta.data.name;

    console.log(`📖 Đang đọc file: ${name} (${mimeType})\n`);

    if (mimeType === 'application/vnd.google-apps.document') {
        // Google Docs → Export ra text
        const res = await drive.files.export({ fileId, mimeType: 'text/plain' });
        console.log('--- NỘI DUNG ---');
        console.log(res.data);
    } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
        // Google Sheets → Export ra CSV
        const res = await drive.files.export({ fileId, mimeType: 'text/csv' });
        console.log('--- NỘI DUNG (CSV) ---');
        console.log(res.data);
    } else {
        // File truyền thống (PDF, txt, v.v.) → Đọc trực tiếp
        const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
        res.data.pipe(process.stdout);
    }
}

async function downloadFile(fileId) {
    const authClient = await getAuthClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    const meta = await drive.files.get({ fileId, fields: 'name,mimeType' });
    const name = meta.data.name;
    const mimeType = meta.data.mimeType;

    const downloadDir = path.join(__dirname, '..', 'shared_knowledge', 'drive_downloads');
    if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir, { recursive: true });

    let destPath;
    let fileStream;

    if (mimeType === 'application/vnd.google-apps.document') {
        destPath = path.join(downloadDir, `${name}.pdf`);
        const res = await drive.files.export({ fileId, mimeType: 'application/pdf' }, { responseType: 'stream' });
        fileStream = res.data;
    } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
        destPath = path.join(downloadDir, `${name}.xlsx`);
        const res = await drive.files.export({ fileId, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }, { responseType: 'stream' });
        fileStream = res.data;
    } else {
        destPath = path.join(downloadDir, name);
        const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
        fileStream = res.data;
    }

    const dest = fs.createWriteStream(destPath);
    fileStream.pipe(dest);
    dest.on('finish', () => console.log(`✅ Đã tải về: ${destPath}`));
    dest.on('error', (err) => console.error('❌ Lỗi tải:', err.message));
}

// --- CLI ---
const [,, command, targetId] = process.argv;

switch (command) {
    case 'list':
        listFiles(targetId).catch(e => console.error('❌ LỖI:', e.message));
        break;
    case 'read':
        if (!targetId) { console.error('❗ Cần truyền File ID. Ví dụ: node drive-reader.js read <fileId>'); break; }
        readFile(targetId).catch(e => console.error('❌ LỖI:', e.message));
        break;
    case 'download':
        if (!targetId) { console.error('❗ Cần truyền File ID. Ví dụ: node drive-reader.js download <fileId>'); break; }
        downloadFile(targetId).catch(e => console.error('❌ LỖI:', e.message));
        break;
    default:
        console.log('📚 VCT Drive Reader — Hướng dẫn:');
        console.log('  node drive-reader.js list              → Liệt kê files');
        console.log('  node drive-reader.js list <folderId>   → Liệt kê thư mục');
        console.log('  node drive-reader.js read <fileId>     → Đọc nội dung file');
        console.log('  node drive-reader.js download <fileId> → Tải file về máy');
}
