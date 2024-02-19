"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import FindUser from "@/components/Account/findUser";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthContext } from "@/context/AuthContextProvider/AuthContext";
import { User } from "@/lib/login/user";

export default function Account() {
  const [isAuth, setIsAuth] = useContext(AuthContext);

  const [userData, setUserData] = useState<User>({
    id: "",
    username: "",
    email: "",
    emailVerified: false,
    password: "",
    race: "bat",
    money: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // TODO replace this with React Query to avoid staleness
  // TODO enable caching
  useEffect(() => {
    async function fetchUser() {
      const user = await FindUser();
      setUserData(user as User);
    }
    fetchUser();
  }, []);

  return (
    <>
      {isAuth && userData && (
        <>
          <div>Felhasználó ID: {userData.id}</div>
          <div>{userData.email}</div>
          <div>
            <Image
              src={`/race/${userData.race}.png`}
              alt={`${userData.race}-icon`}
              width={72}
              height={72}
              priority
            />
          </div>
          <div>Felhasználónév: {userData.username}</div>
          <div>
            Email ellenőrizve: {userData.emailVerified ? "Igen" : "Nem"}
          </div>
          <div>
            Regisztráció dátuma:{" "}
            {userData.createdAt.toLocaleDateString("hu-HU", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </>
      )}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
