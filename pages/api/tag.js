import nc from 'next-connect';
import act from "../../src/server/middleware/accessToken";
import tag from "../../src/server/pdf/tagOrders";

const handler = nc()
  .use(act)
  .post(async (req, res) => {
    const result = await tag(req, "tagsAdd");
    res.json(JSON.stringify(result));
  });

export default handler;
// graphql to fetch all tags from ids
// tag all set ids
