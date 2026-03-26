---
description: Invoice → Recognize → Reconcile — Revenue Recognition
---

# WF-405: Revenue Recognition

> Workflow: **Sales → Accounting → CFO**

```
Contract Signed → Invoice → Recognize → Reconcile → Report
    AE           Accounting  Accounting  FinAnalyst   CFO
```

## SaaS Revenue Rules
```
// turbo
├── Monthly subscription: Recognize in period earned
├── Annual prepaid: Deferred revenue → recognize 1/12 monthly
├── One-time setup fee: Recognize over implementation period
├── Usage-based: Recognize as consumed
├── Professional services: % completion method
├── Refunds: Reduce revenue in period of refund

ASC 606 / IFRS 15 Compliance:
├── Step 1: Identify contract
├── Step 2: Identify performance obligations
├── Step 3: Determine transaction price
├── Step 4: Allocate to obligations
└── Step 5: Recognize when obligation satisfied
```
