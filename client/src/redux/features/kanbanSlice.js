import { createSlice } from "@reduxjs/toolkit"

// import { taskStatus } from '../../utils/task.utils'

export const kanbanSlice = createSlice({
  name: 'Kanban',
  initialState: {
    pending: [
      // {
      //   "taskId": "0skjdnvsf",
      //   "title": "Bug Fix - Payment Gateway",
      //   "priority": 1,
      //   "taskType": "BUG",
      //   "level": "EXPERT",
      //   "estimatedHours": 5,
      //   "parentTaskId": null,
      //   "assignedTo": ["Chris_Brown7542", "Jane_Smith8792"],
      //   "status": "pending"
      // },
      // {
      //   "taskId": "1sfkbvdfb",
      //   "title": "UI update1",
      //   "priority": 1,
      //   "taskType": "DEV",
      //   "level": "INTERMEDIATE",
      //   "estimatedHours": 5,
      //   "parentTaskId": null,
      //   "assignedTo": ["Chris_Brown7542", "Jane_Smith8792"],
      //   "status": "pending"
      // },
      // {
      //   "taskId": "2advljnsldv",
      //   "title": "UI update2",
      //   "priority": 1,
      //   "taskType": "DEV",
      //   "level": "INTERMEDIATE",
      //   "estimatedHours": 5,
      //   "parentTaskId": null,
      //   "assignedTo": ["Chris_Brown7542", "Jane_Smith8792"],
      //   "status": "pending"
      // }
    ],
    inProgress: [
      // {
      //   "taskId": "3kdvkjsfv",
      //   "title": "UI update3",
      //   "priority": 1,
      //   "taskType": "DEV",
      //   "level": "INTERMEDIATE",
      //   "estimatedHours": 5,
      //   "parentTaskId": null,
      //   "assignedTo": ["Chris_Brown7542", "Jane_Smith8792"],
      //   "status": "in_progress"
      // },
      // {
      //   "taskId": "5advnvsdv",
      //   "title": "UI update4",
      //   "priority": 1,
      //   "taskType": "DEV",
      //   "level": "INTERMEDIATE",
      //   "estimatedHours": 5,
      //   "parentTaskId": null,
      //   "assignedTo": ["Chris_Brown7542", "Jane_Smith8792"],
      //   "status": "in_progress"
      // }
    ],
    completed: [
    // {
    //    "taskId": "6bvksjbv",
    //    "title": "UI update5",
    //    "priority": 1,
    //    "taskType": "DEV",
    //    "level": "INTERMEDIATE",
    //    "estimatedHours": 5,
    //    "parentTaskId": null,
    //    "assignedTo": ["Chris_Brown7542", "Jane_Smith8792"],
    //    "status": "completed"
    // }
    ]
  },
  reducers: {
    setKanbanTasks: (state, action) => {
      // const { status, tasks } = action.payload

      // switch (status) {
      //   case taskStatus.pending:
      //     state.pending = tasks
      //     break;
      //   case taskStatus.inProgress:
      //     state.inProgress = tasks
      //     break;
      //   case taskStatus.completed:
      //     state.completed = tasks
      //     break;
      // }
    },
    moveTask: (state, action) => {
      // const { targetTask, updatedStatus, targetIndex } = action.payload

      // switch (task.currentStatus) {
      //   case taskStatus.pending:
      //     state.pending = state.pending.filter((task) => task.id !== targetTask.id)
      //     break;
      //   case taskStatus.inProgress:
      //     state.inProgress = state.inProgress.filter((task) => task.id !== targetTask.id)
      //     break;
      //   case taskStatus.completed:
      //     state.completed = state.completed.filter((task) => task.id !== targetTask.id)
      //     break;
      // }

      // if (typeof targetIndex === "number" && targetIndex<state[toStatus].length) {
      //   state[toStatus].splice(targetIndex, 0, task)
      // } else {
      //   state[toStatus].push(task)
      // }
      // // state[toStatus].push(task)
    },
    addNewTask:(state,action)=>{
        
    }
  }  
})

export const { 
  setKanbanTasks, 
  moveTask 
} = kanbanSlice.actions

export default kanbanSlice.reducer