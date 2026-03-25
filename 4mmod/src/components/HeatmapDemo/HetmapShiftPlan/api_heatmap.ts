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

let cachedRoster: ShiftPlanData[] | null = null;
let cachedSubstitutions: Record<string, { emp_id: string; is_approved: boolean }> = {
    "2026-03-25_A_1": { emp_id: "EMP011", is_approved: false }
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

        const allStations = [
            ...(l.stations || []),
            ...(l.sublines || []).flatMap((sl: any) => sl.stations || [])
        ];

        allStations.forEach((st: any) => {
            // Filter by stationId if provided
            if (filters.stationId && st.station_id !== filters.stationId) return;

            // Find min skill requirement
            const req = (DUMMY_STATION_REQUIREMENTS as any[]).find(r => r.station_id === st.station_id);
            const op = (DUMMY_SKILL_MATRIX_API_DATA as any[]).find(sm => sm.station_id === st.station_id);
            const minLevelNum = req?.minimum_level_number || (op?.minimum_skill_required) || 1;
            
            const station: any = {
                station_id: st.station_id,
                station_name: st.station_name,
                min_skill: `L${minLevelNum}`,
                required: req?.minimum_operators || 1,
                available: 0,
                gap: 0,
                employees: []
            };

            // 3. Find anyone in the FULL roster assigned to this station on this date
            fullRoster.forEach(emp => {
                const shift = emp.days[date] || 'Off';
                const subKey = `${date}_${shift}_${st.station_id}`;
                const subRecord = cachedSubstitutions[subKey];
                
                // If this employee is the one manually assigned as a substitute, OR they are the original assignment and no sub exists
                const isManualSub = subRecord && subRecord.emp_id === emp.emp_id;
                const isOriginal = !subRecord && emp.hierarchy_id === st.station_id;

                if (isManualSub || isOriginal) {
                    if (shift !== 'WO' && shift !== 'Off') {
                        const skillRecord = (DUMMY_SKILL_MATRIX_API_DATA as any[]).find(sm => 
                            sm.emp_id === emp.emp_id && 
                            sm.station_id === st.station_id
                        );
                        const actualLevelNum = skillRecord?.level || 1;
                        
                        // Mock Presence
                        const empSuffix = parseInt(emp.emp_id.replace(/\D/g, '')) || 0;
                        const isPresent = (empSuffix + day) % 10 !== 0; 
                        
                        const reqLevel = parseInt(station.min_skill.replace('L', '')) || 0;
                        const hasSkillGap = actualLevelNum < reqLevel;

                        station.employees.push({
                            emp_id: emp.emp_id,
                            name: emp.name,
                            shift: shift,
                            skill_level: `L${actualLevelNum}`,
                            presence: isPresent ? 'Present' : 'Absent',
                            is_substitute: isManualSub,
                            requires_approval: hasSkillGap,
                            is_approved: subRecord?.is_approved ?? false
                        });
                        station.available += 1;
                    }
                }
            });

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
    return { success: true };
};

export const approveSubstitute = async (payload: { date: string; shift: string; station_id: number }) => {
    const { date, shift, station_id } = payload;
    const subKey = `${date}_${shift}_${station_id}`;
    if (cachedSubstitutions[subKey]) {
        cachedSubstitutions[subKey].is_approved = true;
    }
    return { success: true };
};

export const getAvailableSubstitutes = async (date: string, shift: string) => {
    // Return all employees WHO ARE PRESENT but NOT ASSIGNED to anything else on this shift/date
    // For the demo, we'll just return all employees with their presence status and current assignment
    const allEmps = (DUMMY_EMPLOYEES as any[]).map(emp => {
        const sm = (DUMMY_SKILL_MATRIX_API_DATA as any[]).find(s => s.emp_id === emp.emp_id);
        const empSuffix = parseInt(emp.emp_id.replace(/\D/g, '')) || 0;
        const day = parseInt(date.split('-')[2]) || 1;
        const isPresent = (empSuffix + day) % 10 !== 0; 
        
        return {
            emp_id: emp.emp_id,
            name: `${emp.first_name} ${emp.last_name}`,
            isPresent,
            level: sm?.level || 1,
            department: emp.department?.department_name
        };
    });
    return { data: allEmps };
};
