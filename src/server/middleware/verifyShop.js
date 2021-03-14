import nc from 'next-connect';

const verifyShop = (req) => {
  if (!req.query.shop || (req.query.shop && req.query.shop.indexOf("myshopify") === -1)) {
    return false;
  }
  req.query.shop = req.query.shop
    .replace("https://", "")
    .split(".")[0];
  return true;
};

export { verifyShop };

export default nc()
  .use((req, res, next) => {
    if (verifyShop(req)) {
      res.send("shop param missing/invalid. Please add that param");
      res.end();
      return;
    }
    return next();
  });
