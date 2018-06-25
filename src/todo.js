const todoFactory = (title, description, dueDate, priority) => {
    
    function priorityText() {
        var text = ""
        switch(this.priority){
            case 1:
               text = "Low";
                break;
            case 2:
                text = "Medium";
                break;
            case 3:
                text = "High";
                break;
            default:
                text ="High";
        }
        return text;
    }

    return { title,
    description,
    dueDate,
    priority,
    priorityText
    }
};

export default todoFactory;