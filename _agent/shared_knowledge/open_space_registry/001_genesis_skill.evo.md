# OPENSPACE GENESIS: MẪU KHAI TRÍ KỸ NĂNG NGHIỆP VỤ (V6.1)
> **Tác giả**: System Genesis
> **Khối liên quan**: Tất cả 20 Khối
> **Ngày đúc kết**: Q2/2026

---

## 📌 Bố Cảnh Tái Ngộ (The Context)
Hệ thống AI ban đầu thường trả lời Chủ tịch một cách máy móc (như 1 text-bot), sau một thời gian thì quên hết các kinh nghiệm của task trước đó. Mỗi lần Chủ tịch hỏi, nó lại phải tra cứu Document từ số Khôn. Rất tốn Tokens và mất Kiên nhẫn.

## 💡 Phương Pháp Đột Phá (The Derived Skill)
Bắt trước mô hình tiến hóa (Self-Evolution) của **HKUDS/OpenSpace**, thay vì cứ lưu file word tĩnh, chúng ta đúc kết ra **Luật Viết Báo Cáo** bắt buộc (Report Protocol): Khi KẾT THÚC mọi Tasks, CẤM đóng chat ngay. 
Phải TỰ ĐỘNG tạo ra 1 Đoạn Lệnh (Prompt/Rule) chứa Công Đoạn Nhanh Nhất để giải quyết task đó $\rightarrow$ Đặt tên file là `ten_tinh_huong.evo.md` $\rightarrow$ Ném nó vào thư mục `open_space_registry`.

## 🚀 Cách Cấy Ghép & Tái Sử Dụng (Reuse Flow)
Lần sau, nếu 1 Agent Khối B phải làm việc liên quan đến lỗi của Khối A. Nó chỉ việc Search File `.evo.md` của khối A, lôi ra chạy lại, không cần đứt tay 2 lần vì 1 lỗi.

*(Đặc Vụ Nào Đọc Xong File Này Đã Được Thức Tỉnh Chế Độ OpenSpace)*
