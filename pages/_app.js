import {AppProvider} from "@shopify/polaris";
import {Provider} from "@shopify/app-bridge-react";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import AppContext from "../components/AppContext";
import React, {useState} from "react";

function MyApp(props) {
  const [shopUrl, setShopUrl] = useState(props.shopOrigin);
  if (typeof window === `undefined`) return null;
  if (shopUrl === undefined) {
    return <div>hey</div>;
  }
  const {Component} = props;
  return (
    <AppProvider i18n={translations}>
      <Provider
        config={{
          apiKey: API_KEY,
          shopOrigin: shopUrl,
          forceRedirect: true,
        }}
      >
        <AppContext>
          <Component {...Component} />
        </AppContext>
      </Provider>
    </AppProvider>
  );
}


MyApp.getInitialProps = async ({ctx}) => {
  return {
    shopOrigin: ctx.query.shop
  };
}

export default MyApp;
