import { create } from "zustand";
import MFASetupCheck from "@/actions/mfa/mfaSetupCheck";

type CheckStore = {
  check: boolean;
  needCheck: boolean;
  fetchMFAComplete: () => Promise<void>;
  setNeedCheck: (value: boolean) => void;
};

export const useCheckStore = create<CheckStore>((set) => ({
  check: false,
  needCheck: false,
  fetchMFAComplete: async () => {
    const check = await MFASetupCheck();
    console.log("mFASetupCheck", check);
    set({ check: check, needCheck: false });
  },
  setNeedCheck: (value: boolean) => set({ needCheck: value }),
}));
