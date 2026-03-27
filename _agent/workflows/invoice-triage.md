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

## BƯỚC 3: TRẢ KẾT QUẢ CHO CHAIRMAN (BẢNG COPY & PASTE)

Kế toán trưởng trả về bảng Markdown chứa sẵn dữ liệu dòng để Chairman **Copy và Dán** trực tiếp vào Sheet `Journal_Entries` trên file Excel `VCT Platform - Finance.xlsx`.

**Format trả lời bắt buộc:**

```markdown
Thưa Chairman, Kế toán trưởng đã quét xong hộp thư `hoadon.vct@gmail.com`.
Hôm nay có **[X]** hóa đơn hợp lệ mới. Ngài vui lòng copy các dòng dưới đây dán vào sheet `Journal_Entries`:

| Ngay_PhatSinh | Dien_Giai | Ma_DoiTac | TK_No | TK_Co | Tong_Tien | Trang_Thai |
|---------------|-----------|-----------|-------|-------|-----------|------------|
| [DD/MM/YYYY] | Phí server AWS | Amazon Web Services | 642 | 1121 | 1500000 | Hoàn tất |
| [DD/MM/YYYY] | Mua phần mềm Misa | Misa | 642 | 331 | 5000000 | Chưa thanh toán |

*(Ghi chú thêm từ Kế toán trưởng: Nếu có hóa đơn nào có VAT cần tách thuế, vui lòng chỉ đạo thêm để tôi lập bút toán Nợ 1331).*
```
