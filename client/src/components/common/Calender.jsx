import React, { useEffect, useState } from "react";

const Calendar = ({ members }) => {
  const months = [
    ["January", 31],
    ["February", 28],
    ["March", 31],
    ["April", 30],
    ["May", 31],
    ["June", 30],
    ["July", 31],
    ["August", 31],
    ["September", 30],
    ["October", 31],
    ["November", 30],
    ["December", 31],
  ];
  const today = new Date();
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [date, setDate] = useState(today.getDate());
  const [year, setYear] = useState(today.getFullYear());
  
  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };
  const daysInMonth =
    monthIndex === 1 && isLeapYear(year) ? 29 : months[monthIndex][1];
  //   const [animationStyle, setAnimationStyle] = useState({}); // Dynamic inline styles for animation
  
  const changeMonth = (direction) => {
    // const animationDirection = direction === "forward" ? "100%" : "-100%";
    
    // setAnimationStyle({
      //   transform: `translateX(${animationDirection})`,
    //   opacity: 0,
    //   transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
    // });
    let month=monthIndex,currentYear=year;
    if (direction === "forward") {
      if (monthIndex === 11) {

        setMonthIndex(0);
        month=0;
        currentYear=year+1
        setYear((prevYear) => prevYear + 1);
      } else {
        month=monthIndex+1;
        setMonthIndex((prevIndex) => prevIndex + 1);
      }
    } else if (direction === "backward") {
      if (monthIndex === 0) {
        setMonthIndex(11);
        month=11;
        currentYear=year-1
        setYear((prevYear) => prevYear - 1);
      } else {
        month=monthIndex-1;
        setMonthIndex((prevIndex) => prevIndex - 1);
      }
    }
    if (month != today.getMonth() || currentYear != today.getFullYear()) {
      setDate(-1)
    }
    else {
      setDate(today.getDate())
    }
    // setTimeout(() => {
      
      //   setAnimationStyle({
    //     transform: "translateX(0)",
    //     opacity: 1,
    //     transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
    //   });
    // }, 300);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2%", marginLeft: '2%' }}>
      <div style={{ width: '100%' }}>
        <button onClick={() => changeMonth("backward")}>{"<"}</button>
        <span style={{ margin: "0 10px" }}>
          {months[monthIndex][0]} {year}
        </span>
        <button onClick={() => changeMonth("forward")}>{">"}</button>
      </div>
      <div
        style={{
          display: "grid",
          width: "100%",
          height: "5vh",
          gridTemplateColumns: `repeat(${months[monthIndex][1]}, 1fr)`,
          gridTemplateRows: `auto repeat(${members + 1},1fr)`,
        }}
      >
        {[...Array(daysInMonth)].map((_, index) => (
          <div
            key={`row1-${index}`}
            style={{
              border: "1px solid black",
              textAlign: "center",
              lineHeight: "2rem",
                  width:'4vh',
                  backgroundColor: index === date - 1 ? "var(--white--100)" : "#fff",
            }}
          >
            {index>=9?index + 1:("0"+""+(index+1))}
          </div>
        ))}
        {/* {[...Array(months[monthIndex][1])].map((_, index) => (
          <div
            key={`row2-${index}`}
            style={{
              border: "1px solid black",
              textAlign: "center",
              lineHeight: "2rem",
              backgroundColor: index === date - 1 ? "var(--white--100)" : "#fff",
                height:'6vh'
            }}
          >
          {0}
          </div>
        ))} */}

     
        {Array.from({ length: months[monthIndex][1] }).map((_, repeatIndex) => (
          
          
          <div key={`repeat-${repeatIndex}`} style={{ display: "flex", flexDirection: "column" }}>
            {Array.from({ length: members }).map((_, index) => (
              <>
               {/* <div
               key={`row2-${repeatIndex}-${0}`}
               style={{
                border: "1px solid black",
                textAlign: "center",
                 lineHeight: "2rem",
                 height: '3vh',
                 borderLeft:index==0?'1px solid black':'none',
                 borderRight:index==length?'1px solid black':'none',
                 backgroundColor: "transparent",
                 }}
                 >
                 
                 </div> */}
              <div
                key={`row2-${repeatIndex}-${index}`}
                style={{
                  border: "1px solid black",
                  textAlign: "center",
                  lineHeight: "2.5rem",
                  height:'6vh'
                  
                }}
              >
                {0}
              </div>
              
             </>
            ))}
            
          </div>
        ))}

      </div>
    </div>
  );
};

