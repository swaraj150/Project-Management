import { addDelta, setClient, setConnected } from '../redux/features/webSocketSlice';
import { Client } from '@stomp/stompjs';
import { convertTasksFromServer, convertTasksToServer, findClientId, mergeTasks, traverseTask } from './task.utils';
import { incrementPointer, replaceTaskInState, setTasks } from '../redux/features/taskSlice';

export const connectWebSocket = (url,token,oldTasks,map,currentPointer) => (dispatch) => {
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
          console.log('recieved: ',data);
          // only sending modified tasks from server
          const tasks = data.map((task) => {
            const clientId=map[task.id]||null;
            if(clientId==null){
              // newly created parent Task
              dispatch(incrementPointer());
              return convertTasksFromServer(task,currentPointer+1,0,dispatch)

            }
            task['clientTaskId']=clientId;
            const newTask=convertTasksFromServer(task,null,0,null)
            dispatch(replaceTaskInState({index:clientId,newTask:newTask}));
            return newTask;

          })
          console.log('tasks: ',tasks)
          // const merged = mergeTasks(tasks, oldTasks)
          // console.log(merged);
          // dispatch(setTasks({ tasks: merged }))

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