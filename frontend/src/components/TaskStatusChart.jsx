import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div className="custom-tooltip-wrapper">
        <div className="custom-tooltip-content">
          <p className="tooltip-title">{name} Tasks</p>
          <p>Total: {value}</p>
        </div>
      </div>
    );
  }
  return null;
};

const TaskStatusChart = ({ statusCounts }) => {
  const chartData = [
    {
      name: "Pending",
      value: statusCounts?.pending || 0,
      color: "#FFC107",
    },
    {
      name: "In Progress",
      value: statusCounts?.inProgress || 0,
      color: "#17A2B8",
    },
    {
      name: "Completed",
      value: statusCounts?.completed || 0,
      color: "#28A745",
    },
  ];

  return (
    <div className="">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid stroke="none" />
          <XAxis dataKey="name" stroke="#ccc" tick={{ fontSize: 12 }} />
          <YAxis stroke="#ccc" tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" barSize={50} isAnimationActive={true}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskStatusChart;
