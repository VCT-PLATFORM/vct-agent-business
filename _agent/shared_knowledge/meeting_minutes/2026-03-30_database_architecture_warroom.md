# BIÊN BẢN HỌP — PHÒNG HỌP TỔ BỘ (WAR ROOM)

**Công ty:** CÔNG TY TNHH VCT PLATFORM · MST: 3401284869  
**Ngày họp:** 30/03/2026 · 20:19 — 22:38 (ICT, GMT+7)  
**Hình thức:** Họp Trực tuyến qua Hệ thống AI Agent  
**Chủ tọa:** Hoàng Bá Tùng — Chairman / Tổng Giám Đốc  
**Trạng thái:** 🔒 **ARCHITECTURE + INFRASTRUCTURE FREEZE — v4.0 FINAL**

---

## THÀNH PHẦN THAM DỰ

| STT | Họ tên / Mã hiệu | Chức vụ                     | Vai trò trong cuộc họp                   |
| :-: | :--------------- | :-------------------------- | :--------------------------------------- |
|  1  | Hoàng Bá Tùng    | Chairman / CEO              | Chủ tọa, Ra quyết định                   |
|  2  | Jen              | Chánh Văn Phòng (CoS)       | Điều phối, Ghi biên bản                  |
|  3  | Javis            | Master Commander (AI Agent) | Kiến trúc sư Hệ thống, Tư vấn Chiến lược |
|  4  | Jon              | CTO / Giám đốc Công nghệ    | Tư vấn Kỹ thuật, Triển khai Backend      |
|  5  | Head of Data     | Giám đốc Dữ liệu            | Reviewer chuyên gia, Phản biện Blind Spots |
|  6  | Data Engineer    | Kỹ sư Dữ liệu Cấp cao       | Reviewer chuyên gia, Tư vấn Connection Pooling |
|  7  | General Counsel  | Giám đốc Pháp lý            | Tư vấn NĐ 13/2023, Luật ANMG 2018       |
|  8  | Compliance Officer | Chuyên viên Tuân thủ       | Tư vấn DPIA, Privacy Policy, Consent     |

---

## MỤC ĐÍCH CUỘC HỌP

Thảo luận và chốt **Kiến trúc Cơ sở Dữ liệu (Database Architecture)** dài hạn cho toàn bộ Hệ sinh thái VCT Platform, bao gồm: lựa chọn công nghệ, mô hình phân tách dữ liệu, cơ chế ánh xạ/đồng bộ, và các giải pháp ngăn xung đột.

---

## NỘI DUNG THẢO LUẬN & QUYẾT ĐỊNH

### I. LỰA CHỌN CÔNG NGHỆ CỐT LÕI

| Hạng mục        | Quyết định                                                    | Lý do chính                                                             | Trạng thái |
| :-------------- | :------------------------------------------------------------ | :---------------------------------------------------------------------- | :--------: |
| Core Database   | **PostgreSQL 16+**                                            | ACID, Row-Level Security (RLS), JSONB cho dữ liệu võ thuật linh hoạt    |  ✅ CHỐT   |
| Cloud Hosting   | **Supabase (Managed Cloud)**                                  | Backup tự động Point-in-time, Auto-scale, Giảm rủi ro mất dữ liệu       |  ✅ CHỐT   |
| Realtime Engine | **Supabase Realtime** (Giải Tỉnh) / **Redis** (Giải Quốc gia) | Tiết kiệm chi phí giai đoạn đầu, Redis chỉ dùng khi tải > 200 Trọng tài |  ✅ CHỐT   |
| Object Storage  | **Amazon S3 / Cloudflare R2**                                 | Lưu trữ Ảnh CCCD, Văn bằng PDF, Chứng chỉ Đai có mã QR                  |  ✅ CHỐT   |
| Message Broker  | **NATS JetStream**                                            | Truyền tải Event Sourcing và Cảnh báo Khẩn cấp giữa Hub ↔ Arena         |  ✅ CHỐT   |

---

### II. KIẾN TRÚC PHÂN TÁCH DỮ LIỆU (HUB-AND-SPOKE)

**Mô hình được Chairman phê duyệt:** _1 Supabase Project duy nhất + Multi-Schema PostgreSQL_

