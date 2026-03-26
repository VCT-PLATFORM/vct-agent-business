---
description: Quy trình đánh giá kinh doanh định kỳ (Weekly / Monthly / Quarterly Business Review) — cấp doanh nghiệp
---

# /business-review — Đánh giá Kinh doanh Định kỳ

> **SOP-003** | Áp dụng: Review hiệu quả kinh doanh theo kỳ
> Tham chiếu: `REPORTING_STANDARDS.md`, `COMPANY_CONTEXT.md`

---

## Khi nào sử dụng
- Weekly: Thứ 2 hàng tuần (Executive Sync)
- Monthly: Ngày 5 mỗi tháng (MBR)
- Quarterly: Đầu quý mới (QBR)
- Ad-hoc: Khi CEO/người dùng yêu cầu đánh giá

## Quy trình thực hiện

### Bước 1: COLLECT — Thu thập Dữ liệu
```
// turbo
Actor: Data Analyst + Financial Analyst
Sources:
├── COMPANY_CONTEXT.md (KPIs section)
├── Từng phòng ban → memory/reports/ (weekly/monthly reports)
├── Người dùng cung cấp (nếu có data mới)

Metrics cần thu thập:
├── Revenue: MRR, ARR, Revenue growth %, Net Revenue Retention
├── Growth: New customers, Signups, Activation rate, Churn rate
├── Efficiency: CAC, LTV:CAC, Burn Multiple, Gross Margin
├── Product: DAU/MAU, Feature adoption, NPS, CSAT
├── Operations: Uptime, Support tickets, FRT, Resolution time
├── People: Headcount, Open positions, Attrition, eNPS
└── Finance: Cash runway, OpEx, CapEx, Budget variance
```

### Bước 2: ANALYZE — Phân tích RAG
```
// turbo
Actor: Mỗi phòng ban tự đánh giá metrics của mình

Rating:
├── 🟢 Green: ≥100% target → Celebrate, share best practices
├── 🟡 Amber: 80-99% target → Root cause analysis, action plan
├── 🔴 Red: <80% target → Immediate intervention, escalation

Analysis Framework:
├── WHAT: Metric nào đang 🟡/🔴?
├── WHY: Root cause (5 Whys nếu cần)
├── SO WHAT: Impact nếu không fix?
└── NOW WHAT: Action plan cụ thể (Who, What, When)
```

### Bước 3: OKR CHECK-IN
```
// turbo
Actor: CSO + CEO
├── Đánh giá tiến độ từng Company OKR (0.0 → 1.0)
├── Color code: 🟢 On-track / 🟡 At-risk / 🔴 Off-track
├── Nếu Off-track: Cần thay đổi gì? Thêm resources? Pivot?
├── Cascade check: Dept OKRs align với Company OKRs?
```

### Bước 4: HIGHLIGHTS & LOWLIGHTS
```
// turbo
Actor: Mỗi Executive báo cáo cho CEO

Format:
├── 🏆 Top 3 Wins (+ impact cụ thể)
├── ⚠️ Top 3 Challenges (+ root cause + action)
├── 💡 Top 1 Insight/Learning
├── 🔮 Top 1 Risk on horizon
```

### Bước 5: ACTION & DECIDE
```
// turbo
Actor: CEO + All Executives
├── Review action items từ review kỳ trước → Hoàn thành chưa?
├── Quyết định actions mới:
│   ├── ↗️ ACCELERATE: Đang tốt → đầu tư thêm
│   ├── 🔧 FIX: Đang xấu → intervention
│   ├── 🛑 STOP: Đang lãng phí → cắt bỏ
│   └── 🆕 START: Cơ hội mới → pilot
├── Mỗi action phải có: Owner + Deadline + Success metric
Output: Dùng template decision-record.md nếu quyết định lớn
```

### Bước 6: COMMUNICATE
```
// turbo
Actor: CEO
├── Tóm tắt cho người dùng (Executive Summary format):
│   ├── Scorecard tổng (RAG)
│   ├── Top wins & Top risks
│   ├── Key decisions made
│   └── Action items với owners
├── Lưu vào: strategy-office/ceo/memory/reports/
```

---

## Output Format theo Loại Review

### Weekly (5 phút đọc)
```markdown
## 📅 Weekly Review — [DD/MM/YYYY]
### Scorecard: 🟢 X | 🟡 Y | 🔴 Z
### Top Win: [...]
### Top Risk: [...]
### Actions: [Who → What → By When]
```

### Monthly (15 phút đọc)
> Dùng template `monthly-report.md`

### Quarterly (30 phút đọc)
> QBR Deck format:
> 1. Company Scorecard (all metrics)
> 2. OKR Report Card (scores)
> 3. Dept-by-dept deep dive
> 4. Strategic outlook next quarter
> 5. Resource plan
