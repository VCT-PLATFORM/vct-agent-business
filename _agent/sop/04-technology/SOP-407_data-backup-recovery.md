# SOP-407: Data Backup & Recovery — Sao lưu & Phục hồi

> **Actor**: DevOps Engineer + CTO | **Frequency**: Daily automatic + Monthly verification

## Backup Strategy (3-2-1 Rule)
```
3 copies of data
2 different storage media
1 off-site (different region/cloud)
```

## Backup Schedule
| Data Type | Frequency | Retention | Location |
|-----------|----------|----------|---------|
| Database (PostgreSQL) | Hourly WAL + Daily full | 30 days | Cloud + Off-site |
| File storage (S3/MinIO) | Daily incremental | 90 days | Cross-region |
| Configuration (IaC) | Every commit (Git) | Infinite | GitHub |
| Secrets/Keys | On change | Current + Previous | Vault/KMS |
| Logs | Daily | 90 days hot, 1 year cold | Log storage |

## Recovery Procedures

### Database Recovery
```
// turbo
├── Point-in-Time Recovery (PITR): Restore to specific timestamp
│   ├── RPO: <5 min (using WAL archiving)
│   ├── RTO: <1 hour
│   └── Test: Monthly → Restore to staging, verify data integrity
├── Full Restore: From latest daily backup
│   ├── RPO: <24 hours
│   ├── RTO: <2 hours
│   └── Use when: PITR fails or corruption detected
```

### Disaster Recovery
```
// turbo
├── Scenario 1: Single service down → Restart/Redeploy (RTO: <15 min)
├── Scenario 2: Database corruption → PITR (RTO: <1 hour)
├── Scenario 3: Full region outage → Failover to DR site (RTO: <4 hours)
├── Scenario 4: Ransomware → Isolated restore from clean backup (RTO: <8 hours)
```

## Monthly Verification
```
// turbo
├── [ ] Restore backup to staging environment
├── [ ] Verify data integrity (row count, checksum)
├── [ ] Test application functionality on restored data
├── [ ] Document recovery time (actual vs target)
├── [ ] Report to CTO
```
