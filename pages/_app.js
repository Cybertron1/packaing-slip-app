import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache} from "@apollo/client";
import App from "next/app";
import {AppProvider} from "@shopify/polaris";
import {Provider} from "@shopify/app-bridge-react";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import React from "react";

class MyApp extends App {
  render() {
    const {Component, pageProps, shopOrigin} = this.props;
    const client = new ApolloClient({
      credentials: "include",
      cache: new InMemoryCache(),
      link: new HttpLink({ uri: '/graphql' })
    });
    return (
      <AppProvider i18n={translations}>
        <Provider
          config={{
            apiKey: API_KEY,
            shopOrigin: shopOrigin,
            forceRedirect: true,
          }}
        >
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </Provider>
      </AppProvider>
    );
  }
}

MyApp.getInitialProps = async ({ctx}) => {
  return {
    shopOrigin: ctx.query.shop,
  };
};

export default MyApp;
