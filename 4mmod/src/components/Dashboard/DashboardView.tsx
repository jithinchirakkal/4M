import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart,
  Cell, Pie,
  Sector, 
} from 'recharts';

import QuarterlyMonitoringChart, { DataPoint } from "./QuarterlyMonitoringChart"; 

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// --- Original Types (Unchanged) ---
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
// --- End Original Types ---

// Custom Tooltip for Recharts (Enhanced visual style)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const name = payload[0].name;
    const color = payload[0].color || payload[0].payload.color;
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-2xl border border-gray-200 text-sm">
        <p className="text-gray-500 mb-1">{name}</p>
        <p className="font-bold text-gray-800" style={{ color: color }}>
          Changes: {value}
        </p>
      </div>
    );
  }
  return null;
};

// Custom Active Shape for Pie Chart 
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  
  return (
    <g>
      <text x={cx} y={cy} dy={-5} textAnchor="middle" fill={fill} className="font-bold text-xl">{`${value}`}</text>
      <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#9CA3AF" className="text-xs">{`${payload.name}`}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8} // Slightly expanded active slice
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="transition-all duration-300 ease-in-out"
        stroke="#fff"
      />
    </g>
  );
};

const DashboardView = () => {
  const [changeList, setChangeList] = useState<ChangeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); 

  // --- Original Logic (Unchanged) ---
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

  const prepareCategoryChartData = (list: ChangeItem[]) => {
    const counts = list.reduce((acc: Record<string, number>, item) => {
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

  const filterChangesByDate = (list: ChangeItem[], monthStart: number, monthEnd: number) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    return list.filter(item => {
      const dateStr = item.date || item.created_at;
      if (!dateStr) return false;
      const itemDate = new Date(dateStr);
      const month = itemDate.getMonth();
      const year = itemDate.getFullYear();
      return year === currentYear && month >= monthStart && month <= monthEnd;
    });
  };

  const prepare4MDataForPeriod = (list: ChangeItem[]) => {
    const counts = list.reduce((acc: Record<string, number>, item) => {
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

  const quarterlyChanges = filterChangesByDate(changeList, 6, 8); // Jul (6) - Sep (8)
  const currentMonth = new Date().getMonth(); // 9 for October
  const monthlyChanges = filterChangesByDate(changeList, currentMonth, currentMonth);

  const prepare4MQuarterlyData = () => prepare4MDataForPeriod(quarterlyChanges);
  const prepare4MCurrentMonthData = () => prepare4MDataForPeriod(monthlyChanges);
  const prepareCategoryQuarterlyData = () => prepareCategoryChartData(quarterlyChanges);
  const prepareCategoryCurrentMonthData = () => prepareCategoryChartData(monthlyChanges);

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
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect width="20" height="14" x="2" y="5" rx="2" />
        </svg>
      ),
      label: "Total Changes",
      value: totalChanges,
      trend: totalChanges > 0 ? `${totalChanges} records` : "No data",
      trendColor: "text-blue-500",
      bg: "bg-blue-600",
      gradient: "from-blue-600 to-blue-400",
      shadow: "shadow-blue-500/50 hover:shadow-blue-600/70"
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      label: "Pending Approvals",
      value: pendingApprovals,
      trend: `${((pendingApprovals/totalChanges)*100 || 0).toFixed(1)}%`,
      trendColor: "text-yellow-500",
      bg: "bg-yellow-500",
      gradient: "from-yellow-500 to-amber-300",
      shadow: "shadow-yellow-500/50 hover:shadow-yellow-600/70"
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" />
        </svg>
      ),
      label: "Planned Changes",
      value: plannedChanges,
      trend: `${((plannedChanges/totalChanges)*100 || 0).toFixed(1)}%`,
      trendColor: "text-green-500",
      bg: "bg-green-500",
      gradient: "from-green-500 to-emerald-300",
      shadow: "shadow-green-500/50 hover:shadow-green-600/70"
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
      gradient: "from-red-600 to-rose-400",
      shadow: "shadow-red-500/50 hover:shadow-red-600/70"
    },
  ];

  // Get recent changes (latest 3)
  const recentChanges = changeList
    .sort((a, b) => new Date(b.date || b.created_at || '').getTime() - new Date(a.date || a.created_at || '').getTime())
    .slice(0, 3)
    .map(item => {
      const fourM = item.four_m || 'Unknown';
      return {
        type: fourM.toUpperCase(),
        title: item.category_details?.description?.substring(0, 40) + (item.category_details?.description?.length && item.category_details.description.length > 40 ? '...' : '') || 'No description',
        action: item.action_details?.action_taken?.substring(0, 30) + (item.action_details?.action_taken?.length && item.action_details.action_taken.length > 30 ? '...' : '') || 'No action',
        category: item.category_details?.category_type || 'Unknown',
        date: item.date ? new Date(item.date).toLocaleDateString() : 'No date',
        setUpApproval: item.action_details?.set_up_approval || false,
        retroactiveInspection: item.action_details?.retroactive_inspection || false,
        suspectedLotCheck: item.action_details?.suspected_lot_check || false,
        color: fourM === 'Man' ? 'bg-blue-600' : 
              fourM === 'Machine/Tool' ? 'bg-green-500' :
              fourM === 'Material' ? 'bg-purple-500' : 'bg-orange-500',
        priorityColor: item.category_details?.category_type === 'Abnormal' ? 'bg-red-500/10 text-red-600 border border-red-500/30' :
                      item.category_details?.category_type === 'Unplanned' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/30' :
                      'bg-green-500/10 text-green-600 border border-green-500/30',
      };
    });

  if (loading) {
    return (
      <div className="bg-[#f2f4f8] min-h-screen p-10 flex items-center justify-center">
        <div className="text-xl text-gray-500 animate-pulse flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading dashboard data...
        </div>
      </div>
    );
  }

  // Utility to get month name
  const getMonthName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('default', { month: 'short' });
  };
    
  type MonthlyCountAccumulator = Record<string, { value: number, count: number, name: string }>;

  // Original function to prepare the trend chart data (Unchanged logic)
  const prepareMonthlyTrendData = (): DataPoint[] => {
    const monthlyCounts = changeList.reduce((acc: MonthlyCountAccumulator, item) => {
      const dateStr = item.date || item.created_at;
      if (!dateStr) return acc;

      const yearMonth = dateStr.substring(0, 7);
      const monthName = getMonthName(dateStr); 

      acc[yearMonth] = acc[yearMonth] || { value: 0, count: 0, name: monthName };
      acc[yearMonth].value += 1;
      acc[yearMonth].count += 1;

      return acc;
    }, {} as MonthlyCountAccumulator); 

    const sortedMonths = Object.keys(monthlyCounts).sort();
    const monthlyData: DataPoint[] = sortedMonths.map(key => ({
      name: monthlyCounts[key].name, 
      value: monthlyCounts[key].value,
    }));

    const totalValue = monthlyData.reduce((sum, item) => sum + item.value, 0);
    const averageValue = monthlyData.length > 0 ? totalValue / monthlyData.length : 0;

    if (monthlyData.length > 0) {
      monthlyData.push({
        name: "AVG (All)",
        value: parseFloat(averageValue.toFixed(2)),
        isAverage: true,
      });
    }

    if (monthlyData.length === 0) {
      return [
        { name: "Jan", value: 0 },
        { name: "Feb", value: 0 },
        { name: "Mar", value: 0 },
      ];
    }

    return monthlyData;
  };

  const monthlyTrendData = prepareMonthlyTrendData();

  // Handler for Pie chart interaction
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="min-h-screen p-6 font-sans">
      
      {/* --- Main Header Card: Max Color & Attraction --- */}
      <div className="rounded-3xl bg-white p-8 mb-10 shadow-2xl transition-all duration-500 transform hover:scale-[1.01] relative overflow-hidden ring-8 ring-blue-500/20 hover:ring-purple-500/30">
        
        {/* Dynamic Inner Background Glow Effect on Hover */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
            {/* Highly visible Gradient Text */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700">4M Change Management</span>
          </h1>
          <p className="text-gray-600 text-lg mb-6 max-w-2xl font-medium">
            Monitor, manage, and track all manufacturing changes in real-time to maintain peak quality standards.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-blue-600/50 flex items-center gap-2 font-bold uppercase tracking-wide transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
              New Change Request
            </button>
            <button className="bg-white text-gray-700 ring-4 ring-gray-300/50 hover:ring-purple-500/50 hover:bg-purple-50/50 px-8 py-3 rounded-xl shadow-md flex items-center gap-2 font-semibold transition-all duration-300 transform hover:scale-[1.02]">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 17v-2a4 4 0 0 1 8 0v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              View All Records
            </button>
          </div>
        </div>
      </div>

      {/* --- Stats Cards: Color + Deep Shadow + Hover --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-white rounded-2xl p-6 relative overflow-hidden transition-all duration-300 transform hover:scale-[1.03] border border-gray-100/50 shadow-lg ${stat.shadow}`}>
            
            {/* Background Gradient Circle (Stronger Opacity) */}
            <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-20 bg-gradient-to-br ${stat.gradient} blur-sm`}></div>
            
            <div className="flex flex-col gap-4 relative z-10">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} shadow-xl shadow-gray-400/40`}>
                {stat.icon}
              </div>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-extrabold text-gray-900 leading-none">{stat.value}</span>
                <span className={`text-sm font-bold ${stat.trendColor} px-3 py-1 rounded-full bg-current/10 uppercase`}>{stat.trend}</span>
              </div>
              <span className="text-lg font-medium text-gray-500 mt-1">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Trend Chart - Full Width, High Impact */}
      {monthlyTrendData.length > 0 && (
        <div className="mb-10">
          <QuarterlyMonitoringChart
            data={monthlyTrendData}
            title="Monthly Change Count Trend"
            subtitle="Total changes per month vs. target & average across all 4Ms"
            targetValue={5} 
            yAxisLabel="Change Count"
            barColor="#3B82F6"
            averageColor="#EF4444"
            trendLineColor="#8B5CF6"
          />
        </div>
      )}

      {/* Enhanced Charts Section - Two-Row Layout for Quarterly & Monthly Comparison */}
      {changeList.length > 0 ? (
        <div className="space-y-8 mb-10">
          
          {/* Row 1: Quarterly (Q3) Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quarterly 4M Distribution (Jul-Sep) - Modern Bar Chart */}
            <ChartCard 
              title="4M Changes - Quarterly"
              subtitle="Jul-Sep Analysis"
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
              iconGradient="from-blue-500 to-indigo-500"
              statusLabel="Q3"
            >
              <ResponsiveContainer width="100%" height={320}>
                <BarChart 
                  data={prepare4MQuarterlyData()} 
                  margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 14, fill: '#6B7280', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Changes" radius={[6, 6, 0, 0]}>
                    {prepare4MQuarterlyData().map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        className="hover:opacity-80 transition-opacity duration-150"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Quarterly Category Distribution (Jul-Sep) - Modern Pie Chart */}
            <ChartCard 
              title="Category Distribution - Quarterly"
              subtitle="Planned, Unplanned, Abnormal"
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 2v10l7 7" /></svg>}
              iconGradient="from-purple-500 to-pink-500"
              statusLabel="Q3"
            >
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie 
                    {...({ activeIndex, activeShape: renderActiveShape } as any)}
                    data={prepareCategoryQuarterlyData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    onMouseEnter={onPieEnter}
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                    className="shadow-md"
                  >
                    {prepareCategoryQuarterlyData().map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke={activeIndex === index ? entry.color : "#ffffff"} 
                        strokeWidth={activeIndex === index ? 4 : 2}
                        className="cursor-pointer transition-all duration-300 ease-in-out"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Custom Legend for Pie Chart */}
              <div className="flex justify-center mt-4">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {prepareCategoryQuarterlyData().map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 font-medium text-gray-700">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <span>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Row 2: Current Month (October) Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Month 4M Distribution (October) - Modern Bar Chart */}
            <ChartCard 
              title="4M Changes - This Month"
              subtitle={`October ${new Date().getFullYear()} Focus`}
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
              iconGradient="from-green-500 to-teal-500"
              statusLabel="Live Data"
            >
              <ResponsiveContainer width="100%" height={320}>
                <BarChart 
                  data={prepare4MCurrentMonthData()} 
                  margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 14, fill: '#6B7280', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Changes" radius={[6, 6, 0, 0]}>
                    {prepare4MCurrentMonthData().map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        className="hover:opacity-80 transition-opacity duration-150"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            
            {/* Current Month Category Distribution (October) - Modern Pie Chart */}
            <ChartCard 
              title="Category Distribution - This Month"
              subtitle={`Risk profile for October ${new Date().getFullYear()}`}
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 2v10l7 7" /></svg>}
              iconGradient="from-orange-500 to-red-500"
              statusLabel="High Alert"
              statusColor="text-red-600"
            >
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie 
                    {...({ activeIndex, activeShape: renderActiveShape } as any)}
                    data={prepareCategoryCurrentMonthData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    onMouseEnter={onPieEnter}
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                    className="shadow-md"
                  >
                    {prepareCategoryCurrentMonthData().map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke={activeIndex === index ? entry.color : "#ffffff"} 
                        strokeWidth={activeIndex === index ? 4 : 2}
                        className="cursor-pointer transition-all duration-300 ease-in-out"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Custom Legend for Pie Chart */}
              <div className="flex justify-center mt-4">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {prepareCategoryCurrentMonthData().map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 font-medium text-gray-700">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <span>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      ) : (
        /* No Data State - Highly Polished */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <NoDataCard title="4M Changes Distribution" subtitle="Manufacturing change breakdown" iconColor="text-blue-500" />
          <NoDataCard title="Category Distribution" subtitle="Change type breakdown" iconColor="text-purple-500" />
        </div>
      )}

      {/* --- Additional Analytics and Recent Changes: Finalized Design --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* Analytics Summary - Progress Bars & Key Figures */}
        {changeList.length > 0 && (
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-8 border border-gray-100/50 transition-all duration-300 transform hover:shadow-2xl hover:ring-2 hover:ring-blue-500/20">
            <h3 className="font-extrabold text-2xl text-gray-900 mb-6 border-b pb-4 border-gray-100">Action Summary 🎯</h3>
            <div className="space-y-6">
              <AnalyticsItem label="Planned Changes" value={plannedChanges} total={totalChanges} color="bg-green-500" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>} />
              <AnalyticsItem label="Unplanned Changes" value={unplannedChanges} total={totalChanges} color="bg-orange-500" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
              <AnalyticsItem label="Abnormal Changes" value={abnormalChanges} total={totalChanges} color="bg-red-600" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
            </div>

            <h4 className="font-bold text-lg text-gray-700 mt-8 mb-4">Post-Change Actions</h4>
            <div className="space-y-4">
              <ActionItem label="Pending Approvals" count={pendingApprovals} total={totalChanges} color="bg-yellow-500" />
              <ActionItem label="Set-Up Approvals" count={setUpApprovals} total={totalChanges} color="bg-blue-500" />
              <ActionItem label="Retroactive Inspections" count={retroactiveInspections} total={totalChanges} color="bg-purple-500" />
              <ActionItem label="Suspected Lot Checks" count={suspectedLotChecks} total={totalChanges} color="bg-red-500" />
            </div>
          </div>
        )}

        {/* Recent Changes - Clean List/Card View */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-extrabold text-2xl text-gray-900">Recent Change Activity ⚡</h2>
            <button className="bg-white text-gray-700 ring-1 ring-gray-300 hover:ring-blue-500 hover:text-blue-600 px-4 py-2 rounded-xl font-semibold flex items-center gap-1 transition-all duration-300">
              <span>View All</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          
          {recentChanges.length > 0 ? (
            <div className="space-y-4">
              {recentChanges.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-300 hover:shadow-2xl hover:ring-4 hover:ring-purple-500/10 border border-gray-100/50">
                  <div className="flex items-start md:items-center flex-grow space-x-4 mb-4 md:mb-0">
                    <span className={`flex-shrink-0 w-3 h-3 rounded-full ${item.color} shadow-lg shadow-gray-400/30`}></span>
                    <div className="min-w-0">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${item.priorityColor} mb-1`}>{item.category} / {item.type}</span>
                      <div className="font-bold text-lg text-gray-900 truncate">{item.title}</div>
                      <div className="text-sm text-gray-500 mt-1">Action: <span className="text-gray-700 font-medium">{item.action}</span></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:items-end flex-shrink-0 min-w-[150px]">
                    <span className="text-sm font-medium text-gray-500 mb-2">Change Date: <span className="font-semibold text-gray-700">{item.date}</span></span>
                    <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                      {item.setUpApproval && (<Badge label="Set-Up Approved" color="bg-blue-100 text-blue-700" />)}
                      {item.retroactiveInspection && (<Badge label="Inspection Done" color="bg-orange-100 text-orange-700" />)}
                      {item.suspectedLotCheck && (<Badge label="Lot Check OK" color="bg-red-100 text-red-700" />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NoRecordsPlaceholder />
          )}
        </div>
      </div>
    </div>
  );
};

// --- Helper Components (Unchanged UI logic) ---

interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconGradient: string;
  statusLabel: string;
  statusColor?: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, icon, iconGradient, statusLabel, statusColor = 'text-gray-500', children }) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100/50 transition-all duration-300 transform hover:shadow-2xl hover:ring-4 hover:ring-blue-500/10">
    <div className="flex items-start justify-between mb-6 border-b border-gray-100 pb-4">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${iconGradient} rounded-xl flex items-center justify-center shadow-lg shadow-gray-400/30`}>
          {icon}
        </div>
        <div>
          <h3 className="font-extrabold text-xl text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className={`text-sm font-bold ${statusColor} bg-gray-100/50 px-3 py-1 rounded-full border border-gray-200`}>
        {statusLabel}
      </div>
    </div>
    {children}
  </div>
);

const NoDataCard: React.FC<{ title: string; subtitle: string; iconColor: string }> = ({ title, subtitle, iconColor }) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100/50 transition-all duration-300 transform hover:shadow-2xl hover:ring-4 hover:ring-gray-300/10">
    <div className="flex items-start gap-4 mb-6 border-b border-gray-100 pb-4">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
        <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      </div>
      <div>
        <h3 className="font-extrabold text-xl text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
    <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50/70 rounded-xl border border-dashed border-gray-200/80">
      <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 border-4 ${iconColor.replace('text', 'border')}/20`}>
        <svg className={`w-8 h-8 ${iconColor}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9.879 16.121A3 3 0 1012.001 19l1.414-1.414a3 3 0 00-4.242-4.242L7.758 9.879A3 3 0 105 12.001l1.414 1.414a3 3 0 004.242 4.242L12.001 19a3 3 0 102.121-5.121L12 12.001" /></svg>
      </div>
      <h4 className="text-lg font-semibold text-gray-700 mb-2">Data Pending</h4>
      <p className="text-sm text-center text-gray-500 max-w-xs">Chart data will populate once change records are fetched successfully.</p>
    </div>
  </div>
);

const AnalyticsItem: React.FC<{ label: string; value: number; total: number; color: string; icon: React.ReactNode }> = ({ label, value, total, color, icon }) => {
  const percent = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 group hover:bg-gray-50/50 transition-colors duration-150 rounded-md px-1 -mx-1">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white/90 shadow-md shadow-gray-400/20`}>
          {icon}
        </div>
        <span className="text-gray-600 font-medium group-hover:text-gray-800 transition-colors">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-extrabold text-gray-900 min-w-[30px] text-right">{value}</span>
      </div>
    </div>
  );
};

const ActionItem: React.FC<{ label: string; count: number; total: number; color: string }> = ({ label, count, total, color }) => {
  const percent = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="group hover:bg-gray-50/50 transition-colors duration-150 rounded-md p-2 -m-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600 group-hover:text-gray-800 font-medium transition-colors">{label}</span>
        <span className="text-sm font-bold text-gray-800">{count}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner shadow-gray-300/50">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-700 ease-out`} 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};

const Badge: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
    {label}
  </span>
);

const NoRecordsPlaceholder: React.FC = () => (
    <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-gray-100/50 transition-all duration-300 transform hover:shadow-2xl">
        <div className="text-gray-400 text-lg mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-blue-400/50" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path d="M9 17v-2a4 4 0 0 1 8 0v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="font-extrabold text-xl text-gray-700">No Change Records Found</span>
        </div>
        <p className="text-gray-500 max-w-md mx-auto">The dashboard is ready to go! Start by adding your first 4M change record to unlock comprehensive analytics and real-time insights.</p>
        <button className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40 transform hover:-translate-y-0.5">
            Add First Record
        </button>
    </div>
);

export default DashboardView;



// import React, { useState, useEffect } from "react";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//   PieChart as RechartsPieChart, Cell, Pie, LineChart, Line
// } from 'recharts';

// import QuarterlyMonitoringChart, { DataPoint } from "./QuarterlyMonitoringChart";

// const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

// // Define types for better TypeScript support
// interface ChangeItem {
//   four_m: string;
//   date?: string;
//   created_at?: string;
//   category_details?: {
//     category_type: string;
//     description: string;
//   };
//   action_details?: {
//     action_taken: string;
//     set_up_approval: boolean;
//     retroactive_inspection: boolean;
//     suspected_lot_check: boolean;
//   };
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
//       { name: 'Machine', count: counts['Machine/Tool'] || 0, color: '#10B981' },
//       { name: 'Material', count: counts['Material'] || 0, color: '#8B5CF6' },
//       { name: 'Method', count: counts['Method'] || 0, color: '#F59E0B' },
//     ];
//   };

//   const prepareCategoryChartData = () => {
//   const counts = changeList.reduce((acc: Record<string, number>, item) => {
//     const categoryType = item.category_details?.category_type || 'Unknown';
//     acc[categoryType] = (acc[categoryType] || 0) + 1;
//     return acc;
//   }, {});
    
//     return Object.entries(counts).map(([category, count], index) => ({
//       name: category,
//       value: count as number,
//       color: COLORS[index % COLORS.length],
//     }));
//   };

//   // Prepare 4M Chart Data for Quarterly (Jul-Sep)
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

// // Prepare 4M Chart Data for Current Month (October)
// const prepare4MCurrentMonthData = () => {
//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth(); // 9 for October
//   const currentYear = currentDate.getFullYear();

//   const monthlyChanges = changeList.filter(item => {
//     const dateStr = item.date || item.created_at;
//     if (!dateStr) return false;
    
//     const itemDate = new Date(dateStr);
//     return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
//   });

//   const counts = monthlyChanges.reduce((acc: Record<string, number>, item) => {
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

// // Prepare Category Chart Data for Quarterly (Jul-Sep)
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

// // Prepare Category Chart Data for Current Month (October)
// const prepareCategoryCurrentMonthData = () => {
//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth();
//   const currentYear = currentDate.getFullYear();

//   const monthlyChanges = changeList.filter(item => {
//     const dateStr = item.date || item.created_at;
//     if (!dateStr) return false;
    
//     const itemDate = new Date(dateStr);
//     return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
//   });

//   const counts = monthlyChanges.reduce((acc: Record<string, number>, item) => {
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

//   // Calculate statistics
// // Calculate statistics
// const totalChanges = changeList.length;
// const setUpApprovals = changeList.filter(item => item.action_details?.set_up_approval).length;
// const retroactiveInspections = changeList.filter(item => item.action_details?.retroactive_inspection).length;
// const suspectedLotChecks = changeList.filter(item => item.action_details?.suspected_lot_check).length;
// const pendingApprovals = changeList.filter(item => 
//   !item.action_details?.set_up_approval && 
//   !item.action_details?.retroactive_inspection && 
//   !item.action_details?.suspected_lot_check
// ).length;
//   const plannedChanges = changeList.filter(item => item.category_details?.category_type === 'Planned').length;
//   const unplannedChanges = changeList.filter(item => item.category_details?.category_type === 'Unplanned').length;
//   const abnormalChanges = changeList.filter(item => item.category_details?.category_type === 'Abnormal').length;

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
//   // Get recent changes (latest 3)
// const recentChanges = changeList
//   .sort((a, b) => new Date(b.date || b.created_at || '').getTime() - new Date(a.date || a.created_at || '').getTime())
//   .slice(0, 3)
//   .map(item => ({
//     type: item.four_m?.toUpperCase() || 'UNKNOWN',
//     title: item.category_details?.description?.substring(0, 40) + (item.category_details?.description?.length && item.category_details.description.length > 40 ? '...' : '') || 'No description',
//     action: item.action_details?.action_taken?.substring(0, 30) + (item.action_details?.action_taken?.length && item.action_details.action_taken.length > 30 ? '...' : '') || 'No action',
//     category: item.category_details?.category_type || 'Unknown',
//           date: item.date ? new Date(item.date).toLocaleDateString() : 'No date',
//     setUpApproval: item.action_details?.set_up_approval || false,
//     retroactiveInspection: item.action_details?.retroactive_inspection || false,
//     suspectedLotCheck: item.action_details?.suspected_lot_check || false,
//     color: item.four_m === 'Man' ? 'bg-blue-600' : 
//            item.four_m === 'Machine/Tool' ? 'bg-green-500' :
//            item.four_m === 'Material' ? 'bg-purple-500' : 'bg-orange-500',
//     priorityColor: item.category_details?.category_type === 'Abnormal' ? 'bg-red-100 text-red-600' :
//                    item.category_details?.category_type === 'Unplanned' ? 'bg-orange-100 text-orange-600' :
//                    'bg-green-100 text-green-600',
//   }));

//   if (loading) {
//     return (
//       <div className="bg-[#f6faff] min-h-screen p-6 flex items-center justify-center">
//         <div className="text-xl text-gray-500">Loading dashboard...</div>
//       </div>
//     );
//   }


//   // Utility to get month name
//     const getMonthName = (dateStr: string) => {
//       const date = new Date(dateStr);
//       return date.toLocaleString('default', { month: 'short' });
//     };
    
//     type MonthlyCountAccumulator = Record<string, { value: number, count: number, name: string }>;

//     // New function to prepare the trend chart data
//     const prepareMonthlyTrendData = (): DataPoint[] => {
//         // 1. Group changes by month and count them
//         // FIX: Use the MonthlyCountAccumulator type for the accumulator
//         const monthlyCounts = changeList.reduce((acc: MonthlyCountAccumulator, item) => {
//             const dateStr = item.date || item.created_at;
//             if (!dateStr) return acc;

//             // Use YYYY-MM as the key to ensure correct order
//             const yearMonth = dateStr.substring(0, 7);
//             const monthName = getMonthName(dateStr); 

//             // FIX: Ensure 'name' is initialized on the accumulator object
//             acc[yearMonth] = acc[yearMonth] || { value: 0, count: 0, name: monthName };
//             acc[yearMonth].value += 1;
//             acc[yearMonth].count += 1;

//             return acc;
//         // FIX: Initialize with an empty object of the correct type
//         }, {} as MonthlyCountAccumulator); 

//         // 2. Sort by month key and map to the required format
//         const sortedMonths = Object.keys(monthlyCounts).sort();
//         const monthlyData: DataPoint[] = sortedMonths.map(key => ({
//             // This line is now valid because monthlyCounts[key] is guaranteed to have 'name'
//             name: monthlyCounts[key].name, 
//             value: monthlyCounts[key].value,
//         }));

//         // ... rest of the function (average calculation)
//         const totalValue = monthlyData.reduce((sum, item) => sum + item.value, 0);
//         const averageValue = monthlyData.length > 0 ? totalValue / monthlyData.length : 0;

//         if (monthlyData.length > 0) {
//             monthlyData.push({
//                 name: "AVG (All)",
//                 value: parseFloat(averageValue.toFixed(2)),
//                 isAverage: true,
//             });
//         }

//         // Fallback logic
//         if (monthlyData.length === 0) {
//             return [
//                 { name: "Apr", value: 10 },
//                 { name: "May", value: 8 },
//                 { name: "Jun", value: 6 },
//                 { name: "Jul", value: 3 },
//                 { name: "AVG (QTR)", value: 6.75, isAverage: true },
//             ];
//         }

//         return monthlyData;
//     };

//     const monthlyTrendData = prepareMonthlyTrendData();

//   return (
//     <div className="bg-[#f6faff] min-h-screen p-6">
//       {/* Header */}
//       <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 p-8 mb-8 relative overflow-hidden transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
//         <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
//         {/* 4M Change Management  */}
//         <p className="text-white text-lg mb-6">Monitor, manage and track all manufacturing changes in real-time</p>
//         <div className="flex gap-4">
//           <button className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200">
//             <span className="text-xl">+</span> New Change Request
//           </button>
//           <button className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200">
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
//           <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
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

//       {/* New Quarterly Monitoring Chart Section */}
//           {monthlyTrendData.length > 0 && (
//             <div className="grid grid-cols-1 mb-8">
//               <QuarterlyMonitoringChart
//                 data={monthlyTrendData}
//                 title="Monthly Change Count Trend"
//                 subtitle="Total changes per month vs. target & average"
//                 targetValue={3} // Set your target here
//                 yAxisLabel="Change Count"
//                 barColor="#3498db"
//                 averageColor="#e74c3c"
//                 trendLineColor="#000"
//               />
//             </div>
//           )}

//       {/* Enhanced Charts Section */}
//       {/* {changeList.length > 0 ? (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"> */}
//         {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"> */}
//           {/* New Quarterly Monitoring Chart Section */}
//           {/* {monthlyTrendData.length > 0 && (
//             <div className="grid grid-cols-1 mb-8">
//               <QuarterlyMonitoringChart
//                 data={monthlyTrendData}
//                 title="Monthly Change Count Trend"
//                 subtitle="Total changes per month vs. target & average"
//                 targetValue={3} // Set your target here
//                 yAxisLabel="Change Count"
//                 barColor="#3498db"
//                 averageColor="#e74c3c"
//                 trendLineColor="#000"
//               />
//             </div>
//           )} */}
          
//           {/* Enhanced 4M Distribution Bar Chart */}
//           {/* <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-lg text-gray-900">4M Changes Distribution</h3>
//                   <p className="text-sm text-gray-500">Manufacturing change breakdown</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                 <span>Live Data</span>
//               </div>
//             </div>
//             <ResponsiveContainer width="100%" height={340}>
//               <BarChart 
//                 data={prepare4MChartData()} 
//                 margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
//               >
//                 <defs>
//                   <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
//                     <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.8}/>
//                   </linearGradient>
//                   <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
//                     <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
//                   </linearGradient>
//                   <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
//                     <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8}/>
//                   </linearGradient>
//                   <linearGradient id="barGradient4" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8}/>
//                     <stop offset="100%" stopColor="#D97706" stopOpacity={0.8}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid 
//                   strokeDasharray="3 3" 
//                   stroke="#f0f0f0" 
//                   horizontal={true}
//                   vertical={false}
//                 />
//                 <XAxis 
//                   dataKey="name" 
//                   tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }}
//                   axisLine={{ stroke: '#E5E7EB' }}
//                   tickLine={{ stroke: '#E5E7EB' }}
//                   angle={-30}
//                   textAnchor="end"
//                   height={60}
//                 />
//                 <YAxis 
//                   tick={{ fontSize: 12, fill: '#6B7280' }}
//                   axisLine={{ stroke: '#E5E7EB' }}
//                   tickLine={{ stroke: '#E5E7EB' }}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: '#ffffff',
//                     border: 'none',
//                     borderRadius: '12px',
//                     boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//                     fontSize: '14px',
//                   }}
//                   cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
//                 />
//                 <Bar 
//                   dataKey="count" 
//                   name="Changes"
//                   radius={[8, 8, 0, 0]}
//                 >
//                   {prepare4MChartData().map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={`url(#barGradient${index + 1})`} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div> */}

//           {/* Enhanced Category Distribution Pie Chart */}
//           {/* <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <circle cx="12" cy="12" r="10" />
//                     <path d="M12 2v10l7 7" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-lg text-gray-900">Category Distribution</h3>
//                   <p className="text-sm text-gray-500">Change type breakdown</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//                 <span>Updated now</span>
//               </div>
//             </div>
//             <ResponsiveContainer width="100%" height={340}>
//               <RechartsPieChart>
//                 <defs>
//                   <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
//                     <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0, 0, 0, 0.1)"/>
//                   </filter>
//                 </defs>
//                 <Pie
//                   data={prepareCategoryChartData()}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   // label={({ name, percent }) => `${name}\n${((percent || 0) * 100).toFixed(1)}%`}
//                   label={({ name, percent }) => `${name}\n${(Number(percent ?? 0) * 100).toFixed(1)}%`}
//                   outerRadius={110}
//                   innerRadius={60}
//                   paddingAngle={5}
//                   fill="#8884d8"
//                   dataKey="value"
//                   style={{ filter: 'url(#shadow)' }}
//                 >
//                   {prepareCategoryChartData().map((entry, index) => (
//                     <Cell 
//                       key={`cell-${index}`} 
//                       fill={entry.color}
//                       stroke="#ffffff"
//                       strokeWidth={3}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: '#ffffff',
//                     border: 'none',
//                     borderRadius: '12px',
//                     boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//                     fontSize: '14px',
//                   }}
//                 />
//               </RechartsPieChart>
//             </ResponsiveContainer> */}
            
//             {/* Custom Legend */}
//             {/* <div className="flex justify-center mt-4">
//               <div className="flex flex-wrap gap-4">
//                 {prepareCategoryChartData().map((entry, index) => (
//                   <div key={index} className="flex items-center gap-2">
//                     <div 
//                       className="w-3 h-3 rounded-full" 
//                       style={{ backgroundColor: entry.color }}
//                     ></div>
//                     <span className="text-sm font-medium text-gray-700">{entry.name}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : ( */}


//       {/* Enhanced Charts Section */}
// {changeList.length > 0 ? (
//   <div className="space-y-6 mb-8">
//     {/* 4M Distribution Charts - Quarterly and Monthly */}
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       {/* Quarterly 4M Distribution (Jul-Sep) */}
//       <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//             </div>
//             <div>
//               <h3 className="font-bold text-lg text-gray-900">4M Changes - Quarterly</h3>
//               <p className="text-sm text-gray-500">Jul-Sep 2025</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
//             <span>Q3</span>
//           </div>
//         </div>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart 
//             data={prepare4MQuarterlyData()} 
//             margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
//           >
//             <defs>
//               <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
//                 <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.8}/>
//               </linearGradient>
//               <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
//                 <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
//               </linearGradient>
//               <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
//                 <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8}/>
//               </linearGradient>
//               <linearGradient id="barGradient4" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8}/>
//                 <stop offset="100%" stopColor="#D97706" stopOpacity={0.8}/>
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
//             <XAxis 
//               dataKey="name" 
//               tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }}
//               axisLine={{ stroke: '#E5E7EB' }}
//               tickLine={{ stroke: '#E5E7EB' }}
//               angle={-30}
//               textAnchor="end"
//               height={60}
//             />
//             <YAxis 
//               tick={{ fontSize: 12, fill: '#6B7280' }}
//               axisLine={{ stroke: '#E5E7EB' }}
//               tickLine={{ stroke: '#E5E7EB' }}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: '#ffffff',
//                 border: 'none',
//                 borderRadius: '12px',
//                 boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//                 fontSize: '14px',
//               }}
//               cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
//             />
//             <Bar dataKey="count" name="Changes" radius={[8, 8, 0, 0]}>
//               {prepare4MQuarterlyData().map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={`url(#barGradient${index + 1})`} />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Quarterly Category Distribution (Jul-Sep) */}
//       <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <circle cx="12" cy="12" r="10" />
//                 <path d="M12 2v10l7 7" />
//               </svg>
//             </div>
//             <div>
//               <h3 className="font-bold text-lg text-gray-900">Category - Quarterly</h3>
//               <p className="text-sm text-gray-500">Jul-Sep 2025</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             <span>Q3</span>
//           </div>
//         </div>
//         <ResponsiveContainer width="100%" height={300}>
//           <RechartsPieChart>
//             <defs>
//               <filter id="shadowQuarterly" x="-50%" y="-50%" width="200%" height="200%">
//                 <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0, 0, 0, 0.1)"/>
//               </filter>
//             </defs>
//             <Pie
//               data={prepareCategoryQuarterlyData()}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               label={({ name, percent }) => `${name}\n${(Number(percent ?? 0) * 100).toFixed(1)}%`}
//               outerRadius={90}
//               innerRadius={50}
//               paddingAngle={5}
//               fill="#8884d8"
//               dataKey="value"
//               style={{ filter: 'url(#shadowQuarterly)' }}
//             >
//               {prepareCategoryQuarterlyData().map((entry, index) => (
//                 <Cell 
//                   key={`cell-${index}`} 
//                   fill={entry.color}
//                   stroke="#ffffff"
//                   strokeWidth={3}
//                 />
//               ))}
//             </Pie>
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: '#ffffff',
//                 border: 'none',
//                 borderRadius: '12px',
//                 boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//                 fontSize: '14px',
//               }}
//             />
//           </RechartsPieChart>
//         </ResponsiveContainer>
//         <div className="flex justify-center mt-4">
//           <div className="flex flex-wrap gap-4">
//             {prepareCategoryQuarterlyData().map((entry, index) => (
//               <div key={index} className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
//                 <span className="text-sm font-medium text-gray-700">{entry.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

      
//     </div>

//     {/* Category Distribution Charts - Quarterly and Monthly */}
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//       {/* Current Month 4M Distribution (October) */}
//       <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//             </div>
//             <div>
//               <h3 className="font-bold text-lg text-gray-900">4M Changes - This Month</h3>
//               <p className="text-sm text-gray-500">October 2025</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//             <span>Live Data</span>
//           </div>
//         </div>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart 
//             data={prepare4MCurrentMonthData()} 
//             margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
//             <XAxis 
//               dataKey="name" 
//               tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }}
//               axisLine={{ stroke: '#E5E7EB' }}
//               tickLine={{ stroke: '#E5E7EB' }}
//               angle={-30}
//               textAnchor="end"
//               height={60}
//             />
//             <YAxis 
//               tick={{ fontSize: 12, fill: '#6B7280' }}
//               axisLine={{ stroke: '#E5E7EB' }}
//               tickLine={{ stroke: '#E5E7EB' }}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: '#ffffff',
//                 border: 'none',
//                 borderRadius: '12px',
//                 boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//                 fontSize: '14px',
//               }}
//               cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
//             />
//             <Bar dataKey="count" name="Changes" radius={[8, 8, 0, 0]}>
//               {prepare4MCurrentMonthData().map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={`url(#barGradient${index + 1})`} />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
      

//       {/* Current Month Category Distribution (October) */}
//       <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <circle cx="12" cy="12" r="10" />
//                 <path d="M12 2v10l7 7" />
//               </svg>
//             </div>
//             <div>
//               <h3 className="font-bold text-lg text-gray-900">Category - This Month</h3>
//               <p className="text-sm text-gray-500">October 2025</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             <span>Updated now</span>
//           </div>
//         </div>
//         <ResponsiveContainer width="100%" height={300}>
//           <RechartsPieChart>
//             <defs>
//               <filter id="shadowMonthly" x="-50%" y="-50%" width="200%" height="200%">
//                 <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0, 0, 0, 0.1)"/>
//               </filter>
//             </defs>
//             <Pie
//               data={prepareCategoryCurrentMonthData()}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               label={({ name, percent }) => `${name}\n${(Number(percent ?? 0) * 100).toFixed(1)}%`}
//               outerRadius={90}
//               innerRadius={50}
//               paddingAngle={5}
//               fill="#8884d8"
//               dataKey="value"
//               style={{ filter: 'url(#shadowMonthly)' }}
//             >
//               {prepareCategoryCurrentMonthData().map((entry, index) => (
//                 <Cell 
//                   key={`cell-${index}`} 
//                   fill={entry.color}
//                   stroke="#ffffff"
//                   strokeWidth={3}
//                 />
//               ))}
//             </Pie>
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: '#ffffff',
//                 border: 'none',
//                 borderRadius: '12px',
//                 boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//                 fontSize: '14px',
//               }}
//             />
//           </RechartsPieChart>
//         </ResponsiveContainer>
//         <div className="flex justify-center mt-4">
//           <div className="flex flex-wrap gap-4">
//             {prepareCategoryCurrentMonthData().map((entry, index) => (
//               <div key={index} className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
//                 <span className="text-sm font-medium text-gray-700">{entry.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// ) : (
//         // No data state with better design
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           {/* Enhanced No Data Bar Chart */}
//           <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="font-bold text-lg text-gray-900">4M Changes Distribution</h3>
//                 <p className="text-sm text-gray-500">Manufacturing change breakdown</p>
//               </div>
//             </div>
//             <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
//                 <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                 </svg>
//               </div>
//               <h4 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h4>
//               <p className="text-sm text-center">Add some 4M changes to see the distribution chart</p>
//             </div>
//           </div>

//           {/* Enhanced No Data Pie Chart */}
//           <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <circle cx="12" cy="12" r="10" />
//                   <path d="M12 2v10l7 7" />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="font-bold text-lg text-gray-900">Category Distribution</h3>
//                 <p className="text-sm text-gray-500">Change type breakdown</p>
//               </div>
//             </div>
//             <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
//                 <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <circle cx="12" cy="12" r="10" />
//                   <path d="M12 2v10l7 7" />
//                 </svg>
//               </div>
//               <h4 className="text-lg font-semibold text-gray-600 mb-2">No Categories Yet</h4>
//               <p className="text-sm text-center">Chart will appear when you add change records</p>
//             </div>
//           </div>
//         </div>
//       )}
      

//       {/* Additional Analytics */}
//       {changeList.length > 0 && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Activities Summary */}
//           <div className="bg-white rounded-xl shadow p-6 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
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
//           <div className="bg-white rounded-xl shadow p-6 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
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
//           <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
//             <span>View All</span>
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path d="M9 5l7 7-7 7" />
//             </svg>
//           </button>
//         </div>
        
//         {recentChanges.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {recentChanges.map((item, idx) => (
//               <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
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
//           <div className="bg-white rounded-xl shadow p-8 text-center transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
//             <div className="text-gray-400 text-lg mb-4">
//               <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
//                 <path d="M9 17v-2a4 4 0 0 1 8 0v2" />
//                 <circle cx="12" cy="7" r="4" />
//               </svg>
//               No change records found
//             </div>
//             <p className="text-gray-500">Start by adding your first 4M change record to see analytics and insights here.</p>
//             <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5">
//               Add First Record
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashboardView;
