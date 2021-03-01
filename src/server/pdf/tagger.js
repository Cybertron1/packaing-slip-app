import fetch from "node-fetch";

const tag = async (req, ids, orders) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': req.accessToken,
  };

  const orderToTag = orders.map(async order => {
    const { id, tags } = order;
    const ordersUrl = `https://${req.shop}.myshopify.com/admin/api/2021-01/orders/${id}.json`;
    const response = await fetch(ordersUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        order: {
          id,
          tags: `${tags}${tags.length > 0 ? ',' : ''}printed`
        }
      })
    });
    return { ok: response.ok, id };
  });

  return Promise.all(orderToTag);
}

export { tag };
