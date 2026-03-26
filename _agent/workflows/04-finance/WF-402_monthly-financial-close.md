---
description: Khóa sổ + Báo cáo hàng tháng — Monthly Financial Close
---

# WF-402: Monthly Financial Close

> Workflow: **Accounting → CFO → All Depts → CEO**

```
Day1-2 Collect → Day3 Adjust → Day4 Report → Day5 Review
 Accounting     Accounting     FinAnalyst      CFO→CEO
```

## Flow → Xem SOP-304 (Month-End Closing) cho chi tiết

## Cross-Department Inputs
```
// turbo
├── Marketing: Campaign spend actuals → Accounting
├── Sales: Pipeline + Closed deals → CRM → Revenue recognition
├── HR: Payroll finalized + New hires → Accounting
├── Technology: Infra costs, tool licenses → Accounting  
├── Operations: Vendor invoices → Accounting
├── Legal: Legal fees, external counsel → Accounting
└── All Depts: Expense reports submitted → Day 1 deadline
```

## Output Cascade
```
// turbo
├── Day 5: CFO → CEO monthly financial report
├── Day 5: Update COMPANY_CONTEXT.md KPIs
├── Day 7: CFO → Board (if Board month)
├── Day 7: Finance summary → All C-suite
└── Archive: finance-accounting/cfo/memory/reports/
```
