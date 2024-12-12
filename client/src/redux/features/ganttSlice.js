import { createSlice } from "@reduxjs/toolkit";

export const ganttSlice = createSlice({
    name: 'Gantt',
    initialState: {
        mode: 'DAYS',
        tasks: [
            //     {
            //         id: "1",
            //         name: "Design Prototype",
            //         start: new Date(2024, 11, 1),
            //         end: new Date(2024, 11, 5),
            //         progress: 60,
            //         dependencies: [
            //             {
            //                 id: "1.1",
            //                 name: "design",
            //                 start: new Date(2024, 11, 1),
            //                 end: new Date(2024, 11, 4),
            //                 progress: 90,
            //                 dependencies:[],
            //                 status:"in_progress"
            //             },
            //             {
            //                 id: "1.2",
            //                 name: "test",
            //                 start: new Date(2024, 11, 4),
            //                 end: new Date(2024, 11, 5),
            //                 progress: 90,
            //                 dependencies:[],
            //                 status:"pending"
            //             }
            //         ],
            //         status:"in_progress"
            //     },
            //     {
            //         id: "2",
            //         name: "Development",
            //         start: new Date(2024, 11, 6),
            //         end: new Date(2024, 11, 15),
            //         progress: 40,
            //         dependencies:[],
            //         status:"pending"
            //     },
        ],
    },
    reducers: {
        changeMode: (state, action) => {
            const { mode } = action.payload;
            state.mode = mode;
        },
        addTask: (state, action) => {
            const { task } = action.payload;
            state.tasks.push(task);
        },
        setTasks: (state, action) => {
            const { tasks } = action.payload;
            state.tasks = tasks;
        }
    }
});

export const { changeMode, addTask, setTasks } = ganttSlice.actions;

export default ganttSlice.reducer