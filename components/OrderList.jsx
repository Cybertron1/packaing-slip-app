import React, { useRef, useState } from "react";
import { ResourceItem, ResourceList, Spinner, TextStyle } from "@shopify/polaris";
import useAllOrders from "./hooks/useAllOrders";
import styles from './OrderList.module.scss'
import { useFetch } from "./AppContext";

const renderItem = (item) => {
  const { name, id } = item;
  return (
    <ResourceItem
      id={id}
      accessibilityLabel={`View details for ${name}`}
      name={name}
    >
      <h3>
        <TextStyle variation="strong">{name}</TextStyle>
      </h3>
    </ResourceItem>
  );
};

const mapData = (data) => {
  return data['orders']['edges'].map(order => order.node);
};

const OrderList = () => {
  const { loading, error, data } = useAllOrders();
  const [selectedItems, setSelectedItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const download = useRef(null);
  const fetch = useFetch();
  const createPdf = async () => {
    const pdf = await fetch('/api/generatePdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedItems)
    });
    if(!pdf.ok) {
      return;
    }
    const labels = await pdf.blob();
    const url = URL.createObjectURL(labels);
    window.open(url);
  }

  const promotedBulkActions = [
    {
      content: 'Print packaging labels',
      onAction: createPdf,
    },
  ];


  if (loading) {
    return <div className={styles['orders-loader']}><Spinner/></div>
  }
  if (error) {
    return <p>Fuck off there was an error</p>
  }
  if (orders.length === 0) {
    setOrders(mapData(data));
    return <div className={styles['orders-loader']}><Spinner/></div>
  }
  return <>
    <ResourceList
      resourceName={{ singular: 'Order', plural: 'Orders' }}
      items={orders}
      selectedItems={selectedItems}
      onSelectionChange={setSelectedItems}
      selectable
      renderItem={renderItem}
      promotedBulkActions={promotedBulkActions}
    />
    <a ref={download}/>
  </>;
}

export default OrderList;
