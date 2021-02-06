import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";

const GET_SPECIFIC_BLOG = gql`
  query getBlog($id: ID!) {
    blog(id: $id) {
      _id
      title
      post
      createdAt
      author {
        username
        email
      }
    }
  }
`;

export default function specificBlog() {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_SPECIFIC_BLOG, {
    variables: { id },
  });

  if (loading) return <h1>Loading...</h1>;
  if (error) {
    console.log(error);
    return <h3 className="error">Error Occured</h3>;
  }

  return (
    <div className={styles.blogcontainer}>
      <Head>
        <title>{data.blog.title}</title>
      </Head>
      <Link href="/">
        <a>&larr; Back to homepage</a>
      </Link>
      <div>
        <h1>{data.blog.title}</h1>
        <div className={styles.author}>
          {" "}
          - {data.blog.author.username} (
          <span className={styles.authorEmail}>{data.blog.author.email}</span>)
        </div>
        <div className={styles.date}>
          {new Date(data.blog.createdAt).toDateString()}
        </div>
        <div className={styles.post}>{data.blog.post}</div>
      </div>
    </div>
  );
}
