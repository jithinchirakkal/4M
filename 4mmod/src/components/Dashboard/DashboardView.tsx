// import React from "react";

// const stats = [
//   {
//     icon: (
//       <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//         <rect width="20" height="14" x="2" y="5" rx="2" />
//       </svg>
//     ),
//     label: "Total Changes",
//     value: 68,
//     trend: "+12%",
//     trendColor: "text-green-500",
//     bg: "bg-blue-600",
//   },
//   {
//     icon: (
//       <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//         <circle cx="12" cy="12" r="10" />
//         <path d="M12 6v6l4 2" />
//       </svg>
//     ),
//     label: "Pending Approvals",
//     value: 24,
//     trend: "-8%",
//     trendColor: "text-red-500",
//     bg: "bg-orange-400",
//   },
//   {
//     icon: (
//       <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//         <path d="M5 13l4 4L19 7" />
//       </svg>
//     ),
//     label: "Completed",
//     value: 35,
//     trend: "+15%",
//     trendColor: "text-green-500",
//     bg: "bg-green-500",
//   },
//   {
//     icon: (
//       <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//         <circle cx="12" cy="12" r="10" />
//         <path d="M12 8v4" />
//         <circle cx="12" cy="16" r="1" />
//       </svg>
//     ),
//     label: "Critical Issues",
//     value: 3,
//     trend: "-50%",
//     trendColor: "text-red-500",
//     bg: "bg-red-500",
//   },
// ];

// const recentChanges = [
//   {
//     type: "MACHINE",
//     title: "Equipment Calibration Update",
//     assigned: "John Smith",
//     priority: "high",
//     due: "1/25/2024",
//     progress: 65,
//     color: "bg-blue-600",
//     priorityColor: "bg-orange-100 text-orange-600",
//   },
//   {
//     type: "MATERIAL",
//     title: "Raw Material Specification Change",
//     assigned: "Sarah Johnson",
//     priority: "medium",
//     due: "1/30/2024",
//     progress: 20,
//     color: "bg-yellow-400",
//     priorityColor: "bg-blue-100 text-blue-600",
//   },
//   {
//     type: "METHOD",
//     title: "Process Workflow Optimization",
//     assigned: "Mike Davis",
//     priority: "low",
//     due: "1/20/2024",
//     progress: 100,
//     color: "bg-green-500",
//     priorityColor: "bg-green-100 text-green-600",
//   },
// ];

// const DashboardView = () => {
//   return (
//     <div className="bg-[#f6faff] min-h-screen p-6">
//       {/* Header */}
//       <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 p-8 mb-8 relative overflow-hidden">
//         <h1 className="text-4xl font-bold text-white mb-2">Welcome to 4M Change Management System</h1>
//         <p className="text-white text-lg mb-6">Monitor, manage and track all manufacturing changes in real-time</p>
//         <div className="flex gap-4">
//           <button className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium">
//             <span className="text-xl">+</span> New Change Request
//           </button>
//           <button className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path d="M9 17v-2a4 4 0 0 1 8 0v2" />
//               <circle cx="12" cy="7" r="4" />
//             </svg>
//             View Analytics
//           </button>
//         </div>
//         <div className="absolute right-0 top-0 w-1/3 h-full bg-white/10 rounded-full pointer-events-none"></div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat, idx) => (
//           <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
//             <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} mb-2`}>
//               {stat.icon}
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-3xl font-bold">{stat.value}</span>
//               <span className={`text-sm font-semibold ${stat.trendColor}`}>{stat.trend}</span>
//             </div>
//             <span className="text-gray-500">{stat.label}</span>
//           </div>
//         ))}
//       </div>

//       {/* Change Trends & Category Distribution */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white rounded-xl shadow p-6 min-h-[220px] flex flex-col">
//           <div className="flex items-center justify-between mb-4">
//             <span className="font-semibold text-lg">Change Trends</span>
//             <div className="flex gap-2 text-gray-400">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path d="M12 4v16m8-8H4" />
//               </svg>
//             </div>
//           </div>
//           <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
//             <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path d="M4 17l6-6 4 4 6-6" />
//             </svg>
//             <span>Chart visualization would go here</span>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-6 min-h-[220px] flex flex-col">
//           <div className="flex items-center justify-between mb-4">
//             <span className="font-semibold text-lg">Category Distribution</span>
//             <div className="flex gap-2 text-gray-400">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <circle cx="12" cy="12" r="10" />
//                 <path d="M12 2v10h10" />
//               </svg>
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path d="M12 4v16m8-8H4" />
//               </svg>
//             </div>
//           </div>
//           <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
//             <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path d="M21 12.79A9 9 0 1 1 11.21 3" />
//               <path d="M22 12A10 10 0 1 0 12 22" />
//             </svg>
//             <span>Pie chart visualization would go here</span>
//           </div>
//         </div>
//       </div>

//       {/* Recent Changes */}
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <span className="font-semibold text-lg">Recent Changes</span>
//           <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
//             <span>View All</span>
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path d="M9 5l7 7-7 7" />
//             </svg>
//           </button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {recentChanges.map((item, idx) => (
//             <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
//               <div className="flex items-center gap-2 mb-2">
//                 <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
//                 <span className="uppercase text-xs font-semibold text-gray-500">{item.type}</span>
//                 <div className="ml-auto flex gap-2 text-gray-400">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <circle cx="12" cy="12" r="10" />
//                     <path d="M12 16v-4" />
//                   </svg>
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <path d="M12 20h9" />
//                   </svg>
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <circle cx="12" cy="12" r="1" />
//                     <circle cx="19" cy="12" r="1" />
//                     <circle cx="5" cy="12" r="1" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="font-semibold text-lg">{item.title}</div>
//               <div className="flex justify-between text-sm text-gray-500">
//                 <span>Assigned to</span>
//                 <span className="text-gray-800 font-medium">{item.assigned}</span>
//               </div>
//               <div className="flex justify-between text-sm text-gray-500">
//                 <span>Priority</span>
//                 <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.priorityColor}`}>{item.priority}</span>
//               </div>
//               <div className="flex justify-between text-sm text-gray-500">
//                 <span>Due Date</span>
//                 <span className="text-gray-800 font-medium">{item.due}</span>
//               </div>
//               <div className="mt-2">
//                 <div className="flex justify-between text-xs text-gray-400 mb-1">
//                   <span>Progress</span>
//                   <span className="text-gray-800 font-medium">{item.progress}%</span>
//                 </div>
//                 <div className="w-full h-2 bg-gray-100 rounded-full">
//                   <div
//                     className={`h-2 rounded-full ${item.color}`}
//                     style={{ width: `${item.progress}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardView;