> ⚠️ **Phương án bị loại bỏ:** Tạo nhiều Supabase Project riêng lẻ (Multi-Project). Đã bị Javis và Jon phản biện thành công do chi phí nhân bội ($1,100/tháng vs $25/tháng), không thể JOIN dữ liệu xuyên Project, và xác thực bị phân mảnh.

**Cấu trúc Schema đã chốt:**

| Schema            | Nội dung                                                     | Tính chất                      |
| :---------------- | :----------------------------------------------------------- | :----------------------------- |
| `core`            | users, global_athletes, master_belts, event_logs, audit_logs | Bất biến, Bảo mật cao nhất     |
| `fed_{tỉnh}`      | clubs, club_memberships, local_finances                      | Phân quyền theo RLS Liên đoàn  |
| `tournament_{id}` | roster (Snapshot), brackets, match_scores                    | Tạm thời → ARCHIVED sau bế mạc |

**Cơ chế vận hành 3 Tầng:**

1. **Tầng 1 — Global Hub (core):** Cục căn cước quốc gia của Võ Cổ Truyền. Dữ liệu nhân dạng gốc (CCCD, Đai, Văn bằng).
2. **Tầng 2 — Club Domain (fed\_\*):** Quản trị kinh doanh hàng ngày (Điểm danh, Học phí). Dữ liệu riêng CLB KHÔNG đẩy về Global.
3. **Tầng 3 — Tournament Arena (tournament\_\*):** Database "dã chiến" chịu tải cao. Clone Snapshot trước giải, khóa cứng khi thi đấu.

---

### III. CƠ CHẾ ÁNH XẠ & ĐỒNG BỘ DỮ LIỆU

#### 3.1 Chuyển nhượng Võ sinh giữa các CLB

- **Quyết định:** Giữ cấu trúc lịch sử "Đã từng sinh hoạt ở A, hiện tại ở B".
- **Kỹ thuật:** Bảng `club_memberships` với các cột `start_date`, `end_date`, `status` (ACTIVE / ARCHIVED). Không Hard Delete.
- **Trạng thái:** ✅ CHỐT

#### 3.2 Chống xung đột thời gian — Event Sourcing

- **Vấn đề:** Võ sinh đang thi đấu (Arena khóa Data lúc 9h) nhưng được thăng đai ở Global lúc 10h. Merge-back có thể ghi đè sai.
- **Quyết định:** Áp dụng mô hình **Append-Only Event Log**. Arena không gửi lệnh UPDATE, chỉ gửi Gói Sự kiện (Event Payload) dạng JSON. Global Hub ghi nhận tuần tự theo dòng thời gian, tự tính toán Trạng thái cuối cùng.
- **Trạng thái:** ✅ CHỐT

#### 3.3 Lệnh Cấm Khẩn cấp giữa Giải đấu (Hot-Override)

- **Vấn đề:** Liên đoàn phát hiện gian lận, cần cấm VĐV thi đấu ngay lập tức khi Data Arena đã khóa Snapshot.
- **Quyết định:** Mở kênh **Redis Pub/Sub** (Channel: CRISIS_ALERT) nối từ Global Hub đến máy tính bảng Trọng tài. Arena chỉ lắng nghe 1 kênh duy nhất này. Khi nhận Alert → Màn hình nhấp nháy Đỏ 🛑 và chặn bấm điểm VĐV bị cấm.
- **Trạng thái:** ✅ CHỐT

---

### IV. LỚP GIÁP BỔ SUNG — VÒNG 1 (ĐỀ XUẤT BỞI JAVIS & JON)

|  #  | Giải pháp                                    | Mô tả ngắn                                                                                                                            | Trạng thái  |
| :-: | :------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ | :---------: |
|  1  | **Sổ Vàng Kiểm Toán (Audit Trail)**          | PostgreSQL Trigger tự động ghi MỌI thay đổi vào `core.audit_logs`. Bằng chứng pháp lý khi tranh chấp. Không ai có thể xóa, kể cả CTO. | ✅ GHI NHẬN |
|  2  | **Supabase Realtime thay Redis (Giải Tỉnh)** | Giải quy mô ≤ 50 Trọng tài dùng Supabase Realtime tích hợp sẵn để tiết kiệm $20–50/tháng tiền Redis.                                  | ✅ GHI NHẬN |
|  3  | **Materialized Views (Dashboard CEO)**       | Bảng thống kê tính toán sẵn, cập nhật mỗi 15 phút. Dashboard Chủ tịch/Liên đoàn load < 0.5 giây.                                      | ✅ GHI NHẬN |
|  4  | **Database Migration Tool**                  | Mọi thay đổi Schema phải viết thành file `.sql` đánh số, review trên Git. Hỗ trợ Rollback 30 giây nếu lỗi.                            | ✅ GHI NHẬN |
|  5  | **Tournament Schema Template**               | Khuôn mẫu cấu trúc Giải đấu. Liên đoàn bấm nút "Tạo Giải" → Hệ thống tự động sinh Schema, clone Snapshot, khóa khi xong.              | ✅ GHI NHẬN |

