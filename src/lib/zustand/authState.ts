import { create } from "zustand";

type AuthState = {
    isAuthenticated: boolean,
    userID: string,
    sessionData: string
}

const useAuthStore = create<AuthState>()((set) => ({
    isAuthenticated: false,
    userID: "",
    sessionData: "",
  
    login: (userID:string, sessionData:string) =>
      set(() => ({ isAuthenticated: true, userID: userID, sessionData: sessionData })),
  
    logout: () =>
      set(() => ({ isAuthenticated: false, userID: "", sessionData: "" })),
}));

export default useAuthStore;