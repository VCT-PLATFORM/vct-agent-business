---
description: Lệnh /checkpoint — Giao thức Tự Dọn Dẹp và Đóng băng Trạng thái của LLM
---

# Lệnh `/checkpoint`

> **Khi nào dùng**: Khi Chairman gõ lệnh "/checkpoint"
> **Mục đích**: Chấm dứt bộ nhớ hội thoại dông dài, ghi đè trạng thái hiện tại thành một file tĩnh siêu nhẹ, sau đó Chairman có thể xóa chat cũ bắt đầu luồng mới.
> **Người thực hiện**: Jen (Hoặc Orchestrator đang active)

---

## BƯỚC 1: XÁC MINH VÀ LỌC DỮ LIỆU TỪ LỜI TỔNG KẾT
Khi nhận lệnh `/checkpoint` từ Chairman, AI dừng mọi tác vụ và đọc lại toàn bộ chặng đường (Session) hiện tại.

## BƯỚC 2: TỰ ĐỘNG SINH FILE `STATE_NOW.md`
AI sẽ tự động sinh/ghi đè/cập nhật log vào file `_agent/memory/STATE_NOW.md` với format sau:

```markdown
# 💾 VCT Platform - Memory Checkpoint
**Time**: [YYYY-MM-DD HH:mm]

## 1. What was completed (Thành quả)
- [Liệt kê cực ngắn các task vừa làm xong trong luồng chat hiện tại]
- Đã refactor hàm X, đổi API Y.

## 2. What's pending (Tồn đọng)
- [Những thứ Chairman giao nhưng chưa làm xong]

## 3. Active Context Variables (Tham số sống)
- Current Sprint: [Phase?]
- Any blockages / errors unresolved: [Lỗi gì?]

## 4. Next Step
- Khi mở luồng chat mới, AI sẽ tiếp tục từ việc: [Bước kế tiếp]
```

## BƯỚC 3: PHẢN HỒI LẠI CHAIRMAN BẰNG TIN NHẮN SAU MỘT KHI ĐÃ GHI FILE XONG
"Thưa Chairman, Jen đã ghi đè toàn bộ bối cảnh vào file `_agent/memory/STATE_NOW.md` thành công. Bối cảnh sống hiện tại là: [Tóm tắt 1 câu].

👉 **Chairman bây giờ có thể XÓA TRẮNG KHUNG CHAT này (Clear Chat) hoặc tạo New Chat mới**. Khi mở New Chat, Jen sẽ bắt đầu lại từ `STATE_NOW` mà không đánh rơi bất kỳ dữ liệu nào. Token đã được giải phóng 100%!"

---
// turbo-all
