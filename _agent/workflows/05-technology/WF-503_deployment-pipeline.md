---
description: Build → Test → Stage → Approve → Production — Deployment Pipeline
---

# WF-503: Deployment Pipeline

> Workflow: **Dev → CI/CD → QA → Tech Lead → DevOps → Production**

```
Commit → Build → Test → Stage → Approve → Deploy → Verify
  Dev    CI/CD   CI/CD   DevOps  TechLead  DevOps   DevOps+QA
```

## Pipeline Flow
```
// turbo
1. COMMIT: Developer pushes to feature branch
   └── Auto: Lint + Unit tests → PR created

2. BUILD: CI pipeline (GitHub Actions)
   ├── Compile / Build
   ├── Unit tests (must > 80% coverage)
   ├── Lint + Format check
   └── Security scan (npm audit, SAST)

3. TEST: CI pipeline continues
   ├── Integration tests
   ├── E2E tests (critical paths)
   └── Performance baseline check

4. STAGE: Auto-deploy to staging
   ├── Smoke tests on staging
   ├── QA manual testing (if major feature)
   └── PM reviews UX on staging

5. APPROVE:
   ├── Tech Lead reviews PR → Approve
   ├── Release checklist verified → SOP-403
   └── If major release: CTO approval

6. DEPLOY: To production
   ├── Strategy: Blue/Green or Canary (5% → 25% → 100%)
   ├── Feature flag: Gradual rollout
   └── Rollback plan ready

7. VERIFY: Post-deploy
   ├── Health checks (API, error rates, latency)
   ├── Smoke test production
   ├── Monitor 1h
   └── If issue → Rollback within 15 min
```
