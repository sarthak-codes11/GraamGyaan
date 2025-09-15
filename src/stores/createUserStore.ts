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

export const createUserSlice: BoundStateCreator<UserSlice> = (set) => ({
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
  logIn: () => set(() => ({ loggedIn: true })),
  logOut: () => set(() => ({ loggedIn: false })),
});
