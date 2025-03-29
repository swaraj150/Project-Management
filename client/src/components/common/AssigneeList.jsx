import React, { useState } from "react";
import { useSelector } from "react-redux";

const AssigneeList = ({ onClose, currentTask }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTeams, setExpandedTeams] = useState({});
  const project = useSelector((state) => state.task.currentProject);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [alreadyAssigned,setAlreadyAssined]=useState([]);
  // const teams = [
  //   { id: "1", name: "Team 1", members: [{ id: "a", name: "Alice" }, { id: "b", name: "Bob" }] },
  //   { id: "2", name: "Team 2", members: [{ id: "c", name: "Charlie" }, { id: "d", name: "Diana" }] },
  // ];

  const toggleTeam = (teamId) => {
    setExpandedTeams((prev) => ({ ...prev, [teamId]: !prev[teamId] }));
  };
  const addMembers = (teamId, username) => {
    setSelectedMembers((p) => ({ ...p, [teamId]: [...(p[teamId]) || [], username] }));

  }
  const handleAdd = () => {
    let assignees=Object.values(selectedMembers).flat();
    setAlreadyAssined(assignees);
    const delta = {
      id: currentTask.id,
      index: currentTask.index,
      assigneeList:assignees
    };
    console.log(delta);
    setSelectedMembers({});

  }
  const filteredTeams = project?.teams.map((team) => ({
    ...team,
    members: [team.teamLead, ...team.developers, ...team.testers].filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) // add their role as label too
    ),
  }));

  return (
    <div
      style={{
        position: 'fixed',
        width: "25%",
        height: "50vh",
        boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.3)",
        padding: "20px",
        overflowY: "auto",
        backgroundColor: "#fff",
        borderRadius: "8px",
        zIndex: '1000',
        transition: 'right 0.3s ease',
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
        <h1 style={{ fontSize: "18px", margin: 0, color: "#333" }}>Add Assignees</h1>
        <button
          className="close-button"
          onClick={onClose}
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

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search for members..."
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

      <div>
        {filteredTeams?.map((team) => (
          <div
            key={team.id}
            style={{
              marginBottom: "15px",
              backgroundColor: "#fff",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => toggleTeam(team.id)}
            >
              <h2 style={{ fontSize: "16px", margin: 0 }}>{team.name}</h2>
              <span style={{ fontSize: "15px", color: "#666" }}>
                {expandedTeams[team.id] ? "−" : "+"}
              </span>
            </div>
            {expandedTeams[team.id] && (
              <ul
                style={{
                  listStyle: "none",
                  paddingLeft: "15px",
                  marginTop: "10px",
                }}
              >
                {team.members.map((member) => (
                  <li
                    key={member.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{ marginRight: "10px" }}
                      onClick={() => addMembers(team.id, member.username)}
                      checked={Object.values(selectedMembers).flat().includes(member.username)}
                      disabled={alreadyAssigned.includes(member.username)?true:false}
                    />
                    <h3 style={{ fontSize: "14px", margin: 0, color: alreadyAssigned.includes(member.username)?"var(--white--200)":"#333" }}>
                      {member.name}
                    </h3>
                  </li>
                ))}

                {team.members.length === 0 && (
                  <li style={{ color: "#999", fontSize: "13px", marginTop: "5px" }}>
                    No members found.
                  </li>
                )}
              </ul>
            )}

          </div>
        ))}
        <button
          style={{
            backgroundColor: 'var(--white--100)',
            color: 'black',
            padding: '2%',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '2%'
          }}
          onClick={handleAdd}

        >Add</button>
      </div>
    </div>
  );
};

export default AssigneeList;
