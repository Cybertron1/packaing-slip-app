import nc from 'next-connect';
import database from "./database";
import jwt from "./jwt";
import Shop from "../models/Shop";

export default nc()
  .use(database)
  .use(jwt)
  .use(async (req, res, next) => {
    console.log("accessToken");
    let shop = req.token.dest.replace("https://", "")
      .split(".")[0];
    const result = await Shop.findOne(
      {
        shop
      },
      "accessToken"
    );
    req.accessToken = result.accessToken;
    req.shop = shop;
    next();
  });
