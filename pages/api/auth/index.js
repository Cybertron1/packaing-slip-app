import nc from 'next-connect';
import db from '../../../middleware/database'
import Shop from "../../../models/Shop";
import verifyShop from "../../../middleware/verifyShop";
import shopifyToken from "../../../middleware/shopifyToken";

const store = async (shop, accessToken) => {
  try {
    const headers = {
      "X-Shopify-Access-Token": accessToken,
    };

    const url = `https://${shop}.myshopify.com/admin/api/2021-01/shop.json`
    const info = await fetch(url, {
      headers
    });
    if (!info.ok) {
      return false;
    }
    const data = await info.json();
    //if we have 'shop' in the returned data, the store is installed
    return !!data.shop;
  } catch (error) {
    return false
  }
}
export default nc()
  .use(verifyShop)
  .use(db)
  .use(shopifyToken)
  .get(async (req, res) => {
    try {
      const { shop: shopName } = req.query;
      const shop = await Shop.findOne({ shop: shopName });
      console.log(shop);
      if (shop && shop.isInstalled) {
        const isAvailable = await store();
        if (isAvailable) {
          res.redirect(`/?shop=${shopName}.myshopify.com`);
          return;
        }
      }
      const shopifyToken = req.shopifyToken;
      const nonce = shopifyToken.generateNonce();
      await Shop.updateOne(
        { shop: shopName },
        { shop: shopName, nonce },
        { upsert: true }
      ).orFail(new Error("Server error"));
      const redirectUrl = shopifyToken.generateAuthUrl(shopName, process.env.SCOPES.split(","), nonce, 'online');
      return res.redirect(redirectUrl);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  });