---

### V. LỚP GIÁP BỔ SUNG — VÒNG 2 (ĐỀ XUẤT BỞI JAVIS & JON)

|  #  | Giải pháp                                      | Mô tả ngắn                                                                                                                                                                                                                                 |   Mức ưu tiên    | Trạng thái  |
| :-: | :--------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------: | :---------: |
|  6  | **Offline-First cho Giải đấu**                 | Tablet Trọng tài lưu điểm tạm trên thiết bị (IndexedDB/SQLite). Khi mất mạng vẫn chấm điểm bình thường. Khi có mạng tự đồng bộ lên Supabase qua hàng đợi (Background Sync Queue). Giải quyết bài toán WiFi yếu tại Nhà thi đấu Tỉnh/Huyện. | 🔴 P0 — Tối khẩn | ✅ GHI NHẬN |
|  7  | **Soft-Delete Toàn Hệ Thống**                  | Không có nút "Xóa cứng". Mỗi bảng có cột `deleted_at`. Khi "xóa" chỉ ghi timestamp ẩn đi, Data vẫn tồn tại để khôi phục và tuân thủ Nghị định 13/2023/NĐ-CP (Bảo vệ Dữ liệu Cá nhân). Chống phá hoại từ nội bộ.                            |      🟠 P1       | ✅ GHI NHẬN |
|  8  | **Tìm kiếm Tiếng Việt Toàn Văn**               | Sử dụng PostgreSQL Extension `unaccent` + `pg_trgm` (Trigram). Hỗ trợ tìm kiếm Võ sinh có dấu/không dấu, chịu lỗi chính tả (Fuzzy Search). Gõ "Lê Văn Tùg" vẫn trả kết quả đúng "Lê Văn Tùng".                                             |      🟡 P2       | ✅ GHI NHẬN |
|  9  | **Báo cáo Xuất Dữ liệu cho Chính Quyền (B2G)** | Xây sẵn Stored Procedures xuất báo cáo theo mẫu Bộ Văn hóa, Thể thao & Du lịch. Hỗ trợ xuất Excel (.xlsx) và PDF có con dấu điện tử. Dashboard Liên đoàn bấm 1 nút → Tải file báo cáo chuẩn form. Vũ khí chiến lược B2G.                   |      🟡 P2       | ✅ GHI NHẬN |

---

### VI. LỚP GIÁP BỔ SUNG — VÒNG 3: PHẢN BIỆN CHUYÊN GIA (HEAD OF DATA & DATA ENGINEER)

|  #  | Blind Spot                                                      | Mô tả ngắn                                                                                                                                                                                                                                                                     |   Mức ưu tiên    | Trạng thái  |
| :-: | :-------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------: | :---------: |
| 15  | **Data Retention Policy (Chính sách Lưu trữ Phân tầng)**        | VĐV đang hoạt động = giữ vĩnh viễn. VĐV nghỉ > 3 năm = chuyển Cold Storage (S3), giữ 10 năm. Giải đấu Schema = 1 năm Hot DB, sau đó nén ZIP lưu S3 vĩnh viễn. Audit Logs = 2 năm Hot, archive 7 năm. Tránh DB phình to gây chậm và tốn chi phí. Tuân thủ NĐ 13/2023. | 🟠 P1            | ✅ GHI NHẬN |
| 16  | **Disaster Recovery Drill (Sao lưu Ngoài Supabase + Drill Quý)** | Lập lịch `pg_dump` hàng ngày đẩy sang Cloud khác (Cloudflare R2 / AWS S3). Mỗi Quý chạy Drill Khôi Phục: Lấy backup 3 tháng trước → Restore lên môi trường test → Xác nhận Data còn nguyên. Nếu không drill, backup có thể đã hỏng mà không ai biết.                          | 🔴 P0 — Tối khẩn | ✅ GHI NHẬN |
| 17  | **Naming Convention (Quy ước Đặt tên Schema)**                   | Liên đoàn: `fed_{mã_tỉnh}` (fed_lamdong). Giải đấu: `t_{năm}_{mã_tỉnh}_{id}` (t_2026_quocgia_001). Archived: `arch_{tên_gốc}`. Bắt buộc viết thường, không dấu, dùng gạch dưới. Vi phạm → CI/CD reject tự động.                                                             | 🟠 P1            | ✅ GHI NHẬN |
| 18  | **Connection Pooling (Supavisor + Pool Mode)**                   | Supabase Pro giới hạn ~60 kết nối. Mùa giải 200 Tablet + 500 Khán giả + 34 Admin = 734 kết nối → Sập. Bật Supavisor (miễn phí). Backend chỉ dùng Transaction Pool Mode. Phân bổ pool_size: API (30), Realtime (20), Admin (10).                                                | 🔴 P0 — Tối khẩn | ✅ GHI NHẬN |

