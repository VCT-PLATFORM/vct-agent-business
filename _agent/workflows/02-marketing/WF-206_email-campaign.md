---
description: Email campaign build → test → send → analyze lifecycle
---

# WF-206: Email Campaign

> Workflow: **Content Writer → Designer → MarketingMgr → Send → Analyze**

```
Brief → Write → Design → Test → Approve → Send → Analyze → Iterate
 MktgMgr Writer  Designer  QA    MktgMgr   Auto   Growth    Writer
```

## Flow → Xem SOP-206 (Email Marketing) cho chi tiết

## Automation Flows (Always-on)
```
// turbo
├── Welcome Sequence: Signup → 5 emails over 14 days
├── Onboarding: First login → Feature walkthroughs
├── Re-engagement: 14 days inactive → Win-back series
├── Nurture: MQL not ready → Monthly value emails
├── Renewal: 60 days before expiry → Renewal reminders
├── NPS Follow-up: After NPS survey → Action based on score
│   ├── 9-10: Referral ask
│   ├── 7-8: Feature education
│   └── 0-6: CSM personal outreach
```
