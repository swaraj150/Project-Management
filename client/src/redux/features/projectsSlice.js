import { createSlice } from '@reduxjs/toolkit'

export const projectsSlice = createSlice({
  name: 'Projects',
  initialState: {
    projects: [],
    projectsMap: null
  },
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload.map((project) => project.id)
      state.projectsMap = action.payload.reduce((acc, project) => {
        acc[project.id] = project
        return acc
      }, {})
    },
    addProject: (state, action) => {
      const { id } = action.payload
      state.projects.push(id)
      state.projectsMap = {}
      state.projectsMap[id] = action.payload
    },
    addTeamsToProject: (state, action) => {
      const { teams, id } = action.payload
      teams.forEach(team => {
        state.projectsMap[id].teams.push(team)
      })
    },
    addTaskToProject: (state, action) => {
      const { projectId, taskId } = action.payload
      state.projectsMap[projectId].tasks.data.push(taskId)
    },
    deleteTaskFromProject: (state, action) => {
      const { projectId, taskId } = action.payload
      state.projectsMap[projectId].tasks.data = 
        state.projectsMap[projectId].tasks.data.filter((id) => id !== taskId)
    },
    addLinkToProject: (state, action) => {
      const { projectId, linkId } = action.payload
      state.projectsMap[projectId].tasks.links.push(linkId)
    },
    deleteLinkFromProject: (state, action) => {
      const { projectId, linkId } = action.payload
      state.projectsMap[projectId].tasks.links = 
        state.projectsMap[projectId].tasks.links.filter((id) => id !== linkId)
    }
  }
})

export const {
  setProjects,
  addProject,
  addTeamsToProject,
  addTaskToProject,
  deleteTaskFromProject,
  addLinkToProject,
  deleteLinkFromProject
} = projectsSlice.actions

export default projectsSlice.reducer