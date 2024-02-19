import { createContext, Dispatch, SetStateAction } from "react";

export const SessionContext = createContext<
  [
    { userID: string; email: string; userIP: string; randomNano: string },
    Dispatch<
      SetStateAction<{
        userID: string;
        email: string;
        userIP: string;
        randomNano: string;
      }>
    >
  ]
>([{ userID: "", email: "", userIP: "", randomNano: "" }, () => {}]);
