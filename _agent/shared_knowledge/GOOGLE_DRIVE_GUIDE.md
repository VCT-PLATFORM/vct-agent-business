# Google Drive Integration — Hướng dẫn cho AI Agents

> **Mục đích**: Tài liệu hướng dẫn toàn bộ AI Agents cách truy cập, đọc, và chỉnh sửa Google Drive của Chairman.
> **Cập nhật**: 28/03/2026 | **Owner**: Jen (Chief of Staff)

---

## 1. THÔNG TIN KẾT NỐI

| Thông tin | Giá trị |
|-----------|---------|
| **Service Account** | `jen-drive-reader-733@soy-sound-479601-e7.iam.gserviceaccount.com` |
| **GCP Project** | `soy-sound-479601-e7` (VCT Platform AI) |
| **Credentials** | `.credentials/gcp-service-account.json` |
| **Thư mục gốc được share** | `VCT PLATFORM` (ID: `107wlbrXKhtFQaqwGiq3djx44wndqoxVY`) |

### APIs — Kết quả kiểm tra (28/03/2026)

#### ✅ Hoạt động (7 APIs):
| API | Khả năng | Ghi chú |
|-----|----------|---------|
| **Google Drive** | Đọc, ghi, upload, quản lý file/folder | Thư mục `VCT PLATFORM` đã share |
| **Google Sheets** | Đọc + Ghi spreadsheets | File Finance đã kết nối |
| **Google Calendar** | Đọc/tạo lịch | 0 calendars (cần share calendar cho SA) |
| **Google Tasks** | Quản lý task lists | 1 task list có sẵn |
| **Google People (Contacts)** | Đọc danh bạ | 0 contacts hiện tại |
| **Drive Activity** | Theo dõi hoạt động trên Drive | Audit trail |
| **Gmail Postmaster Tools** | Theo dõi domain mail | 0 domains |

#### ⚠️ API đã bật nhưng cần cấu hình thêm:
| API | Trạng thái | Cần làm |
|-----|-----------|---------|
| **Google Docs** | 🔒 403 | SA cần được share file Doc cụ thể với quyền Editor |
| **Google Slides** | 🔒 403 | SA cần được share file Slides cụ thể với quyền Editor |
| **Google Forms** | ❌ Internal Error | Có thể cần tạo Form rồi share cho SA |
| **Apps Script** | ❌ Chưa kích hoạt | Cần vào https://script.google.com/home/usersettings bật |
| **Gmail** | ❌ Cần Delegation | Cần Google Workspace + Domain-Wide Delegation cho SA |
| **Google Chat** | ❌ Cần cấu hình app | Cần tạo Chat App trong GCP Console |
| **Google Meet** | ❌ No permission | Cần Google Workspace |
| **Drive Labels** | ❌ Cần customer | Cần Google Workspace |
| **Cloud Identity** | ❌ Invalid argument | Cần Google Workspace Admin |
| **Alert Center** | ❌ No customer | Cần Google Workspace Admin |
| **Licensing** | ❌ Unauthorized | Cần Google Workspace Reseller |
| **Reseller** | ❌ Unauthorized | Cần Google Workspace Reseller |

> 💡 **Lưu ý**: Nhiều API admin (Chat, Meet, Identity, Alert Center, Licensing) yêu cầu **Google Workspace** (tài khoản doanh nghiệp, không phải Gmail cá nhân). Khi VCT Platform có domain email riêng (ví dụ: @vctplatform.vn), các API này sẽ khả dụng.

---

## 2. BẢN ĐỒ THƯ MỤC GOOGLE DRIVE

