# SOP-703: Data Privacy DPIA — Đánh giá Tác động Dữ liệu

> **Actor**: Compliance Officer + CTO | **Trigger**: Xử lý dữ liệu nhạy cảm hoặc quy mô lớn

## Khi nào cần DPIA
- Thu thập dữ liệu cá nhân nhạy cảm (y tế, tài chính, sinh trắc)
- Xử lý dữ liệu quy mô lớn (>10,000 data subjects)
- Monitoring/Profiling tự động (AI scoring, tracking)
- Chuyển dữ liệu xuyên biên giới
- Tính năng mới xử lý PII theo cách mới

## DPIA Template
```
// turbo
1. DESCRIBE: Processing activity
   ├── What data: Types of personal data collected
   ├── From whom: Data subjects (customers, employees, visitors)
   ├── Purpose: Why we process this data
   ├── Legal basis: Consent / Contract / Legitimate interest
   ├── How long: Retention period
   └── Who accesses: Internal roles + Third parties

2. ASSESS NECESSITY:
   ├── Is this data NECESSARY for the stated purpose?
   ├── Can we achieve the same goal with LESS data?
   ├── Is the processing PROPORTIONATE to the benefit?

3. IDENTIFY RISKS:
   ├── Unauthorized access (breach)
   ├── Data loss or corruption
   ├── Excessive data collection
   ├── Lack of transparency
   ├── Cross-border transfer risks
   └── Score: Likelihood × Impact (1-5 each)

4. MITIGATE:
   ├── Technical: Encryption, access control, anonymization
   ├── Organizational: Training, policies, DPA with vendors
   ├── Procedural: Consent management, breach response plan
   └── For each risk: Action + Owner + Deadline

5. APPROVE:
   ├── Compliance Officer sign-off
   ├── CTO sign-off (technical measures adequate)
   ├── General Counsel sign-off (legal basis valid)
   └── If high residual risk → CEO + Board informed
```
