‎import {
‎  BarChart,
‎  Bar,
‎  XAxis,
‎  YAxis,
‎  Tooltip,
‎  ResponsiveContainer,
‎} from "recharts";
‎
‎export default function FundGroupChart({ data }) {
‎  return (
‎    <ResponsiveContainer width="100%" height={300}>
‎      <BarChart data={data}>
‎        <XAxis dataKey="group_name" />
‎        <YAxis />
‎        <Tooltip />
‎        <Bar dataKey="total" />
‎      </BarChart>
‎    </ResponsiveContainer>
‎  );
‎}
‎
