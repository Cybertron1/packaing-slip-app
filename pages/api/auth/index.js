import nc from 'next-connect';
import db from '../../../src/server/middleware/database'
import verifyShop from "../../../src/server/middleware/verifyShop";
import shopifyToken from "../../../src/server/middleware/shopifyToken";
import auth from "../../../src/server/middleware/auth";

export default nc()
  .use(verifyShop)
  .use(db)
  .use(shopifyToken)
  .get(async (req, res) => {
    try {
      const result = await auth(req)
      res.redirect(result);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });



