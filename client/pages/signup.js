import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

import styles from "../styles/Home.module.css";

const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(user: { username: $username, email: $email, password: $password }) {
      user {
        _id
        username
        email
      }
      token
    }
  }
`;

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [signupUser, { data, loading, error }] = useMutation(SIGNUP);

  const submitForm = (e) => {
    setErrorMessage("");
    e.preventDefault();
    signupUser({ variables: { username, email, password } }).catch((error) =>
      setErrorMessage(error.message)
    );
  };

  if (loading) return <h1>Signing Up...</h1>;

  if (data) {
    console.log(data);
    if (typeof window !== "undefined") router.push("/");
  }

  return (
    <div className={styles.container}>
      {errorMessage !== "" ? <h1>{errorMessage}</h1> : null}
      <form onSubmit={submitForm}>
        <div className={styles.formContainer}>
          Username:{" "}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.formContainer}>
          Email:{" "}
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formContainer}>
          Password:{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className={styles.formButton} type="submit">
          Signup
        </button>
      </form>
    </div>
  );
}
