import { Page } from "@shopify/polaris";
import React from "react";
import Card from "../src/client/components/Card";
import Main from '../src/client/pages/main';
import nc from 'next-connect';
import { verifyShop } from "../src/server/middleware/verifyShop";
import db from "../src/server/middleware/database";
import shopifyToken from "../src/server/middleware/shopifyToken";
import auth from "../src/server/middleware/auth";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";

const Index = ({ error, redirectUrl }) => {
  const app = useAppBridge();
  if (error) {
    return <p>{error}</p>;
  }
  if (redirectUrl) {
    const redirector = Redirect.create(app);
    redirector.dispatch(Redirect.Action.REMOTE, redirectUrl);
    return;
  }
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
  if (!verifyShop(req)) {
    return {
      props: {
        error: 'shop param missing/invalid. Please add that param'
      }
    }
  }
  const handler = nc()
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

    } else if (req.state === 'needsUpdate') {
      return {
        props: {
          redirectUrl: req.redirect
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
