# 📋 SOP Master Index — VCT Platform Enterprise Operations

> **Tổng cộng: 45 SOP** | 9 Phân loại | Bao phủ toàn bộ hoạt động doanh nghiệp
> Cập nhật lần cuối: 2026-03-27

---

## Cách sử dụng
- Mỗi SOP có **slash command** tương ứng trong `_agent/workflows/`
- Agent tự động chọn SOP phù hợp dựa trên yêu cầu
- Mỗi SOP tham chiếu SKILL.md của vai trò liên quan

## Sơ đồ Phân loại

```
SOP Library
├── 00-general/          (5 SOP) — Quy trình chung toàn tổ chức
├── 01-strategy/         (6 SOP) — Chiến lược & Lãnh đạo
├── 02-marketing-sales/  (9 SOP) — Marketing, Sales, Thương hiệu
├── 03-finance/          (6 SOP) — Tài chính & Kế toán
├── 04-technology/       (7 SOP) — Công nghệ & Sản phẩm
├── 05-operations/       (4 SOP) — Vận hành & Dịch vụ Khách hàng
├── 06-human-resources/  (5 SOP) — Nhân sự & Phát triển
├── 07-legal-compliance/ (5 SOP) — Pháp lý & Tuân thủ
└── 08-data-intelligence/(3 SOP) — Dữ liệu & Phân tích
```

---

## 00 — GENERAL (Quy trình Chung)

| SOP | Tên | Mô tả | Workflow |
|-----|-----|-------|---------|
| SOP-001 | Task Execution | Thực thi tác vụ end-to-end (7 bước) | `/task-execution` |
| SOP-002 | Multi-Agent Debate | Phản biện Red Team (6 vòng) | `/multi-agent-debate` |
| SOP-003 | Change Management | Quản lý thay đổi tổ chức | — |
| SOP-004 | Meeting Management | Tổ chức & điều hành cuộc họp | — |
| SOP-005 | Knowledge Management | Quản lý tri thức tổ chức | — |

## 01 — STRATEGY (Chiến lược)

| SOP | Tên | Mô tả | Workflow |
|-----|-----|-------|---------|
| SOP-101 | Strategic Planning | Lập kế hoạch chiến lược (PESTEL+SWOT+Porter) | `/strategic-planning` |
| SOP-102 | OKR Management | Thiết lập & quản lý OKR | `/okr-management` |
| SOP-103 | Business Review | Đánh giá kinh doanh định kỳ | `/business-review` |
| SOP-104 | Investor Relations | Gọi vốn & quan hệ nhà đầu tư | — |
| SOP-105 | Partnership Development | Phát triển đối tác chiến lược | — |
| SOP-106 | Crisis Management | Xử lý khủng hoảng doanh nghiệp | — |

## 02 — MARKETING & SALES

| SOP | Tên | Mô tả | Workflow |
|-----|-----|-------|---------|
| SOP-201 | Content Creation | Pipeline tạo nội dung | `/content-creation` |
| SOP-202 | Campaign Launch | Ra mắt chiến dịch GTM | `/campaign-launch` |
| SOP-203 | Sales Process | Pipeline bán hàng B2B | `/sales-process` |
| SOP-204 | Brand Management | Quản lý & bảo vệ thương hiệu | — |
| SOP-205 | Social Media Management | Quản lý kênh truyền thông xã hội | — |
| SOP-206 | Email Marketing | Chiến dịch email automation | — |
| SOP-207 | Event Management | Tổ chức sự kiện (online/offline) | — |
| SOP-208 | Lead Management | Quản lý & nurture leads | — |
| SOP-209 | Customer Referral | Chương trình giới thiệu khách hàng | — |

## 03 — FINANCE & ACCOUNTING

| SOP | Tên | Mô tả | Workflow |
|-----|-----|-------|---------|
| SOP-301 | Financial Planning | Lập kế hoạch tài chính | `/financial-planning` |
| SOP-302 | Expense Reimbursement | Tạm ứng & hoàn ứng chi phí | — |
| SOP-303 | Invoice & Billing | Xuất hóa đơn & thu tiền | — |
| SOP-304 | Month-End Closing | Khóa sổ cuối tháng | — |
| SOP-305 | Tax Filing | Kê khai & nộp thuế | — |
| SOP-306 | Audit Preparation | Chuẩn bị kiểm toán | — |

## 04 — TECHNOLOGY & PRODUCT

| SOP | Tên | Mô tả | Workflow |
|-----|-----|-------|---------|
| SOP-401 | Product Development | Phát triển sản phẩm (7 phase) | `/product-development` |
| SOP-402 | Incident Response | Xử lý sự cố (SEV1-4) | `/incident-response` |
| SOP-403 | Release Management | Quản lý phát hành phần mềm | — |
| SOP-404 | Code Review | Quy trình review code | — |
| SOP-405 | Security Audit | Kiểm tra bảo mật định kỳ | — |
| SOP-406 | Vendor Tool Evaluation | Đánh giá & mua công cụ | — |
| SOP-407 | Data Backup & Recovery | Sao lưu & phục hồi dữ liệu | — |

## 05 — OPERATIONS

| SOP | Tên | Mô tả | Workflow |
|-----|-----|-------|---------|
| SOP-501 | Customer Onboarding | Hội nhập khách hàng mới | — |
| SOP-502 | Support Escalation | Escalate ticket hỗ trợ | — |
| SOP-503 | Vendor Management | Quản lý nhà cung cấp | — |
| SOP-504 | Continuous Improvement | Cải tiến liên tục (Kaizen) | — |

## 06 — HUMAN RESOURCES

| SOP | Tên | Mô tả | Workflow |
|-----|-----|-------|---------|
| SOP-601 | Hiring | Tuyển dụng end-to-end | `/hiring` |
| SOP-602 | Performance Review | Đánh giá hiệu suất | — |
| SOP-603 | Employee Offboarding | Thủ tục nghỉ việc | — |
| SOP-604 | Learning & Development | Đào tạo & phát triển | — |
| SOP-605 | Employee Grievance | Xử lý khiếu nại nhân sự | — |

## 07 — LEGAL & COMPLIANCE

| SOP | Tên | Mô tả | Workflow |
|-----|-----|-------|---------|
| SOP-701 | Contract Review | Quản lý hợp đồng lifecycle | `/contract-review` |
| SOP-702 | Compliance Audit | Kiểm tra tuân thủ định kỳ | — |
| SOP-703 | Data Privacy DPIA | Đánh giá tác động dữ liệu | — |
| SOP-704 | IP Registration | Đăng ký sở hữu trí tuệ | — |
| SOP-705 | Dispute Resolution | Giải quyết tranh chấp | — |

## 08 — DATA & INTELLIGENCE

| SOP | Tên | Mô tả | Workflow |
|-----|-----|-------|---------|
| SOP-801 | Data Request | Yêu cầu phân tích dữ liệu | — |
| SOP-802 | A/B Testing | Thí nghiệm & thử nghiệm | — |
| SOP-803 | Data Quality Incident | Xử lý sự cố chất lượng dữ liệu | — |
