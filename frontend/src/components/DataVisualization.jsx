import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { fullTitle, deadline, priority } = payload[0].payload;
    return (
      <div className="bg-[#374045] text-white p-2 rounded-md shadow-md text-sm">
        <p className="font-semibold">{fullTitle}</p>
        <p>Deadline: {deadline}</p>
        <p>Priority: {priority}</p>
      </div>
    );
  }
  return null;
};

const UpcomingDeadlinesChart = ({ data }) => {
  const chartData = data.map((task) => ({
    fullTitle: task.title,
    title:
      task.title.length > 10 ? task.title.slice(0, 10) + "..." : task.title,
    deadline: task.deadline,
    priority:
      task.priority.toLowerCase() === "high"
        ? 3
        : task.priority.toLowerCase() === "medium"
        ? 2
        : 1,
  }));

  return (
    <div className="">
      <h2 className="">Upcoming Task Deadlines</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374045" />
          <XAxis dataKey="title" stroke="#ccc" tick={{ fontSize: 12 }} />
          <YAxis
            stroke="#ccc"
            tick={{ fontSize: 12 }}
            domain={[0, 3]}
            ticks={[0, 1, 2, 3]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="priority" fill="#D6792C" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UpcomingDeadlinesChart;
