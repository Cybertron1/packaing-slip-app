import pdf from 'html-pdf';
import fs from 'fs';
import {compile} from 'handlebars';

const createPdf = (orders) => {
  const html = fs.readFileSync('./template/template.html', 'utf8');
  const template = compile(html);
  const htmlOrders = template(orders);
  const options = {
    height: '90mm',
    width: '62mm'
  }
  return pdf.create(htmlOrders, options);
};

export {createPdf};