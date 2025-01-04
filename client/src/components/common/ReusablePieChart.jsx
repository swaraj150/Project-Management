import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Default colors

/**
 * Reusable PieChart Component
 * @param {Array} data - Array of data objects for the pie chart.
 * @param {string} dataKey - The key to access the value in data objects.
 * @param {string} nameKey - The key to access the name in data objects.
 * @param {Array} colors - Optional array of colors for the chart segments.
 * @param {number} width - Width of the pie chart.
 * @param {number} height - Height of the pie chart.
 */
const ReusablePieChart = (
    {
        data,
        dataKey,
        nameKey,
        colors = COLORS,
        width = 400,
        height = 400,
    }) => {
    return (
        <PieChart width={width} height={height}>
            <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
}
export default ReusablePieChart