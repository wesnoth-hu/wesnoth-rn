"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/zustand/store/userStore";
import LogoutAction from "@/actions/signoff/logoutAction";
import Link from "next/link";
import styles from "@/styles/Profile.module.css";

export default function Page() {
  const router = useRouter();
  const { user, getUserData, needRefetch } = useUserStore();

  React.useEffect(() => {
    getUserData();
  }, [getUserData, needRefetch]);

  // if (user === null) {
  //   router.replace("/signin");
  // }

  return (
    <>
      <section>
        <p>
          username: <span>{user?.username}</span>
        </p>
        <p>
          email: <span>{user?.email}</span>
        </p>
        <p>
          <Link href="/profile/mfa" className={styles.link}>
            Kétlépcsős Hitelesítés
          </Link>
        </p>
        <input
          type="button"
          value="Log Out"
          onClick={async () => {
            await LogoutAction();
            router.replace("/");
          }}
        />
      </section>
    </>
  );
}
