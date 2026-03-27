---
description: Quy trình ghi nhận và theo dõi thu chi hàng ngày (Sổ cái)
---

# SOP-302: Ghi nhận Thu Chi Hàng Ngày (Sổ cái)

> **Mục đích**: Đảm bảo 100% dòng tiền ra/vào công ty được ghi nhận, có chứng từ, phục vụ việc phân tích tài chính và Báo cáo thuế (Compliance) sau này.
> **Người thực hiện**: Founder/CEO (Giai đoạn 0) → Kế toán (Giai đoạn sau)

---

## 1. QUY TẮC VÀNG (Dành cho Founder)
1. **KHÔNG dùng tài khoản cá nhân thanh toán chi phí công ty.** Luôn chuyển tiền từ cá nhân → Tài khoản DN dạng "Vốn góp" trước, sau đó thanh toán từ TK DN.
2. **"Không chứng từ = Không tồn tại".** Bất kỳ khoản chi nào cũng phải có Hóa đơn VAT, Biên lai, hoặc Email xác nhận.
3. **Chốt sổ Thứ 6 hàng tuần.** Không đợi đến cuối tháng mới vào sổ. 15 phút mỗi tuần cứu 15 tiếng cuối tháng.

---

## 2. QUY TRÌNH GHI NHẬN (Daily/Weekly)

### Bước 1: Khi phát sinh giao dịch (Thu/Chi)
- Chủ động thanh toán/Nhận tiền qua TK Công ty.
- Ngay lập tức: Chụp/Tải chứng từ gốc (Hóa đơn VAT, Invoice, Receipt, Ủy nhiệm chi).

### Bước 2: Lưu trữ chứng từ chuẩn chỉnh
- Upload chứng từ lên Google Drive, folder: `Company/Finance/Receipts/YYYY-MM/`.
- Format tên file thống nhất: `YYYYMMDD_[TenDoiTac]_[NoiDung]_[SoTien].pdf`
  *(Ví dụ: `20260327_Vercel_Hosting_500K.pdf`)*

### Bước 3: Vào "Sổ Cái Kế Toán" (Google Sheets)
Mở Google Sheet tài chính và điền theo cấu trúc sau:
1. **Ngày**: Ngày trên hóa đơn/giao dịch ngân hàng.
2. **Mã GD**: (Tự động tăng) VD: `CH001`, `TH001`.
3. **Loại**: `Thu` hoặc `Chi`.
4. **Hạng mục (Hệ thống Tài khoản Kế toán Đơn giản)**:
   - *Chi phí Hạ tầng (Hosting, Domain)*
   - *Chi phí Phần mềm (SaaS, AI Tools)*
   - *Chi phí Marketing & Sales*
   - *Chi phí R&D/Vendor*
   - *Chi phí Quản lý/Hành chính (Pháp lý, Thuế, Ngân hàng)*
   - *Doanh thu (Khách hàng)*
   - *Vốn Góp (Founder/Investor)*
5. **Nội dung/Mô tả**: Tóm tắt rõ ràng ghi chi/thu cho việc gì.
6. **Đối tác/Nhà cung cấp**: Tên bên nhận/trả tiền.
7. **Số tiền (VND/USD)**: Ghi đúng số cuối cùng thực trả/nhận.
8. **Link Chứng từ**: Dán link Google Drive của file chứng từ ở Bước 2.
9. **Ghi chú**: ...

### Bước 4: Review Cuối Tuần (Weekly Friday)
- Mở App Ngân hàng Doanh nghiệp.
- Đối chiếu số dư cuối trên App = Số dư tính toán trên Sổ Cái.
- Nếu lệch: Phải tìm ra gd bị sót ngay. Lệch 1.000đ cũng phải tìm.

---

## 3. CÁC TRƯỜNG HỢP ĐẶC BIỆT

### 3.1. Trả bằng thẻ tín dụng cá nhân (vì web nước ngoài không chấp nhận thẻ VN)
- **Ghi nhận**: Coi như công ty "Vay" Founder.
- **Cách xử lý**:
  1. Founder thanh toán bằng thẻ cá nhân.
  2. Vào sổ cái: `Ngày X - Loại: Vay Founder - Số tiền Y - Nội dung: Mua Tool Z`.
  3. Khi công ty có tiền (hoặc định kỳ cuối tháng) → Công ty chuyển trả TK cá nhân của Founder.
  4. Vào sổ cái: `Ngày Y - Loại: Trả Nợ Founder - Số tiền Y - Nội dung: Hoàn trả mua Tool Z`.

### 3.2. Không có hóa đơn VAT (Freelancer, chi phí lặt vặt)
- Yêu cầu người nhận ký **"Biên lai nhận tiền"** hoặc chuẩn bị Hợp đồng giao khoán / Hợp đồng dịch vụ. Xin kèm CCCD photo.

---

## 4. BÁO CÁO THÁNG (Monthly)
*Founder dùng trang Dashboard trên Google Sheets để review:*
1. **Total Cash Flow**: Thu trong tháng - Chi trong tháng = Đốt bao nhiêu (Burn Rate)?
2. **Runway**: Số dư hiện tại / Đốt hàng tháng = Công ty sống được mấy tháng nữa?
3. **Hạng mục chi nặng nhất**: Có tối ưu được không?
