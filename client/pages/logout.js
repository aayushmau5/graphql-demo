import { useRouter } from "next/router";
import { useApolloClient, useQuery, gql } from "@apollo/client";
import { useEffect } from "react";

const LOGOUT = gql`
  query logout {
    logout
  }
`;

export default function logout() {
  const router = useRouter();
  const client = useApolloClient();

  const { loading, data, error } = useQuery(LOGOUT);

  useEffect(() => {
    console.log(data);
    if (data) {
      client
        .clearStore()
        .then(() => {
          router.push("/");
        })
        .catch((err) => console.log(err));
    }
    if (error) {
      console.log(error.message);
    }
    router.push("/");
  }, [router, client, data, error]);

  return <h1>Logging out...</h1>;
}
