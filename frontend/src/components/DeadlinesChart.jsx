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
      <div className="custom-tooltip-wrapper">
        <div className="custom-tooltip-content">
          <p className="tooltip-title">{fullTitle}</p>
          <p>Deadline: {deadline}</p>
          <p>Priority: {priority}</p>
        </div>
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
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid stroke="none" />
          <XAxis dataKey="title" stroke="#ccc" tick={{ fontSize: 12 }} />
          <YAxis
            stroke="#ccc"
            tick={{ fontSize: 12 }}
            domain={[0, 3]}
            ticks={[0, 1, 2, 3]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="priority"
            fill="	#a9dfd8"
            barSize={50}
            activeBar={{ fill: "	#a9dfd8", stroke: "none", strokeWidth: 0 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UpcomingDeadlinesChart;
