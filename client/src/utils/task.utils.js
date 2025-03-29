export const taskStatus = {
    pending: 'PENDING',
    inProgress: 'IN_PROGRESS',
    completed: 'COMPLETED'
}

export const taskTypes = {
    project: 'PROJECT',
    task: 'TASK',
    milestone: 'MILESTONE'
}

export const taskPriorities = {
    low: 'LOW',
    normal: 'NOMRAL',
    high: 'HIGH'
}

export const taskLevels = {
    basic: 'BASIC',
    moderate: 'MODERATE',
    advanced: 'ADVANCED'
}

export const taskStatusLabels  = [
    { key: taskStatus.pending, label: 'Pending' },
    { key: taskStatus.inProgress, label: 'In progress' },
    { key: taskStatus.completed, label: 'Completed' }
]

export const taskTypeLabels = [
    { key: taskTypes.project, label: 'Project' },
    { key: taskTypes.task, label: 'Task' },
    { key: taskTypes.milestone, label: 'Milestone' }
]

export const taskPriorityLabels = [
    { key: taskPriorities.low, label: 'Low' },
    { key: taskPriorities.normal, label: 'Normal' },
    { key: taskPriorities.high, label: 'High' }
]

export const taskLevelLabels = [
    { key: taskLevels.basic, label: 'Basic' },
    { key: taskLevels.moderate, label: 'Moderate' },
    { key: taskLevels.advanced, label: 'Advanced' }
]

export const extendTask = (task) => {
    return {
        ...task,
        duration: task.estimated_days,
        parent: task.parent_task_id,
        projectId: task.project_id,
        
    }
}