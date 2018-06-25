import { projects, addNewProject, removeProject, editProjectName } from "./logic.js";

var storedName = "";

const render = () => {
    clearAll();
    renderProjectList();
    renderProject(projects[0], 0);
    setListeners();
}

const renderProject = (project, index) => {
    storedName = "";
    clearToolbars();
    var projectItems = document.getElementById('project-items');
    projectItems.innerHTML = "";

    var projectName = document.getElementById('project-name');
    projectName.setAttribute("data-id", index);
    projectName.readOnly = true;
    projectName.value = project.name;
    setProjectNameWidth(projectName);

    var toolbar = document.createElement('div');
    toolbar.setAttribute("class", "toolbar");
    toolbar.id = "project-toolbar"

    var editButton = document.createElement('div');
    var deleteButton = document.createElement('div');
    var editIco = document.createElement('i');
    var deleteIco = document.createElement('i');
    editIco.setAttribute("class", "far fa-edit")
    deleteIco.setAttribute("class", "fa fa-trash")
    editButton.setAttribute("class", "toolbar-item edit");
    deleteButton.setAttribute("class", "toolbar-item delete");
    deleteButton.id = "delete-button";
    editButton.id = "edit-button";

    editButton.appendChild(editIco);
    deleteButton.appendChild(deleteIco);
    toolbar.appendChild(editButton);
    toolbar.appendChild(deleteButton);

    var projectName = document.getElementById('project-name');
    projectName.parentNode.insertBefore(toolbar, projectName.nextSibling);
    
    var ul = document.createElement("ul");
    ul.setAttribute("class", "list-group list-group-flush")
    project.todos.forEach((todo) => {
        var item = document.createElement("li");
        var date = document.createElement("span");
        date.setAttribute("class", "todo-date");
        date.innerHTML = todo.dueDate;
        item.setAttribute("class", "todo-item list-group-item");
        item.innerHTML = todo.title;
        item.appendChild(date);
        ul.appendChild(item)
    })
    projectItems.appendChild(ul);

    setListeners();
}

const setProjectNameWidth = (projectName) => {
    projectName.setAttribute("size", projectName.value.length);
}

const renderProjectList = () => {
    var view = document.getElementById('projects');
    projects.forEach((p, i) => {
        var item = document.createElement("div");
        item.setAttribute("class", "project-item");
        item.setAttribute("data-id", i);
        item.addEventListener("click", function(){ return renderProject(p, i) });
        item.innerHTML = p.name;
        view.appendChild(item);
    })
}

const setListeners = () => {
    document.getElementById('new-project-button').addEventListener("click", toggleButtons);
    document.getElementById('submit-new-project-button').addEventListener("click", submitNewProjectButton);
    document.getElementById('edit-button').addEventListener("click", toggleProjectEditToolbar);
    document.getElementById('delete-button').addEventListener("click", deleteProjectButton);
    document.getElementById('submit-edit-project-button').addEventListener("click", submitEditProjectButton);
    document.getElementById('cancel-edit-project-button').addEventListener("click", cancelEditProjectButton);

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
    clearToolbars();
}

const clearToolbars = () => {
    var toolbars = document.getElementsByClassName('toolbar');
    while(toolbars[0]){
        toolbars[0].parentNode.removeChild(toolbars[0]);
    }

    var editToolbar = document.getElementById('edit-toolbar');
    editToolbar.classList.add("hidden");
}

function toggleButtons() {
    document.getElementById('new-project').classList.toggle("focused");
    document.getElementById('new-project-button').classList.toggle("hidden");
    document.getElementById('submit-new-project-button').classList.toggle("hidden");
}

function toggleProjectEditToolbar() {
    var projectName = document.getElementById('project-name')
    if(storedName === "") { storedName = projectName.value; }
    projectName.value = storedName;

    if(projectName.readOnly) { 
        projectName.readOnly = false;
        projectName.focus();
    } else {
        projectName.readOnly = true;
    }

    document.getElementById('edit-toolbar').classList.toggle("hidden");
    document.getElementById('project-toolbar').classList.toggle("hidden");
}

function submitNewProjectButton() {
    addNewProject(document.getElementById('new-project').value);
    toggleButtons();
    render();
}

function submitEditProjectButton() {
    var project = document.getElementById('project-name');
    editProjectName(project.getAttribute("data-id"), project.value);
    render();
}

function cancelEditProjectButton() {
    toggleProjectEditToolbar();
}

function deleteProjectButton() {
    var project = document.getElementById('project-name');
    removeProject(project.getAttribute("data-id"));
    render();
}

export { render };