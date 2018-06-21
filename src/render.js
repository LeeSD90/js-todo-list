import projects from "./logic.js";

const render = () => {
    renderProjectList();
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