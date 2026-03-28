const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('d:\\VCT PLATFORM\\vct-agent-business\\_agent\\shared_knowledge\\invoices\\2026\\Q1\\03\\1C26MBH_00000778_3401284869.pdf');

// Handle pdf-parse export if it is an object
const parsePdf = typeof pdf === 'function' ? pdf : pdf.default;

parsePdf(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(console.error);
