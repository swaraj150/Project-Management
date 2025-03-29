import React, { useEffect, useRef, useState } from "react";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";; // Import DHTMLX Gantt styles
import gantt from "dhtmlx-gantt"; // Import Gantt library

const GanttChartDhtmlx = ({ tasks, onTaskUpdated,validateLink,handleAddLink}) => {
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
    
    const createDependencyId=gantt.attachEvent("onLinkCreated",(link)=>{
      if(!validateLink(link)) return false;
      console.log("dependency created",link)
      return true;
      
    })
    const addDependencyId=gantt.attachEvent("onAfterLinkAdd",(id,link)=>{
      console.log("dependency added",id)
      handleAddLink(link)
    })

    gantt.eachTask(function (task) {
      task.$open = true;
    });


    return () => {
      gantt.detachEvent(updateHandlerId)
      gantt.detachEvent(createDependencyId)
      gantt.clearAll();
    };
  }, [tasks, onTaskUpdated]);

  return <div ref={ganttContainer} style={{ width: "100%", height: "500px" }} />;
};

export default GanttChartDhtmlx;
