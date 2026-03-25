import { DUMMY_HIERARCHY, DUMMY_STATION_REQUIREMENTS } from '../Skillmatrix/pages/dummySkillData';
import { DUMMY_EMPLOYEES } from '../MasterTable/dummyData';
import { DUMMY_SKILL_MATRIX_API_DATA } from '../Skillmatrix/pages/dummySkillData';

export interface Department {
    id: number;
    name: string;
}

export interface ShiftDefinition {
    id: number;
    name: string;
    description: string;
    overtime_combos?: string[];
}

export interface ShiftPlanData {
    emp_id: string;
    name: string;
    deployment_plan: string;
    days: Record<string, string>;
    attendance_status?: Record<string, string>;
    hierarchy_id?: number;
}

export interface HierarchyFilter {
    lineId?: number;
    subLineId?: number;
    stationId?: number;
}

export const fetchHierarchy = async () => {
    return { data: [{ structure_data: { departments: (DUMMY_HIERARCHY as any[]).map(d => ({
        id: d.department_id,
        department_name: d.department_name,
        lines: (d.lines || []).map((l: any) => ({
            id: l.line_id,
            line_name: l.line_name,
            sublines: (l.sublines || []).map((sl: any) => ({
                id: sl.subline_id,
                subline_name: sl.subline_name,
                stations: (sl.stations || []).map((st: any) => ({
                    id: st.id || st.station_id,
                    station_name: st.station_name
                }))
            })),
            stations: (l.stations || []).map((st: any) => ({
                id: st.id || st.station_id,
                station_name: st.station_name
            }))
        })),
        stations: []
    })) } }] };
};

export const fetchShifts = async () => {
    return { data: [
        { id: 1, name: 'A', description: 'Morning Shift' },
        { id: 2, name: 'B', description: 'Evening Shift' },
        { id: 3, name: 'C', description: 'Night Shift' },
        { id: 4, name: 'G', description: 'General Shift', overtime_combos: ['G+OT'] },
    ] };
};

// Persist substitutions in localStorage for demo stability
const STORAGE_KEY = 'heatmap_substitutions';
let cachedRoster: ShiftPlanData[] | null = null; // Always regenerate from fresh dummy data
let cachedSubstitutions: Record<string, { emp_id: string; is_approved: boolean }> = {};

try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) cachedSubstitutions = JSON.parse(saved);
} catch (e) {
    console.error('Failed to load substitutions from localStorage', e);
}

const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedSubstitutions));
};

export const fetchHeatMapRoster = async (deptId: number, month: number, year: number, filter: HierarchyFilter) => {
    if (cachedRoster) {
        // Return filtered version of cache
        const filtered = cachedRoster.filter(emp => {
            const matchesDept = !deptId || (emp as any).deptId === deptId;
            const matchesLine = !filter.lineId || (DUMMY_HIERARCHY as any[]).some(d => 
                (d.lines || []).some((l: any) => l.line_id === filter.lineId && 
                (l.stations || []).some((s: any) => (s.id || s.station_id) === emp.hierarchy_id))
            );
            const matchesStation = !filter.stationId || emp.hierarchy_id === filter.stationId;
            
            return matchesDept && matchesLine && matchesStation;
        });
        return { data: filtered };
    }

    const roster: ShiftPlanData[] = [];
    const deptEmployees = (DUMMY_EMPLOYEES as any[]);

    deptEmployees.forEach(emp => {
        const allAssignments = DUMMY_SKILL_MATRIX_API_DATA.filter(sm => 
            sm.emp_id === emp.emp_id && 
            sm.level >= 1
        );

        const uniqueStationIds = new Set<number>();
        const uniqueAssignments: any[] = [];
        allAssignments.forEach(a => {
            if (!uniqueStationIds.has(a.station_id)) {
                uniqueStationIds.add(a.station_id);
                uniqueAssignments.push(a);
            }
        });

        uniqueAssignments.forEach(assign => {
            let stationName = `Station ${assign.station_id}`;
            (DUMMY_HIERARCHY as any[]).forEach(dept => {
                dept.lines.forEach((line: any) => {
                    line.stations.forEach((st: any) => {
                        if (st.station_id === assign.station_id) stationName = st.station_name;
                    });
                    line.sublines.forEach((sl: any) => {
                        sl.stations.forEach((st: any) => {
                            if (st.station_id === assign.station_id) stationName = st.station_name;
                        });
                    });
                });
            });

            const days: Record<string, string> = {};
            const daysInMonth = new Date(year, month, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const dateObj = new Date(year, month - 1, d);
                // Deterministic dummy shifts: Assign 'A' or 'B' based on employee ID
                if (dateObj.getDay() === 0) {
                    days[dateStr] = 'WO';
                } else {
                    const empSuffix = parseInt(emp.emp_id.replace(/\D/g, '')) || 0;
                    const shiftIdx = (empSuffix + d) % 3;
                    days[dateStr] = ['A', 'B', 'G'][shiftIdx];
                }
            }

            roster.push({
                emp_id: emp.emp_id,
                name: emp.full_name || `${emp.first_name} ${emp.last_name}`,
                deployment_plan: stationName,
                days: days,
                attendance_status: {},
                hierarchy_id: assign.station_id,
                // @ts-ignore
                deptId: emp.department?.department_id
            });
        });
    });

    cachedRoster = roster;
    const filtered = roster.filter(emp => !deptId || (emp as any).deptId === deptId);
    return { data: filtered };
};

