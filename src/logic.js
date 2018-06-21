import projectFactory from './project.js';
import todoFactory from './todo.js';

const newProject = (name) => {
    const project = projectFactory(name);

    return project;
}

const newTodo = (title, description, dueDate, priority) => {
    var todo = todoFactory(title, description, dueDate, priority);

    return todo;
}

var projects = [];
var def = newProject("test");
projects.push(def);
def = newProject("anothertest");
projects.push(def);

export default projects;