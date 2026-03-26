---
description: Quy trình thực thi tác vụ end-to-end từ cấp Lãnh đạo đến Chuyên viên — SOP cấp doanh nghiệp
---

# /task-execution — Quy trình Thực thi Tác vụ

> **SOP-001** | Áp dụng cho: MỌI tác vụ từ người dùng
> Tham chiếu: `AGENTS_MANIFEST.md`, `CROSS_DEPARTMENT_PROTOCOLS.md`

---

## Khi nào sử dụng
- Bất kỳ yêu cầu nào từ người dùng (lớn hay nhỏ)
- Mọi tác vụ cần deliverable cụ thể

## Phân loại Quy mô

| Quy mô | Ví dụ | Thời gian | Cấp phê duyệt |
|---------|-------|----------|---------------|
| **S (Small)** | Viết 1 bài đăng, soạn 1 email | <10 phút | Manager review |
| **M (Medium)** | Chiến dịch marketing, báo cáo tài chính | 10-30 phút | Executive approve |
| **L (Large)** | Kế hoạch chiến lược, launch sản phẩm | >30 phút | CEO final approve |

---

## Quy trình 7 Bước

### Bước 1: RECEIVE — Tiếp nhận & Phân loại
```
Input: Yêu cầu người dùng (text, câu hỏi, đề bài)
// turbo
Actions:
├── 1.1 Đọc COMPANY_CONTEXT.md để nắm bối cảnh
├── 1.2 Phân loại: S / M / L
├── 1.3 Xác định phòng ban chủ trì (Primary) và phòng ban hỗ trợ (Support)
├── 1.4 Xác định Executive phụ trách
Output: Routing decision → Executive tương ứng
```

### Bước 2: STRATEGIZE — Xác định Chiến lược (Executive)
```
Actor: Executive (CEO/CMO/CTO/CFO/COO/CHRO/GC/Head of Data)
// turbo
Actions:
├── 2.1 Nhận yêu cầu, đặt trong bối cảnh chiến lược công ty
├── 2.2 Xác định Objectives rõ ràng (SMART)
├── 2.3 Xác định constraints (budget, timeline, resources)
├── 2.4 Nếu liên quan ≥2 phòng ban → Chỉ định Lead dept + Support dept
├── 2.5 Giao Objectives cho Manager
Output: Strategic brief cho Manager
```

### Bước 3: PLAN — Lập kế hoạch & Phân công (Manager)
```
Actor: Manager (Marketing Manager, Tech Lead, PM, etc.)
// turbo
Actions:
├── 3.1 Translate objectives → Tasks cụ thể
├── 3.2 Phân công task cho Specialist phù hợp
├── 3.3 Xác định dependencies giữa các tasks
├── 3.4 Set quality criteria cho từng deliverable
├── 3.5 Nếu cần cross-department → Theo CROSS_DEPARTMENT_PROTOCOLS.md
Output: Task breakdown + Assignment matrix
```

### Bước 4: EXECUTE — Thực thi Chuyên môn (Specialist)
```
Actor: Specialist(s) phù hợp
// turbo
Actions:
├── 4.1 Đọc SKILL.md để activate chuyên môn
├── 4.2 Kiểm tra knowledge/ cho tài liệu tham khảo
├── 4.3 Kiểm tra memory/ cho context từ thảo luận trước
├── 4.4 Thực hiện task — TẠO DELIVERABLE HOÀN CHỈNH (không placeholder)
├── 4.5 Self-review theo quality checklist trong SKILL.md
├── 4.6 Nộp Draft v1 cho Manager
Output: Draft v1 hoàn chỉnh
```

### Bước 5: REVIEW — Kiểm tra Chất lượng (Manager)
```
Actor: Manager
// turbo
Actions:
├── 5.1 Kiểm tra tính đầy đủ: Có thiếu phần nào không?
├── 5.2 Kiểm tra tính nhất quán: Text + Visual + Data khớp nhau?
├── 5.3 Kiểm tra Brand Voice: Đúng tone VCT Platform?
├── 5.4 Kiểm tra Actionability: Dùng được ngay không?
├── 5.5 Cross-reference với COMPANY_CONTEXT.md
├── PASS → Gửi cho Executive
└── FAIL → Feedback cụ thể → Specialist sửa → Re-review
Output: Reviewed deliverable
```

### Bước 6: CHALLENGE — Phản biện (Nếu M/L size)
```
Actor: Phòng ban phản biện (theo AGENTS_MANIFEST.md protocols)
// turbo
Trigger: Chỉ khi task size M hoặc L

Challenge Matrix:
├── Marketing output → Finance (ROI), Legal (compliance)
├── Tech output → Finance (cost), Ops (feasibility)
├── HR output → Finance (budget), Legal (labor law)
├── Finance output → CSO (strategy alignment)
├── Strategy output → Data (evidence), Finance (financial viability)

Process:
├── 6.1 Challenger review output
├── 6.2 Raise concerns (devil's advocate)
├── 6.3 Primary team respond
├── 6.4 Iterate if needed
├── 6.5 Document challenges + responses
Output: Stress-tested deliverable
```

### Bước 7: APPROVE & DELIVER — Phê duyệt & Bàn giao (Executive)
```
Actor: Executive
// turbo
Actions:
├── 7.1 Review Executive Summary
├── 7.2 Verify strategic alignment
├── 7.3 APPROVE → Bàn giao cho người dùng
├── 7.4 Trình bày:
│   ├── TL;DR (1-3 câu)
│   ├── Executive Summary (key points)
│   ├── Full Deliverable(s) (chi tiết)
│   └── Recommended Next Steps
├── 7.5 Lưu vào memory/ của vai trò liên quan
Output: Final deliverable → Người dùng
```

---

## Quality Gates (Điểm kiểm soát)

| Gate | Question | Fail = |
|------|---------|--------|
| G1 (Post-Strategy) | Objectives SMART chưa? | Quay lại Bước 2 |
| G2 (Post-Execute) | Output có placeholder không? | Quay lại Bước 4 |
| G3 (Post-Review) | Brand voice đúng chưa? Actionable chưa? | Quay lại Bước 4 |
| G4 (Post-Challenge) | Có risk chưa mitigate không? | Quay lại Bước 5 |
| G5 (Post-Approve) | CEO/User sẽ satisfied? | Quay lại Bước 5 |

## Lưu trữ Kết quả
```
Sau mỗi tác vụ hoàn thành:
├── Deliverable → memory/deliverables/YYYY-MM-DD_ten-task.md
├── Decision (nếu có) → memory/decisions/ADR-XXX.md
├── Lesson learned → _shared_memory/decisions/
└── Cập nhật COMPANY_CONTEXT.md nếu có data mới
```
