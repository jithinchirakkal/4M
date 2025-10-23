// QuarterlyMonitoringChart.tsx

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
  Line,
  ReferenceLine,
} from "recharts";

// EXPORTED for use in DashboardView.tsx
export interface DataPoint {
  name: string;
  value: number;
  isAverage?: boolean;
  isTarget?: boolean;
}

interface QuarterlyMonitoringChartProps {
  data: DataPoint[];
  title: string;
  subtitle: string;
  targetValue: number;
  yAxisLabel: string;
  barColor: string;
  averageColor: string;
  trendLineColor: string;
}

const QuarterlyMonitoringChart: React.FC<QuarterlyMonitoringChartProps> = ({
  data,
  title,
  subtitle,
  targetValue,
  yAxisLabel,
  barColor,
  averageColor,
  trendLineColor,
}) => {
  // Find the max domain for Y-axis for better scaling
  const maxDataValue = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;
  const maxDomain = Math.max(maxDataValue, targetValue) * 1.2 || 12;
  
  // Use a dynamic ID for the gradient based on the color
  const BarGradientId = `barGradient-${barColor.replace('#', '')}`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M16 8l2-2m0 0l-2-2m2 2h-4m-3.5 10l-2 2m0 0l2 2m-2-2h4M7 13a3 3 0 00-3 3v1a2 2 0 002 2h2m-5-8a3 3 0 013-3h1m4 0a3 3 0 003-3v-1a2 2 0 00-2-2h-2m5 8a3 3 0 01-3 3h-1m-4 0a3 3 0 00-3-3v-1a2 2 0 002-2h2" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={data}
          margin={{ top: 30, right: 30, left: 20, bottom: 50 }}
        >
          {/* Define Bar Gradient */}
          <defs>
            <linearGradient id={BarGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={barColor} stopOpacity={0.9}/>
              {/* Darker shade at 100% for better 3D effect */}
              <stop offset="100%" stopColor={barColor} stopOpacity={0.6}/> 
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }}
            angle={-15}
            textAnchor="end"
            height={60}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6B7280' }}
            domain={[0, Math.ceil(maxDomain)]}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              fontSize: 14,
              fill: '#4B5563',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              fontSize: '14px',
            }}
            cursor={{ fill: 'rgba(52, 152, 219, 0.1)' }}
            // Custom formatter for tooltip to show average value cleanly
            // formatter={(value: any, name: string, props: { payload: DataPoint }) => {
            //     const numValue = typeof value === 'number' ? value : 0;
            //     const { isAverage } = props.payload;
            //     return [numValue.toFixed(isAverage ? 2 : 0), isAverage ? 'Average' : 'Count'];
            // }}
            // cursor={{ fill: 'rgba(52, 152, 219, 0.1)' }}
            // FIX TS2322 (Tooltip): Use any for arguments and safely check for payload
            formatter={(value: any, name: string, props: any) => {
                const numValue = typeof value === 'number' ? value : 0;
                // Safely access payload and isAverage
                const isAverage = props?.payload?.isAverage; 
                return [numValue.toFixed(isAverage ? 2 : 0), isAverage ? 'Average' : 'Count'];
            }}
          />

          {/* Target Line */}
          <ReferenceLine 
              y={targetValue} 
              stroke="#2ecc71" // Use a vibrant color (green) for target
              strokeWidth={2}
              strokeDasharray="8 4" 
              label={{ 
                  value: `Target: ${targetValue}`, 
                  position: 'top', 
                  fill: '#2ecc71', 
                  fontSize: 12,
                  fontWeight: 600,
                  dy: -10, // Move label up slightly
              }}
          />

          {/* Trend Line (Connects the center of the bars) */}
          <Line
            type="monotone"
            dataKey="value"
            stroke={trendLineColor}
            strokeWidth={3}
            dot={{ r: 4, fill: trendLineColor }} // Add dots for better visualization
            activeDot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
            isAnimationActive={true}
          />
          
          <Bar dataKey="value" barSize={40} radius={[8, 8, 0, 0]}> {/* Added rounded corners */}
            {/* Value Label on top of the bars */}
            <LabelList 
                dataKey="value" 
                position="top" 
                style={{ fontWeight: "bold", fontSize: 12, fill: '#4B5563' }} 
                // FIX TS2322: Corrected formatter to handle 'value' (any) and props to access index
                // formatter={(value: any, props: { index: number }) => {
                //     const numValue = typeof value === 'number' ? value : 0;
                //     const index = props.index;
                //     return data[index]?.isAverage ? numValue.toFixed(2) : numValue.toFixed(0);
                // }}
                // FIX TS2322 (LabelList): Use any for arguments, access props object directly for index
                formatter={(value: any) => {
                    const numValue = typeof value === 'number' ? value : 0;
                    // Find the DataPoint entry by searching the data array by value.
                    // This is safer than relying on props.index which may not be correctly typed.
                    const entry = data.find(d => d.value === numValue) || data.find(d => d.value.toFixed(2) === numValue.toFixed(2));

                    // Determine if it's the average bar and apply the correct formatting
                    return entry?.isAverage ? numValue.toFixed(2) : numValue.toFixed(0);
                }}
            />
            {/* Color coding for bars */}
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                // Use gradient for standard bars, use averageColor for the average bar
                fill={entry.isAverage ? averageColor : `url(#${BarGradientId})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuarterlyMonitoringChart;


// QuarterlyMonitoringChart.tsx

// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LabelList,
//   Cell,
//   Line,
//   ReferenceLine,
// } from "recharts";

// // EXPORTED for use in DashboardView.tsx
// export interface DataPoint {
//   name: string;
//   value: number;
//   isAverage?: boolean;
//   isTarget?: boolean;
// }

// interface QuarterlyMonitoringChartProps {
//   data: DataPoint[];
//   title: string;
//   subtitle: string;
//   targetValue: number;
//   yAxisLabel: string;
//   barColor: string;
//   averageColor: string;
//   trendLineColor: string;
// }

// const QuarterlyMonitoringChart: React.FC<QuarterlyMonitoringChartProps> = ({
//   data,
//   title,
//   subtitle,
//   targetValue,
//   yAxisLabel,
//   barColor,
//   averageColor,
//   trendLineColor,
// }) => {
//   // Find the average value from the data array
//   const averageDataPoint = data.find(d => d.isAverage);
//   const averageValue = averageDataPoint ? averageDataPoint.value : 0;

//   // Find the max domain for Y-axis for better scaling
//   const maxDataValue = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;
//   // Include target and average values in max domain calculation
//   const maxDomain = Math.max(maxDataValue, targetValue, averageValue) * 1.2 || 12;
  
//   // Use a dynamic ID for the gradient based on the color
//   const BarGradientId = `barGradient-${barColor.replace('#', '')}`;
//   const LineGradientId = `lineGradient-${trendLineColor.replace('#', '')}`; 

//   // --- Custom Tooltip Component for better appearance ---
//   const CustomChartTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       // Find the main bar data (excluding trend/target lines if they appear in payload)
//       const dataPoint = payload.find((p: any) => p.dataKey === 'value' && !p.payload.isAverage)?.payload || payload[0]?.payload;
//       const isAverage = dataPoint?.isAverage;
//       const displayValue = typeof dataPoint?.value === 'number' ? dataPoint.value.toFixed(isAverage ? 2 : 0) : 'N/A';
      
//       const averageData = payload.find((p: any) => p.payload.isAverage);

//       return (
//         <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-2xl border border-gray-200/80 text-sm">
//           <p className="font-extrabold text-lg mb-1 text-gray-900">{label}</p>
//           <p className="text-gray-700 font-medium flex items-center gap-2">
//             <span className="w-2 h-2 rounded-full" style={{ backgroundColor: barColor }}></span>
//             Count: <span className="font-bold text-gray-900">{displayValue}</span>
//           </p>
//           {/* Dynamically show average data in tooltip if available */}
//           {averageData && (
//             <p className="text-gray-700 font-medium flex items-center gap-2 mt-1">
//               <span className="w-2 h-2 rounded-full" style={{ backgroundColor: averageColor }}></span>
//               Avg. Trend: <span className="font-bold text-gray-900">{averageData.value.toFixed(2)}</span>
//             </p>
//           )}
//           <p className="text-sm text-green-500 font-semibold mt-2">Target: {targetValue}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Filter out the average data point for the monthly trend line
//   const monthlyData = data.filter(d => !d.isAverage);

//   return (
//     <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100/50 transition-all duration-300 transform hover:shadow-3xl hover:ring-4 hover:ring-blue-500/10">
//       {/* Header: Enhanced look */}
//       <div className="flex items-start justify-between mb-6 border-b border-gray-100/70 pb-4">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/50">
//             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path d="M16 8l2-2m0 0l-2-2m2 2h-4m-3.5 10l-2 2m0 0l2 2m-2-2h4M7 13a3 3 0 00-3 3v1a2 2 0 002 2h2m-5-8a3 3 0 013-3h1m4 0a3 3 0 003-3v-1a2 2 0 00-2-2h-2m5 8a3 3 0 01-3 3h-1m-4 0a3 3 0 00-3-3v-1a2 2 0 002-2h2" />
//             </svg>
//           </div>
//           <div>
//             <h3 className="font-extrabold text-2xl text-gray-900">{title}</h3>
//             <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
//           </div>
//         </div>
//         <div className="text-sm font-bold text-blue-600 bg-blue-50/70 px-3 py-1 rounded-full border border-blue-200/50">
//           Trend Analysis
//         </div>
//       </div>
      
//       {/* Chart */}
//       <ResponsiveContainer width="100%" height={340}>
//         <BarChart
//           data={data}
//           margin={{ top: 30, right: 30, left: 20, bottom: 50 }}
//         >
//           {/* Define Gradients */}
//           <defs>
//             {/* Bar Gradient (for 3D effect) */}
//             <linearGradient id={BarGradientId} x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor={barColor} stopOpacity={1.0}/>
//               <stop offset="100%" stopColor={barColor} stopOpacity={0.7}/> 
//             </linearGradient>
//              {/* Trend Line Gradient (for slight glow) */}
//              <linearGradient id={LineGradientId} x1="0" y1="0" x2="1" y2="0">
//                 <stop offset="0%" stopColor={trendLineColor} stopOpacity={0.8}/>
//                 <stop offset="100%" stopColor={trendLineColor} stopOpacity={1.0}/>
//             </linearGradient>
//           </defs>

//           <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" horizontal={true} vertical={false} />
//           <XAxis
//             dataKey="name"
//             tick={{ fontSize: 13, fill: '#4B5563', fontWeight: 600 }}
//             angle={-15}
//             textAnchor="end"
//             height={60}
//             axisLine={{ stroke: '#E5E7EB' }}
//             tickLine={false}
//           />
//           <YAxis
//             tick={{ fontSize: 12, fill: '#6B7280' }}
//             domain={[0, Math.ceil(maxDomain)]}
//             axisLine={{ stroke: '#E5E7EB' }}
//             tickLine={false}
//             label={{
//               value: yAxisLabel,
//               angle: -90,
//               position: "insideLeft",
//               fontSize: 14,
//               fill: '#4B5563',
//               fontWeight: 700,
//               style: { textAnchor: 'middle' }
//             }}
//           />
//           <Tooltip content={<CustomChartTooltip />} />

//           {/* KPI Target Line */}
//           <ReferenceLine 
//               y={targetValue} 
//               stroke="#059669" // Darker, more definitive green for Target
//               strokeWidth={3}
//               strokeDasharray="10 5" 
//               label={{ 
//                   value: `KPI Target: ${targetValue}`, 
//                   position: 'top', 
//                   fill: '#059669', 
//                   fontSize: 13,
//                   fontWeight: 800,
//                   dy: -10,
//               }}
//           />

//           {/* --- FIX: Average Reference Line Re-added --- */}
//           {averageValue > 0 && (
//             <ReferenceLine 
//               y={averageValue} 
//               stroke={averageColor} 
//               strokeWidth={3}
//               strokeDasharray="3 3" 
//               label={{ 
//                   value: `AVG: ${averageValue.toFixed(2)}`, 
//                   position: 'bottom', 
//                   fill: averageColor, 
//                   fontSize: 13,
//                   fontWeight: 800,
//                   dy: 10,
//               }}
//             />
//           )}
//           {/* --- END FIX --- */}


//           {/* Trend Line (Line) - Only for MONTHLY data points */}
//           <Line
//             type="monotone"
//             dataKey="value"
//             stroke={`url(#${LineGradientId})`}
//             strokeWidth={4} 
//             dot={{ r: 5, fill: trendLineColor, stroke: '#fff', strokeWidth: 2 }} 
//             activeDot={{ r: 8, strokeWidth: 3, fill: '#fff', stroke: trendLineColor }}
//             isAnimationActive={true}
//             // Use the filtered monthly data to prevent connecting the AVG bar
//             data={monthlyData} 
//           />

//           {/* Bar Data */}
//           <Bar dataKey="value" barSize={50} radius={[10, 10, 0, 0]}> 
            
//             {/* Value Label on top of the bars */}
//             <LabelList 
//                 dataKey="value" 
//                 position="top" 
//                 style={{ fontWeight: "bold", fontSize: 13, fill: '#4B5563' }} 
//                 // Fix for TS2322: Corrected formatter using safe data access
//                 formatter={(value: any) => {
//                     const numValue = typeof value === 'number' ? value : 0;
//                     const entry = data.find(d => d.value === numValue) || data.find(d => d.value.toFixed(2) === numValue.toFixed(2));
//                     return entry?.isAverage ? numValue.toFixed(2) : numValue.toFixed(0);
//                 }}
//             />
            
//             {/* Color coding for bars */}
//             {data.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 // Use solid color for average bar, dynamic gradient for regular bars
//                 fill={entry.isAverage ? averageColor : `url(#${BarGradientId})`}
//                 className="transition-all duration-300 hover:opacity-85"
//                 // Add a drop shadow to the cell for a 3D lift effect
//                 filter="url(#shadow)" 
//               />
//             ))}
//           </Bar>
//            {/* Define a simple drop shadow filter for the bars */}
//            <filter id="shadow">
//                 <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.2)"/>
//             </filter>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default QuarterlyMonitoringChart;