---
description: Quy trình tuyển dụng end-to-end từ xác định nhu cầu đến onboarding nhân viên mới
---

# /hiring — Quy trình Tuyển dụng

> **SOP-008** | Áp dụng khi: Cần tuyển nhân viên mới
> Actor: CHRO + Recruiter + HR Ops + Hiring Manager

---

## Khi nào sử dụng
- Phòng ban cần thêm headcount
- Thay thế nhân viên nghỉ việc
- Tuyển cho vị trí mới được tạo
- Khi người dùng yêu cầu "tuyển dụng", "viết JD", "phỏng vấn"

## Quy trình 7 Bước

### Bước 1: REQUEST — Yêu cầu Tuyển dụng
```
// turbo
Actor: Hiring Manager (người cần tuyển)
├── Headcount Request:
│   ├── Vị trí + Level + Phòng ban
│   ├── Lý do tuyển (new role / replacement / growth)
│   ├── Budget dự kiến (salary range)
│   ├── Timeline mong muốn
│   └── Business justification (ROI of this hire)
├── Approval chain:
│   ├── CHRO → Approve role & level
│   ├── CFO → Approve budget
│   └── CEO → Approve nếu >3 headcounts hoặc C-level
```

### Bước 2: JD — Viết Job Description
```
// turbo
Actor: Recruiter + Hiring Manager
├── Xem framework JD trong Recruiter SKILL.md
├── Structure:
│   ├── Hook (why this role matters)
│   ├── About VCT Platform (từ COMPANY_CONTEXT.md)
│   ├── What You'll Do (5-7 impact-oriented bullets)
│   ├── What You'll Bring (4-5 must-haves)
│   ├── Nice to Have (2-3)
│   ├── What We Offer (salary range + benefits)
│   └── How to Apply
├── Review: CHRO approve JD
```

### Bước 3: SOURCE — Tìm kiếm Ứng viên
```
// turbo
Actor: Recruiter
├── Chọn channels phù hợp (xem Recruiter SKILL.md)
├── Priority:
│   ├── 1. Employee referral (announce internally)
│   ├── 2. Direct sourcing (LinkedIn, community)
│   ├── 3. Job boards (ITviec, TopDev, VietnamWorks)
│   └── 4. Headhunter (nếu senior/C-suite)
├── Target: 20-30 qualified applicants
├── Screen CVs → Shortlist 8-10 candidates
```

### Bước 4: INTERVIEW — Phỏng vấn
```
// turbo
Actor: Recruiter + Hiring Manager + Cross-functional

Round 1 — Phone Screen (Recruiter, 20 min):
├── Culture fit, salary expectations, availability
├── Pass/Fail → Shortlist 5-6

Round 2 — Technical/Skill Assessment (Hiring Manager, 60 min):
├── Role-specific evaluation
├── Structured scorecard (4-point scale)
├── Pass/Fail → Shortlist 3-4

Round 3 — Cross-functional (Peer + Skip-level, 45 min):
├── Values alignment, collaboration style
├── Behavioral questions (STAR method)
├── Pass/Fail → Final 1-2

Round 4 — Final (CHRO or CEO for senior roles, 30 min):
├── Culture add, growth potential, motivation
├── Sell the opportunity
```

### Bước 5: DECIDE — Quyết định
```
// turbo
Actor: Hiring Manager + Recruiter + CHRO
├── Debrief: Share scores BEFORE discussing (avoid bias)
├── Consensus check: Strong Hire needed from ≥2/3 interviewers
├── Offer details: Level, salary, start date, ESOP (if applicable)
├── Backup candidate identified
```

### Bước 6: OFFER — Gửi Offer
```
// turbo
Actor: Recruiter + HR Ops
├── Verbal offer call (Recruiter → Candidate)
├── Written offer letter (HR Ops)
├── Contract preparation (Contract Specialist nếu cần)
├── Negotiate nếu candidate counter-offer
├── Deadline: 5 business days to accept
├── Nếu reject → Offer backup candidate
```

### Bước 7: ONBOARD — Hội nhập
```
// turbo
Actor: HR Ops + Hiring Manager
├── Pre-day-1: IT setup, accounts, equipment
├── Dùng onboarding checklist (xem HR Ops SKILL.md — 30/60/90 plan)
├── Buddy assignment (peer mentor)
├── Week 1: Product training, team intro, first OKRs
├── Day 30: Check-in
├── Day 90: Probation evaluation
├── Lưu vào: human-resources/recruiter/memory/deliverables/
```
