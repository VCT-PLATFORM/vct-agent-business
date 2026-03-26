---
description: Hành trình Lead → Khách hàng → Doanh thu — Full Revenue Lifecycle
---

# WF-003: Lead to Revenue — Hành trình Doanh thu

> Workflow xuyên tổ chức: **Marketing → Sales → Legal → Finance → Customer Success**

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ MARKETING│──▶│  SALES   │──▶│  LEGAL   │──▶│ FINANCE  │──▶│   CSM    │
│ Generate │   │ Convert  │   │ Contract │   │ Invoice  │   │ Retain   │
│  leads   │   │  deals   │   │  sign    │   │ & collect│   │ & expand │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

## Phase 1: GENERATE (Marketing)
```
// turbo
Actor: Marketing Manager + Content Writer + Social Media + SEO
├── Inbound: Content → SEO → Social → Website → Lead capture
├── Outbound: Email campaigns → Webinars → Events
├── Lead scoring: SOP-208 (Lead Management)
├── MQL threshold: Score ≥50 → Handoff to Sales
├── SLA: <5 min routing for demo requests
Trigger SOP: SOP-201 (Content), SOP-205 (Social), SOP-206 (Email)
```

## Phase 2: CONVERT (Sales)
```
// turbo
Actor: AE + Sales Manager
├── Qualify: BANT+ framework (SOP-203 Stage 3)
├── Demo: Customized to pain points
├── Proposal: Pricing + ROI projection
├── Negotiate: Discount authority (SM 15%, CMO 25%, CEO 25%+)
Trigger SOP: SOP-203 (Sales Process)
```

## Phase 3: CONTRACT (Legal)
```
// turbo
Actor: Contract Specialist + General Counsel
├── Draft SaaS agreement from template
├── Legal review (red flag check)
├── Counterparty negotiation (max 3 rounds)
├── Sign digitally
Trigger SOP: SOP-701 (Contract Review)
```

## Phase 4: COLLECT (Finance)
```
// turbo
Actor: Accounting Manager
├── Invoice generation (INV-YYYY-XXXX)
├── Revenue recognition (monthly for SaaS)
├── Payment follow-up (SLA: NET 15/30)
├── Reconciliation
Trigger SOP: SOP-303 (Invoice), SOP-304 (Month-End)
```

## Phase 5: RETAIN & EXPAND (Customer Success)
```
// turbo
Actor: CSM + Support
├── Onboard: SOP-501 (90-day journey)
├── Health monitor: Usage, NPS, engagement
├── QBR: Quarterly value demonstration
├── Expand: Upsell, cross-sell, seat expansion
├── Renew: 60 days before expiry
Trigger SOP: SOP-501 (Onboarding)
```

## Metrics Across Journey
| Phase | Key Metric | Target |
|-------|-----------|--------|
| Generate | MQL volume, CAC | ↑ MQLs, ↓ CAC |
| Convert | Win rate, Sales cycle | >25%, <45 days |
| Contract | Time-to-sign | <7 days |
| Collect | DSO (Days Sales Outstanding) | <30 days |
| Retain | NRR, Churn | >110%, <5% |
