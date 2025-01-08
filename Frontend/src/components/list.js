import React, { useState, useEffect } from "react";

const List = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    // Fetch data from the server
    fetch("http://localhost:3000/getAllTasks")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((taskId) => taskId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/deleteTask/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Update the tasks list by filtering out the deleted task
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
          // Optionally, also remove from selectedTasks if selected
          setSelectedTasks((prevSelected) =>
            prevSelected.filter((taskId) => taskId !== id)
          );
        } else {
          console.error("Failed to delete the task.");
        }
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-tasks"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTasks(tasks.map((task) => task.id));
                    } else {
                      setSelectedTasks([]);
                    }
                  }}
                  checked={selectedTasks.length === tasks.length}
                />
                <label htmlFor="checkbox-all-tasks" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              Task Description
            </th>
            <th scope="col" className="px-6 py-3">
              Due Date
            </th>
            <th scope="col" className="px-6 py-3">
              Completed
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id={`checkbox-task-${task.id}`}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={() => handleCheckboxChange(task.id)}
                    checked={selectedTasks.includes(task.id)}
                  />
                  <label
                    htmlFor={`checkbox-task-${task.id}`}
                    className="sr-only"
                  >
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {task.descriptions}
              </th>
              <td className="px-6 py-4">{task.dueDate}</td>
              <td className="px-6 py-4">{task.completed ? "Yes" : "No"}</td>
              <td className="flex items-center px-6 py-4">
                <button
                  onClick={() => handleDelete(task.id)}
                  className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
