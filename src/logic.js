import projectFactory from './project';
import todoFactory from './todo';

const projects = JSON.parse(localStorage.getItem('projects') || '[]');

const updateLocalStorage = () => {
  localStorage.setItem('projects', JSON.stringify(projects));
};

// TODO Prevent removal of last project?
const removeProject = (id) => {
  projects.splice(id, 1);
  updateLocalStorage();
};

const editProjectName = (id, name) => {
  projects[id].name = name;
  updateLocalStorage();
};

const addNewProject = (name) => {
  const project = projectFactory(name);

  // Only add if the name is not a duplicate and is not an empty string
  if (projects.filter(p => (p.name === name)).length === 0 && name.length > 0) {
    projects.push(project);
  }

  updateLocalStorage();
};

function addTodoToProject(project, todo) {
  project.todos.push(todo);
  updateLocalStorage();
}

const addNewTodo = (project, title, description, dueDate, priority) => {
  const todo = todoFactory(title, description, dueDate, priority);
  addTodoToProject(project, todo);
};

/*
function removeTodoFromProject(id) {
  todos.splice(id, 1);
  updateLocalStorage();
}
*/

function priorityText(todo) {
  let text = '';
  if (parseInt(todo.priority) === NaN) { return todo.priority; }
  switch (parseInt(todo.priority)) {
    case 1:
      text = 'Low';
      break;
    case 2:
      text = 'Medium';
      break;
    case 3:
      text = 'High';
      break;
    default:
      text = 'High';
  }
  return text;
}

export {
  projects, addNewProject, removeProject, editProjectName, addNewTodo, priorityText,
};

// Dummy data
if (projects.length === 0 || projects === undefined) {
  const todo = todoFactory('myFirstTodo', 'Here is a test Todo', '14/5/2018', 3);
  const todo2 = todoFactory('a second todo', 'Here is a second test todo', '1/4/2019', 2);
  const todo3 = todoFactory('a  todo', 'Here is a second test todo', '1/2/2019', 1);
  const todo4 = todoFactory('a todo', 'Here is a second test todo', '1/6/2019', 1);
  addNewProject('Todo List');
  addNewProject('Second project');
  addTodoToProject(projects.filter(p => p.name === 'Todo List')[0], todo);
  addTodoToProject(projects.filter(p => p.name === 'Todo List')[0], todo2);
  addTodoToProject(projects.filter(p => p.name === 'Todo List')[0], todo3);
  addTodoToProject(projects.filter(p => p.name === 'Todo List')[0], todo4);
}
