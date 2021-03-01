import { Page, Tabs } from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import OrderList from "../src/client/components/OrderList";
import Card from "../src/client/components/Card";
import OrdersContext, { useNotPrinted, usePrinted } from "../src/client/context/OrdersContext";

const Orders = ({ useOrders }) => {
  const { data, loading, error, update, title } = useOrders();
  if (error) {
    return <p>Fuck me there was an error...</p>
  }
  return <OrderList orders={data} loading={loading} tagAction={{
    content: title,
    onAction: update
  }}/>;
}

const Index = () => {
  const [selected, setSelected] = useState(0);
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );
  const tabs = [
    {
      content: 'Not printed',
      component: <Orders useOrders={useNotPrinted}/>,
      id: 'not-printed-orders'
    },
    {
      content: 'Printed',
      component: <Orders useOrders={usePrinted}/>,
      id: 'printed-orders'
    }
  ];

  return <Page fullWidth>
    <Card>
      <OrdersContext>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
          {tabs[selected].component}
        </Tabs>
      </OrdersContext>
    </Card>
  </Page>
};

export default Index;
