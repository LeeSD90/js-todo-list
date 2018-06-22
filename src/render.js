import { projects, addNewProject } from "./logic.js";

const render = () => {
    clear();
    renderProjectList();
    renderProject(projects[0]);
}

const renderProject = (project) => {
    clearToolbars();
    var projectItems = document.getElementById('project-items');
    projectItems.innerHTML = "";

    var projectName = document.getElementById('project-name');
    projectName.value = project.name;
    setProjectNameWidth(projectName);

    var toolbar = document.createElement('div');
    toolbar.setAttribute("class", "toolbar");

    var editButton = document.createElement('div');
    var deleteButton = document.createElement('div');
    var editIco = document.createElement('i');
    var deleteIco = document.createElement('i');
    editIco.setAttribute("class", "far fa-edit")
    deleteIco.setAttribute("class", "fas fa-times")
    editButton.setAttribute("class", "toolbar-item edit");
    deleteButton.setAttribute("class", "toolbar-item delete");
    editButton.setAttribute("alt", "Edit Project Name");
    editButton.id = "edit-button";
    deleteButton.setAttribute("alt", "Delete Project");

    editButton.addEventListener("click", function(){ return editProjectButton(project) });
    deleteButton.addEventListener("click", deleteProjectButton);

    editButton.appendChild(editIco);
    deleteButton.appendChild(deleteIco);
    toolbar.appendChild(editButton);
    toolbar.appendChild(deleteButton);

    var projectHeading = document.getElementById('project-heading');
    projectHeading.appendChild(toolbar);
    
    project.todos.forEach((todo) => {
        var item = document.createElement("div");
        item.setAttribute("class", "todo-item");
        item.innerHTML = todo.title;
        projectItems.appendChild(item);
    })
}

const setProjectNameWidth = (projectName) => {
    //projectName.style.width = parseInt(window.getComputedStyle(projectName, null).getPropertyValue('font-size')) * projectName.value.length + 'px';
    projectName.setAttribute("size", projectName.value.length);
}

const renderProjectList = () => {
    var view = document.getElementById('projects');
    projects.forEach((p) => {
        var item = document.createElement("div");
        item.setAttribute("class", "project-item");
        item.addEventListener("click", function(){ return renderProject(p) });
        item.innerHTML = p.name;
        view.appendChild(item);
    })
}

const setListeners = () => {
    document.getElementById('new-project-button').addEventListener("click", toggleButtons);
    document.getElementById('submit-new-project-button').addEventListener("click", submitNewProjectButton);

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

const clear = () => {
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
    var submitEdit = document.getElementById('submit-edit-project-button');

    if(!submitEdit.classList.contains('hidden')) { submitEdit.classList.add("hidden"); }
    if(toolbars != undefined && toolbars.length > 0){ for(var i = 0; i < toolbars.length; i++){ toolbars[i].innerHTML = ""; } }
}

function toggleButtons() {
    document.getElementById('new-project').classList.toggle("focused");
    document.getElementById('new-project-button').classList.toggle("hidden");
    document.getElementById('submit-new-project-button').classList.toggle("hidden");
}

function submitNewProjectButton() {
    addNewProject(document.getElementById('new-project').value);
    toggleButtons();
    render();
}

function editProjectButton(project) {
    var projectName = document.getElementById('project-name')
    projectName.readOnly = true ? false : true;
    projectName.focus();

    document.getElementById('edit-button').classList.toggle("hidden");
    document.getElementById('submit-edit-project-button').classList.toggle("hidden");
}

function deleteProjectButton() {
    console.log("boop")
}

export { setListeners, render };