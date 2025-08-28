import { atom } from "jotai";

export const authAtom = atom({
  user: null,   // { name, role }
  token: null,  // JWT token
});
