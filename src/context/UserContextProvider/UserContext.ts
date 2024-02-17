import { Dispatch, SetStateAction, createContext } from "react";

export const UserContext = createContext<
  [string, Dispatch<SetStateAction<string>>]
>(["", () => ""]);
