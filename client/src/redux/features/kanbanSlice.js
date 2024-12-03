import { createSlice } from "@reduxjs/toolkit";

export const kanbanSlice = createSlice({
    name: 'Kanban',
    initialState: {
        pending: [
            {
                "taskId": "0",
                "title": "Bug Fix - Payment Gateway",
                "priority": 1,
                "taskType": "BUG",
                "level": "EXPERT",
                "estimatedHours": 5,
                "parentTaskId": null,
                "assignedTo": ["Chris_Brown7542", "Jane_Smith8792"],
                "status": "pending"
            },
            {
                "taskId": "1",
                "title": "UI update1",
                "priority": 1,
                "taskType": "DEV",
                "level": "INTERMEDIATE",
                "estimatedHours": 5,
                "parentTaskId": null,
                "assignedTo": ["Chris_Brown7542", "Jane_Smith8792"],
                "status": "pending"
            },
            {
                "taskId": "2",
                "title": "UI update2",
                "priority": 1,
                "taskType": "DEV",
                "level": "INTERMEDIATE",
                "estimatedHours": 5,
                "parentTaskId": null,
                "assignedTo": ["Chris_Brown7542", "Jane_Smith8792"],
                "status": "pending"
            }
        ],
        in_progress: [
            {
                "taskId": "3",
                "title": "UI update3",
                "priority": 1,
                "taskType": "DEV",
                "level": "INTERMEDIATE",
                "estimatedHours": 5,
                "parentTaskId": null,
                "assignedTo": ["Chris_Brown7542", "Jane_Smith8792"],
                "status": "in_progress"
            },
            {
                "taskId": "5",
                "title": "UI update4",
                "priority": 1,
                "taskType": "DEV",
                "level": "INTERMEDIATE",
                "estimatedHours": 5,
                "parentTaskId": null,
                "assignedTo": ["Chris_Brown7542", "Jane_Smith8792"],
                "status": "in_progress"
            }
        ],
        completed: [
            {
                "taskId": "6",
                "title": "UI update5",
                "priority": 1,
                "taskType": "DEV",
                "level": "INTERMEDIATE",
                "estimatedHours": 5,
                "parentTaskId": null,
                "assignedTo": ["Chris_Brown7542", "Jane_Smith8792"],
                "status": "completed"
            }
        ]
    },
    reducers: {
        setTasks: (state, action) => {
            const { status, tasks } = action.payload;
            state[status] = tasks
        },
        moveTask: (state, action) => {
            const { task, toStatus } = action.payload;
            
            const { currentStatus } = task;
            console.log("task " + task + " current status " + currentStatus)
            console.log("Current task ID:", task.taskId);
            state[currentStatus] = state[currentStatus].filter((t) => {
                console.log("t ID:", t.taskId); 
                return t.taskId !== task.taskId;
            });
            state[toStatus].push(task);
        },
    }

})

export const { setTasks, moveTask } = kanbanSlice.actions

export default kanbanSlice.reducer