# SOP-403: Release Management — Quản lý Phát hành

> **Actor**: Tech Lead + DevOps + PM | **Trigger**: Deploy code lên staging/production

## Release Types
| Type | Frequency | Risk | Approval |
|------|----------|------|---------|
| Hotfix | As needed | Low-Med | Tech Lead |
| Patch | Weekly | Low | Tech Lead |
| Minor Release | Bi-weekly | Medium | CTO |
| Major Release | Monthly/Quarterly | High | CTO + CEO |

## Release Checklist
```
// turbo
├── Pre-Release:
│   ├── [ ] All PRs merged, code freeze
│   ├── [ ] All tests passing (unit + integration + E2E)
│   ├── [ ] Changelog updated
│   ├── [ ] Feature flags configured
│   ├── [ ] Database migrations reviewed (no destructive changes)
│   ├── [ ] Rollback plan documented
│   ├── [ ] Performance impact assessed
│   └── [ ] Security review (if auth/data changes)
├── Release:
│   ├── [ ] Deploy to staging → Smoke test (15 min)
│   ├── [ ] Deploy to production (blue/green or canary)
│   ├── [ ] Health check: API response, error rate, latency
│   ├── [ ] Feature verification on production
│   └── [ ] Customer Support team notified
├── Post-Release:
│   ├── [ ] Monitor 1h: Error rate, latency, CPU/Memory
│   ├── [ ] Confirm metrics stable
│   ├── [ ] Close release ticket/PR
│   └── [ ] If issue → Rollback within 15 min
```
