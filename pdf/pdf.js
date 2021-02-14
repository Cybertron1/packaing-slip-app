import pdf from 'html-pdf';
import {compile} from 'handlebars';
import pdfTemplate from "./pdfTemplate";

const createPdf = (orders) => {
  const template = compile(pdfTemplate);
  const htmlOrders = template(orders);
  const options = {
    height: '90mm',
    width: '62mm'
  }
  return pdf.create(htmlOrders, options);
};

export {createPdf};
