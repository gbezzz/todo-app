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
  const projects = [];

  //   todo is a property of a project that's an array
  const addTodoToProject = (todo) => {
    todo.push(new Todo());
    return "New Todo Created";
  };

  const emptyProject = (todo) => {
    todo.splice(0, todo.length);
    return "Project emptied";
  };

  const defaultProject = (name = "default") => {
    const todo = [
      new Todo("title", "description", 0, new DueDate(), new CheckList()),
    ];
    return { name, todo, addTodoToProject, emptyProject };
  };

  const defaultTodo = defaultProject();
  projects.push(defaultTodo);

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
    return projects;
  };

  const getProjects = () => projects;

  return { getProjects, createNewProject };
};

const todoApp = Projects();

export { todoApp, Todo };
