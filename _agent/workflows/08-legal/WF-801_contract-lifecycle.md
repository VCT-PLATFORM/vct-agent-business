---
description: Quy trình soạn thảo, review và ký kết hợp đồng — Contract Lifecycle Management
---

# /contract-review — Quy trình Hợp đồng

> **SOP-010** | Áp dụng khi: Soạn, review, hoặc đàm phán bất kỳ hợp đồng nào
> Actor: Contract Specialist + General Counsel | Hỗ trợ: CFO, IP Specialist

---

## Khi nào sử dụng
- Ký hợp đồng với khách hàng mới
- Mua SaaS tool / vendor agreement
- Hợp đồng lao động
- NDA, MOU, Partnership agreement
- Khi người dùng yêu cầu "soạn hợp đồng", "review hợp đồng"

## Quy trình 6 Bước

### Bước 1: REQUEST — Yêu cầu Hợp đồng
```
// turbo
Actor: Requestor (AE, HR, CTO, etc.)
├── Loại hợp đồng: SaaS / Service / NDA / Employment / Vendor / Partner
├── Đối tác: Tên, quốc gia, quy mô
├── Giá trị: Tổng giá trị hợp đồng
├── Thời hạn: Start/end, renewal terms
├── Điều khoản đặc biệt: Discount, SLA, exclusivity?
```

### Bước 2: DRAFT — Soạn thảo
```
// turbo
Actor: Contract Specialist
├── Chọn template từ library (xem Contract Specialist SKILL.md)
├── Customize theo request
├── Checklist must-have clauses:
│   ├── ✅ Scope of services
│   ├── ✅ Payment terms
│   ├── ✅ IP ownership
│   ├── ✅ Confidentiality
│   ├── ✅ Limitation of liability
│   ├── ✅ Termination conditions
│   ├── ✅ Data processing (GDPR/NĐ13)
│   └── ✅ Dispute resolution
Output: Draft v1
```

### Bước 3: REVIEW — Review Pháp lý
```
// turbo
Actor: General Counsel
├── Risk assessment: Red flags? (xem GC SKILL.md)
├── IP check: IP Specialist review nếu có IP implications
├── Compliance: Compliance Officer check nếu data processing
├── Financial: CFO approve nếu >$50K
├── PASS / REVISE → Contract Specialist update
Output: Approved draft
```

### Bước 4: NEGOTIATE — Đàm phán
```
// turbo
Actor: Contract Specialist + Requestor
├── Send draft to counterparty
├── Track redlines (changes from other side)
├── Negotiation tactics (xem Contract Specialist SKILL.md)
├── Escalate to General Counsel nếu major changes
├── Each round: Update version number (v2, v3...)
├── Max 3 rounds trước khi escalate lên CEO
```

### Bước 5: SIGN — Ký kết
```
// turbo
Actor: Contract Specialist + Authorized signatory
├── Final review by GC (confirm no unauthorized changes)
├── Authorized signatory: CEO (>$100K), CFO (<$100K), Manager (<$10K)
├── Execution: Digital signature preferred
├── File: Original to Legal, Copy to Finance
```

### Bước 6: MANAGE — Quản lý Sau ký
```
// turbo
Actor: Contract Specialist
├── Log into contract register (title, parties, value, dates)
├── Set renewal/expiry alerts (60 days before expiry)
├── Track obligations (both sides)
├── Amendment process: Same flow as new contract for changes
├── Lưu vào: legal-compliance/contract-specialist/memory/deliverables/
```
