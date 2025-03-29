import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LuGanttChartSquare } from 'react-icons/lu'
import { MdOutlineViewKanban } from 'react-icons/md'

import tasksApi from '../api/modules/tasks.api'

import Menu from '../components/common/Menu'
import GanttChart from '../components/common/GanttChart'
import KanbanBoard from '../components/common/KanbanBoard'

import { setTasks } from '../redux/features/tasksSlice'

import { extendTask } from '../utils/task.utils'

const Tasks = () => {
  const dispatch = useDispatch

  const { collapsed } = useSelector((state) => state.menu)

  const [active, setActive] = useState(0)
  const [extendedTasks, setExtendedTasks] = useState({ data: [], links: [] })

  useEffect(() => {
    const fetchTasks = async () => {
      const { res, err } = await tasksApi.fetch()
      if (res) {
        dispatch(setTasks(res.tasks))
        setExtendedTasks([...res.tasks.map((task) => extendTask(task))])
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }

    fetchTasks()
  }, [])

  const addTask = (task) => {
    setTasks((prev) => ({
      ...prev,
      data: [...prev.data, task],
    }))
  }

  const updateTask = ({ taskId, updatedTask }) => {
    setTasks((prev) => ({
      ...prev,
      data: prev.data.map((task) => (task.id === taskId ? updatedTask : task)),
    }))
  }

  return (
    <section id="tasks">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        <div className="task-options">
          <button 
            className={`pointer ${active === 0 ? 'dark-btn' : ''}`}
            onClick={() => setActive(0)}
          >
            <LuGanttChartSquare />
            <p>Gantt Chart</p>
          </button>
          <button 
            className={`pointer ${active === 1 ? 'dark-btn' : ''}`}
            onClick={() => setActive(1)}
          >
            <MdOutlineViewKanban />
            <p>Kanban Board</p>
          </button>
        </div>
        <div className="task-container">
          {active === 0 ? <GanttChart tasks={extendedTasks} addTask={addTask} updateTask={updateTask} /> : <KanbanBoard tasks={extendedTasks} updateTask={updateTask} />}
        </div>
      </section>
    </section>
  )
}

export default Tasks