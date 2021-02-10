import Link from "next/link";

import styles from "../styles/Nav.module.css";

export default function Nav({ pageRoute, isAuthenticated }) {
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
      ) : (
        <Link href="/login">
          <a className={pageRoute === "/login" ? styles.selected : styles.link}>
            Login
          </a>
        </Link>
      )}
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
        <Link href="/">
          <a
            onClick={() => {
              localStorage.removeItem("userId");
              localStorage.removeItem("auth_token");
            }}
          >
            Logout
          </a>
        </Link>
      ) : null}
    </div>
  );
}