// import React, { useState, useEffect } from "react";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//   PieChart as RechartsPieChart, Cell, Pie, LineChart, Line
// } from 'recharts';

// const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

// // Define types for better TypeScript support
// interface ChangeItem {
//   four_m: string;
//   change_category: string;
//   date?: string;
//   created?: string;
//   changed_description?: string;
//   action_taken?: string;
//   set_up_approval: boolean;
//   retroactive_inspection: boolean;
//   suspected_lot_check: boolean;
// }

// interface MonthData {
//   month: string;
//   monthKey: string;
//   Man: number;
//   'Machine/Tool': number;
//   Material: number;
//   Method: number;
// }

// const DashboardView = () => {
//   const [changeList, setChangeList] = useState<ChangeItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch all 4M changes from API
//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/api/4m-changes/')
//       .then(res => res.json())
//       .then(data => {
//         setChangeList(data);
//         setLoading(false);
//       })
//       .catch(() => {
//         setChangeList([]);
//         setLoading(false);
//       });
//   }, []);

//   // Prepare chart data
//   const prepare4MChartData = () => {
//     const counts = changeList.reduce((acc: Record<string, number>, item) => {
//       acc[item.four_m] = (acc[item.four_m] || 0) + 1;
//       return acc;
//     }, {});
    
//     return [
//       { name: 'Man', count: counts['Man'] || 0, color: '#3B82F6' },
//       { name: 'Machine/Tool', count: counts['Machine/Tool'] || 0, color: '#10B981' },
//       { name: 'Material', count: counts['Material'] || 0, color: '#8B5CF6' },
//       { name: 'Method', count: counts['Method'] || 0, color: '#F59E0B' },
//     ];
//   };

//   const prepareCategoryChartData = () => {
//     const counts = changeList.reduce((acc: Record<string, number>, item) => {
//       acc[item.change_category] = (acc[item.change_category] || 0) + 1;
//       return acc;
//     }, {});
    
//     return Object.entries(counts).map(([category, count], index) => ({
//       name: category,
//       value: count as number,
//       color: COLORS[index % COLORS.length],
//     }));
//   };

//   // Prepare monthly chart data with 4M breakdown
//   const prepareMonthlyChartData = (): MonthData[] => {
//     // Get current date and calculate 12 months back
//     const currentDate = new Date();
//     const months: MonthData[] = [];
    
//     // Generate last 12 months
//     for (let i = 11; i >= 0; i--) {
//       const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
//       const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
//       const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
//       months.push({
//         month: monthName,
//         monthKey: monthKey,
//         Man: 0,
//         'Machine/Tool': 0,
//         Material: 0,
//         Method: 0
//       });
//     }
    
//     // Count changes by month and 4M category
//     changeList.forEach(item => {
//       const date = new Date(item.date || item.created || '');
//       const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
//       const monthData = months.find(m => m.monthKey === monthKey);
//       if (monthData && item.four_m) {
//         const fourMKey = item.four_m as keyof Omit<MonthData, 'month' | 'monthKey'>;
//         if (fourMKey in monthData) {
//           monthData[fourMKey] = (monthData[fourMKey] || 0) + 1;
//         }
//       }
//     });
    
//     return months;
//   };

//   // Calculate statistics
//   const totalChanges = changeList.length;
//   const setUpApprovals = changeList.filter(item => item.set_up_approval).length;
//   const retroactiveInspections = changeList.filter(item => item.retroactive_inspection).length;
//   const suspectedLotChecks = changeList.filter(item => item.suspected_lot_check).length;
//   const pendingApprovals = changeList.filter(item => 
//     !item.set_up_approval && !item.retroactive_inspection && !item.suspected_lot_check
//   ).length;
//   const plannedChanges = changeList.filter(item => item.change_category === 'Planned').length;
//   const unplannedChanges = changeList.filter(item => item.change_category === 'Unplanned').length;
//   const abnormalChanges = changeList.filter(item => item.change_category === 'Abnormal').length;

//   const stats = [
//     {
//       icon: (
//         <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//           <rect width="20" height="14" x="2" y="5" rx="2" />
//         </svg>
//       ),
//       label: "Total Changes",
//       value: totalChanges,
//       trend: totalChanges > 0 ? `${totalChanges} records` : "No data",
//       trendColor: "text-blue-500",
//       bg: "bg-blue-600",
//     },
//     {
//       icon: (
//         <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//           <circle cx="12" cy="12" r="10" />
//           <path d="M12 6v6l4 2" />
//         </svg>
//       ),
//       label: "Pending Approvals",
//       value: pendingApprovals,
//       trend: `${((pendingApprovals/totalChanges)*100 || 0).toFixed(1)}%`,
//       trendColor: "text-yellow-500",
//       bg: "bg-yellow-500",
//     },
//     {
//       icon: (
//         <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//           <path d="M5 13l4 4L19 7" />
//         </svg>
//       ),
//       label: "Planned Changes",
//       value: plannedChanges,
//       trend: `${((plannedChanges/totalChanges)*100 || 0).toFixed(1)}%`,
//       trendColor: "text-green-500",
//       bg: "bg-green-500",
//     },
//     {
//       icon: (
//         <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//           <circle cx="12" cy="12" r="10" />
//           <path d="M12 8v4" />
//           <circle cx="12" cy="16" r="1" />
//         </svg>
//       ),
//       label: "Critical Issues",
//       value: abnormalChanges,
//       trend: abnormalChanges > 0 ? "Attention needed" : "All good",
//       trendColor: abnormalChanges > 0 ? "text-red-500" : "text-green-500",
//       bg: "bg-red-500",
//     },
//   ];

