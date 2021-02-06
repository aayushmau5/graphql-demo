import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
import { useRouter } from "next/router";

import "../styles/globals.css";
import Nav from "../components/Nav";

function MyApp({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);
  const router = useRouter();

  return (
    <ApolloProvider client={client}>
      <Nav pageRoute={router.route} />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
