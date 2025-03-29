import React, { useEffect, useRef, useState } from "react";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";; // Import DHTMLX Gantt styles
import gantt from "dhtmlx-gantt"; // Import Gantt library

const GanttChartDhtmlx = ({ tasks, onTaskUpdated }) => {
  const ganttContainer = useRef(null);
  useEffect(() => {

    gantt.config.show_grid = false;
    gantt.config.date_format = "%Y-%m-%d %H:%i";
    

    gantt.init(ganttContainer.current);


    gantt.clearAll();
    gantt.parse(tasks);
    gantt.config.auto_scheduling = false;
  

    const updateHandlerId = gantt.attachEvent("onAfterTaskUpdate", (id, item) => {
      
      if (onTaskUpdated) {

        onTaskUpdated(id, item);

      }
    });

    gantt.eachTask(function (task) {
      task.$open = true;
    });


    return () => {
      gantt.detachEvent(updateHandlerId)
      gantt.clearAll();
    };
  }, [tasks, onTaskUpdated]);

  return <div ref={ganttContainer} style={{ width: "100%", height: "500px" }} />;
};

export default GanttChartDhtmlx;