```
VCT PLATFORM/  (ID: 107wlbrXKhtFQaqwGiq3djx44wndqoxVY)
│
├── 📁 PHÁP LÝ/  (ID: 1AsSUXq5jeD9A_dg238xJDU0fdhSg0_Qz)
│   ├── 📁 HỒ SƠ THÀNH LẬP CÔNG TY TNHH VCT PLATFORM/
│   │   ├── 📃 Giấy đề nghị ĐKKD.docx
│   │   ├── 📄 Điều lệ công ty.pdf
│   │   ├── 📄 Danh sách chủ sở hữu.pdf
│   │   └── 📄 Đề nghị ĐKDN VCT PLATFORM.pdf
│   ├── 📁 CON DẤU/  (ID: 1MBJ8s-BhAwnXS1-3FJUUXiuLmsx2VfbW)
│   │   ├── 🖼️ Con dấu xóa nền.png
│   │   └── 🖼️ Con dấu.jpg
│   └── 📁 TÊN MIỀN/  (ID: 181fE1uuxNchGUZOYcVL5fmsCcHVeSfmu)
│       └── 📄 4791996-vctplatform.vn.pdf
│
├── 📁 TÀI CHÍNH/  (ID: 13kP4Lw66xbuhxcM-GnlhU9KuRKxsypPp)
│   ├── 📁 THEO DÕI DÒNG TIỀN/  (ID: 1i275dcmcFQ2IwAqxnAk8ZHAnhtW6wUb_)
│   │   ├── 📊 VCT Platform - Finance  ← FILE KẾ TOÁN CHÍNH
│   │   │   ID: 1vpapB9lquRvrbfeNRgPAnLjBZCDioUbCA05wosw5pJc
│   │   │   Link: https://docs.google.com/spreadsheets/d/1vpapB9lquRvrbfeNRgPAnLjBZCDioUbCA05wosw5pJc/edit
│   │   │   Sheets: Setup_COA, Setup_Contact, Setup_Project, Journal_Entries, Budget_Plan, Recon_Bank
│   │   └── 📎 VCT Platform - Tài chính kế toán (Apps Script)
│   └── 📁 HÓA ĐƠN/  (ID: 1ZT_AKE5f6zXYia3pl6hwPbvR6S7-a2fq)
│
├── 📁 QUẢN LÝ TÀI KHOẢN/  (ID: 1QhY1Wg0Ndm4FrHiBHF_og36-WKCEgETl)
│   └── 📊 VCT PLATFORM - TÀI KHOẢN
│       ID: 1Y-UJzSTFpCAyaF7J2PRpl500ZFH55SQIzIXpq6-6fVo
│
├── 📁 THƯƠNG HIỆU/  (ID: 1sR0BUSJo1mUkGi6ocL0SiZs3pbHxgZz1)
│   └── 📁 LOGO/  (ID: 1GVEHsAEtJgB-xfD-QXr-0-7NdFS_JOo4)
│       ├── 📁 BẢN NHÁP/ (12 drafts)
│       ├── 🖼️ logo-vct.png  (ID: 1Kqtf0mmFoUHQrQcX7xf_8H1CERHUIpxT)
│       └── 🖼️ logo-vct-removebg.png  (ID: 1HSjzouBhu1IBiQ4A95J8d7Jf_Sb0awxJ)
│
├── 📁 SẢN PHẨM/  (ID: 1rueXbzhvJ00Fv_XEOmUi4VR-pk76ZvVs)
│   └── 📁 VCT PLATFORM - GAS/
│       └── 📁 UI CORE/ (Apps Script)
│
└── 📁 CLB TÂY SƠN VÕ ĐẠO/  (ID: 1pmNg9MPnV5eOSr3zIhFXwtx4wM4Lseoq)
    └── 📁 Hồ sơ xin thành lập CLB/
        ├── 📃 Đơn xin thành lập.docx
        └── 📄 Đơn xin thành lập.pdf
```

---

## 3. SCRIPTS CÓ SẴN

### 3.1 `drive-editor.js` — Quản lý Tổng quát Google Drive

**Đường dẫn**: `_agent/scripts/drive-editor.js`

