import projectFactory from './project.js';
import todoFactory from './todo.js';

let projects = [];

// TODO Prevent removal of last project?
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

var todo = todoFactory("myFirstTodo", "Here is a test Todo", "14/5/2018", 3);
var todo2 = todoFactory("a second todo", "Here is a second test todo", "1/4/2019", 2);
var todo3 = todoFactory("a  todo", "Here is a second test todo", "1/2/2019", 1);
var todo4 = todoFactory("a todo", "Here is a second test todo", "1/6/2019", 1);
addNewProject("Todo List");
addNewProject("Second project");
projects.filter(p => { return p.name === "Todo List" })[0].addToProject(todo);
projects.filter(p => { return p.name === "Todo List" })[0].addToProject(todo2);
projects.filter(p => { return p.name === "Todo List" })[0].addToProject(todo3);
projects.filter(p => { return p.name === "Todo List" })[0].addToProject(todo4);

export { projects, addNewProject, removeProject, editProjectName, addNewTodo };