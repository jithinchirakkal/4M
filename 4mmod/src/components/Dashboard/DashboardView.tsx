import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Cell, Pie, Sector,
} from 'recharts';

import QuarterlyMonitoringChart, { DataPoint } from "./QuarterlyMonitoringChart"; 

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// --- Types ---
interface ChangeItem {
  id: number;
  record_id: string;
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
  approvals?: Array<{
    id: number;
    role_code: string;
    role_name: string;
    status: string;
    approved_by_name?: string;
    approved_at?: string;
    remarks?: string;
  }>;
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const name = payload[0].name;
    const color = payload[0].color || payload[0].payload.color || payload[0].fill;
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
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <text x={cx} y={cy} dy={-5} textAnchor="middle" fill={fill} className="font-bold text-xl">{`${value}`}</text>
      <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#9CA3AF" className="text-xs">{`${payload.name}`}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="transition-all duration-300 ease-in-out"
        stroke="#fff"
      />
    </g>
  );
};

// --- Helper Components ---

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

// --- End Helper Components ---


const DashboardView = () => {
  const [changeList, setChangeList] = useState<ChangeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); 

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

  // --- Logic Helpers ---

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

  const prepareCategoryChartData = (list: ChangeItem[]) => {
    const counts = list.reduce((acc: Record<string, number>, item) => {
      const categoryType = item.category_details?.category_type || 'Unknown';
      acc[categoryType] = (acc[categoryType] || 0) + 1;
      return acc;
    }, {});
      
    const data = Object.entries(counts).map(([category, count], index) => ({
      name: category,
      value: count as number,
      color: COLORS[index % COLORS.length],
    }));

    // Safety fallback for Pie Chart to prevent crashes
    return data.length > 0 ? data : [{ name: 'No Data', value: 1, color: '#E5E7EB' }];
  };

  // --- Date Calculations ---
  // Calculates dynamic quarters
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); 
  const currentYear = currentDate.getFullYear(); // --- NEW: Added Year Variable
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });

  const currentQuarter = Math.floor((currentMonth + 3) / 3);
  const quarterStartMonth = (currentQuarter - 1) * 3;
  const quarterEndMonth = quarterStartMonth + 2;

  // Helpers for labels
  const getMonthShortName = (monthIndex: number) => new Date(currentYear, monthIndex).toLocaleString('default', { month: 'short' });
  const quarterLabel = `Q${currentQuarter} ${currentYear} (${getMonthShortName(quarterStartMonth)} - ${getMonthShortName(quarterEndMonth)})`;

  const quarterlyChanges = filterChangesByDate(changeList, quarterStartMonth, quarterEndMonth);
  const monthlyChanges = filterChangesByDate(changeList, currentMonth, currentMonth);

  const prepare4MQuarterlyData = () => prepare4MDataForPeriod(quarterlyChanges);
  const prepare4MCurrentMonthData = () => prepare4MDataForPeriod(monthlyChanges);
  const prepareCategoryQuarterlyData = () => prepareCategoryChartData(quarterlyChanges);
  const prepareCategoryCurrentMonthData = () => prepareCategoryChartData(monthlyChanges);

  // --- Statistics ---
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

  // --- Recent Changes Logic ---
  const recentChanges = changeList
    .sort((a, b) => new Date(b.date || b.created_at || '').getTime() - new Date(a.date || a.created_at || '').getTime())
    .slice(0, 3)
    .map(item => {
      const fourM = item.four_m || 'Unknown';
      
      const isSetupApprovalRequired = item.action_details?.set_up_approval || false;
      const isSetupApproved = item.approvals?.some((approval) => 
        (approval.role_code === 'PROD_HOD' || approval.role_code === 'QA_HOD') && 
        approval.status === 'approved'
      ) || false;
      
      return {
        type: fourM.toUpperCase(),
        title: item.category_details?.description?.substring(0, 40) + (item.category_details?.description?.length && item.category_details.description.length > 40 ? '...' : '') || 'No description',
        action: item.action_details?.action_taken?.substring(0, 30) + (item.action_details?.action_taken.length && item.action_details.action_taken.length > 30 ? '...' : '') || 'No action',
        category: item.category_details?.category_type || 'Unknown',
        date: item.date ? new Date(item.date).toLocaleDateString() : 'No date',
        
        setUpApprovalRequired: isSetupApprovalRequired,
        setUpApproved: isSetupApproved,
        retroactiveInspectionRequired: item.action_details?.retroactive_inspection || false,
        suspectedLotCheckRequired: item.action_details?.suspected_lot_check || false,
        
        color: fourM === 'Man' ? 'bg-blue-600' : 
              fourM === 'Machine/Tool' ? 'bg-green-500' :
              fourM === 'Material' ? 'bg-purple-500' : 'bg-orange-500',
        priorityColor: item.category_details?.category_type === 'Abnormal' ? 'bg-red-500/10 text-red-600 border border-red-500/30' :
                      item.category_details?.category_type === 'Unplanned' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/30' :
                      'bg-green-500/10 text-green-600 border border-green-500/30',
      };
    });

  // --- Monthly Trend Data ---
  const getMonthName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('default', { month: 'short' });
  };

  const prepareTrendData = (): DataPoint[] => {
    const monthlyCounts = changeList.reduce((acc: Record<string, { value: number, name: string }>, item) => {
      const dateStr = item.date || item.created_at;
      if (!dateStr) return acc;

      const yearMonth = dateStr.substring(0, 7);
      const monthName = getMonthName(dateStr); 

      acc[yearMonth] = acc[yearMonth] || { value: 0, name: monthName };
      acc[yearMonth].value += 1;

      return acc;
    }, {}); 

    const sortedMonths = Object.keys(monthlyCounts).sort();
    const data: DataPoint[] = sortedMonths.map(key => ({
      name: monthlyCounts[key].name, 
      value: monthlyCounts[key].value,
    }));

    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    const averageValue = data.length > 0 ? totalValue / data.length : 0;

    if (data.length > 0) {
      data.push({
        name: "AVG",
        value: parseFloat(averageValue.toFixed(2)),
        isAverage: true,
      });
    }

    return data;
  };

  const trendData = prepareTrendData();

  // Handler for Pie chart interaction
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

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

  // --- Components for Reordering ---

  // Component for the Current Month Charts
  const CurrentMonthCharts = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      {/* Current Month 4M Distribution - Modern Bar Chart */}
      <ChartCard 
        title={`4M Changes - ${currentMonthName}`} // --- NEW: Dynamic Month
        subtitle={`${currentMonthName} ${currentYear} Focus`} // --- NEW: Dynamic Year
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
      
      {/* Current Month Category Distribution - Modern Pie Chart */}
      <ChartCard 
        title={`Category Distribution - ${currentMonthName}`} // --- NEW: Dynamic Month
        subtitle={`Risk profile for ${currentMonthName} ${currentYear}`} // --- NEW: Dynamic Year
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
  );

  // Component for the Quarterly Charts
  const QuarterlyCharts = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      {/* Quarterly 4M Distribution - Modern Bar Chart */}
      <ChartCard 
        title="4M Changes - Quarterly"
        subtitle={quarterLabel} // --- NEW: Dynamic Quarter Label
        icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        iconGradient="from-blue-500 to-indigo-500"
        statusLabel="Quarterly"
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

      {/* Quarterly Category Distribution - Modern Pie Chart */}
      <ChartCard 
        title="Category Distribution - Quarterly"
        subtitle={quarterLabel} // --- NEW: Dynamic Quarter Label
        icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 2v10l7 7" /></svg>}
        iconGradient="from-purple-500 to-pink-500"
        statusLabel="Quarterly"
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
  );

  return (
    <div className="min-h-screen p-6 font-sans">
      
      {/* 1. Main Header Card */}
      <div className="rounded-3xl bg-white p-2 mb-4 shadow-2xl transition-all duration-500 transform hover:scale-[1.01] relative overflow-hidden ring-8 ring-blue-500/20 hover:ring-purple-500/30">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl transition-opacity duration-500"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700">Dashboard</span>
          </h1>
          <p className="text-gray-600 text-lg mb-6 max-w-2xl font-medium">
            Monitor, manage, and track all manufacturing changes in real-time to maintain peak quality standards.
          </p>
          {/* <div className="flex flex-wrap gap-4">
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
          </div> */}
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-white rounded-2xl p-6 relative overflow-hidden transition-all duration-300 transform hover:scale-[1.03] border border-gray-100/50 shadow-lg ${stat.shadow}`}>
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

      {/* 3. Monthly Trend Chart */}
      {trendData.length > 0 && (
        <div className="mb-10">
          <QuarterlyMonitoringChart
            data={trendData}
            title="Monthly Change Count Trend"
            subtitle={`Monthly breakdown for ${currentYear}`} // --- NEW: Dynamic Year
            targetValue={5} 
            yAxisLabel="Change Count"
            barColor="#3B82F6"
            averageColor="#EF4444"
            trendLineColor="#8B5CF6"
          />
        </div>
      )}

      {changeList.length > 0 ? (
        <>
          {/* Quarterly Data (Historical Context) */}
          {QuarterlyCharts}

          {/* Current Month Data (Live Data) */}
          {CurrentMonthCharts} 
        </>
      ) : (
        /* No Data State */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NoDataCard title="4M Changes Distribution" subtitle="Manufacturing change breakdown" iconColor="text-blue-500" />
          <NoDataCard title="Category Distribution" subtitle="Change type breakdown" iconColor="text-purple-500" />
        </div>
      )}

      {/* 4 & 5. Additional Analytics and Recent Changes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* Analytics Summary */}
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

        {/* Recent Changes List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 border border-gray-100/50 transition-all duration-300 transform hover:shadow-2xl hover:ring-2 hover:ring-blue-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-extrabold text-2xl text-gray-900">Recent Change Activity ⚡</h2>
            {/* <button className="bg-white text-gray-700 ring-1 ring-gray-300 hover:ring-blue-500 hover:text-blue-600 px-4 py-2 rounded-xl font-semibold flex items-center gap-1 transition-all duration-300">
              <span>View All</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
            </button> */}
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
                      {item.setUpApprovalRequired && item.setUpApproved && (
                        <Badge label="✓ Set-Up Approved" color="bg-green-100 text-green-700" />
                      )}
                      {item.setUpApprovalRequired && !item.setUpApproved && (
                        <Badge label="⏳ Set-Up Approval Pending" color="bg-yellow-100 text-yellow-700" />
                      )}
                      {item.retroactiveInspectionRequired && (
                        <Badge label="Inspection Required" color="bg-orange-100 text-orange-700" />
                      )}
                      {item.suspectedLotCheckRequired && (
                        <Badge label="Lot Check Required" color="bg-red-100 text-red-700" />
                      )}
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

export default DashboardView;

// import React, { useState, useEffect } from "react";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart,
//   Cell, Pie,
//   Sector, 
// } from 'recharts';

// import QuarterlyMonitoringChart, { DataPoint } from "./QuarterlyMonitoringChart"; 

// const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// // --- Original Types (Unchanged) ---
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
//   approvals?: Array<{  // ADD THIS ENTIRE BLOCK
//     id: number;
//     role_code: string;
//     role_name: string;
//     status: string;
//     approved_by_name?: string;
//     approved_at?: string;
//     remarks?: string;
//   }>;
// }
// // --- End Original Types ---

// // Custom Tooltip for Recharts (Enhanced visual style)
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     const value = payload[0].value;
//     const name = payload[0].name;
//     const color = payload[0].color || payload[0].payload.color;
//     return (
//       <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-2xl border border-gray-200 text-sm">
//         <p className="text-gray-500 mb-1">{name}</p>
//         <p className="font-bold text-gray-800" style={{ color: color }}>
//           Changes: {value}
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// // Custom Active Shape for Pie Chart 
// const renderActiveShape = (props: any) => {
//   const RADIAN = Math.PI / 180;
//   const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  
//   return (
//     <g>
//       <text x={cx} y={cy} dy={-5} textAnchor="middle" fill={fill} className="font-bold text-xl">{`${value}`}</text>
//       <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#9CA3AF" className="text-xs">{`${payload.name}`}</text>
//       <Sector
//         cx={cx}
//         cy={cy}
//         innerRadius={innerRadius}
//         outerRadius={outerRadius + 8} // Slightly expanded active slice
//         startAngle={startAngle}
//         endAngle={endAngle}
//         fill={fill}
//         className="transition-all duration-300 ease-in-out"
//         stroke="#fff"
//       />
//     </g>
//   );
// };

// // --- Helper Components ---

// interface ChartCardProps {
//     title: string;
//     subtitle: string;
//     icon: React.ReactNode;
//     iconGradient: string;
//     statusLabel: string;
//     statusColor?: string;
//     children: React.ReactNode;
//   }
  
//   const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, icon, iconGradient, statusLabel, statusColor = 'text-gray-500', children }) => (
//     <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100/50 transition-all duration-300 transform hover:shadow-2xl hover:ring-4 hover:ring-blue-500/10">
//       <div className="flex items-start justify-between mb-6 border-b border-gray-100 pb-4">
//         <div className="flex items-center gap-4">
//           <div className={`w-12 h-12 bg-gradient-to-r ${iconGradient} rounded-xl flex items-center justify-center shadow-lg shadow-gray-400/30`}>
//             {icon}
//           </div>
//           <div>
//             <h3 className="font-extrabold text-xl text-gray-900">{title}</h3>
//             <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
//           </div>
//         </div>
//         <div className={`text-sm font-bold ${statusColor} bg-gray-100/50 px-3 py-1 rounded-full border border-gray-200`}>
//           {statusLabel}
//         </div>
//       </div>
//       {children}
//     </div>
//   );
  
//   const NoDataCard: React.FC<{ title: string; subtitle: string; iconColor: string }> = ({ title, subtitle, iconColor }) => (
//     <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100/50 transition-all duration-300 transform hover:shadow-2xl hover:ring-4 hover:ring-gray-300/10">
//       <div className="flex items-start gap-4 mb-6 border-b border-gray-100 pb-4">
//         <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
//           <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//             <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
//         </div>
//         <div>
//           <h3 className="font-extrabold text-xl text-gray-900">{title}</h3>
//           <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
//         </div>
//       </div>
//       <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50/70 rounded-xl border border-dashed border-gray-200/80">
//         <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 border-4 ${iconColor.replace('text', 'border')}/20`}>
//           <svg className={`w-8 h-8 ${iconColor}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9.879 16.121A3 3 0 1012.001 19l1.414-1.414a3 3 0 00-4.242-4.242L7.758 9.879A3 3 0 105 12.001l1.414 1.414a3 3 0 004.242 4.242L12.001 19a3 3 0 102.121-5.121L12 12.001" /></svg>
//         </div>
//         <h4 className="text-lg font-semibold text-gray-700 mb-2">Data Pending</h4>
//         <p className="text-sm text-center text-gray-500 max-w-xs">Chart data will populate once change records are fetched successfully.</p>
//       </div>
//     </div>
//   );
  
