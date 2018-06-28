import {
  projects, addNewProject, removeProject, editProjectName, addNewTodo, priorityText,
} from './logic';

require('lodash');

let storedName = '';

function toggleButtons() {
  document.getElementById('new-project').classList.toggle('focused');
  document.getElementById('new-project-button').classList.toggle('hidden');
  document.getElementById('submit-new-project-button').classList.toggle('hidden');
}

function projectEditToolbarOff() {
  const projectName = document.getElementById('project-name');
  if (storedName === '') { storedName = projectName.value; }
  projectName.value = storedName;

  projectName.readOnly = true;

  document.getElementById('edit-toolbar').classList.add('hidden');
  document.getElementById('project-toolbar').classList.remove('hidden');
}

function projectEditToolbarOn() {
  const projectName = document.getElementById('project-name');
  projectName.readOnly = false;
  projectName.focus();
  document.getElementById('edit-toolbar').classList.remove('hidden');
  document.getElementById('project-toolbar').classList.add('hidden');
}

const renderProject = (project, index) => {
  projectEditToolbarOff();
  storedName = '';
  const projectItems = document.getElementById('project-items');
  projectItems.innerHTML = '';

  const projectName = document.getElementById('project-name');
  projectName.setAttribute('data-id', index);
  projectName.readOnly = true;
  projectName.value = project.name;
  projectName.setAttribute('size', projectName.value.length);

  const ul = document.createElement('ul');
  ul.setAttribute('class', 'list-group');
  project.todos.forEach((todo, i) => {
    const item = document.createElement('li');
    const date = document.createElement('span');
    const ico = document.createElement('i');
    item.setAttribute('data-id', i);
    ico.setAttribute('class', 'fa fa-angle-right');
    date.setAttribute('class', 'header-todo-date');
    date.innerHTML = todo.dueDate;
    let priority = '';
    switch (parseInt(todo.priority)) {
      case 1:
        priority = '-info';
        break;
      case 2:
        priority = '-warning';
        break;
      case 3:
        priority = '-danger';
        break;
      default:
        priority = '-danger';
    }
    item.setAttribute('class', `todo-item list-group-item list-group-item${priority}`);
    item.appendChild(ico);
    item.innerHTML = `${item.innerHTML} ${_.startCase(_.toLower(todo.title))}`;
    item.appendChild(date);
    ul.appendChild(item);
  });
  projectItems.appendChild(ul);
};

const renderExpandedTodo = (element) => {
  const todo = projects[document.getElementById('project-name').dataset.id].todos[element.dataset.id];
  const expand = document.createElement('div');
  const ico = element.getElementsByTagName('i')[0];

  ico.classList.add('fa-angle-down');
  ico.classList.remove('fa-angle-right');

  expand.setAttribute('class', 'expanded-todo');
  expand.innerHTML = `<h1 class="title">${todo.title}</h1>
                      <div class="description">${todo.description}</div>
                      <div>Due: <input type="date" class="todo-date-picker editing hidden"><span class="todo-date date">${todo.dueDate}</span></div>
                      <div>Priority: 
                      <select class="todo-priority-selector editing hidden">
                      <option value="1">Low</option>
                      <option value="2">Medium</option>
                      <option value="3">High</option>
                      </select>
                      <span class="todo-priority priority">${priorityText(todo)}</span></div>
                      <div id="todo-edit-button" class="button" data-id=${element.dataset.id}"><i class="fas fa-edit"></i>Edit</div>
                      <div id="todo-submit-edit-button" class="button" data-id="${element.dataset.id}"><i class="fas fa-save"></i>Save</div>
                      <div id="todo-delete-button" class="button" data-id="${element.dataset.id}"><i class="fas fa-check"></i>Remove</div>`;
  element.appendChild(expand);
  element.classList.add('active');
};

const renderProjectList = () => {
  const view = document.getElementById('projects');
  view.innerHTML = '';
  projects.forEach((p, i) => {
    const item = document.createElement('div');
    item.setAttribute('class', 'project-item');
    item.setAttribute('data-id', i);
    item.innerHTML = p.name;
    view.appendChild(item);
  });
};

const clearAll = () => {
  storedName = '';
  const projects = document.getElementById('projects');
  const projectItems = document.getElementById('project-items');
  const projectName = document.getElementById('project-name');

  projectItems.innerHTML = '';
  projectName.innerHTML = '';
  projects.innerHTML = '';
};

function editTodo(el) {
  const title = el.parentNode.getElementsByClassName('title')[0];
  const desc = el.parentNode.getElementsByClassName('description')[0];
  const dateDisplay = el.parentNode.getElementsByClassName('todo-date')[0];
  const priorityDisplay = el.parentNode.getElementsByClassName('todo-priority')[0];
  const datePicker = el.parentNode.getElementsByClassName('todo-date-picker')[0];
  const prioritySelector = el.parentNode.getElementsByClassName('todo-priority-selector')[0];

  title.setAttribute('contenteditable', true);
  title.classList.add('editing');

  desc.setAttribute('contenteditable', true);
  desc.classList.add('editing');

  dateDisplay.classList.add('hidden');
  datePicker.classList.remove('hidden');
  datePicker.placeholder = dateDisplay.innerHTML;

  priorityDisplay.classList.add('hidden');
  prioritySelector.placeholder = priorityDisplay.innerHTML;
  prioritySelector.classList.remove('hidden');
}

