"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";

import GetUser from "@/actions/user/getUser";
import { User } from "@/lib/user/user";

export default function Page() {
  return (
    <>
      {isAuth && session === sessionData && userData && (
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
            Level {userData.level} - {userData.race}
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
    </>
  );
}
