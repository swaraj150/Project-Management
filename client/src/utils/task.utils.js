export const taskStatuses = {
  pending: 'PENDING',
  inProgress: 'IN_PROGRESS',
  completed: 'COMPLETED'
}

export const taskTypes = {
  task: 'TASK',
  milestone: 'MILESTONE'
}

export const taskPriorities = {
  low: 'LOW',
  normal: 'NORMAL',
  high: 'HIGH'
}

export const taskLevels = {
  beginner: 'BEGINNER',
  intermediate: 'INTERMEDIATE',
  expert: 'EXPERT'
}

export const linkTypes = {
  FINISH_TO_START: 0,
  START_TO_START: 1,
  START_TO_FINISH: 2,
  FINISH_TO_FINISH: 3
}

export const linkTypesReverse = {
  0: 'FINISH_TO_START',
  1: 'START_TO_START',
  2: 'START_TO_FINISH',
  3: 'FINISH_TO_FINISH'
}

export const taskStatusLabels = [
  { value: taskStatuses.pending, label: 'Pending' },
  { value: taskStatuses.inProgress, label: 'In progress' },
  { value: taskStatuses.completed, label: 'Completed' }
]

export const taskTypeLabels = [
  { value: taskTypes.task, label: 'Task' },
  { value: taskTypes.milestone, label: 'Milestone' }
]

export const taskPriorityLabels = [
  { value: taskPriorities.low, label: 'Low' },
  { value: taskPriorities.normal, label: 'Normal' },
  { value: taskPriorities.high, label: 'High' }
]

export const taskLevelLabels = [
  { value: taskLevels.beginner, label: 'Beginner' },
  { value: taskLevels.intermediate, label: 'Intermediate' },
  { value: taskLevels.expert, label: 'Expert' }
]

export const extendTask = (task) => {
  console.log(task)
  return {
    ...task,
    text: task.title,
    duration: task.estimatedDays,
    parent: task.parentTaskId || 0,
    start_date: new Date(task.startDate),
    progress: +(task.progress / 100).toFixed(2)
  }
}

export const extendLink = (link) => {
  return {
    ...link,
    id: link.id,
    source: link.fromTaskId,
    target: link.toTaskId,
    type: linkTypes[link.dependencyType] // maps string like "FINISH_TO_START" to number
  }
}

export const toDatetimeLocal = (date) => {
  const pad = (n) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
}

export const addSeconds = (date) => {
  return date + ':00'
}