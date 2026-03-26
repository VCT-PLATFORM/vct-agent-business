---
description: Create → Triage → Resolve → Close → Analyze — Ticket Lifecycle
---

# WF-602: Ticket Lifecycle

> Workflow: **Customer → Support L1 → L2 → L3 → CSM**

```
Submit → Auto-ack → Triage → Resolve → Close → CSAT → Analyze
Customer   System    L1       L1/L2/L3  Agent   Customer  SupportLead
```

## Flow
```
// turbo
├── SUBMIT: Customer creates ticket (email, chat, in-app)
├── AUTO-ACK: Immediate auto-reply with ticket # and SLA
├── TRIAGE (L1, within 15 min):
│   ├── Category: Bug / Question / Feature request / Billing / Access
│   ├── Priority: P1 (<1h) / P2 (<4h) / P3 (<8h) / P4 (<24h)
│   └── Route: L1 can solve? Or escalate? → SOP-502
├── RESOLVE: Solve issue with customer
│   ├── First Contact Resolution target: >70%
│   ├── If L2/L3 needed: Transparent communication to customer
│   └── If bug: Create dev ticket → WF-504 (Bug Triage)
├── CLOSE: Confirm with customer → Close ticket
├── CSAT: Survey within 1h of close (1 question: How was your experience?)
├── ANALYZE (Weekly by Support Lead):
│   ├── Top issue categories → PM for product improvement
│   ├── Repeat issues → Knowledge base article
│   ├── CSAT trends → Coaching if specific agents low
│   └── SLA compliance → Report to COO
```
