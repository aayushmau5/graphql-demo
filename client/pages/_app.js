import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
import { useRouter } from "next/router";
import { useState } from "react";

import "../styles/globals.css";
import Nav from "../components/Nav";

function MyApp({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);
  const router = useRouter();
  const [auth, setAuth] = useState(false);

  return (
    <>
      <ApolloProvider client={client}>
        <Nav
          pageRoute={router.route}
          isAuthenticated={auth}
          changeAuthState={setAuth}
        />
        <Component {...pageProps} isAuthenticated={auth} />
      </ApolloProvider>
    </>
  );
}

export default MyApp;
