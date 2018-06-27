require('lodash');
import { projects, addNewProject, removeProject, editProjectName, addNewTodo } from "./logic.js";

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

const renderExpandedTodo = (element) => {
    var todo = projects[document.getElementById('project-name').dataset.id].todos[element.dataset.id];
    var expand = document.createElement("div");
    var ico = element.getElementsByTagName('i')[0];

    ico.classList.add("fa-angle-down");
    ico.classList.remove("fa-angle-right");

    expand.setAttribute("class","expanded-todo");
    expand.innerHTML = '<h1 class="title">' + todo.title + '</h1>' +
                        '<div class="description">' + todo.description + '</div>' +
                        '<div>Due: <span class="date">' + todo.dueDate + '</span></div>' +
                        '<div>Priority <span class="priority">' + todo.priorityText() + '</span></div>' +
                        '<div id="todo-edit-button" class="button" data-id=' + element.dataset.id + '"><i class="fas fa-edit"></i>Edit</div>' + 
                        '<div id="todo-submit-edit-button" class="button" data-id="' + element.dataset.id + '"><i class="fas fa-save"></i>Save</div>';
                        //'<div id="todo-delete-button" class="button" data-id="' + element.dataset.id + '"><i class="fas fa-check"></i>Mark Completed</div>';
    
    element.appendChild(expand);
    element.classList.add("active");
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
    document.getElementById('new-todo-button').addEventListener("click", newTodo);
    document.getElementById('submit-new-todo-button').addEventListener("click", submitNewTodo);
    document.getElementById('cancel-new-todo-button').addEventListener("click", cancelNewTodo)

    document.addEventListener("click", todoEditListener);

    var projectsList = document.querySelector("#projects");
    projectsList.addEventListener("click", (e) => {
        return renderProject(projects[e.target.dataset.id], e.target.dataset.id) //TODO refactor a bit
    })

    var todoList = document.querySelector('#project-items');
    todoList.addEventListener("click", (e) => {
        if(e.target.id === "todo-edit-button") { return }
        else if(e.target.id === "todo-submit-edit-button") { return }
        else { return showTodoListener(e) }
    })

    const showTodoListener = (event) => {
        var element = event.target;
        if(element.classList.contains("active")) { 
            for(const n of element.childNodes){
                if(n.nodeName == "DIV") { element.removeChild(n) }
                if(n.nodeName == "I") { n.classList.add("fa-angle-right"); n.classList.remove("fa-angle-down"); }
            }
            element.classList.remove("active");
        } 
        else {
            renderExpandedTodo(element);
        }
    }

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

    function todoEditListener(event) {
        var el = event.target;
        if(el.id == 'todo-edit-button'){
            editTodo(el);
        }
        else if(el.id == 'todo-submit-edit-button'){
            submitEditTodo(el);
        }
    }

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

function editTodo(el) {
    var title = el.parentNode.getElementsByClassName("title")[0];
    var desc = el.parentNode.getElementsByClassName("description")[0];
    var date = el.parentNode.getElementsByClassName("date")[0];
    var priority = el.parentNode.getElementsByClassName("priority")[0];
    
    title.setAttribute("contenteditable", true);
    title.classList.add("editing");

    desc.setAttribute("contenteditable", true);
    desc.classList.add("editing");

    date.setAttribute("contenteditable", true);
    date.classList.add("editing");

    priority.setAttribute("contenteditable", true);
    priority.classList.add("editing");
}

function submitEditTodo(el) {
    var title = el.parentNode.getElementsByClassName("title")[0];
    var desc = el.parentNode.getElementsByClassName("description")[0];
    var date = el.parentNode.getElementsByClassName("date")[0];
    var priority = el.parentNode.getElementsByClassName("priority")[0];

    title.setAttribute("contenteditable", false);
    title.classList.remove("editing");

    desc.setAttribute("contenteditable", false);
    desc.classList.remove("editing");

    date.setAttribute("contenteditable", false);
    date.classList.remove("editing");

    priority.setAttribute("contenteditable", false);
    priority.classList.remove("editing");

    var todo = projects[document.getElementById('project-name').dataset.id].todos[el.dataset.id]
    todo.title = title.innerHTML;
    todo.description = desc.innerHTML;
    todo.dueDate = date.innerHTML;
    todo.priority = priority.innerHTML;

    renderProject(projects[document.getElementById('project-name').dataset.id], document.getElementById('project-name').dataset.id);
}

function cancelNewTodo() { // Should probably just be one method and button that toggles? Could do this with a lot of elements in this app D:
    var form = document.getElementById('new-todo');
    var addTodo = document.getElementById('new-todo-button');
    var minimise = document.getElementById('cancel-new-todo-button');

    addTodo.classList.remove("hidden");
    form.classList.remove("expanded");
    minimise.classList.add("hidden");
}

function newTodo() {
    var form = document.getElementById('new-todo');
    var addTodo = document.getElementById('new-todo-button');
    var minimise = document.getElementById('cancel-new-todo-button');

    addTodo.classList.add("hidden");
    form.classList.add("expanded");
    minimise.classList.remove("hidden");
}

function submitNewTodo() {
    var project = projects[document.getElementById('project-name').dataset.id];
    var title = document.getElementById('new-todo-title');
    var description = document.getElementById('new-todo-description');
    var date = document.getElementById('new-todo-date');
    var priority = document.getElementById('new-todo-priority');

    addNewTodo(project, title.value, description.value, date.value, priority.value);

    title.value = "";
    description.value = "";
    date.value = "";
    priority.value = "";

    renderProject(project, document.getElementById('project-name').dataset.id);
}

export { render };