---
description: Quy trình phản biện đa tác nhân — phân tích vấn đề từ nhiều góc nhìn phòng ban để đạt giải pháp tối ưu
---

# Multi-Agent Debate — Phản biện Đa tác nhân

Quy trình này kích hoạt khi một vấn đề cần được phân tích từ nhiều góc nhìn phòng ban trước khi ra quyết định.

## Khi nào sử dụng

- Vấn đề liên quan ≥2 phòng ban
- Quyết định có tác động lớn (>$5K hoặc ảnh hưởng >3 tháng)
- Khi người dùng nói "phân tích kỹ", "debate", "phản biện", "đánh giá đa chiều"
- Mọi quyết định chiến lược quan trọng

## Quy trình Thực hiện

### Bước 1: Định nghĩa Vấn đề (CEO Lead)
- Phát biểu vấn đề rõ ràng trong 1-2 câu
- Xác định: Deadline? Budget? Constraints?
- Chỉ định phòng ban tham gia

### Bước 2: Phân tích Độc lập (Mỗi phòng ban)
Mỗi phòng ban đưa ra góc nhìn riêng:

**CFO**: Khía cạnh tài chính
- Chi phí bao nhiêu?
- ROI dự kiến?
- Ảnh hưởng cash flow?

**CMO**: Khía cạnh thị trường & khách hàng
- Khách hàng muốn gì?
- Đối thủ đang làm gì?
- Cơ hội thị trường?

**CTO**: Khía cạnh kỹ thuật
- Feasibility? Complexity?
- Technical debt?
- Timeline estimate?

**COO**: Khía cạnh vận hành
- Quy trình cần thay đổi?
- Resource cần bao nhiêu?
- Rủi ro vận hành?

**CHRO**: Khía cạnh nhân sự
- Cần tuyển thêm?
- Team hiện tại handle được không?
- Impact lên culture?

**Legal**: Khía cạnh pháp lý
- Rủi ro pháp lý?
- Compliance requirement?
- Cần hợp đồng/agreement gì?

**Data**: Khía cạnh dữ liệu
- Data nào support/contradict ý kiến?
- Cần đo lường gì thêm?

### Bước 3: Phản biện Chéo (Cross-Challenge)
Mỗi phòng ban challenge phòng ban khác:
- "Số liệu này có đáng tin không?" (Data → All)
- "Budget có realistic không?" (CFO → CMO/CTO)
- "Technical debt sẽ tích lũy thế nào?" (CTO → COO)
- "Luật cho phép không?" (Legal → All)

**Quy tắc phản biện**:
- ✅ Evidence-based: Phải có số liệu hoặc logic
- ✅ Constructive: Nếu nói "không" → phải đề xuất thay thế
- ❌ Không được: Ad hominem, đổ lỗi, tranh luận vô tận

### Bước 4: Hội tụ (Convergence)
- Liệt kê các điểm **đồng thuận** (tất cả phòng ban đều agree)
- Liệt kê các điểm **tranh luận** (còn bất đồng)
- Với mỗi điểm tranh luận → CEO ra quyết định cuối cùng

### Bước 5: Tổng hợp & Quyết định (CEO)
Trình bày kết quả dưới format:

```markdown
## 🏛️ Kết quả Phản biện Đa tác nhân

### Vấn đề: [Tóm tắt]

### Đồng thuận:
1. ✅ [Điều tất cả đều đồng ý]
2. ✅ [...]

### Tranh luận & Quyết định:
| Vấn đề | Bên A nói | Bên B nói | Quyết định CEO |
|--------|----------|----------|---------------|
| [...] | [...] | [...] | [...] |

### Quyết định Cuối cùng:
**[LÀM / KHÔNG LÀM / CẦN THÊM DỮ LIỆU]**

### Lý do:
[Tại sao chọn quyết định này, trade-offs đã chấp nhận]

### Action Items:
| Việc | Phòng ban | Deadline |
|------|----------|---------|
```

## Escalation
Nếu phòng ban không thể đồng thuận sau 2 vòng tranh luận → CEO quyết định cuối cùng và giải thích lý do.
