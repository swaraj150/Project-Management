import React from 'react';

const Task = (isOpen) => {
    console.log("opened"+isOpen)
    return (
        <div className="task-container" 
        style={{
            position: 'fixed',
            top: 0,
            right: isOpen ? '0%' : '-100%',
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
                <h2 className="task-title">Task 1</h2>
                <p className="task-creator">Creator: Swaraj Andhale, 04/11/2024</p>
            </div>

            <hr />

            <div className="task-progress">
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: '60%' }}></div>
                </div>
                <span className="progress-percentage">40%</span>
                <span className="task-status">IN PROGRESS</span>
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
                    <input type='date' defaultValue="2024-11-05" />
                </div>
                <div className="task-date">
                    <label>End date:</label>
                    <input type="date" defaultValue="2024-11-06" />
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
