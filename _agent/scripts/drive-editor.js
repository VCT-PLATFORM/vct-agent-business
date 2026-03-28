/**
 * Google Drive Editor — VCT Platform AI
 * Cho phép Agent Jen duyệt, đọc, chỉnh sửa, và quản lý file trên Google Drive của Chairman.
 * 
 * === ĐỌC (Read) ===
 *   node drive-editor.js list              → Liệt kê tất cả file/thư mục được chia sẻ
 *   node drive-editor.js list <folderId>   → Liệt kê nội dung 1 thư mục
 *   node drive-editor.js read <fileId>     → Đọc nội dung file (Google Docs/Sheets/Text)
 *   node drive-editor.js download <fileId> → Tải file về thư mục local
 * 
 * === GHI (Write) ===
 *   node drive-editor.js edit-sheet <spreadsheetId> <range> <valuesJson>
 *       → Ghi/sửa dữ liệu vào Google Sheet
 *       Ví dụ: node drive-editor.js edit-sheet 1abc "Sheet1!A1:B2" '[["Tên","Tuổi"],["Jen","3"]]'
 * 
 *   node drive-editor.js append-sheet <spreadsheetId> <range> <valuesJson>
 *       → Thêm dòng mới vào cuối Sheet
 *       Ví dụ: node drive-editor.js append-sheet 1abc "Sheet1!A:B" '[["Nguyễn A","25"]]'
 * 
 *   node drive-editor.js read-sheet <spreadsheetId> [range]
 *       → Đọc dữ liệu Sheet theo range (mặc định: Sheet1)
 *       Ví dụ: node drive-editor.js read-sheet 1abc "Sheet1!A1:D10"
 * 
 *   node drive-editor.js edit-doc <docId> <action> <content>
 *       → Chỉnh sửa Google Doc
 *       Actions: insert-end, insert-start, replace
 *       Ví dụ: node drive-editor.js edit-doc 1xyz insert-end "Nội dung mới"
 *       Ví dụ: node drive-editor.js edit-doc 1xyz replace '{"find":"cũ","replacement":"mới"}'
 * 
 *   node drive-editor.js create <type> <name> [parentFolderId]
 *       → Tạo file/folder mới trên Drive
 *       Types: spreadsheet, document, folder
 *       Ví dụ: node drive-editor.js create spreadsheet "Budget_Q2_2026"
 * 
 *   node drive-editor.js upload <localPath> [parentFolderId]
 *       → Upload file local lên Drive
 * 
 *   node drive-editor.js rename <fileId> <newName>
 *       → Đổi tên file/folder
 * 
 *   node drive-editor.js move <fileId> <newFolderId>
 *       → Di chuyển file sang thư mục khác
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, '..', '..', '.credentials', 'gcp-service-account.json');

// ─── AUTH ────────────────────────────────────────────────────────────────────

function getAuthClient(scopes) {
    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes,
    });
    return auth.getClient();
}

async function getDrive() {
    const auth = await getAuthClient(['https://www.googleapis.com/auth/drive']);
    return google.drive({ version: 'v3', auth });
}

async function getSheets() {
    const auth = await getAuthClient(['https://www.googleapis.com/auth/spreadsheets']);
    return google.sheets({ version: 'v4', auth });
}

async function getDocs() {
    const auth = await getAuthClient(['https://www.googleapis.com/auth/documents']);
    return google.docs({ version: 'v1', auth });
}

// ─── READ OPERATIONS (giữ nguyên từ drive-reader.js) ─────────────────────────

async function listFiles(folderId) {
    const drive = await getDrive();

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
    files.forEach((file) => {
        const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
        const icon = isFolder ? '📁' : '📄';
        const size = file.size ? `(${(file.size / 1024).toFixed(1)} KB)` : '';
        console.log(`  ${icon} ${file.name} ${size}`);
        console.log(`     ID: ${file.id} | Loại: ${file.mimeType}`);
        console.log(`     Sửa cuối: ${file.modifiedTime}\n`);
    });
}

async function readFile(fileId) {
    const drive = await getDrive();

    const meta = await drive.files.get({ fileId, fields: 'name,mimeType' });
    const mimeType = meta.data.mimeType;
    const name = meta.data.name;

    console.log(`📖 Đang đọc file: ${name} (${mimeType})\n`);

    if (mimeType === 'application/vnd.google-apps.document') {
        const res = await drive.files.export({ fileId, mimeType: 'text/plain' });
        console.log('--- NỘI DUNG ---');
        console.log(res.data);
    } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
        const res = await drive.files.export({ fileId, mimeType: 'text/csv' });
        console.log('--- NỘI DUNG (CSV) ---');
        console.log(res.data);
    } else {
        const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
        res.data.pipe(process.stdout);
    }
}

async function downloadFile(fileId) {
    const drive = await getDrive();

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

// ─── GOOGLE SHEETS OPERATIONS ────────────────────────────────────────────────

async function readSheet(spreadsheetId, range) {
    const sheets = await getSheets();
    const effectiveRange = range || 'Sheet1';

    console.log(`📊 Đang đọc Sheet: ${spreadsheetId} | Range: ${effectiveRange}\n`);

    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: effectiveRange,
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
        console.log('📭 Không có dữ liệu trong range này.');
        return;
    }

    console.log(`--- DỮ LIỆU (${rows.length} dòng) ---`);
    // Print as aligned table
    const colWidths = [];
    rows.forEach(row => {
        row.forEach((cell, i) => {
            const len = String(cell).length;
            colWidths[i] = Math.max(colWidths[i] || 0, len);
        });
    });
    rows.forEach((row, rowIdx) => {
        const line = row.map((cell, i) => String(cell).padEnd(colWidths[i] || 0)).join(' | ');
        console.log(`  ${line}`);
        if (rowIdx === 0) {
            console.log('  ' + colWidths.map(w => '-'.repeat(w)).join('-+-'));
        }
    });
}

async function editSheet(spreadsheetId, range, valuesJson) {
    const sheets = await getSheets();
    let values;
    try {
        values = JSON.parse(valuesJson);
    } catch (e) {
        console.error('❌ Lỗi parse JSON values. Định dạng: \'[["A1","B1"],["A2","B2"]]\'');
        return;
    }

    console.log(`✏️  Đang ghi vào Sheet ${spreadsheetId} | Range: ${range}`);
    console.log(`   Dữ liệu: ${values.length} dòng x ${values[0]?.length || 0} cột\n`);

    const res = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
    });

    console.log(`✅ Đã ghi thành công!`);
    console.log(`   Updated cells: ${res.data.updatedCells}`);
    console.log(`   Updated range: ${res.data.updatedRange}`);
}

async function appendSheet(spreadsheetId, range, valuesJson) {
    const sheets = await getSheets();
    let values;
    try {
        values = JSON.parse(valuesJson);
    } catch (e) {
        console.error('❌ Lỗi parse JSON values. Định dạng: \'[["A1","B1"],["A2","B2"]]\'');
        return;
    }

    console.log(`➕ Đang thêm dòng vào Sheet ${spreadsheetId} | Range: ${range}`);
    console.log(`   Dữ liệu: ${values.length} dòng\n`);

    const res = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values },
    });

    console.log(`✅ Đã thêm thành công!`);
    console.log(`   Updated range: ${res.data.updates?.updatedRange}`);
    console.log(`   Updated rows: ${res.data.updates?.updatedRows}`);
}

async function clearSheet(spreadsheetId, range) {
    const sheets = await getSheets();

    console.log(`🧹 Đang xóa dữ liệu Sheet ${spreadsheetId} | Range: ${range}\n`);

    await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range,
    });

    console.log(`✅ Đã xóa dữ liệu trong range: ${range}`);
}

// ─── GOOGLE DOCS OPERATIONS ─────────────────────────────────────────────────

async function editDoc(docId, action, content) {
    const docs = await getDocs();

    // Lấy document hiện tại để biết endIndex
    const doc = await docs.documents.get({ documentId: docId });
    const docTitle = doc.data.title;
    const body = doc.data.body;
    const endIndex = body.content[body.content.length - 1]?.endIndex || 1;

    console.log(`📝 Đang chỉnh sửa Doc: ${docTitle} (${docId})`);
    console.log(`   Action: ${action}\n`);

    let requests = [];

    switch (action) {
        case 'insert-end':
            requests.push({
                insertText: {
                    location: { index: endIndex - 1 },
                    text: content,
                },
            });
            break;

        case 'insert-start':
            requests.push({
                insertText: {
                    location: { index: 1 },
                    text: content,
                },
            });
            break;

        case 'replace': {
            let replaceData;
            try {
                replaceData = JSON.parse(content);
            } catch (e) {
                console.error('❌ Lỗi parse JSON. Định dạng: \'{"find":"text cũ","replacement":"text mới"}\'');
                return;
            }
            requests.push({
                replaceAllText: {
                    containsText: {
                        text: replaceData.find,
                        matchCase: replaceData.matchCase !== undefined ? replaceData.matchCase : true,
                    },
                    replaceText: replaceData.replacement,
                },
            });
            break;
        }

        default:
            console.error(`❌ Action không hợp lệ: ${action}`);
            console.log('   Các action hỗ trợ: insert-end, insert-start, replace');
            return;
    }

    const res = await docs.documents.batchUpdate({
        documentId: docId,
        requestBody: { requests },
    });

    console.log(`✅ Đã chỉnh sửa Doc thành công!`);
    if (action === 'replace') {
        const replies = res.data.replies;
        const occurrences = replies?.[0]?.replaceAllText?.occurrencesChanged || 0;
        console.log(`   Số lần thay thế: ${occurrences}`);
    }
}

// ─── DRIVE MANAGEMENT OPERATIONS ─────────────────────────────────────────────

async function createFile(type, name, parentFolderId) {
    const drive = await getDrive();

    const mimeTypes = {
        'spreadsheet': 'application/vnd.google-apps.spreadsheet',
        'document': 'application/vnd.google-apps.document',
        'folder': 'application/vnd.google-apps.folder',
    };

    const mimeType = mimeTypes[type];
    if (!mimeType) {
        console.error(`❌ Type không hợp lệ: ${type}`);
        console.log('   Các type hỗ trợ: spreadsheet, document, folder');
        return;
    }

    const icons = { spreadsheet: '📊', document: '📄', folder: '📁' };
    console.log(`${icons[type]} Đang tạo ${type}: "${name}"...`);

    const fileMetadata = {
        name,
        mimeType,
    };
    if (parentFolderId) {
        fileMetadata.parents = [parentFolderId];
    }

    const res = await drive.files.create({
        requestBody: fileMetadata,
        fields: 'id, name, mimeType, webViewLink',
    });

    console.log(`\n✅ Đã tạo thành công!`);
    console.log(`   Tên: ${res.data.name}`);
    console.log(`   ID: ${res.data.id}`);
    console.log(`   Link: ${res.data.webViewLink}`);
}

async function uploadFile(localPath, parentFolderId) {
    const drive = await getDrive();

    if (!fs.existsSync(localPath)) {
        console.error(`❌ File không tồn tại: ${localPath}`);
        return;
    }

    const fileName = path.basename(localPath);
    console.log(`📤 Đang upload file: ${fileName}...`);

    const fileMetadata = { name: fileName };
    if (parentFolderId) {
        fileMetadata.parents = [parentFolderId];
    }

    const media = {
        body: fs.createReadStream(localPath),
    };

    const res = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id, name, webViewLink',
    });

    console.log(`\n✅ Đã upload thành công!`);
    console.log(`   Tên: ${res.data.name}`);
    console.log(`   ID: ${res.data.id}`);
    console.log(`   Link: ${res.data.webViewLink}`);
}

async function renameFile(fileId, newName) {
    const drive = await getDrive();

    const meta = await drive.files.get({ fileId, fields: 'name' });
    const oldName = meta.data.name;

    console.log(`✏️  Đang đổi tên: "${oldName}" → "${newName}"...`);

    await drive.files.update({
        fileId,
        requestBody: { name: newName },
    });

    console.log(`✅ Đã đổi tên thành công!`);
}

async function moveFile(fileId, newFolderId) {
    const drive = await getDrive();

    const meta = await drive.files.get({ fileId, fields: 'name, parents' });
    const name = meta.data.name;
    const previousParents = (meta.data.parents || []).join(',');

    console.log(`📦 Đang di chuyển "${name}" sang thư mục ${newFolderId}...`);

    await drive.files.update({
        fileId,
        addParents: newFolderId,
        removeParents: previousParents,
        fields: 'id, parents',
    });

    console.log(`✅ Đã di chuyển thành công!`);
}

// ─── CLI ROUTER ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

async function main() {
    try {
        switch (command) {
            // === READ ===
            case 'list':
                await listFiles(args[1]);
                break;

            case 'read':
                if (!args[1]) { console.error('❗ Cần File ID. Ví dụ: node drive-editor.js read <fileId>'); break; }
                await readFile(args[1]);
                break;

            case 'download':
                if (!args[1]) { console.error('❗ Cần File ID. Ví dụ: node drive-editor.js download <fileId>'); break; }
                await downloadFile(args[1]);
                break;

            // === SHEETS ===
            case 'read-sheet':
                if (!args[1]) { console.error('❗ Cần Spreadsheet ID'); break; }
                await readSheet(args[1], args[2]);
                break;

            case 'edit-sheet':
                if (!args[1] || !args[2] || !args[3]) {
                    console.error('❗ Cần: <spreadsheetId> <range> <valuesJson>');
                    console.error('   Ví dụ: node drive-editor.js edit-sheet 1abc "Sheet1!A1:B2" \'[["Tên","Tuổi"]]\'');
                    break;
                }
                await editSheet(args[1], args[2], args[3]);
                break;

            case 'append-sheet':
                if (!args[1] || !args[2] || !args[3]) {
                    console.error('❗ Cần: <spreadsheetId> <range> <valuesJson>');
                    console.error('   Ví dụ: node drive-editor.js append-sheet 1abc "Sheet1!A:B" \'[["Dòng mới"]]\'');
                    break;
                }
                await appendSheet(args[1], args[2], args[3]);
                break;

            case 'clear-sheet':
                if (!args[1] || !args[2]) {
                    console.error('❗ Cần: <spreadsheetId> <range>');
                    break;
                }
                await clearSheet(args[1], args[2]);
                break;

            // === DOCS ===
            case 'edit-doc':
                if (!args[1] || !args[2] || !args[3]) {
                    console.error('❗ Cần: <docId> <action> <content>');
                    console.error('   Actions: insert-end, insert-start, replace');
                    console.error('   Ví dụ: node drive-editor.js edit-doc 1xyz insert-end "Nội dung mới"');
                    break;
                }
                await editDoc(args[1], args[2], args[3]);
                break;

            // === DRIVE MANAGEMENT ===
            case 'create':
                if (!args[1] || !args[2]) {
                    console.error('❗ Cần: <type> <name> [parentFolderId]');
                    console.error('   Types: spreadsheet, document, folder');
                    break;
                }
                await createFile(args[1], args[2], args[3]);
                break;

            case 'upload':
                if (!args[1]) {
                    console.error('❗ Cần: <localPath> [parentFolderId]');
                    break;
                }
                await uploadFile(args[1], args[2]);
                break;

            case 'rename':
                if (!args[1] || !args[2]) {
                    console.error('❗ Cần: <fileId> <newName>');
                    break;
                }
                await renameFile(args[1], args[2]);
                break;

            case 'move':
                if (!args[1] || !args[2]) {
                    console.error('❗ Cần: <fileId> <newFolderId>');
                    break;
                }
                await moveFile(args[1], args[2]);
                break;

            // === HELP ===
            default:
                console.log('📚 VCT Drive Editor — Hướng dẫn sử dụng\n');
                console.log('=== ĐỌC (Read) ===');
                console.log('  list [folderId]              → Liệt kê files/thư mục');
                console.log('  read <fileId>                → Đọc nội dung file');
                console.log('  download <fileId>            → Tải file về máy');
                console.log('  read-sheet <sheetId> [range] → Đọc Sheet theo range\n');
                console.log('=== GHI (Write) ===');
                console.log('  edit-sheet <id> <range> <json>   → Ghi/sửa dữ liệu Sheet');
                console.log('  append-sheet <id> <range> <json> → Thêm dòng vào Sheet');
                console.log('  clear-sheet <id> <range>         → Xóa dữ liệu Sheet');
                console.log('  edit-doc <id> <action> <content> → Chỉnh sửa Google Doc\n');
                console.log('=== QUẢN LÝ (Management) ===');
                console.log('  create <type> <name> [parentId]  → Tạo file/folder mới');
                console.log('  upload <localPath> [parentId]    → Upload file lên Drive');
                console.log('  rename <fileId> <newName>        → Đổi tên');
                console.log('  move <fileId> <newFolderId>      → Di chuyển');
        }
    } catch (err) {
        console.error(`\n❌ LỖI: ${err.message}`);
        if (err.code === 403) {
            console.error('💡 Có thể cần bật API hoặc share file với quyền Editor cho Service Account.');
        }
        if (err.code === 404) {
            console.error('💡 File không tồn tại hoặc chưa được share cho Service Account.');
        }
    }
}

main();
