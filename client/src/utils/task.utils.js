import taskApi from "../api/modules/task.api";
import { setKanbanTasks } from "../redux/features/kanbanSlice";
import { putId, setCurrentProject, setTasks } from "../redux/features/taskSlice";
import { setUpdated } from "../redux/features/webSocketSlice";
export const convertTasksFromServer = (task, index1, level = 0, dispatch, parentId, isMilestone = false) => {
    // console.log(index,level)
    const taskIndex = task.clientTaskId || (index1 + (level === 0 ? 0 : "." + level));
    const parentTaskId = parentId;
    level = 1;
    if (dispatch) {
        dispatch(putId({ id: task.id, index: "" + taskIndex }));
    }
    return {
        id: task.id,
        index: "" + taskIndex,
        taskId: task.id,
        name: task.title,
        description: task.description,
        start: task.startDate,
        end: task.endDate,
        status: task.completionStatus ? task.completionStatus : 'PENDING',
        subtasks: task.subTasks ? task.subTasks.map((subTask) => convertTasksFromServer(subTask, taskIndex, level++, dispatch, taskIndex)) : [],
        dependencies: [],
        progress: 60,
        parentTaskId: parentTaskId,
        created_by: task.createdByUser,
        created_at: task.createdAt,
        estimated_hours: task.estimatedHours,
        assigned_to: task.assignedToUsers,
        priority: task.priority,
        completed_at: task.completedAt,
        task_type: task.type
    }
}


