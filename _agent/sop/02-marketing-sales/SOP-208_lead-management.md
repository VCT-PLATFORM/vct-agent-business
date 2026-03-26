# SOP-208: Lead Management — Quản lý Leads

> **Actor**: Marketing Manager + Sales Manager + AE | **Trigger**: Lead mới phát sinh từ mọi channel

## Lead Lifecycle

```
Visitor → Lead → MQL → SQL → Opportunity → Customer
         ↓        ↓       ↓        ↓
       Capture  Score   Qualify  Convert
```

## Lead Scoring Model

| Criteria | Points | Examples |
|----------|--------|---------|
| **Demographic Fit** | | |
| ICP match (industry, size) | +20 | SaaS company, 10-50 employees |
| Decision maker title | +15 | CEO, VP, Director |
| Vietnam-based | +10 | Domestic market |
| **Behavioral Signals** | | |
| Visited pricing page | +15 | |
| Downloaded resource | +10 | |
| Attended webinar | +10 | |
| Requested demo | +25 | |
| Opened 3+ emails | +5 | |
| **Negative Signals** | | |
| Student/Intern email | -20 | @edu.vn, @gmail no company |
| Competitor | -50 | |
| Unsubscribed | -30 | |

**MQL threshold: ≥50 points → Route to Sales**

## Routing & SLA

| Lead Source | Route To | Response SLA |
|------------|---------|-------------|
| Demo request | AE (round-robin) | <5 min (business hours) |
| Pricing inquiry | AE | <1 hour |
| Content download | Nurture sequence | Immediate (automated) |
| Webinar attendee | AE (if score ≥50) | <24 hours |
| Referral | Senior AE | <2 hours |

## Nurture Sequence (MQL not ready)
```
// turbo
├── Week 1: Educational content (blog, video)
├── Week 2: Case study relevant to their industry
├── Week 3: Feature comparison / ROI calculator
├── Week 4: Offer consultation / free audit
├── Reassess score after 30 days → If ≥50, route to Sales
└── If still <50 → Continue long-term nurture (monthly)
```
