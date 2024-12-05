import { createSlice } from "@reduxjs/toolkit";

export const kanbanSlice = createSlice({
    name: 'Kanban',
    initialState: {
        pending: [
            {
                "taskId": "0skjdnvsf",
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
                "taskId": "1sfkbvdfb",
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
                "taskId": "2advljnsldv",
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
                "taskId": "3kdvkjsfv",
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
                "taskId": "5advnvsdv",
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
                "taskId": "6bvksjbv",
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
            const { task, toStatus, targetIndex } = action.payload;
            
            const { currentStatus } = task;
            state[currentStatus] = state[currentStatus].filter((t) => {
                return t.taskId !== task.taskId;
            });
            if (typeof targetIndex === "number" && targetIndex<state[toStatus].length) {
                state[toStatus].splice(targetIndex, 0, task);
            } else {
                state[toStatus].push(task);
            }
            // state[toStatus].push(task);
        },
    }

})

export const { setTasks, moveTask } = kanbanSlice.actions

export default kanbanSlice.reducer