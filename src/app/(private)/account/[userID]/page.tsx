"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import FindUser from "@/components/Account/findUser";
import SessionData from "@/components/Server/sessionData";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthContext } from "@/context/AuthContextProvider/AuthContext";
import { SessionContext } from "@/context/SessionContextProvider/SessionContext";
import { User } from "@/lib/login/user";

export default function Account() {
  const [isAuth] = useContext(AuthContext);
  const [session] = useContext(SessionContext);

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

  const [unseal, setUnseal] = useState<{
    userID: string;
    email: string;
    userIP: string;
    randomNano: string;
  }>({
    userID: "",
    email: "",
    userIP: "",
    randomNano: "",
  });

  useEffect(() => {
    async function fetchData() {
      const unsealed = await SessionData();

      setUnseal((prevSeal) => ({
        ...prevSeal,
        userID: unsealed.userID,
        email: unsealed.email,
        userIP: unsealed.userIP,
        randomNano: unsealed.randomNano,
      }));
    }
    if (isAuth === true && session !== "") {
      fetchData();
    }
  }, [isAuth, session]);

  // TODO replace this with React Query to avoid staleness
  // TODO enable caching
  useEffect(() => {
    async function fetchUser() {
      const user = await FindUser(unseal.userID as string);
      setUserData(user as User);
    }
    if (session !== "") {
      fetchUser();
    }
  }, [session, unseal]);

  useEffect(() => {
    if (isAuth === false) {
      setUnseal({
        userID: "",
        email: "",
        userIP: "",
        randomNano: "",
      });
    }
  }, [isAuth, setUnseal]);

  return (
    <>
      {isAuth && session && userData && (
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
