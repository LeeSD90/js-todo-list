const projectFactory = () => {
    var todos = [];

    function addToProject(todo){
        todos.push(todo);
    }

    return { addToProject, todos }
};