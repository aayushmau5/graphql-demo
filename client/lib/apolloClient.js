import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { useMemo } from "react";

let apolloClient;

const httpLink = new HttpLink({
  uri: "http://localhost:4000/",
  credentials: "include",
});

const wsLink = process.browser
  ? new WebSocketLink({
      // if you instantiate in the server, the error will be thrown
      uri: `ws://localhost:4000/graphql`,
      options: {
        reconnect: true,
      },
    })
  : null;

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const link = process.browser
  ? split(
      //only create the split in the browser
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === "OperationDefinition" && operation === "subscription";
      },
      wsLink,
      httpLink
    )
  : httpLink;

function createApolloClient() {
  // if "typeof window" is "undefined", then we are in server, so use SSR mode
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: link,
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
