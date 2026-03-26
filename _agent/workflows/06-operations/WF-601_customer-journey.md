---
description: Sign → Onboard → Adopt → Retain → Expand — Customer Journey
---

# WF-601: Customer Journey

> Workflow: **Sales → CSM → Support → AE** | End-to-end customer lifecycle

```
Win Customer → Onboard → First Value → Adopt → Renew → Expand → Advocate
    AE         CSM(30d)   CSM(14d)    CSM     CSM      AE       CSM
```

## Journey Stages & Owners
```
// turbo
├── Day 0: Contract signed → WF-304 (Customer Handoff)
├── Day 1-30: Onboarding → SOP-501
│   ├── Success criteria: First value milestone by Day 14
│   └── Health: Green if on-track, Red if no login in 7 days
├── Day 30-90: Adoption phase (CSM)
│   ├── Feature adoption tracking (>3 core features)
│   ├── Monthly check-in calls
│   └── NPS survey at Day 60
├── Day 90+: Steady State (CSM)
│   ├── QBR every quarter → WF-603
│   ├── Health scoring: Usage + Satisfaction + Engagement
│   └── At-risk detection: ↓ usage, ↓ NPS, ↑ support tickets
├── Renewal (60 days before):
│   ├── CSM starts renewal conversation
│   ├── If healthy: Auto-renew or simple confirmation
│   ├── If at-risk: Win-back plan (CSM + AE + CEO if needed)
│   └── If churning: Exit interview, learn why
├── Expansion: → WF-305 (Upsell & Expansion)
├── Advocate: Happy customers → Referral (SOP-209), Case study, Reference call
```