---

### VII. PHƯƠNG ÁN BỊ LOẠI BỎ (GHI NHẬN ĐỂ TRÁNH LẶP LẠI)

| Phương án                  | Lý do loại bỏ                                                       | Người phản biện |
| :------------------------- | :------------------------------------------------------------------ | :-------------- |
| MySQL / SQL Server         | Không có Row-Level Security bản địa, không hỗ trợ JSONB             | Javis           |
| MongoDB (NoSQL)            | Không đảm bảo ACID cho dữ liệu Văn bằng/Tài chính trọng yếu         | Javis           |
| Self-hosted VPS PostgreSQL | Rủi ro mất dữ liệu khi cháy ổ cứng, không có auto-backup            | Jon             |
| Multi-Project Supabase     | Chi phí $1,100/tháng, không JOIN được xuyên Project, Auth phân mảnh | Javis + Jon     |

---

## BẢNG TỔNG KẾT KIẾN TRÚC TOÀN CẢNH (18 TẦNG GIÁP — FINAL)

|  #  | Tầng                    | Quyết định / Đề xuất                            |    Ưu tiên     | Trạng thái  |  Đề xuất bởi   |
| :-: | :---------------------- | :---------------------------------------------- | :------------: | :---------: | :------------- |
|  1  | Core Database           | PostgreSQL 16+ trên Supabase (Managed)          |       —        |   ✅ Chốt   | Javis + Jon    |
|  2  | Kiến trúc Phân ly       | 1 Project Supabase + Multi-Schema Hub-and-Spoke |       —        |   ✅ Chốt   | Chairman       |
|  3  | Chuyển nhượng VĐV       | Timeline History (ACTIVE/ARCHIVED)              |       —        |   ✅ Chốt   | Chairman       |
|  4  | Chống ghi đè            | Event-Sourcing (Append-Only Log)                |       —        |   ✅ Chốt   | Javis          |
|  5  | Cảnh báo Khẩn           | Redis Pub/Sub → Tablet Trọng tài                |       —        |   ✅ Chốt   | Javis          |
|  6  | Kiểm toán               | Audit Trail Trigger (Sổ Vàng)                   |      P1        | ✅ Ghi nhận | Javis          |
|  7  | Live Scoring            | Supabase Realtime (Tỉnh) / Redis (QG)           |      P1        | ✅ Ghi nhận | Jon            |
|  8  | Dashboard CEO           | Materialized Views (< 0.5s)                     |      P2        | ✅ Ghi nhận | Javis          |
|  9  | Nâng cấp DB             | Migration Files + Git Versioning                |      P1        | ✅ Ghi nhận | Jon            |
| 10  | Tạo Giải tự động        | Tournament Schema Template                      |      P1        | ✅ Ghi nhận | Jon            |
| 11  | Offline-First           | Local Storage + Background Sync Queue           |    **🔴 P0**   | ✅ Ghi nhận | Javis          |
| 12  | Soft-Delete             | Không xóa cứng, chỉ ẩn (deleted_at)             |    **🟠 P1**   | ✅ Ghi nhận | Javis          |
| 13  | Tìm kiếm VN            | unaccent + pg_trgm Fuzzy Search                 |    **🟡 P2**   | ✅ Ghi nhận | Jon            |
| 14  | Báo cáo B2G             | Xuất Excel/PDF chuẩn Bộ VHTTDL                  |    **🟡 P2**   | ✅ Ghi nhận | Javis          |
| 15  | **Data Retention**      | **Phân tầng Hot/Cold Storage + NĐ 13/2023**     |    **🟠 P1**   | ✅ Ghi nhận | Head of Data   |
| 16  | **Disaster Recovery**   | **pg_dump ngoài Supabase + Drill hàng Quý**     |    **🔴 P0**   | ✅ Ghi nhận | Head of Data   |
| 17  | **Naming Convention**   | **Quy ước đặt tên Schema bắt buộc + CI reject** |    **🟠 P1**   | ✅ Ghi nhận | Head of Data   |
| 18  | **Connection Pooling**  | **Supavisor + Transaction Pool Mode**            |    **🔴 P0**   | ✅ Ghi nhận | Data Engineer  |

