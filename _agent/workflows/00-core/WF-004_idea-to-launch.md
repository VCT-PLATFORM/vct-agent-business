---
description: Ý tưởng → Sản phẩm → Thị trường — Full Product Lifecycle
---

# WF-004: Idea to Launch — Hành trình Sản phẩm

> Workflow: **Product → Tech → QA → Marketing → Sales → Data**

```
Discovery → Define → Design → Build → Test → Launch → Measure
   PM         PM      UX/UI    Dev     QA     Mktg    Data
```

## Flow
```
// turbo
1. DISCOVER (PM): User pain → Opportunity sizing → RICE score
   └── Trigger: SOP-401 Phase 1

2. DEFINE (PM + UX/UI): PRD → User stories → Wireframes
   └── Trigger: SOP-401 Phase 2-3

3. BUILD (Tech Lead + Dev): Sprint planning → Code → PR review
   └── Trigger: SOP-401 Phase 4, SOP-404 (Code Review)

4. TEST (QA): Functional → Regression → Security → Performance
   └── Trigger: SOP-401 Phase 5

5. LAUNCH (Marketing + DevOps):
   ├── Tech: Feature flag → Canary → 100% rollout
   │   └── Trigger: SOP-403 (Release Management)
   ├── Marketing: Assets → Comms → Publish
   │   └── Trigger: SOP-202 (Campaign Launch)
   └── Sales: Enablement → Update pitch

6. MEASURE (Data + PM): Adoption → Retention impact → ROI
   └── Trigger: SOP-801 (Data Request)
```
