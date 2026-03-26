---
description: Quy trình lập kế hoạch chiến lược sử dụng SWOT, Porter's Five Forces, Blue Ocean Strategy
---

# /strategic-planning — Lập Kế hoạch Chiến lược

> **SOP-004** | Áp dụng khi: Lập chiến lược quý/năm, phân tích thị trường, hoặc đánh giá cơ hội mới
> Actor chính: CEO + CSO | Hỗ trợ: Head of Data, CFO

---

## Khi nào sử dụng
- Lập chiến lược hàng quý hoặc hàng năm
- Đánh giá thị trường mới hoặc segment mới
- Khi cần pivot hoặc thay đổi định hướng
- Trước khi gọi vốn (investor pitch preparation)
- Khi người dùng yêu cầu "phân tích chiến lược"

## Quy trình 6 Bước

### Bước 1: CONTEXT — Nắm bắt Bối cảnh
```
// turbo
Actor: CSO
├── Đọc COMPANY_CONTEXT.md (current state)
├── Đọc OKRs hiện tại (performance vs target)
├── Thu thập input từ người dùng:
│   ├── Mục tiêu cụ thể? (growth, profitability, market entry?)
│   ├── Time horizon? (3 tháng, 1 năm, 3 năm?)
│   ├── Constraints? (budget, team, regulation?)
│   └── Đã có assumptions nào chưa?
```

### Bước 2: ANALYZE — Phân tích Chiến lược (Multi-framework)
```
// turbo
Actor: CSO + Data Analyst

Chạy TUẦN TỰ (mỗi framework trả lời 1 câu hỏi):

A. PESTEL — "Môi trường bên ngoài đang thay đổi thế nào?"
├── Political: Chính sách, quy định mới ảnh hưởng?
├── Economic: Lãi suất, GDP, consumer spending?
├── Social: Xu hướng hành vi, demographics?
├── Technological: AI/ML, cloud, mobile-first?
├── Environmental: Sustainability, carbon?
└── Legal: Luật mới (data privacy, labor, tax)?

B. Porter's Five Forces — "Ngành này hấp dẫn không?"
├── Rivalry: Đối thủ mạnh/yếu, tập trung/phân tán?
├── New Entrants: Barrier to entry cao/thấp?
├── Substitutes: Có giải pháp thay thế nào?
├── Buyer Power: Khách hàng có nhiều lựa chọn?
└── Supplier Power: Vendor lock-in risks?

C. SWOT (Quantified) — "Ta đang đứng ở đâu?"
├── Strengths: Score 1-10, so sánh vs competition
├── Weaknesses: Score 1-10, severity + fixability
├── Opportunities: Market size, growth rate, timing
└── Threats: Probability × Impact matrix

D. Competitive Position — "Ta khác biệt thế nào?"
├── Strategic Group Mapping (2 axes)
├── Value Chain Analysis (primary + support activities)
└── Moat Assessment (depth + duration)
```

### Bước 3: OPTIONS — Phát triển Phương án
```
// turbo
Actor: CSO + CEO

Frameworks:
├── Ansoff Matrix: Penetration / Development / Diversification
├── Blue Ocean: Eliminate / Reduce / Raise / Create
├── BCG Matrix: Stars / Cash Cows / Question Marks / Dogs

Output: 2-4 strategic options, mỗi option có:
├── Description (1 paragraph)
├── Resource requirements
├── Expected outcome (quantified)
├── Risk profile
├── Timeline
└── Kill criteria (khi nào dừng)
```

### Bước 4: EVALUATE — Đánh giá & Phản biện
```
// turbo
Actor: CFO (financial), Head of Data (evidence), CTO (feasibility)

Financial Evaluation (CFO):
├── Revenue model cho mỗi option
├── Investment required (CapEx + OpEx)
├── Payback period
├── NPV / IRR nếu applicable

Data Validation (Head of Data):
├── Assumptions có data hỗ trợ không?
├── Market size estimates realistic?
├── Growth projections reasonable?

Technical Feasibility (CTO):
├── Build timeline estimate
├── Tech stack implications
├── Resource requirements
```

### Bước 5: DECIDE — Chọn Chiến lược
```
// turbo
Actor: CEO (final decision)

Decision Framework:
├── Score mỗi option theo:
│   ├── Strategic fit (30%)
│   ├── Financial return (25%)
│   ├── Feasibility (20%)
│   ├── Risk level (15%)
│   └── Team readiness (10%)
├── Chọn option có total score cao nhất
├── Define success metrics
├── Define kill criteria
└── Document: Dùng template decision-record.md
```

### Bước 6: CASCADE — Chuyển thành OKR & Action Plan
```
// turbo
Actor: CEO + All C-suite

├── Translate strategy → Company OKRs (dùng /okr-management)
├── Cascade OKRs → Department OKRs
├── Each department → Quarterly initiatives
├── Cập nhật COMPANY_CONTEXT.md (Section 8: OKRs)
├── Communicate to all departments
└── Lưu vào: strategy-office/ceo/memory/decisions/
```

---

## Deliverable: Strategic Plan Document
```markdown
## 🧭 Strategic Plan — [Period]

### 1. Executive Summary (1 page)
### 2. Situation Analysis (PESTEL + SWOT + Porter's)
### 3. Strategic Options Evaluated
### 4. Chosen Strategy & Rationale
### 5. OKRs
### 6. Resource Plan
### 7. Risk Mitigation
### 8. Review Schedule
```
