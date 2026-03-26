---
description: Soạn → Review → Negotiate → Sign — Proposal to Contract
---

# WF-303: Proposal to Contract

> Workflow: **AE → Sales Manager → Contract Specialist → GC → CFO**

```
Draft Proposal → Internal Review → Send → Negotiate → Legal → Sign
    AE             SM+CMO          AE      AE+CS       GC     CEO/CFO
```

## Flow
```
// turbo
1. AE drafts proposal (based on discovery + demo feedback)
   ├── Custom pricing per deal
   ├── Scope of services / Implementation plan
   └── ROI projection for customer

2. Internal review:
   ├── Sales Manager: Pricing + discount check
   ├── CMO: If >25% discount → Approve
   ├── CFO: If deal >$50K → Financial review
   └── Turnaround: <24 hours

3. Send → Customer reviews → Negotiations begin
   ├── Max 3 negotiation rounds before escalation to CEO
   └── Track redlines/changes

4. Legal:
   ├── Contract Specialist drafts MSA/SaaS agreement
   ├── General Counsel reviews → SOP-701
   └── Counterparty signs

5. Sign:
   ├── Authority: CEO (>$100K), CFO (<$100K), Manager (<$10K)
   ├── Digital signature
   └── → Trigger WF-304 (Customer Handoff)
```
