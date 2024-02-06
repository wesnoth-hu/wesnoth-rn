import { create } from "zustand";

type AuthState = {
    isAuthenticated: boolean,
    userID: string,
    sessionData: string,

    login: () => void,
    logout: () => void
}

const useAuthStore = create<AuthState>()((set) => ({
    isAuthenticated: false,
    userID: "",
    sessionData: "",
  
    login: (userID: string, sessionData:string) =>
      set((state) => ({ isAuthenticated: !state.isAuthenticated, userID: userID , sessionData: sessionData })),
  
    logout: () =>
      set((state) => ({ isAuthenticated: state.isAuthenticated, userID: state.userID, sessionData: state.sessionData })),
}));

export default useAuthStore;