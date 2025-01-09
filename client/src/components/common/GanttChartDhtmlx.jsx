import React, { useEffect, useRef } from "react";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";; // Import DHTMLX Gantt styles
import gantt from "dhtmlx-gantt"; // Import Gantt library

const GanttChartDhtmlx = ({ tasks, onTaskUpdated }) => {
  const ganttContainer = useRef(null);

  useEffect(() => {
    // Attach Gantt to the container
    gantt.config.show_grid = false;
    gantt.init(ganttContainer.current);

    // Load tasks into the Gantt chart
    gantt.clearAll(); // Clear previous tasks
    gantt.parse(tasks);

    // Event listener for task updates
    gantt.attachEvent("onAfterTaskUpdate", (id, item) => {
      if (onTaskUpdated) {
        onTaskUpdated(id, item);
      }
    });
    gantt.eachTask(function (task) {
      task.$open = true; // Set the $open property to true for each task
    });

    // Cleanup when component unmounts
    return () => {
      gantt.clearAll();
    };
  }, [tasks, onTaskUpdated]);

  return <div ref={ganttContainer} style={{ width: "100%", height: "500px" }} />;
};

export default GanttChartDhtmlx;
