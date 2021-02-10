import Head from "next/head";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";

const GET_SPECIFIC_USER = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      _id
      username
      email
      blogs {
        _id
        title
      }
    }
  }
`;

const DELETE_BLOG = gql`
  mutation deleteBlog($id: ID!) {
    deleteBlog(id: $id) {
      _id
    }
  }
`;

export default function profile() {
  const client = useApolloClient();
  let loggedinUserId;
  let authToken;
  const [deleteError, setDeleteError] = useState("");
  if (typeof window !== "undefined") {
    loggedinUserId = localStorage.getItem("userId");
    authToken = localStorage.getItem("auth_token");
  }

  if (!loggedinUserId && !authToken && typeof window !== "undefined") {
    return <h1>Unauthorized</h1>;
  }

  const { loading, error, data } = useQuery(GET_SPECIFIC_USER, {
    variables: { id: loggedinUserId },
  });

  const [deleteBlogFn] = useMutation(DELETE_BLOG);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>{error.message}</h1>;

  const deleteBlog = (id) => {
    setDeleteError("");
    deleteBlogFn({ variables: { id } })
      .then((data) => {
        client.resetStore();
      })
      .catch((error) => {
        setDeleteError(error.message);
      });
  };

  return (
    <div>
      <Head>
        <title>Profile</title>
      </Head>
      <div>
        {deleteError !== "" ? deleteError : null}
        <h2>Username: {data.user.username}</h2>
        <h4>Email: {data.user.email}</h4>
        <div>
          {data.user.blogs.map((blog) => (
            <div key={blog._id}>
              <Link href={`/blog/${blog._id}`}>
                <h3>
                  <a>{blog.title}</a>
                </h3>
              </Link>
              <button onClick={() => deleteBlog(blog._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
