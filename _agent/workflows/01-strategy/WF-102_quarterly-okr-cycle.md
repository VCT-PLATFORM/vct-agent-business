---
description: Quy trình thiết lập và quản lý OKR (Objectives & Key Results) cho doanh nghiệp
---

# /okr-management — Quản lý OKR

> **SOP-005** | Áp dụng khi: Thiết lập, check-in, hoặc đánh giá OKR
> Actor chính: CEO + CSO + All Executives

---

## Khi nào sử dụng
- Đầu quý: Thiết lập OKR mới
- Giữa quý: Check-in tiến độ
- Cuối quý: Scoring & Reflection
- Khi người dùng yêu cầu "lập OKR" hoặc "review OKR"

## Quy trình theo Giai đoạn

### Phase 1: SET — Thiết lập OKR (Đầu quý)

```
// turbo
Step 1.1 — CEO định hướng Company Objectives (2-3 max)
├── Dựa trên: Strategic Plan, metrics hiện tại, board feedback
├── Format: "Verb + outcome + impact"
│   ├── ✅ "Tăng trưởng doanh thu gấp 2 để chứng minh product-market fit"
│   └── ❌ "Tăng doanh thu" (quá mơ hồ)

Step 1.2 — CEO + Executives xác định Key Results
├── Mỗi Objective: 3-5 Key Results
├── KR phải: Measurable, Time-bound, Ambitious nhưng achievable
├── Target stretch: 70% completion = success
│   ├── ✅ "Tăng MRR từ 50M → 120M VNĐ vào 31/3"
│   └── ❌ "Tăng MRR" (không có số)

Step 1.3 — Cascade xuống Departments
├── Mỗi Dept OKR phải ALIGN với ít nhất 1 Company KR
├── Department Head set Dept OKRs → CEO approve
├── Manager set Team OKRs → Department Head approve
├── Dùng template okr.md

Step 1.4 — Publish & Align
├── Tất cả OKRs transparent (mọi phòng ban thấy nhau)
├── Cross-check: Có OKR nào conflict giữa các dept?
├── Cập nhật COMPANY_CONTEXT.md Section 8
```

### Phase 2: CHECK-IN — Theo dõi (Hàng tuần/tháng)

```
// turbo
Weekly (5 min per OKR):
├── Cập nhật "Current" value cho mỗi KR
├── Confidence level: High (🟢) / Medium (🟡) / Low (🔴)
├── Nếu 🔴: Root cause + Action plan

Monthly (30 min):
├── Formal OKR review meeting
├── Scoring: 0.0 → 1.0 cho mỗi KR
├── Forecast: Cuối quý sẽ đạt bao nhiêu?
├── Adjust: Cần thay đổi approach? (không đổi target!)
├── Blockers: Escalate nếu cần cross-dept support
```

### Phase 3: SCORE — Đánh giá (Cuối quý)

```
// turbo
Step 3.1 — Self-score
├── Mỗi KR owner tự đánh giá: 0.0 → 1.0
├── 0.7-1.0: 🟢 Đạt / Vượt
├── 0.4-0.6: 🟡 Tiến bộ nhưng chưa đạt
├── 0.0-0.3: 🔴 Thất bại — cần phân tích

Step 3.2 — Reflection (Quan trọng hơn Score!)
├── Mỗi Objective, trả lời:
│   ├── "Chúng ta đã HỌC ĐƯỢC gì?"
│   ├── "Điều gì SURPRISE chúng ta?"
│   ├── "Nếu làm lại, sẽ làm KHÁC gì?"
│   └── "Objective này có còn RELEVANT cho quý sau?"

Step 3.3 — Share & Celebrate
├── CEO tổng hợp Company OKR scorecard
├── Celebrate wins (dù nhỏ)
├── Acknowledge learnings from misses (không blame)
├── Input cho Phase 1 quý tiếp theo
├── Lưu vào: strategy-office/ceo/memory/reports/
```

---

## OKR Anti-patterns (Tránh!)

| ❌ Sai | ✅ Đúng |
|--------|---------|
| KR = Tasks ("Launch feature X") | KR = Outcomes ("Tăng activation rate 20%") |
| 10+ OKRs per team | 2-3 Objectives, 3-5 KRs each |
| OKR = Business-as-usual | OKR = Stretch beyond normal work |
| Change targets mid-quarter | Change approach, keep targets |
| OKR tied to compensation | OKR tied to learning & growth |
| Set-and-forget | Weekly check-in minimum |
