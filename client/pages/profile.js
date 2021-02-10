import Head from "next/head";
import { useRouter } from "next/router";
import { gql, useQuery, useMutation } from "@apollo/client";

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
  let loggedinUserId;
  let authToken;
  if (typeof window !== "undefined") {
    loggedinUserId = localStorage.getItem("userId");
    authToken = localStorage.getItem("auth_token");
  }
  const router = useRouter();

  if (!loggedinUserId && !authToken && typeof window !== "undefined") {
    router.push("/login");
  }

  console.log(loggedinUserId);
  const { loading, error, data } = useQuery(GET_SPECIFIC_USER, {
    variables: { id: loggedinUserId },
  });

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>{error.message}</h1>;

  if (data) {
    console.log(data);
  }

  return (
    <div>
      <Head>
        <title>Profile</title>
      </Head>
      {JSON.stringify(data.user)}
    </div>
  );
}
