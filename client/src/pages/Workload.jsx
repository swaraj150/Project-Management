import Calendar from "../components/common/Calender"
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"

const Workload = () => {
  const currentProject = useSelector((state) => state.task.currentProject);
  const [members, setMembers] = useState(null);
  // const [showWorkload,setshowWorkload]=useState(null);
  useEffect(() => {
    if (currentProject) {
      let members = currentProject.teams.map((team) => {
        return [...team.developers, ...team.testers, team.teamLead]
      })
      

      // console.log(members);
      const arr=[...members[0],currentProject.projectManager];
      setMembers(arr);
      // let l=[]
      // members[0].forEach((_,index) => {
      //   l[index]=false;
      // });
      // setshowWorkload(l);
      
    }
  }, [currentProject])
  const handleOnmemberClick = (index) => {
    setshowWorkload((prev) => 
      prev.map((value, i) => (i === index ? !value : value))
    );
  };
  

  return (

    <div
    style={{
      display:'flex',
      flexDirection:'row'

    }}
    
    >
      <div
        style={{
          width: '40vh',
          zIndex: '1000',
          marginBottom:'2%',
          marginTop: '6.7%',
          marginLeft:'2%'
        }}
      >
        {members?.length > 0 ? (
          members?.map((member,index) => (
            <div
              key={member.id}
              style={{
                // marginBottom: "15px",
                backgroundColor: "#fff",
                padding: "10px",
                // borderRadius: "8px",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                display: 'flex',
                flexDirection: 'column',
                border:'1px solid black',
                // gap: "10px",
                height:'6vh'


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

                onClick={() => handleOnmemberClick(index)}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#333",
                  }}

                >
                  {index+1}
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#333",
                  }}

                >
                  {member.name}
                </span>

              </div>
              {/* {showWorkload && showWorkload[index] && <Calendar/>} */}
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#888' }}>No members found</p>
        )}
      </div>
      <Calendar members={members?members.length:0}/>
    </div>
  )
}
export default Workload