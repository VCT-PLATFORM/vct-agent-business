---
description: Identify → Register → Monitor → Enforce — IP Protection Lifecycle
---

# WF-803: IP Protection

> Workflow: **IP Specialist → GC → CTO → External agents**

## Flow → Xem SOP-704 (IP Registration) cho chi tiết

```
// turbo
Ongoing Protection Cycle:
├── IDENTIFY (Continuous):
│   ├── New brands/names → Trademark search → Register
│   ├── New code → Copyright auto-protected → Optional register
│   ├── New inventions → Patent assessment (rarely for SaaS)
│   └── Open source usage → License audit (quarterly)
├── REGISTER:
│   ├── Trademarks: NOIP filing → 12-18 month process
│   ├── Domains: All relevant TLDs
│   └── Copyright: Code, content, designs
├── MONITOR:
│   ├── Trademark watch service (monthly alerts)
│   ├── Domain monitoring (cybersquatting detection)
│   ├── Open source compliance (npm audit in CI/CD)
│   └── Employee IP assignment check (new hires)
├── ENFORCE:
│   ├── Infringement detected → GC assess severity
│   ├── Level 1: Cease & desist letter
│   ├── Level 2: DMCA takedown / Platform report
│   ├── Level 3: Legal action → SOP-705 (Dispute Resolution)
│   └── Document all enforcement actions
```
