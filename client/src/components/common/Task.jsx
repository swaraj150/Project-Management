import React, { useState } from 'react';
import { extractDelta, formatDate, formatTime, updateTaskAndFindNested } from '../../utils/task.utils';
import { useDispatch, useSelector } from 'react-redux';
import { addDeltaAndPublish } from '../../utils/websocket.utils';
import EditField from './EditField';
import { setTasks } from '../../redux/features/taskSlice';
import { setUpdated } from '../../redux/features/webSocketSlice';

const Task = ({ isOpen,tasks }) => {
    // console.log(tasks)
    const [task,setTask]=useState(isOpen.task);
    const dispatch = useDispatch();
    const isConnected = useSelector((state) => state.webSocket.connected);
    const client = useSelector((state) => state.webSocket.client);
    const handleEdit = (currentTask, field, value) => {
        setTask({...task,[field]:value})
        let newTask = {};
        let oldTask = {};
        const updatedTasksList = tasks.map((task1) => {
            const { updatedTree, updatedNestedTask, oldNestedTask } = updateTaskAndFindNested(currentTask.id, task1, field, value);

            if (updatedNestedTask) {
                newTask = updatedNestedTask;
                oldTask = oldNestedTask;
            }

            return updatedTree;
        });
        const delta = extractDelta(oldTask, newTask)
        dispatch(setTasks({ tasks: updatedTasksList }));
        dispatch(addDeltaAndPublish(delta, isConnected, client));
        dispatch(setUpdated())

    };

   
    


    return (
        <div className="task-container"
            style={{
                position: 'fixed',
                top: 0,
                right: isOpen.flag ? '0%' : '-100%',
                height: '100%',
                width: '857px',
                backgroundColor: '#fff',
                boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.3)',
                transition: 'right 0.3s ease',
                zIndex: 1000,
                padding: "20px"
            }}

        >
            <div className="task-header">
                <h2 className="task-title">
                    <EditField
                    value={task?.name}
                    onSave={(newValue)=>handleEdit(task,"name",newValue)}
                    />

                </h2>
                {/* <h2 className="task-title">{isOpen.task?.name}</h2> */}
                <p className="task-creator">Creator: Swaraj Andhale, 04/11/2024</p>
            </div>

            <hr />

            <div className="task-progress">
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${task?.progress}%` }}></div>
                </div>
                <span className="progress-percentage">{task?.progress}</span>
                <span className="task-status">{task?.status}</span>
                <span className="task-priority">MEDIUM</span>
                <span className="logged-time">Logged time: 40m</span>
            </div>

            <div className="task-actions">
                <button className="btn-add-assignee">Add assignee</button>
                <button className="btn-attach-files">Attach files</button>
                <button className="btn-add-dependency">Add dependency</button>
                <button className="btn-log-time">Log time</button>
            </div>

            <hr />

            <div className="task-details">
                <div className="task-date">
                    <label>Start date:</label>
                    <div className='task-inputs'>
                        <input type="date" defaultValue={formatDate(task?.start)} />
                        <input type="time" defaultValue={formatTime(task?.start)} />

                    </div>
                </div>
                <div className="task-date">
                    <label>End date:</label>
                    <div className='task-inputs'>
                        <input type="date" defaultValue={formatDate(task?.end)} />
                        <input type="time" defaultValue={formatTime(task?.end)} />
                    </div>

                </div>
                <div className="task-meta">
                    <label>Estimation:</label>
                    <input type="number" defaultValue="0" />
                </div>
                <div className="task-meta">
                    <label>Duration:</label>
                    <input type="number" defaultValue="16" />
                </div>
                <div className="task-deadline">
                    <label>Deadline:</label>
                    <input type="checkbox" />
                </div>
            </div>

            <textarea
                className="task-description"
                placeholder="Add task description"
            ></textarea>

            {/* <div className="comments-section">
        <input
          type="text"
          className="comment-input"
          placeholder="Leave a comment"
        />
      </div> */}
        </div>
    );
};

export default Task;
