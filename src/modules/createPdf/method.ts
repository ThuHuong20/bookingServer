 // pdfGenerator.ts
 import * as fs from 'fs';
 import * as ejs from 'ejs';
 import * as pdf from 'html-pdf';
export const createPDF = (data) => {
    return new Promise<void>((resolve, reject) => {
      var ejsTemplate = fs.readFileSync('./pdf.ejs', 'utf8');
      var html = ejs.render(ejsTemplate, data);
      var options = { format: 'Letter' };
  
      pdf.create(html, options).toFile('./yourReceipt.pdf', function (err, res) {
        if (err) {
          reject(err);
        } else {
          console.log(res); // { filename: './yourReceipt.pdf' }
          resolve();
        }
      });
    });
  };
  