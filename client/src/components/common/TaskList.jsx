import { useEffect } from "react";
import { fetchTaskComments } from "../../utils/task.utils"
import { useDispatch, useSelector } from "react-redux";
import { setupChatSubscription } from "../../utils/websocket.utils";
import { setComments } from "../../redux/features/taskSlice";

const TaskList = ({ filteredTasks,currentTask,setCurrentTask }) => {
    const dispatch = useDispatch()

    const client = useSelector((state) => state.webSocket.client);
    const user = useSelector((state) => state.user.user)

    useEffect(() => {
        if (filteredTasks.length > 0) {
            setCurrentTask(filteredTasks[0]);
            fetchTaskComments(filteredTasks[0].id).then((comments) => {
                dispatch(setComments(comments));
            });
        } else {
            setCurrentTask(null);
        }
    }, [filteredTasks]);
    useEffect(()=>{
       if(currentTask){
           setupChatSubscription(client,dispatch,user.userId,currentTask?.id);
       }
    },[currentTask])
    const handleOnTaskClick = (task) => {
        setCurrentTask(task);
        fetchTaskComments(task.id).then((comments) => {
            // console.log(comments)
            dispatch(setComments(comments));
        });
       
        
    }

    return (
        <div
            style={{
                width: '100vh',
                zIndex: '1000',
            }}
        >
            {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                    <div
                        key={task.id}
                        style={{
                            marginBottom: "15px",
                            backgroundColor: "#fff",
                            padding: "15px",
                            borderRadius: "8px",
                            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                            display: 'flex',
                            flexDirection: 'column',
                            gap: "10px",


                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: 'row',
                                gap: '6%',
                                textAlign: 'center'

                            }}

                            onClick={() => handleOnTaskClick(task)}
                        >
                            <span
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    color: "#333",
                                }}

                            >
                                {task.index}
                            </span>
                            <span
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    color: "#333",
                                }}

                            >
                                {task.name}
                            </span>

                        </div>

                    </div>
                ))
            ) : (
                <p style={{ textAlign: 'center', color: '#888' }}>No tasks found</p>
            )}
        </div>
    )
}
export default TaskList