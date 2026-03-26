# SOP-406: Vendor/Tool Evaluation — Đánh giá & Mua Công cụ

> **Actor**: CTO + Requestor | **Trigger**: Muốn mua SaaS tool hoặc service mới

## Quy trình
```
// turbo
1. NEED: Requestor mô tả vấn đề cần giải quyết (KHÔNG solution)
2. RESEARCH: List 3+ options (including "build internally" and "do nothing")
3. EVALUATE: Score matrix:
   ├── Functionality fit (30%)
   ├── Cost (total: license + integration + training) (25%)
   ├── Security & Compliance (20%) → Security Engineer review
   ├── Integration ease (15%) → Tech Lead assess
   └── Vendor stability (10%) → Funding, customers, roadmap
4. PILOT: Free trial with 2-3 team members (2 weeks)
5. DECIDE: CTO approve (tech) + CFO approve (budget)
6. CONTRACT: Trigger /contract-review → Negotiate terms
7. IMPLEMENT: Rollout plan (training, migration, cutover)
8. REVIEW: 90-day post-implementation review
```

## Budget Thresholds
| Annual Cost | Approval |
|------------|---------|
| <$500 | Manager |
| $500-$5K | CTO |
| $5K-$50K | CTO + CFO |
| >$50K | CTO + CFO + CEO |

## Vendor Exit Criteria
```
├── Data export: Can we get ALL our data out? In what format?
├── Lock-in: Minimum contract term? Cancellation penalty?
├── Migration: How hard to switch to alternative?
├── Contingency: What if vendor shuts down?
```
