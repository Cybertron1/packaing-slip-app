import { compile } from 'handlebars';
import pdfTemplate from "./pdfTemplate";
import puppeteer from "puppeteer-core";
import chrome from 'chrome-aws-lambda';

const createPdf = async (orders) => {
  const template = compile(pdfTemplate);
  const htmlOrders = template(orders);
  const chromeExecPath = await chrome.executablePath;
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: chromeExecPath || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(htmlOrders)
  const pdf = await page.pdf({
    printBackground: true,
    height: '90mm',
    width: '62mm'
  });
  await browser.close();
  return pdf;
};

export { createPdf };
