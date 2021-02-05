import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { useMemo } from "react";

let apolloClient;

function createApolloClient() {
  // if "typeof window" is "undefined", then we are in server, so use SSR mode
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({ uri: "http://localhost:4000/" }),
    cache: new InMemoryCache(),
  });
  // cache stores the result of the queries the apollo client runs
  // if we run a query on the server and it finally renders on the client, we don't have to re-run the query that it had already done on the server, so we take the result from cache.
}

export function initializeApollo(initialState = null) {
  // to differentiate whether we are running on the server or the client (SSR in Nextjs)
  // creating a temporary "_apolloClient" variable
  const _apolloClient = apolloClient ?? createApolloClient(); //check if the apolloClient has already been initialized

  if (initialState) {
    // if we have an initialState
    // restore the cache on the client to whatever the server has given us
    _apolloClient.cache.restore(initialState);
  }

  // if we are in server, we always need to initialize a new apollo instance, cause we don't want our cache to overlap with other's cache
  if (typeof window === "undefined") return _apolloClient;

  //reuse if already initialized or use the new one
  apolloClient = apolloClient ?? _apolloClient;

  return apolloClient;
}

export function useApollo(initialState) {
  // initalState is used for the cache.
  // useMemo ensures that we get the same value returned by "initializeApollo" function until the value "initialState" changes
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
