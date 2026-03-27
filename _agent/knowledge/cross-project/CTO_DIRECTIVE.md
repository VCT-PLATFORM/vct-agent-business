# 🔗 CTO Cross-Project Directive

> **Mục đích**: Định nghĩa cách CTO điều phối giữa các dự án trong hệ sinh thái VCT Platform.
> **Cập nhật**: 27/03/2026

---

## 1. Bản đồ Hệ sinh thái

```
                    ┌─────────────────────────────────┐
                    │   👔 CHAIRMAN (User)             │
                    │   Ra chỉ thị qua Jen             │
                    └──────────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │   🎩 JEN — Chief of Staff        │
                    │   D:\VCT PLATFORM\               │
                    │   vct-agent-business             │
                    │   (35 roles, 8 departments)      │
                    └──────────────┬──────────────────┘
                                   │ delegate
                    ┌──────────────▼──────────────────┐
                    │   🔧 CTO — Technology Officer    │
                    │   Giám sát kỹ thuật toàn hệ thống│
                    └───────┬──────────────┬──────────┘
                            │              │
              ┌─────────────▼───┐  ┌───────▼─────────────┐
              │  ⚡ JAVIS        │  │  🧠 TOM / JACK       │
              │  Commander       │  │  Chief Commander     │
              │  vct-platform    │  │  vct-website         │
              │                  │  │                      │
              │  D:\VCT PLATFORM\│  │  D:\VCT PLATFORM\    │
              │  vct-platform    │  │  vct-website         │
              │                  │  │                      │
              │  • Backend Go    │  │  • Frontend HTML/CSS │
              │  • Monorepo TS   │  │  • Vanilla JS        │
              │  • 50+ skills    │  │  • 24 agents         │
              │  • Docker/K8s    │  │  • Neo-Glassmorphism │
              └──────────────────┘  └──────────────────────┘
```

## 2. Nhân sự Kỹ thuật

| Agent | Dự án | Vai trò | Workspace |
|-------|-------|---------|-----------|
| **Javis** | VCT Platform | Master Commander — Backend, API, Infrastructure | `D:\VCT PLATFORM\vct-platform` |
| **Jack** | VCT Website | Chief Commander — Frontend, UI/UX, SEO | `D:\VCT PLATFORM\vct-website` |
| **CTO** | Cross-project | Giám sát kiến trúc, quyết định công nghệ, phân bổ priority | `vct-agent-business` |

## 3. Quy tắc Phối hợp

### 3.1 Khi Chairman ra lệnh liên quan Backend/API/Infra
```
Chairman → Jen → CTO → Javis (vct-platform)

 Javis sẽ:
   1. Đọc SKILL.md và context dự án tại vct-platform/
   2. Delegate cho specialists (SA, DBA, DevOps, Backend-Go...)
   3. Báo cáo kết quả → CTO → Jen → Chairman
```

### 3.2 Khi Chairman ra lệnh liên quan Frontend/Website/UI
```
Chairman → Jen → CTO → Jack (vct-website)

Jack sẽ:
   1. Đọc SKILL.md và context dự án tại vct-website/
   2. Delegate cho specialists (UX Designer, Performance, i18n...)
   3. Báo cáo kết quả → CTO → Jen → Chairman
```

### 3.3 Khi nhiệm vụ cần PHỐI HỢP cả 2 dự án
```
VD: "Tạo API mới + hiển thị lên website"

Chairman → Jen → CTO
                  ├──→ Javis: Tạo API endpoint (vct-platform)
                  └──→ Jack: Tạo UI consume API (vct-website)

CTO chịu trách nhiệm:
  • Đảm bảo API contract (request/response schema) nhất quán
  • Sync tiến độ giữa 2 dự án
  • Phát hiện conflicts sớm
```

## 4. Giao thức Liên lạc

| Kênh | Nội dung |
|------|----------|
| `_agent/knowledge/cross-project/` | Tài liệu kỹ thuật dùng chung (API specs, shared types) |
| Telegram Bot | CTO push thông báo kỹ thuật cho Chairman |
| Git | Mỗi dự án push code riêng biệt |

## 5. Escalation Rules

| Tình huống | Xử lý |
|------------|-------|
| Bug chỉ ở 1 dự án | Javis / Jack tự fix, báo CTO |
| Bug ảnh hưởng cả 2 dự án | CTO coordinate, Javis + Jack cùng fix |
| Thay đổi kiến trúc lớn | CTO → Jen → Chairman phê duyệt |
| Downtime production | CTO + Javis (infra) → Incident Protocol |
