---
description: Detect regulatory change → Assess → Adapt → Implement → Verify
---

# WF-804: Regulatory Response

> Workflow: **Compliance Officer → GC → Relevant Depts → CEO**

```
Detect Change → Assess Impact → Plan → Implement → Verify → Report
     CO            CO+GC        GC+Depts  All        CO      CO→CEO
```

## Flow
```
// turbo
1. DETECT: Compliance Officer monitors regulatory news
   ├── Sources: Government gazette, legal newsletters, industry groups
   ├── Scope: Vietnam laws, International (GDPR, SOC2 if applicable)
   └── Trigger: New law/regulation/amendment affecting VCT

2. ASSESS (within 7 days):
   ├── What changed: Summary of new requirement
   ├── Who's affected: Which departments/processes
   ├── Gap: Current state vs Required state
   ├── Timeline: Compliance deadline
   └── Risk: Penalty for non-compliance

3. PLAN (within 14 days):
   ├── GC advises on legal interpretation
   ├── Action plan: What to change (policy, process, tech, training)
   ├── Budget: Cost to comply
   └── CEO approve if major impact

4. IMPLEMENT:
   ├── Update policies/SOPs
   ├── Technical changes (CTO if data/security related)
   ├── Training for affected employees
   └── Document everything

5. VERIFY:
   ├── Internal audit of compliance
   ├── External counsel confirmation (if high-risk)
   └── CEO sign-off

6. REPORT:
   ├── Compliance status updated
   ├── Board notification (if material)
   └── Archive: legal-compliance/compliance-officer/memory/decisions/
```
