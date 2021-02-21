import Link from "next/link";
import { useEffect, useState } from "react";
import { gql, useLazyQuery, useQuery } from "@apollo/client";

import styles from "../styles/Nav.module.css";

const ME = gql`
  query Me {
    me {
      _id
      email
    }
  }
`;

export default function Nav({ pageRoute, changeAuthState, isAuthenticated }) {
  const changeState = (value) => {
    changeAuthState(value);
  };

  const [queryMe] = useLazyQuery(ME, {
    fetchPolicy: "network-only",
    onError: () => {
      changeState(false);
    },
    onCompleted: () => {
      changeState(true);
    },
  });

  useEffect(() => {
    queryMe();
  }, [pageRoute]);

  return (
    <div className={styles.navContainer}>
      <Link href="/">
        <a className={pageRoute === "/" ? styles.selected : styles.link}>
          Home
        </a>
      </Link>
      {isAuthenticated ? (
        <Link href="/profile">
          <a
            className={pageRoute === "/profile" ? styles.selected : styles.link}
          >
            Profile
          </a>
        </Link>
      ) : null}
      {!isAuthenticated ? (
        <Link href="/login">
          <a className={pageRoute === "/login" ? styles.selected : styles.link}>
            Login
          </a>
        </Link>
      ) : null}
      {isAuthenticated ? (
        <Link href="/publish">
          <a
            className={pageRoute === "/publish" ? styles.selected : styles.link}
          >
            Publish
          </a>
        </Link>
      ) : null}
      {isAuthenticated ? null : (
        <Link href="/signup">
          <a
            className={pageRoute === "/signup" ? styles.selected : styles.link}
          >
            Signup
          </a>
        </Link>
      )}
      {isAuthenticated ? (
        <Link href="/logout">
          <a className={styles.link}>Logout</a>
        </Link>
      ) : null}
    </div>
  );
}