#### Đọc (Read)
```bash
# Liệt kê tất cả files
node _agent/scripts/drive-editor.js list

# Liệt kê nội dung 1 thư mục
node _agent/scripts/drive-editor.js list <folderId>

# Đọc nội dung file (Docs → text, Sheets → CSV)
node _agent/scripts/drive-editor.js read <fileId>

# Đọc Google Sheet theo range
node _agent/scripts/drive-editor.js read-sheet <spreadsheetId> [range]

# Tải file về máy local
node _agent/scripts/drive-editor.js download <fileId>
```

#### Ghi (Write)
```bash
# Ghi/sửa dữ liệu Google Sheet
node _agent/scripts/drive-editor.js edit-sheet <spreadsheetId> <range> '<valuesJson>'
# Ví dụ: node _agent/scripts/drive-editor.js edit-sheet 1abc "Sheet1!A1:B2" '[["Tên","Tuổi"],["Jen","3"]]'

# Thêm dòng mới vào Google Sheet
node _agent/scripts/drive-editor.js append-sheet <spreadsheetId> <range> '<valuesJson>'

# Xóa dữ liệu trong range
node _agent/scripts/drive-editor.js clear-sheet <spreadsheetId> <range>

# Chỉnh sửa Google Doc
node _agent/scripts/drive-editor.js edit-doc <docId> <action> <content>
# Actions: insert-end, insert-start, replace
# Ví dụ (thêm cuối): node _agent/scripts/drive-editor.js edit-doc 1xyz insert-end "Nội dung mới"
# Ví dụ (thay thế):   node _agent/scripts/drive-editor.js edit-doc 1xyz replace '{"find":"cũ","replacement":"mới"}'
```

#### Quản lý (Management)
```bash
# Tạo file/folder mới (types: spreadsheet, document, folder)
node _agent/scripts/drive-editor.js create <type> <name> [parentFolderId]

# Upload file local lên Drive
node _agent/scripts/drive-editor.js upload <localPath> [parentFolderId]

# Đổi tên file/folder
node _agent/scripts/drive-editor.js rename <fileId> <newName>

# Di chuyển file sang thư mục khác
node _agent/scripts/drive-editor.js move <fileId> <newFolderId>
```

---

### 3.2 `finance-sync.js` — Kế toán Tài chính (Chuyên dụng)

**Đường dẫn**: `_agent/scripts/finance-sync.js`
**Google Sheet**: `VCT Platform - Finance` (ID: `1vpapB9lquRvrbfeNRgPAnLjBZCDioUbCA05wosw5pJc`)

#### Ghi dữ liệu
```bash
# Thêm bút toán kép vào Journal_Entries
node _agent/scripts/finance-sync.js add-entry '<json>'
# JSON format:
# {
#   "ngay": "DD/MM/YYYY",        ← Ngày phát sinh
#   "chungtu": "Phiếu chi",      ← Loại: Phiếu chi / Phiếu thu / Hóa đơn VAT / Sao kê NH
#   "dien_giai": "Mô tả",        ← Diễn giải giao dịch
#   "doi_tac": "NCC_001",        ← Mã đối tác từ Setup_Contact
#   "tk_no": "642",              ← Tài khoản Nợ
#   "tk_co": "1121",             ← Tài khoản Có
#   "so_tien": 500000,           ← Số tiền trước thuế (VND, KHÔNG format)
#   "thue": 0,                   ← Thuế suất (0, 5, 8, 10...)
#   "du_an": "PLATFORM"          ← Mã dự án (PLATFORM / MEDIA / ARENA / VODUONG)
# }

# Thêm đối tác mới
node _agent/scripts/finance-sync.js add-contact '{"ma":"NCC_004","ten":"Tên","phan_loai":"Nhà cung cấp","stk":"","mst":""}'

# Thêm dự án mới
node _agent/scripts/finance-sync.js add-project '{"ma":"NEW","ten":"Tên Dự án","trang_thai":"Active"}'

# Cập nhật số dư ngân hàng
node _agent/scripts/finance-sync.js update-bank '{"ma_tk":"1121","so_du":5000000}'
```

