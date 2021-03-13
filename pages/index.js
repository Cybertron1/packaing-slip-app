import { Page } from "@shopify/polaris";
import React from "react";
import Card from "../src/client/components/Card";
import Main from '../src/client/pages/main';

const Index = () => {
  return <Page fullWidth>
    <Card>
      <Main/>
    </Card>
  </Page>
};

export default Index;
