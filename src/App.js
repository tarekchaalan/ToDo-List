import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [completedTasks, setCompletedTasks] = useState(
    JSON.parse(localStorage.getItem("completedTasks")) || []
  );
  const [deletedTasks, setDeletedTasks] = useState(
    JSON.parse(localStorage.getItem("deletedTasks")) || []
  );
  const [inputValue, setInputValue] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [currentTab, setCurrentTab] = useState("tasks");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
  }, [deletedTasks]);

  const getSortedTasks = () => {
    return [...tasks].sort((a, b) => a.deadline.localeCompare(b.deadline));
  };

  const addTask = () => {
    if (inputValue) {
      setTasks([
        ...tasks,
        {
          value: inputValue,
          editable: false,
          deadline: inputDate,
          id: Date.now(),
        },
      ]);
      setInputValue("");
      setInputDate("");
    }
  };

  const findTaskById = (id) => tasks.findIndex((task) => task.id === id);

  const completeTask = (id) => {
    const index = findTaskById(id);
    const taskToComplete = tasks[index];
    setCompletedTasks([...completedTasks, taskToComplete]);

    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const removeTask = (id) => {
    const index = findTaskById(id);
    const taskToDelete = tasks[index];
    setDeletedTasks([...deletedTasks, taskToDelete]);

    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const editTask = (id) => {
    const index = findTaskById(id);
    let copy = [...tasks];
    copy[index].editable = true;
    setTasks(copy);
  };

  const updateTaskDeadline = (id, newDeadline) => {
    const index = findTaskById(id);
    let copy = [...tasks];
    copy[index].deadline = newDeadline;
    setTasks(copy);
  };

  const updateTask = (e, id) => {
    const index = findTaskById(id);
    let copy = [...tasks];
    copy[index].value = e.target.value;
    setTasks(copy);
  };

  const saveTask = (id) => {
    const index = findTaskById(id);
    let copy = [...tasks];
    copy[index].editable = false;
    setTasks(copy);
  };

  const clearCompletedTasks = () => {
    setCompletedTasks([]);
  };

  const permanentlyRemoveAll = () => {
    setDeletedTasks([]);
  };

  const permanentlyRemove = (sortedIndex) => {
    let copy = [...deletedTasks];
    copy.splice(sortedIndex, 1);
    setDeletedTasks(copy);
  };

  const recoverTask = (sortedIndex) => {
    const taskToRecover = deletedTasks[sortedIndex];
    setTasks([...tasks, taskToRecover]);

    let copy = [...deletedTasks];
    copy.splice(sortedIndex, 1);
    setDeletedTasks(copy);
  };

  const getContentView = () => {
    switch (currentTab) {
      case "tasks":
        return (
          <>
            <li className="task-header">
              <div className="task-content">
                <span>Tasks</span>
                <div className="flex-grow">Due</div>
              </div>
            </li>
            {getSortedTasks().map((task) => (
              <li key={task.id} className="task-item">
                <div className="task-content">
                  <button
                    className="edit-btn"
                    onClick={() => editTask(task.id)}
                  >
                    Edit
                  </button>
                  {task.editable ? (
                    <>
                      <input
                        type="text"
                        className="task-text"
                        value={task.value}
                        onChange={(e) => updateTask(e, task.id)}
                      />
                      <input
                        type="date"
                        value={task.deadline}
                        onChange={(e) =>
                          updateTaskDeadline(task.id, e.target.value)
                        }
                      />
                    </>
                  ) : (
                    <>
                      <span>• {task.value}</span>
                      <div className="flex-grow">{task.deadline || "None"}</div>
                    </>
                  )}
                </div>
                <div className="task-buttons">
                  {task.editable ? (
                    <button onClick={() => saveTask(task.id)}>Save</button>
                  ) : (
                    <>
                      <button
                        className="complete-btn"
                        onClick={() => completeTask(task.id)}
                      >
                        Complete
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => removeTask(task.id)}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </>
        );
      case "completed":
        return (
          <>
            {completedTasks.length ? (
              <button className="remove-btn" onClick={clearCompletedTasks}>
                Clear Completed Tasks
              </button>
            ) : null}
            {completedTasks.map((task, sortedIndex) => (
              <li key={sortedIndex}>{task.value}</li>
            ))}
            {completedTasks.length ? (
              <button className="remove-btn" onClick={clearCompletedTasks}>
                Clear Completed Tasks
              </button>
            ) : null}
          </>
        );
      case "deleted":
        return (
          <>
            {deletedTasks.length > 0 && (
              <button className="remove-all-btn" onClick={permanentlyRemoveAll}>
                Permanently Remove All
              </button>
            )}
            {deletedTasks.map((task, sortedIndex) => (
              <li key={sortedIndex} className="task-item">
                <div className="task-content">
                  <span>• {task.value}</span>
                </div>
                <div className="task-buttons">
                  <button
                    className="remove-btn"
                    onClick={() => permanentlyRemove(sortedIndex)}
                  >
                    Delete
                  </button>
                  <button
                    className="recover-btn"
                    onClick={() => recoverTask(sortedIndex)}
                  >
                    Recover
                  </button>
                </div>
              </li>
            ))}
            {deletedTasks.length > 0 && (
              <button className="remove-all-btn" onClick={permanentlyRemoveAll}>
                Permanently Remove All
              </button>
            )}
          </>
        );
      default:
        return null;
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>To-Do</h1>
        <div>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter Task..."
          />
          <input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
          />
          <button className="add-btn" onClick={addTask}>
            Add
          </button>
        </div>
        <div>
          <button onClick={() => setCurrentTab("tasks")}>Tasks</button>
          <button onClick={() => setCurrentTab("completed")}>Completed</button>
          <button onClick={() => setCurrentTab("deleted")}>
            Recently Deleted
          </button>
        </div>
        <ul>{getContentView()}</ul>
      </header>
    </div>
  );
}

export default App;
