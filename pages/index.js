import {Card, Page} from "@shopify/polaris";
import React from "react";
import dynamic from 'next/dynamic'

const OrderList = dynamic(() =>
  import('../components/OrderList')
);

const Index = () => {
  return <Page
    fullWidth
    title="Hi">
    <Card>
      <OrderList/>
    </Card>
  </Page>
};

export default Index;
