import { create } from "zustand";
import GetUser from "@/actions/user/getUser";
import { User } from "@/lib/user/user";

type UserStore = {
  user: User | null;
  needRefetch: boolean;
  getUserData: () => Promise<void>;
  setNeedRefetch: (value: boolean) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  needRefetch: false,
  getUserData: async () => {
    const user: User = await GetUser();
    set({ user: user, needRefetch: false });
  },
  setNeedRefetch: (value: boolean) => set({ needRefetch: value }),
}));