export default Calendar;

// import React, { useEffect, useState } from "react";

// const Calendar = () => {
//   const months = [
//     ["January", 31],
//     ["February", 28],
//     ["March", 31],
//     ["April", 30],
//     ["May", 31],
//     ["June", 30],
//     ["July", 31],
//     ["August", 31],
//     ["September", 30],
//     ["October", 31],
//     ["November", 30],
//     ["December", 31],
//   ];
//   const today = new Date();
//   const [monthIndex, setMonthIndex] = useState(today.getMonth());
//   const [date, setDate] = useState(today.getDate());
//   const [year, setYear] = useState(today.getFullYear());

//   const changeMonth = (direction) => {
//     if (monthIndex != today.getMonth() || year != today.getFullYear()) {
//       setDate(null)
//     }
//     else {
//       setDate(today.getDate())
//     }
//     // setAnimationStyle({
//     //   transform: `translateX(${animationDirection})`,
//     //   opacity: 0,
//     //   transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
//     // });

//     if (direction === "forward") {
//       if (monthIndex === 11) {
//         setMonthIndex(0);
//         setYear((prevYear) => prevYear + 1);
//       } else {
//         setMonthIndex((prevIndex) => prevIndex + 1);
//       }
//     } else if (direction === "backward") {
//       if (monthIndex === 0) {
//         setMonthIndex(11);
//         setYear((prevYear) => prevYear - 1);
//       } else {
//         setMonthIndex((prevIndex) => prevIndex - 1);
//       }
//     }
//     // setTimeout(() => {

//     //   setAnimationStyle({
//     //     transform: "translateX(0)",
//     //     opacity: 1,
//     //     transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
//     //   });
//     // }, 300);
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "2%", marginLeft: '2%' }}>
//       <div style={{ width: '100%' }}>
//         <button onClick={() => changeMonth("backward")}>{"<"}</button>
//         <span style={{ margin: "0 10px" }}>
//           {months[monthIndex][0]} {year}
//         </span>
//         <button onClick={() => changeMonth("forward")}>{">"}</button>
//       </div>
//       <div
//         style={{
//           display: "grid",
//           width: "100%",
//           height: "5vh",
//           gridTemplateColumns: `repeat(${months[monthIndex][1]}, 1fr)`,
//           gridTemplateRows: `auto 1fr,1fr`,
//         }}
//       >
//         {[...Array(months[monthIndex][1])].map((_, index) => (
//           <div
//             key={`row1-${index}`}
//             style={{
//               border: "1px solid black",
//               textAlign: "center",
//               lineHeight: "2rem",
//               width:'4vh',
//               backgroundColor: index === date - 1 ? "var(--white--100)" : "#fff",
//             }}
//           >
//             {index>=9?index + 1:("0"+""+(index+1))}
//           </div>
//         ))}
//         {[...Array(months[monthIndex][1])].map((_, index) => (
//           <div
//             key={`row2-${index}`}
//             style={{
//               border: "1px solid black",
//               textAlign: "center",
//               lineHeight: "2rem",
//               backgroundColor: index === date - 1 ? "var(--white--100)" : "#fff",
//               height:'6vh'
//             }}
//           >
//             {0}
//           </div>
//         ))}

//       </div>
//     </div>
//   );
// };

// export default Calendar;