//   // Get recent changes (latest 3)
//   const recentChanges = changeList
//     .sort((a, b) => new Date(b.date || b.created || '').getTime() - new Date(a.date || a.created || '').getTime())
//     .slice(0, 3)
//     .map(item => ({
//       type: item.four_m?.toUpperCase() || 'UNKNOWN',
//       title: item.changed_description?.substring(0, 40) + (item.changed_description?.length && item.changed_description.length > 40 ? '...' : ''),
//       action: item.action_taken?.substring(0, 30) + (item.action_taken?.length && item.action_taken.length > 30 ? '...' : ''),
//       category: item.change_category,
//       date: item.date ? new Date(item.date).toLocaleDateString() : 'No date',
//       setUpApproval: item.set_up_approval,
//       retroactiveInspection: item.retroactive_inspection,
//       suspectedLotCheck: item.suspected_lot_check,
//       color: item.four_m === 'Man' ? 'bg-blue-600' : 
//              item.four_m === 'Machine/Tool' ? 'bg-green-500' :
//              item.four_m === 'Material' ? 'bg-purple-500' : 'bg-orange-500',
//       priorityColor: item.change_category === 'Abnormal' ? 'bg-red-100 text-red-600' :
//                      item.change_category === 'Unplanned' ? 'bg-orange-100 text-orange-600' :
//                      'bg-green-100 text-green-600',
//     }));

//   if (loading) {
//     return (
//       <div className="bg-[#f6faff] min-h-screen p-6 flex items-center justify-center">
//         <div className="text-xl text-gray-500">Loading dashboard...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#f6faff] min-h-screen p-6">
//       {/* Header */}
//       <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 p-8 mb-8 relative overflow-hidden">
//         <h1 className="text-4xl font-bold text-white mb-2">4M Change Management Dashboard</h1>
//         <p className="text-white text-lg mb-6">Monitor, manage and track all manufacturing changes in real-time</p>
//         <div className="flex gap-4">
//           <button className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium">
//             <span className="text-xl">+</span> New Change Request
//           </button>
//           <button className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path d="M9 17v-2a4 4 0 0 1 8 0v2" />
//               <circle cx="12" cy="7" r="4" />
//             </svg>
//             View All Records
//           </button>
//         </div>
//         <div className="absolute right-0 top-0 w-1/3 h-full bg-white/10 rounded-full pointer-events-none"></div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat, idx) => (
//           <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
//             <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} mb-2`}>
//               {stat.icon}
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-3xl font-bold">{stat.value}</span>
//               <span className={`text-sm font-semibold ${stat.trendColor}`}>{stat.trend}</span>
//             </div>
//             <span className="text-gray-500">{stat.label}</span>
//           </div>
//         ))}
//       </div>

//       {/* Enhanced Charts Section */}
// {changeList.length > 0 ? (
//   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//     {/* Enhanced 4M Distribution Bar Chart */}
//     <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
//             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//             </svg>
//           </div>
//           <div>
//             <h3 className="font-bold text-lg text-gray-900">4M Changes Distribution</h3>
//             <p className="text-sm text-gray-500">Manufacturing change breakdown</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//           <span>Live Data</span>
//         </div>
//       </div>
//       <ResponsiveContainer width="100%" height={320}>
//         <BarChart 
//           data={prepare4MChartData()} 
//           margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
//         >
//           <defs>
//             <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
//               <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.8}/>
//             </linearGradient>
//             <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
//               <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
//             </linearGradient>
//             <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
//               <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8}/>
//             </linearGradient>
//             <linearGradient id="barGradient4" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8}/>
//               <stop offset="100%" stopColor="#D97706" stopOpacity={0.8}/>
//             </linearGradient>
//           </defs>
//           <CartesianGrid 
//             strokeDasharray="3 3" 
//             stroke="#f0f0f0" 
//             horizontal={true}
//             vertical={false}
//           />
//           <XAxis 
//             dataKey="name" 
//             tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }}
//             axisLine={{ stroke: '#E5E7EB' }}
//             tickLine={{ stroke: '#E5E7EB' }}
//             angle={-45}
//             textAnchor="end"
//             height={80}
//           />
//           <YAxis 
//             tick={{ fontSize: 12, fill: '#6B7280' }}
//             axisLine={{ stroke: '#E5E7EB' }}
//             tickLine={{ stroke: '#E5E7EB' }}
//           />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: '#ffffff',
//               border: 'none',
//               borderRadius: '12px',
//               boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//               fontSize: '14px',
//             }}
//             cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
//           />
//           <Bar 
//             dataKey="count" 
//             name="Changes"
//             radius={[8, 8, 0, 0]}
//             fill="url(#barGradient1)"
//           />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>

//     {/* Enhanced Category Distribution Pie Chart */}
//     <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <circle cx="12" cy="12" r="10" />
//               <path d="M12 2v10l7 7" />
//             </svg>
//           </div>
//           <div>
//             <h3 className="font-bold text-lg text-gray-900">Category Distribution</h3>
//             <p className="text-sm text-gray-500">Change type breakdown</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <span>Updated now</span>
//         </div>
//       </div>
//       <ResponsiveContainer width="100%" height={320}>
//         <RechartsPieChart>
//           <defs>
//             <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
//               <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0, 0, 0, 0.1)"/>
//             </filter>
//           </defs>
//           <Pie
//             data={prepareCategoryChartData()}
//             cx="50%"
//             cy="50%"
//             labelLine={false}
//             label={({ name, percent }) => `${name}\n${((percent || 0) * 100).toFixed(1)}%`}
//             outerRadius={110}
//             innerRadius={60}
//             paddingAngle={5}
//             fill="#8884d8"
//             dataKey="value"
//             style={{ filter: 'url(#shadow)' }}
//           >
//             {prepareCategoryChartData().map((entry, index) => (
//               <Cell 
//                 key={`cell-${index}`} 
//                 fill={entry.color}
//                 stroke="#ffffff"
//                 strokeWidth={3}
//               />
//             ))}
//           </Pie>
//           <Tooltip
//             contentStyle={{
//               backgroundColor: '#ffffff',
//               border: 'none',
//               borderRadius: '12px',
//               boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//               fontSize: '14px',
//             }}
//           />
//         </RechartsPieChart>
//       </ResponsiveContainer>
      
//       {/* Custom Legend */}
//       <div className="flex justify-center mt-4">
//         <div className="flex flex-wrap gap-4">
//           {prepareCategoryChartData().map((entry, index) => (
//             <div key={index} className="flex items-center gap-2">
//               <div 
//                 className="w-3 h-3 rounded-full" 
//                 style={{ backgroundColor: entry.color }}
//               ></div>
//               <span className="text-sm font-medium text-gray-700">{entry.name}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   </div>
// ) : (
//   // No data state with better design
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//     {/* Enhanced No Data Bar Chart */}
//     <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//           <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//             <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//           </svg>
//         </div>
//         <div>
//           <h3 className="font-bold text-lg text-gray-900">4M Changes Distribution</h3>
//           <p className="text-sm text-gray-500">Manufacturing change breakdown</p>
//         </div>
//       </div>
//       <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
//         <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
//           <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//             <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//           </svg>
//         </div>
//         <h4 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h4>
//         <p className="text-sm text-center">Add some 4M changes to see the distribution chart</p>
//       </div>
//     </div>

