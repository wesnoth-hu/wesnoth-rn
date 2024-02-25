/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { userLoginEmailDB } from "@/components/userLogin/userLoginDB";
import { userLoginUserDB } from "@/components/userLogin/userLoginDB";
import GetUserID from "@/lib/login/getuserID";

import type { loginEmailType } from "@/lib/login/loginEmailType";
import type { loginUserType } from "@/lib/login/loginUserType";
import { loginZodSchema } from "@/lib/login/loginZodSchema";
import { ValidationError } from "@/lib/ZodError";
import { handleZodValidation } from "@/lib/ZodError";

import React, { ChangeEvent, useContext, useState } from "react";
import { useRouter } from "next/navigation";

import { useWarrant } from "@warrantdev/react-warrant-js";
import { WarrantClient } from "@warrantdev/warrant-node";

import styles from "@/styles/Login.module.css";
import { AuthContext } from "@/context/AuthContextProvider/AuthContext";
import { SessionContext } from "@/context/SessionContextProvider/SessionContext";
import GetSessionCookie from "@/components/Server/getSessionCookie";

import ChooseButton from "./chooseButton";

export default function SignIn() {
  const [isAuth, setIsAuth] = useContext(AuthContext);
  const [session, setSession] = useContext(SessionContext);
  const [choose, setChoose] = useState<boolean>(false);

  const router = useRouter();

  const { setSessionToken } = useWarrant();

  const [loginEmailData, setLoginEmailData] = useState<loginEmailType>({
    email: "",
    password: "",
    confirm: "",
  });

  const [loginUserData, setLoginUserData] = useState<loginUserType>({
    username: "",
    password: "",
    confirm: "",
  });

  const handleEmailInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginEmailData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUserInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetEmailForm = () => {
    setLoginEmailData({
      email: "",
      password: "",
      confirm: "",
    });
  };

  const resetUserForm = () => {
    setLoginUserData({
      username: "",
      password: "",
      confirm: "",
    });
  };

  const [errors, setErrors] = useState<ValidationError<typeof loginZodSchema>>(
    {}
  );

  const [invalidPass, setInvalidPass] = useState<string>("");

  const resetError = () => {
    setInvalidPass("");
  };

  const onClickEmailLogin = async (logindata: loginEmailType) => {
    const loginSuccess = await userLoginEmailDB(logindata);

    if (loginSuccess?.success === false) {
      resetEmailForm();
      setInvalidPass(loginSuccess?.error as string);
      return;
    } else {
      const userID = await GetUserID();
      const sessionCookie = await GetSessionCookie();
      setIsAuth(true);
      setSession(sessionCookie as string);
      setSessionToken(sessionCookie as string);
      resetEmailForm();
      router.push(`/account/${userID}`);
    }
  };

  const onClickUserLogin = async (logindata: loginUserType) => {
    const loginSuccess = await userLoginUserDB(logindata);

    if (loginSuccess?.success === false) {
      resetUserForm();
      setInvalidPass(loginSuccess?.error as string);
      return;
    } else {
      const userID = await GetUserID();
      const sessionCookie = await GetSessionCookie();
      setIsAuth(true);
      setSession(sessionCookie as string);
      setSessionToken(sessionCookie as string);
      resetUserForm();
      router.push(`/account/${userID}`);
    }
  };

  const schemaParseEmail = (data: loginEmailType) => {
    handleZodValidation({
      onError: setErrors,
      data: data,
      onSuccess: async () => {
        setErrors({});
        await onClickEmailLogin(data);
        resetEmailForm();
      },
      schema: loginZodSchema,
    });
  };

  const schemaParseUser = (data: loginUserType) => {
    handleZodValidation({
      onError: setErrors,
      data: data,
      onSuccess: async () => {
        setErrors({});
        await onClickUserLogin(data);
        resetUserForm();
      },
      schema: loginZodSchema,
    });
  };

  return (
    <>
      <main className={styles.main}>
        <div className={styles.form}>
          {/* Labels */}
          <div className={styles.labels}>
            {choose ? (
              <label htmlFor="username">Felhasználónév:</label>
            ) : (
              <label htmlFor="email">Email:</label>
            )}
            <label htmlFor="password">Jelszó:</label>
            <label htmlFor="confirm">Jelszó ismét:</label>
          </div>

          {/* Inputs */}
          <div className={styles.inputs}>
            {choose ? (
              <>
                <input
                  type="username"
                  id="username"
                  name="username"
                  value={loginUserData.username}
                  onChange={(e) => handleUserInputChange(e)}
                  autoComplete="on"
                  placeholder="gipszjakab"
                />

                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginUserData.password}
                  onChange={(e) => handleUserInputChange(e)}
                  autoComplete="on"
                  placeholder="********"
                />

                <input
                  type="password"
                  id="confirm"
                  name="confirm"
                  value={loginUserData.confirm}
                  onChange={(e) => handleUserInputChange(e)}
                  autoComplete="on"
                  placeholder="********"
                />
                <button
                  type="submit"
                  id={styles.register}
                  onClick={() => {
                    schemaParseUser(loginUserData);
                  }}
                >
                  Bejelentkezek
                </button>
              </>
            ) : (
              <>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginEmailData.email}
                  onChange={(e) => handleEmailInputChange(e)}
                  autoComplete="on"
                  placeholder="gipszjakab@gmail.com"
                />

                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginEmailData.password}
                  onChange={(e) => handleEmailInputChange(e)}
                  autoComplete="on"
                  placeholder="********"
                />

                <input
                  type="password"
                  id="confirm"
                  name="confirm"
                  value={loginEmailData.confirm}
                  onChange={(e) => handleEmailInputChange(e)}
                  autoComplete="on"
                  placeholder="********"
                />
                <button
                  type="submit"
                  id={styles.register}
                  onClick={() => {
                    schemaParseEmail(loginEmailData);
                  }}
                >
                  Bejelentkezek
                </button>
              </>
            )}
          </div>

          {/* Choose between username or email for login */}
          <ChooseButton
            choose={choose}
            setChoose={setChoose}
            setErrors={setErrors}
            resetForm={choose ? resetUserForm : resetEmailForm}
            resetError={resetError}
          />
        </div>
        <div className={styles.error}>
          {errors && errors.username ? (
            <div style={{ color: "red" }}>
              Felhasználónév - {errors.username}
            </div>
          ) : null}
          {errors && errors.email ? (
            <div style={{ color: "red" }}>Email - {errors.email}</div>
          ) : null}

          {errors && errors.password ? (
            <div style={{ color: "red" }}>Jelszó - {errors.password}</div>
          ) : null}

          {errors && errors.confirm ? (
            <div style={{ color: "red" }}>Jelszó ismét - {errors.confirm}</div>
          ) : null}

          {invalidPass !== "" ? (
            <div style={{ color: "red" }}>{invalidPass}</div>
          ) : null}
        </div>
      </main>
    </>
  );
}
