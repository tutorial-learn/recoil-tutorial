import { useEffect, useState } from "react";
import {
  selector,
  selectorFamily,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";
import { responseStatus, todoListState } from "./atoms";
import { v4 as uuidV4 } from "uuid";

export const timer = async (value, ms) => {
  return new Promise((r, j) => {
    setTimeout(() => {
      if (value === "") {
        j("omg empty... sorry man");
      }
      r(value);
    }, ms);
  });
};

export const todoListLength = selector({
  key: "todoListSelector",
  get: ({ get }) => {
    const currentTodoList = get(todoListState);
    return { listLength: currentTodoList.length };
  },
});

export const todoFinish = selector({
  key: "todoActions/finish",
  set: ({ get, set }, id) => {
    const currentTasks = get(todoListState);
    const updateTasks = currentTasks.map((task) => {
      if (task.id === id) {
        return { ...task, isFinish: !task.isFinish };
      } else {
        return task;
      }
    });

    set(todoListState, updateTasks);
  },
});

const async = selectorFamily({
  key: "async",
  get: (isShot) => () => {
    if (!isShot) return;
    return new Promise((r, j) => {
      setTimeout(() => {
        r(Math.random() * 10);
      }, 3000);
    });
  },
});

export const useLikeThunk = () => {
  const [isShot, setIsShot] = useState(0);
  const result = useRecoilValueLoadable(async(isShot));
  const setStatus = useSetRecoilState(responseStatus);
  const setTodoList = useSetRecoilState(todoListState);

  const trigger = () => {
    setIsShot((prev) => prev + 1);
  };

  useEffect(() => {
    // 최초 셀렉터 호출 건너뛰기.
    if (!result?.contents) return;
    switch (result?.state) {
      case "loading":
        setStatus("pending");
        break;
      case "hasValue":
        setStatus("success");
        setTodoList((prev) => [
          ...prev,
          { id: uuidV4(), task: result.contents, isFinish: false },
        ]);
        break;
      case "hasError":
        setStatus("error");
        break;
      default:
        break;
    }
  }, [result?.state, result?.contents, setStatus, setTodoList]);
  return { trigger };
};
