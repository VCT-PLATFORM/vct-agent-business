---
description: Quy trình phân tích, lọc rác và soạn thảo trả lời Email hàng ngày cho Chairman
---

# /email-triage — Trợ lý Xử lý Email Hàng Ngày

> **Khi nào dùng**: Sau khi chạy xong lệnh `npm run fetch-emails`, Chairman gõ lệnh này để Jen đọc kết quả.
> **Cách gọi**: `/email-triage` hoặc "Jen vào check email hôm nay đi"

---

## BƯỚC 1: ĐỌC DỮ LIỆU EMAIL (Jen)

1. Đọc nội dung file email mới nhất tại thư mục: `_agent/shared_knowledge/emails/`
2. Quét qua toàn bộ danh sách các email vừa tải về.

---

## BƯỚC 2: PHÂN LOẠI VÀ LỌC RÁC (TRIAGE)

Jen (Chief of Staff) sẽ phân loại email thành 4 nhóm theo tiêu chí:

### Nhóm 1: Rác & Bản tin (Ignore)
- **Đặc điểm**: Newsletter quảng cáo mua tool, mời dự sự kiện không liên quan, spam.
- **Hành động**: Loại bỏ ngay, KHÔNG báo cáo Chairman.

### Nhóm 2: Thông tin hệ thống / Bill (Keep & File)
- **Đặc điểm**: Hóa đơn mua AWS/Vercel/GitHub, thông báo bảo trì server.
- **Hành động**: Tóm tắt lại "Có 1 hóa đơn 500k từ Vercel, tự động ghi nhận vào sổ cái" (Dùng `/finance-entry`).

### Nhóm 3: Khách hàng / Bán hàng (Action Required)
- **Đặc điểm**: Liên đoàn hỏi báo giá, CLB cần demo nền tảng VCT.
- **Hành động**: Báo cáo Chairman + **Kích hoạt Sales Manager** soạn sẵn draft chốt lịch hẹn.

### Nhóm 4: Hợp tác, Pháp lý, Quan trọng (Urgent Action)
- **Đặc điểm**: Gửi hợp đồng cần xem, than phiền từ đối tác lớn, cảnh báo server down.
- **Hành động**: Cảnh báo Chairman ngay lập tức! Kích hoạt **General Counsel** review file đính kèm (nếu có).

---

## BƯỚC 3: BÁO CÁO EXECUTIVE SUMMARY

Trả kết quả cho Chairman theo format cực ngắn gọn:

```markdown
## 📬 BÁO CÁO EMAIL NGÀY [DD/MM]

Jen đã quét **[X]** email mới hôm nay. Có **[Y]** email rác đã bị tự động bỏ qua. Dưới đây là những việc Chairman cần xử lý:

### 🔴 CẦN XỬ LÝ GẤP (Urgent)
1. **[Tên nggười gửi] - [Chủ đề]**: [Tóm tắt 1 câu vấn đề]. 
   👉 *Jen đã nháp sẵn email trả lời:*
   > "Dear [Name], tôi đã nhận được hợp đồng..."

### 🟡 THÔNG TIN (FYI)
2. **[Vercel/GitHub] - Hóa đơn**: Tháng này là $X. Jen đã ghi chú vào Sổ chi phí.

---
Chairman muốn duyệt Draft nào, hoặc có muốn Jen điều phối agent khác xử lý tiếp không ạ?
```
