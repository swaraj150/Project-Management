import React, { useEffect } from "react";
import KanbanTasks from "../components/common/KanbanTasks";
import { useDispatch, useSelector } from "react-redux";
import { setKanbanTasks } from "../redux/features/kanbanSlice";
import { segregateTasks } from "../utils/task.utils";


const Kanban = () => {
    const tasks = useSelector((state) => state.task.tasks)
    const dispatch = useDispatch();
    const statuses = [
        { label: "Pending", status: "pending" },
        { label: "In Progress", status: "in_progress" },
        { label: "Completed", status: "completed" },
    ];
    useEffect(() => {
        const { pending, completed, in_progress } = segregateTasks(tasks);
        dispatch(setKanbanTasks({ status: 'pending', tasks: pending }))
        dispatch(setKanbanTasks({ status: 'completed', tasks: completed }))
        dispatch(setKanbanTasks({ status: 'in_progress', tasks: in_progress }))
    }, [dispatch, tasks])
    return (
        <section id="kanban">
            {statuses.map(({ label, status }) => (
                <div className="kanban-column" key={status}>
                    <h3>{label}</h3>
                    <KanbanTasks status={status} />
                </div>
            ))}
        </section>
    );
}

export default Kanban;