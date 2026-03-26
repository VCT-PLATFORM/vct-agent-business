---
description: Sự cố → Phân tích → Fix → Post-mortem — Full Resolution Lifecycle
---

# WF-006: Issue to Resolution — Hành trình Xử lý Sự cố

> Workflow: **Support → Tech → Communication → Learning**

```
Detect → Triage → Communicate → Fix → Verify → Post-mortem → Improve
 Auto/User  Support   Support+CMO  Dev   QA     TechLead    All
```

## Flow
```
// turbo
1. DETECT: Monitoring alert / User report / Internal discovery
   ├── If System: SOP-402 (Incident Response)
   ├── If Data: SOP-803 (Data Quality Incident)
   └── If Customer: SOP-502 (Support Escalation)

2. TRIAGE: Classify severity (SEV1-4 / P1-P4)
   ├── Route to correct team
   └── Notify stakeholders per severity matrix

3. COMMUNICATE: Status page + Customer notification (if SEV1/2)
   └── Trigger: SOP-402 Step 2

4. FIX: Investigate → Rollback / Hotfix / Feature flag
   ├── Code fix: SOP-404 (Code Review) → SOP-403 (Release)
   └── Infra fix: DevOps direct action

5. VERIFY: QA confirm fix → Monitor 1h → All clear

6. POST-MORTEM (within 72h): Blameless review
   ├── Template: post-mortem.md
   ├── Action items to prevent recurrence
   └── Share learnings company-wide

7. IMPROVE: Implement prevention measures
   └── SOP-504 (Continuous Improvement)
```
