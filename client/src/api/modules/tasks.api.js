import privateClient from "../clients/private.client"

const taskEndpoints = {
  fetch: 'tasks/fetch',
  create: 'tasks/create',
  update: 'tasks/update',
  fetchByProject: 'tasks/project',
  delete: 'tasks/delete',
  loadTask: 'tasks/load',
  comments: 'tasks/loadComments'
}

const tasksApi = {
  create: async ({ title, description, startDate, estimatedDays, assignedTo, priority, type, level, projectId, parentTaskId = null }) => {
    try {
      const res = await privateClient.post(
        taskEndpoints.create,
        { title, description, startDate, estimatedDays, assignedTo, priority, type, level, projectId, parentTaskId }
      )
      return { res }
    } catch (error) {
      return { error }
    }
  },
  fetch: async () => {
    try {
      const res = await privateClient.get(taskEndpoints.fetch)
      return { res }
    } catch (error) {
      return { error }
    }
  },
  fetchByProject: async (projectId) => {
    try {
      const res = await privateClient.get(
        taskEndpoints.fetchByProject,
        { params: { projectId } }
      )
      return { res }
    } catch (error) {
      return { error }
    }
  },
  delete: async (taskId, projectId) => {
    try {
      const res = await privateClient.delete(
        taskEndpoints.delete,
        { taskId, projectId }
      )
      return { res }
    } catch (error) {
      return { error }
    }
  },
  loadTask: async (taskId) => {
    try {
      const res = await privateClient.get(
        taskEndpoints.loadTask,
        { params: { taskId } }
      )
      return { res }
    } catch (error) {
      return { error }
    }
  },
  loadComments: async (taskId) => {
    try {
      const res = await privateClient.get(
        taskEndpoints.comments,
        { params: { taskId } }
      )
      return { res }
    } catch (error) {
      return { error }
    }
  }
}

export default tasksApi