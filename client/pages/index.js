import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>GraphQL Blog</title>
      </Head>

      <main className={styles.main}>A blog made using GraphQL</main>
    </div>
  );
}
