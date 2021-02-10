import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";
import { useEffect } from "react";

export default function logout() {
  const router = useRouter();
  const client = useApolloClient();

  useEffect(() => {
    localStorage.removeItem("userId");
    localStorage.removeItem("auth_token");
    client.resetStore().then(() => {
      router.push("/");
    }, [router, client]);
  });

  return <h1>Loggin out...</h1>;
}
