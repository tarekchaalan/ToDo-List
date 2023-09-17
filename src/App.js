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
  const [inputDate, setInputDate] = useState(""); // new state for the date
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

  const getSortedTasks = () => {
    return [...tasks].sort((a, b) => a.deadline.localeCompare(b.deadline));
  };

  const addTask = () => {
    if (inputValue) {
      setTasks([
        ...tasks,
        { value: inputValue, editable: false, deadline: inputDate },
      ]);
      setInputValue("");
      setInputDate(""); // clear the date field
    }
  };

  const completeTask = (sortedIndex) => {
    const index = tasks.findIndex(
      (task) => task === getSortedTasks()[sortedIndex]
    );
    const taskToComplete = tasks[index]; // Add this line
    setCompletedTasks([...completedTasks, taskToComplete]); // And this line

    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const removeTask = (sortedIndex) => {
    const index = tasks.findIndex(
      (task) => task === getSortedTasks()[sortedIndex]
    );
    const taskToDelete = tasks[index]; // Add this line
    setDeletedTasks([...deletedTasks, taskToDelete]); // And this line

    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const clearCompletedTasks = () => {
    setCompletedTasks([]);
    localStorage.setItem("completedTasks", JSON.stringify([]));
  };

  const permanentlyRemove = (index) => {
    const newDeleted = [...deletedTasks];
    newDeleted.splice(index, 1);
    setDeletedTasks(newDeleted);
  };

  const permanentlyRemoveAll = () => {
    setDeletedTasks([]); // This will clear the deletedTasks state
  };

  const recoverTask = (index) => {
    const taskToRecover = deletedTasks[index];
    setTasks([...tasks, taskToRecover]);

    const newDeleted = [...deletedTasks];
    newDeleted.splice(index, 1);
    setDeletedTasks(newDeleted);
  };

  const editTask = (sortedIndex) => {
    const originalTask = getSortedTasks()[sortedIndex];
    const index = tasks.findIndex(
      (task) =>
        task.value === originalTask.value &&
        task.deadline === originalTask.deadline
    );

    let copy = [...tasks];
    copy[index].editable = true;
    setTasks(copy);
  };

  const updateTaskDeadline = (index, newDeadline) => {
    let copy = [...tasks];
    copy[index].deadline = newDeadline;
    setTasks(copy);
  };

  const updateTask = (e, index) => {
    let copy = [...tasks];
    copy[index].value = e.target.value;
    setTasks(copy);
  };

  const saveTask = (sortedIndex) => {
    const originalTask = getSortedTasks()[sortedIndex];
    const index = tasks.findIndex(
      (task) =>
        task.value === originalTask.value &&
        task.deadline === originalTask.deadline
    );

    let copy = [...tasks];
    copy[index].editable = false;
    setTasks(copy);
  };

  const getContentView = () => {
    switch (currentTab) {
      case "tasks":
        return getSortedTasks().map((task, sortedIndex) => (
          <li key={sortedIndex} className="task-item">
            <div className="task-content">
              <button
                className="edit-btn"
                onClick={() => editTask(sortedIndex)}
              >
                Edit
              </button>
              {task.editable ? (
                <>
                  <input
                    type="text"
                    className="task-text"
                    value={task.value}
                    onChange={(e) => updateTask(e, sortedIndex)}
                  />
                  <input
                    type="date"
                    value={task.deadline}
                    onChange={(e) =>
                      updateTaskDeadline(sortedIndex, e.target.value)
                    }
                  />
                </>
              ) : (
                <>
                  <span>• {task.value}</span>
                  <div className="flex-grow">
                    Deadline: {task.deadline || "None"}
                  </div>
                </>
              )}
            </div>
            <div className="task-buttons">
              {task.editable ? (
                <button onClick={() => saveTask(sortedIndex)}>Save</button>
              ) : (
                <>
                  <button
                    className="complete-btn"
                    onClick={() => completeTask(sortedIndex)}
                  >
                    Complete
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeTask(sortedIndex)}
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
        <h1>Things To-Do</h1>
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
