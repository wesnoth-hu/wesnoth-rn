"use client";

import React from "react";

import { redirect } from "next/navigation";

import Disable from "./disable";
import { disableType } from "@/lib/mfa/disableType";

import Switch from "@/actions/mfa/switch";
import ValidPass from "@/actions/mfa/disable/validPass";
import RemoveSecret from "@/actions/mfa/disable/removeSecret";

import styles from "@/styles/mfa.module.css";
import clsx from "clsx";
import { useCheckStore } from "@/lib/zustand/store/checkStore";
import { useCheckBoxStore } from "@/lib/zustand/store/checkboxStore";
import { useUserStore } from "@/lib/zustand/store/userStore";
import { User } from "@/lib/user/user";

export default function MFAClient({ user }: { user: User }) {
  const [disable, setDisable] = React.useState<boolean>(false);
  const { checkbox, mfaEnabled, toggleCheckBox } = useCheckBoxStore();
  const { check, fetchMFAComplete, setNeedCheck } = useCheckStore();
  const { setNeedRefetch } = useUserStore();

  React.useEffect(() => {
    mfaEnabled();
  }, [mfaEnabled]);

  React.useEffect(() => {
    fetchMFAComplete();
  }, [fetchMFAComplete]);

  const mfaToggle = async (id: string, setting: boolean) => {
    await Switch(id, setting);
  };

  React.useEffect(() => {
    async function ToggleDB() {
      if (checkbox === true) {
        await mfaToggle(user?.id as string, true);
        setDisable(false);
        setNeedCheck(true);
        setNeedRefetch(true);
      } else if (checkbox === false) {
        await mfaToggle(user?.id as string, false);
        setDisable(true);
        setNeedCheck(true);
        setNeedRefetch(true);
      }
    }
    ToggleDB();
  }, [user, checkbox, setNeedCheck, setNeedRefetch]);

  React.useEffect(() => {
    if (checkbox === true && check === false) {
      redirect(`/profile/mfa?email=${user?.email}`);
    }
  }, [check, checkbox, user]);

  const [validPassError, setValidPassError] = React.useState<string>("");

  const handleDisableSubmit = async (passwordData: disableType) => {
    const validatePass = await ValidPass(passwordData);

    if (validatePass.success) {
      await mfaToggle(user?.id as string, false);
      toggleCheckBox(false);
      setDisable(false);
      await RemoveSecret();
    } else {
      toggleCheckBox(true);
      setDisable(true);
      setValidPassError(validatePass.error as string);
    }
  };

  if (disable === true && check === true) {
    return (
      <Disable
        setMFACheckBox={toggleCheckBox}
        setDisable={setDisable}
        handleDisableSubmit={handleDisableSubmit}
        validPassError={validPassError}
        setValidPassError={setValidPassError}
      />
    );
  }

  return (
    <section>
      Multi-Factor Authentication:{" "}
      {checkbox === false && <span className={styles.disabled}>Disabled </span>}
      {checkbox === true && <span className={styles.enabled}>Enabled </span>}
      <label className={styles.switch}>
        <input
          id="switch"
          type="checkbox"
          checked={checkbox}
          onChange={(e) => {
            toggleCheckBox(e.target.checked);
          }}
        ></input>
        <span className={clsx([styles.slider, styles.round])}></span>
      </label>
    </section>
  );
}
