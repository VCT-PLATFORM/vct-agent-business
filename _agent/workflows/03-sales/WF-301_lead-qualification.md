---
description: MQL → SQL → Opportunity routing — Lead Qualification
---

# WF-301: Lead Qualification

> Workflow: **Marketing → AE → Sales Manager**

```
MQL Score ≥50 → Route to AE → Discovery Call → Qualify In/Out
  Auto          Round-robin        AE              AE+SM
```

## Qualification Flow
```
// turbo
├── TRIGGER: Lead hits MQL score ≥50 (SOP-208)
├── ROUTE: Auto-assign to AE (round-robin, load-balanced)
├── RESPONSE SLA:
│   ├── Demo request: <5 min
│   ├── Pricing inquiry: <1 hour  
│   └── Content download: <24 hours (automated + AE follow-up)
├── DISCOVERY CALL (AE): BANT+ qualification
│   ├── Qualify IN → Create Opportunity → Enter WF-302
│   └── Qualify OUT → Return to nurture (Marketing)
├── EXCEPTIONS:
│   ├── Enterprise lead (>50 employees): → Senior AE directly
│   ├── Referral: → Skip discovery, fast-track demo
│   └── Competitor: → Flag to Sales Manager, do NOT engage
```
