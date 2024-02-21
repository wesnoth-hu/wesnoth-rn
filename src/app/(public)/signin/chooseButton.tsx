import React, { Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/Login.module.css";
import { ValidationError } from "@/lib/ZodError";
import { loginZodSchema } from "@/lib/login/loginZodSchema";

export default function ChooseButton({
  choose,
  setChoose,
  setErrors,
  reset,
}: {
  choose: boolean;
  setChoose: Dispatch<SetStateAction<boolean>>;
  setErrors: Dispatch<SetStateAction<ValidationError<typeof loginZodSchema>>>;
  reset: () => void;
}) {
  return (
    <div className={styles.chooseButton}>
      <div
        onClick={() => {
          setChoose(!choose), setErrors({}), reset();
        }}
      >
        <FontAwesomeIcon
          icon={faRotate}
          size="xs"
          className={choose ? styles.rotateOrigin : styles.rotate75}
        />
      </div>
    </div>
  );
}
