# Reporting Standards — Chuẩn Báo cáo Định kỳ

> **Mục đích**: Quy định ai báo cáo gì, bao lâu 1 lần, dùng template nào, và gửi cho ai.

---

## Lịch Báo cáo

### Hàng Tuần (Weekly)

| Phòng ban | Người báo cáo | Template | Gửi cho | Deadline |
|-----------|--------------|---------|---------|---------|
| Marketing | Marketing Manager | `weekly-report.md` | CMO | Thứ 6, 17:00 |
| Sales | Sales Manager | `weekly-report.md` | CMO | Thứ 6, 17:00 |
| Technology | Tech Lead | `weekly-report.md` | CTO | Thứ 6, 17:00 |
| Operations | Project Manager | `weekly-report.md` | COO | Thứ 6, 17:00 |
| Finance | Financial Analyst | `weekly-report.md` | CFO | Thứ 6, 17:00 |
| HR | Recruiter + HR Ops | `weekly-report.md` | CHRO | Thứ 6, 17:00 |
| Data | Data Analyst | `weekly-report.md` | Head of Data | Thứ 6, 17:00 |
| **All C-suite** | Mỗi Executive | 5-bullet summary | **CEO** | **Thứ 2, 09:00** |

### Hàng Tháng (Monthly)

| Phòng ban | Người báo cáo | Template | Gửi cho | Deadline |
|-----------|--------------|---------|---------|---------|
| Marketing | CMO | `monthly-report.md` | CEO | Ngày 5 tháng sau |
| Finance | CFO | `monthly-report.md` | CEO | Ngày 5 tháng sau |
| Technology | CTO | `monthly-report.md` | CEO | Ngày 5 tháng sau |
| Operations | COO | `monthly-report.md` | CEO | Ngày 5 tháng sau |
| HR | CHRO | `monthly-report.md` | CEO | Ngày 5 tháng sau |
| Legal | General Counsel | `monthly-report.md` | CEO | Ngày 5 tháng sau |
| Data | Head of Data | `monthly-report.md` | CEO | Ngày 5 tháng sau |

### Hàng Quý (Quarterly)

| Báo cáo | Người thực hiện | Phục vụ | Template |
|---------|----------------|---------|---------|
| **OKR Review** | Mỗi phòng ban | CEO + All Hands | `okr.md` |
| **Financial Report** | CFO + Accounting | CEO + Board | `monthly-report.md` (expanded) |
| **QBR (Quarterly Business Review)** | CEO + All C-suite | Board / Investor | Workflow `/business-review` |
| **Strategic Review** | CSO + CEO | Board | Workflow `/strategic-planning` |
| **People Review** | CHRO | CEO | Custom (headcount, engagement, attrition) |
| **Security & Compliance** | Security + Compliance | CTO + GC | Audit checklist |

---

## Metrics Dashboard — Mỗi phòng ban giám sát

| Phòng ban | Metrics Chính | Cập nhật |
|-----------|-------------|---------|
| **Marketing** | CAC, MQLs, Website traffic, Engagement rate | Weekly |
| **Sales** | Pipeline value, Win rate, ARR, Quota attainment | Weekly |
| **Finance** | MRR, Burn rate, Runway, Gross margin | Monthly |
| **Technology** | Uptime, Deploy frequency, MTTR, Bug count | Weekly |
| **Operations** | CSAT, FRT, Resolution time, SLA compliance | Weekly |
| **HR** | Headcount, Time-to-hire, Attrition, eNPS | Monthly |
| **Legal** | Open contracts, Compliance score, Risk items | Monthly |
| **Data** | Data freshness, Pipeline health, Query volume | Weekly |

---

## Quy tắc Báo cáo

1. **Đúng hạn** — Trễ deadline = không có data → quyết định bị trì hoãn.
2. **So What?** — Mỗi con số phải kèm insight: Tại sao tăng/giảm? Cần action gì?
3. **Action-oriented** — Kết thúc báo cáo bằng "Next Steps", không chỉ "summary".
4. **No surprises** — Bad news nên escalate NGAY, không đợi đến báo cáo định kỳ.
5. **Lưu trữ** — Mọi báo cáo lưu vào `memory/` của vai trò tương ứng.
