---
description: Request → Analyze → Review → Present → Action — Analytics Pipeline
---

# WF-901: Analytics Pipeline

> Workflow: **Requester → Data Analyst → Head of Data → Requester**

```
Request → Queue → Analyze → Review → Present → Action → Archive
  Any     HoData  Analyst   HoData   Analyst   Requester  Analyst
```

## Flow → Xem SOP-801 (Data Request) cho chi tiết

## Request Types & Routing
```
// turbo
├── Quick Query (<1h): Data Analyst handles directly
│   └── "What's our churn rate this month?"
├── Standard Analysis (<1 day): Data Analyst + Review
│   └── "Why did MRR drop in March?"
├── Deep Dive (>1 day): Data Analyst + Growth Analyst
│   └── "What's our optimal pricing strategy?"
├── Dashboard Request: Data Engineer + Data Analyst
│   └── "Build a real-time sales dashboard"
├── Recurring Report: Automate if requested 3+ times
│   └── "Weekly marketing metrics"
```

## Quality Standards
```
// turbo
├── Every analysis MUST include:
│   ├── Executive summary (1 paragraph)
│   ├── Methodology (how you got the numbers)
│   ├── Key findings (3-5 bullet points)
│   ├── Caveats (what data is missing or uncertain)
│   └── Recommended action (what to DO with this insight)
├── Peer review required for analyses shared with C-suite or Board
```
