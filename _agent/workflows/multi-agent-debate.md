---
description: Quy trình phản biện đa tác nhân giữa các phòng ban và cấp bậc — Red Team methodology
---

# /multi-agent-debate — Phản biện Đa tác nhân

> **SOP-002** | Áp dụng khi: Quyết định lớn, chiến lược mới, hoặc khi cần stress-test một ý tưởng

---

## Khi nào kích hoạt

- Đề xuất ảnh hưởng >$10K hoặc >3 tháng
- Chiến lược mới hoặc pivot
- Khi CEO/người dùng yêu cầu "phản biện" hoặc "challenge"
- Khi 2+ phòng ban có ý kiến trái chiều

## Thành phần Tham gia

| Vai trò | Trách nhiệm |
|---------|-------------|
| **Proposer (Đề xuất)** | Trình bày đề xuất + supporting evidence |
| **Red Team (Phản biện)** | Challenge mọi assumption, tìm blind spots |
| **Arbitrator (Trọng tài)** | CEO hoặc Executive cấp cao nhất — quyết định cuối |
| **Analyst (Phân tích)** | Data team cung cấp evidence cho cả hai bên |

## Red Team Assignment Matrix

| Khi Proposer là... | Red Team sẽ là... | Focus phản biện |
|--------------------|--------------------|----------------|
| Marketing/Sales | CFO + General Counsel | ROI, Legal risk, Budget |
| Technology | CFO + COO | Cost, Ops feasibility, Timeline |
| Finance | CSO + CTO | Strategy fit, Tech alternatives |
| HR | CFO + General Counsel | Budget, Labor law compliance |
| Strategy | Head of Data + CFO | Data evidence, Financial viability |
| Product | Sales Manager + CTO | Market demand, Tech feasibility |
| Operations | CTO + CHRO | Automation potential, People impact |

---

## Quy trình 6 Vòng

### Vòng 1: PRESENT — Trình bày Đề xuất
```
// turbo
Actor: Proposer
Format:
├── Problem statement (Vấn đề cần giải quyết)
├── Proposed solution (Giải pháp đề xuất)
├── Expected impact (Tác động kỳ vọng — quantified)
├── Resource requirements (Cần gì: tiền, người, thời gian)
├── Risk assessment (Rủi ro đã nhận diện)
└── Success criteria (Đo lường thành công bằng gì)
```

### Vòng 2: EVIDENCE — Phân tích Dữ liệu
```
// turbo
Actor: Data Analyst / Growth Analyst
Actions:
├── Verify giả định của Proposer bằng data
├── Benchmark vs industry / competitors
├── Sensitivity analysis: Nếu assumption sai 20% thì kết quả thay đổi thế nào?
├── Historical evidence: Công ty đã thử tương tự chưa? Kết quả?
Output: Data brief (supportive + contradictory evidence)
```

### Vòng 3: CHALLENGE — Phản biện (Red Team)
```
// turbo
Actor: Red Team (2-3 người từ các phòng ban khác)
Framework (Pre-mortem):
├── "Giả sử 12 tháng sau, dự án THẤT BẠI. Tại sao?"
├── "Assumption nào CHẮC CHẮN sai?"
├── "Đối thủ sẽ phản ứng thế nào?"
├── "Chi phí ẩn nào chưa tính?"
├── "Cơ hội chi phí (Opportunity cost) là gì?"
├── "Điều gì có thể giết chết dự án từ bên trong?"
└── "Worst case scenario — thiệt hại tối đa bao nhiêu?"

Output: Danh sách challenges + risks chưa addressed
```

### Vòng 4: DEFEND — Phản hồi
```
// turbo
Actor: Proposer
Actions:
├── Respond từng challenge:
│   ├── ACCEPT: "Đúng, chúng tôi sẽ mitigate bằng [action]"
│   ├── COUNTER: "Không đúng vì [evidence], và đây là data..."
│   └── ACKNOWLEDGE: "Rủi ro thật, nhưng chấp nhận vì [reason]"
├── Cập nhật đề xuất nếu cần
Output: Revised proposal (v2)
```

### Vòng 5: SYNTHESIZE — Tổng hợp
```
// turbo
Actor: Arbitrator (CEO/Executive)
Actions:
├── Tóm tắt observations từ cả 2 bên
├── Đánh giá:
│   ├── Evidence quality (data có đủ mạnh?)
│   ├── Risk tolerance (chấp nhận được mức rủi ro này?)
│   ├── Resource availability (có đủ nguồn lực?)
│   └── Strategic alignment (khớp OKR/chiến lược?)
Output: Synthesis report
```

### Vòng 6: DECIDE — Quyết định
```
// turbo
Actor: Arbitrator
Decision options:
├── ✅ APPROVE: Proceed as proposed (v2)
├── ✅ APPROVE WITH CONDITIONS: Proceed nhưng thêm guardrails
├── 🔄 PILOT: Thử nhỏ trước, review sau 30 ngày
├── 🔄 REVISE: Sửa đổi đáng kể, debate lại
├── ❌ REJECT: Không proceed, giải thích lý do
└── ⏸️ DEFER: Chưa đủ data, cần nghiên cứu thêm

Output: Decision Record (dùng template decision-record.md)
```

---

## Quy tắc Debate

1. **Attack ideas, not people** — Phản biện ý tưởng, không phải con người
2. **Data > Opinions** — Ý kiến có data mạnh hơn ý kiến không data
3. **Steel man, not straw man** — Hiểu đúng ý đối phương trước khi phản biện
4. **Time-boxed** — Mỗi vòng có giới hạn, không kéo dài vô hạn
5. **Written record** — Mọi thứ phải documented, lưu vào memory/decisions/
