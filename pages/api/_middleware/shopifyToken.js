import nc from 'next-connect';
import ShopifyToken from "shopify-token";

export default nc()
  .use((req, res, next) => {
    req.shopifyToken = new ShopifyToken({
      sharedSecret: process.env.SHOPIFY_API_SECRET,
      redirectUri: `https://${req.headers.host}/api/auth/callback`,
      apiKey: process.env.SHOPIFY_API_KEY
    });
    next();
  });
