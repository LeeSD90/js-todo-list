import projectFactory from './project.js';
import todoFactory from './todo.js';

// TODO Prevent removal of last project?
const removeProject = (id) => {
    projects.splice(id, 1);
    _updateLocalStorage();
}

const editProjectName = (id, name) => {
    projects[id].name = name;
    _updateLocalStorage();
}

const addNewProject = (name) => {
    const project = projectFactory(name);

    // Only add if the name is not a duplicate and is not an empty string
    if (projects.filter(p => (p.name === name)).length == 0 && name.length > 0){ projects.push(project); }

    _updateLocalStorage();
}

const addNewTodo = (project, title, description, dueDate, priority) => {
    var todo = todoFactory(title, description, dueDate, priority); 
    addTodoToProject(project, todo);
}

function addTodoToProject(project, todo){
    project.todos.push(todo);
    _updateLocalStorage();
}

function removeTodoFromProject(id){
    todos.splice(id, 1);
    _updateLocalStorage();
}

function priorityText(todo) {
    var text = ""
    if (parseInt(todo.priority) === NaN){ return todo.priority }
    switch(parseInt(todo.priority)){
        case 1:
           text = "Low";
            break;
        case 2:
            text = "Medium";
            break;
        case 3:
            text = "High";
            break;
        default:
            text ="High";
    }
    return text;
}

const _updateLocalStorage = () => {
    localStorage.setItem("projects", JSON.stringify(projects));
}

export { projects, addNewProject, removeProject, editProjectName, addNewTodo, priorityText };

var projects = JSON.parse(localStorage.getItem("projects") || "[]");

// Dummy data
if(projects.length == 0 || projects === undefined){
    var todo = todoFactory("myFirstTodo", "Here is a test Todo", "14/5/2018", 3);
    var todo2 = todoFactory("a second todo", "Here is a second test todo", "1/4/2019", 2);
    var todo3 = todoFactory("a  todo", "Here is a second test todo", "1/2/2019", 1);
    var todo4 = todoFactory("a todo", "Here is a second test todo", "1/6/2019", 1);
    addNewProject("Todo List");
    addNewProject("Second project");
    addTodoToProject(projects.filter(p => { return p.name === "Todo List" })[0], todo);
    addTodoToProject(projects.filter(p => { return p.name === "Todo List" })[0], todo2);
    addTodoToProject(projects.filter(p => { return p.name === "Todo List" })[0], todo3);
    addTodoToProject(projects.filter(p => { return p.name === "Todo List" })[0], todo4);
}