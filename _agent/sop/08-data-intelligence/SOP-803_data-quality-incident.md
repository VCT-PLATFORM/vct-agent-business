# SOP-803: Data Quality Incident — Sự cố Chất lượng Dữ liệu

> **Actor**: Data Engineer + Head of Data | **Trigger**: Data sai, thiếu, muộn, hoặc không nhất quán

## Severity
| Level | Mô tả | Ví dụ | Response |
|-------|-------|-------|---------|
| DQ-1 | Data sai ảnh hưởng quyết định kinh doanh | Revenue report sai, KPI dashboard wrong | <1h |
| DQ-2 | Data muộn hoặc thiếu ảnh hưởng report | Pipeline failed, daily report trống | <4h |
| DQ-3 | Data inconsistency nhỏ | 2 dashboards show different numbers | <24h |

## Process
```
// turbo
1. DETECT: How was issue discovered?
   ├── Automated: Data quality monitor alerted (freshness, volume, schema)
   ├── Manual: User reported "numbers look wrong"
   └── Proactive: Routine data quality check found anomaly

2. ASSESS: Impact analysis
   ├── What data affected? (tables, metrics, dashboards)
   ├── How long has it been wrong? (since when?)
   ├── Who used this data for decisions? (notify them!)
   ├── Is it ongoing or historical?

3. FIX:
   ├── Source issue: Fix upstream (API, database, integration)
   ├── Pipeline issue: Fix transformation logic
   ├── Backfill: Replay/reprocess affected data
   ├── Dashboard: Verify corrected data shows correctly
   └── Notify: All stakeholders who consumed wrong data

4. PREVENT:
   ├── Add data quality test (dbt test, Great Expectations)
   ├── Add monitoring alert for this scenario
   ├── Document in data quality log
   └── Update Data Engineer SKILL.md if new pattern

5. POST-MORTEM: (for DQ-1 only)
   ├── Root cause analysis
   ├── Impact assessment (decisions affected)
   ├── Prevention measures implemented
   └── Lưu vào: data-intelligence/data-engineer/memory/decisions/
```
