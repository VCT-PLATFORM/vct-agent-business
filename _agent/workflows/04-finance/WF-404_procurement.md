---
description: Yêu cầu mua → Approve → PO → Nhận → Thanh toán — Procurement
---

# WF-404: Procurement

> Workflow: **Requestor → Manager → CFO → Vendor → Accounting**

```
Need → Evaluate → Approve → Order → Receive → Pay
 Any    SOP-406   CFO/CEO   Acctg    Requester  Acctg
```

## Flow
```
// turbo
1. REQUEST: Any employee identifies a need
   ├── What: Product/Service description
   ├── Why: Business justification
   ├── Alternatives considered: ≥3 options (incl. "do nothing")
   └── Budget: Estimated cost

2. EVALUATE: → SOP-406 (Vendor Tool Evaluation) if >$500/yr

3. APPROVE:
   ├── <$500: Manager
   ├── $500-$5K: CTO (tech) or COO (ops)
   ├── $5K-$50K: CTO/COO + CFO
   └── >$50K: + CEO

4. ORDER:
   ├── Accounting issues PO (purchase order)
   ├── Vendor contract if needed: → SOP-701
   └── Payment terms negotiated

5. RECEIVE & VERIFY:
   ├── Requestor confirms receipt/setup
   ├── Accounting matches PO → Invoice → Receipt
   └── Three-way match before payment

6. PAY: Per vendor payment terms (NET 15/30)
   └── Record in accounting system
```
