import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import axios from "axios";
import { useCookies } from "react-cookie";
import { url } from "../const";
import { useHistory, useParams } from "react-router-dom";
import "./editTask.scss";

export const EditTask = () => {
  const history = useHistory();
  const { listId, taskId } = useParams();
  const [cookies] = useCookies();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [isDone, setIsDone] = useState();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("00:00");
  const [remainingTime, setRemainingTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleIsDoneChange = (e) => setIsDone(e.target.value === "done");
  const handleDateChange = (e) => setDate(e.target.value);
  const handleTimeChange = (e) => setTime(e.target.value);
  const onUpdateTask = () => {
    console.log(isDone);
    let limit = null;

    if (date && time) {
      const dateTime = new Date(`${date}T${time}`);
      limit = dateTime.toISOString();
    }

    const data = {
      title: title,
      detail: detail,
      done: isDone,
      limit: limit,
    };

    axios
      .put(`${url}/lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        history.push("/");
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`);
      });
  };

  const onDeleteTask = () => {
    axios
      .delete(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        history.push("/");
      })
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`);
      });
  };

  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const task = res.data;
        setTitle(task.title);
        setDetail(task.detail);
        setIsDone(task.done);
        if (task.limit) {
          const jstDate = new Date(task.limit);
          const year = jstDate.getFullYear();
          const month = String(jstDate.getMonth() + 1).padStart(2, "0");
          const day = String(jstDate.getDate()).padStart(2, "0");
          const formattedDate = `${year}-${month}-${day}`;
          const hours = String(jstDate.getHours()).padStart(2, "0");
          const minutes = String(jstDate.getMinutes()).padStart(2, "0");
          const formattedTime = `${hours}:${minutes}`;
          const today = new Date();
          const targetDate = new Date(`${formattedDate} ${formattedTime}`);
          let remainingMs = targetDate - today;
          const restDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
          remainingMs = remainingMs % (1000 * 60 * 60 * 24);
          const restHours = Math.floor(remainingMs / (1000 * 60 * 60));
          remainingMs = remainingMs % (1000 * 60 * 60);
          const restMinutes = Math.floor(remainingMs / (1000 * 60));
          setDate(formattedDate);
          let remaining = "";
          if (restDays > 0) remaining += `${restDays}日 `;
          if (restHours > 0) remaining += `${restHours}時間 `;
          if (restMinutes > 0) remaining += `${restMinutes}分`;
          if (!remaining) {
            remaining = "タスクの期限が切れています！";
          } else {
            remaining = `タスクの期限まであと${remaining}です`;
          }

          setRemainingTime(remaining);
          setTime(formattedTime);
        } else {
          setDate("");
          setTime("");
        }
      })
      .catch((err) => {
        setErrorMessage(`タスク情報の取得に失敗しました。${err}`);
      });
  }, []);

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <label>タイトル</label>
          <br />
          <input
            type="text"
            onChange={handleTitleChange}
            className="edit-task-title"
            value={title}
          />
          <br />
          <label>詳細</label>
          <br />
          <textarea
            type="text"
            onChange={handleDetailChange}
            className="edit-task-detail"
            value={detail}
          />
          <br />
          <label>期限日時</label>
          <br />
          <input type="date" value={date} onChange={handleDateChange} />
          <input type="time" value={time} onChange={handleTimeChange} />
          <p className="limit-p">{remainingTime}</p>
          <br />
          <div>
            <input
              type="radio"
              id="todo"
              name="status"
              value="todo"
              onChange={handleIsDoneChange}
              checked={isDone === false ? "checked" : ""}
            />
            未完了
            <input
              type="radio"
              id="done"
              name="status"
              value="done"
              onChange={handleIsDoneChange}
              checked={isDone === true ? "checked" : ""}
            />
            完了
          </div>
          <button
            type="button"
            className="delete-task-button"
            onClick={onDeleteTask}
          >
            削除
          </button>
          <button
            type="button"
            className="edit-task-button"
            onClick={onUpdateTask}
          >
            更新
          </button>
        </form>
      </main>
    </div>
  );
};
