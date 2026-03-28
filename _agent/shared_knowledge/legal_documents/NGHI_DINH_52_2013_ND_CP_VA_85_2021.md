# NGHỊ ĐỊNH THƯƠNG MẠI ĐIỆN TỬ (52/2013/NĐ-CP & 85/2021/NĐ-CP)
> Nguồn: `vanban.chinhphu.vn` | Tương thích: VCT Platform App Store / Marketplace B2B.

---

## I. MỤC ĐÍCH QUẢN CHẾ GIAO DỊCH TMĐT

Theo Nghị định 85/2021 Sửa đổi 52/2013: VCT Platform nằm ở mảng Giao Dịch B2C/B2B (Khách hàng đóng tiền cho Võ đường qua Cổng thanh toán App). Do đó VCT Platform rơi vào định nghĩa:
- **Ứng dụng cung cấp dịch vụ thương mại điện tử**: Là ứng dụng di động cho phép các chủ thể thiết lập gian hàng (Các Võ Đường) hoặc tiến hành một phần quá trình giao dịch.

## II. GIAO KẾT HỢP ĐỒNG ĐIỆN TỬ (BÁN PHẦN MỀM)

**Điều 15. Thông tin về điều kiện giao dịch chung**
1. Vận hành VCT Platform: Bất kỳ khi nào ký kết Hợp đồng Cung cấp Dịch vụ (SaaS Subscription) với Liên đoàn hay Võ đường trên Web, phải Công bố RÕ RÀNG:
   - a) Chính sách Hoàn trả/Gói cước/Chấm dứt (Refund and Cancellation Policy).
   - b) Chính sách Bảo hành/Bảo vệ người dùng (Warranty/Downtime SLA).
   - c) Tiêu chuẩn Dịch vụ (Service Levels).

(*Áp dụng Khối Customer Success & Khối Sales: Không được gửi Hợp đồng không ghi rõ Phục vụ bao nhiêu lâu, Uptime bao nhiêu 99.9%*).

## III. THANH TOÁN ONLINE VÀ BẢO MẬT (CHƯỚC B2B2C)

**Điều 74. Nguyên tắc bảo vệ thông tin thanh toán (Payment Security)**
1. VCT Platform phải: "Xây dựng và công bố chính sách bảo mật thông tin thanh toán cho khách hàng".
2. Hệ thống phải cảnh báo người dùng (Các phụ huynh quẹt thẻ Credit Card đóng học phí) trước khi xác nhận Giao dịch: "Bạn sắp Thanh Toán xyz Số Tiền. Đồng ý hay Hủy?".

## IV. ĐĂNG KÝ BỘ CÔNG THƯƠNG

**Điều 52. Đăng ký thiết lập sàn giao dịch TMĐT**
- Nếu VCT Platform mở "Chợ Bán Khóa Học" cho hàng nghìn võ sư bán video dạy võ, hay "Mở Cửa Hàng Võ Phục/Vũ Khí Bằng Gỗ/Mộc Nhân", thì VCT trở thành SÀN GIAO DỊCH TMĐT. Lúc này:
   1. Cần xin phép Bộ Công Thương thông qua cổng `online.gov.vn`. Đính Bô Logo Của Bộ Công Thương mầu Xanh/Đỏ ở góc Trang Web VCT. 
   2. Xóa các sản phẩm cấm (Vũ khí sát thương bằng kim loại trên sàn tập).

## THỰC THI (CODE-LEVEL COMPLIANCE)
Bất kỳ Frontend Lead nào đọc file này đều phải:
- Chèn Logo/Dấu chứng nhận Website Bộ Công Thương ở Footer Homepage nếu VCT tích hợp Mua/Bán Hàng Hóa.
- Flow Check-out (Thanh toán): Nút `Submit Payment` Bắt buộc tuân thủ Stripe / ZaloPay Payment Interface và có Màn hình Confirm Amount trước khi Trừ Tiền Thẻ Khách.
