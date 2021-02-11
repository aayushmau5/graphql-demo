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

export default function Publish() {
  const router = useRouter();
  const client = useApolloClient();

  let loggedinUserId;
  let authToken;

  const [publish, { loading }] = useMutation(PUBLISH_BLOG);

  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [error, setError] = useState("");
  const onSubmit = () => {
    setError("");
    publish({ variables: { title, post } })
      .then((data) => {
        client.resetStore();
        router.push("/profile");
      })
      .catch((error) => setError(error.message));
  };

  if (typeof window !== "undefined") {
    loggedinUserId = localStorage.getItem("userId");
    authToken = localStorage.getItem("auth_token");
  }

  if (!loggedinUserId && !authToken && typeof window !== "undefined") {
    return <h1>Unauthorized</h1>;
  }

  return (
    <div>
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
