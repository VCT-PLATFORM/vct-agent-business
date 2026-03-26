---
description: Quy trình thiết lập và quản lý OKR (Objectives & Key Results) cho doanh nghiệp
---

# OKR Management — Quản lý Mục tiêu & Kết quả Then chốt

Quy trình này hướng dẫn thiết lập, theo dõi và đánh giá OKR cho VCT Platform.

## Khi nào sử dụng

- Đầu quý: Lập OKR mới
- Giữa quý: Check-in tiến độ OKR
- Cuối quý: Grading & retrospective OKR
- Khi muốn cascade mục tiêu từ company → team → cá nhân

## Quy trình thực hiện

### Bước 1: Xác định Company-level OKR
Hỏi người dùng về:
- Mục tiêu lớn nhất quý này là gì?
- Đâu là ưu tiên hàng đầu?
- Có event/milestone quan trọng nào trong quý?

Áp dụng nguyên tắc:
- **3-5 Objectives** mỗi cấp (company / team / cá nhân)
- **2-4 Key Results** cho mỗi Objective
- Objectives phải **hướng cảm hứng**, **định tính** (What)
- Key Results phải **đo lường được**, **có deadline** (How)

### Bước 2: Format OKR chuẩn

```
Objective: [Tuyên bố mục tiêu hướng cảm hứng]
├── KR1: [Chỉ số cụ thể] từ [X] lên [Y] trước [ngày]
├── KR2: [Chỉ số cụ thể] đạt [target] trước [ngày]
└── KR3: [Milestone cụ thể] hoàn thành trước [ngày]
```

### Bước 3: Cascade OKR
```
Company OKR
├── Engineering Team OKR (aligned)
├── Marketing Team OKR (aligned)
├── Sales Team OKR (aligned)
└── Operations Team OKR (aligned)
    └── Individual OKR (aligned)
```

### Bước 4: Check-in Scoring (Giữa quý)
| Score | Ý nghĩa | Hành động |
|-------|---------|-----------|
| 0.0-0.3 | Off-track | Cần thay đổi chiến thuật hoặc điều chỉnh KR |
| 0.4-0.6 | At-risk | Cần tập trung nguồn lực, escalate nếu cần |
| 0.7-1.0 | On-track | Tiếp tục, có thể stretch thêm |

### Bước 5: Grading & Retrospective (Cuối quý)
1. **Score mỗi KR** từ 0.0 đến 1.0
2. **Average score** cho mỗi Objective
3. **Sweet spot**: 0.6-0.7 = đặt mục tiêu đúng mức (stretch nhưng đạt được)
4. **Retrospective**: Điều gì worked? Điều gì không? Rút ra bài học gì cho quý sau?

## Ví dụ OKR cho SaaS Platform

```
Objective 1: Trở thành nền tảng quản trị doanh nghiệp #1 cho SME Việt Nam
├── KR1: Tăng MRR từ $10K lên $25K trước 30/06
├── KR2: Đạt 200 doanh nghiệp đăng ký sử dụng trước 30/06
└── KR3: Đạt NPS ≥ 50 từ khảo sát khách hàng

Objective 2: Xây dựng đội ngũ engineering world-class
├── KR1: Tuyển thêm 3 senior engineers trước 15/05
├── KR2: Đạt Sprint velocity trung bình ≥ 40 story points
└── KR3: Code coverage ≥ 80% trên tất cả core modules
```

## Output Format

Trình bày OKR dưới dạng tree structure rõ ràng, kèm bảng scoring nếu đang check-in.
