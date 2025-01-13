import { todoApp, saveToStorage, loadFromStorage } from "./core";
import { format } from "date-fns";

export default (function () {
  const projectList = todoApp.getProjects();
  const sidebarContent = document.querySelector(".sidebar-content");
  const todosContent = document.querySelector(".todos-content");
  const addProjectButton = document.querySelector(".add-project");
  const addTodosButton = document.querySelector(".add-todo");
  const mainContent = document.querySelector(".main-content");

  function displayProjects() {
    sidebarContent.textContent = "";
    projectList.forEach((project, index) => {
      const projectDiv = document.createElement("div");
      projectDiv.setAttribute("data-index", index);
      projectDiv.textContent = project.name;
      sidebarContent.appendChild(projectDiv);
    });
  }

  // Load and display saved projects when page loads
  document.addEventListener("DOMContentLoaded", () => {
    displayProjects();
  });

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
      saveToStorage(); // Add just this line
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

        const optionsDiv = document.createElement("div");
        optionsDiv.classList.add("options");
        todoTitle.appendChild(optionsDiv);

        const editTodo = document.createElement("button");
        editTodo.classList.add("edit-button");
        editTodo.textContent = "Edit";
        optionsDiv.appendChild(editTodo);

        const deleteTodo = document.createElement("button");
        deleteTodo.classList.add("delete-button");
        deleteTodo.textContent = "Delete";
        optionsDiv.appendChild(deleteTodo);

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
        todoDate.textContent =
          `Due Date: ${todoList[todoIndex].dueDate}` ||
          `Due Date: ${format(
            todoList[todoIndex].dueDate.getDate(),
            "yyyy-MM-dd"
          )}`;
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
        const checkList = todoList[todoIndex].checkList.list;
        checkList.forEach((item) => {
          const todoCheckListChild = document.createElement("li");
          todoCheckListChild.textContent = item;
          todoCheckList.appendChild(todoCheckListChild);
        });
        mainContent.appendChild(todoCheckList);

        const editTodoModal = document.querySelector(".edit-dialog");
        const closeModalButton = document.querySelector(".x");

        editTodo.addEventListener("click", () => {
          editTodoModal.showModal();
        });

        closeModalButton.addEventListener("click", () => {
          editTodoModal.close();
        });

        const checklistContainer = document.querySelector(
          ".checklist-container"
        );
        const addButton = document.querySelector(".add-checklist-item");

        // Add a new checklist item
        addButton.addEventListener("click", () => {
          const itemWrapper = document.createElement("div");
          itemWrapper.className = "checklist-item";

          const input = document.createElement("input");
          input.type = "text";
          input.placeholder = "Checklist item";
          input.name = "checklist";

          const removeButton = document.createElement("button");
          removeButton.type = "button";
          removeButton.textContent = "Remove";

          removeButton.addEventListener("click", () => {
            itemWrapper.remove(); // Remove the checklist item
          });

          itemWrapper.appendChild(input);
          itemWrapper.appendChild(removeButton);
          checklistContainer.appendChild(itemWrapper);
        });

        const editTodoForm = document.querySelector(".edit-todo");

        editTodoForm.addEventListener("submit", (e) => {
          e.preventDefault();

          const formData = new FormData(editTodoForm);
          const dataObject = {};
          formData.forEach((value, key) => {
            if (key in dataObject) {
              if (Array.isArray(dataObject[key])) {
                dataObject[key].push(value);
              } else {
                dataObject[key] = [dataObject[key], value];
              }
            } else {
              dataObject[key] = value;
            }
          });

          todoList[todoIndex].title = dataObject.title;
          todoList[todoIndex].description = dataObject.description;
          todoList[todoIndex].priority = dataObject.priority;
          todoList[todoIndex].dueDate = dataObject.dueDate;
          todoList[todoIndex].status = dataObject.status;
          todoList[todoIndex].checkList.list = dataObject.checklist;

          saveToStorage(); // Add this line to save after editing

          editTodoForm.reset();
          alert("Todo updated successfully!");
        });
      });
    });
  })();
})();
