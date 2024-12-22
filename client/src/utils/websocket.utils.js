import { addDelta, setClient, setConnected, setDeltas, setUpdated } from '../redux/features/webSocketSlice';
import { Client } from '@stomp/stompjs';
import { calculateIndex, convertTasksFromServer, convertTasksToServer, findByIndex } from './task.utils';
import { replaceTaskInState } from '../redux/features/taskSlice';

export const connectWebSocket = (url,token) => (dispatch,getState) => {
  const stompClient = new Client({
    brokerURL: url,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (str) => {
      console.log(str); // Optional: Debug logging
    },
    onConnect: (frame) => {
      console.log('WebSocket connected');
      console.log("connected ", frame)
      stompClient.subscribe('/topic/tasks', (payload) => {
        try {
          const data = JSON.parse(payload.body);
          dispatch(setDeltas([]));
          console.log('recieved: ',data);
          // only sending modified tasks from server
          const tasks = data.map((task) => {
            const oldTasks=getState().task.tasks;
            const map=getState().task.taskMap;
            // const clientId=map[task.id]||null;
            // if(clientId==null){
            //   //main source of bug is this
            //   // when newly created, this code block isnt updating redux state
            //   // add a logic to find client TaskId and then use setTasks


            //   // if newly created parent task? add it to the end
            //   if(task.parentTaskId===null){
            //     const size=oldTasks?.length;
            //     const parentTask=convertTasksFromServer(task,size,0,dispatch)
            //     dispatch(replaceTaskInState({index:parentTask.index,newTask:parentTask}));
            //     return parentTask;
            //   }

            //   // we currently cant calculate child's index
            //   // the dependencies are already present
            //   const parentTaskId=task.parentTaskId;
            //   const {index}=calculateIndex(parentTaskId,oldTasks);
            //   task['clientTaskId']=index;
            //   const newChildTask=convertTasksFromServer(task,null,0,dispatch);
            //   dispatch(replaceTaskInState({index:index,newTask:newChildTask}))
            //   return task;
            // }
            // task['clientTaskId']=clientId;
            const parentTaskId=task.parentTaskId;
            let parentId=null;
            if(parentTaskId){
              const {parentIndex}=calculateIndex(parentTaskId,oldTasks);
              parentId=parentIndex
            }
            const newTask=convertTasksFromServer(task,null,0,dispatch,parentId)
            dispatch(replaceTaskInState({index:newTask.index,newTask:newTask})); // issue could be here about {a}
            return newTask;
          })
          dispatch(setUpdated());
          console.log('tasks: ',tasks) //{a} here updated title fields are showing up
        } catch (error) {
          console.error("Error parsing payload:", error);
        }
      })
    },
    onStompError: (error) => {
      console.error('WebSocket error:', error);
      dispatch(setConnected(false));
    },

  });

  stompClient.activate();
  dispatch(setClient(stompClient));
  dispatch(setConnected(true))
};

export const disonnectWebSocket = (client) => (dispatch) => {
  console.log('WebSocket disconnected');
  client.deactivate();
  dispatch(setConnected(false))

};


// export const subscribe = (client, url, oldTasks) => (dispatch) => {
//   \
// }

export const publishTasks = (client, content, url) => {
  console.log("content to publish, ", content)
  client.publish({
    destination: url,
    body: JSON.stringify(content)
  });
};

export const addDeltaAndPublish = (delta, isConnected, client) => (dispatch, getState) => {
  dispatch(addDelta(delta)); // Dispatch action

  if (isConnected) {
    const updatedDeltas = getState().webSocket.deltas; // Access the updated state
    console.log("deltas: ",updatedDeltas)
    // console.log("Updated Deltas:", updatedDeltas);
    publishTasks(client, convertTasksToServer(updatedDeltas[updatedDeltas.length - 1]), `/app/task.handle`);
    // Publish to WebSocket here

  }
};