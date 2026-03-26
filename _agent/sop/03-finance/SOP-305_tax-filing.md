# SOP-305: Tax Filing — Kê khai & Nộp thuế

> **Actor**: Tax Specialist + Accounting Manager + CFO

## Lịch Thuế

| Loại thuế | Kỳ kê khai | Deadline | Cơ quan |
|----------|-----------|---------|---------|
| Thuế GTGT (VAT) | Hàng tháng | Ngày 20 tháng sau | Cục Thuế |
| Thuế TNCN (PIT) | Hàng tháng | Ngày 20 tháng sau | Cục Thuế |
| Thuế TNDN (CIT) tạm tính | Hàng quý | Ngày 30 tháng đầu quý sau | Cục Thuế |
| Thuế TNDN quyết toán | Hàng năm | Ngày 31/3 năm sau | Cục Thuế |
| BHXH/BHYT/BHTN | Hàng tháng | Trước ngày cuối tháng | BHXH |
| Báo cáo Tài chính | Hàng năm | Ngày 31/3 năm sau | Cục Thuế |

## Quy trình Kê khai Hàng tháng
```
// turbo
├── Ngày 1-10: Thu thập hóa đơn xuất/nhập
├── Ngày 10-15: Accounting nhập liệu, đối chiếu
├── Ngày 15-17: Tax Specialist tính toán, lập tờ khai
├── Ngày 17-18: CFO review & approve
├── Ngày 18-20: Nộp tờ khai online (iTaxViewer/eTax)
├── Ngày 20: Deadline — Nộp thuế qua ngân hàng
└── Archive: Lưu tờ khai + chứng từ (10 năm theo luật)
```

## Risk: Vi phạm & Phạt
| Vi phạm | Mức phạt |
|---------|---------|
| Chậm kê khai | 2-25 triệu VNĐ |
| Chậm nộp thuế | 0.03%/ngày số tiền chậm |
| Kê khai sai | Truy thu + Phạt 20% |
| Trốn thuế | Truy thu + Phạt 1-3 lần số thuế trốn |
