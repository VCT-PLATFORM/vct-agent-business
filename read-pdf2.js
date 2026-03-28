const fs = require('fs');
const PDFParser = require('pdf2json');

let pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync('d:\\pdf-result.txt', pdfParser.getRawTextContent());
    console.log("PDF parsed successfully.");
});

pdfParser.loadPDF("d:\\VCT PLATFORM\\vct-agent-business\\_agent\\shared_knowledge\\invoices\\2026\\Q1\\03\\1C26MBH_00000778_3401284869.pdf");
