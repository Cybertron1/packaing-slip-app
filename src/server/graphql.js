import fetch from "node-fetch";

const graphql = async (shop, accessToken, query) => {
  try {
    const response = await fetch(`https://${shop}.myshopify.com/admin/api/2021-01/graphql.json`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      cache: "no-store",
      body: JSON.stringify(query),
      redirect: 'follow'
    });
    if (!response.ok) {
      return { status: response.status, content: null };
    }
    const content = await response.json();
    return { status: response.status, content };
  } catch (error) {
    console.log(error);
    return { status: 500 }
  }
}


export default graphql;
