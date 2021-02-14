import nc from 'next-connect';
import accessToken from "./_middleware/accessToken";

const handler = nc()
  .use(accessToken)
  .post(async (req, res) => {
    const shop = req.shop;
    const accessToken = req.accessToken;
    const response = await fetch(`https://${shop}.myshopify.com/admin/api/2021-01/graphql.json`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify(req.body),
      redirect: 'follow'
    });

    const data = await response.json();
    res.json(data);
  })

export default handler;

