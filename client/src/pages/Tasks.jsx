import React, { useEffect, useState } from 'react'
import Kanban from './Kanban'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GanttChart from './GanttChart';
import { useDispatch, useSelector } from 'react-redux';
import { connectWebSocket, disonnectWebSocket, publishTasks, setupTaskSubscription } from '../utils/websocket.utils';
import Workload from './Workload';

const Tasks = () => {
  const [current, setCurrent] = useState(0);
  const isConnected = useSelector((state) => state.webSocket.connected);
  const client = useSelector((state) => state.webSocket.client);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setupTaskSubscription(client,isConnected))
  },[])



  const taskItems = [
    { name: "Gantt Chart", page: <GanttChart /> },
    {
      name: "Kanban Board",
      page: (
        <DndProvider backend={HTML5Backend}>
          <Kanban />
        </DndProvider>
      ),
    },
    {
      name:'Workload',
      page:<Workload/>
    }
  ]

  return (
    <section id="tasks">
      <nav>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '1rem' }}>
          {taskItems.map((task, index) => (
            <li>
              <button
                onClick={() => setCurrent(index)}
                style={{
                  backgroundColor: current === index ? 'var(--primary--900)' : 'transparent',
                  color: current === index ? 'white' : 'black',
                  padding: '0.5rem 1rem',
                  border: current === index ? 'none' : '1px solid black',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}>
                {task.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {taskItems[current].page}
    </section>
  )
}

export default Tasks