import { createContext, Dispatch, SetStateAction } from "react";
import { AuthType } from "./auth";

export const AuthContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>]
>([false, () => false]);
