import fetch from "node-fetch";

const getOrderDetails = async (req, ids) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': req.accessToken,
  };
  const ordersUrl = `https://${req.shop}.myshopify.com/admin/api/2021-01/orders.json?ids=${ids}`;
  const response = await fetch(ordersUrl, {
    headers
  });

  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data.orders;
}

const mapOrderDetails = (orders) => orders.map(order => {
  try {
    return {
      createdAt: new Date(order.created_at).toLocaleDateString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      order: order.name,
      note: order.note,
      address: {
        first_name: order.shipping_address.first_name,
        last_name: order.shipping_address.last_name,
        zip: order.shipping_address.zip
      },
      items: order.line_items.map(item => {
        return {
          quantity: item.quantity,
          title: item.title,
          variant: item.variant_title,
          properties: item.properties
        }
      })
    }
  } catch (error) {
    return {}
  }
});

export { mapOrderDetails }

export default getOrderDetails;
