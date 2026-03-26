# SOP-802: A/B Testing — Thí nghiệm

> **Actor**: Growth Analyst + PM | **Trigger**: Muốn test thay đổi sản phẩm/marketing

## Process
```
// turbo
1. HYPOTHESIS: "If we [change X], then [metric Y] will [improve] by [Z%]"
   ├── Be specific: "Đổi CTA từ 'Đăng ký' thành 'Bắt đầu miễn phí' → +15% signup click"
   └── One variable at a time (not multiple changes)

2. DESIGN:
   ├── Control: Current version (A)
   ├── Variant: Changed version (B)
   ├── Primary metric: ONE metric to decide winner
   ├── Guardrail metrics: Metrics that must NOT degrade
   ├── Sample size: Calculate using Growth Analyst framework
   ├── Duration: Enough to capture 1+ full business cycle (min 7 days)
   └── Allocation: 50/50 random split

3. IMPLEMENT:
   ├── Feature flag: Variant behind flag
   ├── QA: Both versions work correctly
   ├── Tracking: Events firing correctly for both versions
   └── Launch: Start experiment

4. MONITOR (during experiment):
   ├── DO NOT peek at results for decisions (false positives!)
   ├── Check: Are both groups getting enough traffic?
   ├── Check: Any technical issues (errors, crashes)?
   ├── Check: Guardrail metrics stable?
   └── Only stop early if: SEV1 bug or guardrail violated

5. ANALYZE (after full duration):
   ├── Statistical significance: p < 0.05 required
   ├── Practical significance: Is the lift meaningful? (>5% typically)
   ├── Segment analysis: Does effect vary by user type?
   ├── Decision:
   │   ├── SHIP: Variant wins → Roll out to 100%
   │   ├── ITERATE: Promising but not significant → Redesign + retest
   │   └── KILL: No improvement → Keep control, document learning

6. DOCUMENT:
   ├── Experiment log: Hypothesis + Design + Results + Decision
   ├── Share learnings: Team meeting, Slack
   └── Lưu vào: data-intelligence/growth-analyst/memory/deliverables/
```

## Rules
- **Never stop early** based on "trending positive" — Wait for full sample size
- **One test per page/flow** — Don't run overlapping experiments
- **Document everything** — Including FAILED experiments (institutional memory)
