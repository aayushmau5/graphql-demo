import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { gql, useQuery } from "@apollo/client";
import { initializeApollo } from "../lib/apolloClient";
import { useEffect } from "react";

const GetBlogs = gql`
  query allBlogs {
    blogs {
      _id
      title
      post
      createdAt
      author {
        _id
        username
        email
      }
    }
  }
`;

const BLOGS_SUBSCRIPTION = gql`
  subscription getAllBlogs {
    blogAdded {
      _id
      title
      post
      createdAt
      author {
        _id
        username
        email
      }
    }
  }
`;

export default function Home() {
  // client side data fetching
  const { loading, error, data, subscribeToMore } = useQuery(GetBlogs); //will get the data from cache

  if (loading) {
    return <h1>Loading...</h1>;
  }
  useEffect(() => {
    subscribeToMore({
      document: BLOGS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newFeedItem = subscriptionData.data.blogAdded;
        return Object.assign({}, prev, {
          blogs: [...prev.blogs, newFeedItem],
        });
      },
    });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>GraphQL Blog</title>
      </Head>
      <h1 className={styles.title}>GraphQL Blog</h1>
      <main className={styles.main}>
        <div className={styles.grid}>
          {data.blogs.map((blog) => (
            <div key={blog._id} className={styles.card}>
              <Link href={`/blog/${blog._id}`}>
                <h3>
                  <a>{blog.title}</a>
                </h3>
              </Link>
              <p>{blog.post.slice(0, 20) + "..."}</p>
              <div className={styles.author}>
                {" "}
                - {blog.author.username} (
                <span className={styles.authorEmail}>{blog.author.email}</span>)
              </div>
              <div className={styles.date}>
                {new Date(blog.createdAt).toDateString()}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// pre-rendered value
export async function getStaticProps() {
  // runs on the server, always creting a new instance
  const apolloClient = initializeApollo();

  //populating the inMemoryCache
  await apolloClient.query({
    query: GetBlogs,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(), //extract the data from the cache
      // initialApolloState is now accessible to our "pageProps" object in _app.js
    },
    revalidate: 30, //30 seconds
  };
}
