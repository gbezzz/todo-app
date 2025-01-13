function saveToStorage() {
  // Just save what we have, without changing anything
  localStorage.setItem(
    "todoApp_projects",
    JSON.stringify(todoApp.getProjects())
  );
  console.log("Saved to storage:", todoApp.getProjects()); // This helps us see what's being saved
}

function loadFromStorage() {
  const saved = localStorage.getItem("todoApp_projects");
  console.log("Loaded from storage:", saved); // This helps us see what's being loaded
  return saved ? JSON.parse(saved) : null;
}

// check list factory
const CheckList = function () {
  const list = [];

  const getList = () => list;

  const updateList = (...items) => {
    list.push(...items);
    return list;
  };

  const emptyList = () => {
    list.splice(0, list.length);
    return list;
  };

  return { list, getList, updateList, emptyList };
};

// due date factory
const DueDate = function () {
  let dueDate = new Date();

  const updateDate = (year, month, day) => {
    dueDate = new Date(year, month, day);
    return dueDate;
  };

  const getDate = () => dueDate;

  return { getDate, updateDate };
};

// todos definition
class Todo {
  constructor(
    title = "new title",
    description = "new description",
    priority = 0,
    dueDate = DueDate(),
    checkList = CheckList(),
    status = 0
  ) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    this.checkList = checkList;
    this.status = status;
  }

  toggleStatus() {
    if (this.status === 0) {
      this.status = 1;
    } else {
      this.status = 0;
    }
  }
}

// todos collection
const Projects = function () {
  // First get projects from storage or use empty array
  let projects = loadFromStorage() || [];

  // Define these functions first so they can be used in the project objects
  const addTodoToProject = (todo) => {
    todo.push(new Todo());
    saveToStorage(); // Save when adding todo
    return "New Todo Created";
  };

  const emptyProject = (todo) => {
    todo.splice(0, todo.length);
    saveToStorage(); // Save when emptying project
    return "Project emptied";
  };

  // Only rebuild projects if we loaded something from storage
  if (projects.length > 0) {
    projects = projects.map((project) => {
      // Recreate each todo with its methods
      const rebuiltTodos = project.todo.map((todoData) => {
        // Create a new Todo with the saved data
        const todo = new Todo(
          todoData.title,
          todoData.description,
          todoData.priority,
          DueDate(), // Add these back
          CheckList()
        );
        // Copy over the simple properties
        todo.status = todoData.status;
        todo.checkList.list = todoData.checkList.list;
        return todo;
      });

      // Return the project with its methods restored
      return {
        name: project.name,
        todo: rebuiltTodos,
        addTodoToProject,
        emptyProject,
      };
    });
  }

  const defaultProject = (name = "default") => {
    const todo = [
      new Todo("title", "description", 0, new DueDate(), new CheckList()),
    ];
    return { name, todo, addTodoToProject, emptyProject };
  };

  // Create default project if no projects exist
  if (projects.length === 0) {
    const defaultTodo = defaultProject();
    projects.push(defaultTodo);
    saveToStorage(); // Save initial default project
  }

  function newProject(name = "New Project") {
    const todo = [
      new Todo(
        "new title",
        " new description",
        0,
        new DueDate(),
        new CheckList()
      ),
    ];
    return { name, todo, addTodoToProject, emptyProject };
  }

  const createNewProject = () => {
    projects.push(newProject());
    saveToStorage(); // Save when creating new project
    return projects;
  };

  const getProjects = () => projects;

  return { getProjects, createNewProject };
};

const todoApp = Projects();

export { todoApp, saveToStorage, loadFromStorage };
