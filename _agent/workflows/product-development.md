---
description: Quy trình phát triển tính năng sản phẩm từ ý tưởng đến phát hành — Product Development Lifecycle
---

# /product-development — Quy trình Phát triển Sản phẩm

> **SOP-012** | Áp dụng khi: Phát triển tính năng mới, cải tiến sản phẩm, hoặc fix bugs
> Actor: Product Manager + CTO + Tech Lead + UX/UI + QA

---

## Khi nào sử dụng
- Phát triển tính năng mới
- Cải tiến UX/UI
- Technical refactoring
- Bug fixing (non-incident)
- Khi người dùng hỏi về product development process

## Quy trình 7 Phase

### Phase 1: DISCOVER — Khám phá Vấn đề
```
// turbo
Actor: Product Manager
├── Sources of insight:
│   ├── User feedback (NPS comments, support tickets, interviews)
│   ├── Data analysis (funnel drop-offs, feature usage, churn reasons)
│   ├── Competitive analysis (what competitors are doing)
│   ├── Internal requests (Sales, Support, Engineering)
│   └── Strategic direction (OKRs, CEO/CSO vision)
├── Problem Statement: "For [persona], [problem] is a pain because [impact]"
├── Opportunity Sizing: How many users? Revenue impact?
├── Add to backlog with RICE score
```

### Phase 2: DEFINE — Định nghĩa Giải pháp
```
// turbo
Actor: Product Manager + UX/UI Designer
├── User Stories: "As a [persona], I want [action] so that [benefit]"
├── Acceptance Criteria: Given [context], When [action], Then [result]
├── Wireframes / Mockups: UX/UI Designer creates
├── PRD (Product Requirements Doc): Dùng template PRD trong PM SKILL.md
├── Scope: In Scope / Out of Scope clearly defined
├── Approval: CTO (technical feasibility) + CMO (market fit)
```

### Phase 3: DESIGN — Thiết kế
```
// turbo
Actor: UX/UI Designer + Solution Architect
├── UX:
│   ├── User flow diagrams
│   ├── Wireframes (low-fi → high-fi)
│   ├── Prototype (clickable)
│   ├── Usability review vs Nielsen's 10 heuristics
│   └── Accessibility check (WCAG 2.1 AA)
├── Tech:
│   ├── Architecture: ADR nếu cần design decision
│   ├── API contracts: Request/Response specs
│   ├── Database changes: Migration plans
│   └── Integration points: Third-party dependencies
├── Design Review: PM + Tech Lead + UX/UI align
```

### Phase 4: BUILD — Xây dựng
```
// turbo
Actor: Tech Lead + Developers
├── Sprint Planning: Break down into tasks, estimate, prioritize
├── Development:
│   ├── Feature branch workflow
│   ├── Code follows engineering standards (CTO SKILL.md)
│   ├── Unit tests alongside code (>80% coverage)
│   └── PR review by peer + Tech Lead
├── Integration: Merge to staging, integration tests
├── Security: Security Engineer review (if auth/data changes)
├── Daily standup: Progress, blockers, help needed
```

### Phase 5: TEST — Kiểm thử
```
// turbo
Actor: QA Specialist
├── Test Plan: Based on acceptance criteria
├── Testing layers:
│   ├── Functional: Does it work as specified?
│   ├── Regression: Did it break existing features?
│   ├── Edge cases: Boundary values, error states
│   ├── Cross-browser/device: Chrome, Safari, Mobile
│   ├── Performance: Load time, API response time
│   └── Security: OWASP checks (if applicable)
├── Bug reporting: Dùng template trong QA SKILL.md
├── Sign-off: QA approved → Ready for release
```

### Phase 6: RELEASE — Phát hành
```
// turbo
Actor: DevOps + Tech Lead + PM
├── Release strategy:
│   ├── Feature flag (gradual rollout: 5% → 25% → 50% → 100%)
│   ├── Blue/Green deployment
│   └── Canary release (for risky changes)
├── Release checklist:
│   ├── [ ] All tests pass
│   ├── [ ] Changelog updated
│   ├── [ ] Documentation updated
│   ├── [ ] Monitoring/Alerting configured
│   ├── [ ] Rollback plan ready
│   └── [ ] Support team briefed
├── Deploy → Monitor → Confirm stable
├── Nếu Tier 1/2: Trigger /campaign-launch
```

### Phase 7: LEARN — Đo lường & Học hỏi
```
// turbo
Actor: Product Manager + Growth Analyst
├── Feature adoption metrics (30 days post-launch):
│   ├── Adoption rate: % users who tried
│   ├── Activation rate: % users who completed key action
│   ├── Retention impact: Churn change for adopters vs non-adopters
│   └── Business impact: Revenue/NPS change
├── User feedback: Qualitative (interviews, surveys)
├── Decision: Iterate / Scale / Sunset
├── Retrospective: What did we learn? Document in memory/
```
