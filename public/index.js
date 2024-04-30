const baseURL = "http://localhost:4000/api/tasks";

const getAllTasks = () => axios
    .get(baseURL)
    .then(response => displayTasks(response.data))
    .catch(error => console.error("Error:", error.response.data));
const createTask = taskData => axios
    .post(baseURL, taskData)
    .then(response => displayTasks(response.data))
    .catch(error => console.error("Error:", error.response.data));
const deleteTask = taskId => {
    if (confirm("Are you sure you want to delete this task?")) {
    axios.delete(`${baseURL}/${taskId}`)
        .then(response => {
            if (response.status === 200) {
            displayTasks(response.data);
            showCustomAlert("Task is deleted!");
            } else {
            console.error("Error deleting task:", response.data);
            }
        })
        .catch(error => {
        console.error("Error deleting task:", error);
    });
    }
};
const updateTask = (taskId, status ) => { axios
        .put(`${baseURL}/${taskId}`, { status})
        .then(response => console.log("Task status updated successfully:", response.data))
        .catch(error => console.error("Error updating task status:", error));
};
const searchTasksByTitle = (title) => {
    axios.get(`${baseURL}/search?title=${title}`)
        .then(response => displayTasks(response.data))
        .catch(error => console.error("Error searching tasks:", error));
};

let taskStarted = {};
const startTask = (taskId, startButton) => {
    const taskCard = startButton.closest(".task");
    const currentTime = new Date();
    const startTime = taskStarted[taskId] || currentTime;
    const timeDifference = currentTime.getTime() - startTime.getTime();
    const durationInSeconds = timeDifference / 1000;

    if (startButton.textContent === "Start") {
        startButton.textContent = "In Progress";
        const title = taskCard.querySelector(".task-title").textContent.trim();
        updateTask(taskId, "In Progress", currentTime, title, description, priority, taskCode);
        taskStarted[taskId] = currentTime;
    } else if (startButton.textContent === "In Progress") {
        if (durationInSeconds < 3) {
            showCustomAlert("Minimum required task duration not reached.");
            return;
        }
        updateTask(taskId, "Completed", taskStarted[taskId]);
        startButton.textContent = "Completed";
        showCustomAlert("Task is completed!");
    
    }
};

const displayTasks = tasks => {
    const taskList = document.getElementById("task-list-info");
    const completedTaskList = document.getElementById("task-complete-info");

    taskList.innerHTML = "";
    completedTaskList.innerHTML = "";
    tasks.forEach(task => {
        if (task.status === "Completed") {
            createCompletedTaskCard(task, completedTaskList);
        } else {
            createTaskCard(task, taskList);
        }
    });
};
const submitHandler = event => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("due-date").value;
    const priority = document.getElementById("priority").value;
    const taskCode = document.getElementById("taskCode").value;

    const taskData = { title, description, duedate: dueDate, priority, taskCode };
    createTask(taskData)
        .then(() => taskCreationForm.reset());
};
const createTaskCard = (task, taskList) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task");
    taskItem.innerHTML = `
        <h3 class="task-title">${task.title}</h3>
        <p class="task-description">Description: ${task.description}</p>
        <p class="task-due-date">Due Date: ${task.duedate}</p>
        <p class="task-priority">Priority: ${task.priority}</p>
        <p class="task-taskCode">Task Code: ${task.taskcode}</p>
        <button class="task-button" data-task-id="${task.id}" onclick="startTask(${task.id}, this)">Start</button>
        <button class="task-delete" onclick="deleteTask(${task.id})"><img src="/public/images/delete.png" alt="Delete"></button>
    `;
    taskList.appendChild(taskItem);
};

const createCompletedTaskCard = (task, completedTaskList) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task");
    taskItem.innerHTML = `
        <h3 class="task-title">${task.title}</h3>
        <p class="task-description">Description: ${task.description}</p>
        <p class="task-due-date">Due Date: ${task.duedate}</p>
        <p class="task-priority">Priority: ${task.priority}</p>
        <p class="task-taskCode">Task Code: ${task.taskcode}</p>

        <button class="task-delete" onclick="deleteTask(${task.id})"><img src="/public/images/delete.png" alt="Delete"></button>
    `;
    completedTaskList.appendChild(taskItem);
};

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

searchInput.addEventListener("input", event => {
    const searchTerm = event.target.value.trim();
    if (searchTerm === "") {
        getAllTasks();
    }
});
searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
        searchTasksByTitle(searchTerm);
    }
});

const taskCreationForm = document.getElementById("task-creation-form");
taskCreationForm.addEventListener("submit", submitHandler);

getAllTasks();
