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
    if (data) {
      client.resetStore().then(() => {
        router.push("/");
      });
    } else {
      router.push("/profile");
    }
  }, [router, client, data]);

  return <h1>Loggin out...</h1>;
}
