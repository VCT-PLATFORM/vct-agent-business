---
description: Hypothesis → Design → Run → Analyze → Decide — Experiment Lifecycle
---

# WF-902: Experiment Lifecycle

> Workflow: **PM/Growth → Growth Analyst → Dev → Data → PM**

```
Hypothesis → Design → Implement → Run → Analyze → Decide → Document
  PM/Growth   Growth    Dev       Auto   Growth    PM+CEO    Growth
```

## Flow → Xem SOP-802 (A/B Testing) cho chi tiết

## Experiment Board
```
// turbo
├── BACKLOG: Hypotheses to test (scored by potential impact)
├── DESIGNING: Currently being designed (sample size, metrics)
├── RUNNING: Live experiments (DO NOT touch!)
├── ANALYZING: Experiment ended, analyzing results
├── DECIDED: Ship / Kill / Iterate decided
└── DOCUMENTED: Full write-up archived

Max concurrent experiments: 3 (avoid conflicts)
Each experiment must have: 1 owner + 1 primary metric + kill criteria
```
