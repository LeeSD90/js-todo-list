import projectFactory from './project.js';
import todoFactory from './todo.js';

const addNewProject = (name) => {
    const project = projectFactory(name);
    // Only add if the name is not a duplicate
    if (projects.filter(p => (p.name === name)).length == 0){ projects.push(project); }
}

const addNewTodo = (project, title, description, dueDate, priority) => {
    var todo = todoFactory(title, description, dueDate, priority);
    project.addToProject(todo);
}

var projects = [];
var todo = todoFactory("myFirstTodo", "Here is a test Todo", "date", 3);
addNewProject("Default");

projects.filter(p => { return p.name === "Default" })[0].addToProject(todo);


export default projects;