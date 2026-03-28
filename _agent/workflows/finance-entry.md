---
description: Quy trình ghi nhận dòng tiền (Thu/Chi) qua giao tiếp tự nhiên với Jen
---

# /finance-entry — Ghi nhận Dòng Tiền Tự Động

> **Khi nào dùng**: Khi Chairman phát sinh bất kỳ khoản Thu/Chi/Vay/Trả nợ nào và cần ghi vào file Google Sheets Kế toán kép.
> **Cách dùng**: Nhắn cho Jen nội dung tự nhiên. VD: "Jen ơi, chi 500k mua domain vctplatform qua Momo" hoặc "Vừa nhận 10 củ vốn góp của anh A CK vào Vietcombank".

---

## BƯỚC 1: TIẾP NHẬN YÊU CẦU (Jen - Chief of Staff)

1. Phân tích câu nói của Chairman để lấy 4 thông tin cốt lõi:
   - **Mô tả/Nội dung**: (Mua gì? Thu gì?)
   - **Số tiền**: (Bao nhiêu?)
   - **Đối tác**: (Ai trả/Ai nhận?)
   - **Nguồn tiền**: (Tiền mặt, Ngân hàng Vietcombank, Thẻ tín dụng cá nhân, Momo...)
2. Route sang cho **Accounting Manager** xử lý tiếp.

---

## BƯỚC 2: ĐỊNH KHOẢN KẾ TOÁN (Accounting Manager)

Kế toán trưởng tiếp nhận và dựa vào quy tắc Sổ Nhật Ký Chung của VCT Platform để định khoản Bút toán kép.

### Tra cứu dữ liệu thực tế từ Google Sheet:
// turbo
Trước khi định khoản, PHẢI đọc dữ liệu từ Google Sheet Finance để đảm bảo chính xác:
```bash
# Đọc Hệ thống Tài khoản (COA) thực tế
node _agent/scripts/finance-sync.js read-coa

# Đọc danh sách Đối tác thực tế
node _agent/scripts/finance-sync.js read-contacts

# Đọc danh sách Dự án
node _agent/scripts/finance-sync.js read-projects
```

### Logic Định khoản:
1. **Chi phí mua sắm/vận hành (chuyển khoản)**: Nợ 642 / Có 1121
2. **Founder dùng thẻ cá nhân trả hộ (Công ty vay)**: Nợ 642 / Có 411
3. **Nhận vốn góp / Khách hàng trả tiền (chuyển khoản)**: Nợ 1121 / Có 411 (hoặc 5111)
4. **Công ty chuyển khoản trả nợ Founder**: Nợ 411 / Có 1121
5. **Chi phí thuê VP, tên miền trả trước**: Nợ 242 / Có 1121 (hoặc 411)
6. **Chi phí tài chính (phí bank, VNPay)**: Nợ 615 / Có 1121
7. **Chi phí server / vận hành giải đấu**: Nợ 632 / Có 1121

### Xử lý Đối tác mới:
Nếu đối tác chưa có trong Setup_Contact → tạo mới trước:
```bash
node _agent/scripts/finance-sync.js add-contact '{"ma":"NCC_004","ten":"Tên Đối Tác","phan_loai":"Nhà cung cấp","stk":"","mst":""}'
```

---

## BƯỚC 3: GHI LÊN GOOGLE SHEET + BÁO CÁO CHAIRMAN (Jen)

### 3.1 Ghi trực tiếp lên Google Sheet (TỰ ĐỘNG)
// turbo
```bash
node _agent/scripts/finance-sync.js add-entry '{"ngay":"DD/MM/YYYY","chungtu":"Loại chứng từ","dien_giai":"Mô tả","doi_tac":"MÃ_ĐỐI_TÁC","tk_no":"XXX","tk_co":"YYYY","so_tien":AMOUNT,"thue":0,"du_an":"PLATFORM"}'
```

