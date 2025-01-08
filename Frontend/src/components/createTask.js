import React, { useState } from "react";

const TaskForm = () => {
  const [formData, setFormData] = useState({
    id: 0,
    description: "",
    dueDate: "",
    completed: false,
  });

  const [message, setMessage] = useState(""); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/addTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Task added successfully:", data);
        setMessage("Task added successfully!");
        setFormData({
          id: 0,
          description: "",
          dueDate: "",
          completed: false,
        });
      } else {
        const error = await response.json();
        console.error("Failed to add task:", error);
        setMessage("Failed to add task.");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("An error occurred while adding the task.");
    }
  };

  return (
    <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
      <div className="mb-5">
        <label
          htmlFor="description"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Task Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter task description"
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="dueDate"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div className="flex items-start mb-5">
        <div className="flex items-center h-5">
          <input
            id="completed"
            type="checkbox"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
          />
        </div>
        <label
          htmlFor="completed"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Completed
        </label>
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
      {message && (
        <p className="mt-3 text-center text-sm font-medium text-green-600 dark:text-green-400">
          {message}
        </p>
      )}
    </form>
  );
};

export default TaskForm;
