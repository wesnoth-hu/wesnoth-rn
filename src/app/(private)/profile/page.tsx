"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/zustand/store/userStore";
import LogoutAction from "@/actions/signoff/logoutAction";
import MFAClient from "./mfaClient";

export default function Page() {
  const router = useRouter();
  const { user, getUserData, needRefetch } = useUserStore();

  React.useEffect(() => {
    getUserData();
  }, [getUserData, needRefetch]);

  {
    user === null && <>{router.replace("/signin")}</>;
  }

  return (
    <>
      <section>
        <p>
          username: <span>{user?.username}</span>
        </p>
        <p>
          email: <span>{user?.email}</span>
        </p>
        <MFAClient user={user} />
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
