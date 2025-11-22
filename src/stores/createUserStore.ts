import dayjs from "dayjs";
import type { BoundStateCreator } from "~/hooks/useBoundStore";

export type UserSlice = {
  name: string;
  username: string;
  email: string;
  standard: string;
  joinedAt: dayjs.Dayjs;
  loggedIn: boolean;
  setName: (name: string) => void;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setStandard: (standard: string) => void;
  logIn: () => void;
  logOut: () => void;
};

export const createUserSlice: BoundStateCreator<UserSlice> = (set, get) => ({
  name: "",
  username: "",
  email: "",
  standard: "",
  joinedAt: dayjs(),
  loggedIn: false,
  setName: (name: string) => set(() => ({ name })),
  setUsername: (username: string) => set(() => ({ username })),
  setEmail: (email: string) => set(() => ({ email })),
  setStandard: (standard: string) => set(() => ({ standard })),
  logIn: () => {
    set(() => ({ loggedIn: true }));
    // Mark today active for streaks if streak slice is present
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyGet = get as unknown as () => any;
      anyGet()?.addToday?.();
    } catch {
      // ignore if streak slice not available
    }
  },
  logOut: () => set(() => ({ loggedIn: false })),
});
