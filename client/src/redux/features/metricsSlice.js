import { createSlice } from "@reduxjs/toolkit";

export const metricsSlice=createSlice({
    name:"Metrics",
    initialState:{
        taskStatusData:null,
        timeLogData:null
    },
    reducers:{
        setTaskStatusData:(state,action)=>{
            state.taskStatusData=action.payload;
        },
        
        setTimeLogData:(state,action)=>{
            state.timeLogData=action.payload;
        },

    }
})

export const {setTaskStatusData,setTimeLogData}=metricsSlice.actions;

export default metricsSlice.reducer;