//   const AnalyticsItem: React.FC<{ label: string; value: number; total: number; color: string; icon: React.ReactNode }> = ({ label, value, total, color, icon }) => {
//     const percent = total > 0 ? (value / total) * 100 : 0;
//     return (
//       <div className="flex items-center justify-between border-b border-gray-100 pb-3 group hover:bg-gray-50/50 transition-colors duration-150 rounded-md px-1 -mx-1">
//         <div className="flex items-center gap-3">
//           <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white/90 shadow-md shadow-gray-400/20`}>
//             {icon}
//           </div>
//           <span className="text-gray-600 font-medium group-hover:text-gray-800 transition-colors">{label}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-lg font-extrabold text-gray-900 min-w-[30px] text-right">{value}</span>
//         </div>
//       </div>
//     );
//   };
  
//   const ActionItem: React.FC<{ label: string; count: number; total: number; color: string }> = ({ label, count, total, color }) => {
//     const percent = total > 0 ? (count / total) * 100 : 0;
//     return (
//       <div className="group hover:bg-gray-50/50 transition-colors duration-150 rounded-md p-2 -m-2">
//         <div className="flex justify-between items-center mb-1">
//           <span className="text-sm text-gray-600 group-hover:text-gray-800 font-medium transition-colors">{label}</span>
//           <span className="text-sm font-bold text-gray-800">{count}</span>
//         </div>
//         <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner shadow-gray-300/50">
//           <div 
//             className={`h-full ${color} rounded-full transition-all duration-700 ease-out`} 
//             style={{ width: `${percent}%` }}
//           ></div>
//         </div>
//       </div>
//     );
//   };
  
