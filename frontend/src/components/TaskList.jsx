import { useEffect, useState } from "react";

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const token = await user.getIdToken();
    const res = await fetch("https://todo-backend-h1ha.onrender.com/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateTask = async (taskId, status) => {
    const token = await user.getIdToken();
    await fetch(`https://todo-backend-h1ha.onrender.com/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    fetchTasks();
  };

  const deleteTask = async (taskId) => {
    const token = await user.getIdToken();
    await fetch(`https://todo-backend-h1ha.onrender.com/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchTasks();
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
                  {task.status}
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
