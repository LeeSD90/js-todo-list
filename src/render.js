import { projects, addNewProject } from "./logic.js";

const render = () => {
    renderProjectList();
    renderProject(projects[0]);
}

const renderProject = (project) => {
    var view = document.getElementById('project-view');
    
    var heading = document.createElement('h1');
    view.appendChild(heading);

    heading.innerHTML = project.name;
    project.todos.forEach((todo) => {
        var item = document.createElement("div");
        item.setAttribute("class", "todo-item");
        item.innerHTML = todo.title;
        view.appendChild(item);
    })
}

const renderProjectList = () => {
    var view = document.getElementById('projects');
    projects.forEach((p) => {
        var item = document.createElement("div");
        item.setAttribute("class", "project-item");
        item.innerHTML = p.name;
        view.appendChild(item);
    })
}

const setListeners = () => {
    document.getElementById('new-project-button').addEventListener("click", toggleButtons);
    document.getElementById('submit-new-project-button').addEventListener("click", newProject);

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

function newProject() {
    console.log("yo")
    addNewProject(document.getElementById('new-project').value);
    toggleButtons();
    render();
}

function toggleButtons() {
    document.getElementById('new-project').classList.toggle("focused");
    document.getElementById('new-project-button').classList.toggle("hidden");
    document.getElementById('submit-new-project-button').classList.toggle("hidden");
}

export { setListeners, render };