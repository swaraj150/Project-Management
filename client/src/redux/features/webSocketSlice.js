import { createSlice } from "@reduxjs/toolkit";
export const webSocketSlice = createSlice({
    name: "WebSocket",
    initialState: {
        client: null,
        connected: false,
        deltas: [],
        updated:false
    },
    reducers: {
        setClient: (state, action) => {
            state.client = action.payload;
        },
        setConnected: (state, action) => {
            state.connected = action.payload;
        },
        setDeltas: (state, action) => {
            state.deltas = action.payload;
        },
        mergeDeltas: (state, action) => {
            state.deltas = [...new Set([...state.deltas, ...action.payload])]
        },
        addDelta: (state, action) => {
            state.deltas.push(action.payload);
        },
        setUpdated: (state,action)=>{
            const flag=state.updated;
            state.updated=!flag
        }
        
    }
})

export const { setClient, setConnected, setDeltas, addDelta, mergeDeltas, setUpdated } = webSocketSlice.actions;

export default webSocketSlice.reducer;