import { createSlice } from "@reduxjs/toolkit";

export const ganttSlice = createSlice({
    name: 'Gantt',
    initialState: {
        mode: 'DAYS',
        tasks: [
            {
                id: "1",
                name: "Design Prototype",
                start: new Date(2024, 11, 1),
                end: new Date(2024, 11, 5),
                progress: 60,
                dependencies: [
                    {
                        id: "1.1",
                        name: "design",
                        start: new Date(2024, 11, 1),
                        end: new Date(2024, 11, 4),
                        progress: 90,
                        dependencies:[]
                    },
                    {
                        id: "1.2",
                        name: "test",
                        start: new Date(2024, 11, 4),
                        end: new Date(2024, 11, 5),
                        progress: 90,
                        dependencies:[]
                    }
                ]
            },
            {
                id: "2",
                name: "Development",
                start: new Date(2024, 11, 6),
                end: new Date(2024, 11, 15),
                progress: 40,
                dependencies:[]
            },
        ],
        showTable: true
    },
    reducers: {
        changeMode: (state, action) => {
            const { mode } = action.payload;
            state[mode] = mode;
        },
        addTask: (state, action) => {
            const { task } = action.payload;
            state[task].push(task);
        },
        changeShowTable: (state) => {
            state[showTable] = !state[showTable]
        }
    }
});

export const { changeMode, addTask, changeShowTable } = ganttSlice.actions;

export default ganttSlice.reducer