import projectFactory from './project.js';
import todoFactory from './todo.js';

const addNewProject = (name) => {
    const project = projectFactory(name);

    return project;
}

const addNewTodo = (title, description, dueDate, priority) => {
    var todo = todoFactory(title, description, dueDate, priority);

    return todo;
}

var projects = [];
var def = addNewProject("Default");
projects.push(def);

export default projects;