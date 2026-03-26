# 🔍 Post-Mortem / Incident Review

| Mục | Nội dung |
|-----|---------|
| **Sự cố** | [Tên sự cố] |
| **Ngày xảy ra** | [YYYY-MM-DD HH:MM] |
| **Severity** | SEV1 / SEV2 / SEV3 / SEV4 |
| **Duration** | [Từ — Đến, tổng thời gian] |
| **Người viết** | [Tên] |
| **Tham gia xử lý** | [Danh sách] |

---

## Executive Summary
[1-3 câu: Chuyện gì xảy ra? Ảnh hưởng bao nhiêu? Đã fix chưa?]

## Impact
| Dimension | Detail |
|-----------|--------|
| Users affected | [Số lượng / % tổng] |
| Revenue impact | [VNĐ / USD] |
| Data loss | [Có / Không, chi tiết] |
| Reputation | [Mức độ ảnh hưởng] |

## Timeline (Minute by Minute)
| Thời gian | Sự kiện |
|----------|---------|
| HH:MM | [Sự cố bắt đầu] |
| HH:MM | [Phát hiện bởi monitoring / user report] |
| HH:MM | [On-call engineer engaged] |
| HH:MM | [Root cause identified] |
| HH:MM | [Fix deployed] |
| HH:MM | [Confirmed resolved] |

## Root Cause Analysis (5 Whys)
1. **Why**: [Tại sao sự cố xảy ra?]
2. **Why**: [Tại sao nguyên nhân #1 xảy ra?]
3. **Why**: [Tại sao nguyên nhân #2 xảy ra?]
4. **Why**: [...]
5. **Why**: [Root cause cuối cùng]

## What Went Well ✅
- [Phản hồi nhanh, monitoring phát hiện sớm, v.v.]

## What Went Poorly ❌
- [Chậm phát hiện, thiếu runbook, v.v.]

## Action Items (Prevent Recurrence)
| # | Action | Owner | Deadline | Priority |
|---|--------|-------|---------|----------|
| 1 | [Hành động ngăn chặn tái diễn] | [Ai] | [Ngày] | P1 |
| 2 | [Cải tiến monitoring/alerting] | [Ai] | [Ngày] | P2 |

> ⚠️ **Nguyên tắc**: Post-mortem là BLAMELESS. Mục đích là cải tiến hệ thống, KHÔNG truy cứu cá nhân.
