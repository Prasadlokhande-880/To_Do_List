class TaskStructure {
    constructor(id, descriptions = '', dueDate = '', completed = false) {
        this.id = id;
        this.descriptions = descriptions;
        this.dueDate = dueDate;
        this.completed = completed;
    }
}

class ToDoListOperations {
    constructor() {
        this.idIncrement = 0; // Used to generate unique IDs
        this.Data = new Map(); // To store tasks with unique IDs
    }

    // Add a new task to the list
    addTask(descriptions = '', dueDate = '', completed = false) {
        try {
            // Validate input
            if (typeof descriptions !== 'string' || descriptions.trim() === '') {
                throw new Error('Task description must be a non-empty string.');
            }

            if (dueDate && isNaN(Date.parse(dueDate))) {
                throw new Error('Invalid date format. Please provide a valid date.');
            }

            if (typeof completed !== 'boolean') {
                throw new Error('Completed must be a boolean value (true or false).');
            }

            // Create a new task
            const task = new TaskStructure(this.idIncrement, descriptions, dueDate, completed);

            // Add the task to the Map with a unique ID
            this.Data.set(this.idIncrement, task);

            // Increment the ID counter
            this.idIncrement++;

            console.log('Task added successfully:', task);
            return task; // Return the added task for reference
        } catch (error) {
            console.error('Error adding task:', error.message);
            return null; // Return null if there's an error
        }
    }

    // this is the function for the mark the task as completed

    taskCompleted(id) {
        try {
            // Validate the input
            if (id === undefined || id === null) {
                throw new Error('ID is required to mark a task as completed.');
            }

            // Check if the task with the given ID exists
            if (!this.Data.has(id)) {
                throw new Error(`Task with ID ${id} does not exist.`);
            }

            // Retrieve the task and mark it as completed
            const task = this.Data.get(id);
            if (task.completed) {
                console.log(`Task with ID ${id} is already marked as completed.`);
                return;
            }

            task.completed = true;

            // Update the task in the Map
            this.Data.set(id, task);

            console.log(`Task with ID ${id} has been successfully marked as completed.`);
        } catch (error) {
            console.error('Error while marking task as completed:', error.message);
        }
    }

    
}
