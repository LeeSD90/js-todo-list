import projects from "./logic.js";

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
    var view = document.getElementById('project-list');
    projects.forEach((p) => {
        var item = document.createElement("div");
        item.setAttribute("class", "project-item");
        item.innerHTML = p.name;
        view.appendChild(item);
    })
}

export default render;