
const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskPriority = document.getElementById("task-priority");
const taskDeadline = document.getElementById("task-deadline");
const taskList = document.getElementById("task-list");
const taskFilter = document.getElementById("task-filter");
const completedCount = document.getElementById("completed-count");

// Load saved tasks from the browser
let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("taskflow-tasks")) || [];
} catch (error) {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = tasks.filter(task => {
        if (taskFilter.value === "active") {
            return !task.completed;
        }

        if (taskFilter.value === "completed") {
            return task.completed;
        }

        return true;
    });

    completedCount.textContent = tasks.filter(
        task => task.completed
    ).length;

    if (filteredTasks.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = "No tasks here. Add a task to get started!";
        taskList.appendChild(message);
        return;
    }

    filteredTasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "task-card";

        if (task.completed) {
            card.classList.add("completed");
        }

        const details = document.createElement("div");
        details.className = "task-details";

        const name = document.createElement("h3");
        name.textContent = task.title;

        const meta = document.createElement("p");
        meta.className = "task-meta";
        meta.textContent =
            "Priority: " +
            task.priority.charAt(0).toUpperCase() +
            task.priority.slice(1) +
            (task.deadline ? " | Deadline: " + task.deadline : "");

        details.append(name, meta);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = document.createElement("button");
        completeButton.className = "complete-button";
        completeButton.textContent = task.completed ? "Undo" : "Complete";

        completeButton.addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        actions.append(completeButton, deleteButton);
        card.append(details, actions);
        taskList.appendChild(card);
    });
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = taskTitle.value.trim();

    if (!title) {
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        priority: taskPriority.value,
        deadline: taskDeadline.value,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();

    taskForm.reset();
    taskPriority.value = "medium";

    renderTasks();
});

taskFilter.addEventListener("change", renderTasks);

// Show tasks when the page opens
renderTasks();
