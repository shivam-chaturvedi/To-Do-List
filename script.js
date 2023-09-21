const taskContainer = document.getElementById("taskContainer");
const taskForm = document.querySelector(".add-task-form");
const closeFormButton = document.getElementById("close-form");
const addTaskButton = document.getElementById("addTaskButton");
const taskInput = document.getElementById("task-input");
const lastDateLabel = document.getElementById("last-date-label");
const lastDateInput = document.getElementById("last-date");
const errorMsg = document.getElementById("error-msg");
const submitFormButton = document.getElementById("submit-form");
let TaskListArray = [];
// Function to create a new task element

document.addEventListener("keydown",(e)=>{
if(e.key==="Enter" && getComputedStyle(taskForm).display!=="none"){
  addTask(); //this is done so form is submitted even when form submit event don't work
}
});

const closeForm = () => {
  taskInput.value = "";
  lastDateInput.value = "";
  lastDateLabel.innerHTML = "Select Deadline Date";
  taskForm.style.display = "none";
  errorMsg.textContent = " ";
};

closeFormButton.addEventListener("click", (e) => {
  closeForm();
});

const removeTask = (button) => {
  const taskToRemove=button.parentElement.querySelector("#task-name").textContent;
  TaskListArray=TaskListArray.filter((task)=>{
    return task.taskName!==taskToRemove;
  });
  console.log(TaskListArray);
  taskContainer.removeChild(button.parentElement);
};

const openAddTaskForm = () => {
  taskForm.style.display = "flex";
  taskInput.focus();
};

function createTask(taskName, lastDate) {
  // Create the task div
  const taskDiv = document.createElement("div");
  taskDiv.className = "task";

  // Create the inside-task div
  const insideTaskDiv = document.createElement("div");
  insideTaskDiv.className = "inside-task";

  // Create the date paragraph
  const dateParagraph = document.createElement("p");
  dateParagraph.id = "date";
  const date = new Date();
  dateParagraph.textContent =
    "Created On:" + date.toLocaleDateString() + " " + date.toLocaleTimeString();

  // Create the task name paragraph
  const taskNameParagraph = document.createElement("p");
  taskNameParagraph.textContent = taskName;
  taskNameParagraph.id="task-name";

  // Append paragraphs to inside-task div
  insideTaskDiv.appendChild(dateParagraph);
  insideTaskDiv.appendChild(taskNameParagraph);

  // Create the deadline div
  const deadlineDiv = document.createElement("div");
  deadlineDiv.className = "deadline";

  // Create the time left paragraph
  const timeLeftParagraph = document.createElement("p");
  timeLeftParagraph.id = "time-left";
  timeLeftParagraph.textContent = "Time Left";
  const timeLeft = document.createElement("p");
  timeLeft.className = "time-left-p";
  timeLeft.textContent = lastDate;

  // Append paragraph to deadline div
  deadlineDiv.appendChild(timeLeftParagraph);
  deadlineDiv.appendChild(timeLeft);

  // Create the remove button
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  // removeButton.onclick="removeTask(this)";
  removeButton.addEventListener("click", function () {
    removeTask(this);
  });

  // Append inside-task div, deadline div, and remove button to the task div
  taskDiv.appendChild(insideTaskDiv);
  taskDiv.appendChild(deadlineDiv);
  taskDiv.appendChild(removeButton);

  // Append the task div to the taskContainer
  taskContainer.appendChild(taskDiv);
}

// Event listener to add a task when the button is clicked
addTaskButton.addEventListener("click", openAddTaskForm);

lastDateInput.addEventListener("change", (e) => {
  if (lastDateInput.value === "") {
    lastDateLabel.innerHTML = "Select Deadline Date";
  } else {
    lastDateLabel.innerHTML = e.target.value;
  }
});

const addTask = () => {
  let flag = true;
  const taskName = taskInput.value;
  if (taskName === "") {
    //show please enter task name
    flag = false;
    taskInput.focus();
    errorMsg.textContent = "Task Name is Required!!!";
  }

  TaskListArray.forEach((task) => {
    if (taskName.toLowerCase() === task.taskName.toLowerCase()) {
      // show Task name already exist
      errorMsg.textContent = "Task " + taskName + " Already Exist!";
      flag = false;
      taskInput.value = "";
      taskInput.focus();
    }
  });

  if (flag) {
    let lastDate = lastDateInput.value;

    if (lastDate === "") {
      lastDate = "infinity";
    }
    TaskListArray.push({ taskName: taskName, lastDate: lastDate });
    createTask(taskName, lastDate);
    closeForm();
  }
};

submitFormButton.addEventListener("click", (e) => {
  addTask();
});



const updateTimeLeft = () => {
  let i = 0;
  const timeLeftParagraphs = document.getElementsByClassName("time-left-p");
  if (timeLeftParagraphs.length !== 0) {
    for (let i = 0; i < timeLeftParagraphs.length; i++) {
      if(TaskListArray[i].lastDate!=="infinity"){
      const currentDate = new Date();
      const lastDate = new Date(TaskListArray[i].lastDate);
      // console.log(lastDate,currentDate);
      let timeDiff = lastDate - currentDate;
      if(timeDiff<=0){
        timeLeftParagraphs[i].style.color="red";
        timeLeftParagraphs[i].textContent="TIME OVER";
      }
      else{
      let hours = Math.floor(timeDiff / 3600000); // 1 hour = 3600000 milliseconds
      timeDiff %= 3600000;
      let minutes = Math.floor(timeDiff / 60000); // 1 minute = 60000 milliseconds
      timeDiff %= 60000;
      let seconds = Math.floor(timeDiff / 1000); // 1 second = 1000 milliseconds
      timeLeftParagraphs[i].textContent = hours+" hours "+minutes+" min "+seconds+" sec";
      }
    }
    }
  }
};
setInterval(updateTimeLeft, 1000);