---

## KẾT LUẬN & BƯỚC TIẾP THEO

Buổi họp đã thống nhất **toàn bộ Kiến trúc Cơ sở Dữ liệu Lõi** và **Hạ tầng Triển khai** cho VCT Platform với tầm nhìn **10 năm vận hành**. Tất cả các quyết định đã được Chairman phê duyệt trực tiếp.

---

## VII. QUYẾT ĐỊNH HẠ TẦNG (21:51 — 22:38 ICT)

*Phiên họp mở rộng — Chairman triệu tập thêm Phòng Pháp lý.*

### 7.1 Lựa chọn Nhà cung cấp Hạ tầng

| Phương án được xem xét | Chi phí/tháng | Quyết định |
| :--- | ---: | :---: |
| Supabase Pro (Server Singapore) | ~2.5 triệu | ❌ Loại — Không có HĐGTGT, dữ liệu ở nước ngoài |
| Viettel IDC Cloud Server (tự build) | ~1.9 triệu | ✅ **CHỌN** |
| Viettel vDBS Managed Database | ~6.5 triệu | ❌ Loại — Quá đắt cho giai đoạn Startup |

### 7.2 Cấu hình Viettel IDC — Chairman Phê duyệt

| Server | Vai trò | Cấu hình | Giá/tháng |
| :--- | :--- | :--- | ---: |
| **Server 1** — DB Primary | PostgreSQL 18 + PgBouncer | T1.Base 05: 4 vCPU / 8 GB RAM / 40+80 GB SSD | ~1,100,000 |
| **Server 2** — App Backend | API + NATS + Redis | T1.Base 04: 4 vCPU / 4 GB RAM / 40 GB SSD | 599,000 |
| Backup Cloud | pg_dump hàng ngày | Theo dung lượng | ~200,000 |
| **TỔNG** | | | **~1,900,000** |

### 7.3 Chiến lược Kết hợp Supabase Free

| Supabase Free ($0) dùng cho | Viettel IDC dùng cho |
| :--- | :--- |
| Auth (Đăng nhập Google/Phone OTP) | **Toàn bộ Data** (CCCD, Ảnh, Văn bằng, Giải đấu) |
| Realtime (WebSocket cho Giải Tỉnh) | Redis Pub/Sub (cho Giải Quốc gia) |
| Edge Functions (Serverless logic) | NATS JetStream (Event-Sourcing) |
| ❌ **KHÔNG LƯU DỮ LIỆU CÁ NHÂN** | ✅ **100% dữ liệu trên đất Việt Nam** |

### 7.4 Lý do Quyết định (Trích lời Chairman)

> "Về mặt lâu dài vẫn phải dùng Viettel IDC, nên chốt cấu hình ngay từ đầu, có lợi về hóa đơn."
> — Chairman Hoàng Bá Tùng

- **Hóa đơn GTGT:** Viettel IDC xuất Hóa đơn Đỏ → Khấu trừ TNDN 100% + VAT 8%.
- **Supabase (USD, thẻ quốc tế):** Không có HĐGTGT → Không khấu trừ thuế được.
- **Pháp lý:** Dữ liệu trên đất VN → Tuân thủ NĐ 13/2023 & Luật ANMG 2018 ngay từ ngày đầu.
- **B2G Ready:** Khi ký hợp đồng với Liên đoàn Quốc gia, trả lời "Server đặt tại Viettel IDC" = **thắng deal**.

---

## VIII. TƯ VẤN PHÁP LÝ (21:44 — 21:56 ICT)

