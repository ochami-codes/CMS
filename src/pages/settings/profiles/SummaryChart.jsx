import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(value);

const SummaryChart = ({ contributions }) => {
  const pieChartData = [
    { name: "Tithes", value: contributions.tithes },
    { name: "Offerings", value: contributions.offerings },
    { name: "Camp Offerings", value: contributions.campOfferings },
    { name: "Church Development", value: contributions.churchDevelopment },
  ];

  const hasData = pieChartData.some((item) => item.value > 0);

  return (
    <div className="card">
      <h4 className="font-semibold mb-3">Contributions Breakdown</h4>

      {!hasData ? (
        <p className="text-gray-500 text-center mt-4">
          No contributions recorded yet.
        </p>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                isAnimationActive
                animationDuration={800}
                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              >
                {pieChartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SummaryChart;
