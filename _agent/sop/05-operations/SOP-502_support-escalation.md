# SOP-502: Support Escalation — Escalate Ticket Hỗ trợ

> **Actor**: Support Team + Tech | **Trigger**: Ticket vượt khả năng L1

## Escalation Flow
```
L1 (Support Agent) → L2 (Tech Support) → L3 (Engineering)
├── L1 can resolve: FAQ, known issues, account questions
├── L2 needed when: Config issue, API error, integration problem
└── L3 needed when: Bug fix required, infra issue, security concern
```

## Escalation Triggers & SLA
| Trigger | Escalate To | Timeline |
|---------|-----------|---------|
| L1 can't resolve in 4h | L2 | Immediately |
| L2 can't resolve in 8h | L3 (Tech Lead) | Immediately |
| Customer threatens churn | CSM + Sales Manager | Within 1h |
| Security/Data concern | Security Engineer + GC | Immediately |
| SLA breach risk | COO | Within 2h |
| >10 tickets on same issue | PM + Tech Lead (bug pattern) | Same day |

## Escalation Template
```
// turbo
TO: [Escalation target]
├── Ticket ID: [#]
├── Customer: [Name, plan, ARR]
├── Issue: [1-sentence description]
├── Steps tried: [What L1/L2 already did]
├── Severity: [P1/P2/P3/P4]
├── Customer sentiment: [Calm / Frustrated / Threatening churn]
└── Evidence: [Screenshot, error log, reproduction steps]
```
