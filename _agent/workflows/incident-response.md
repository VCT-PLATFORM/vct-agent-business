---
description: Quy trình xử lý sự cố hệ thống — Incident Response & Post-mortem
---

# /incident-response — Xử lý Sự cố

> **SOP-009** | Áp dụng khi: Hệ thống gặp sự cố, outage, bảo mật, hoặc lỗi nghiêm trọng
> Actor: DevOps + Tech Lead + CTO | Hỗ trợ: Security, Support, COO

---

## Khi nào sử dụng
- Hệ thống down hoặc degraded
- Phát hiện lỗ hổng bảo mật
- Data breach hoặc nghi ngờ breach
- Lỗi ảnh hưởng >10% users
- Khi người dùng hỏi "xử lý sự cố thế nào"

## Severity Classification

| Severity | Tiêu chí | Response Time | Escalation |
|---------|---------|-------------|-----------|
| **SEV1** | System down, all users | <15 min | CTO + CEO + All hands |
| **SEV2** | Major feature broken | <30 min | CTO + On-call |
| **SEV3** | Minor feature issue | <2h | On-call + Tech Lead |
| **SEV4** | Cosmetic / low impact | Next business day | Tech Lead |

## Quy trình 6 Bước

### Bước 1: DETECT & CLASSIFY
```
// turbo
Actor: Monitoring system / User report / Support team
├── HOW detected: Alert / User report / Internal discovery
├── WHAT is affected: Which service/feature
├── WHO is affected: All users / Specific segment / Internal only
├── CLASSIFY: SEV1 / SEV2 / SEV3 / SEV4
├── Nếu Security-related → Notify Security Engineer + General Counsel IMMEDIATELY
```

### Bước 2: COMMUNICATE
```
// turbo
Actor: Customer Support Lead (external) + Tech Lead (internal)
├── Internal: Alert on-call team, create incident channel
├── External (SEV1/SEV2): Status page update, customer notification
│   ├── Template: "We're aware of [issue]. Investigating. Updates every [30 min]."
│   └── Tone: Transparent, calm, no blame
├── Stakeholders: Notify COO + CTO
```

### Bước 3: INVESTIGATE & FIX
```
// turbo
Actor: On-call Engineer + Tech Lead
├── Immediate triage:
│   ├── Can we ROLLBACK? (fastest fix)
│   ├── Can we FEATURE FLAG off?
│   ├── Can we SCALE UP (if load related)?
│   └── Need to HOTFIX code?
├── Root cause investigation (parallel with fix):
│   ├── Check deployment history (what changed recently?)
│   ├── Check logs, metrics, traces
│   ├── Reproduce issue
│   └── Identify root cause
├── Deploy fix → Verify → Confirm resolved
```

### Bước 4: VERIFY & MONITOR
```
// turbo
Actor: QA Specialist + DevOps
├── Confirm fix works (functional test)
├── Monitor for 1h post-fix (no regression)
├── Verify no data loss or corruption
├── Update status page: "Resolved"
├── Close incident channel
```

### Bước 5: COMMUNICATE RESOLUTION
```
// turbo
Actor: Customer Support Lead + CMO (if major)
├── Internal: Summary to team
├── External: Resolution notification
│   ├── What happened (briefly)
│   ├── What we did to fix it
│   ├── What we'll do to prevent recurrence
│   └── Apology if user-impacting
├── Nếu data breach: Legal notification per NĐ 13/2023 (72h to Bộ Công an)
```

### Bước 6: POST-MORTEM (Within 72h)
```
// turbo
Actor: Tech Lead + All involved
├── Dùng template post-mortem.md
├── BLAMELESS culture — focus on system improvement
├── Identify action items to prevent recurrence
├── Each action item: Owner + Deadline + Priority
├── Share learnings with broader team
├── Lưu vào: technology-product/devops-engineer/memory/decisions/
```
