import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, {verifyRequest} from "@shopify/koa-shopify-auth";
import graphQLProxy, {ApiVersion} from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import bodyParser from 'koa-bodyparser';
import {createPdf} from './pdf.js';

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const {SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES} = process.env;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      server
    )
  );

  server.keys = [SHOPIFY_API_SECRET];
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],

      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const {shop} = ctx.state.shopify;

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}`);
      },
    })
  );
  server.use(
    graphQLProxy({
      version: ApiVersion.October20,
    })
  );
  server.use(bodyParser());


  router.post("/generatePdf", async (ctx) => {
    let ids = ctx.request.body;
    ids = ids.map(id => id.split('/').slice(-1).pop());
    const idsString = ids.join();
    const headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ctx.session.accessToken,
    };
    const ordersUrl = `https://${ctx.session.shop}/admin/api/2021-01/orders.json?ids=${idsString}`;
    let response;
    try {
      response = await fetch(ordersUrl, {
        headers
      }).then(res => res.json());

    } catch (err) {
      console.log(err);
      ctx.throw(500, "Couldn't fetch count of orders");
      return;
    }
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    const orders = response.orders.map(order => {
      return {
        createdAt: new Date(order.created_at).toLocaleDateString('en', options),
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
    });
    const creator = createPdf(orders);
    creator.toStream((err, stream) => {
      if (err) return ctx.res.end(err.stack)
      ctx.res.writeHead(200, {'Content-type': 'application/pdf'})
      stream.pipe(ctx.res)
    });
    return new Promise(resolve => ctx.res.on('finish', resolve));
  });

  router.get("(.*)", verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