export const findByIndex = (object, targetIndex) => {
    if (object.index === targetIndex || object.id === targetIndex) {
        return object;
    }

    if (object.subtasks && object.subtasks.length > 0) {
        for (const dependency of object.subtasks) {
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
        description: delta.description || null,
        priority: delta.priority || null,
        taskType: delta.task_type || null,
        status: delta.status || null,
        parentTaskId: delta.parentTaskId || null,
        estimatedHours: delta.estimated_hours || null,
        startDate: delta.start || null,
        endDate: delta.end || null,
        toTaskId: delta.to_task_id || null,
        lag: delta.lag || null,
        dependencyType: delta.dependency_type || null,
        triggerAt: delta.triggerAt || null,
        publishType:delta.publish_type||null,
        projectId:delta.project_id||null
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
            return { ...newTask, subtasks: task.subtasks };
            // return {...task,id:newTask.id,parentTaskId:newTask.parentTaskId};
        } else if (task.subtasks && task.subtasks.length > 0) {
            return {
                ...task,
                subtasks: replaceTask(task.subtasks, targetIndex, newTask),
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

    if (t1.subtasks == undefined || t1.subtasks == [] || t1.subtasks.length == 0) {
        return { index: t1.index + "." + (1), parentIndex: t1.index };
    }
    const index = t1.subtasks[t1.subtasks.length - 1].index;
    const last = parseInt(index[index.length - 1]);
    return { index: index.substring(0, index.length - 1) + (last + 1), parentIndex: t1.index };

}

export const segregateTasks = (tasks, result = { pending: [], completed: [], in_progress: [] }) => {
    tasks.forEach((task) => {
        if (task.status == 'PENDING') result.pending.push(task);
        else if (task.status == 'COMPLETED') result.completed.push(task);
        else if (task.status == 'IN_PROGRESS') result.in_progress.push(task);
        if (task.subtasks) {
            segregateTasks(task.subtasks, result);
        }
    })
    return result;
}


export const formatDate = (date, iso = false) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return iso ? `${day}-${month}-${year}` : `${year}-${month}-${day}`;
};
export const updateDate = (dateTime, date) => {
    const originalDate = new Date(dateTime);

    const [year, month, day] = date.split("-").map(Number);
    originalDate.setFullYear(year, month - 1, day);
    return originalDate.toISOString().slice(0, -1);
};

export const formatTime = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
};

export const updateTaskAndFindNested = (id, task, field, value, delta = null) => {
    let updatedNestedTask = null;
    let oldNestedTask = null

    if (id === task.id) {
        const oldTask = task;
        if (delta != null) {

        }
        let updatedTask;
        if (delta != null) {
            updatedTask = { ...task, ...delta };
        }
        else {
            updatedTask = { ...task, [field]: value };
        }
        return { updatedTree: updatedTask, updatedNestedTask: updatedTask, oldNestedTask: oldTask };
    }

    if (task.subtasks) {
        const updatedDependencies = task.subtasks.map((subTask) => {
            const result = updateTaskAndFindNested(id, subTask, field, value);
            if (result.updatedNestedTask) {
                updatedNestedTask = result.updatedNestedTask;
                oldNestedTask = result.oldNestedTask;
            }
            return result.updatedTree;
        });

        return {
            updatedTree: { ...task, subtasks: updatedDependencies },
            updatedNestedTask,
            oldNestedTask
        };
    }

    return { updatedTree: task, updatedNestedTask: null, oldNestedTask: null };
};
export const setupTasks = (tasks, dispatch) => {
    // const milestonePointerRef = { value: 0 };
    // const result = addMilestones(tasks, milestones, milestonePointerRef);
    const tasks1 = tasks.map((task, index) => {
        const task1 = convertTasksFromServer(task, index + 1, 0, dispatch, null);
        return task1;
    })
    console.log("tasks: ",tasks)
    dispatch(setTasks({ tasks: tasks1 }))
    const { pending, completed, in_progress } = segregateTasks(tasks1);
    dispatch(setKanbanTasks({ status: 'pending', tasks: pending }))
    dispatch(setKanbanTasks({ status: 'completed', tasks: completed }))
    dispatch(setKanbanTasks({ status: 'in_progress', tasks: in_progress }))
    dispatch(setUpdated())
}


const addMilestones = (tasks, milestones, milestonePointerRef) => {
    const newList = [];

    tasks.forEach((task) => {
        if (
            milestonePointerRef.value < milestones.length &&
            task.id === milestones[milestonePointerRef.value].taskId
        ) {
            newList.push(task);
            newList.push(milestones[milestonePointerRef.value]);
            milestonePointerRef.value++;
        } else {
            if (task.subTasks && task.subTasks.length > 0) {
                task.subTasks = addMilestones(
                    task.subTasks,
                    milestones,
                    milestonePointerRef
                );
            }
            newList.push(task);
        }
    });

    return newList;
};
export const createTaskList = (tasks, newList) => {

    tasks.forEach((task) => {
        newList.push(task);
        if (task.subtasks && task.subtasks.length > 0) {
            createTaskList(task.subtasks, newList);
        }
    });
};
export const fetchTasksByProject = async (projectId, dispatch, project) => {
    const { res, err } = await taskApi.fetchByProject(projectId);
    if (res && res.tasks) {
        setupTasks(res.tasks, dispatch);
    }
    dispatch(setCurrentProject(project));
}

export const dependency_types = {
    FINISH_TO_START: "0",
    START_TO_START: "1",
    FINISH_TO_FINISH: "2",
    START_TO_FINISH: "3",
}

export const updateDependenciesStatus = (tasks, taskId, value, dependencies_delta, visited = new Set()) => {
    if (visited.has(taskId)) return;
    visited.add(taskId);

    tasks.forEach((task) => {
        if (task.id === taskId) {
            const { dependencies } = task;

            if (!dependencies || dependencies.length === 0) {
                return;
            }

            for (const dependency of dependencies) {
                const { type, lag, id: dependentTaskId, index } = dependency;

                let newStatus = computeNewStatus(type, value, task.completionStatus);

                const triggerAt = lag > 0
                    ? new Date(Date.now() + lag * (1000 * 60 * 60 * 24)).toISOString()
                    : null;



                dependencies_delta.push({
                    id: dependentTaskId,
                    index,
                    status: newStatus,
                    triggerAt,
                });

                // propagate to dependent tasks
                const dependentTask = tasks.find((t) => t.id === dependentTaskId);
                if (dependentTask) {
                    updateDependenciesStatus(tasks, dependentTask.id, newStatus, dependencies_delta, visited);
                }
            }
        }

        if (task.subtasks && task.subtasks.length > 0) {
            updateDependenciesStatus(task.subtasks, taskId, value, dependencies_delta, visited);
        }
    });
};
export const updateDependenciesDates = (tasks, taskId, fromStart, fromEnd, dependencies_delta, visited = new Set()) => {
    if (visited.has(taskId)) return;


    tasks.forEach((task) => {
        if (task.id === taskId) {
            const { dependencies } = task;

            if (!dependencies || dependencies.length === 0) {
                return;
            }

            for (const dependency of dependencies) {
                const { type, lag, id, index } = dependency;
                const {start,end}=computeDateTimeShift(fromStart,fromEnd,dependency.start,dependency.end,dependency)

                dependencies_delta.push({
                    id: id,
                    index,
                    start: start,
                    end: end,
                });
                console.log(dependencies_delta)
                visited.add(taskId);
                updateDependenciesDates(tasks, id, start, end, dependencies_delta, visited);

            }
        }

        if (task.subtasks && task.subtasks.length > 0) {
            updateDependenciesDates(task.subtasks, taskId, fromStart, fromEnd, dependencies_delta, visited);
        }
    });
};


const computeNewStatus = (type, value, currentStatus) => {
    switch (type) {
        case "FINISH_TO_START":
            return value === 'COMPLETED' ? "IN_PROGRESS" : "PENDING";
        case "FINISH_TO_FINISH":
            return value === 'COMPLETED' && currentStatus === 'IN_PROGRESS' ? "COMPLETED" : currentStatus;
        case "START_TO_START":
            return value === 'IN_PROGRESS' ? "IN_PROGRESS" : value;
        case "START_TO_FINISH":
            if (value === 'IN_PROGRESS' && currentStatus === 'IN_PROGRESS') {
                return "COMPLETED";
            } else if (value === 'IN_PROGRESS' && currentStatus === 'PENDING') {
                return "IN_PROGRESS";
            }
            return currentStatus;
        default:
            console.warn(`Unknown dependency type: ${type}`);
            return currentStatus;
    }
};

export const computeDateTimeShift = (fromTaskStart,fromTaskEnd, toTaskStart,toTaskEnd, dependency) => {

    const lag = dependency.lag;
    toTaskStart = new Date(toTaskStart);
    toTaskEnd = new Date(toTaskEnd);
    const currentTaskStart = new Date(fromTaskStart);
    const currentTaskEnd = new Date(fromTaskEnd);
    const toTaskDuration = toTaskEnd - toTaskStart;
    const day = 1000 * 60 * 60 * 24;
    let start, end;
    switch (dependency.type) {

        case 'FINISH_TO_FINISH': {
            start = new Date(currentTaskEnd.getTime() - toTaskDuration - (lag + 1) * day).toISOString().slice(0, -1);
            end = new Date(currentTaskEnd.getTime() + (lag) * day).toISOString().slice(0, -1);
            break;
        }
        case 'FINISH_TO_START': {
            start = new Date(currentTaskEnd.getTime() + (lag) * day).toISOString().slice(0, -1);
            end = new Date(currentTaskEnd.getTime() + toTaskDuration + (lag + 1) * day).toISOString().slice(0, -1);
            break;
        }
        case 'START_TO_START': {
            start = new Date(currentTaskStart.getTime() + (lag) * day).toISOString().slice(0, -1);
            end = new Date(currentTaskStart.getTime() + toTaskDuration + (lag + 1) * day).toISOString().slice(0, -1);
            break;
        }
        case 'START_TO_FINISH': {
            start = new Date(currentTaskStart.getTime() - toTaskDuration - (lag + 1) * day).toISOString().slice(0, -1);
            end = new Date(currentTaskStart.getTime() + (lag) * day).toISOString().slice(0, -1);
            break;
        }
        default:
            break;
    }
    return { start, end }
}


export const deleteTask=async(taskId,projectId,dispatch)=>{
    try {
        await taskApi.delete(taskId,projectId);
        const { res, err }=await taskApi.fetchByProject(projectId);
        if (res && res.tasks) {
            setupTasks(res.tasks, dispatch);
        }
    } catch (error) {
        console.log(error)
    }
}