> **QUAN TRỌNG**: Các tham số:
> - `ngay`: DD/MM/YYYY (ngày phát sinh, KHÔNG PHẢI ngày hôm nay nếu Chairman nói rõ ngày khác)
> - `chungtu`: Một trong: "Phiếu chi", "Phiếu thu", "Hóa đơn VAT", "Sao kê NH"
> - `so_tien`: Số VND **TRƯỚC thuế**, KHÔNG format (ví dụ: 500000, KHÔNG phải "500.000")
> - `thue`: Thuế suất số nguyên (0, 5, 8, 10...). Script tự tính tiền thuế.
> - `doi_tac`: Mã đối tác từ Setup_Contact (NCC_001, KH_001, NV_001...)
> - `du_an`: Mã dự án (PLATFORM, MEDIA, ARENA, VODUONG)

### 3.2 Báo cáo kết quả cho Chairman

**Format trả lời bắt buộc:**

```markdown
✅ Đã ghi nhận và cập nhật lên Google Sheet!

| Ngày | Diễn Giải | Đối Tác | TK Nợ | TK Có | Tổng Tiền |
|------|-----------|---------|-------|-------|-----------|
| [DD/MM/YYYY] | [Mô tả chuẩn] | [Mã đối tác] | [Mã TK] | [Mã TK] | [Số VND] |

**Giải thích kế toán:**
- Nợ [Mã TK] ([Tên TK]): [Lý do]
- Có [Mã TK] ([Tên TK]): [Lý do]

📊 ID giao dịch: [VCT-YYMMDD-XXXX]
🔗 [Xem trên Google Sheets](https://docs.google.com/spreadsheets/d/1vpapB9lquRvrbfeNRgPAnLjBZCDioUbCA05wosw5pJc/edit)
```

---

## VÍ DỤ THỰC TẾ

**Chairman**: "Mới chi 2,500,000 mua tài khoản GitHub Copilot 1 năm, cà thẻ tín dụng cá nhân của tôi nhé"

**Jen xử lý:**
1. Phân tích: Chi = 2,500,000 | Mô tả = GitHub Copilot | Nguồn = Thẻ cá nhân CEO → Công ty "vay"
2. Kiểm tra đối tác → GitHub chưa có → Thêm mới
3. Định khoản: Nợ 642 (Chi phí) / Có 411 (Vốn chủ sở hữu - CEO trả hộ)

```bash
# Thêm đối tác mới
node _agent/scripts/finance-sync.js add-contact '{"ma":"NCC_004","ten":"GitHub","phan_loai":"Nhà cung cấp"}'

# Ghi bút toán
node _agent/scripts/finance-sync.js add-entry '{"ngay":"28/03/2026","chungtu":"Phiếu chi","dien_giai":"Chi phí phần mềm - GitHub Copilot Pro 1 năm","doi_tac":"NCC_004","tk_no":"642","tk_co":"411","so_tien":2500000,"thue":0,"du_an":"PLATFORM"}'
```

**Jen trả lời Chairman:**
> ✅ Đã ghi nhận và cập nhật lên Google Sheet!
>
> | Ngày | Diễn Giải | Đối Tác | TK Nợ | TK Có | Tổng Tiền |
> |------|-----------|---------|-------|-------|-----------|
> | 28/03/2026 | Chi phí phần mềm - GitHub Copilot Pro 1 năm | NCC_004 | 642 | 411 | 2.500.000 ₫ |
>
> **Giải thích kế toán:**
> - Nợ 642 (Chi phí quản lý): Ghi nhận chi phí phần mềm cho công ty
> - Có 411 (Vốn chủ sở hữu): CEO dùng thẻ cá nhân trả hộ — tăng vốn CEO bỏ ra
>
> 📊 ID: VCT-260328-A1B2
> 🔗 [Xem trên Google Sheets](https://docs.google.com/spreadsheets/d/1vpapB9lquRvrbfeNRgPAnLjBZCDioUbCA05wosw5pJc/edit)

---

## TIỆN ÍCH BỔ SUNG

### Xem tóm tắt tài chính nhanh:
```bash
node _agent/scripts/finance-sync.js summary
```

### Xem giao dịch gần nhất:
```bash
node _agent/scripts/finance-sync.js read-journal 10
```

// turbo-all