//     {/* Enhanced No Data Pie Chart */}
//     <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//           <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//             <circle cx="12" cy="12" r="10" />
//             <path d="M12 2v10l7 7" />
//           </svg>
//         </div>
//         <div>
//           <h3 className="font-bold text-lg text-gray-900">Category Distribution</h3>
//           <p className="text-sm text-gray-500">Change type breakdown</p>
//         </div>
//       </div>
//       <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
//         <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
//           <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//             <circle cx="12" cy="12" r="10" />
//             <path d="M12 2v10l7 7" />
//           </svg>
//         </div>
//         <h4 className="text-lg font-semibold text-gray-600 mb-2">No Categories Yet</h4>
//         <p className="text-sm text-center">Chart will appear when you add change records</p>
//       </div>
//     </div>
//   </div>
// )}


//       {/* Charts Section */}
//       {changeList.length > 0 ? (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* 4M Distribution Bar Chart */}
//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <span className="font-semibold text-lg">4M Changes Distribution</span>
//               <div className="flex gap-2 text-gray-400">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <path d="M4 17l6-6 4 4 6-6" />
//                 </svg>
//               </div>
//             </div>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={prepare4MChartData()}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="count" fill="#3B82F6" name="Changes" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Category Distribution Pie Chart */}
//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <span className="font-semibold text-lg">Category Distribution</span>
//               <div className="flex gap-2 text-gray-400">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <circle cx="12" cy="12" r="10" />
//                   <path d="M12 2v10h10" />
//                 </svg>
//               </div>
//             </div>
//             <ResponsiveContainer width="100%" height={300}>
//               <RechartsPieChart>
//                 <Pie
//                   data={prepareCategoryChartData()}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {prepareCategoryChartData().map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </RechartsPieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow p-6 min-h-[220px] flex flex-col">
//             <div className="flex items-center justify-between mb-4">
//               <span className="font-semibold text-lg">4M Changes Distribution</span>
//               <div className="flex gap-2 text-gray-400">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <path d="M4 17l6-6 4 4 6-6" />
//                 </svg>
//               </div>
//             </div>
//             <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
//               <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path d="M4 17l6-6 4 4 6-6" />
//               </svg>
//               <span>No data available for charts</span>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow p-6 min-h-[220px] flex flex-col">
//             <div className="flex items-center justify-between mb-4">
//               <span className="font-semibold text-lg">Category Distribution</span>
//               <div className="flex gap-2 text-gray-400">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <circle cx="12" cy="12" r="10" />
//                   <path d="M12 2v10h10" />
//                 </svg>
//               </div>
//             </div>
//             <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
//               <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path d="M21 12.79A9 9 0 1 1 11.21 3" />
//                 <path d="M22 12A10 10 0 1 0 12 22" />
//               </svg>
//               <span>No data available for pie chart</span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Additional Analytics */}
//       {changeList.length > 0 && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//           {/* Activities Summary */}
//           <div className="bg-white rounded-xl shadow p-6">
//             <h3 className="font-semibold text-lg mb-4">Activities Summary</h3>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Pending Approvals</span>
//                 <div className="flex items-center gap-2">
//                   <div className="w-16 h-2 bg-gray-200 rounded-full">
//                     <div 
//                       className="h-2 bg-yellow-500 rounded-full" 
//                       style={{ width: `${totalChanges > 0 ? (pendingApprovals/totalChanges)*100 : 0}%` }}
//                     ></div>
//                   </div>
//                   <span className="text-sm font-medium">{pendingApprovals}</span>
//                 </div>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Set-Up Approvals</span>
//                 <div className="flex items-center gap-2">
//                   <div className="w-16 h-2 bg-gray-200 rounded-full">
//                     <div 
//                       className="h-2 bg-blue-500 rounded-full" 
//                       style={{ width: `${totalChanges > 0 ? (setUpApprovals/totalChanges)*100 : 0}%` }}
//                     ></div>
//                   </div>
//                   <span className="text-sm font-medium">{setUpApprovals}</span>
//                 </div>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Retroactive Inspections</span>
//                 <div className="flex items-center gap-2">
//                   <div className="w-16 h-2 bg-gray-200 rounded-full">
//                     <div 
//                       className="h-2 bg-orange-500 rounded-full" 
//                       style={{ width: `${totalChanges > 0 ? (retroactiveInspections/totalChanges)*100 : 0}%` }}
//                     ></div>
//                   </div>
//                   <span className="text-sm font-medium">{retroactiveInspections}</span>
//                 </div>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Suspected Lot Checks</span>
//                 <div className="flex items-center gap-2">
//                   <div className="w-16 h-2 bg-gray-200 rounded-full">
//                     <div 
//                       className="h-2 bg-red-500 rounded-full" 
//                       style={{ width: `${totalChanges > 0 ? (suspectedLotChecks/totalChanges)*100 : 0}%` }}
//                     ></div>
//                   </div>
//                   <span className="text-sm font-medium">{suspectedLotChecks}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Category Breakdown */}
//           <div className="bg-white rounded-xl shadow p-6">
//             <h3 className="font-semibold text-lg mb-4">Category Breakdown</h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-4 h-4 bg-green-500 rounded-full"></div>
//                   <span>Planned</span>
//                 </div>
//                 <span className="font-semibold">{plannedChanges}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
//                   <span>Unplanned</span>
//                 </div>
//                 <span className="font-semibold">{unplannedChanges}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//                   <span>Abnormal</span>
//                 </div>
//                 <span className="font-semibold">{abnormalChanges}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Recent Changes */}
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <span className="font-semibold text-lg">Recent Changes</span>
//           <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
//             <span>View All</span>
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path d="M9 5l7 7-7 7" />
//             </svg>
//           </button>
//         </div>
        
