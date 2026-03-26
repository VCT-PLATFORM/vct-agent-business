---
description: Monitor → Alert → Triage → Escalate → Resolve — Service Monitoring
---

# WF-604: Service Monitoring

> Workflow: **Automated → DevOps → Tech Lead → Support**

```
Monitor → Alert → Triage → Respond → Resolve → Post-action
 System   System  DevOps   DevOps   Dev/DevOps  TechLead
```

## Monitoring Stack
```
// turbo
├── Uptime: API health checks every 30s
├── Performance: Response time P50, P95, P99
├── Errors: Error rate tracking (% of requests)
├── Infrastructure: CPU, Memory, Disk, Network
├── Business: Signups, Logins, Transactions (anomaly detection)
└── Security: Failed logins, IP anomalies, WAF alerts
```

## Alert → Response Matrix
| Alert Type | Threshold | Action |
|-----------|----------|--------|
| API down | >30s no response | Page on-call → SOP-402 (Incident) |
| Error spike | Error rate >5% | DevOps investigates |
| Slow response | P95 >3s for 5 min | DevOps checks → Scale/optimize |
| CPU/Memory | >85% for 10 min | Auto-scale if configured, else manual |
| Disk | >90% | Log rotation + capacity planning |
| Business anomaly | 50% drop in key metric | Alert PM + Data team |
