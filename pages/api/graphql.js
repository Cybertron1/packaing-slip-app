import nc from 'next-connect';
import accessToken from "../../src/server/middleware/accessToken";
import graphql from "../../src/server/graphql";

const handler = nc()
  .use(accessToken)
  .post(async (req, res) => {
    const { shop, accessToken, body } = req;
    const result = await graphql(shop, accessToken, body);
    res.status(result.status).send(result.content);
  });


export default handler;

