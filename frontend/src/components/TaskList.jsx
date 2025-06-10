import React, { useEffect, useState } from "react";

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const token = await user.getIdToken();
      console.log("Firebase Token:", token);  // Ensure the token is correct

      if (!token) {
        alert("No token found. Please login again.");
        return;
      }

      const res = await fetch("https://todo-backend-h1ha.onrender.com/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },  // Ensure token is sent correctly
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error fetching tasks:", errorData);
        alert("Failed to fetch tasks. Please try again.");
        return;
      }

      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateTask = async (taskId, status) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`https://todo-backend-h1ha.onrender.com/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // Correct token format
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchTasks();  // Refresh the task list after update
      } else {
        const errorData = await res.json();
        console.error("Error updating task:", errorData);
        alert("Failed to update task. Please try again.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("An unexpected error occurred.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`https://todo-backend-h1ha.onrender.com/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,  // Correct token format
        },
      });

      if (res.ok) {
        fetchTasks();  // Refresh the task list after deletion
      } else {
        const errorData = await res.json();
        console.error("Error deleting task:", errorData);
        alert("Failed to delete task. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Your Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p className="font-bold">{task.title}</p>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateTask(
                      task._id,
                      task.status === "Open" ? "Complete" : "Open"
                    )
                  }
                  className={`px-3 py-1 text-white rounded ${
                    task.status === "Open"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                >
                  {task.status == "Open" ? "Incomplete" : "Completed"}
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
