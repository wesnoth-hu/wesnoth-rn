"use client";

import { publicIpv4 } from "public-ip";

import userLoginDB from "@/components/userLogin/userLoginDB";
import GetUserID from "@/lib/login/getuserID";

import type { loginType } from "@/lib/login/loginType";
import { loginZodSchema } from "@/lib/login/loginZodSchema";
import { ValidationError } from "@/lib/ZodError";
import { handleZodValidation } from "@/lib/ZodError";

import React, { ChangeEvent, useContext, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "@/styles/Login.module.css";
import { AuthContext } from "@/context/AuthContextProvider/AuthContext";
import { SessionContext } from "@/context/SessionContextProvider/SessionContext";
import GetSessionCookie from "@/components/Server/getSessionCookie";

export default function SignIn() {
  const [isAuth, setIsAuth] = useContext(AuthContext);
  const [session, setSession] = useContext(SessionContext);

  const router = useRouter();

  const [loginData, setLoginData] = useState<loginType>({
    email: "",
    password: "",
    confirm: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setLoginData({
      email: "",
      password: "",
      confirm: "",
    });
  };

  const resetPass = () => {
    setLoginData({
      email: loginData.email,
      password: "",
      confirm: "",
    });
  };

  const [errors, setErrors] = useState<ValidationError<typeof loginZodSchema>>(
    {}
  );

  const [invalidPass, setInvalidPass] = useState<string>("");

  const onClickLogin = async (logindata: loginType) => {
    const loginSuccess = await userLoginDB(logindata);
    const sessionCookie = await GetSessionCookie();

    if (loginSuccess === false) {
      resetPass();
      setInvalidPass("Sikertelen bejelentkezés. Próbáld meg újra!");
      return;
    } else {
      const userID = await GetUserID();
      setIsAuth(true);
      setSession(sessionCookie as string);
      resetForm();
      router.push(`/account/${userID}`);
    }
  };

  const schemaParse = (data: loginType) => {
    handleZodValidation({
      onError: setErrors,
      data: data,
      onSuccess: async () => {
        setErrors({});
        onClickLogin(data);
        resetForm();
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
            <label htmlFor="email">Email:</label>
            <label htmlFor="password">Jelszó:</label>
            <label htmlFor="confirm">Jelszó ismét:</label>
          </div>

          {/* Inputs */}
          <div className={styles.inputs}>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={(e) => handleInputChange(e)}
              autoComplete="on"
              placeholder="gipszjakab@gmail.com"
            />

            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={(e) => handleInputChange(e)}
              autoComplete="on"
              placeholder="********"
            />

            <input
              type="password"
              id="confirm"
              name="confirm"
              value={loginData.confirm}
              onChange={(e) => handleInputChange(e)}
              autoComplete="on"
              placeholder="********"
            />
            <button
              type="submit"
              id={styles.register}
              onClick={() => {
                schemaParse(loginData);
              }}
            >
              Bejelentkezek
            </button>
          </div>
        </div>
        <div className={styles.error}>
          {errors && errors.email && (
            <div style={{ color: "red" }}>Email - {errors.email}</div>
          )}

          {errors && errors.password && (
            <div style={{ color: "red" }}>Jelszó - {errors.password}</div>
          )}

          {errors && errors.confirm && (
            <div style={{ color: "red" }}>Jelszó ismét - {errors.confirm}</div>
          )}
          {invalidPass !== "" && (
            <div style={{ color: "red" }}>{invalidPass}</div>
          )}
        </div>
      </main>
    </>
  );
}
