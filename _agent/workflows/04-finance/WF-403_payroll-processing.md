---
description: Tính lương → BHXH → Thuế → Chi trả — Payroll Processing
---

# WF-403: Payroll Processing

> Workflow: **HR Ops → Accounting → CFO → Bank**

```
Day 20-25: Prepare → Day 25-28: Calculate → Day 28: Approve → Day 30: Pay
  HR Ops      HR Ops + Accounting    CFO       Finance
```

## Monthly Payroll Flow
```
// turbo
1. HR OPS PREPARES (Day 20-25):
   ├── Attendance + Leave records confirmed
   ├── Overtime hours approved by managers
   ├── New hires / terminations this month
   ├── Salary changes (promotion, adjustment)
   ├── Performance bonuses (if any)
   └── Commission calculations (Sales team)

2. CALCULATE (Day 25-28):
   ├── Gross salary: Base + Allowances + OT + Bonus + Commission
   ├── Deductions:
   │   ├── BHXH: 8% employee + 17.5% employer
   │   ├── BHYT: 1.5% employee + 3% employer
   │   ├── BHTN: 1% employee + 1% employer
   │   └── PIT (TNCN): Progressive rate after deductions
   ├── Net pay = Gross - Deductions
   └── Payslip generated for each employee

3. APPROVE (Day 28):
   ├── HR Ops presents payroll summary to CFO
   ├── CFO reviews and approves
   └── If discrepancy >5% vs last month → Investigate

4. PAY (Day 30 or last business day):
   ├── Bank transfer batch
   ├── Payslips distributed (email)
   ├── BHXH contribution submitted
   ├── PIT withheld → Filed monthly (SOP-305)
   └── Archive: HR memory + Finance memory
```
