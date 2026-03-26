---
description: Report → Classify → Assign → Fix → Verify — Bug Triage
---

# WF-504: Bug Triage

> Workflow: **Reporter → QA → Tech Lead → Dev → QA → Release**

```
Report → Classify → Assign → Fix → Verify → Release
 Anyone    QA       TechLead  Dev    QA      DevOps
```

## Triage Flow
```
// turbo
1. REPORT: Bug submitted (customer, QA, developer, or automated)
   ├── Use bug report template (QA SKILL.md)
   └── Must include: Steps to reproduce, Expected, Actual, Screenshots

2. CLASSIFY (QA within 4h):
   ├── P1 (Critical): System down, data loss, security → Fix today
   ├── P2 (High): Major feature broken → Fix this sprint
   ├── P3 (Medium): Minor feature issue → Next sprint
   └── P4 (Low): Cosmetic, edge case → Backlog

3. ASSIGN (Tech Lead):
   ├── P1: Assign immediately, interrupt current work
   ├── P2-P4: Add to sprint backlog, prioritize per RICE
   └── Duplicate check: Is this already reported/in-progress?

4. FIX (Developer):
   ├── Root cause analysis
   ├── Fix + Unit test for the scenario
   ├── PR → Code review (SOP-404)
   └── Mark "Ready for QA"

5. VERIFY (QA):
   ├── Reproduce original bug → Confirm fixed
   ├── Regression test (did fix break anything?)
   └── PASS → Ready for release

6. RELEASE: → SOP-403 (Release Management)
   ├── P1: Hotfix deploy immediately
   └── P2-P4: Next scheduled release
```
