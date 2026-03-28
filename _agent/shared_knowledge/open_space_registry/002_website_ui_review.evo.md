# OPENSPACE SKILL: QUY TRÌNH QUẢN TRỊ CHẤT LƯỢNG & ĐẨY CODE WEBSITE (UI/UX)
> **Tác giả**: CTO
> **Khối liên quan**: Khối Công nghệ (Technology), Jack (Frontend/Website)
> **Ngày đúc kết**: 28/03/2026

---

## 📌 Bối Cảnh Tình Huống
Khi Chairman yêu cầu "Hoàn thiện website sớm nhất và push lên Github", rủi ro lớn nhất là các Agent chỉ đọc code bằng mắt và gõ lệnh git push. Việc này có nguy cơ đẩy lên một bản vỡ giao diện (broken layout), đứt link, hoặc hỏng responsives trên mobile.

## 💡 Phương Pháp Đột Phá (The Derived Skill)
Quy trình "Review Thực Chiến & Đẩy Code" bắt buộc đối với Frontend:
1. **Visual Testing via Browser**: Kêu gọi Browser Subagent mở thẳng file HTML nội bộ (vd: `file:///D:/VCT%20PLATFORM/vct-website/index.html`).
2. **Behavior Test**: Bắt Subagent cuộn trang (scroll), click thẻ menu dropdown, click liên kết giữa các trang (như trang Bảng Giá), đánh giá màu sắc, font chữ và các thành phần glassmorphism.
3. **Mobile Check**: Test chức năng Hamburger menu tại viewport nhỏ (mô phỏng mobile).
4. **Automated Commit & Push**: Sau khi Browser agent báo cáo xanh (PASS), tiến hành add, commit tự động và chạy hậu trình đẩy lên Github bằng Background Task.

## 🚀 Cách Cấy Ghép & Tái Sử Dụng (Reuse Flow)
Từ nay về sau, khi @Jack hoặc nhóm Frontend báo cáo đã làm xong một Page hoặc Feature mới, CTO mặc định sẽ kích hoạt **Browser Review Pipeline** này trước khi gõ lệnh `git push`. Không tin tưởng việc đọc code thuần chay đối với HTML/CSS.

*(Đã cập nhật vào lõi nhận thức của Khối CTO & Jack - Mức độ: OpenSpace Activated)*
