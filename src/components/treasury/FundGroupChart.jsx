import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function FundGroupChart({ data, title = "Fund Groups Overview" }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="group_name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#16a34a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
