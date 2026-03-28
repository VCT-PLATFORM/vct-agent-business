# LUẬT THỂ DỤC THỂ THAO SỬA ĐỔI (26/2018/QH14)
> Nguồn: `vanban.chinhphu.vn` | Tương thích: Module Giải Đấu của VCT Platform.

---

## I. MỤC ĐÍCH ÁP DỤNG TRONG PHẦN MỀM SaaS

Phần Mềm VCT Platform đứng vai trò "Tổ Chức Ban Kết Quả" (Electronic Scoring/Bracket System). Khi xây dựng các Bảng Bốc Thăm (Bracket), Lịch thi đấu vòng tròn hay đấu tay đôi, AI và Kỹ sư phải soi chiếu các Điều khoản trong Bộ Luật Thể Thao của Nước CHXHCN Việt Nam.

## II. ĐIỀU LỆ TỔ CHỨC GIẢI THỂ THAO

**Điều 37 & 38. Giải Thể thao Quần chúng / Giải Vô địch Quốc gia**
1. Giải thể thao Quần chúng: **Liên đoàn Thể thao Cấp Tỉnh/Huyện** có quyền ra Ban Hành Điều Lệ. (Kỹ sư: Cho phép Admin cấp Tỉnh tự Define cách tính Điểm VCT).
2. Giải Vô địch Quốc gia: Thuộc thẩm quyền ban hành của **Tổng Cục Trưởng Tổng Cục TDTT** hoặc **Liên đoàn Thể thao Quốc gia**. 
(*Dev Note: App VCT phải Lock (Khóa) tính năng tự Do Sửa Điểm ở Cấp Độ "Giải Quốc Gia". Mọi lịch bốc thăm và thay đổi Bảng Cân Nặng (Weigh-ins) phải có Approve Flow (Duyệt) của Tài khoản Admin Liên đoàn VN*).

## III. THỂ THAO THU GỌN VÀ HIỆU SUẤT CAO

**Điều 36. Công nhận cơ sở Đào tạo Thể thao**
1. Các Võ Đường, CLB phải đảm bảo trang thiết bị (Đăng ký cấp phép hộ kinh doanh).
2. **Nghĩa vụ Data VCT**: App VCT có chức năng cấp Giấy Chứng Nhận Điện Tử (E-Certificate) Cấp Đai/Đẳng cho Hội Viên. Chữ ký trên E-Cert phải được Liên đoàn (Tài khoản Admin) Đóng dấu điện tử/Duyệt thì Chứng Chỉ mới Hợp Lệ theo đúng Luật Thể Thao.

## THỰC THI (CODE-LEVEL COMPLIANCE)
- Module Bốc Thăm Thi Đấu (Brackets Algorithm): Đảm bảo Không Bao Giờ Trùng Tên Vận Động Viên (Cùng Võ Đường/Đơn vị) đá loại với nhau ở Vòng 1 (Trừ trường hợp Ngoại Lệ Override Của Còi Trọng Tài).
- Quyền Admin (RBAC): Trọng tài Bàn chỉ có quyền "Nhập Điểm". Còn "Sửa Điểm Lỗi" phải có Mã PIN của Tổng Trọng Tài. Cơ cấu Role trong Database phải rạch ròi.
