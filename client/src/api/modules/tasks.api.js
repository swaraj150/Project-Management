import { deleteLink } from "../../redux/features/tasksSlice"
import privateClient from "../clients/private.client"

const taskEndpoints = {
  create: 'tasks',
  getInfo: (taskId) => `tasks/${taskId}`,
  getAll: 'tasks',
  update: 'tasks',
  delete: (taskId) => `tasks/${taskId}`,
  createLink: 'tasks/link',
  deleteLink: (linkId) => `tasks/link/${linkId}`
}

const tasksApi = {
  create: async ({ title, description, startDate, estimatedDays, assignedTo, priority, type, level, projectId, parentTaskId }) => {
    try {
      const res = await privateClient.post(
        taskEndpoints.create,
        { title, description, startDate, estimatedDays, assignedTo, priority, type, level, projectId, parentTaskId }
      )
      return { res }
    } catch (err) {
      return { err }
    }
  },
  getInfo: async ({ taskId }) => {
    try {
      const res = await privateClient.get(taskEndpoints.getInfo(taskId))
      return { res }
    } catch (err) {
      return { err }
    }
  },
  getAll: async () => {
    try {
      const res = await privateClient.get(taskEndpoints.getAll)
      return { res }
    } catch (err) {
      return { err }
    }
  },
  update: async (task) => {
    try {
      const res = await privateClient.put(
        taskEndpoints.update, 
        { ...task }
      )
      return { res }
    } catch (err) {
      return { err }
    }
  },
  delete: async ({ taskId }) => {
    try {
      const res = await privateClient.delete(taskEndpoints.delete(taskId))
      return { res }
    } catch (err) {
      return { err }
    }
  },
  createLink: async({ source, target, type }) => {
    try {
      const res = await privateClient.post(
        taskEndpoints.createLink,
        { source, target, type }
      )
      return { res }
    } catch (err) {
      return { err }
    }
  },
  deleteLink: async ({ linkId }) => {
    try {
      const res = await privateClient.delete(taskEndpoints.deleteLink(linkId))
      return { res }
    } catch (err) {
      return { err }
    }
  }
}

export default tasksApi