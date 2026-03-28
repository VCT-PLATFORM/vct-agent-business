const { execSync } = require('child_process');

const contactCmd = `node _agent/scripts/finance-sync.js add-contact '{"ma":"BOHO","ten":"CÔNG TY TNHH BOHO","phan_loai":"Nhà cung cấp","mst":"3502493964"}'`;
console.log(execSync(contactCmd, { encoding: 'utf8' }));

const entryCmd = `node _agent/scripts/finance-sync.js add-entry '{"ngay":"27/03/2026","chungtu":"Hóa đơn VAT","dien_giai":"Chi phí tiếp khách (CÔNG TY TNHH BOHO)","doi_tac":"BOHO","tk_no":"642","tk_co":"111","so_tien":240000,"thue":8,"du_an":"PLATFORM","so_chungtu":"00000778"}'`;
console.log(execSync(entryCmd, { encoding: 'utf8' }));
