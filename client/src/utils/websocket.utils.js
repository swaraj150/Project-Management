// import { addDelta, setClient, setConnected, setDeltas, setUpdated } from '../redux/features/webSocketSlice';
// import { Client } from '@stomp/stompjs';
// import { calculateIndex, convertTasksFromServer, convertTasksToServer, findByIndex } from './task.utils';
// import { addComment, replaceTaskInState } from '../redux/features/tasksSlice';

// export const connectWebSocket = (url, token) => (dispatch, getState) => {
//   const stompClient = new Client({
//     brokerURL: url,
//     connectHeaders: {
//       Authorization: `Bearer ${token}`,
//     },
//     debug: (str) => {
//       console.log(str);
//     },
//     onConnect: (frame) => {
//       console.log('WebSocket connected');
//       console.log("connected ", frame)

//     },
//     onStompError: (error) => {
//       console.error('WebSocket error:', error);
//       dispatch(setConnected(false));
//     },

//   });

//   stompClient.activate();
//   dispatch(setClient(stompClient));
//   dispatch(setConnected(true))

// };

// export const disonnectWebSocket = (client) => (dispatch) => {
//   console.log('WebSocket disconnected');
//   client.deactivate();
//   dispatch(setConnected(false))

// };


// export const setupTaskSubscription = (stompClient, isConnected) => (dispatch, getState) => {
//   if (!isConnected) return;
//   stompClient.subscribe('/topic/tasks', (payload) => {
//     try {
//       const data = JSON.parse(payload.body);
//       dispatch(setDeltas([]));
//       console.log('Received: ', data);

//       const tasks = data.map((task) => {
//         const oldTasks = getState().task.tasks;
//         const parentTaskId = task.parentTaskId;
//         let parentId = null;

//         if (parentTaskId) {
//           const { parentIndex } = calculateIndex(parentTaskId, oldTasks);
//           parentId = parentIndex;
//         }

//         const newTask = convertTasksFromServer(task, null, 0, dispatch, parentId);
//         dispatch(replaceTaskInState({ index: newTask.index, newTask: newTask }));
//         return newTask;
//       });

//       dispatch(setUpdated());
//     } catch (error) {
//       console.error('Error parsing payload:', error);
//     }
//   });


// };
// export const setupChatSubscription = (stompClient, dispatch, userId, taskId) => {
//   stompClient.subscribe(`/user/${userId}/topic/chat/${taskId}`, (payload) => {
//     try {
//       const data = JSON.parse(payload.body);
//       dispatch(addComment(data));
//     } catch (error) {
//       console.error("Error parsing payload:", error);
//     }
//   })

// };
// export const publishTasks = (client, content, url) => {
//   console.log("content to publish, ", content)
//   client.publish({
//     destination: url,
//     body: JSON.stringify(content)
//   });
// };



// export const addDeltaAndPublish = (delta, isConnected, client) => (dispatch, getState) => {
//   dispatch(addDelta(delta)); // Dispatch action

//   if (isConnected) {
//     const updatedDeltas = getState().webSocket.deltas; // Access the updated state
//     // console.log("deltas: ",updatedDeltas)
//     // console.log("Updated Deltas:", updatedDeltas);
//     publishTasks(client, convertTasksToServer(updatedDeltas[updatedDeltas.length - 1]), `/app/task.handle`);
//     // Publish to WebSocket here

//   }
// };