//         {recentChanges.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {recentChanges.map((item, idx) => (
//               <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
//                   <span className="uppercase text-xs font-semibold text-gray-500">{item.type}</span>
//                   <div className="ml-auto flex gap-2 text-gray-400">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                       <circle cx="12" cy="12" r="10" />
//                       <path d="M12 16v-4" />
//                     </svg>
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                       <circle cx="12" cy="12" r="1" />
//                       <circle cx="19" cy="12" r="1" />
//                       <circle cx="5" cy="12" r="1" />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="font-semibold text-lg">{item.title}</div>
//                 <div className="flex justify-between text-sm text-gray-500">
//                   <span>Action Taken</span>
//                   <span className="text-gray-800 font-medium">{item.action}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-500">
//                   <span>Category</span>
//                   <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.priorityColor}`}>{item.category}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-500">
//                   <span>Date</span>
//                   <span className="text-gray-800 font-medium">{item.date}</span>
//                 </div>
//                 <div className="mt-2 flex gap-2">
//                   {item.setUpApproval && (
//                     <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Set-Up</span>
//                   )}
//                   {item.retroactiveInspection && (
//                     <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">Inspection</span>
//                   )}
//                   {item.suspectedLotCheck && (
//                     <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Lot Check</span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow p-8 text-center">
//             <div className="text-gray-400 text-lg mb-4">
//               <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
//                 <path d="M9 17v-2a4 4 0 0 1 8 0v2" />
//                 <circle cx="12" cy="7" r="4" />
//               </svg>
//               No change records found
//             </div>
//             <p className="text-gray-500">Start by adding your first 4M change record to see analytics and insights here.</p>
//             <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
//               Add First Record
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashboardView;



import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Cell, Pie, LineChart, Line
} from 'recharts';

import QuarterlyMonitoringChart, { DataPoint } from "./QuarterlyMonitoringChart";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

// Define types for better TypeScript support
interface ChangeItem {
  four_m: string;
  date?: string;
  created_at?: string;
  category_details?: {
    category_type: string;
    description: string;
  };
  action_details?: {
    action_taken: string;
    set_up_approval: boolean;
    retroactive_inspection: boolean;
    suspected_lot_check: boolean;
  };
}

interface MonthData {
  month: string;
  monthKey: string;
  Man: number;
  'Machine/Tool': number;
  Material: number;
  Method: number;
}

const DashboardView = () => {
  const [changeList, setChangeList] = useState<ChangeItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all 4M changes from API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/4m-changes/')
      .then(res => res.json())
      .then(data => {
        setChangeList(data);
        setLoading(false);
      })
      .catch(() => {
        setChangeList([]);
        setLoading(false);
      });
  }, []);

  // Prepare chart data
  const prepare4MChartData = () => {
    const counts = changeList.reduce((acc: Record<string, number>, item) => {
      acc[item.four_m] = (acc[item.four_m] || 0) + 1;
      return acc;
    }, {});
    
    return [
      { name: 'Man', count: counts['Man'] || 0, color: '#3B82F6' },
      { name: 'Machine', count: counts['Machine/Tool'] || 0, color: '#10B981' },
      { name: 'Material', count: counts['Material'] || 0, color: '#8B5CF6' },
      { name: 'Method', count: counts['Method'] || 0, color: '#F59E0B' },
    ];
  };

  const prepareCategoryChartData = () => {
  const counts = changeList.reduce((acc: Record<string, number>, item) => {
    const categoryType = item.category_details?.category_type || 'Unknown';
    acc[categoryType] = (acc[categoryType] || 0) + 1;
    return acc;
  }, {});
    
    return Object.entries(counts).map(([category, count], index) => ({
      name: category,
      value: count as number,
      color: COLORS[index % COLORS.length],
    }));
  };

  // Prepare 4M Chart Data for Quarterly (Jul-Sep)
// const prepare4MQuarterlyData = () => {
//   const quarterlyChanges = changeList.filter(item => {
//     const dateStr = item.date || item.created_at;
//     if (!dateStr) return false;
    
//     const itemDate = new Date(dateStr);
//     const month = itemDate.getMonth(); // 0-11 (0=Jan, 6=Jul, 8=Sep)
//     const year = itemDate.getFullYear();
//     const currentYear = new Date().getFullYear();
    
//     // Check if it's July (6), August (7), or September (8) of current year
//     return year === currentYear && month >= 6 && month <= 8;
//   });

//   const counts = quarterlyChanges.reduce((acc: Record<string, number>, item) => {
//     acc[item.four_m] = (acc[item.four_m] || 0) + 1;
//     return acc;
//   }, {});
  
//   return [
//     { name: 'Man', count: counts['Man'] || 0, color: '#3B82F6' },
//     { name: 'Machine', count: counts['Machine/Tool'] || 0, color: '#10B981' },
//     { name: 'Material', count: counts['Material'] || 0, color: '#8B5CF6' },
//     { name: 'Method', count: counts['Method'] || 0, color: '#F59E0B' },
//   ];
// };

const prepare4MQuarterlyData = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();

  const quarterlyChanges = changeList.filter(item => {
    const dateStr = item.date || item.created_at;
    if (!dateStr) return false;
    
    const itemDate = new Date(dateStr);
    const itemMonth = itemDate.getMonth();
    const itemYear = itemDate.getFullYear();
    
    // Calculate 2 months ago
    let startMonth = currentMonth - 2;
    let startYear = currentYear;
    
    // Handle year boundary (e.g., if current month is January or February)
    if (startMonth < 0) {
      startMonth = 12 + startMonth; // Convert negative to positive month in previous year
      startYear = currentYear - 1;
    }
    
    // Check if item date is within the last 3 months
    if (itemYear === currentYear) {
      return itemMonth >= startMonth && itemMonth <= currentMonth;
    } else if (itemYear === startYear && startYear < currentYear) {
      // Handle case where start month is in previous year
      return itemMonth >= startMonth;
    }
    
    return false;
  });

  const counts = quarterlyChanges.reduce((acc: Record<string, number>, item) => {
    acc[item.four_m] = (acc[item.four_m] || 0) + 1;
    return acc;
  }, {});
  
  return [
    { name: 'Man', count: counts['Man'] || 0, color: '#3B82F6' },
    { name: 'Machine', count: counts['Machine/Tool'] || 0, color: '#10B981' },
    { name: 'Material', count: counts['Material'] || 0, color: '#8B5CF6' },
    { name: 'Method', count: counts['Method'] || 0, color: '#F59E0B' },
  ];
};


