import nc from 'next-connect';
import accessToken from "../../middleware/accessToken";
import { createPdf } from "../../pdf/pdf";
import fs from 'fs';
export default nc()
  .use(accessToken)
  .post(async (req, res) => {
    const test = fs.readdirSync('./');
    const ids = req.body.map(id => id.split('/').slice(-1).pop());
    const idsString = ids.join();
    const headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': req.accessToken,
    };
    const ordersUrl = `https://${req.shop}.myshopify.com/admin/api/2021-01/orders.json?ids=${idsString}`;
    const response = await fetch(ordersUrl, {
      headers
    });
    if (!response.ok) {
      return res.status(500).send("Couldn't fetch count of orders");
    }
    const data = await response.json();
    console.log(data);
    const orders = data.orders.map(order => {
      try {
        return {
          createdAt: new Date(order.created_at).toLocaleDateString('en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          order: order.name,
          note: order.note,
          address: {
            first_name: order.shipping_address.first_name,
            last_name: order.shipping_address.last_name,
            zip: order.shipping_address.zip
          },
          items: order.line_items.map(item => {
            return {
              quantity: item.quantity,
              title: item.title,
              variant: item.variant_title,
              properties: item.properties
            }
          })
        }
      } catch (error) {
        return {}
      }
    });
    console.log(orders);
    const creator = createPdf(orders);
    creator.toStream((err, stream) => {
      if (err) return res.end(err.stack)
      res.writeHead(200, { 'Content-type': 'application/pdf' })
      stream.pipe(res)
    });
    return new Promise(resolve => res.on('finish', resolve));
  });
