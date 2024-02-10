import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  userID: string;
  sessionData: string;

  login: (
    isAuthenticated: boolean,
    userID: string,
    sessionData: string
  ) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  userID: "",
  sessionData: "",

  login: (isAuthenticated: boolean, userID: string, sessionData: string) =>
    set(() => ({
      isAuthenticated: isAuthenticated,
      userID: userID,
      sessionData: sessionData,
    })),

  logout: () =>
    set(() => ({ isAuthenticated: false, userID: "", sessionData: "" })),
}));

export default useAuthStore;
