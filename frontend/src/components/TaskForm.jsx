import React, { useState } from "react";

export default function TaskForm({ user }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert("Title is required");

    try {
      // Log the token to ensure it's being correctly retrieved
      const token = await user.getIdToken();
      console.log("Firebase Token:", token);

      if (!token) {
        alert("No token found. Please login again.");
        return;
      }
                          
      const res = await fetch("https://todo-backend-h1ha.onrender.com/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },  // Ensure token is sent correctly
      });

      if (res.ok) {
        setFormData({ title: "", description: "", dueDate: "" });
        window.location.reload(); // Refresh after successful task creation
      } else {
        const errorData = await res.json();
        console.error("Error response:", errorData);
        alert("Failed to create task. Please try again.");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-lg font-semibold mb-2">Add New Task</h2>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="border p-2 w-full mb-2"
        required
      />
      <input
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 w-full mb-2"
      />
      <input
        name="dueDate"
        type="date"
        value={formData.dueDate}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Task
      </button>
    </form>
  );
}
