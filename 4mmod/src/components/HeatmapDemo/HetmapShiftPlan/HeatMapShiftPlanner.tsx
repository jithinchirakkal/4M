import React, { useState, useEffect, useMemo } from 'react';
import { 
  fetchHierarchy, fetchHeatMapRoster, fetchShifts, updateHeatMapShift,
} from './api_heatmap';
import type {
  Department, ShiftPlanData, ShiftDefinition, HierarchyFilter 
} from './api_heatmap';
import { 
  ChevronDown, Users, RefreshCw, Search, Loader2, Clock 
} from 'lucide-react';

const HeatMapShiftPlanner: React.FC = () => {
  // --- STATE ---
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('');

  const [hierarchyData, setHierarchyData] = useState<any[]>([]); 
  const [availableLines, setAvailableLines] = useState<any[]>([]);
  const [availableSubLines, setAvailableSubLines] = useState<any[]>([]);
  const [availableStations, setAvailableStations] = useState<any[]>([]);
  const [selectedLine, setSelectedLine] = useState<string>('');
  const [selectedSubLine, setSelectedSubLine] = useState<string>('');
  const [selectedStation, setSelectedStation] = useState<string>('');
  
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(-1); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  
  const [rosterData, setRosterData] = useState<ShiftPlanData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [availableShifts, setAvailableShifts] = useState<string[]>([]);
  const [shiftDefs, setShiftDefs] = useState<ShiftDefinition[]>([]); 
  const [shiftColors, setShiftColors] = useState<Record<string, string>>({});

  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => { loadDepartments(); loadShifts(); }, []);

  // --- HELPERS ---
  const generateColorForShift = (name: string): string => {
    const predefined: Record<string, string> = {
        'A': '#dcfce7', 'B': '#fef9c3', 'C': '#dbeafe', 'G': '#f3f4f6',
        'WO': '#fee2e2', 'PL': '#ffedd5', 'UL': '#fecaca', 'PH': '#fae8ff', 
    };
    return predefined[name] || '#f3f4f6';
  };

  const getShiftCardStyle = (name: string) => {
      const styles: Record<string, string> = {
          'A': 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-800',
          'B': 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 text-amber-800',
          'C': 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-800',
          'G': 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 text-slate-800',
          'Total': 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-800'
      };
      return styles[name] || styles['G'];
  };

  const loadDepartments = async () => {
    try {
      const res = await fetchHierarchy();
      setHierarchyData(res.data as any[]);
      const depts: Department[] = [];
      (res.data as any[]).forEach((struct: any) => {
        struct.structure_data.departments.forEach((d: any) => depts.push({ id: d.id, name: d.department_name }));
      });
      setDepartments(depts);
    } catch (error) { console.error(error); }
  };

  const handleDeptChange = (deptId: string) => {
    setSelectedDept(deptId);
    setSelectedLine(''); setSelectedSubLine(''); setSelectedStation('');
    setAvailableLines([]); setAvailableSubLines([]); setAvailableStations([]);
    if (!deptId) return;

    const lines: any[] = [];
    const stationsDirect: any[] = [];
    hierarchyData.forEach((struct: any) => {
      struct.structure_data.departments.forEach((d: any) => {
        if (String(d.id) === String(deptId)) {
          (d.lines || []).forEach((l: any) => lines.push(l));
          (d.stations || []).forEach((s: any) => stationsDirect.push(s));
        }
      });
    });
    setAvailableLines(lines);
    if (lines.length === 0) setAvailableStations(stationsDirect);
  };

  const handleLineChange = (lineId: string) => {
    setSelectedLine(lineId); setSelectedSubLine(''); setSelectedStation('');
    setAvailableSubLines([]); setAvailableStations([]);
    if (!lineId) return;

    let sublines: any[] = [];
    let linestations: any[] = [];
    hierarchyData.forEach((struct: any) => {
      struct.structure_data.departments.forEach((d: any) => {
        (d.lines || []).forEach((l: any) => {
          if (String(l.id) === String(lineId)) {
            sublines = l.sublines || [];
            linestations = l.stations || [];
          }
        });
      });
    });
    setAvailableSubLines(sublines);
    if (sublines.length === 0) setAvailableStations(linestations);
  };

  const handleSubLineChange = (sublineId: string) => {
    setSelectedSubLine(sublineId); setSelectedStation('');
    setAvailableStations([]);
    if (!sublineId) return;

    let sublStations: any[] = [];
    hierarchyData.forEach((struct: any) => {
      struct.structure_data.departments.forEach((d: any) => {
        (d.lines || []).forEach((l: any) => {
          (l.sublines || []).forEach((sl: any) => {
            if (String(sl.id) === String(sublineId)) sublStations = sl.stations || [];
          });
        });
      });
    });
    setAvailableStations(sublStations);
  };

  const loadShifts = async () => {
    try {
      const res = await fetchShifts();
      setShiftDefs(res.data);
      const shifts = res.data.map((s: any) => s.name); 
      setAvailableShifts(shifts);
      
      const colors: Record<string, string> = {};
      shifts.forEach((s: string) => { colors[s] = generateColorForShift(s); });
      ['WO', 'PL', 'UL', 'PH'].forEach(code => colors[code] = generateColorForShift(code));
      setShiftColors(colors);
    } catch (error) { console.error(error); }
  };

  const loadRoster = async () => {
    if (!selectedDept) return alert("Please select a Department");
    setLoading(true);
    try {
      const filter: HierarchyFilter = {
        ...(selectedLine    && { lineId:    Number(selectedLine) }),
        ...(selectedSubLine && { subLineId: Number(selectedSubLine) }),
        ...(selectedStation && { stationId: Number(selectedStation) }),
      };
      const res = await fetchHeatMapRoster(Number(selectedDept), month, year, filter);
      setRosterData(res.data);
      const days = new Date(year, month, 0).getDate();
      setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));
    } catch (error) { alert("Error loading data"); } 
    finally { setLoading(false); }
  };

  const handleCellChange = async (empId: string, dateStr: string, newValue: string, rowHierarchyId?: number) => {
    const payload: any = {
      emp_id: empId,
      date: dateStr,
      value: newValue,
      department_id: Number(selectedDept)
    };
    if (rowHierarchyId) {
      payload.hierarchy_id = rowHierarchyId;
    } else {
      if (selectedLine) payload.line_id = Number(selectedLine);
      if (selectedSubLine) payload.subline_id = Number(selectedSubLine);
      if (selectedStation) payload.station_id = Number(selectedStation);
    }

    if (newValue && newValue !== 'WO') {
      const isShiftConflict = rosterData.some(emp => 
        emp.emp_id === empId && 
        (rowHierarchyId ? (emp as any).hierarchy_id !== rowHierarchyId : true) &&
        emp.days[dateStr] === newValue
      );

      if (isShiftConflict) {
        alert(`Cannot assign ${newValue} Shift for ${empId} because they are already assigned that shift at another station for this date.`);
        return;
      }
    }

    const updatedData = rosterData.map(emp => {
      // Strictly match emp_id AND hierarchy_id (station) for updating
      if (emp.emp_id === empId && (rowHierarchyId ? (emp as any).hierarchy_id === rowHierarchyId : true)) {
         return { ...emp, days: { ...emp.days, [dateStr]: newValue } };
      }
      return emp;
    });
    setRosterData(updatedData);

    try { 
        await updateHeatMapShift(payload); 
    } catch (error: any) { 
        const errMsg = error.response?.data?.error || "Error updating shift";
        alert(errMsg); 
        loadRoster(); 
    }
  };

  // --- VIEW HELPERS ---
  interface WeekRange { label: string; start: number; end: number; }
  const weeks = useMemo(() => {
    const weeksArr: WeekRange[] = [];
    const totalDays = new Date(year, month, 0).getDate();
    let currentDay = 1; let weekNum = 1;
    while (currentDay <= totalDays) {
      let endDay = currentDay;
      while (endDay < totalDays) {
        const date = new Date(year, month - 1, endDay);
        if (date.getDay() === 0) break; 
        endDay++;
      }
      weeksArr.push({ label: `W${weekNum}`, start: currentDay, end: endDay });
      currentDay = endDay + 1; weekNum++;
    }
    return weeksArr;
  }, [month, year]);

  const visibleDays = useMemo(() => {
    if (selectedWeekIndex === -1) return daysInMonth; 
    const w = weeks[selectedWeekIndex];
    if (!w) return [];
    return Array.from({ length: (w.end - w.start) + 1 }, (_, i) => w.start + i);
  }, [selectedWeekIndex, weeks, daysInMonth]);

  const manpowerTotals = useMemo(() => {
    if (!daysInMonth.length || !availableShifts.length) return { byShift: {}, grand: {} };
    
    const totals: Record<string, Record<string, number>> = {};
    [...availableShifts, 'WO', 'PL', 'PH'].forEach(s => totals[s] = {});
    const grandTotals: Record<string, number> = {};

    daysInMonth.forEach(day => {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      grandTotals[dateStr] = 0;
      [...availableShifts, 'WO', 'PL', 'PH'].forEach(s => totals[s][dateStr] = 0);
      
      rosterData.forEach(emp => {
        const shiftStr = emp.days[dateStr];
        if (shiftStr) {
            const parts = shiftStr.split('+').map(p => p.trim());
            parts.forEach(s => {
                if (totals[s] !== undefined) totals[s][dateStr] = (totals[s][dateStr] || 0) + 1;
            });
            if (parts.some(p => availableShifts.includes(p))) {
                grandTotals[dateStr] += 1;
            }
        }
      });
    });
    return { byShift: totals, grand: grandTotals };
  }, [rosterData, daysInMonth, month, year, availableShifts]);

  const viewStats = useMemo(() => {
      // @ts-ignore
      const stats: Record<string, number> = { Total: 0 };
      availableShifts.forEach(s => stats[s] = 0);
      
      if (!rosterData.length || visibleDays.length === 0) return stats;

      visibleDays.forEach(day => {
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          availableShifts.forEach(shift => {
              stats[shift] = (stats[shift] || 0) + (manpowerTotals.byShift[shift]?.[dateStr] || 0);
          });
          stats.Total += (manpowerTotals.grand[dateStr] || 0);
      });
      return stats;
  }, [manpowerTotals, visibleDays, rosterData, availableShifts]);

  const filteredRoster = useMemo(() => {
      if(!searchTerm) return rosterData;
      return rosterData.filter(d => 
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          d.emp_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [rosterData, searchTerm]);

  return (
    <div className="bg-gray-100 h-full font-sans flex flex-col">
      <header className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 text-white px-6 py-4 flex flex-col xl:flex-row gap-4 justify-between items-center shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm border border-white/20">
                <Users size={24} className="text-white" />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Heat Map Planner</h1>
                <p className="text-xs text-purple-200 font-medium uppercase tracking-wider">Skill-Matrix Schedule</p>
            </div>
            
            <div className="relative w-full sm:w-52">
                <select className="w-full appearance-none bg-white/10 border border-white/20 text-white rounded-lg py-2 pl-4 pr-10 text-sm font-semibold focus:ring-2 focus:ring-white/50 outline-none transition-all cursor-pointer hover:bg-white/20"
                    value={selectedDept} onChange={e => handleDeptChange(e.target.value)}>
                    <option value="" className="text-gray-800">Dept *</option>
                    {departments.map(d => <option key={d.id} value={d.id} className="text-gray-800">{d.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-white/70 pointer-events-none" />
            </div>

            {availableLines.length > 0 && (
              <div className="relative w-full sm:w-44">
                <select className="w-full appearance-none bg-white/10 border border-white/20 text-white rounded-lg py-2 pl-4 pr-10 text-sm font-semibold focus:ring-2 focus:ring-white/50 outline-none transition-all cursor-pointer hover:bg-white/20"
                  value={selectedLine} onChange={e => handleLineChange(e.target.value)}>
                  <option value="" className="text-gray-800">All Lines</option>
                  {availableLines.map((l: any) => <option key={l.id} value={l.id} className="text-gray-800">{l.line_name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-white/70 pointer-events-none" />
              </div>
            )}

            {availableSubLines.length > 0 && (
              <div className="relative w-full sm:w-44">
                <select className="w-full appearance-none bg-white/10 border border-white/20 text-white rounded-lg py-2 pl-4 pr-10 text-sm font-semibold focus:ring-2 focus:ring-white/50 outline-none transition-all cursor-pointer hover:bg-white/20"
                  value={selectedSubLine} onChange={e => handleSubLineChange(e.target.value)}>
                  <option value="" className="text-gray-800">All SubLines</option>
                  {availableSubLines.map((sl: any) => <option key={sl.id} value={sl.id} className="text-gray-800">{sl.subline_name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-white/70 pointer-events-none" />
              </div>
            )}

            {availableStations.length > 0 && (
              <div className="relative w-full sm:w-44">
                <select className="w-full appearance-none bg-white/10 border border-white/20 text-white rounded-lg py-2 pl-4 pr-10 text-sm font-semibold focus:ring-2 focus:ring-white/50 outline-none transition-all cursor-pointer hover:bg-white/20"
                  value={selectedStation} onChange={e => setSelectedStation(e.target.value)}>
                  <option value="" className="text-gray-800">All Stations</option>
                  {availableStations.map((s: any) => <option key={s.id} value={s.id} className="text-gray-800">{s.station_name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-white/70 pointer-events-none" />
              </div>
            )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg p-1">
                <select className="bg-transparent border-none text-sm font-medium py-1.5 pl-2 pr-1 outline-none text-white cursor-pointer"
                    value={month} onChange={e => setMonth(Number(e.target.value))}>
                    {MONTH_NAMES.map((name, index) => <option key={index} value={index + 1} className="text-gray-800">{name}</option>)}
                </select>
                <div className="w-px h-4 bg-white/20 mx-1"></div>
                <input type="number" className="bg-transparent border-none text-sm font-medium w-16 py-1.5 text-center outline-none text-white"
                    value={year} onChange={e => setYear(Number(e.target.value))} />
            </div>

            <button onClick={loadRoster} disabled={loading} className="flex items-center gap-2 bg-white text-purple-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-50 transition-all shadow-sm">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> {loading ? "..." : "Load"}
            </button>
        </div>
      </header>

      <div className="w-full bg-gray-50/80 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-1 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
               <Clock size={14} /> Heat Map Shift Codes
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
              {shiftDefs.map(s => (
                  <div key={s.name} className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-md border border-gray-200 text-xs shadow-sm">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: shiftColors[s.name] || '#ccc' }}></div>
                      <span className="font-bold text-gray-700">{s.name} Shift</span>
                  </div>
              ))}
          </div>
      </div>

      <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50 backdrop-blur-sm">
         <div className="flex bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 overflow-x-auto w-full sm:w-auto">
            {weeks.map((w, idx) => (
                <button key={w.label} onClick={() => setSelectedWeekIndex(idx)} className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${selectedWeekIndex === idx ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>{w.label}</button>
            ))}
            <button onClick={() => setSelectedWeekIndex(-1)} className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${selectedWeekIndex === -1 ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>Full Month</button>
         </div>
         <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search Operator..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full sm:w-64 outline-none focus:ring-2 focus:ring-purple-200 shadow-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
         </div>
      </div>

      <div className="flex-1 px-6 pb-6 overflow-hidden flex flex-col">
        <div className="bg-white border border-gray-200 shadow-md rounded-xl flex-1 overflow-hidden flex flex-col">
            <div className="overflow-auto flex-1 custom-scrollbar">
                {loading ? ( <div className="flex flex-col items-center justify-center h-full text-center gap-2"><Loader2 className="animate-spin text-purple-600" size={32} /></div> ) : (
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-50/80 backdrop-blur z-20">
                            <tr>
                                <th className="sticky left-0 top-0 z-30 bg-gray-50 px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase w-24 border-b border-r border-gray-200">Emp Id</th>
                                <th className="sticky left-24 top-0 z-30 bg-gray-50 px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase w-48 border-b border-r border-gray-200 shadow-sm">Operator Name</th>
                                <th className="sticky top-0 z-30 bg-gray-50 px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase w-40 border-b border-r border-gray-200">Skill Target</th>

                                {visibleDays.map(d => {
                                    const dateObj = new Date(year, month-1, d);
                                    const isWeekend = dateObj.getDay() === 0;
                                    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                    const planned = manpowerTotals.grand[dateStr] || 0;
                                    
                                    return (
                                        <th key={d} className={`sticky top-0 z-20 px-1 py-2 text-center min-w-[54px] border-b border-r border-gray-200 ${isWeekend ? 'bg-orange-50/50' : 'bg-gray-50'}`}>
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-[10px] uppercase font-bold text-gray-400">{dateObj.toLocaleDateString('en-US', {weekday: 'short'})}</span>
                                                <span className={`text-sm font-extrabold ${isWeekend ? 'text-orange-600' : 'text-gray-700'}`}>{d}</span>
                                                <div className="flex flex-col gap-0.5 mt-1.5 w-full px-0.5">
                                                    {availableShifts.map(shift => {
                                                        const count = manpowerTotals.byShift[shift]?.[dateStr] || 0;
                                                        if(count === 0) return null;
                                                        return (
                                                            <div key={shift} className="flex justify-between px-1 py-[2px] rounded-[3px] text-[8px] font-medium border border-transparent" style={{ backgroundColor: shiftColors[shift] }}>
                                                                <span className="opacity-80">{shift}</span><span>{count}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredRoster.map((emp, index) => (
                                <tr key={`${emp.emp_id}-${emp.hierarchy_id || index}`} className="hover:bg-purple-50/20 transition-colors group">
                                    <td className="sticky left-0 z-10 bg-white group-hover:bg-purple-50/20 px-4 py-3 text-xs font-bold text-gray-600 border-r border-gray-100 font-mono">{emp.emp_id}</td>
                                    <td className="sticky left-24 z-10 bg-white group-hover:bg-purple-50/20 px-4 py-3 text-sm font-semibold text-gray-800 border-r border-gray-100 shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[12rem]">{emp.name}</td>
                                    <td className="px-4 py-3 text-xs text-gray-500 font-medium border-r border-gray-100 whitespace-nowrap overflow-hidden text-ellipsis max-w-[10rem]" title={emp.deployment_plan}>{emp.deployment_plan || "-"}</td>

                                    {visibleDays.map(day => {
                                        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const val = emp.days[dateStr] || '';
                                        const attendance = emp.attendance_status?.[dateStr] || 'Absent';
                                        const isPresent = attendance === 'Present';
                                        const isWeekend = new Date(year, month-1, day).getDay() === 0;

                                        return (
                                            <td key={dateStr} className={`p-0 border-r border-b border-gray-100 text-center relative ${isWeekend ? 'bg-orange-50/20' : ''}`}>
                                                <div className="w-full h-full p-[3px] relative flex items-center justify-center">
                                                    {/* Dot Indicator for Real-Time Presence */}
                                                    {attendance && (
                                                       <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${isPresent ? 'bg-emerald-500 shadow-emerald-200' : 'bg-red-400 shadow-red-100'} shadow-sm`} title={isPresent ? "Present at Plant" : "Absent"} />
                                                    )}
                                                    
                                                      <select value={val} onChange={(e) => handleCellChange(emp.emp_id, dateStr, e.target.value, emp.hierarchy_id)}
                                                          className="w-full h-8 text-center text-xs font-bold rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 focus:z-10 appearance-none border border-transparent hover:border-gray-200"
                                                          style={{ backgroundColor: shiftColors[val] || (val ? '#f3f4f6' : 'transparent'), color: val ? '#1f2937' : '#9ca3af' }}>
                                                          <option value="">-</option>
                                                          <option value="WO">WO</option>
                                                          {shiftDefs.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                                          <option value="PL">PL</option><option value="UL">UL</option>
                                                          <option value="PH">PH</option>
                                                          {shiftDefs.some(s => s.overtime_combos && s.overtime_combos.length > 0) && (
                                                            <optgroup label="-- Overtime --">
                                                              {shiftDefs.flatMap(s => s.overtime_combos || []).map(combo => (
                                                                <option key={combo} value={combo}>{combo}</option>
                                                              ))}
                                                            </optgroup>
                                                          )}
                                                      </select>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMapShiftPlanner;
