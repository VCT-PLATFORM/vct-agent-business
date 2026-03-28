/**
 * Finance Sync — VCT Platform AI
 * Script chuyên dụng để ghi nhận giao dịch tài chính lên Google Sheets "VCT Platform - Finance"
 * Dùng bởi Jen (Chief of Staff) và Accounting Manager khi xử lý /finance-entry.
 *
 * === CÁC LỆNH ===
 *   node finance-sync.js add-entry <json>       → Thêm bút toán kép vào Journal_Entries
 *   node finance-sync.js add-contact <json>      → Thêm đối tác vào Setup_Contact
 *   node finance-sync.js add-project <json>      → Thêm dự án vào Setup_Project
 *   node finance-sync.js read-journal [n]         → Đọc n dòng cuối Journal_Entries (mặc định 10)
 *   node finance-sync.js read-coa                → Đọc Hệ thống TK (Setup_COA)
 *   node finance-sync.js read-contacts            → Đọc danh sách đối tác
 *   node finance-sync.js read-projects            → Đọc danh sách dự án
 *   node finance-sync.js read-bank                → Đọc Recon_Bank
 *   node finance-sync.js update-bank <json>       → Cập nhật số dư ngân hàng
 *   node finance-sync.js summary                  → Tổng hợp tài chính nhanh
 *
 * === JSON FORMAT cho add-entry ===
 * {
 *   "ngay": "28/03/2026",            // Ngày phát sinh (DD/MM/YYYY)
 *   "chungtu": "Phiếu chi",          // Loại: Phiếu chi, Phiếu thu, Hóa đơn VAT, Sao kê NH
 *   "dien_giai": "Mua domain...",     // Mô tả giao dịch
 *   "doi_tac": "NCC_001",            // Mã đối tác từ Setup_Contact
 *   "tk_no": "642",                  // Tài khoản Nợ
 *   "tk_co": "1121",                 // Tài khoản Có
 *   "so_tien": 500000,               // Số tiền trước thuế (VND, không format)
 *   "thue": 0,                       // Thuế suất (0, 5, 8, 10)
 *   "du_an": "PLATFORM",             // Mã dự án từ Setup_Project
 *   "so_chungtu": ""                 // Số chứng từ (optional)
 * }
 */

const { google } = require('googleapis');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const CREDENTIALS_PATH = path.join(__dirname, '..', '..', '.credentials', 'gcp-service-account.json');
const SPREADSHEET_ID = '1vpapB9lquRvrbfeNRgPAnLjBZCDioUbCA05wosw5pJc';

// ─── AUTH ────────────────────────────────────────────────────────────────────

async function getSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const client = await auth.getClient();
    return google.sheets({ version: 'v4', auth: client });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function generateTxId(dateStr) {
    // Format: VCT-YYMMDD-XXXX (match existing pattern)
    const parts = dateStr.split('/');
    const yy = parts[2].slice(-2);
    const mm = parts[1];
    const dd = parts[0];
    const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `VCT-${yy}${mm}${dd}-${suffix}`;
}

function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

function printTable(rows, header) {
    if (!rows || rows.length === 0) {
        console.log('  (Không có dữ liệu)');
        return;
    }
    
    const allRows = header ? [header, ...rows] : rows;
    const colWidths = [];
    
    allRows.forEach(row => {
        row.forEach((cell, i) => {
            const len = String(cell || '').length;
            colWidths[i] = Math.max(colWidths[i] || 0, len, 3);
        });
    });

    allRows.forEach((row, idx) => {
        const line = row.map((cell, i) => String(cell || '').padEnd(colWidths[i] || 3)).join(' │ ');
        console.log(`  ${line}`);
        if (idx === 0 && header) {
            console.log('  ' + colWidths.map(w => '─'.repeat(w)).join('─┼─'));
        }
    });
}

// ─── ADD JOURNAL ENTRY ──────────────────────────────────────────────────────

