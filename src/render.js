require('lodash');
import { projects, addNewProject, removeProject, editProjectName } from "./logic.js";

var storedName = "";

const render = () => {
    clearAll();
    renderProjectList();
    renderProject(projects[0], 0);
    setListeners();
}

const renderProject = (project, index) => {
    projectEditToolbarOff();
    storedName = "";
    var projectItems = document.getElementById('project-items');
    projectItems.innerHTML = "";

    var projectName = document.getElementById('project-name');
    projectName.setAttribute("data-id", index);
    projectName.readOnly = true;
    projectName.value = project.name;
    projectName.setAttribute("size", projectName.value.length);
    
    var ul = document.createElement("ul");
    ul.setAttribute("class", "list-group")
    project.todos.forEach((todo, i) => {
        var item = document.createElement("li");
        var date = document.createElement("span");
        var ico = document.createElement("i");
        item.setAttribute("data-id", i);
        ico.setAttribute("class", "	fa fa-angle-right");
        date.setAttribute("class", "todo-date");
        date.innerHTML = todo.dueDate;
        var priority = "";
        switch(parseInt(todo.priority)){
            case 1:
                priority = "-info";
                break;
            case 2:
                priority = "-warning"
                break;
            case 3:
                priority = "-danger"
                break;
            default:
                priority = "-danger"
        }
        item.setAttribute("class", "todo-item list-group-item list-group-item" + priority);
        item.appendChild(ico);
        item.innerHTML = item.innerHTML + " " + _.startCase(_.toLower(todo.title));
        item.appendChild(date);
        ul.appendChild(item)
    })
    projectItems.appendChild(ul);

}

const renderTodo = (event) => {
    var element = event.target;
    if(element.classList.contains("active")) { 
        for(const n of element.childNodes){
            if(n.nodeName == "DIV") { element.removeChild(n) }
            if(n.nodeName == "I") { n.classList.add("fa-angle-right"); n.classList.remove("fa-angle-down"); }
        }
        element.classList.remove("active");
    } 
    else {
        var todo = projects[document.getElementById('project-name').dataset.id].todos[element.dataset.id];
        var expand = document.createElement("div");
        var ico = element.getElementsByTagName('i')[0];
        ico.classList.add("fa-angle-down");
        ico.classList.remove("fa-angle-right");
        expand.setAttribute("class","expanded-todo");
        expand.innerHTML = '<h1 class="title">' + todo.title + '</h1><div class="description">' + todo.description + '</div><div class="date">Due: ' + todo.dueDate + '<div class="priority">Priority ' + todo.priorityText() + "</div>";
        element.appendChild(expand);
        element.classList.add("active");
    }
}

const renderProjectList = () => {
    var view = document.getElementById('projects');
    view.innerHTML = "";
    projects.forEach((p, i) => {
        var item = document.createElement("div");
        item.setAttribute("class", "project-item");
        item.setAttribute("data-id", i);
        item.innerHTML = p.name;
        view.appendChild(item);
    })
}

const setListeners = () => {
    document.getElementById('new-project-button').addEventListener("click", toggleButtons);
    document.getElementById('submit-new-project-button').addEventListener("click", submitNewProjectButton);
    document.getElementById('edit-button').addEventListener("click", projectEditToolbarOn);
    document.getElementById('delete-button').addEventListener("click", deleteProjectButton);
    document.getElementById('submit-edit-project-button').addEventListener("click", submitEditProjectButton);
    document.getElementById('cancel-edit-project-button').addEventListener("click", cancelEditProjectButton);

    var projectsList = document.querySelector("#projects");
    projectsList.addEventListener("click", (e) => {
        return renderProject(projects[e.target.dataset.id], e.target.dataset.id) //TODO refactor a bit
    })

    var todoList = document.querySelector('#project-items');
    todoList.addEventListener("click", (e) => {
        return renderTodo(e)
    })

    document.addEventListener("click", (evt) => {
        const form = document.getElementById('new-project-form');

        let target = evt.target;

        do{
            if(target === form){
                return;
            }
            target = target.parentNode;
        } while (target);
        if (document.getElementById('new-project').classList.contains("focused")) { toggleButtons(); }
    })
}

const clearAll = () => {
    storedName = "";
    var projects = document.getElementById('projects');
    var projectItems = document.getElementById('project-items');
    var projectName = document.getElementById('project-name');

    projectItems.innerHTML = "";
    projectName.innerHTML = "";
    projects.innerHTML = "";
}

function toggleButtons() {
    document.getElementById('new-project').classList.toggle("focused");
    document.getElementById('new-project-button').classList.toggle("hidden");
    document.getElementById('submit-new-project-button').classList.toggle("hidden");
}

function projectEditToolbarOff() {
    var projectName = document.getElementById('project-name')
    if(storedName === "") { storedName = projectName.value; }
    projectName.value = storedName;

    projectName.readOnly = true;

    document.getElementById('edit-toolbar').classList.add("hidden");
    document.getElementById('project-toolbar').classList.remove("hidden");
}

function projectEditToolbarOn() {
    var projectName = document.getElementById('project-name')
    projectName.readOnly = false;
    projectName.focus();
    document.getElementById('edit-toolbar').classList.remove("hidden");
    document.getElementById('project-toolbar').classList.add("hidden");
}

function submitNewProjectButton() {
    addNewProject(document.getElementById('new-project').value);
    toggleButtons();
    renderProjectList();
}

function submitEditProjectButton() {
    var project = document.getElementById('project-name');
    editProjectName(project.getAttribute("data-id"), project.value);
    renderProjectList();
    projectEditToolbarOff();
}

function cancelEditProjectButton() {
    projectEditToolbarOff();
}

function deleteProjectButton() {
    var project = document.getElementById('project-name');
    removeProject(project.getAttribute("data-id"));
    renderProjectList();
    renderProject(projects[0], 0);
}

export { render };