export const updateHeatMapShift = async (payload: any) => {
    console.log('Dummy Update Shift:', payload);
    const { emp_id, date, shift } = payload;
    const stationId = payload.station_id || payload.hierarchy_id;
    
    if (cachedRoster) {
        cachedRoster = cachedRoster.map(item => {
            if (item.emp_id === emp_id && (stationId ? item.hierarchy_id === stationId : true)) {
                return {
                    ...item,
                    days: {
                        ...item.days,
                        [date]: shift
                    }
                };
            }
            return item;
        });
    }
    
    return { success: true };
};

export const fetchHeatmapData = async (date: string, deptId: number, filters: any) => {
    // @ts-ignore
    const [year, month, day] = date.split('-').map(Number);
    // Fetch FULL roster (deptId=0) to see all potential assignments across departments
    const rosterRes = await fetchHeatMapRoster(0, month, year, filters);
    const fullRoster = rosterRes.data;

    const lines: any[] = [];
    let totalRequired = 0;
    let totalAvailable = 0;

    // 1. Find the target department in the hierarchy
    const targetDept = (DUMMY_HIERARCHY as any[]).find(d => d.department_id === deptId);
    if (!targetDept) return { data: { meta: {}, summary: {}, lines: [] } };

    // 2. Iterate through the hierarchy of the selected department
    const allDeptStations = [
        ...(targetDept.stations || []),
        ...(targetDept.lines || []).flatMap((l: any) => [
            ...(l.stations || []),
            ...(l.sublines || []).flatMap((sl: any) => sl.stations || [])
        ])
    ];

    (targetDept.lines || []).forEach((l: any) => {
        // Filter by lineId if provided
        if (filters.lineId && l.line_id !== filters.lineId) return;

        const lineData: any = {
            line_id: l.line_id,
            line_name: l.line_name,
            required: 0,
            available: 0,
            stations: []
        };

        // We want THIS line to show ALL stations to ensure full columns, 
        // but transformForShift will mark un-owned ones as N/A.
        allDeptStations.forEach((st: any) => {
            // Find if this station actually belongs to THIS line or its sublines
            const isOwnedByLine = (l.stations || []).some((s: any) => s.station_id === st.station_id) ||
                                 (l.sublines || []).some((sl: any) => (sl.stations || []).some((s: any) => s.station_id === st.station_id));

            // Find min skill requirement
            const req = (DUMMY_STATION_REQUIREMENTS as any[]).find(r => r.station_id === st.station_id);
            const op = (DUMMY_SKILL_MATRIX_API_DATA as any[]).find(sm => sm.station_id === st.station_id);
            const minLevelNum = req?.minimum_level_number || (op?.minimum_skill_required) || 1;
            
            const station: any = {
                station_id: st.station_id,
                station_name: st.station_name,
                min_skill: `L${minLevelNum}`,
                required: isOwnedByLine ? (req?.minimum_operators || 1) : 0,
                available: 0,
                gap: 0,
                is_applicable: isOwnedByLine, // Flag for frontend N/A logic
                employees: []
            };

            // 3. Find anyone assigned to this station on this date/shift
            if (isOwnedByLine) {
                (['A', 'B', 'C', 'G'] as const).forEach(shKey => {
                    const subKey = `${date}_${shKey}_${st.station_id}`;
                    const subRecord = cachedSubstitutions[subKey];
                    
                    let emp: any = null;
                    let isSub = false;

                    if (subRecord) {
                        emp = fullRoster.find((e: any) => e.emp_id === subRecord.emp_id);
                        isSub = true;
                    } else {
                        emp = fullRoster.find((e: any) => e.hierarchy_id === st.station_id && e.days[date] === shKey);
                        isSub = false;
                    }

                    if (emp) {
                        const skillRecord = (DUMMY_SKILL_MATRIX_API_DATA as any[]).find(sm => 
                            sm.emp_id === emp.emp_id && 
                            sm.station_id === st.station_id
                        );
                        
                        const presenceVal = (parseInt(emp.emp_id.replace(/\D/g, '')) + parseInt(date.split('-')[2])) % 10 !== 0 ? 'Present' : 'Absent';

                        const empObj: any = {
                            emp_id: emp.emp_id,
                            name: emp.name,
                            shift: shKey,
                            skill_level: skillRecord ? `L${skillRecord.level}` : 'L1',
                            presence: isSub ? 'Present' : presenceVal,
                            is_substitute: isSub,
                            requires_approval: isSub && skillRecord && (skillRecord.level < minLevelNum),
                            is_approved: isSub ? (subRecord?.is_approved || false) : true
                        };
                        station.employees.push(empObj);
                        station.available += 1;
                    }
                });
            }

            station.gap = Math.max(0, station.required - station.available);
            lineData.stations.push(station);
            lineData.required += station.required;
            lineData.available += station.available;
        });

        if (lineData.stations.length > 0) {
            lines.push(lineData);
            totalRequired += lineData.required;
            totalAvailable += lineData.available;
        }
    });

    return {
        data: {
            meta: {
                date,
                applied_filters: { department_id: deptId, ...filters },
                total_stations: totalRequired,
                total_assigned: totalAvailable,
                coverage_pct: totalRequired ? Math.round((totalAvailable / totalRequired) * 100) : 0,
                total_gaps: Math.max(0, totalRequired - totalAvailable)
            },
            summary: {
                required: totalRequired,
                available: totalAvailable,
                gap: Math.max(0, totalRequired - totalAvailable)
            },
            lines
        }
    };
};

