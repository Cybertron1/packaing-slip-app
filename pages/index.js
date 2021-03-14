import { Page } from "@shopify/polaris";
import React from "react";
import Card from "../src/client/components/Card";
import Main from '../src/client/pages/main';
import nc from 'next-connect';
import verifyShop from "../src/server/middleware/verifyShop";
import db from "../src/server/middleware/database";
import shopifyToken from "../src/server/middleware/shopifyToken";
import auth from "../src/server/middleware/auth";

const Index = () => {
  return <Page fullWidth>
    <Card>
      <Main/>
    </Card>
  </Page>
};

export async function getServerSideProps(context) {
  const req = {
    ...context.req,
    query: context.query
  };
  const handler = nc()
    .use(verifyShop)
    .use(db)
    .use(shopifyToken)
    .get(async (req, res, next) => {
      const result = await auth(req);
      req.state = result.state;
      req.redirect = result.url;
      next();
    });
  try {
    await handler.run(req, context.res);
    if (req.state === 'notInstalled') {
      return {
        redirect: {
          destination: req.redirect,
          permanent: false
        }
      }
    }
  } catch (err) {
    console.log(err);
  }

  return {
    props: {}
  };
}

export default Index;