*General Counsel và Compliance Officer tham gia phản biện về tuân thủ Bảo vệ Dữ liệu Cá nhân.*

### 8.1 Phân tích Pháp lý — Lưu trữ Dữ liệu Nước ngoài

| Văn bản pháp luật | Yêu cầu | Đánh giá cho VCT |
| :--- | :--- | :--- |
| Luật An ninh Mạng 2018 (Điều 26) | Lưu trữ DLCN tại Việt Nam | ✅ Tuân thủ (Viettel IDC) |
| NĐ 13/2023/NĐ-CP | DPIA, Consent, Thông báo Bộ CA | ✅ Không cần (data đã ở VN) |
| NĐ 53/2022/NĐ-CP | Lưu trữ nội địa khi BCA yêu cầu | ✅ Đã lưu sẵn tại VN |

### 8.2 Hành động Pháp lý Cần Làm Ngay

| # | Hạng mục | Người phụ trách | Trạng thái |
|:-:|:---|:---|:---:|
| 1 | Soạn **Privacy Policy** cho Website + App | Harvey (Contract Specialist) | ⏳ Đang soạn |
| 2 | Thiết kế **Consent Screen** (Checkbox đồng ý thu CCCD) | Jon (CTO) + Harvey | ⏳ Chờ Privacy Policy |
| 3 | Lập **Hồ sơ DPIA** (Đánh giá Tác động BVDL) | Compliance Officer | ⏳ Chờ xong Phase 1 |

---

### 🔒 TUYÊN BỐ ĐÓNG KHUÔN KIẾN TRÚC + HẠ TẦNG (FREEZE — v4.0 FINAL)

> Kiến trúc Cơ sở Dữ liệu VCT Platform gồm **18 tầng giáp** và Hạ tầng **Viettel IDC (Cloud Server) + Supabase Free** đã được Chủ tịch Hoàng Bá Tùng phê duyệt chính thức vào ngày 30/03/2026.
>
> Quyết định đã qua phản biện bởi: **Head of Data**, **Data Engineer**, **General Counsel**, và **Compliance Officer**.
>
> Mọi thay đổi kiến trúc hoặc hạ tầng sau thời điểm này phải được trình lên Chairman để phê duyệt lại thông qua quy trình War Room.
>
> Toàn bộ Agent trong hệ sinh thái phải tuân thủ tuyệt đối bản thiết kế này khi triển khai.

**Hành động tiếp theo (Action Items):**

|  #  | Nội dung                                   | Người phụ trách    | Hạn chót (Dự kiến) |
| :-: | :----------------------------------------- | :----------------- | :----------------- |
|  1  | Mua Cloud Server Viettel IDC (2 server)    | Jon (CTO)          | Chairman phát lệnh |
|  2  | Cài đặt PostgreSQL 18 + PgBouncer + Redis | Jon (CTO)          | Ngay sau mua server |
|  3  | Viết Migration files Phase 1 (Core Schema) | Jon (CTO)          | Sau khi setup xong |
|  4  | Cấu hình Supabase Free (Auth + Realtime)   | Jon (CTO)          | Song song với #2   |
|  5  | Soạn Privacy Policy + Consent Screen       | Harvey + Jon       | Trước khi đi live  |
|  6  | Thiết kế UI Dashboard cho CEO/Liên đoàn    | Jack (Front-End)   | Chờ lệnh Chairman  |
|  7  | Deploy Website với Menu Header mới         | Jon + Jack         | Chờ lệnh Chairman  |
|  8  | Lập Hồ sơ DPIA                             | Compliance Officer | Q2/2026             |

---

**Biên bản kết thúc lúc:** 22:38 ICT, 30/03/2026  
**Người lập biên bản:** Jen — Chánh Văn Phòng VCT Platform  
**Phê duyệt:** Hoàng Bá Tùng — Chairman / Tổng Giám Đốc

---

_Tài liệu này được lưu trữ tại hệ thống quản trị trung tâm VCT Agent Business._  
_Mọi sao chép hoặc phân phối phải được sự đồng ý của Chairman._  
_Phiên bản: v4.0 FINAL — Cập nhật lần cuối: 30/03/2026 22:38 ICT_  
_Đã qua phản biện: Head of Data, Data Engineer (Data-AI-Ops), General Counsel, Compliance Officer (Legal-IP)_