//   const Badge: React.FC<{ label: string; color: string }> = ({ label, color }) => (
//     <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
//       {label}
//     </span>
//   );
  
//   const NoRecordsPlaceholder: React.FC = () => (
//       <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-gray-100/50 transition-all duration-300 transform hover:shadow-2xl">
//         <div className="text-gray-400 text-lg mb-4">
//             <svg className="w-16 h-16 mx-auto mb-4 text-blue-400/50" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
//                 <path d="M9 17v-2a4 4 0 0 1 8 0v2" />
//                 <circle cx="12" cy="7" r="4" />
//             </svg>
//             <span className="font-extrabold text-xl text-gray-700">No Change Records Found</span>
//         </div>
//         <p className="text-gray-500 max-w-md mx-auto">The dashboard is ready to go! Start by adding your first 4M change record to unlock comprehensive analytics and real-time insights.</p>
//         <button className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40 transform hover:-translate-y-0.5">
//             Add First Record
//         </button>
//       </div>
//   );

// // --- End Helper Components ---


// const DashboardView = () => {
//   const [changeList, setChangeList] = useState<ChangeItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeIndex, setActiveIndex] = useState(0); 

//   // --- Original Logic (Unchanged) ---
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

//   const prepareCategoryChartData = (list: ChangeItem[]) => {
//     const counts = list.reduce((acc: Record<string, number>, item) => {
//       const categoryType = item.category_details?.category_type || 'Unknown';
//       acc[categoryType] = (acc[categoryType] || 0) + 1;
//       return acc;
//     }, {});
      
