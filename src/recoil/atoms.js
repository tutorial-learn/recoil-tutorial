import { atom } from "recoil";
import { timer } from "./selectors";

export const todoListState = atom({
  key: "todoListState",
  default: [],
});

export const responseStatus = atom({
  key: "responseStatus",
  default: "success",
});

export const asyncState = atom({
  key: "asyncState",
  default: async () => await timer("123", 3000),
});
