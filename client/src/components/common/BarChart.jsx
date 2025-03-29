import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const BarChart = ({ data, xKey, barDataKeys, colors, width, height }) => {
  return (
    <ResponsiveContainer width={width || "100%"} height={height || 300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {barDataKeys.map((key, index) => (
          <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
