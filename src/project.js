const projectFactory = (name) => {
    var todos = [];

    function addToProject(todo){
        todos.push(todo);
    }

    function removeTodo(id){
        todos.splice(id, 1);
    }

    return { addToProject, removeTodo, todos, name }
};

export default projectFactory;