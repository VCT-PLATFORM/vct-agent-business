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

Kế toán trưởng tiếp nhận và dựa vào quy tắc Sổ Nhật Ký Chung của VCT Platform để định khoản Bút toán kép:

### Bảng Hệ Thống Tài Khoản (COA) Thường Dùng:
| Mã TK | Ý nghĩa | Khi Nợ (Tăng/Giảm) | Khi Có (Tăng/Giảm) |
|-------|---------|--------------------|--------------------|
| **111** | Tiền mặt | Thu tiền mặt | Chi tiền mặt |
| **1121**| Tiền gửi Ngân hàng | Khách chuyển khoản vào | Chuyển khoản chi ra |
| **341** | Vay / Vốn góp | Ghi giảm nợ vay | Ghi tăng nợ vay / Vốn |
| **511** | Doanh thu | (Hiếm dùng) | Ghi nhận doanh thu |
| **642** | Chi phí Quản lý / Vận hành | Ghi nhận chi phí | (Hiếm dùng) |

### Logic Định khoản:
1. **Chi phí mua sắm/vận hành (chuyển khoản)**: Nợ 642 / Có 1121
2. **Founder dùng thẻ cá nhân trả hộ (Công ty vay)**: Nợ 642 / Có 341
3. **Nhận vốn góp / Khách hàng trả tiền (chuyển khoản)**: Nợ 1121 / Có 341 (hoặc 511)
4. **Công ty chuyển khoản trả nợ Founder**: Nợ 341 / Có 1121

---

## BƯỚC 3: TRẢ KẾT QUẢ CHO CHAIRMAN (Jen)

Sinh ra 1 bảng kết quả chính xác đúng thứ tự cột của sheet `Journal_Entries` trong file Excel của Chairman để Chairman **chỉ việc Copy và Dán**.

**Format trả lời bắt buộc:**

```markdown
Đã ghi nhận, thưa Chairman! Đây là dữ liệu định khoản Nợ/Có, Chairman chỉ cần Copy dòng trong bảng dưới đây và dán thẳng vào sheet `Journal_Entries`:

| Ngay_PhatSinh | Dien_Giai | Ma_DoiTac | TK_No | TK_Co | Tong_Tien | Trang_Thai |
|---------------|-----------|-----------|-------|-------|-----------|------------|
| [DD/MM/YYYY] | [Mô tả chuẩn] | [Tên NCC/KH] | [Mã số] | [Mã số] | [Số VND] | Hoàn tất |

**Giải thích logic kế toán:**
- Ghi Nợ [Tên TK]: Báo cáo việc tăng [Khoản Mục]
- Ghi Có [Tên TK]: Báo cáo việc giảm [Khoản Mục]
```

---

## VÍ DỤ THỰC TẾ

**Chairman**: "Mới chi 2,500,000 mua tài khoản GitHub Copilot 1 năm, cà thẻ tín dụng cá nhân của tôi nhé"

**Jen (qua Accounting Manager)**:
Đã ghi nhận, thưa Chairman! Khoản này công ty "vay" từ thẻ cá nhân của ngài.
Ngài copy dòng này dán vào sheet `Journal_Entries` nhé:

| Ngay_PhatSinh | Dien_Giai | Ma_DoiTac | TK_No | TK_Co | Tong_Tien | Trang_Thai |
|---------------|-----------|-----------|-------|-------|-----------|------------|
| 27/03/2026 | Chi phí phần mềm - GitHub Copilot 1 năm | GitHub | 642 | 341 | 2500000 | Hoàn tất |

*Giải thích: Nợ 642 (Tăng chi phí doanh nghiệp) / Có 341 (Tăng khoản nợ công ty phải trả cho Chairman).*
