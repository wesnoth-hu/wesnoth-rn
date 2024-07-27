/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";

import styles from "@/styles/Login.module.css";

import LoginEmail from "./loginEmail";
import LoginUser from "./loginUser";

export default function Page() {
  const [choose, setChoose] = useState<boolean>(false);

  return (
    <>
      <div className={styles.choose}>
        {choose ? (
          <LoginUser choose={choose} setChoose={setChoose} />
        ) : (
          <LoginEmail choose={choose} setChoose={setChoose} />
        )}
      </div>
    </>
  );
}