//     return Object.entries(counts).map(([category, count], index) => ({
//       name: category,
//       value: count as number,
//       color: COLORS[index % COLORS.length],
//     }));
//   };

//   const filterChangesByDate = (list: ChangeItem[], monthStart: number, monthEnd: number) => {
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     return list.filter(item => {
//       const dateStr = item.date || item.created_at;
//       if (!dateStr) return false;
//       const itemDate = new Date(dateStr);
//       const month = itemDate.getMonth();
//       const year = itemDate.getFullYear();
//       return year === currentYear && month >= monthStart && month <= monthEnd;
//     });
//   };

//   const prepare4MDataForPeriod = (list: ChangeItem[]) => {
//     const counts = list.reduce((acc: Record<string, number>, item) => {
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

//   const quarterlyChanges = filterChangesByDate(changeList, 6, 8); // Jul (6) - Sep (8)
//   const currentMonth = new Date().getMonth(); // 9 for October
//   const monthlyChanges = filterChangesByDate(changeList, currentMonth, currentMonth);

//   const prepare4MQuarterlyData = () => prepare4MDataForPeriod(quarterlyChanges);
//   const prepare4MCurrentMonthData = () => prepare4MDataForPeriod(monthlyChanges);
//   const prepareCategoryQuarterlyData = () => prepareCategoryChartData(quarterlyChanges);
//   const prepareCategoryCurrentMonthData = () => prepareCategoryChartData(monthlyChanges);

//   // Calculate statistics
//   const totalChanges = changeList.length;
//   const setUpApprovals = changeList.filter(item => item.action_details?.set_up_approval).length;
//   const retroactiveInspections = changeList.filter(item => item.action_details?.retroactive_inspection).length;
//   const suspectedLotChecks = changeList.filter(item => item.action_details?.suspected_lot_check).length;
//   const pendingApprovals = changeList.filter(item => 
//     !item.action_details?.set_up_approval && 
//     !item.action_details?.retroactive_inspection && 
//     !item.action_details?.suspected_lot_check
//   ).length;
//   const plannedChanges = changeList.filter(item => item.category_details?.category_type === 'Planned').length;
//   const unplannedChanges = changeList.filter(item => item.category_details?.category_type === 'Unplanned').length;
//   const abnormalChanges = changeList.filter(item => item.category_details?.category_type === 'Abnormal').length;

//   const stats = [
//     {
//       icon: (
//         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//           <rect width="20" height="14" x="2" y="5" rx="2" />
//         </svg>
//       ),
//       label: "Total Changes",
//       value: totalChanges,
//       trend: totalChanges > 0 ? `${totalChanges} records` : "No data",
//       trendColor: "text-blue-500",
//       bg: "bg-blue-600",
//       gradient: "from-blue-600 to-blue-400",
//       shadow: "shadow-blue-500/50 hover:shadow-blue-600/70"
//     },
//     {
//       icon: (
//         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//           <circle cx="12" cy="12" r="10" />
//           <path d="M12 6v6l4 2" />
//         </svg>
//       ),
//       label: "Pending Approvals",
//       value: pendingApprovals,
//       trend: `${((pendingApprovals/totalChanges)*100 || 0).toFixed(1)}%`,
//       trendColor: "text-yellow-500",
//       bg: "bg-yellow-500",
//       gradient: "from-yellow-500 to-amber-300",
//       shadow: "shadow-yellow-500/50 hover:shadow-yellow-600/70"
//     },
//     {
//       icon: (
//         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//           <path d="M5 13l4 4L19 7" />
//         </svg>
//       ),
//       label: "Planned Changes",
//       value: plannedChanges,
//       trend: `${((plannedChanges/totalChanges)*100 || 0).toFixed(1)}%`,
//       trendColor: "text-green-500",
//       bg: "bg-green-500",
//       gradient: "from-green-500 to-emerald-300",
//       shadow: "shadow-green-500/50 hover:shadow-green-600/70"
//     },
//     {
//       icon: (
//         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
//       gradient: "from-red-600 to-rose-400",
//       shadow: "shadow-red-500/50 hover:shadow-red-600/70"
//     },
//   ];

//   // Get recent changes (latest 3)
//   // const recentChanges = changeList
//   //   .sort((a, b) => new Date(b.date || b.created_at || '').getTime() - new Date(a.date || a.created_at || '').getTime())
//   //   .slice(0, 3)
//   //   .map(item => {
//   //     const fourM = item.four_m || 'Unknown';
//   //     return {
//   //       type: fourM.toUpperCase(),
//   //       title: item.category_details?.description?.substring(0, 40) + (item.category_details?.description?.length && item.category_details.description.length > 40 ? '...' : '') || 'No description',
//   //       action: item.action_details?.action_taken?.substring(0, 30) + (item.action_details?.action_taken.length && item.action_details.action_taken.length > 30 ? '...' : '') || 'No action',
//   //       category: item.category_details?.category_type || 'Unknown',
//   //       date: item.date ? new Date(item.date).toLocaleDateString() : 'No date',
//   //       setUpApproval: item.action_details?.set_up_approval || false,
//   //       retroactiveInspection: item.action_details?.retroactive_inspection || false,
//   //       suspectedLotCheck: item.action_details?.suspected_lot_check || false,
//   //       color: fourM === 'Man' ? 'bg-blue-600' : 
//   //             fourM === 'Machine/Tool' ? 'bg-green-500' :
//   //             fourM === 'Material' ? 'bg-purple-500' : 'bg-orange-500',
//   //       priorityColor: item.category_details?.category_type === 'Abnormal' ? 'bg-red-500/10 text-red-600 border border-red-500/30' :
//   //                     item.category_details?.category_type === 'Unplanned' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/30' :
//   //                     'bg-green-500/10 text-green-600 border border-green-500/30',
//   //     };
//   //   });
//   // Get recent changes (latest 3) - UPDATED VERSION
// // Get recent changes (latest 3) - FIXED VERSION
// const recentChanges = changeList
//   .sort((a, b) => new Date(b.date || b.created_at || '').getTime() - new Date(a.date || a.created_at || '').getTime())
//   .slice(0, 3)
//   .map(item => {
//     const fourM = item.four_m || 'Unknown';
    
//     // Check actual approval status from approvals array
//     const isSetupApprovalRequired = item.action_details?.set_up_approval || false;
//     const isSetupApproved = item.approvals?.some((approval) =>   // CHANGED: Use optional chaining
//       (approval.role_code === 'PROD_HOD' || approval.role_code === 'QA_HOD') && 
//       approval.status === 'approved'
//     ) || false;  // CHANGED: Add || false as fallback
    
//     return {
//       type: fourM.toUpperCase(),
//       title: item.category_details?.description?.substring(0, 40) + (item.category_details?.description?.length && item.category_details.description.length > 40 ? '...' : '') || 'No description',
//       action: item.action_details?.action_taken?.substring(0, 30) + (item.action_details?.action_taken.length && item.action_details.action_taken.length > 30 ? '...' : '') || 'No action',
//       category: item.category_details?.category_type || 'Unknown',
//       date: item.date ? new Date(item.date).toLocaleDateString() : 'No date',
      
//       // UPDATED: Check actual approval status, not just if it's required
//       setUpApprovalRequired: isSetupApprovalRequired,
//       setUpApproved: isSetupApproved,
      
//       // Keep these as they are (they check if action is required)
//       retroactiveInspectionRequired: item.action_details?.retroactive_inspection || false,
//       suspectedLotCheckRequired: item.action_details?.suspected_lot_check || false,
      
//       color: fourM === 'Man' ? 'bg-blue-600' : 
//             fourM === 'Machine/Tool' ? 'bg-green-500' :
//             fourM === 'Material' ? 'bg-purple-500' : 'bg-orange-500',
//       priorityColor: item.category_details?.category_type === 'Abnormal' ? 'bg-red-500/10 text-red-600 border border-red-500/30' :
//                     item.category_details?.category_type === 'Unplanned' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/30' :
//                     'bg-green-500/10 text-green-600 border border-green-500/30',
//     };
//   });

//   if (loading) {
//     return (
//       <div className="bg-[#f2f4f8] min-h-screen p-10 flex items-center justify-center">
//         <div className="text-xl text-gray-500 animate-pulse flex items-center gap-2">
//           <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//           Loading dashboard data...
//         </div>
//       </div>
//     );
//   }

//   // Utility to get month name
//   const getMonthName = (dateStr: string) => {
//     const date = new Date(dateStr);
//     return date.toLocaleString('default', { month: 'short' });
//   };
    
//   type MonthlyCountAccumulator = Record<string, { value: number, count: number, name: string }>;

//   // Original function to prepare the trend chart data (Unchanged logic)
//   const prepareMonthlyTrendData = (): DataPoint[] => {
//     const monthlyCounts = changeList.reduce((acc: MonthlyCountAccumulator, item) => {
//       const dateStr = item.date || item.created_at;
//       if (!dateStr) return acc;

//       const yearMonth = dateStr.substring(0, 7);
//       const monthName = getMonthName(dateStr); 

//       acc[yearMonth] = acc[yearMonth] || { value: 0, count: 0, name: monthName };
//       acc[yearMonth].value += 1;
//       acc[yearMonth].count += 1;

//       return acc;
//     }, {} as MonthlyCountAccumulator); 

//     const sortedMonths = Object.keys(monthlyCounts).sort();
//     const monthlyData: DataPoint[] = sortedMonths.map(key => ({
//       name: monthlyCounts[key].name, 
//       value: monthlyCounts[key].value,
//     }));

//     const totalValue = monthlyData.reduce((sum, item) => sum + item.value, 0);
//     const averageValue = monthlyData.length > 0 ? totalValue / monthlyData.length : 0;

//     if (monthlyData.length > 0) {
//       monthlyData.push({
//         name: "AVG (All)",
//         value: parseFloat(averageValue.toFixed(2)),
//         isAverage: true,
//       });
//     }

//     if (monthlyData.length === 0) {
//       return [
//         { name: "Jan", value: 0 },
//         { name: "Feb", value: 0 },
//         { name: "Mar", value: 0 },
//       ];
//     }

//     return monthlyData;
//   };

//   const monthlyTrendData = prepareMonthlyTrendData();

//   // Handler for Pie chart interaction
//   const onPieEnter = (_: any, index: number) => {
//     setActiveIndex(index);
//   };

//   /* --- Chart Row Components for Reordering --- */

//   // Component for the Current Month Charts
//   const CurrentMonthCharts = (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
//       {/* Current Month 4M Distribution (October) - Modern Bar Chart */}
//       <ChartCard 
//         title="4M Changes - This Month"
//         subtitle={`October ${new Date().getFullYear()} Focus`}
//         icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
//         iconGradient="from-green-500 to-teal-500"
//         statusLabel="Live Data"
//       >
//         <ResponsiveContainer width="100%" height={320}>
//           <BarChart 
//             data={prepare4MCurrentMonthData()} 
//             margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
//             <XAxis 
//               dataKey="name" 
//               tick={{ fontSize: 14, fill: '#6B7280', fontWeight: 600 }}
//               axisLine={false}
//               tickLine={false}
//               interval={0}
//               angle={-15}
//               textAnchor="end"
//               height={50}
//             />
//             <YAxis 
//               tick={{ fontSize: 12, fill: '#9CA3AF' }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Bar dataKey="count" name="Changes" radius={[6, 6, 0, 0]}>
//               {prepare4MCurrentMonthData().map((entry, index) => (
//                 <Cell 
//                   key={`cell-${index}`} 
//                   fill={entry.color} 
//                   className="hover:opacity-80 transition-opacity duration-150"
//                 />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </ChartCard>
      
//       {/* Current Month Category Distribution (October) - Modern Pie Chart */}
//       <ChartCard 
//         title="Category Distribution - This Month"
//         subtitle={`Risk profile for October ${new Date().getFullYear()}`}
//         icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 2v10l7 7" /></svg>}
//         iconGradient="from-orange-500 to-red-500"
//         statusLabel="High Alert"
//         statusColor="text-red-600"
//       >
//         <ResponsiveContainer width="100%" height={320}>
//           <PieChart>
//             <Pie 
//               {...({ activeIndex, activeShape: renderActiveShape } as any)}
//               data={prepareCategoryCurrentMonthData()}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               onMouseEnter={onPieEnter}
//               outerRadius={100}
//               innerRadius={60}
//               paddingAngle={3}
//               dataKey="value"
//               className="shadow-md"
//             >
//               {prepareCategoryCurrentMonthData().map((entry, index) => (
//                 <Cell 
//                   key={`cell-${index}`} 
//                   fill={entry.color}
//                   stroke={activeIndex === index ? entry.color : "#ffffff"} 
//                   strokeWidth={activeIndex === index ? 4 : 2}
//                   className="cursor-pointer transition-all duration-300 ease-in-out"
//                 />
//               ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//           </PieChart>
//         </ResponsiveContainer>
//         {/* Custom Legend for Pie Chart */}
//         <div className="flex justify-center mt-4">
//           <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
//             {prepareCategoryCurrentMonthData().map((entry, index) => (
//               <div key={index} className="flex items-center gap-2 font-medium text-gray-700">
//                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
//                 <span>{entry.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </ChartCard>
//     </div>
//   );

//   // Component for the Quarterly Charts
//   const QuarterlyCharts = (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
//       {/* Quarterly 4M Distribution (Jul-Sep) - Modern Bar Chart */}
//       <ChartCard 
//         title="4M Changes - Quarterly"
//         subtitle="Jul-Sep Analysis"
//         icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
//         iconGradient="from-blue-500 to-indigo-500"
//         statusLabel="Q3"
//       >
//         <ResponsiveContainer width="100%" height={320}>
//           <BarChart 
//             data={prepare4MQuarterlyData()} 
//             margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
//             <XAxis 
//               dataKey="name" 
//               tick={{ fontSize: 14, fill: '#6B7280', fontWeight: 600 }}
//               axisLine={false}
//               tickLine={false}
//               interval={0}
//               angle={-15}
//               textAnchor="end"
//               height={50}
//             />
//             <YAxis 
//               tick={{ fontSize: 12, fill: '#9CA3AF' }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Bar dataKey="count" name="Changes" radius={[6, 6, 0, 0]}>
//               {prepare4MQuarterlyData().map((entry, index) => (
//                 <Cell 
//                   key={`cell-${index}`} 
//                   fill={entry.color} 
//                   className="hover:opacity-80 transition-opacity duration-150"
//                 />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </ChartCard>

//       {/* Quarterly Category Distribution (Jul-Sep) - Modern Pie Chart */}
//       <ChartCard 
//         title="Category Distribution - Quarterly"
//         subtitle="Planned, Unplanned, Abnormal"
//         icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 2v10l7 7" /></svg>}
//         iconGradient="from-purple-500 to-pink-500"
//         statusLabel="Q3"
//       >
//         <ResponsiveContainer width="100%" height={320}>
//           <PieChart>
//             <Pie 
//               {...({ activeIndex, activeShape: renderActiveShape } as any)}
//               data={prepareCategoryQuarterlyData()}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               onMouseEnter={onPieEnter}
//               outerRadius={100}
//               innerRadius={60}
//               paddingAngle={3}
//               dataKey="value"
//               className="shadow-md"
//             >
//               {prepareCategoryQuarterlyData().map((entry, index) => (
//                 <Cell 
//                   key={`cell-${index}`} 
//                   fill={entry.color}
//                   stroke={activeIndex === index ? entry.color : "#ffffff"} 
//                   strokeWidth={activeIndex === index ? 4 : 2}
//                   className="cursor-pointer transition-all duration-300 ease-in-out"
//                 />
//               ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//           </PieChart>
//         </ResponsiveContainer>
//         {/* Custom Legend for Pie Chart */}
//         <div className="flex justify-center mt-4">
//           <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
//             {prepareCategoryQuarterlyData().map((entry, index) => (
//               <div key={index} className="flex items-center gap-2 font-medium text-gray-700">
//                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
//                 <span>{entry.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </ChartCard>
//     </div>
//   );


//   return (
//     <div className="min-h-screen p-6 font-sans">
      
//       {/* 1. Main Header Card */}
//       <div className="rounded-3xl bg-white p-8 mb-10 shadow-2xl transition-all duration-500 transform hover:scale-[1.01] relative overflow-hidden ring-8 ring-blue-500/20 hover:ring-purple-500/30">
//         <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl transition-opacity duration-500"></div>
//         <div className="relative z-10">
//           <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700">4M Change Management</span>
//           </h1>
//           <p className="text-gray-600 text-lg mb-6 max-w-2xl font-medium">
//             Monitor, manage, and track all manufacturing changes in real-time to maintain peak quality standards.
//           </p>
//           <div className="flex flex-wrap gap-4">
//             <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-blue-600/50 flex items-center gap-2 font-bold uppercase tracking-wide transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
//               New Change Request
//             </button>
//             <button className="bg-white text-gray-700 ring-4 ring-gray-300/50 hover:ring-purple-500/50 hover:bg-purple-50/50 px-8 py-3 rounded-xl shadow-md flex items-center gap-2 font-semibold transition-all duration-300 transform hover:scale-[1.02]">
//               <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path d="M9 17v-2a4 4 0 0 1 8 0v2" />
//                 <circle cx="12" cy="7" r="4" />
//               </svg>
//               View All Records
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* 2. Stats Cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         {stats.map((stat, idx) => (
//           <div key={idx} className={`bg-white rounded-2xl p-6 relative overflow-hidden transition-all duration-300 transform hover:scale-[1.03] border border-gray-100/50 shadow-lg ${stat.shadow}`}>
//             <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-20 bg-gradient-to-br ${stat.gradient} blur-sm`}></div>
//             <div className="flex flex-col gap-4 relative z-10">
//               <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} shadow-xl shadow-gray-400/40`}>
//                 {stat.icon}
//               </div>
//               <div className="flex items-end justify-between">
//                 <span className="text-4xl font-extrabold text-gray-900 leading-none">{stat.value}</span>
//                 <span className={`text-sm font-bold ${stat.trendColor} px-3 py-1 rounded-full bg-current/10 uppercase`}>{stat.trend}</span>
//               </div>
//               <span className="text-lg font-medium text-gray-500 mt-1">{stat.label}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 3. Monthly Trend Chart */}
//       {monthlyTrendData.length > 0 && (
//         <div className="mb-10">
//           <QuarterlyMonitoringChart
//             data={monthlyTrendData}
//             title="Monthly Change Count Trend"
//             subtitle="Total changes per month vs. target & average across all 4Ms"
//             targetValue={5} 
//             yAxisLabel="Change Count"
//             barColor="#3B82F6"
//             averageColor="#EF4444"
//             trendLineColor="#8B5CF6"
//           />
//         </div>
//       )}

//             {changeList.length > 0 ? (
//         <>
//           {/* Quarterly Data (Historical Context - Position 5) */}
//           {/* {QuarterlyCharts} */}

//           {/* Current Month Data (Live Data - Position 6) */}
//           {CurrentMonthCharts} 
//         </>
//       ) : (
//         /* No Data State */
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <NoDataCard title="4M Changes Distribution" subtitle="Manufacturing change breakdown" iconColor="text-blue-500" />
//           <NoDataCard title="Category Distribution" subtitle="Change type breakdown" iconColor="text-purple-500" />
//         </div>
//       )}

//       {/* 4 & 5. Additional Analytics and Recent Changes (The combined section) */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
//         {/* Analytics Summary */}
//         {changeList.length > 0 && (
//           <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-8 border border-gray-100/50 transition-all duration-300 transform hover:shadow-2xl hover:ring-2 hover:ring-blue-500/20">
//             <h3 className="font-extrabold text-2xl text-gray-900 mb-6 border-b pb-4 border-gray-100">Action Summary 🎯</h3>
//             <div className="space-y-6">
//               <AnalyticsItem label="Planned Changes" value={plannedChanges} total={totalChanges} color="bg-green-500" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>} />
//               <AnalyticsItem label="Unplanned Changes" value={unplannedChanges} total={totalChanges} color="bg-orange-500" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
//               <AnalyticsItem label="Abnormal Changes" value={abnormalChanges} total={totalChanges} color="bg-red-600" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
//             </div>

//             <h4 className="font-bold text-lg text-gray-700 mt-8 mb-4">Post-Change Actions</h4>
//             <div className="space-y-4">
//               <ActionItem label="Pending Approvals" count={pendingApprovals} total={totalChanges} color="bg-yellow-500" />
//               <ActionItem label="Set-Up Approvals" count={setUpApprovals} total={totalChanges} color="bg-blue-500" />
//               <ActionItem label="Retroactive Inspections" count={retroactiveInspections} total={totalChanges} color="bg-purple-500" />
//               <ActionItem label="Suspected Lot Checks" count={suspectedLotChecks} total={totalChanges} color="bg-red-500" />
//             </div>
//           </div>
//         )}

//         {/* Recent Changes List */}
//           <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 border border-gray-100/50 transition-all duration-300 transform hover:shadow-2xl hover:ring-2 hover:ring-blue-500/20">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="font-extrabold text-2xl text-gray-900">Recent Change Activity ⚡</h2>
//             <button className="bg-white text-gray-700 ring-1 ring-gray-300 hover:ring-blue-500 hover:text-blue-600 px-4 py-2 rounded-xl font-semibold flex items-center gap-1 transition-all duration-300">
//               <span>View All</span>
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
//             </button>
//           </div>
          
//           {/* {recentChanges.length > 0 ? (
//             <div className="space-y-4">
//               {recentChanges.map((item, idx) => (
//                 <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-300 hover:shadow-2xl hover:ring-4 hover:ring-purple-500/10 border border-gray-100/50">
//                   <div className="flex items-start md:items-center flex-grow space-x-4 mb-4 md:mb-0">
//                     <span className={`flex-shrink-0 w-3 h-3 rounded-full ${item.color} shadow-lg shadow-gray-400/30`}></span>
//                     <div className="min-w-0">
//                       <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${item.priorityColor} mb-1`}>{item.category} / {item.type}</span>
//                       <div className="font-bold text-lg text-gray-900 truncate">{item.title}</div>
//                       <div className="text-sm text-gray-500 mt-1">Action: <span className="text-gray-700 font-medium">{item.action}</span></div>
//                     </div>
//                   </div>
                  
//                   <div className="flex flex-col md:items-end flex-shrink-0 min-w-[150px]">
//                     <span className="text-sm font-medium text-gray-500 mb-2">Change Date: <span className="font-semibold text-gray-700">{item.date}</span></span>
//                     <div className="flex flex-wrap gap-2 justify-start md:justify-end">
//                       {item.setUpApproval && (<Badge label="Set-Up Approved" color="bg-blue-100 text-blue-700" />)}
//                       {item.retroactiveInspection && (<Badge label="Inspection Done" color="bg-orange-100 text-orange-700" />)}
//                       {item.suspectedLotCheck && (<Badge label="Lot Check OK" color="bg-red-100 text-red-700" />)}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <NoRecordsPlaceholder />
//           )}
//         </div>
//       </div> */}
//       {recentChanges.length > 0 ? (
//   <div className="space-y-4">
//     {recentChanges.map((item, idx) => (
//       <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-300 hover:shadow-2xl hover:ring-4 hover:ring-purple-500/10 border border-gray-100/50">
//         <div className="flex items-start md:items-center flex-grow space-x-4 mb-4 md:mb-0">
//           <span className={`flex-shrink-0 w-3 h-3 rounded-full ${item.color} shadow-lg shadow-gray-400/30`}></span>
//           <div className="min-w-0">
//             <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${item.priorityColor} mb-1`}>{item.category} / {item.type}</span>
//             <div className="font-bold text-lg text-gray-900 truncate">{item.title}</div>
//             <div className="text-sm text-gray-500 mt-1">Action: <span className="text-gray-700 font-medium">{item.action}</span></div>
//           </div>
//         </div>
        
//         <div className="flex flex-col md:items-end flex-shrink-0 min-w-[150px]">
//           <span className="text-sm font-medium text-gray-500 mb-2">Change Date: <span className="font-semibold text-gray-700">{item.date}</span></span>
//           <div className="flex flex-wrap gap-2 justify-start md:justify-end">
//             {/* UPDATED: Show different badges based on approval status */}
//             {item.setUpApprovalRequired && item.setUpApproved && (
//               <Badge label="✓ Set-Up Approved" color="bg-green-100 text-green-700" />
//             )}
//             {item.setUpApprovalRequired && !item.setUpApproved && (
//               <Badge label="⏳ Set-Up Approval Pending" color="bg-yellow-100 text-yellow-700" />
//             )}
//             {item.retroactiveInspectionRequired && (
//               <Badge label="Inspection Required" color="bg-orange-100 text-orange-700" />
//             )}
//             {item.suspectedLotCheckRequired && (
//               <Badge label="Lot Check Required" color="bg-red-100 text-red-700" />
//             )}
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// ) : (
//   <NoRecordsPlaceholder />
// )}
// </div>
//       </div> 
//       {/* -------------------------------------------------------------------------------------- */}
//       {/* 6. CHARTS SECTION (NEW LAST POSITION - Quarterly THEN Current Month) */}
//       {/* -------------------------------------------------------------------------------------- */}
      
//       {changeList.length > 0 ? (
//         <>
//           {/* Quarterly Data (Historical Context - Position 5) */}
//           {QuarterlyCharts}

//           {/* Current Month Data (Live Data - Position 6) */}
//           {/* {CurrentMonthCharts}  */}
//         </>
//       ) : (
//         /* No Data State */
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <NoDataCard title="4M Changes Distribution" subtitle="Manufacturing change breakdown" iconColor="text-blue-500" />
//           <NoDataCard title="Category Distribution" subtitle="Change type breakdown" iconColor="text-purple-500" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardView;