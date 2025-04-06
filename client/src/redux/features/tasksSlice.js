import { createSlice } from '@reduxjs/toolkit'

export const tasksSlice = createSlice({
    name: 'Tasks',
    initialState: {
        tasks: []
    },
    reducers: {
        setTasks: (state, action) => {
            state.tasks = [...action.payload]
        },
        addTask: (state, action) => {
            state.tasks = [...state.tasks, action.payload]
        }
    }
})

export const {
    setTasks,
    addTask
} = tasksSlice.actions

export default tasksSlice.reducer