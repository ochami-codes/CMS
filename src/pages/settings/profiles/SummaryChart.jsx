import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const SummaryChart = ({ contributions }) => {
  const pieChartData = [
    { name: "Tithes", value: contributions.tithes },
    { name: "Offerings", value: contributions.offerings },
    { name: "Camp Offerings", value: contributions.campOfferings },
    { name: "Church Development", value: contributions.churchDevelopment },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
                                         

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={pieChartData}
        cx={200}
        cy={200}
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {pieChartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default SummaryChart;
