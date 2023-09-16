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
  const [currentTab, setCurrentTab] = useState("tasks"); // "tasks", "completed", "deleted"

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
  }, [deletedTasks]);

  const addTask = () => {
    if (inputValue) {
      setTasks([...tasks, { value: inputValue, editable: false }]);
      setInputValue("");
    }
  };

  const completeTask = (index) => {
    const taskToComplete = tasks[index];
    setCompletedTasks([...completedTasks, taskToComplete]);

    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const clearCompletedTasks = () => {
    setCompletedTasks([]);
    localStorage.setItem("completedTasks", JSON.stringify([]));
  };

  const removeTask = (index) => {
    const taskToDelete = tasks[index];
    setDeletedTasks([...deletedTasks, taskToDelete]);

    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const permanentlyRemove = (index) => {
    const newDeleted = [...deletedTasks];
    newDeleted.splice(index, 1);
    setDeletedTasks(newDeleted);
  };

  const permanentlyRemoveAll = () => {
    setDeletedTasks([]); // This will clear the deletedTasks state
  };

  const editTask = (index) => {
    let copy = [...tasks];
    copy[index].editable = true;
    setTasks(copy);
  };

  const updateTask = (e, index) => {
    let copy = [...tasks];
    copy[index].value = e.target.value;
    setTasks(copy);
  };

  const saveTask = (index) => {
    let copy = [...tasks];
    copy[index].editable = false;
    setTasks(copy);
  };

  const getContentView = () => {
    switch (currentTab) {
      case "tasks":
        return tasks.map((task, index) => (
          <li key={index} className="task-item">
            <div className="task-content">
              <button className="edit-btn" onClick={() => editTask(index)}>
                Edit
              </button>
              {task.editable ? (
                <input
                  type="text"
                  className="task-text"
                  value={task.value}
                  onChange={(e) => updateTask(e, index)}
                />
              ) : (
                <span>- {task.value}</span>
              )}
            </div>
            <div className="task-buttons">
              {task.editable ? (
                <button onClick={() => saveTask(index)}>Save</button>
              ) : (
                <>
                  <button
                    className="complete-btn"
                    onClick={() => completeTask(index)}
                  >
                    Complete
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeTask(index)}
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </li>
        ));
      case "completed":
        return (
          <>
            {completedTasks.length ? (
              <button className="remove-btn" onClick={clearCompletedTasks}>
                Clear Completed Tasks
              </button>
            ) : null}
            {completedTasks.map((task, index) => (
              <li key={index}>{task.value}</li>
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
            {deletedTasks.map((task, index) => (
              <li key={index} className="task-item">
                <div className="task-content">
                  <span>- {task.value}</span>
                </div>
                <div className="task-buttons">
                  <button
                    className="remove-btn"
                    onClick={() => permanentlyRemove(index)}
                  >
                    Delete
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
        <h1>Things To-Do</h1>
        <div>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter Task..."
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
