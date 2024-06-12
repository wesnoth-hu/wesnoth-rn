"use client";
import React, { Dispatch, SetStateAction } from "react";
import Icon from "@mdi/react";
import { mdiRotate3dVariant } from "@mdi/js";
import styles from "@/styles/Login.module.css";
import { ValidationError } from "@/lib/zod/ZodError";
import { loginZodSchema } from "@/lib/login/loginZodSchema";

export default function ChooseButton({
  choose,
  setChoose,
  setErrors,
  resetForm,
  resetCustomError,
}: {
  choose: boolean;
  setChoose: Dispatch<SetStateAction<boolean>>;
  setErrors: Dispatch<SetStateAction<ValidationError<typeof loginZodSchema>>>;
  resetForm: () => void;
  resetCustomError: () => void;
}) {
  return (
    <div className={styles.chooseButton}>
      <div
        onClick={() => {
          setChoose(!choose), setErrors({}), resetForm(), resetCustomError();
        }}
      >
        <Icon
          path={mdiRotate3dVariant}
          size={0.8}
          className={choose ? styles.rotateOrigin : styles.rotate75}
        />
      </div>
    </div>
  );
}
