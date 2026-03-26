---
description: Quy trình lập kế hoạch tài chính — Budgeting, Forecasting, và Financial Analysis
---

# /financial-planning — Quy trình Kế hoạch Tài chính

> **SOP-011** | Áp dụng khi: Lập budget, forecast, phân tích ROI, hoặc báo cáo tài chính
> Actor: CFO + Financial Analyst + Accounting Manager

---

## Khi nào sử dụng
- Lập budget hàng năm / hàng quý
- Forecast revenue / cashflow
- Đánh giá ROI cho dự án, campaign, hiring
- Chuẩn bị tài liệu cho investor / board
- Khi người dùng hỏi về tài chính, ngân sách, đầu tư

## Quy trình

### Bước 1: SCOPE — Xác định Phạm vi
```
// turbo
Actor: CFO
├── Loại phân tích: Budget / Forecast / ROI / Valuation / Cash flow
├── Time horizon: Monthly / Quarterly / Annual / Multi-year
├── Stakeholder: Internal (CEO) / External (Investor, Board)
├── Data needed: Revenue, costs, headcount, pipeline
```

### Bước 2: COLLECT — Thu thập Data
```
// turbo
Actor: Financial Analyst + Accounting Manager
├── Actual numbers: P&L, Balance Sheet, Cash Flow (from Accounting)
├── Pipeline data: Sales forecast (from Sales Manager)
├── Headcount plan: Hiring pipeline (from CHRO)
├── Marketing spend: Campaign budgets (from CMO)
├── Tech costs: Infra, tools, licenses (from CTO)
├── Benchmark: Industry SaaS metrics (from Data Analyst)
```

### Bước 3: MODEL — Xây dựng Mô hình
```
// turbo
Actor: Financial Analyst
├── Revenue Model:
│   ├── Existing revenue × (1 - Churn rate) + New revenue
│   ├── New revenue = Leads × Conversion × ARPU
│   └── Expansion: Upsell + Cross-sell
├── Cost Model:
│   ├── People cost: Headcount × (Salary × 1.235 employer cost)
│   ├── Marketing: Budget per channel × expected ROAS
│   ├── Infrastructure: Server + SaaS tools + Licenses
│   └── G&A: Office, Legal, Insurance, Misc
├── Scenarios: Best (P10) / Base (P50) / Worst (P90)
├── Sensitivity analysis: Key drivers (churn, ARPU, CAC)
```

### Bước 4: ANALYZE — Phân tích & Insight
```
// turbo
Actor: Financial Analyst + CFO
├── Key metrics output:
│   ├── Unit Economics: CAC, LTV, LTV:CAC, Payback
│   ├── Efficiency: Burn Multiple, Magic Number, Rule of 40
│   ├── Growth: MRR growth rate, Net Revenue Retention
│   └── Health: Gross Margin, Runway, Cash position
├── Variance analysis: Budget vs Actual (if reviewing past)
├── "So what": Implications + Recommendations
```

### Bước 5: PRESENT — Trình bày
```
// turbo
Actor: CFO
├── Executive Summary: 1 page với 5-7 key numbers
├── Dashboard: Visual charts (trend, comparison)
├── Detail tables: Full breakdown by category
├── Recommendations: Actions based on analysis
├── Assumptions page: Make explicit every assumption
├── Dùng template monthly-report.md (Finance section)
```

### Bước 6: DECIDE & TRACK
```
// turbo
Actor: CEO + CFO
├── Approve budget / forecast
├── Set spending limits per department
├── Monthly tracking: Actual vs Budget variance
├── Alert triggers: >10% variance → CFO investigate
├── Quarterly recalibration
├── Lưu vào: finance-accounting/cfo/memory/reports/
```
