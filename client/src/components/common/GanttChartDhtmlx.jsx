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
    // const beforeUpdateHandlerId = gantt.attachEvent("onBeforeTaskUpdate", (id, new_task) => {
    //   const fieldsToCheck = ["start_date", "end_date","text","progress"];
    //   const originalTask = gantt.getTask(id);
    //   const updatedFields = {};

    //   fieldsToCheck.forEach((field) => {
    //     if (new_task[field] !== originalTask[field]) {

    //       updatedFields[field] = new_task[field];

    //     }
    //   });
    //   setUpdatedTasks(updatedFields);
    // })



    const updateHandlerId = gantt.attachEvent("onAfterTaskUpdate", (id, item) => {
      // if (onTaskUpdated) {
      //   onTaskUpdated(id, item);
      // }
      if (onTaskUpdated) {

        onTaskUpdated(id, item);

      }
    });

    gantt.eachTask(function (task) {
      task.$open = true;
    });


    return () => {
      gantt.detachEvent(updateHandlerId)
      // gantt.detachEvent(beforeUpdateHandlerId)
      gantt.clearAll();
    };
  }, [tasks, onTaskUpdated]);

  return <div ref={ganttContainer} style={{ width: "100%", height: "500px" }} />;
};

export default GanttChartDhtmlx;
