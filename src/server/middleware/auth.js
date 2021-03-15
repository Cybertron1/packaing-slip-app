import Shop from "../models/Shop";

const store = async ({ shop, accessToken }) => {
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

const auth = async (req) => {
  const { shop: shopName } = req.query;
  const shop = await Shop.findOne({ shop: shopName });
  let state = 'notInstalled';
  if (shop && shop.isInstalled) {
    state = 'needsUpdate';
    const isAvailable = await store(shop);
    const scope = shop.scopes ?? [];
    const scopes = process.env.SCOPES.split(',').every(val => scope.includes(val));
    if (isAvailable && scopes) {
      return {
        state: 'installed',
        url: `/?shop=${shopName}.myshopify.com`
      };
    }
  }
  const shopifyToken = req.shopifyToken;
  const nonce = shopifyToken.generateNonce();
  await Shop.updateOne(
    { shop: shopName },
    { shop: shopName, nonce },
    { upsert: true }
  ).orFail(new Error("Server error"));
  return {
    state,
    url: shopifyToken.generateAuthUrl(shopName, process.env.SCOPES.split(","), nonce, 'online')
  };
};

export default auth;
