import { addDelta, setClient, setConnected } from '../redux/features/webSocketSlice';
import { Client } from '@stomp/stompjs';
import { convertTasksFromServer, convertTasksToServer, findClientId, mergeTasks } from './task.utils';
import { setTasks } from '../redux/features/ganttSlice';

export const connectWebSocket = (url, token,oldTasks) => (dispatch) => {
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
            const clientId=findClientId(task.id,oldTasks);
            task['clientTaskId']=clientId;
            return convertTasksFromServer(task, task.clientTaskId)
          })
          console.log('tasks: ',tasks)
          const merged = mergeTasks(tasks, oldTasks)
          // console.log(merged);
          dispatch(setTasks({ tasks: merged }))

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
    // console.log("Updated Deltas:", updatedDeltas);
    publishTasks(client, convertTasksToServer(updatedDeltas[updatedDeltas.length - 1]), `/app/task.handle`);
    // Publish to WebSocket here

  }
};