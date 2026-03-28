---
description: Quy trình tự động đọc, trích xuất dữ liệu từ email hóa đơn (hoadon.vct@gmail.com) và lập bút toán kép.
---

# /invoice-triage — Kế Toán Trưởng Xử Lý Email Hóa Đơn

> **Khi nào dùng**: Sau khi chạy xong lệnh `npm run fetch-emails`, Chairman gõ lệnh này để Accounting Manager tự động đọc file hóa đơn tải về và ghi vào sổ.
> **Vai trò thực hiện**: Kế toán Trưởng (Accounting Manager)
> **Ví dụ gọi lệnh**: `/invoice-triage` hoặc "Kế toán trưởng vào check email hóa đơn đi"

---

## BƯỚC 1: ĐỌC DỮ LIỆU (Accounting Manager)

1. Đọc file Markdown mới nhất có tiền tố `invoice_report_` nằm trong thư mục `_agent/shared_knowledge/emails/`
2. Lọc ra các email có tính chất là Hóa Đơn Mua Vào, Hóa Đơn Điện Tử, Biên lai thanh toán, hoặc Thông báo phí.

---

## BƯỚC 2: TRÍCH XUẤT THÔNG TIN & ĐỊNH KHOẢN (Kế toán kép)

Với mỗi hóa đơn tìm thấy, Kế toán trưởng sẽ phân tích:
- **Tên nhà cung cấp / Đối tác**: Ai phát hành hóa đơn?
- **Nội dung / Diễn giải**: Hóa đơn này mua cái gì? (Chi phí server, mua phần mềm, chi phí marketing, v.v).
- **Tổng tiền**: Bóc tách chính xác số tiền VND. (Nếu là USD thì tạm tính theo tỷ giá 25,500 VND hoặc theo tỷ giá quy định).
- **Định khoản**: 
  - Đưa vào Nợ chi phí tương ứng: Thường là TK `642` (Chi phí QLDN) hoặc `156` (Hàng hóa), v.v.
  - Ghi Có công nợ/tiền: Nếu chưa thanh toán ghi `331` (Phải trả NCC). Nếu đã thanh toán ghi `111` (Tiền mặt) hoặc `1121` (Tiền gửi NH) tuỳ ngữ cảnh trong email.

---

## BƯỚC 3: GHI LÊN GOOGLE SHEET + BÁO CÁO CHAIRMAN

### 3.1 Thêm đối tác mới (nếu cần)
// turbo
Nếu nhà cung cấp chưa có trong hệ thống, thêm trước:
```bash
node _agent/scripts/finance-sync.js add-contact '{"ma":"NCC_XXX","ten":"Tên NCC","phan_loai":"Nhà cung cấp"}'
```

### 3.2 Ghi bút toán tự động lên Google Sheet
// turbo
Với MỖI hóa đơn hợp lệ, chạy lệnh:
```bash
node _agent/scripts/finance-sync.js add-entry '{"ngay":"DD/MM/YYYY","chungtu":"Hóa đơn VAT","dien_giai":"Mô tả","doi_tac":"NCC_XXX","tk_no":"642","tk_co":"1121","so_tien":AMOUNT,"thue":TAX_RATE,"du_an":"PLATFORM"}'
```

### 3.3 Báo cáo cho Chairman

**Format trả lời bắt buộc:**

```markdown
Thưa Chairman, Kế toán trưởng đã quét xong hộp thư `hoadon.vct@gmail.com` và **tự động ghi lên Google Sheet**.

Hôm nay có **[X]** hóa đơn hợp lệ mới:

| ID Giao dịch | Ngày | Diễn Giải | TK Nợ | TK Có | Tổng Tiền | Trạng Thái |
|--------------|------|-----------|-------|-------|-----------|------------|
| VCT-YYMMDD-XXXX | DD/MM/YYYY | Phí server AWS | 642 | 1121 | 1.500.000 ₫ | Hoàn tất |

🔗 [Xem trên Google Sheets](https://docs.google.com/spreadsheets/d/1vpapB9lquRvrbfeNRgPAnLjBZCDioUbCA05wosw5pJc/edit)

*(Lưu ý: Nếu có hóa đơn VAT cần tách thuế, thuế đã được tự động tính và ghi nhận.)*
```

// turbo-all
