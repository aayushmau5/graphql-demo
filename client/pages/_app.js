import { ApolloProvider, gql, useLazyQuery } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
import { useRouter } from "next/router";
import { useState } from "react";

import "../styles/globals.css";
import Nav from "../components/Nav";
import { useEffect } from "react";

const ME = gql`
  query Me {
    me {
      _id
      email
    }
  }
`;

function MyApp({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);
  const router = useRouter();

  const [auth, setAuth] = useState(false);

  const [check, { loading, data, error }] = useLazyQuery(ME, {
    client: client,
  });

  useEffect(() => {
    const checkIfAuth = () => {
      check();
      if (error) return false;
      if (data) return true;
    };

    setAuth(() => checkIfAuth());
  });

  return (
    <>
      <ApolloProvider client={client}>
        <Nav pageRoute={router.route} isAuthenticated={auth} />
        <Component {...pageProps} isAuthenticated={auth} />
      </ApolloProvider>
    </>
  );
}

export default MyApp;
