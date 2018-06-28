const projectFactory = (name) => {
    var todos = [];

    return { todos, name }
};

export default projectFactory;