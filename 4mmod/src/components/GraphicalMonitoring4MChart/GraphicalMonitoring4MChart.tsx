import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
  Line
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
  isAverage?: boolean;
  isTarget?: boolean;
}

const data: DataPoint[] = [
  { name: "April", value: 10 },
  { name: "May", value: 8 },
  { name: "June", value: 6 },
  { name: "July", value: 3, isTarget: true },
  { name: "Avg QTR-1", value: 6.75, isAverage: true },
];

const GraphicalMonitoring4MChart: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full">
      {/* Heading */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600 drop-shadow-md">
          Graphical Monitoring 4M Change
        </h2>
        {/* <p className="text-gray-700 text-lg font-medium">FY 2020 – 2021, QTR-1st</p> */}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 30, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 14, fontFamily: "Poppins", fontWeight: 600 }}
            angle={-15}
            textAnchor="end"
          />
          <YAxis
            tick={{ fontSize: 14, fontFamily: "Poppins", fontWeight: 600 }}
            domain={[0, 12]}
            label={{
              value: "Count",
              angle: -90,
              position: "insideLeft",
              fontSize: 16,
              fontFamily: "Poppins",
            }}
          />
          <Tooltip
            contentStyle={{ fontFamily: "Poppins", fontSize: 14 }}
          />
          {/* Trend Line */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#000"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Bar dataKey="value" barSize={40}>
            <LabelList dataKey="value" position="top" style={{ fontWeight: "bold", fontFamily: "Poppins" }} />
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isAverage ? "#e74c3c" : "#3498db"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Target label bubble */}
      <div className="relative -mt-24 ml-[57%] w-32 text-center">
        <div className="bg-yellow-400 px-2 py-1 rounded font-semibold text-sm shadow-md">
          Target - 3
        </div>
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400 mx-auto" />
      </div>
    </div>
  );
};

export default GraphicalMonitoring4MChart;
