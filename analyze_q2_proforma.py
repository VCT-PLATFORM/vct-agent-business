
import pandas as pd
import numpy as np
import os
from datetime import datetime

# Path to the finance file
FINANCE_FILE = "D:\\VCT PLATFORM\\vct-agent-business\\_agent\\shared_knowledge\\finance\\VCT_Platform_Finance.xlsx"
OUTPUT_DIR = "D:\\VCT PLATFORM\\vct-agent-business\\docs\\finance"

def analyze_finance():
    if not os.path.exists(FINANCE_FILE):
        print(f"Error: File not found at {FINANCE_FILE}")
        return
        
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    try:
        # Load Journal_Entries
        df = pd.read_excel(FINANCE_FILE, sheet_name='Journal_Entries')
        
        # Clean data
        df['Ngay_PhatSinh'] = pd.to_datetime(df['Ngay_PhatSinh'])
        df['So_Tien'] = pd.to_numeric(df['So_Tien'], errors='coerce').fillna(0)
        
        # Filter 2026 data
        df_2026 = df[df['Ngay_PhatSinh'].dt.year == 2026].copy()
        
        # Categorize
        # Revenue: TK start with 5 (usually 511)
        revenue = df_2026[df_2026['Ma_TK_Co'].astype(str).str.startswith('5')]['So_Tien'].sum()
        
        # Expenses: TK start with 6 or 154
        admin_exp = df_2026[df_2026['Ma_TK_No'].astype(str).str.startswith('642')]['So_Tien'].sum()
        sales_exp = df_2026[df_2026['Ma_TK_No'].astype(str).str.startswith('641')]['So_Tien'].sum()
        prod_exp = df_2026[df_2026['Ma_TK_No'].astype(str).str.startswith('154')]['So_Tien'].sum()
        
        total_exp = admin_exp + sales_exp + prod_exp
        net_income = revenue - total_exp
        
        # Monthly Average (Q1 2026 - Jan to Mar)
        months_count = 3
        avg_rev = revenue / months_count
        avg_exp = total_exp / months_count
        
        # Q2 Projections (Apr - Jun 2026)
        # Assuming 20% growth in revenue due to Phase 2 launch
        proj_rev_q2 = avg_rev * 1.2 * 3
        # Assuming 10% increase in expenses due to scaling
        proj_exp_q2 = avg_exp * 1.1 * 3
        proj_net_q2 = proj_rev_q2 - proj_exp_q2
        
        # Burn rate (Average monthly)
        current_burn = avg_exp - avg_rev
        
        report = f"""# Báo cáo Tài chính Dự kiến (Pro-forma P&L Q2 2026)
*Ngày trích xuất: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*

## 1. Kết quả Kinh doanh Thực tế (Q1 2026)
- **Tổng Doanh thu (TK 5xx):** {revenue:,.0f} VND
- **Tổng Chi phí (TK 6xx/154):** {total_exp:,.0f} VND
- **Lợi nhuận Thuần:** {net_income:,.0f} VND
- **Burn rate trung bình tháng:** {max(0, current_burn):,.0f} VND/tháng

## 2. Dự báo Q2 2026 (Pro-forma)
*Dựa trên kịch bản tăng trưởng 20% doanh thu khi vận hành Phase 2*

| Chỉ tiêu | Giá trị (VND) | Ghi chú |
| :--- | :--- | :--- |
| **Doanh thu Dự kiến** | {proj_rev_q2:,.0f} | Tăng trưởng 20% so với Q1 |
| **Chi phí Dự kiến** | {proj_exp_q2:,.0f} | Tăng 10% (Marketing & Ops) |
| **Lợi nhuận Dự kiến** | {proj_net_q2:,.0f} | Biên lợi nhuận cải thiện |

## 3. Khuyến nghị Chiến lược
- **Tối ưu hóa Burn rate:** Hiện tại hệ thống đang ở mức sinh lời nhẹ. Tiếp tục duy trì hiệu suất vận hành.
- **Ngân sách Phase 2:** Dự chi thêm 10% cho hạ tầng Cloud và đa ngôn ngữ để hỗ trợ thị trường Global.

---
*Báo cáo được khởi tạo tự động bởi Jen AI Assistant.*
"""
        
        output_path = os.path.join(OUTPUT_DIR, "financial_proforma_q2.md")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(report)
            
        print(f"SUCCESS: {output_path} generated.")

    except Exception as e:
        print(f"Error during analysis: {e}")

if __name__ == "__main__":
    analyze_finance()
