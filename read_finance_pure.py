import zipfile
import re

file_path = "D:\\VCT PLATFORM\\vct-agent-business\\_agent\\shared_knowledge\\finance\\VCT_Platform_Finance.xlsx"

try:
    with zipfile.ZipFile(file_path, 'r') as z:
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            ss_data = z.read('xl/sharedStrings.xml').decode('utf-8')
            # remove formatting tags like <rPh>
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
        
        for r_id, name in sheets.items():
            if name not in ['Recon_Bank', 'Journal_Entries']:
                continue
                
            file_name = f"xl/{rels[r_id]}"
            sheet_xml = z.read(file_name).decode('utf-8')
            print(f"\n=== {name} ===")
            
            # Simple row split
            row_chunks = sheet_xml.split('<row')
            for cx, chunk in enumerate(row_chunks[1:]):
                if cx > 50: break # show up to 50 rows
                chunk = '<row' + chunk
                row_data = []
                # Simple cell match
                cell_chunks = chunk.split('<c ')
                for c_chunk in cell_chunks[1:]:
                    # Extract type t="..."
                    t_match = re.search(r't="([^"]*)"', c_chunk)
                    t = t_match.group(1) if t_match else ''
                    # Extract value <v>...</v>
                    v_match = re.search(r'<v>(.*?)</v>', c_chunk)
                    v = v_match.group(1) if v_match else ''
                    
                    if v == '': 
                        row_data.append('')
                    elif t == 's':
                        try:
                            row_data.append(strings[int(v)])
                        except:
                            row_data.append(v)
                    else:
                        row_data.append(v)
                if row_data:
                    print('\t'.join(row_data))
                
except Exception as e:
    print(f"Error: {e}")
