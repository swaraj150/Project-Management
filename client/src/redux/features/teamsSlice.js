import { createSlice } from '@reduxjs/toolkit'

export const teamsSlice = createSlice({
  name: 'Teams',
  initialState: {
    teams: [],
    teamsMap: null
  },
  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload.map((team) => team.id)
      state.teamsMap = action.payload.reduce((acc, team) => {
        acc[team.id] = team
        return acc
      }, {})
    },
    addTeam: (state, action) => {
      const { id } = action.payload
      state.teams = [...state.teams, id]
      state.teamsMap = {
        ...state.teamsMap,
        [id]: { ...action.payload }
      }
    }
  }
})

export const {
  setTeams,
  addTeam
} = teamsSlice.actions

export default teamsSlice.reducer