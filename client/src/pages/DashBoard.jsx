import React from 'react'
import ReusablePieChart from '../components/common/ReusablePieChart';
import ReusableBarChart from '../components/common/ReusableBarChart';
import { useSelector } from 'react-redux';



const Dashboard = () => {
  const taskStatusData=useSelector((state)=>state.metrics.taskStatusData);
  const timeLogData=useSelector((state)=>state.metrics.timeLogData);
  const sampleData1 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

  const sampleData2 = [
    { name: "Segment X", value: 500 },
    { name: "Segment Y", value: 200 },
    { name: "Segment Z", value: 300 },
  ];

  const sampleData3 = [
    { name: "Part 1", value: 150 },
    { name: "Part 2", value: 350 },
    { name: "Part 3", value: 250 },
  ];
  const sampleBarData = [
    { category: "Group A", value1: 400, value2: 300 },
    { category: "Group B", value1: 300, value2: 250 },
    { category: "Group C", value1: 200, value2: 150 },
    { category: "Group D", value1: 278, value2: 390 },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: "20px",
        padding: "20px",
      }}
    >
      <div
        style={{
          flex: "1 1 300px", // Flexible width: minimum 300px, grows as needed
          maxWidth: "400px", // Limits maximum width
          background: "#fff",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>Pie Chart 1</h2>
        <ReusablePieChart
          data={taskStatusData}
          dataKey="value"
          nameKey="name"
          colors={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]}
          width={300}
          height={300}
        />
      </div>

      <div
        style={{
          flex: "1 1 300px",
          maxWidth: "400px",
          background: "#fff",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>Pie Chart 2</h2>
        <ReusablePieChart
          data={sampleData2}
          dataKey="value"
          nameKey="name"
          colors={["#FF8042", "#0088FE", "#00C49F"]}
          width={300}
          height={300}
        />
      </div>

      <div
        style={{
          flex: "1 1 calc(50% - 20px)",
          maxWidth: "514px",
          background: "#fff",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>Bar Chart Example</h2>
        <ReusableBarChart
          data={timeLogData}
          xKey="category"
          barDataKeys={"value"}
          colors={["#8884d8", "#82ca9d"]}
          width={500}
          height={300}
        />
      </div>
      {/* Metric Card 4 */} 
      <div
      // item spans the full row
        style={{
          flex: "1 1 100%",
          // maxWidth: "400px",
          background: "#fff",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          position: "relative",
          
          
        }}
      >
        <h2
        style={{
          position: "absolute",
          top: "10px", // Adjust as needed
          
          marginRight: '22%', // Removes default margin for better positioning
        }}
        
        >Pie Chart 4</h2>
        <ReusablePieChart
          data={sampleData3}
          dataKey="value"
          nameKey="name"
          colors={["#36A2EB", "#FF6384", "#FFCE56"]}
          width={300}
          height={300}
        />
      </div>
    </div>
  );
};

export default Dashboard;