#### Đọc dữ liệu
```bash
node _agent/scripts/finance-sync.js read-journal [n]    # n giao dịch gần nhất (default 10)
node _agent/scripts/finance-sync.js read-coa            # Hệ thống Tài khoản
node _agent/scripts/finance-sync.js read-contacts       # Danh sách Đối tác
node _agent/scripts/finance-sync.js read-projects       # Danh sách Dự án
node _agent/scripts/finance-sync.js read-bank           # Đối soát Ngân hàng
node _agent/scripts/finance-sync.js summary             # Tóm tắt tài chính
```

---

## 4. HƯỚNG DẪN THEO VAI TRÒ

### 🧑‍💼 Accounting Manager / CFO
- Dùng `finance-sync.js` cho mọi tác vụ kế toán
- PHẢI đọc `read-coa` + `read-contacts` trước khi ghi bút toán để đảm bảo mã TK và mã đối tác chính xác
- Tham khảo workflow: `/finance-entry`, `/invoice-triage`

### 📢 CMO / Marketing Manager
- Dùng `drive-editor.js` để:
  - Tải logo từ `THƯƠNG HIỆU/LOGO/` (`download <fileId>`)
  - Upload assets mới lên Drive (`upload <path> <folderId>`)
  - Tạo Google Docs cho content briefs

### ⚖️ General Counsel / Legal
- Đọc hồ sơ pháp lý từ `PHÁP LÝ/`:
  - `read <fileId>` cho Docs
  - `download <fileId>` cho PDF
- KHÔNG được phép chỉnh sửa hồ sơ pháp lý mà không có Chairman approve

### 🖥️ CTO / Tech Lead
- Upload technical docs lên `SẢN PHẨM/`
- Đọc Apps Script từ `VCT PLATFORM - GAS/`

---

## 5. QUY TẮC SỬ DỤNG (QUAN TRỌNG)

### ✅ AI Agent ĐƯỢC PHÉP:
1. **Đọc** mọi file trên Drive đã được share
2. **Ghi** vào Google Sheet `VCT Platform - Finance` (giao dịch tài chính)
3. **Upload** file do agent tạo ra (báo cáo, assets...) vào thư mục phù hợp
4. **Tạo** file/folder mới trong thư mục `VCT PLATFORM`

### ⚠️ AI Agent CẦN CHAIRMAN APPROVE:
1. **Xóa** bất kỳ file nào trên Drive
2. **Sửa** hồ sơ pháp lý (thư mục `PHÁP LÝ`)
3. **Di chuyển** file giữa các thư mục gốc
4. **Sửa** Google Sheet `VCT PLATFORM - TÀI KHOẢN` (thông tin tài khoản ngân hàng)

### 🚫 AI Agent KHÔNG BAO GIỜ ĐƯỢC:
1. Share file Drive với bên ngoài
2. Xóa hồ sơ pháp lý hoặc tài chính
3. Thay đổi quyền truy cập (permissions) của file
4. Tải xuống hoặc sao chép credentials

---

## 6. TROUBLESHOOTING

| Lỗi | Nguyên nhân | Cách xử lý |
|-----|-------------|-------------|
| `403 Forbidden` | File chưa được share cho SA | Chairman share file cho email SA với quyền Editor |
| `404 Not Found` | File ID sai hoặc file đã bị xóa | Kiểm tra lại ID qua `list` |
| `API not enabled` | API chưa bật trên GCP | Bật API tại [GCP Console](https://console.cloud.google.com/apis/library?project=soy-sound-479601-e7) |
| `TIMEOUT` | Mạng chậm hoặc API quá tải | Thử lại sau 30 giây |
| `Invalid JSON` | Sai format JSON cho values | Kiểm tra escape quotes, dùng single quote bọc ngoài |

---

> 📝 **Cập nhật file này** khi Chairman share thêm file/folder mới hoặc khi bật thêm Google API.
> Mọi thay đổi về Drive structure cần được đồng bộ lại vào mục 2 (Bản đồ Thư mục).
