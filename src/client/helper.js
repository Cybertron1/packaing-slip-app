const mapData = (data) => {
  if (data && data['orders'] && data['orders']['edges']) {
    return data['orders']['edges'].map(order => {
      const { id, name, createdAt, customer, subtotalLineItemsQuantity, totalPriceSet } = order.node;
      const first = customer ? customer.firstName : "No Customer";
      const last = customer ? customer.lastName : "";
      const date = new Date(createdAt).toLocaleDateString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const total = new Intl.NumberFormat('en', {
        style: 'currency',
        currency: totalPriceSet.presentmentMoney.currencyCode
      }).format(totalPriceSet.presentmentMoney.amount);
      return {
        total,
        items: subtotalLineItemsQuantity,
        id,
        name,
        date,
        first,
        last
      }
    });
  }
  return [];
};

const createPdf = async (fetch, selected) => {
  const pdf = await fetch('/api/generatePdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(selected)
  });
  if (!pdf.ok) {
    return;
  }
  const labels = await pdf.blob();
  const url = URL.createObjectURL(labels);
  window.open(url);
}

export { mapData, createPdf };
