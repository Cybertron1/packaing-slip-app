import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import AppContext from "../src/client/context/AppContext";
import React, { useState } from "react";

function MyApp({ shopOrigin, pageProps, Component }) {
  const [shopUrl,] = useState(shopOrigin);
  if (typeof window === `undefined`) return null;
  if (shopUrl === undefined) {
    return <div>hey</div>;
  }
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
          <Component {...pageProps} />
        </AppContext>
      </Provider>
    </AppProvider>
  );
}


MyApp.getInitialProps = async ({ ctx }) => {
  return {
    shopOrigin: ctx.query.shop
  };
}

export default MyApp;
