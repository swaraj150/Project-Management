import { useDispatch, useSelector } from "react-redux"
import { setTasks, toggleProjectTaskModal } from "../../redux/features/taskSlice";
import { fetchTasksByProject } from "../../utils/task.utils";
import { setUpdated } from "../../redux/features/webSocketSlice";


const ProjectTasks = () => {
  const projectTaskModal=useSelector((state)=>state.task.projectTaskModal);
  const projects=useSelector((state)=>state.projects.projects);
  // const projects = [
  //   { id:"1",name: "temp2", lastChange: "31/12/2024", status: "No status" },
  //   { id:"2",name: "temp", lastChange: "31/12/2024", status: "No status" },
  // ];
  const dispatch=useDispatch();
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: projectTaskModal ? '0%' : '-100%',
      height: '100%',
      width: '457px',
      backgroundColor: '#fff',
      boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.3)',
      transition: 'right 0.3s ease',
      // animation: 'animate1 0.5s ease-in-out',
      zIndex: 1000,
      padding: "20px"
    }}>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "24px", margin: 0 }}>All projects</h1>
        <button
          className="close-button"
          onClick={() => {
            dispatch(toggleProjectTaskModal())
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
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        />
      </div>

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
        }}
      >
        {/* Table Header */}
        <thead>
          <tr>
            <th style={headerStyle}>Last change</th>
            <th style={headerStyle}>Name</th>
            <th style={headerStyle}>Overdue</th>
            <th style={headerStyle}>Progress</th>
            {/* <th style={headerStyle}>Unassigned</th> */}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td style={cellStyle}>31/12/24</td>
              <td style={cellStyle}
              onClick={()=>{
                fetchTasksByProject(project.id,dispatch,project)
                
                // dispatch(setUpdated())
              }}

              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{project.title}</span>

                </div>
              </td>
              <td style={cellStyle}>--</td>
              <td style={cellStyle}>
                <select
                  style={{
                    padding: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    backgroundColor: "#f8f8f8",
                  }}
                >
                  <option>{project.completionStatus}</option>
                </select>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles for table header and cell
const headerStyle = {
  textAlign: "center",
  padding: "10px",
  borderTop: "1px solid #ccc",
  borderBottom: "1px solid #ccc",
  fontWeight: "bold",
};

const cellStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  textAlign: "center"
};


export default ProjectTasks