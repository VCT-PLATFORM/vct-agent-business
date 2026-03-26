# Cross-Department Protocols — Quy trình Phối hợp Liên phòng ban

> **Mục đích**: Định nghĩa rõ cách các phòng ban **phối hợp** với nhau. Không phòng ban nào hoạt động như "đảo" riêng lẻ.

---

## 1. Marketing ↔ Technology

### Marketing yêu cầu Tech (Feature Request)
```
Trigger: Marketing cần tính năng mới hoặc thay đổi sản phẩm
Flow:
1. CMO/Marketing Manager → Viết yêu cầu (dùng template Proposal)
2. Product Manager → Review, prioritize (RICE scoring)
3. Tech Lead → Estimate effort, identify risks
4. CTO → Approve nếu >2 sprint effort
5. Sprint Planning → Đưa vào backlog
6. Marketing ← Nhận update tiến độ hàng tuần
```

### Tech thông báo Marketing (Release)
```
Trigger: Tính năng mới sắp ra mắt
Flow:
1. Product Manager → Release notes + Go-to-market brief (2 tuần trước)
2. Marketing Manager → Lên launch plan (content, email, social)
3. Content Writer + Designer → Tạo assets
4. Brand Manager → Review consistency
5. CMO → Approve launch plan
6. D-Day: Coordinated launch
```

---

## 2. Marketing ↔ Finance

### Marketing xin Budget
```
Trigger: Campaign mới hoặc budget tăng
Flow:
1. Marketing Manager → Proposal (ROI projection, budget breakdown)
2. Financial Analyst → Verify ROI calculation, benchmark với historical data
3. CFO → Approve / Reject / Counter-offer
4. Accounting Manager → Set up cost center, tracking
5. Marketing ← Proceed with approved budget
6. Monthly: Marketing reports ROAS → Finance verifies
```

---

## 3. HR ↔ Finance

### Tuyển dụng Mới (Headcount Request)
```
Trigger: Phòng ban cần thêm người
Flow:
1. Requesting Manager → Headcount request (JD + business case)
2. CHRO → Review vs org plan, approve role
3. CFO → Approve budget (salary + benefits + equipment ≈ 1.35x gross)
4. CEO → Final approve nếu >3 headcounts hoặc C-level
5. Recruiter → Start sourcing
6. HR Ops → Prepare contract, onboarding
```

### Payroll Monthly
```
Flow:
1. HR Ops Manager → Finalize payroll data (attendance, OT, deductions) by 15th
2. Accounting Manager → Verify, calculate BHXH/TNCN, prepare bank file by 20th
3. CFO → Approve payroll run
4. Accounting → Execute payment by 25th
5. HR Ops → Distribute payslips
```

---

## 4. Technology ↔ Legal

### Vendor/SaaS Purchase
```
Trigger: Tech muốn mua tool mới (>$500/year)
Flow:
1. Tech Lead/CTO → Đề xuất tool (so sánh 3 options)
2. Security Engineer → Security assessment (DPA, data residency)
3. Contract Specialist → Review vendor agreement, negotiate terms
4. Compliance Officer → Check data privacy compliance
5. CFO → Approve budget
6. Contract signed → Accounting tracks expense
```

### Open Source Usage
```
Trigger: Developer muốn dùng thư viện open source mới
Flow:
1. Developer → Check license (xem IP Specialist guide)
2. Tech Lead → Approve nếu MIT/Apache/BSD
3. IP Specialist → Review nếu LGPL/GPL/AGPL
4. General Counsel → Approve nếu có risk
```

---

## 5. Sales ↔ Legal

### Contract Với Khách hàng
```
Trigger: Account Executive cần hợp đồng cho deal
Flow:
1. AE → Request contract (customer info, deal terms, special conditions)
2. Contract Specialist → Draft from template, customize
3. Sales Manager → Review commercial terms
4. General Counsel → Review legal risk (nếu deal > $50K hoặc non-standard)
5. AE → Send to customer, negotiate
6. Contract signed → CFO notified for revenue recognition
```

---

## 6. All Departments → CEO

### Escalation Protocol
```
Khi nào escalate lên CEO:
├── Decision impact > $50K hoặc > 6 tháng
├── 2+ C-suite không đồng ý với nhau
├── Legal/Compliance risk level = RED
├── PR crisis hoặc customer-threatening situation
├── Headcount > 3 hoặc C-level hire
└── Strategy pivot hoặc new market entry

Format: Dùng template Decision Record (ADR)
Timeline: CEO responds within 24h for P1, 72h for P2
```

---

## 7. Cross-Department Meeting Cadence

| Meeting | Participants | Frequency | Purpose |
|---------|-------------|-----------|---------|
| **All Hands** | Everyone | Monthly | Strategy updates, celebrations |
| **Executive Sync** | All C-suite | Weekly (60') | Cross-dept alignment |
| **Revenue Review** | CMO + CFO + Sales | Weekly (30') | Pipeline, forecast |
| **Product Standup** | CTO + PM + Tech Lead | Daily (15') | Sprint progress |
| **Growth Review** | CMO + PM + Head of Data | Bi-weekly (45') | Metrics, experiments |
| **People Review** | CHRO + COO + CFO | Monthly (60') | Headcount, culture |
| **Risk Committee** | GC + Compliance + CTO + CFO | Monthly (30') | Risk assessment |
