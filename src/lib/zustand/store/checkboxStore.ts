import { create } from "zustand";
import GetUser from "@/actions/user/getUser";
import { User } from "@/lib/user/user";

type CheckBoxStore = {
  checkbox: boolean;
  toggleCheckBox: (value: boolean) => void;
  mfaEnabled: () => void;
};

export const useCheckBoxStore = create<CheckBoxStore>((set) => ({
  checkbox: false,
  toggleCheckBox: (value: boolean) => set({ checkbox: value }),
  mfaEnabled: async () => {
    const user: User = await GetUser();
    set({ checkbox: user?.mfaEnabled });
  },
}));
