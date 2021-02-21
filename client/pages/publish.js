import Head from "next/head";
import { useState } from "react";
import { gql, useMutation, useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";

const PUBLISH_BLOG = gql`
  mutation publishBlog($title: String!, $post: String!) {
    addBlog(blog: { title: $title, post: $post }) {
      _id
      title
      post
    }
  }
`;

export default function Publish({ isAuthenticated }) {
  const router = useRouter();
  const client = useApolloClient();

  let loggedinUserId;

  const [publish, { loading }] = useMutation(PUBLISH_BLOG);

  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    publish({ variables: { title, post } })
      .then((data) => {
        client.resetStore();
        router.push("/profile");
      })
      .catch((error) => setError(error.message));
  };

  if (typeof window !== "undefined" && isAuthenticated) {
    loggedinUserId = localStorage.getItem("userId");
  }

  if (!isAuthenticated) {
    return <h1>Unauthorized</h1>;
  }

  return (
    <div>
      <Head>
        <title>Publish a blog</title>
      </Head>
      {loading && <h1>Submitting...</h1>}
      {error !== "" ? <h1>{error}</h1> : null}
      <form onSubmit={onSubmit}>
        <div>
          <h3>Title</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <h3>Post</h3>
          <textarea value={post} onChange={(e) => setPost(e.target.value)} />
        </div>
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
