import { useState } from "react";
import {
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
  useRecoilState,
} from "recoil";
import { v4 as uuidV4 } from "uuid";

import { responseStatus, todoListState } from "./recoil/atoms";
import { todoListLength, useLikeThunk } from "./recoil/selectors";
import { todoFinish } from "./recoil/selectors";

function App() {
  const resetState = useResetRecoilState(todoListState);
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const status = useRecoilValue(responseStatus);
  const { listLength } = useRecoilValue(todoListLength);

  // like Thunk
  const { trigger } = useLikeThunk();

  const [text, setText] = useState("");

  // selector 안써도 되긴하지만, 연습삼아 이렇게 만들어봄.
  const finish = useSetRecoilState(todoFinish);

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text) return;
    setTodoList((prev) => [
      ...prev,
      { id: uuidV4(), task: text, isFinish: false },
    ]);
    setText("");
  };

  const onDelete = (id) => {
    setTodoList((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="typeing todo task"
          value={text}
          onChange={onChange}
        />
      </form>
      <div>task length : {listLength}</div>
      {listLength > 0 &&
        todoList.map(({ id, task, isFinish }) => (
          <div key={id}>
            <span
              style={{
                textDecorationLine: isFinish ? "line-through" : "unset",
              }}
            >
              {task}
            </span>
            <button onClick={() => finish(id)}>{isFinish ? "❌" : "✅"}</button>
            <button onClick={() => onDelete(id)}>🗑</button>
          </div>
        ))}
      <button onClick={resetState}>Reset</button>
      <button onClick={trigger}>Add random number</button>

      <div style={{ fontSize: 25 }}>{status}</div>
    </div>
  );
}

export default App;
