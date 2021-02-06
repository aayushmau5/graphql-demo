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
      <Link href="/login">
        <a className={pageRoute === "/login" ? styles.selected : styles.link}>
          Login
        </a>
      </Link>
      <Link href="/signup">
        <a className={pageRoute === "/signup" ? styles.selected : styles.link}>
          Signup
        </a>
      </Link>
    </div>
  );
}
