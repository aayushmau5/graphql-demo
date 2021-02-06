import { useRouter } from "next/router";

export default function blogIndex() {
  const router = useRouter();
  if (typeof window !== "undefined") router.push("/");
  return null;
}
