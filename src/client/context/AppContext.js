import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache} from "@apollo/client";
import {authenticatedFetch, getSessionToken} from "@shopify/app-bridge-utils";
import {useAppBridge} from "@shopify/app-bridge-react";
import React, {useContext, useEffect, useState} from "react";

const JWTContext = React.createContext({});

const useFetch = () => {
  return useContext(JWTContext).fetch;
}

export {useFetch};

const AppContext = ({children}) => {
  const appBridge = useAppBridge();
  const [sessionToken, setSessionToken] = useState(null);

  useEffect(() => {
    getSessionToken(appBridge).then(token => {
      setSessionToken(token);
    });
  }, [appBridge]);

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: 'omit',
      uri: '/api/graphql',
      fetch: authenticatedFetch(appBridge)
    })
  });

  return <ApolloProvider client={client}>
    <JWTContext.Provider value={{
      fetch: authenticatedFetch(appBridge)
    }}>
      {sessionToken ? children : "Loading"}
    </JWTContext.Provider>
  </ApolloProvider>
}

export default AppContext;
