import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
import { useRouter } from "next/router";

import "../styles/globals.css";
import Nav from "../components/Nav";

const checkIfAuth = () => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem("auth_token");
    return value;
  }
  return null;
};

function MyApp({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);
  const router = useRouter();

  return (
    <ApolloProvider client={client}>
      <Nav pageRoute={router.route} isAuthenticated={checkIfAuth()} />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
