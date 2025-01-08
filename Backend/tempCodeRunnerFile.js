const express = require("express");
const app = express();

app.use(express.json());

// Task structure class
class TaskStructure {
  constructor(id, descriptions = "", dueDate = "", completed = false) {
    this.id = id;
    this.descriptions = descriptions;
    this.dueDate = dueDate;
    this.completed = completed;
  }
}

// Operations for managing the to-do list
class ToDoListOperations {
  constructor() {
    this.idIncrement = 0;
    this.Data = new Map();
  }

  // Add a new task to the list
  addTask(descriptions = "", dueDate = "", completed = false) {
    if (typeof descriptions !== "string" || descriptions.trim() === "") {
      throw new Error("Task description must be a non-empty string.");
    }
    if (dueDate && isNaN(Date.parse(dueDate))) {
      throw new Error("Invalid date format.");
    }
    if (typeof completed !== "boolean") {
      throw new Error("Completed must be a boolean value.");
    }

    const task = new TaskStructure(
      this.idIncrement,
      descriptions,
      dueDate,
      completed
    );
    this.Data.set(this.idIncrement, task);
    this.idIncrement++;
    return task;
  }

  // Mark a task as completed
  taskCompleted(id) {
    if (!this.Data.has(id)) {
      throw new Error(`Task with ID ${id} does not exist.`);
    }
    const task = this.Data.get(id);
    if (task.completed) {
      throw new Error(`Task with ID ${id} is already completed.`);
    }
    task.completed = true;
    this.Data.set(id, task);
    return task;
  }

  // Delete a task
  deleteTask(id) {
    if (!this.Data.has(id)) {
      throw new Error(`Task with ID ${id} does not exist.`);
    }
    this.Data.delete(id);
  }

  // Delete multiple tasks
  deleteMultipleTasks(ids) {
    if (!Array.isArray(ids)) {
      throw new Error("IDs should be an array.");
    }
    ids.forEach((id) => {
      if (this.Data.has(id)) {
        this.Data.delete(id);
      }
    });
  }

  // Show all tasks
  showAllTasks() {
    return Array.from(this.Data.values());
  }
}

// Create an instance of the ToDoListOperations class
const toDoList = new ToDoListOperations();

// Routes

// Get all tasks
app.get("/getAllTasks", (req, res) => {
  try {
    const tasks = toDoList.showAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new task
app.post("/addTask", (req, res) => {
  try {
    const { descriptions, dueDate, completed } = req.body;
    const task = toDoList.addTask(descriptions, dueDate, completed);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark a task as completed
app.patch("/markCompleted/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const task = toDoList.taskCompleted(id);
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a task
app.delete("/deleteTask/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    toDoList.deleteTask(id);
    res.json({ message: `Task with ID ${id} deleted successfully.` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete multiple tasks
app.post("/deleteMultipleTasks", (req, res) => {
  try {
    const { ids } = req.body;
    toDoList.deleteMultipleTasks(ids);
    res.json({ message: "Selected tasks deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
