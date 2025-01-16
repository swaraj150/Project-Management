import { useEffect, useState } from "react";
import TaskList from "../components/common/TaskList";
import Chat from "../components/common/Chat";
import { useDispatch, useSelector } from "react-redux";
import { createTaskList } from "../utils/task.utils";

const ChatSection = () => {
    const projects = useSelector((state) => state.projects.projects);
    const tasks = useSelector((state) => state.task.tasks)
    const [taskList, setTaskList] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);
    useEffect(() => {
        let l1 = []
        createTaskList(tasks, l1)
        setTaskList(l1)
        setCurrentTask(l1[0]);
    }, [tasks])

    // const projects = [
    //     { id: "1", name: "temp2", lastChange: "31/12/2024", status: "No status" },
    //     { id: "2", name: "temp", lastChange: "31/12/2024", status: "No status" },
    // ];
    // const tasks = [
    //     { id: '1', index: "1", name: 'Task 1' },
    //     { id: '2', index: "2", name: 'Task 2' },
    //     { id: '3', index: "3", name: 'Task 3' },
    // ];
    const [currentProject, setCurrentProject] = useState(projects[0]);
    
    const [searchQuery, setSearchQuery] = useState("");
    const filteredTasks = taskList?.filter((task) =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div
            style={{
                marginLeft: '2%'
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <h1 style={{ fontSize: "18px", margin: 0, color: "#333" }}>Communication Hub</h1>
                <button
                    className="close-button"
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
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '2%',
                    marginBottom: "2%"
                }}

            >


                <select
                    style={{
                        width: "16%",
                        height: "37px",
                        textAlign: "center",
                    }}
                    value={currentProject?.title}
                    onChange={(e) => setCurrentProject(e.target.value)}
                >
                    {projects?.map((project) => (
                        <option value={project}>{project.title}</option>
                    ))}
                </select>
                <div style={{ width: '22%' }}>
                    <input
                        type="text"
                        placeholder="Search for tasks"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            fontSize: "14px",
                            backgroundColor: "#fff",
                        }}
                    />
                </div>

            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '2%'
            }}>
                <TaskList filteredTasks={filteredTasks} currentTask={currentTask} setCurrentTask={setCurrentTask} />
                <Chat currentTask={currentTask} />

            </div>
        </div >
    )
}
export default ChatSection