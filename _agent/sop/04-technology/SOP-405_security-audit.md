# SOP-405: Security Audit — Kiểm tra Bảo mật

> **Actor**: Security Engineer + CTO | **Frequency**: Quarterly + Post-major-release

## Quarterly Security Checklist
```
// turbo
├── Infrastructure:
│   ├── [ ] SSL/TLS certificates valid (not expiring within 30 days)
│   ├── [ ] All servers/containers patched (latest security updates)
│   ├── [ ] Firewall rules reviewed (no unnecessary open ports)
│   ├── [ ] SSH keys rotated (every 90 days)
│   └── [ ] Unused services/endpoints disabled
├── Application:
│   ├── [ ] Dependency scan (npm audit / Snyk / Dependabot)
│   ├── [ ] SAST scan (static analysis)
│   ├── [ ] OWASP Top 10 review (per feature)
│   ├── [ ] API authentication enforced on all endpoints
│   └── [ ] Rate limiting configured
├── Access Control:
│   ├── [ ] User access review (remove ex-employees, adjust roles)
│   ├── [ ] Admin accounts use MFA
│   ├── [ ] Service account keys rotated
│   ├── [ ] Principle of least privilege verified
│   └── [ ] Third-party app access reviewed (OAuth tokens)
├── Data:
│   ├── [ ] Encryption at rest verified (AES-256)
│   ├── [ ] Encryption in transit verified (TLS 1.3)
│   ├── [ ] PII data mapping updated
│   ├── [ ] Backup restoration tested
│   └── [ ] Data retention policy compliance
├── Monitoring:
│   ├── [ ] Security alerts configured and tested
│   ├── [ ] Audit logs enabled and retained (90+ days)
│   ├── [ ] Login anomaly detection active
│   └── [ ] Incident response plan reviewed + drill
```

## Output: Security Report
```
// turbo
├── Executive Summary: Overall security posture (Red/Amber/Green)
├── Findings: Severity (Critical/High/Medium/Low) + Description
├── Action Items: Fix + Owner + Deadline
├── Trend: vs Previous quarter
└── Send to: CTO + CEO + General Counsel
```
