"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";

import GetUser from "@/actions/getUser";
import { User } from "@/lib/user";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AuthContext } from "@/context/AuthContextProvider/AuthContext";
import { SessionContext } from "@/context/SessionContextProvider/SessionContext";

export default function Page() {
  const [isAuth] = useContext(AuthContext);
  const [session] = useContext(SessionContext);

  const [userData, setUserData] = useState<User>({
    id: "",
    username: "",
    email: "",
    emailVerified: false,
    password: "",
    race: "bat",
    level: 0,
    money: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // TODO replace this with React Query to avoid staleness
  // TODO enable caching
  useEffect(() => {
    async function fetchUser() {
      const user = await GetUser();
      setUserData(user as User);
    }
    if (session !== "") {
      fetchUser();
    }
  }, [session]);

  return (
    <>
      {isAuth && session && userData && (
        <>
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
            {userData.race} - Level {userData.level}
          </div>
          <div>Arany: {userData.money}</div>
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
