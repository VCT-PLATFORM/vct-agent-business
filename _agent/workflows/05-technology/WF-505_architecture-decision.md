---
description: Problem → Options → Evaluate → Decide → ADR — Architecture Decision
---

# WF-505: Architecture Decision

> Workflow: **Engineer → Tech Lead → Solution Architect → CTO**

```
Problem → Research → Options → Evaluate → Decide → Document → Communicate
 Anyone    SA+TL     SA        SA+CTO     CTO      SA         TL→Team
```

## When to Use
```
├── New technology adoption (database, framework, cloud service)
├── Major refactoring (breaking change to existing architecture)
├── Build vs Buy decision
├── Scaling strategy change
├── Security architecture change
└── ANY change that's hard to reverse
```

## Flow
```
// turbo
1. PROBLEM: Define the problem clearly (not the solution)
   ├── "We need X because Y, current state is Z"
   └── Business context: Why does this matter?

2. OPTIONS: ≥3 alternatives (include "do nothing")
   ├── Each option: Description, Pros, Cons, Effort, Risk
   └── Solution Architect leads research

3. EVALUATE:
   ├── POC/Spike: Build small proof for top 2 options (time-boxed: 2-3 days)
   ├── Criteria: Performance, Scalability, Maintainability, Cost, Team skill
   └── Multi-Agent Debate (SOP-002) for major decisions

4. DECIDE: CTO makes final call
   ├── With input from: Solution Architect, Tech Lead, relevant Engineers
   └── Security review if applicable

5. DOCUMENT: Architecture Decision Record (ADR)
   ├── Template: decision-record.md
   ├── Store: technology-product/solution-architect/memory/decisions/
   └── ADR is PERMANENT (even if reversed later, keep original)

6. COMMUNICATE: Tech Lead announces to team
   ├── Team meeting walkthrough
   ├── Update relevant documentation
   └── Training if new technology
```