// Prepare 4M Chart Data for Current Month (October)
const prepare4MCurrentMonthData = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 9 for October
  const currentYear = currentDate.getFullYear();

  const monthlyChanges = changeList.filter(item => {
    const dateStr = item.date || item.created_at;
    if (!dateStr) return false;
    
    const itemDate = new Date(dateStr);
    return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
  });

  const counts = monthlyChanges.reduce((acc: Record<string, number>, item) => {
    acc[item.four_m] = (acc[item.four_m] || 0) + 1;
    return acc;
  }, {});
  
  return [
    { name: 'Man', count: counts['Man'] || 0, color: '#3B82F6' },
    { name: 'Machine', count: counts['Machine/Tool'] || 0, color: '#10B981' },
    { name: 'Material', count: counts['Material'] || 0, color: '#8B5CF6' },
    { name: 'Method', count: counts['Method'] || 0, color: '#F59E0B' },
  ];
};

// Prepare Category Chart Data for Quarterly (Jul-Sep)
// const prepareCategoryQuarterlyData = () => {
//   const quarterlyChanges = changeList.filter(item => {
//     const dateStr = item.date || item.created_at;
//     if (!dateStr) return false;
    
//     const itemDate = new Date(dateStr);
//     const month = itemDate.getMonth();
//     const year = itemDate.getFullYear();
//     const currentYear = new Date().getFullYear();
    
//     return year === currentYear && month >= 6 && month <= 8;
//   });

//   const counts = quarterlyChanges.reduce((acc: Record<string, number>, item) => {
//     const categoryType = item.category_details?.category_type || 'Unknown';
//     acc[categoryType] = (acc[categoryType] || 0) + 1;
//     return acc;
//   }, {});
    
//   return Object.entries(counts).map(([category, count], index) => ({
//     name: category,
//     value: count as number,
//     color: COLORS[index % COLORS.length],
//   }));
// };

// Prepare Category Chart Data for Quarterly (Current month + 2 previous months)
const prepareCategoryQuarterlyData = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const quarterlyChanges = changeList.filter(item => {
    const dateStr = item.date || item.created_at;
    if (!dateStr) return false;
    
    const itemDate = new Date(dateStr);
    const itemMonth = itemDate.getMonth();
    const itemYear = itemDate.getFullYear();
    
    // Calculate 2 months ago
    let startMonth = currentMonth - 2;
    let startYear = currentYear;
    
    if (startMonth < 0) {
      startMonth = 12 + startMonth;
      startYear = currentYear - 1;
    }
    
    // Check if item date is within the last 3 months
    if (itemYear === currentYear) {
      return itemMonth >= startMonth && itemMonth <= currentMonth;
    } else if (itemYear === startYear && startYear < currentYear) {
      return itemMonth >= startMonth;
    }
    
    return false;
  });

  const counts = quarterlyChanges.reduce((acc: Record<string, number>, item) => {
    const categoryType = item.category_details?.category_type || 'Unknown';
    acc[categoryType] = (acc[categoryType] || 0) + 1;
    return acc;
  }, {});
    
  return Object.entries(counts).map(([category, count], index) => ({
    name: category,
    value: count as number,
    color: COLORS[index % COLORS.length],
  }));
};

// Helper function to get quarter label (for display)
const getQuarterLabel = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  let startMonth = currentMonth - 2;
  if (startMonth < 0) {
    startMonth = 12 + startMonth;
  }
  
  const endMonthName = monthNames[currentMonth];
  const startMonthName = monthNames[startMonth];
  
  return `${startMonthName}-${endMonthName} ${currentDate.getFullYear()}`;
};



// Prepare Category Chart Data for Current Month (October)
const prepareCategoryCurrentMonthData = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyChanges = changeList.filter(item => {
    const dateStr = item.date || item.created_at;
    if (!dateStr) return false;
    
    const itemDate = new Date(dateStr);
    return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
  });

  const counts = monthlyChanges.reduce((acc: Record<string, number>, item) => {
    const categoryType = item.category_details?.category_type || 'Unknown';
    acc[categoryType] = (acc[categoryType] || 0) + 1;
    return acc;
  }, {});
    
  return Object.entries(counts).map(([category, count], index) => ({
    name: category,
    value: count as number,
    color: COLORS[index % COLORS.length],
  }));
};

  // Calculate statistics
// Calculate statistics
const totalChanges = changeList.length;
const setUpApprovals = changeList.filter(item => item.action_details?.set_up_approval).length;
const retroactiveInspections = changeList.filter(item => item.action_details?.retroactive_inspection).length;
const suspectedLotChecks = changeList.filter(item => item.action_details?.suspected_lot_check).length;
const pendingApprovals = changeList.filter(item => 
  !item.action_details?.set_up_approval && 
  !item.action_details?.retroactive_inspection && 
  !item.action_details?.suspected_lot_check
).length;
  const plannedChanges = changeList.filter(item => item.category_details?.category_type === 'Planned').length;
  const unplannedChanges = changeList.filter(item => item.category_details?.category_type === 'Unplanned').length;
  const abnormalChanges = changeList.filter(item => item.category_details?.category_type === 'Abnormal').length;

  const stats = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect width="20" height="14" x="2" y="5" rx="2" />
        </svg>
      ),
      label: "Total Changes",
      value: totalChanges,
      trend: totalChanges > 0 ? `${totalChanges} records` : "No data",
      trendColor: "text-blue-500",
      bg: "bg-blue-600",
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      label: "Pending Approvals",
      value: pendingApprovals,
      trend: `${((pendingApprovals/totalChanges)*100 || 0).toFixed(1)}%`,
      trendColor: "text-yellow-500",
      bg: "bg-yellow-500",
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" />
        </svg>
      ),
      label: "Planned Changes",
      value: plannedChanges,
      trend: `${((plannedChanges/totalChanges)*100 || 0).toFixed(1)}%`,
      trendColor: "text-green-500",
      bg: "bg-green-500",
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <circle cx="12" cy="16" r="1" />
        </svg>
      ),
      label: "Critical Issues",
      value: abnormalChanges,
      trend: abnormalChanges > 0 ? "Attention needed" : "All good",
      trendColor: abnormalChanges > 0 ? "text-red-500" : "text-green-500",
      bg: "bg-red-500",
    },
  ];

  // Get recent changes (latest 3)
  // Get recent changes (latest 3)
