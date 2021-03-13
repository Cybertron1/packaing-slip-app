import nc from "next-connect";
import accessToken from "../middleware/accessToken";
import getOrderDetails, { mapOrderDetails } from "./orderDetails";
import createPdf from "./createPdf";
import { Duplex } from "stream";

export default nc()
  .use(accessToken)
  .post(async (req, res) => {
    const ids = req.body.map(id => id.split('/').slice(-1).pop());
    const orderDetails = await getOrderDetails(req, ids.join());
    if (orderDetails === null) {
      return res.send("Couldn't fetch count of orders").status(500);
    }
    const orders = mapOrderDetails(orderDetails);
    try {
      const pdf = await createPdf(orders);

      res.writeHead(200, {
        'Content-type': 'application/pdf'
      })
      let duplex = new Duplex();
      duplex.push(pdf);
      duplex.push(null);
      duplex.pipe(res);
      return new Promise(resolve => res.on('finish', resolve));
    } catch (error) {
      return res.send("There has been an internal server error").status(500);
    }

  });