async function addEntry(jsonStr) {
    let data;
    try {
        data = JSON.parse(jsonStr);
    } catch (e) {
        console.error('❌ JSON không hợp lệ:', e.message);
        console.log('Ví dụ: node finance-sync.js add-entry \'{"ngay":"28/03/2026","chungtu":"Phiếu chi","dien_giai":"Mua domain","doi_tac":"NCC_001","tk_no":"642","tk_co":"1121","so_tien":500000,"thue":0,"du_an":"PLATFORM"}\'');
        return;
    }

    const txId = generateTxId(data.ngay);
    const thueSuat = (data.thue || 0);
    const tienThue = Math.round(data.so_tien * thueSuat / 100);
    const tongTien = data.so_tien + tienThue;

    const row = [
        txId,                                    // ID_GiaoDich
        data.ngay,                               // Ngay_PhatSinh
        data.so_chungtu || '',                   // So_ChungTu
        data.chungtu || 'Phiếu chi',            // Loai_ChungTu
        data.dien_giai,                          // Dien_Giai
        data.doi_tac,                            // Ma_DoiTac
        String(data.tk_no),                      // TK_No
        String(data.tk_co),                      // TK_Co
        formatVND(data.so_tien),                 // GiaTri_TruocThue
        `${thueSuat}%`,                          // Thue_Suat
        formatVND(tienThue),                     // Tien_Thue
        formatVND(tongTien),                     // Tong_Tien
        data.du_an || 'PLATFORM',               // Ma_DuAn
        'Hoàn tất',                              // Trang_Thai
        'Jen AI'                                 // User_Stamp
    ];

    console.log(`✏️  Đang ghi bút toán: ${txId}`);
    console.log(`   ${data.dien_giai}`);
    console.log(`   Nợ ${data.tk_no} / Có ${data.tk_co} = ${formatVND(tongTien)}\n`);

    const sheets = await getSheets();
    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Journal_Entries!A:O',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] },
    });

    console.log(` ✅ Đã ghi thành công lên Google Sheet!`);
    console.log(`    ID: ${txId}`);
    console.log(`    Link: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
    
    await syncLocalExcel();
    return txId;
}

// ─── ADD CONTACT ────────────────────────────────────────────────────────────

async function addContact(jsonStr) {
    let data;
    try {
        data = JSON.parse(jsonStr);
    } catch (e) {
        console.error('❌ JSON không hợp lệ');
        return;
    }

    const row = [
        data.ma,           // Mã_Đối_Tác
        data.ten,          // Tên_Đối_Tác
        data.phan_loai,    // Phân_Loại (Khách hàng / Nhà cung cấp / Nội bộ)
        data.stk || '',    // Số_Tài_Khoản
        data.mst || ''     // MST/Phone
    ];

    const sheets = await getSheets();
    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Setup_Contact!A:E',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] },
    });

    console.log(`✅ Đã thêm đối tác: ${data.ten} (${data.ma})`);
}

// ─── ADD PROJECT ────────────────────────────────────────────────────────────

async function addProject(jsonStr) {
    let data;
    try {
        data = JSON.parse(jsonStr);
    } catch (e) {
        console.error('❌ JSON không hợp lệ');
        return;
    }

    const row = [data.ma, data.ten, data.trang_thai || 'Active'];

    const sheets = await getSheets();
    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Setup_Project!A:C',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] },
    });

    console.log(`✅ Đã thêm dự án: ${data.ten} (${data.ma})`);
}

// ─── READ OPERATIONS ────────────────────────────────────────────────────────

async function readJournal(lastN) {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Journal_Entries',
    });

    const rows = res.data.values;
    if (!rows || rows.length <= 1) {
        console.log('📭 Chưa có giao dịch nào.');
        return;
    }

    const header = rows[0];
    const data = rows.slice(1);
    const n = parseInt(lastN) || 10;
    const display = data.slice(-n);

    console.log(`📊 Journal Entries — ${display.length}/${data.length} giao dịch gần nhất:\n`);

    // Simplified display: ID | Date | Description | Debit | Credit | Amount | Status
    const displayHeader = ['ID_GiaoDich', 'Ngày', 'Diễn Giải', 'TK_Nợ', 'TK_Có', 'Tổng_Tiền', 'Trạng_Thái'];
    const displayRows = display.map(row => [
        row[0] || '', row[1] || '', (row[4] || '').substring(0, 45), 
        row[6] || '', row[7] || '', row[11] || '', row[13] || ''
    ]);

    printTable(displayRows, displayHeader);
}

async function readCOA() {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Setup_COA',
    });

    const rows = res.data.values;
    console.log(`📋 Hệ Thống Tài Khoản (${rows.length - 1} TK):\n`);
    printTable(rows.slice(1), rows[0]);
}

async function readContacts() {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Setup_Contact',
    });

    const rows = res.data.values;
    console.log(`👥 Danh sách Đối tác (${rows.length - 1}):\n`);
    printTable(rows.slice(1), rows[0]);
}

async function readProjects() {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Setup_Project',
    });

    const rows = res.data.values;
    console.log(`📂 Danh sách Dự án (${rows.length - 1}):\n`);
    printTable(rows.slice(1), rows[0]);
}

async function readBank() {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Recon_Bank',
    });

    const rows = res.data.values;
    console.log(`🏦 Đối soát Ngân hàng:\n`);
    printTable(rows.slice(1), rows[0]);
}

// ─── UPDATE BANK RECON ──────────────────────────────────────────────────────

async function updateBank(jsonStr) {
    let data;
    try {
        data = JSON.parse(jsonStr);
    } catch (e) {
        console.error('❌ JSON không hợp lệ. Ví dụ: \'{"ma_tk":"1121","so_du":5000000}\'');
        return;
    }

    const sheets = await getSheets();
    
    // Read current bank data
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Recon_Bank',
    });

    const rows = res.data.values || [];
    let updated = false;
    
    for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] === data.ma_tk) {
            rows[i][2] = formatVND(data.so_du); // Cột C: So_Du_Thuc_Te
            updated = true;
            break;
        }
    }

    if (updated) {
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Recon_Bank',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: rows },
        });
        console.log(`✅ Đã cập nhật số dư TK ${data.ma_tk}: ${formatVND(data.so_du)}`);
    } else {
        console.log(`❌ Không tìm thấy TK ${data.ma_tk} trong Recon_Bank`);
    }
}

// ─── FINANCIAL SUMMARY ──────────────────────────────────────────────────────

async function summary() {
    const sheets = await getSheets();
    
    const [journalRes, bankRes] = await Promise.all([
        sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'Journal_Entries' }),
        sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'Recon_Bank' }),
    ]);

    const journal = journalRes.data.values || [];
    const bank = bankRes.data.values || [];

    // Parse journal entries
    const entries = journal.slice(1);
    let totalChi = 0;
    let totalThu = 0;

    entries.forEach(row => {
        const amount = parseInt(String(row[11] || '0').replace(/[^\d]/g, '')) || 0;
        const tkNo = String(row[6] || '');
        const tkCo = String(row[7] || '');

        // Chi phí: Nợ 6xx
        if (tkNo.startsWith('6') || tkNo.startsWith('8')) {
            totalChi += amount;
        }
        // Thu: Có 5xx hoặc 7xx
        if (tkCo.startsWith('5') || tkCo.startsWith('7')) {
            totalThu += amount;
        }
    });

    console.log(`\n${'═'.repeat(50)}`);
    console.log(`  📊 TÓM TẮT TÀI CHÍNH — VCT Platform`);
    console.log(`${'═'.repeat(50)}\n`);
    console.log(`  📝 Tổng giao dịch:  ${entries.length}`);
    console.log(`  💰 Tổng chi phí:    ${formatVND(totalChi)}`);
    console.log(`  💵 Tổng doanh thu:  ${formatVND(totalThu)}`);
    console.log(`  📈 Lãi/Lỗ ròng:    ${formatVND(totalThu - totalChi)}\n`);

    if (bank.length > 1) {
        console.log(`  🏦 Số dư Ngân hàng:`);
        bank.slice(1).forEach(row => {
            console.log(`     ${row[0]}: ${row[1] || 'N/A'}`);
        });
    }

    console.log(`\n${'═'.repeat(50)}\n`);
}

// ─── LOCAL EXCEL SYNC ────────────────────────────────────────────────────────
async function syncLocalExcel() {
    console.log('\n🔄 Đang đồng bộ Google Sheets về máy tĩnh (Excel)...');
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: CREDENTIALS_PATH,
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });
        const client = await auth.getClient();
        const drive = google.drive({ version: 'v3', auth: client });

        const dirPath = path.join(__dirname, '..', 'shared_knowledge', 'finance');
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
        
        const destPath = path.join(dirPath, 'VCT_Platform_Finance.xlsx');
        const dest = fs.createWriteStream(destPath);

        await new Promise((resolve, reject) => {
            drive.files.export({
                fileId: SPREADSHEET_ID,
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }, { responseType: 'stream' }, (err, res) => {
                if (err) return reject(err);
                res.data
                    .on('end', resolve)
                    .on('error', reject)
                    .pipe(dest);
            });
        });
        console.log(`✅ Đã lưu file Excel tự động tại: ${destPath}\n`);
    } catch (err) {
        console.error('❌ Lỗi tải file Excel:', err.message);
    }
}

// ─── CLI ROUTER ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

const timeout = setTimeout(() => {
    console.error('\n⏰ TIMEOUT sau 20 giây.');
    process.exit(1);
}, 20000);

async function main() {
    try {
        switch (command) {
            case 'add-entry':
                if (!args[1]) { console.error('❗ Cần JSON data'); break; }
                await addEntry(args[1]);
                break;

            case 'add-contact':
                if (!args[1]) { console.error('❗ Cần JSON data'); break; }
                await addContact(args[1]);
                break;

            case 'add-project':
                if (!args[1]) { console.error('❗ Cần JSON data'); break; }
                await addProject(args[1]);
                break;

            case 'read-journal':
                await readJournal(args[1]);
                break;

            case 'read-coa':
                await readCOA();
                break;

            case 'read-contacts':
                await readContacts();
                break;

            case 'read-projects':
                await readProjects();
                break;

            case 'read-bank':
                await readBank();
                break;

            case 'update-bank':
                if (!args[1]) { console.error('❗ Cần JSON data'); break; }
                await updateBank(args[1]);
                break;

            case 'summary':
                await summary();
                break;

            case 'sync-local':
                await syncLocalExcel();
                break;

            default:
                console.log('💰 VCT Finance Sync — Hướng dẫn\n');
                console.log('=== GHI DỮ LIỆU ===');
                console.log('  add-entry <json>      → Thêm bút toán kép vào Journal_Entries');
                console.log('  add-contact <json>    → Thêm đối tác mới');
                console.log('  add-project <json>    → Thêm dự án mới');
                console.log('  update-bank <json>    → Cập nhật số dư ngân hàng\n');
                console.log('=== ĐỌC DỮ LIỆU ===');
                console.log('  read-journal [n]      → Đọc n giao dịch gần nhất');
                console.log('  read-coa              → Đọc Hệ thống Tài khoản');
                console.log('  read-contacts         → Đọc danh sách Đối tác');
                console.log('  read-projects         → Đọc danh sách Dự án');
                console.log('  read-bank             → Đọc Đối soát Ngân hàng');
                console.log('  summary               → Tóm tắt tài chính');
        }
    } catch (err) {
        console.error(`\n❌ LỖI: ${err.message}`);
        if (err.code === 403) {
            console.error('💡 Kiểm tra: File đã share quyền Editor cho Service Account chưa?');
        }
    }
}

main().then(() => { clearTimeout(timeout); process.exit(0); })
      .catch(e => { clearTimeout(timeout); console.error('FATAL:', e.message); process.exit(1); });
