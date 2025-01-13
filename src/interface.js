import "./styles.css";
import { todoApp, Todo } from "./core";

const projectList = todoApp.getProjects();
const sidebarContent = document.querySelector(".sidebar-content");
const todosContent = document.querySelector(".todos-content");
const addProjectButton = document.querySelector(".add-project");
const addTodosButton = document.querySelector(".add-todo");
const mainContent = document.querySelector(".main-content");

(function populateSideBar() {
  addProjectButton.addEventListener("click", () => {
    todoApp.createNewProject();
    sidebarContent.textContent = "";

    projectList.forEach((project, index) => {
      const projectDiv = document.createElement("div");
      projectDiv.setAttribute("data-index", index);

      projectDiv.textContent = project.name;
      sidebarContent.appendChild(projectDiv);
    });
    return console.log(projectList);
  });
})();

(function populateTodosBar() {
  sidebarContent.addEventListener("click", (e) => {
    let index = e.target.getAttribute("data-index");
    const todoList = todoApp.getProjects()[index].todo;
    todosContent.textContent = "";

    const fill = () => {
      todoList.forEach((todo, index) => {
        const todoDiv = document.createElement("div");
        todoDiv.setAttribute("data-index", index);
        todoDiv.textContent = todo.title;
        todosContent.appendChild(todoDiv);
      });
    };
    fill();

    addTodosButton.addEventListener("click", () => {
      todoApp.getProjects()[index].addTodoToProject(todoList);
      todosContent.textContent = "";

      fill();
    });

    todosContent.addEventListener("click", (e) => {
      const todoIndex = e.target.getAttribute("data-index");
      console.log(todoIndex);

      mainContent.textContent = "";

      const todoTitle = document.createElement("div");
      todoTitle.classList.add("title");
      todoTitle.textContent = `Title: ${todoList[todoIndex].title}`;
      mainContent.appendChild(todoTitle);

      const editTodo = document.createElement("button");
      editTodo.textContent = "Edit";
      todoTitle.appendChild(editTodo);

      const todoDescription = document.createElement("div");
      todoDescription.classList.add("description");
      todoDescription.textContent = `Description: ${todoList[todoIndex].description}`;
      mainContent.appendChild(todoDescription);

      const todoPriority = document.createElement("div");
      todoPriority.classList.add("priority");
      if (todoList[todoIndex].priority === 0) {
        todoPriority.textContent = `Priority: less important`;
      } else if (todoList[todoIndex].priority === 1) {
        todoPriority.textContent = `Priority: moderately important`;
      } else {
        todoPriority.textContent = `Priority: very important`;
      }
      mainContent.appendChild(todoPriority);

      const todoDate = document.createElement("div");
      todoDate.classList.add("date");
      todoDate.textContent = `Due Date: ${todoList[
        todoIndex
      ].dueDate.getDate()}`;
      mainContent.appendChild(todoDate);

      const todoStatus = document.createElement("div");
      todoStatus.classList.add("status");
      if (todoList[todoIndex].status === 0) {
        todoStatus.textContent = `Status: incomplete`;
      } else {
        todoStatus.textContent = `Status: complete`;
      }
      mainContent.appendChild(todoStatus);

      const todoCheckList = document.createElement("ul");
      todoCheckList.classList.add("list");
      const checkList = todoList[todoIndex].checkList.getList();
      checkList.forEach((item) => {
        const todoCheckListChild = document.createElement("li");
        todoCheckListChild.textContent = item;
        todoCheckList.appendChild(todoCheckListChild);
      });
      mainContent.appendChild(todoCheckList);
    });
  });
})();
