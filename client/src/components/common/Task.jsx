import React, { useEffect, useState } from 'react';
import { createTaskList, extractDelta, formatDate, formatTime, updateDate, updateDependenciesStatus, updateTaskAndFindNested } from '../../utils/task.utils';
import { useDispatch, useSelector } from 'react-redux';
import { addDeltaAndPublish } from '../../utils/websocket.utils';
import EditField from './EditField';
import { setTasks, toggleTaskModal } from '../../redux/features/taskSlice';
import { setUpdated } from '../../redux/features/webSocketSlice';
import AssigneeList from './AssigneeList';
import DependencyList from './DependencyList';

const Task = ({ isOpen, tasks }) => {

    const dispatch = useDispatch();
    const taskModal = useSelector((state) => state.task.taskModal);
    const isConnected = useSelector((state) => state.webSocket.connected);
    const client = useSelector((state) => state.webSocket.client);
    const [task, setTask] = useState(taskModal.task);
    const [showAssigneeList, setShowAssigneeList] = useState(false);
    const [showDependencyList, setShowDependencyList] = useState(false);
    const [taskList, setTaskList] = useState([]);


    useEffect(() => {
        let l1 = [];
        createTaskList(tasks, l1);
        l1 = l1.filter(
            (prevDependency) => !task?.dependencies.some(
                (currentDependency) => currentDependency.id === (prevDependency.id || currentDependency === task.id)
            )
        );
        // console.log(l1);

        setTaskList(l1);


    }, [tasks])

    useEffect(() => {
        setTaskList((p) => {
            return p.filter(
                (prevDependency) => !task?.dependencies.some(
                    (currentDependency) => currentDependency.id === prevDependency.id
                )
            );
        });
    }, [task?.dependencies])

    const handleAddAssignee = () => {
        setShowAssigneeList((p) => !p);
    };

    const onCloseAssignee = () => {
        setShowAssigneeList(false);
    }
    const handleDependencyList = () => {
        setShowDependencyList((p) => !p);
    };
    const onCloseDependencyList = () => {
        setShowDependencyList(false);
    }
    const handleEdit = (currentTask, field, value) => {
        const currentStatus=currentTask.status
        if (currentStatus === 'COMPLETED') {
            console.warn(`Task is already completed. No further updates allowed.`);
            return;
        }
        setTask({ ...currentTask, [field]: value })
        const delta = {
            // id: currentTask.id,
            // index: currentTask.index,
            field: value
        }

        // effect should propagate through subsequent dependencies
        const dependencies_delta = [];
        if (field == 'status') {
            if (value == "PENDING") {
                setTask({ ...task, progress: 0 })
                delta.progress = 0
            }
            else if (value == "COMPLETED") {
                setTask({ ...task, progress: 100 })
                delta.progress = 100
            }

           updateDependenciesStatus(tasks,currentTask.id,value,dependencies_delta)
        }



        const updatedTasksList = tasks.map((task1) => {
            const { updatedTree, updatedNestedTask, oldNestedTask } = updateTaskAndFindNested(currentTask.id, task1, field, value, delta);

            return updatedTree;
        });
        // let delta = extractDelta(oldTask, newTask)

        if (field == 'start') {
            delta.start = updateDate(currentTask.start, value);
        }
        if (field == 'end') {
            delta.end = updateDate(currentTask.end, value);
        }
        delta.id = currentTask.id
        delta.index = currentTask.index
        console.log("delta", delta)
        dispatch(setTasks({ tasks: updatedTasksList }));
        dispatch(addDeltaAndPublish(delta, isConnected, client));
        for(const deltas in dependencies_delta){
            dispatch(addDeltaAndPublish(deltas, isConnected, client));
        }
        dispatch(setUpdated())

    };



    return (
        <div className="task-container"
            style={{
                position: 'fixed',
                top: 0,
                right: taskModal.flag ? '0%' : '-100%',
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
                <button
                    className="close-button"
                    onClick={() => {
                        dispatch(toggleTaskModal({ task: null }))
                    }}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                    }}
                    aria-label="Close"
                >
                    ✖
                </button>
                <h2 className="task-title">
                    <EditField
                        value={task?.name}
                        onSave={(newValue) => handleEdit(task, "name", newValue)}
                    />

                </h2>

                {/* <h2 className="task-title">{isOpen.task?.name}</h2> */}
                <p className="task-creator">Creator: {task.created_by?.name}, {formatDate(task.created_at)}</p>
            </div>

            <hr />


            <div className="task-progress">
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${task?.progress}%` }}></div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={task?.progress}
                        onChange={(e) => handleEdit(task, "progress", Number(e.target.value))}
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer',
                        }}
                    />
                </div>
                <span className="progress-percentage">{task?.progress}%</span>
                <label>
                    Status:
                    <select
                        className="custom-dropdown"
                        value={task?.status}
                        // onChange={()=>handleEdit(task,"status",e.target.value)}
                        onChange={(e) => {
                            setTask({ ...task, status: e.target.value })
                            handleEdit(task, "status", e.target.value)
                        }
                        }
                    >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </label>
                {/* <span className="task-status">{task?.status}</span> */}
                <label
                    style={{
                        marginLeft: "7%"
                    }}
                >
                    Level:
                    <select
                        className="custom-dropdown2"
                        value={task?.level}
                        onChange={() => handleEdit(task, "status", e.target.value)}

                    // onChange={(e)=>setTask({...task,status:e.target.value})}
                    >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="EXPERT">Expert</option>
                    </select>
                </label>
                {/* <span className="task-priority">MEDIUM</span> */}
                <span className="logged-time">Logged time: 40m</span>
            </div>


            <div className="task-actions">
                <button className="btn-add-assignee" onClick={handleAddAssignee}>Add assignee</button>
                <button className="btn-attach-files">Attach files</button>
                <button className="btn-add-dependency" onClick={handleDependencyList}>Add dependency</button>
                <button className="btn-log-time">Log time</button>
            </div>
            {showAssigneeList && <AssigneeList onClose={onCloseAssignee} />}
            {showDependencyList && <DependencyList onClose={onCloseDependencyList} currentTask={{ id: task.id, index: task.index, start: task.start, end: task.end }} taskList={taskList || []} />}
            <hr />

            <div className="task-details">
                <div className="task-date">
                    <label>Start date:</label>
                    <div className='task-inputs'>
                        <input type="date" defaultValue={formatDate(task?.start)}
                            onChange={(e) => setTask({ ...task, ["start"]: e.target.value })}
                            onBlur={(e) => handleEdit(task, "start", e.target.value)}
                        />
                        {/* <input type="time" defaultValue={formatTime(task?.start)} /> */}

                    </div>
                </div>
                <div className="task-date">
                    <label>End date:</label>
                    <div className='task-inputs'>
                        <input type="date" defaultValue={formatDate(task?.end)}
                            onChange={(e) => setTask({ ...task, ["end"]: e.target.value })}
                            onBlur={(e) => handleEdit(task, "end", e.target.value)}

                        />
                        {/* <input type="time" defaultValue={formatTime(task?.end)} /> */}
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
