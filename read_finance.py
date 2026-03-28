import pandas as pd
file_path = "D:\\VCT PLATFORM\\vct-agent-business\\_agent\\shared_knowledge\\finance\\VCT_Platform_Finance.xlsx"

try:
    # Read the summary or journal entries
    df_bank = pd.read_excel(file_path, sheet_name="Recon_Bank")
    print("=== BANK RECONCILIATION ===")
    print(df_bank.to_string())
    
    df_journal = pd.read_excel(file_path, sheet_name="Journal_Entries")
    print("=== JOURNAL ENTRIES TAIL ===")
    
    # Simple P&L logic
    # tkNo starting with 6 or 8 is expense
    # tkCo starting with 5 or 7 is revenue
    total_revenue = 0
    total_expense = 0
    for index, row in df_journal.iterrows():
        try:
            amount = 0
            val = str(row.get('Tong_Tien', '0'))
            amount = int(''.join(c for c in val if c.isdigit()))
            tk_no = str(row.get('TK_No', ''))
            tk_co = str(row.get('TK_Co', ''))
            
            if str(tk_no).startswith('6') or str(tk_no).startswith('8'):
                total_expense += amount
            if str(tk_co).startswith('5') or str(tk_co).startswith('7'):
                total_revenue += amount
        except:
            pass
            
    print(f"Total Revenue: {total_revenue}")
    print(f"Total Expense: {total_expense}")
    print(f"Net Income: {total_revenue - total_expense}")
    
except Exception as e:
    print(f"Error: {e}")
