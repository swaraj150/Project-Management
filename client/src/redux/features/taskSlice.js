import { createSlice } from "@reduxjs/toolkit";
import { replaceTask } from "../../utils/task.utils";
export const taskSlice = createSlice({
    name: 'Task',
    initialState: {
        tasks: [
            //     {
            //         id: "1",
            //         index:"1",
            //         name: "Design Prototype",
            //         start: new Date(2024, 11, 1),
            //         end: new Date(2024, 11, 5),
            //         progress: 60,
            //         dependencies: [
            //         
            //         ],
            //         status:"in_progress",
            //         priority:1,
                    
            //    },
            //     {
            //         id: "2",
            //         index:"2",
            //         name: "Development",
            //         start: new Date(2024, 11, 6),
            //         end: new Date(2024, 11, 15),
            //         progress: 40,
            //         dependencies:[],
            //         status:"pending",
            //         priority:1
                // },
        ], 
        taskMap: {
            
        },
        taskPointer: 0,
        taskModal:{flag:false,task:null},
        projectTaskModal:false,
        currentProject:null,
        comments:[]
    },
    reducers: {
        
        addTask: (state, action) => {
            const { task } = action.payload;
            state.tasks.push(task);
        },
        setTasks: (state, action) => {
            const { tasks } = action.payload;
            state.tasks = tasks;
        },
        putId: (state, action) => {
            const { id, index } = action.payload;
            state.taskMap[id] = index;
        },
        incrementPointer: (state, action) => {
            state.taskPointer++;
        },
        replaceTaskInState:(state, action) =>{
            const { index, newTask } = action.payload;
            state.tasks = replaceTask(state.tasks, index, newTask);
        },
        toggleTaskModal:(state,action)=>{
            const {task}=action.payload;
            const flag=state.taskModal.flag;
            state.taskModal.flag=!flag;
            state.taskModal.task=flag? null : task;
        },
        toggleProjectTaskModal:(state,action)=>{
            const flag=state.projectTaskModal;
            state.projectTaskModal=!flag;
        },
        setCurrentProject:(state,action)=>{
            state.currentProject=action.payload;
        },
        setComments:(state,action)=>{
            state.comments=action.payload;
        },
        addComment:(state,action)=>{
            state.comments=[...state.comments,action.payload];
        }



    }
});

export const {  addTask, setTasks, putId, incrementPointer,replaceTaskInState,toggleTaskModal,toggleProjectTaskModal,setCurrentProject,setComments,addComment } = taskSlice.actions;

export default taskSlice.reducer