const recentChanges = changeList
  .sort((a, b) => new Date(b.date || b.created_at || '').getTime() - new Date(a.date || a.created_at || '').getTime())
  .slice(0, 3)
  .map(item => ({
    type: item.four_m?.toUpperCase() || 'UNKNOWN',
    title: item.category_details?.description?.substring(0, 40) + (item.category_details?.description?.length && item.category_details.description.length > 40 ? '...' : '') || 'No description',
    action: item.action_details?.action_taken?.substring(0, 30) + (item.action_details?.action_taken?.length && item.action_details.action_taken.length > 30 ? '...' : '') || 'No action',
    category: item.category_details?.category_type || 'Unknown',
          date: item.date ? new Date(item.date).toLocaleDateString() : 'No date',
    setUpApproval: item.action_details?.set_up_approval || false,
    retroactiveInspection: item.action_details?.retroactive_inspection || false,
    suspectedLotCheck: item.action_details?.suspected_lot_check || false,
    color: item.four_m === 'Man' ? 'bg-blue-600' : 
           item.four_m === 'Machine/Tool' ? 'bg-green-500' :
           item.four_m === 'Material' ? 'bg-purple-500' : 'bg-orange-500',
    priorityColor: item.category_details?.category_type === 'Abnormal' ? 'bg-red-100 text-red-600' :
                   item.category_details?.category_type === 'Unplanned' ? 'bg-orange-100 text-orange-600' :
                   'bg-green-100 text-green-600',
  }));

  if (loading) {
    return (
      <div className="bg-[#f6faff] min-h-screen p-6 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading dashboard...</div>
      </div>
    );
  }


  // Utility to get month name
    const getMonthName = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleString('default', { month: 'short' });
    };
    
    type MonthlyCountAccumulator = Record<string, { value: number, count: number, name: string }>;

    // New function to prepare the trend chart data
    const prepareMonthlyTrendData = (): DataPoint[] => {
        // 1. Group changes by month and count them
        // FIX: Use the MonthlyCountAccumulator type for the accumulator
        const monthlyCounts = changeList.reduce((acc: MonthlyCountAccumulator, item) => {
            const dateStr = item.date || item.created_at;
            if (!dateStr) return acc;

            // Use YYYY-MM as the key to ensure correct order
            const yearMonth = dateStr.substring(0, 7);
            const monthName = getMonthName(dateStr); 

            // FIX: Ensure 'name' is initialized on the accumulator object
            acc[yearMonth] = acc[yearMonth] || { value: 0, count: 0, name: monthName };
            acc[yearMonth].value += 1;
            acc[yearMonth].count += 1;

            return acc;
        // FIX: Initialize with an empty object of the correct type
        }, {} as MonthlyCountAccumulator); 

        // 2. Sort by month key and map to the required format
        const sortedMonths = Object.keys(monthlyCounts).sort();
        const monthlyData: DataPoint[] = sortedMonths.map(key => ({
            // This line is now valid because monthlyCounts[key] is guaranteed to have 'name'
            name: monthlyCounts[key].name, 
            value: monthlyCounts[key].value,
        }));

        // ... rest of the function (average calculation)
        const totalValue = monthlyData.reduce((sum, item) => sum + item.value, 0);
        const averageValue = monthlyData.length > 0 ? totalValue / monthlyData.length : 0;

        if (monthlyData.length > 0) {
            monthlyData.push({
                name: "AVG (All)",
                value: parseFloat(averageValue.toFixed(2)),
                isAverage: true,
            });
        }

        // Fallback logic
        if (monthlyData.length === 0) {
            return [
                { name: "Apr", value: 10 },
                { name: "May", value: 8 },
                { name: "Jun", value: 6 },
                { name: "Jul", value: 3 },
                { name: "AVG (QTR)", value: 6.75, isAverage: true },
            ];
        }

        return monthlyData;
    };

    const monthlyTrendData = prepareMonthlyTrendData();

  return (
    <div className="bg-[#f6faff] min-h-screen p-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 p-8 mb-8 relative overflow-hidden transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        {/* 4M Change Management  */}
        <p className="text-white text-lg mb-6">Monitor, manage and track all manufacturing changes in real-time</p>
        <div className="flex gap-4">
          <button className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200">
            <span className="text-xl">+</span> New Change Request
          </button>
          <button className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 17v-2a4 4 0 0 1 8 0v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            View All Records
          </button>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-white/10 rounded-full pointer-events-none"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} mb-2`}>
              {stat.icon}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{stat.value}</span>
              <span className={`text-sm font-semibold ${stat.trendColor}`}>{stat.trend}</span>
            </div>
            <span className="text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* New Quarterly Monitoring Chart Section */}
          {monthlyTrendData.length > 0 && (
            <div className="grid grid-cols-1 mb-8">
              <QuarterlyMonitoringChart
                data={monthlyTrendData}
                title="Monthly Change Count Trend"
                subtitle="Total changes per month vs. target & average"
                targetValue={3} // Set your target here
                yAxisLabel="Change Count"
                barColor="#3498db"
                averageColor="#e74c3c"
                trendLineColor="#000"
              />
            </div>
          )}

      {/* Enhanced Charts Section */}
      {/* {changeList.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"> */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"> */}
          {/* New Quarterly Monitoring Chart Section */}
          {/* {monthlyTrendData.length > 0 && (
            <div className="grid grid-cols-1 mb-8">
              <QuarterlyMonitoringChart
                data={monthlyTrendData}
                title="Monthly Change Count Trend"
                subtitle="Total changes per month vs. target & average"
                targetValue={3} // Set your target here
                yAxisLabel="Change Count"
                barColor="#3498db"
                averageColor="#e74c3c"
                trendLineColor="#000"
              />
            </div>
          )} */}
          
          {/* Enhanced 4M Distribution Bar Chart */}
          {/* <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">4M Changes Distribution</h3>
                  <p className="text-sm text-gray-500">Manufacturing change breakdown</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart 
                data={prepare4MChartData()} 
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <defs>
                  <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="barGradient4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#D97706" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#f0f0f0" 
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickLine={{ stroke: '#E5E7EB' }}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px',
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  name="Changes"
                  radius={[8, 8, 0, 0]}
                >
                  {prepare4MChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#barGradient${index + 1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div> */}

          {/* Enhanced Category Distribution Pie Chart */}
          {/* <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v10l7 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Category Distribution</h3>
                  <p className="text-sm text-gray-500">Change type breakdown</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Updated now</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={340}>
              <RechartsPieChart>
                <defs>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0, 0, 0, 0.1)"/>
                  </filter>
                </defs>
                <Pie
                  data={prepareCategoryChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // label={({ name, percent }) => `${name}\n${((percent || 0) * 100).toFixed(1)}%`}
                  label={({ name, percent }) => `${name}\n${(Number(percent ?? 0) * 100).toFixed(1)}%`}
                  outerRadius={110}
                  innerRadius={60}
                  paddingAngle={5}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ filter: 'url(#shadow)' }}
                >
                  {prepareCategoryChartData().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="#ffffff"
                      strokeWidth={3}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px',
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer> */}
            
            {/* Custom Legend */}
            {/* <div className="flex justify-center mt-4">
              <div className="flex flex-wrap gap-4">
                {prepareCategoryChartData().map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : ( */}


      {/* Enhanced Charts Section */}
{changeList.length > 0 ? (
  <div className="space-y-6 mb-8">
    {/* 4M Distribution Charts - Quarterly and Monthly */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quarterly 4M Distribution (Jul-Sep) */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">4M Changes - Quarterly</h3>
              <p className="text-sm text-gray-500">{getQuarterLabel()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Q3</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={prepare4MQuarterlyData()} 
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <defs>
              <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.8}/>
              </linearGradient>
              <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
              </linearGradient>
              <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8}/>
              </linearGradient>
              <linearGradient id="barGradient4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#D97706" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
              }}
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Bar dataKey="count" name="Changes" radius={[8, 8, 0, 0]}>
              {prepare4MQuarterlyData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#barGradient${index + 1})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quarterly Category Distribution (Jul-Sep) */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v10l7 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Category - Quarterly</h3>
              <p className="text-sm text-gray-500">{getQuarterLabel()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Q3</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <defs>
              <filter id="shadowQuarterly" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0, 0, 0, 0.1)"/>
              </filter>
            </defs>
            <Pie
              data={prepareCategoryQuarterlyData()}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}\n${(Number(percent ?? 0) * 100).toFixed(1)}%`}
              outerRadius={90}
              innerRadius={50}
              paddingAngle={5}
              fill="#8884d8"
              dataKey="value"
              style={{ filter: 'url(#shadowQuarterly)' }}
            >
              {prepareCategoryQuarterlyData().map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="#ffffff"
                  strokeWidth={3}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
        <div className="flex justify-center mt-4">
          <div className="flex flex-wrap gap-4">
            {prepareCategoryQuarterlyData().map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm font-medium text-gray-700">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      
    </div>

    {/* Category Distribution Charts - Quarterly and Monthly */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Current Month 4M Distribution (October) */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">4M Changes - This Month</h3>
              <p className="text-sm text-gray-500">October 2025</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={prepare4MCurrentMonthData()} 
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
              }}
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Bar dataKey="count" name="Changes" radius={[8, 8, 0, 0]}>
              {prepare4MCurrentMonthData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#barGradient${index + 1})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      

      {/* Current Month Category Distribution (October) */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v10l7 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Category - This Month</h3>
              <p className="text-sm text-gray-500">October 2025</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Updated now</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <defs>
              <filter id="shadowMonthly" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0, 0, 0, 0.1)"/>
              </filter>
            </defs>
            <Pie
              data={prepareCategoryCurrentMonthData()}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}\n${(Number(percent ?? 0) * 100).toFixed(1)}%`}
              outerRadius={90}
              innerRadius={50}
              paddingAngle={5}
              fill="#8884d8"
              dataKey="value"
              style={{ filter: 'url(#shadowMonthly)' }}
            >
              {prepareCategoryCurrentMonthData().map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="#ffffff"
                  strokeWidth={3}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
        <div className="flex justify-center mt-4">
          <div className="flex flex-wrap gap-4">
            {prepareCategoryCurrentMonthData().map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm font-medium text-gray-700">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
) : (
        // No data state with better design
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Enhanced No Data Bar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">4M Changes Distribution</h3>
                <p className="text-sm text-gray-500">Manufacturing change breakdown</p>
              </div>
            </div>
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h4>
              <p className="text-sm text-center">Add some 4M changes to see the distribution chart</p>
            </div>
          </div>

          {/* Enhanced No Data Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v10l7 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Category Distribution</h3>
                <p className="text-sm text-gray-500">Change type breakdown</p>
              </div>
            </div>
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v10l7 7" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-600 mb-2">No Categories Yet</h4>
              <p className="text-sm text-center">Chart will appear when you add change records</p>
            </div>
          </div>
        </div>
      )}
      

      {/* Additional Analytics */}
      {changeList.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Activities Summary */}
          <div className="bg-white rounded-xl shadow p-6 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
            <h3 className="font-semibold text-lg mb-4">Activities Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Approvals</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-yellow-500 rounded-full" 
                      style={{ width: `${totalChanges > 0 ? (pendingApprovals/totalChanges)*100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{pendingApprovals}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Set-Up Approvals</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full" 
                      style={{ width: `${totalChanges > 0 ? (setUpApprovals/totalChanges)*100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{setUpApprovals}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Retroactive Inspections</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-orange-500 rounded-full" 
                      style={{ width: `${totalChanges > 0 ? (retroactiveInspections/totalChanges)*100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{retroactiveInspections}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Suspected Lot Checks</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-red-500 rounded-full" 
                      style={{ width: `${totalChanges > 0 ? (suspectedLotChecks/totalChanges)*100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{suspectedLotChecks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl shadow p-6 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
            <h3 className="font-semibold text-lg mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Planned</span>
                </div>
                <span className="font-semibold">{plannedChanges}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span>Unplanned</span>
                </div>
                <span className="font-semibold">{unplannedChanges}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span>Abnormal</span>
                </div>
                <span className="font-semibold">{abnormalChanges}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Changes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-lg">Recent Changes</span>
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
            <span>View All</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {recentChanges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentChanges.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                  <span className="uppercase text-xs font-semibold text-gray-500">{item.type}</span>
                  <div className="ml-auto flex gap-2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                    </svg>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </div>
                </div>
                <div className="font-semibold text-lg">{item.title}</div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Action Taken</span>
                  <span className="text-gray-800 font-medium">{item.action}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Category</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.priorityColor}`}>{item.category}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Date</span>
                  <span className="text-gray-800 font-medium">{item.date}</span>
                </div>
                <div className="mt-2 flex gap-2">
                  {item.setUpApproval && (
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Set-Up</span>
                  )}
                  {item.retroactiveInspection && (
                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">Inspection</span>
                  )}
                  {item.suspectedLotCheck && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Lot Check</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-8 text-center transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
            <div className="text-gray-400 text-lg mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path d="M9 17v-2a4 4 0 0 1 8 0v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              No change records found
            </div>
            <p className="text-gray-500">Start by adding your first 4M change record to see analytics and insights here.</p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5">
              Add First Record
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardView;
