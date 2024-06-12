"use client";

import { userLoginEmailDB } from "@/components/userLogin/userLoginDB";

import type { loginEmailType } from "@/lib/login/loginEmailType";
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

export default function LoginEmail({
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

  const [loginEmailData, setLoginEmailData] = useState<loginEmailType>({
    email: "",
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

  const resetEmailForm = () => {
    setLoginEmailData({
      email: "",
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

  const onClickEmailLogin = async (logindata: loginEmailType) => {
    const loginSuccess = await userLoginEmailDB(logindata);
    const accountLockCheck = await AccountLockCheck({
      email: logindata.email,
    });
    const totpCheck = await TOTPCheck();

    if (loginSuccess?.success === false) {
      setInvalidLogin(loginSuccess?.error as string);
      if (accountLockCheck === false) {
        setLoginAttempt(loginAttempt + 1);
      }
      return;
    } else {
      resetEmailForm();
      await SessionExpiryStart();
      if (totpCheck) {
        setRenderTOTP(true);
      } else {
        router.replace("/profile");
      }
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

  return (
    <>
      {loadReset ? (
        <Reset />
      ) : loginAttempt === 3 ? (
        <AccountLock username={loginEmailData.email} />
      ) : resendRender ? (
        <>{router.replace("./signup/verify/resend")}</>
      ) : !renderTOTP ? (
        <main className={styles.main}>
          <div className={styles.form}>
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
            </div>
            <section className={styles.wheel}>
              {/* Choose between username or email for login */}
              <ChooseButton
                choose={choose}
                setChoose={setChoose}
                setErrors={setErrors}
                resetForm={resetEmailForm}
                resetCustomError={resetError}
              />
            </section>
          </div>
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
            {errors && errors.email ? (
              <div style={{ color: "red" }}>Email - {errors.email}</div>
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
      ) : (
        <>
          <TOTP />
        </>
      )}
    </>
  );
}
