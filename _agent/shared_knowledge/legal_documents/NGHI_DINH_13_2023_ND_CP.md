# NGHỊ ĐỊNH 13/2023/NĐ-CP (BẢO VỆ DỮ LIỆU CÁ NHÂN)
> Nguồn: `vanban.chinhphu.vn` | Định dạng: Trích xuất Code-Ready (Markdown)
> ⚠️ **Lưu ý Đặc Vụ (CISO, Devs)**: Bất kỳ tính năng mới nào (đăng ký app, thu thập vân tay, chụp ảnh CCCD võ sinh) đều phải đối chiếu với các Nguyên Tắc Tối Thượng dưới đây.

---

## CHƯƠNG I: NHỮNG QUY ĐỊNH CHUNG

**Điều 2. Giải thích từ ngữ**
- **Dữ liệu cá nhân (PII)**: Là thông tin dưới dạng ký hiệu, chữ viết, chữ số, hình ảnh, âm thanh hoặc dạng tương tự trên môi trường điện tử gắn liền với một con người cụ thể.
- **Dữ liệu cá nhân nhạy cảm**: Gồm thông tin về tình trạng sức khỏe, đặc điểm sinh học (vân tay, mống mắt), tài chính, vị trí địa lý.
(*Áp dụng cho VCT Platform: Bảng cân nặng, bảng đo chiều cao võ sinh, lịch sử chấn thương thi đấu của Đội tuyển Quốc gia là Dữ Liệu Nhạy Cảm*).

## CHƯƠNG II: QUYỀN VÀ NGHĨA VỤ CỦA CHỦ THỂ DỮ LIỆU

**Điều 9. Quyền của chủ thể dữ liệu**
1. **Quyền được biết**: Được biết hệ thống VCT sử dụng dữ liệu để làm gì (Điểm danh hay bán cho bên thứ 3).
2. **Quyền đồng ý/rút lại sự đồng ý**: Võ sư hoặc phụ huynh có quyền XÓA và HỦY HỒ SƠ 100% khỏi VCT Platform bất cứ lúc nào. (Yêu cầu chức năng "Delete My Account" trong App).
3. **Quyền hạn chế xử lý**: Nếu bị hack, khách hàng có quyền ngưng việc gửi dữ liệu.

**Điều 11. Sự đồng ý của chủ thể dữ liệu**
1. Sự đồng ý chỉ có hiệu lực khi chủ thể dữ liệu **tự nguyện và rõ ràng** (Opt-in button). 
4. Việc im lặng hoặc không phản hồi (Pre-ticked checkbox) cấm được coi là sự đồng ý.
(*DEV LƯU Ý: Không dùng Checkbox tick ngang "Tôi đồng ý" được điền sẵn. Bắt user tự tick*).

## CHƯƠNG III: BẢO VỆ DỮ LIỆU CÁ NHÂN NHẠY CẢM VÀ TRẺ EM

**Điều 20. Bảo vệ dữ liệu cá nhân của trẻ em**
1. Xử lý dữ liệu cá nhân của trẻ em (dưới 15 tuổi) **BẮT BUỘC phải có sự đồng ý của trẻ em và Cha mẹ/Nguyên giám hộ hợp pháp**.
(*VCT Platform: Khâu Đăng ký Giải đấu Nhóm 10-15 tuổi phải gửi SMS OTP hoặc Zalo ZNS Token sang Máy điện thoại của Bố/Mẹ để bấm nút [Xác Nhận Cho Phép Tham Gia]*). 

## THỰC THI (CODE-LEVEL COMPLIANCE)
Bất kỳ DevOps, Backend hay Platform Architect nào đọc file này phải:
1. Tạo luồng (flow) mã hóa toàn bộ CSDL bảng `Students` trên Supabase (RLS - Row Level Security).
2. Data rút xuất ra phân tích phải được *Anonymized* (Xóa định danh SĐT, Tên, ID CCCD).
