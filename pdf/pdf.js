import pdf from 'html-pdf';
import fs from 'fs';
import {compile} from 'handlebars';


const createPdf = (orders) => {
  const test = fs.readdirSync('./');
  console.log(test);
  const html = fs.readFileSync('./template/template.html', 'utf8');
  console.log(html);
  const template = compile(html);
  const htmlOrders = template(orders);
  const options = {
    height: '90mm',
    width: '62mm'
  }
  return pdf.create(htmlOrders, options);
};

export {createPdf};
