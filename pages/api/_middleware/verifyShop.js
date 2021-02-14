import nc from 'next-connect';

export default nc()
  .use((req, res, next) => {
    if (!req.query.shop || (req.query.shop && req.query.shop.indexOf("myshopify") === -1)) {
      res.send("shop param missing/invalid. Please add that param");
      res.end();
      return;
    }
    req.query.shop = req.query.shop
      .replace("https://", "")
      .split(".")[0];
    return next();
  });
