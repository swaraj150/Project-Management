import { createSlice } from '@reduxjs/toolkit'
import { taskStatuses } from '../../utils/task.utils'

export const tasksSlice = createSlice({
  name: 'Tasks',
  initialState: {
    tasks: [],
    tasksMap: {},
    links: [],
    linksMap: {}
  },
  reducers: {
    setTasks: (state, action) => {
      const { data, links } = action.payload
      state.tasks = data.map((task) => task.id)
      state.tasksMap = data.reduce((acc, task) => {
        acc[task.id] = task
        return acc
      }, {})
      state.links = links.map((link) => link.id)
      state.linksMap = links.reduce((acc, link) => {
        acc[link.id] = link
        return acc
      }, {})
    },
    addTask: (state, action) => {
      const { id } = action.payload
      state.tasks.push(id)
      state.tasksMap[id] = action.payload
    },
    updateTask: (state, action) => {
      const { id } = action.payload
      state.tasksMap[id] = action.payload
    },
    deleteTask: (state, action) => {
      const { id } = action.payload
      state.tasks = state.tasks.filter((taskId) => taskId !== id)
      delete state.tasksMap[id]
    },
    addLink: (state, action) => {
      const { id } = action.payload
      state.links.push(id)
      state.linksMap[id] = action.payload
    },
    deleteLink: (state, action) => {
      const { id } = action.payload
      state.links = state.links.filter((linkId) => linkId !== id)
      delete state.linksMap[id]
    }
  }
})

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  addLink,
  deleteLink
} = tasksSlice.actions

export default tasksSlice.reducer