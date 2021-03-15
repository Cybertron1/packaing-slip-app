import nextConnect from 'next-connect';
import db from "../../../src/server/middleware/database";
import Shop from "../../../src/server/models/Shop";
import shopifyToken from "../../../src/server/middleware/shopifyToken";

const getShopInfo = async (accessToken, shop) => {
  const headers = {
    "X-Shopify-Access-Token": accessToken,
  };
  const url = `https://${shop}/admin/api/2021-01/shop.json`;
  return await fetch(url, {
    headers
  });
};

const accessScope = async (accessToken, shop) => {
  const headers = {
    "X-Shopify-Access-Token": accessToken,
  };
  const url = `https://${shop}/admin/oauth/access_scopes.json`;
  return await fetch(url, {
    headers
  });
};

export default nextConnect()
  .use(db)
  .use(shopifyToken)
  .get(async (req, res) => {
    try {
      const { state: nonce, shop, code } = req.query;
      const shopifyToken = req.shopifyToken;

      if ([nonce, shop, code].includes(null)) {
        res.status(401).send("Unauthenticated Request!");
        return
      }

      if (!shopifyToken.verifyHmac(req.query)) {
        res.status(401).send("Unauthenticated Request!");
        return
      }

      const shopName = shop.replace("https://", "").split(".")[0];
      const persistedNonce = await Shop.findOne(
        { shop: shopName },
        "nonce"
      ).orFail(new Error("Internal server error1"));

      if (nonce !== persistedNonce.nonce) {
        res.status(401).send("Unauthenticated Request!");
        return;
      }

      const { access_token: accessToken } = await shopifyToken.getAccessToken(shop, code);
      await Shop.findOneAndUpdate(
        { shop: shopName },
        {
          installedOn: Date.now(),
          isInstalled: true,
          accessToken: accessToken
        }
      ).orFail(new Error("Internal server error2"));
      const scope = await accessScope(accessToken, shop);
      if (!scope.ok) {
        res.status(501).send("fuck that");
        return
      }
      const shopScope = await scope.json();
      await Shop.findOneAndUpdate(
        { shop: shopName },
        {
          scopes: shopScope.access_scopes.map(scope => scope.handle)
        }
      ).orFail(new Error("Internal server error3"));
      const info = await getShopInfo(accessToken, shop);
      if (!info.ok) {
        res.status(501).send("fuck that");
        return
      }
      const infoData = await info.json();
      await Shop.findOneAndUpdate(
        {
          shop: shopName
        },
        {
          info: infoData.shop,
          nonce: "",
          webhooks: {},
        }
      ).orFail(new Error("Internal server error4"));
      return res.redirect(`/?shop=${shopName}.myshopify.com`);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  });
