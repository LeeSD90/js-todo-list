import projectFactory from './project.js';
import todoFactory from './todo.js';

const newProject = (name) => {
    var project = new projectFactory(name);

    return project;
}

const newTodo = (title, description, dueDate, priority) => {
    var todo = new todoFactory(title, description, dueDate, priority);

    return todo;
}