# SOP-206: Email Marketing — Chiến dịch Email

> **Actor**: Content Writer + Marketing Manager | **Trigger**: Gửi email campaign, nurture sequence, hoặc transactional

## Email Types

| Type | Purpose | Frequency | Metrics |
|------|---------|-----------|---------|
| Newsletter | Value, updates, education | Weekly/Bi-weekly | Open, CTR |
| Product Update | New features, releases | Per release | Open, CTR, Activation |
| Nurture Sequence | Lead → Customer conversion | Automated | Conversion |
| Onboarding | User activation | Triggered | Activation rate |
| Re-engagement | Win back inactive users | Triggered | Reactivation |
| Transactional | Receipts, confirmations | Real-time | Delivery |

## Email Creation Process
```
// turbo
├── Brief: Objective, audience segment, key message, CTA
├── Write:
│   ├── Subject line: <50 chars, create curiosity/value, no clickbait
│   ├── Preview text: Complements subject line
│   ├── Body: 150-300 words, single CTA, mobile-first
│   ├── P.S.: Secondary CTA or social proof
│   └── Unsubscribe: Mandatory, easy to find
├── Design:
│   ├── Single column, 600px width
│   ├── Brand colors, logo
│   ├── Images: Alt text, <100KB each
│   └── CTA button: Contrasting color, action text
├── Test:
│   ├── Send test to 3 devices (Desktop, Mobile, Tablet)
│   ├── Spam score check
│   ├── Link verification
│   └── A/B test subject line (if list > 1000)
├── Approve: Marketing Manager
├── Send: Optimal time (Tue-Thu, 9-11 AM VN time)
├── Measure: Open rate (>25%), CTR (>3%), Unsubscribe (<0.5%)
```

## Automation Sequences

### Welcome Sequence (Post-signup)
```
// turbo
├── Email 1 (Immediate): Welcome + Quick start guide
├── Email 2 (Day 2): First value feature walkthrough
├── Email 3 (Day 5): Success story + Tip
├── Email 4 (Day 7): Feature #2 + Support offer
├── Email 5 (Day 14): Check-in + Feedback request
└── If not activated by Day 14 → Re-engagement trigger
```
