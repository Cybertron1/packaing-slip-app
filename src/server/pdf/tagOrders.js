import graphql from "../graphql";

const sleep = async () => {
  return new Promise(resolve => setTimeout(resolve, 200));
}

const tag = async (req, method) => {
  const { shop, accessToken } = req;
  const promises = req.body.map(async id => {
    let count = 0;

    const tagit = async () => {
      const f = `
        mutation UpdateTags($id: ID!) {
          ${method}(id: $id tags: ["printed"]) {
            node {
              id
            }
          }
        }`

      const variables = {
        id
      }
      return graphql(shop, accessToken, {
        query: f,
        variables,
        operationName: 'UpdateTags'
      });
    }

    let tagged = await tagit();
    while (tagged.status === 429 && count <= 3) {
      count++;
      await sleep();
      tagged = await tagit();
    }
    return {
      id,
      status: tagged.status
    }
  });

  return Promise.all(promises);
}

export default tag;
