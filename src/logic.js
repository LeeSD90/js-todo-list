import projectFactory from './project.js';
import todoFactory from './todo.js';

let projects = [];

const removeProject = (id) => {
    projects.splice(id, 1);
}

const editProjectName = (id, name) => {
    projects[id].name = name;
}

const addNewProject = (name) => {
    const project = projectFactory(name);

    // Only add if the name is not a duplicate and is not an empty string
    if (projects.filter(p => (p.name === name)).length == 0 && name.length > 0){ projects.push(project); }
}

const addNewTodo = (project, title, description, dueDate, priority) => {
    var todo = todoFactory(title, description, dueDate, priority);
    project.addToProject(todo);
}

var todo = todoFactory("myFirstTodo", "Here is a test Todo", "date", 3);
var todo2 = todoFactory("a second todo", "Here is a second test todo", "date", 2);
addNewProject("Todo List");
addNewProject("Second project");
projects.filter(p => { return p.name === "Todo List" })[0].addToProject(todo);
projects.filter(p => { return p.name === "Todo List" })[0].addToProject(todo2);

export { projects, addNewProject, removeProject, editProjectName };