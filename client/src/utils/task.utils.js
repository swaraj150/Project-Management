export const convertTasksFromServer = (task, index, level = 0) => {
    // console.log(index,level)
    return {
        id: task.id,
        index: task.clientTaskId || (index + (level === 0 ? 0 : "." + level)),
        name: task.title,
        start: new Date(2024, 11, 1),
        end: new Date(2024, 11, 5),
        status: task.completionStatus,
        dependencies: task.subTasks.map((subTask) => convertTasksFromServer(subTask, subTask.clienttaskId || index, ++level)),
        progress: 60
    }
}
export const findClientId=(taskId,tasks)=>{
    let task=tasks.find(task=>task.id===taskId);
    return task.index || null;
}
export const extractDeltas = (originalTasks, updatedTasks) => {
    return updatedTasks.reduce((deltas, updatedTask) => {
        const originalTask = originalTasks.find(task => task.index === updatedTask.index);

        if (!originalTask) {
            // New task added
            deltas.push({ index: updatedTask.index, ...updatedTask });
        } else {
            // Compare fields to find changes
            const changedFields = Object.keys(updatedTask).reduce((changes, key) => {
                if (updatedTask[key] !== originalTask[key]) {
                    changes[key] = updatedTask[key];
                }
                return changes;
            }, {});

            if (Object.keys(changedFields).length > 0) {
                deltas.push({ id: updatedTask.id, index: updatedTask.index, ...changedFields });
            }
        }

        return deltas;
    }, []);
};


export const convertTasksToServer = (delta) => {
    return {
        taskId: delta.id || null,
        clientTaskId: delta.index || null,
        title: delta.name || null,
        priority: delta.priority || null,
        taskType: delta.taskType || null,
        status: delta.status || null,

    }
}

export const mergeTasks = (newTasks, oldTasks) => {
    const oldTasksMap = new Map(oldTasks.map((task) => [task.id, task]));
    newTasks.forEach((newTask) => {
        oldTasksMap.set(newTask.id, newTask);
        
    });
    return Array.from(oldTasksMap.values());
}