export const assignSubstitute = async (payload: { date: string; shift: string; station_id: number; emp_id: string }) => {
    const { date, shift, station_id, emp_id } = payload;
    const subKey = `${date}_${shift}_${station_id}`;
    cachedSubstitutions[subKey] = { emp_id, is_approved: false };
    saveToStorage();
    return { success: true };
};

export const approveSubstitute = async (payload: { date: string; shift: string; station_id: number }) => {
    const { date, shift, station_id } = payload;
    const subKey = `${date}_${shift}_${station_id}`;
    if (cachedSubstitutions[subKey]) {
        cachedSubstitutions[subKey].is_approved = true;
        saveToStorage();
    }
    return { success: true };
};

export const clearSubstitutions = async () => {
    cachedSubstitutions = {};
    cachedRoster = null; // Force fresh roster generation
    localStorage.removeItem(STORAGE_KEY);
    return { success: true };
};

export const getAvailableSubstitutes = async (date: string, shift: string, station_id?: number) => {
    // Return all employees WHO ARE PRESENT but NOT ASSIGNED to anything else on this shift/date
    const allEmps = (DUMMY_EMPLOYEES as any[]).map(emp => {
        const smData = (DUMMY_SKILL_MATRIX_API_DATA as any[]).filter(s => s.emp_id === emp.emp_id);
        
        // If station_id is provided, check if employee has ANY skill for that station
        const stationSkill = station_id ? smData.find(s => s.station_id === station_id) : null;
        const hasAnySkill = !station_id || !!stationSkill;

        const empSuffix = parseInt(emp.emp_id.replace(/\D/g, '')) || 0;
        const day = parseInt(date.split('-')[2]) || 1;
        const isPresent = (empSuffix + day) % 10 !== 0; 
        
        return {
            emp_id: emp.emp_id,
            name: `${emp.first_name} ${emp.last_name}`,
            isPresent,
            level: stationSkill?.level || 1,
            isQualified: hasAnySkill
        };
    }).filter(e => e.isQualified && e.isPresent); // Only show present and qualified-ish workers

    return { data: allEmps };
};
