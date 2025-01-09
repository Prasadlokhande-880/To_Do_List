const express = require("express");
const app = express();

app.use(express.json());

// Task structure class
/**
 * Represents a task structure.
 * @class
 */
class TaskStructure {
  /**
   * Creates an instance of TaskStructure.
   * @param {number} id - The ID of the task.
   * @param {string} descriptions - The description of the task.
   * @param {string} [dueDate=""] - The due date of the task.
   * @param {boolean} [completed=false] - The completion status of the task.
   */
  constructor(id, descriptions = "", dueDate = "", completed = false) {
    this.id = id;
    this.descriptions = descriptions;
    this.dueDate = dueDate;
    this.completed = completed;
  }
}

// Operations for managing the to-do list
/**
 * Class responsible for performing operations on a to-do list.
 * @class
 */
class ToDoListOperations {
  /**
   * Creates an instance of ToDoListOperations.
   */
  constructor() {
    this.idIncrement = 0;
    this.Data = new Map();
  }

  /**
   * Adds a new task to the list.
   * @param {string} [descriptions=""] - The description of the task.
   * @param {string} [dueDate=""] - The due date of the task.
   * @param {boolean} [completed=false] - The completion status of the task.
   * @returns {TaskStructure} The newly created task.
   * @throws {Error} If the description is empty, the date is invalid, or completed is not a boolean.
   */
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

  /**
   * Marks a task as completed.
   * @param {number} id - The ID of the task.
   * @returns {TaskStructure} The updated task.
   * @throws {Error} If the task does not exist or is already completed.
   */
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

  /**
   * Deletes a task by ID.
   * @param {number} id - The ID of the task.
   * @throws {Error} If the task does not exist.
   */
  deleteTask(id) {
    if (!this.Data.has(id)) {
      throw new Error(`Task with ID ${id} does not exist.`);
    }
    this.Data.delete(id);
  }

  /**
   * Deletes multiple tasks by their IDs.
   * @param {number[]} ids - The IDs of the tasks to delete.
   * @throws {Error} If the input is not an array of IDs.
   */
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

  /**
   * Retrieves all tasks from the list.
   * @returns {TaskStructure[]} Array of all tasks.
   */
  showAllTasks() {
    return Array.from(this.Data.values());
  }
}

// Create an instance of the ToDoListOperations class
const toDoList = new ToDoListOperations();

// Routes

/**
 * Route handler to get all tasks.
 * @route GET /getAllTasks
 * @returns {object[]} An array of tasks.
 */
app.get("/getAllTasks", (req, res) => {
  try {
    const tasks = toDoList.showAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Route handler to add a new task.
 * @route POST /addTask
 * @param {object} req.body - Task details.
 * @param {string} req.body.descriptions - The description of the task.
 * @param {string} [req.body.dueDate] - The due date of the task.
 * @param {boolean} req.body.completed - The completion status of the task.
 * @returns {TaskStructure} The created task.
 */
app.post("/addTask", (req, res) => {
  try {
    const { descriptions, dueDate, completed } = req.body;
    const task = toDoList.addTask(descriptions, dueDate, completed);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Route handler to mark a task as completed.
 * @route PATCH /markCompleted/:id
 * @param {number} id - The ID of the task to mark as completed.
 * @returns {TaskStructure} The updated task.
 */
app.patch("/markCompleted/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const task = toDoList.taskCompleted(id);
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Route handler to delete a task by ID.
 * @route DELETE /deleteTask/:id
 * @param {number} id - The ID of the task to delete.
 * @returns {object} A success message.
 */
app.delete("/deleteTask/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    toDoList.deleteTask(id);
    res.json({ message: `Task with ID ${id} deleted successfully.` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Route handler to delete multiple tasks.
 * @route POST /deleteMultipleTasks
 * @param {object} req.body - The list of task IDs to delete.
 * @param {number[]} req.body.ids - The task IDs to delete.
 * @returns {object} A success message.
 */
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
