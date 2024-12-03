import React from "react";
import KanbanTasks from "../components/common/KanbanTasks";


const Kanban = () => {

    const statuses = [
        { label: "Pending", status: "pending" },
        { label: "In Progress", status: "in_progress" },
        { label: "Completed", status: "completed" },
    ];
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