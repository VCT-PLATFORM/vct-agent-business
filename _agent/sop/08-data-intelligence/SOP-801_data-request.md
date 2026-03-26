# SOP-801: Data Request — Yêu cầu Phân tích Dữ liệu

> **Actor**: Data Analyst + Head of Data | **Trigger**: Bất kỳ phòng ban nào cần phân tích data

## Request Process
```
// turbo
1. REQUEST: Requester fills data request:
   ├── Business question (WHAT do you want to know?)
   ├── Context (WHY do you need this? What decision will it inform?)
   ├── Deadline (WHEN do you need it?)
   └── Priority: P1 (<24h) / P2 (<3 days) / P3 (<1 week)

2. TRIAGE: Head of Data assigns + estimates
   ├── Quick query (<1h): Data Analyst
   ├── Analysis (<1 day): Data Analyst with review
   ├── Deep dive (>1 day): Data Analyst + Growth Analyst

3. ANALYZE: Following analysis template (see Data Analyst SKILL.md)
   ├── Methodology documented
   ├── Data sources cited
   ├── Caveats noted UPFRONT

4. REVIEW: Head of Data quality check
   ├── Numbers make sense (sanity check)
   ├── Methodology sound
   ├── Visualization clear

5. DELIVER: Data Analyst presents to requester
   ├── Key finding (1 sentence)
   ├── Supporting data
   ├── Recommended action
   └── Lưu vào: data-intelligence/data-analyst/memory/deliverables/
```

## Self-Service Enablement
```
// turbo
├── Dashboard library: Common metrics available via Metabase/Superset
├── Metric definitions: Documented in shared_knowledge/product/
├── Training: Quarterly SQL basics for non-technical teams
├── Goal: 60% of requests deflected by self-service
```
