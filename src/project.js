const projectFactory = (name) => {
    var todos = [];

    function addToProject(todo){
        todos.push(todo);
    }

    return { addToProject, todos, name }
};

export default projectFactory;