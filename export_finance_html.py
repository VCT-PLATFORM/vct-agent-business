import zipfile
import re
import os

file_path = "D:\\VCT PLATFORM\\vct-agent-business\\_agent\\shared_knowledge\\finance\\VCT_Platform_Finance.xlsx"
html_path = "D:\\VCT PLATFORM\\vct-agent-business\\Bao_Cao_Tai_Chinh.html"

try:
    with zipfile.ZipFile(file_path, 'r') as z:
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            ss_data = z.read('xl/sharedStrings.xml').decode('utf-8')
            ss_data = re.sub(r'<rPh.*?</rPh>', '', ss_data)
            for match in re.finditer(r'<t.*?>(.*?)</t>', ss_data):
                strings.append(match.group(1).replace('&amp;', '&'))

        wb_data = z.read('xl/workbook.xml').decode('utf-8')
        sheets = {}
        for match in re.finditer(r'<sheet.*?name="(.*?)".*?sheetId="(.*?)".*?r:id="(.*?)"', wb_data):
            sheets[match.group(3)] = match.group(1)
        
        rels_data = z.read('xl/_rels/workbook.xml.rels').decode('utf-8')
        rels = {}
        for match in re.finditer(r'<Relationship.*?Id="(.*?)".*?Target="(.*?)"', rels_data):
            rels[match.group(1)] = match.group(2)
        
        html_content = """
        <html>
        <head>
            <meta charset="utf-8">
            <title>Báo Cáo Tài Chính - VCT Platform</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; background-color: #f4f7f6; color: #333; }
                h1 { color: #2c3e50; text-align: center; margin-bottom: 5px; }
                p.subtitle { text-align: center; color: #7f8c8d; margin-bottom: 30px; }
                h2 { color: #2980b9; margin-top: 40px; border-bottom: 2px solid #bdc3c7; padding-bottom: 5px; }
                table { border-collapse: collapse; width: 100%; margin-top: 15px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                th { background-color: #34495e; color: #fff; text-align: left; padding: 12px; font-weight: 600; white-space: nowrap; }
                td { padding: 10px 12px; border-bottom: 1px solid #ddd; }
                tr:hover { background-color: #f5f5f5; }
                .amount { text-align: right; font-family: 'Courier New', Courier, monospace; font-weight: bold; color: #c0392b; }
                .green { color: #27ae60 !important; }
            </style>
        </head>
        <body>
            <h1>BÁO CÁO TÀI CHÍNH</h1>
            <p class="subtitle">Trích xuất tự động từ hệ thống lõi VCT Platform AI (JIT-Rendering)</p>
        """

        for r_id, name in sheets.items():
            if name not in ['Recon_Bank', 'Journal_Entries']:
                continue
                
            file_name = f"xl/{rels[r_id]}"
            sheet_xml = z.read(file_name).decode('utf-8')
            
            html_content += f"<h2>{name.replace('_', ' ')}</h2>\n<table>\n"
            
            row_chunks = sheet_xml.split('<row')
            for cx, chunk in enumerate(row_chunks[1:]):
                if cx > 100: break
                
                html_content += "<tr>\n"
                chunk = '<row' + chunk
                cell_chunks = chunk.split('<c ')
                for c_chunk in cell_chunks[1:]:
                    t_match = re.search(r't="([^"]*)"', c_chunk)
                    t = t_match.group(1) if t_match else ''
                    v_match = re.search(r'<v>(.*?)</v>', c_chunk)
                    v = v_match.group(1) if v_match else ''
                    
                    val = ''
                    if v == '': 
                        val = ''
                    elif t == 's':
                        try: val = strings[int(v)]
                        except: val = v
                    else:
                        val = v
                    
                    # Format
                    tag = "th" if cx == 0 else "td"
                    cls = ""
                    if cx > 0 and val.replace('.','').replace('-','').replace('E','').isdigit() and len(val) > 3:
                        try:
                            num = float(val)
                            val = f"{num:,.0f}".replace(',', '.')
                            cls = ' class="amount green"' if num > 0 else ' class="amount"'
                        except: pass
                    
                    html_content += f"<{tag}{cls}>{val}</{tag}>\n"
                    
                html_content += "</tr>\n"
            html_content += "</table>\n"
            
        html_content += "</body></html>"
        
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print("SUCCESS_EXPORT")
except Exception as e:
    print(f"Error: {e}")