// TODO update localstorage
function submitEditTodo(el) {
  const title = el.parentNode.getElementsByClassName('title')[0];
  const desc = el.parentNode.getElementsByClassName('description')[0];
  const dateDisplay = el.parentNode.getElementsByClassName('todo-date')[0];
  const priorityDisplay = el.parentNode.getElementsByClassName('todo-priority')[0];
  const datePicker = el.parentNode.getElementsByClassName('todo-date-picker')[0];
  const prioritySelector = el.parentNode.getElementsByClassName('todo-priority-selector')[0];

  title.setAttribute('contenteditable', false);
  title.classList.remove('editing');

  desc.setAttribute('contenteditable', false);
  desc.classList.remove('editing');

  dateDisplay.classList.remove('hidden');
  datePicker.classList.add('hidden');

  priorityDisplay.classList.remove('hidden');
  prioritySelector.classList.add('hidden');

  const todo = projects[document.getElementById('project-name').dataset.id].todos[el.dataset.id];
  todo.title = title.innerHTML;
  todo.description = desc.innerHTML;
  todo.dueDate = datePicker.value;
  todo.priority = prioritySelector.value;

  renderProject(projects[document.getElementById('project-name').dataset.id], document.getElementById('project-name').dataset.id);
}

// TODO Fix to work with persistent storage changes
function deleteTodo(el) {
  const project = projects[document.getElementById('project-name').dataset.id];
  project.removeTodo(el.dataset.id);
  renderProject(projects[document.getElementById('project-name').dataset.id], document.getElementById('project-name').dataset.id);
}

// TODO Should probably refactor to one method and button that toggles?
function cancelNewTodo() {
  const form = document.getElementById('new-todo');
  const addTodo = document.getElementById('new-todo-button');
  const minimise = document.getElementById('cancel-new-todo-button');

  addTodo.classList.remove('hidden');
  form.classList.remove('expanded');
  minimise.classList.add('hidden');
}

function newTodo() {
  const form = document.getElementById('new-todo');
  const addTodo = document.getElementById('new-todo-button');
  const minimise = document.getElementById('cancel-new-todo-button');

  addTodo.classList.add('hidden');
  form.classList.add('expanded');
  minimise.classList.remove('hidden');
}

function submitNewTodo() {
  const project = projects[document.getElementById('project-name').dataset.id];
  const title = document.getElementById('new-todo-title');
  const description = document.getElementById('new-todo-description');
  const date = document.getElementById('new-todo-date');
  const priority = document.getElementById('new-todo-priority');

  addNewTodo(project, title.value, description.value, date.value, priority.value);

  title.value = '';
  description.value = '';
  date.value = '';
  priority.value = '';

  renderProject(project, document.getElementById('project-name').dataset.id);
}

function submitNewProjectButton() {
  addNewProject(document.getElementById('new-project').value);
  toggleButtons();
  renderProjectList();
}

function submitEditProjectButton() {
  const project = document.getElementById('project-name');
  editProjectName(project.getAttribute('data-id'), project.value);
  renderProjectList();
  projectEditToolbarOff();
}

function cancelEditProjectButton() {
  projectEditToolbarOff();
}

function deleteProjectButton() {
  const project = document.getElementById('project-name');
  removeProject(project.getAttribute('data-id'));
  renderProjectList();
  renderProject(projects[0], 0);
}

const setListeners = () => {
  const showTodoListener = (event) => {
    const element = event.target;
    if (element.classList.contains('active')) {
      for (const n of element.childNodes) {
        if (n.nodeName === 'DIV') { element.removeChild(n); }
        if (n.nodeName === 'I') { n.classList.add('fa-angle-right'); n.classList.remove('fa-angle-down'); }
      }
      element.classList.remove('active');
    } else {
      renderExpandedTodo(element);
    }
  };

  function todoEditListener(event) {
    const el = event.target;
    if (el.id === 'todo-edit-button') {
      editTodo(el);
    } else if (el.id === 'todo-submit-edit-button') {
      submitEditTodo(el);
    } else if (el.id === 'todo-delete-button') {
      deleteTodo(el);
    }
  }

  document.getElementById('new-project-button').addEventListener('click', toggleButtons);
  document.getElementById('submit-new-project-button').addEventListener('click', submitNewProjectButton);
  document.getElementById('edit-button').addEventListener('click', projectEditToolbarOn);
  document.getElementById('delete-button').addEventListener('click', deleteProjectButton);
  document.getElementById('submit-edit-project-button').addEventListener('click', submitEditProjectButton);
  document.getElementById('cancel-edit-project-button').addEventListener('click', cancelEditProjectButton);
  document.getElementById('new-todo-button').addEventListener('click', newTodo);
  document.getElementById('submit-new-todo-button').addEventListener('click', submitNewTodo);
  document.getElementById('cancel-new-todo-button').addEventListener('click', cancelNewTodo);

  document.addEventListener('click', todoEditListener);

  //TODO refactor a bit
  const projectsList = document.querySelector('#projects');
  projectsList.addEventListener('click', e => renderProject(projects[e.target.dataset.id], e.target.dataset.id));

  const todoList = document.querySelector('#project-items');
  todoList.addEventListener('click', e => {
    if (e.target.id === 'todo-edit-button') { /* empty */ }
    else if (e.target.id === 'todo-submit-edit-button') { /* empty */ }
    else if (e.target.id === 'todo-delete-button') { /* empty */ }
    return showTodoListener(e);
  });

  document.addEventListener('click', (evt) => {
    const form = document.getElementById('new-project-form');

    let target = evt.target;

    do {
      if (target === form) {
        return;
      }
      target = target.parentNode;
    } while (target);
    if (document.getElementById('new-project').classList.contains('focused')) { toggleButtons(); }
  });
};

const render = () => {
  clearAll();
  renderProjectList();
  renderProject(projects[0], 0);
  setListeners();
};

export default render;
