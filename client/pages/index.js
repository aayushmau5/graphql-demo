import Head from "next/head";
import styles from "../styles/Home.module.css";
import { gql, useQuery } from "@apollo/client";
import { initializeApollo } from "../lib/apolloClient";

const GetUser = gql`
  query allUsers {
    users {
      _id
      email
      username
      blogs {
        _id
        title
      }
    }
  }
`;

export default function Home({ props }) {
  // client side data fetching
  const { loading, error, data } = useQuery(GetUser);

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className={styles.container}>
      <Head>
        <title>GraphQL Blog</title>
      </Head>
      <h1 className={styles.title}>GraphQL Blog</h1>
      <main className={styles.main}>{JSON.stringify(data)}</main>
    </div>
  );
}

export async function getStaticProps() {
  // runs on the server, always creting a new instance
  const apolloClient = initializeApollo();

  //populating the inMemoryCache
  await apolloClient.query({
    query: GetUser,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      // initialApolloState is now accessible to our "pageProps" object in _app.js
    },
  };
}
