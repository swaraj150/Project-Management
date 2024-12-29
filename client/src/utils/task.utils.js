import { putId } from "../redux/features/taskSlice";

export const convertTasksFromServer = (task, index1, level = 0, dispatch,parentId) => {
    // console.log(index,level)
    const taskIndex = task.clientTaskId || (index1 + (level === 0 ? 0 : "." + level));
    const parentTaskId=parentId;
    level=1;
    if (dispatch) {
        dispatch(putId({ id: task.id, index: ""+taskIndex }));
    }
    return {
        id: task.id,
        index: ""+taskIndex,
        taskId:task.id,
        name: task.title,
        start: new Date(2024, 11, 1),
        end: new Date(2024, 11, 5),
        status: task.completionStatus?task.completionStatus:'PENDING',
        dependencies: task.subTasks? task.subTasks.map((subTask) => convertTasksFromServer(subTask, taskIndex, level++, dispatch,taskIndex)):[],
        progress: 60,
        parentTaskId: parentTaskId
    }
}

export const findByIndex = (object, targetIndex) => {
    if (object.index === targetIndex || object.id === targetIndex) {
        return object;
    }

    if (object.dependencies && object.dependencies.length > 0) {
        for (const dependency of object.dependencies) {
            const result = findByIndex(dependency, targetIndex);
            if (result) {
                return result;
            }
        }
    }

    // Return null if not found
    return null;
}
// for now at time t, only one thing changes
// export const extractDeltas = (originalTasks, updatedTasks) => {
//     return updatedTasks.reduce((deltas, updatedTask) => {
//         const originalTask = originalTasks.find(task => task.index === updatedTask.index);
//         if (!originalTask) {
//             deltas.push({ index: updatedTask.index, ...updatedTask });
//         } else {
//             const changedFields = Object.keys(updatedTask).reduce((changes, key) => {
//                 if (updatedTask[key] !== originalTask[key]) {
//                     changes[key] = updatedTask[key];
//                 }
//                 return changes;
//             }, {});

//             if (Object.keys(changedFields).length > 0) {
//                 deltas.push({ id: updatedTask.id, index: updatedTask.index, ...changedFields });
//             }
//         }

//         return deltas;
//     }, []);
// };

export const extractDelta = (oldTask, newTask) => {
    const changedFields = Object.keys(newTask).reduce((changes, key) => {
        if (newTask[key] !== oldTask[key]) {
            changes[key] = newTask[key];
        }
        return changes;
    }, {});

    if (Object.keys(changedFields).length > 0) {
        return { id: newTask.id, index: newTask.index, ...changedFields };
    }
}
export const convertTasksToServer = (delta) => {
    return {
        taskId: (delta.id === delta.index) ? null : (delta.id || null),
        clientTaskId: delta.index || null,
        title: delta.name || null,
        priority: delta.priority || null,
        taskType: delta.taskType || null,
        status: delta.status || null,
        parentTaskId: delta.parentTaskId || null

    }
}

export const mergeTasks = (newTasks, oldTasks) => {
    const oldTasksMap = new Map(oldTasks.map((task) => [task.id, task]));
    newTasks.forEach((newTask) => {
        oldTasksMap.set(newTask.id, newTask);

    });
    return Array.from(oldTasksMap.values());
}

export const traverseTask = (task, clientId, i) => {
    if (i >= clientId.length) return task;
    const index = parseInt(clientId[i], 10);
    if (typeof (index) == "number") {
        return traverseTask(task.dependencies[index - 1], clientId, i + 2);
    }
}

export const replaceTask = (tasks, targetIndex, newTask) => {
    return tasks.map((task) => {
        if (task.index == targetIndex) {
            return {...newTask,dependencies:task.dependencies};
            // return {...task,id:newTask.id,parentTaskId:newTask.parentTaskId};
        } else if (task.dependencies && task.dependencies.length > 0) {
            return {
                ...task,
                dependencies: replaceTask(task.dependencies, targetIndex, newTask),
            };
        }
        return task;
    });
}


export const calculateIndex = (previousIndex, updatedTasks) => {
    if (previousIndex === null) {
        const index = updatedTasks && updatedTasks.length > 0 ? updatedTasks.length + 1 : 1;
        return { index: index, parentIndex: null };
    }
    let t1 = {};
    for (let t of updatedTasks) {
        t1 = findByIndex(t, previousIndex);
        if (t1 != null) break;
    }

    if (t1.dependencies==undefined || t1.dependencies==[] || t1.dependencies.length == 0) {
        return { index: t1.index + "." + (1), parentIndex: t1.index };
    }
    const index = t1.dependencies[t1.dependencies.length - 1].index;
    const last = parseInt(index[index.length - 1]);
    return { index: index.substring(0, index.length - 1) + (last + 1), parentIndex: t1.index };

}

export const segregateTasks=(tasks,result={pending:[],completed:[],in_progress:[]})=>{
    tasks.forEach((task)=>{
        if(task.status=='PENDING') result.pending.push(task);
        else if(task.status=='COMPLETED') result.completed.push(task);
        else if(task.status=='IN_PROGRESS') result.in_progress.push(task);
        if(task.dependencies){
            segregateTasks(task.dependencies,result);
        }
    })
    return result;
}


export const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
export const formatTime = (date) => {
    if (!date) return ""; 
    const parsedDate = new Date(date);
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
};

export const updateTaskAndFindNested = (id, task, field, value) => {
    let updatedNestedTask = null;
    let oldNestedTask = null

    if (id === task.id) {
        const oldTask = task;
        const updatedTask = { ...task, [field]: value };
        return { updatedTree: updatedTask, updatedNestedTask: updatedTask, oldNestedTask: oldTask };
    }

    if (task.dependencies) {
        const updatedDependencies = task.dependencies.map((subTask) => {
            const result = updateTaskAndFindNested(id, subTask, field, value);
            if (result.updatedNestedTask) {
                updatedNestedTask = result.updatedNestedTask;
                oldNestedTask = result.oldNestedTask;
            }
            return result.updatedTree;
        });

        return {
            updatedTree: { ...task, dependencies: updatedDependencies },
            updatedNestedTask,
            oldNestedTask
        };
    }

    return { updatedTree: task, updatedNestedTask: null, oldNestedTask: null };
};