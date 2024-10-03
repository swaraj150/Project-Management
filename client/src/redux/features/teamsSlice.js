import { createSlice } from '@reduxjs/toolkit'

export const teamsSlice = createSlice({
  name: 'Teams',
  initialState: {
    teams: []
  },
  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload.teams
    },
    addTeam: (state, action) => {
      state.teams = [...state.teams, action.payload.project]
    }
  }
})

export const {
  setTeams,
  addTeam
} = teamsSlice.actions

export default teamsSlice.reducer