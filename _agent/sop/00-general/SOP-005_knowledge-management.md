# SOP-005: Knowledge Management — Quản lý Tri thức

> **Actor**: Mọi vai trò | **Trigger**: Tạo, lưu trữ, hoặc tìm kiếm tri thức tổ chức

## Mục đích
Đảm bảo kiến thức **không nằm trong đầu 1 người** mà được ghi nhận, tổ chức, và truy cập được bởi toàn tổ chức.

## Cấu trúc Tri thức

```
_agent/
├── COMPANY_CONTEXT.md              ← Tri thức công ty (cập nhật bởi CEO)
├── shared_knowledge/               ← Tri thức chung (brand, product, market)
├── sop/                            ← Quy trình vận hành
├── templates/                      ← Mẫu tài liệu
└── skills/[dept]/[role]/
    ├── SKILL.md                    ← Tri thức chuyên môn (tĩnh)
    ├── knowledge/                  ← Tài liệu tham khảo (do user nạp)
    └── memory/                     ← Tri thức từ vận hành (tự sinh)
        ├── discussions/
        ├── decisions/
        ├── deliverables/
        └── data/
```

## Quy trình Tạo & Lưu Tri thức

### Khi hoàn thành tác vụ
```
// turbo
├── Deliverable → memory/deliverables/YYYY-MM-DD_ten.md
├── Quyết định quan trọng → memory/decisions/ADR-XXX.md
├── Meeting notes → memory/discussions/YYYY-MM-DD_topic.md
├── Data mới → memory/data/ hoặc _shared_memory/data/
└── Nếu liên quan toàn phòng ban → _shared_memory/
```

### Khi cần tìm tri thức
```
// turbo
├── 1. SKILL.md của vai trò liên quan → Framework, best practices
├── 2. memory/ → Context từ thảo luận trước
├── 3. knowledge/ → Tài liệu tham khảo
├── 4. shared_knowledge/ → Thông tin toàn công ty
├── 5. COMPANY_CONTEXT.md → Metrics, OKRs, ICP hiện tại
└── 6. Phòng ban khác → Cross-reference nếu cần
```

### Quy tắc Đặt tên
```
Format: YYYY-MM-DD_mo-ta-ngan.md
├── ✅ 2026-03-27_ke-hoach-marketing-q2.md
├── ✅ ADR-001_chon-nats-jetstream.md
└── ❌ file1.md, untitled.md, new.md
```

### Review & Cleanup (Monthly)
```
// turbo
Actor: Mỗi Manager review memory/ của phòng mình
├── Archive tài liệu >6 tháng không dùng
├── Hợp nhất tài liệu trùng lặp
├── Cập nhật tài liệu outdated
└── Đảm bảo tính nhất quán
```
