"use client";

import { userLoginUserDB } from "@/components/userLogin/userLoginDB";

import type { loginUserType } from "@/lib/login/loginUserType";
import { loginZodSchema } from "@/lib/login/loginZodSchema";
import { ValidationError } from "@/lib/zod/ZodError";
import { handleZodValidation } from "@/lib/zod/ZodError";

import React, { Dispatch, ChangeEvent, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "@/styles/Login.module.css";

import ChooseButton from "./chooseButton";
import AccountLockCheck from "@/actions/signin/accountLockCheck";
import TOTPCheck from "@/actions/signin/totpCheck";
import { SessionExpiryStart } from "@/actions/signoff/sessionExpiredCron";
import TOTP from "./totp";
import Reset from "./reset";
import AccountLock from "./accountLock";

export default function LoginUser({
  choose,
  setChoose,
}: {
  choose: boolean;
  setChoose: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [renderTOTP, setRenderTOTP] = useState<boolean>(false);
  const [resendRender, setResendRender] = useState<boolean>(false);
  const [loadReset, setLoadReset] = useState<boolean>(false);
  const [loginAttempt, setLoginAttempt] = useState<number>(0);

  const [loginUserData, setLoginUserData] = useState<loginUserType>({
    username: "",
    password: "",
    confirm: "",
  });

  const handleUserInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const [invalidLogin, setInvalidLogin] = useState<string>("");

  const resetError = () => {
    setInvalidLogin("");
  };

  const onClickUserLogin = async (logindata: loginUserType) => {
    const loginSuccess = await userLoginUserDB(logindata);
    const accountLockCheck = await AccountLockCheck({
      username: logindata.username,
    });
    const totpCheck = await TOTPCheck();

    if (loginSuccess?.success === false) {
      setInvalidLogin(loginSuccess?.error as string);
      if (accountLockCheck === false) {
        setLoginAttempt(loginAttempt + 1);
      }
    } else {
      resetUserForm();
      await SessionExpiryStart();
      if (totpCheck) {
        setRenderTOTP(true);
      } else {
        router.replace("/profile");
      }
    }
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
      {loadReset ? (
        <Reset />
      ) : loginAttempt === 3 ? (
        <AccountLock username={loginUserData.username} />
      ) : resendRender ? (
        <>{router.replace("./signup/verify/resend")}</>
      ) : !renderTOTP ? (
        <>
          <main className={styles.main}>
            <section className={styles.form}>
              <div className={styles.labels}>
                <label htmlFor="username">Felhasználónév:</label>
                <label htmlFor="password">Jelszó:</label>
                <label htmlFor="confirm">Jelszó ismét:</label>
              </div>
              <div className={styles.inputs}>
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
              </div>
              <section className={styles.wheel}>
                <ChooseButton
                  choose={choose}
                  setChoose={setChoose}
                  setErrors={setErrors}
                  resetForm={resetUserForm}
                  resetCustomError={resetError}
                />
              </section>
            </section>
            <div
              onClick={() => setLoadReset(true)}
              style={{
                border: "1px solid black",
                borderRadius: "5px",
                padding: "3px",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              Jelszócsere
            </div>
            <div
              style={{
                border: "1px solid black",
                borderRadius: "5px",
                padding: "3px",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
              onClick={() => {
                setResendRender(true);
              }}
            >
              Email Ellenőrzés
            </div>
            <div className={styles.error}>
              {errors && errors.username ? (
                <div style={{ color: "red" }}>
                  Felhasználónév - {errors.username}
                </div>
              ) : null}

              {errors && errors.password ? (
                <div style={{ color: "red" }}>Jelszó - {errors.password}</div>
              ) : null}

              {errors && errors.confirm ? (
                <div style={{ color: "red" }}>
                  Jelszó ismét - {errors.confirm}
                </div>
              ) : null}

              {invalidLogin !== "" ? (
                <div style={{ color: "red" }}>{invalidLogin}</div>
              ) : null}
            </div>
          </main>
        </>
      ) : (
        <>
          <TOTP />
        </>
      )}
    </>
  );
}
