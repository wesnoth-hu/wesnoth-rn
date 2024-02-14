"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import useAuthStore from "@/lib/zustand/authState";
import { User } from "@/lib/login/user";

export default function Account({
  cookie,
  user,
}: {
  cookie: boolean;
  user: User | null;
}) {
  const { isAuthenticated, userID, sessionData } = useAuthStore();

  const [userData, setuserData] = useState<User>({
    id: "",
    username: "",
    email: "",
    emailVerified: false,
    password: "",
    race: "",
    money: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  useEffect(() => {
    if (cookie) {
      setuserData(user as User);
    }
  }, [cookie, user]);

  return (
    <>
      {isAuthenticated && userData && (
        <>
          <div>Felhasználó ID: {userData.id}</div>
          <div>{userData.email}</div>
          <div>
            <Image
              src={`/race/${userData?.race}.png`}
              alt={`${userData?.race}-icon`}
              width={72}
              height={72}
            />
          </div>
          <div>Felhasználónév: {userData.username}</div>
          <div>
            Email ellenőrizve: {userData.emailVerified ? "Igen" : "Nem"}
          </div>
          <div>
            Regisztráció sátuma:{" "}
            {userData.createdAt.toLocaleDateString("hu-HU", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </>
      )}
    </>
  );
}
