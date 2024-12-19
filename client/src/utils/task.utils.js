import { putId } from "../redux/features/taskSlice";

export const convertTasksFromServer = (task, index, level = 0, dispatch) => {
    // console.log(index,level)
    const taskIndex = task.clientTaskId || (index + (level === 0 ? 0 : "." + level));
    if (dispatch) {
        dispatch(putId({ id: task.id, index: taskIndex }));
    }
    return {
        id: task.id,
        index: task.clientTaskId || (index + (level === 0 ? 0 : "." + level)),
        name: task.title,
        start: new Date(2024, 11, 1),
        end: new Date(2024, 11, 5),
        status: task.completionStatus,
        dependencies: task.subTasks.map((subTask) => convertTasksFromServer(subTask, task.clientTaskId || index, ++level,dispatch)),
        progress: 60
    }
}
export const findClientId = (taskId, tasks) => {

}

export const findByIndex=(object, targetIndex) =>{
    if (object.index === targetIndex) {
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

export const traverseTask = (task, clientId, i) => {
    if (i >= clientId.length) return task;
    const index = parseInt(clientId[i], 10);
    if (typeof (index) == "number") {
        return traverseTask(task.dependencies[index - 1], clientId, i + 2);
    }
}

export const replaceTask = (tasks, targetIndex, newTask) => {
    return tasks.map((task) => {
        if (task.index === targetIndex) {
            return newTask;
        } else if (task.dependencies && task.dependencies.length > 0) {
            return {
                ...task,
                dependencies: replaceTask(task.dependencies, targetIndex, newTask),
            };
        }
        return task; // Return the task unchanged
    });
}

