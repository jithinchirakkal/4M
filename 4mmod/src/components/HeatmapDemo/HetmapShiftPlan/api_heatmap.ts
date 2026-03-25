import { DUMMY_HIERARCHY } from '../Skillmatrix/pages/dummySkillData';
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

export const fetchHeatMapRoster = async (deptId: number, month: number, year: number, filter: HierarchyFilter) => {
    const roster: ShiftPlanData[] = [];
    
    // Filter employees by department first
    const deptEmployees = (DUMMY_EMPLOYEES as any[])
        .filter(emp => !deptId || emp.department?.department_id === deptId);

    deptEmployees.forEach(emp => {
        // Find qualified assignments (Level 1+) for this employee
        const allAssignments = DUMMY_SKILL_MATRIX_API_DATA.filter(sm => 
            sm.emp_id === emp.emp_id && 
            sm.level >= 1
        );

        // Deduplicate assignments by station_id
        const uniqueStationIds = new Set<number>();
        const uniqueAssignments: any[] = [];
        allAssignments.forEach(a => {
            if (!uniqueStationIds.has(a.station_id)) {
                uniqueStationIds.add(a.station_id);
                uniqueAssignments.push(a);
            }
        });

        uniqueAssignments.forEach(assign => {
            // Find station name from hierarchy if possible
            let stationName = `Station ${assign.station_id}`;
            // Search in DUMMY_HIERARCHY for better name
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

            // Generate some shifts for the month
            const days: Record<string, string> = {};
            const daysInMonth = new Date(year, month, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const dateObj = new Date(year, month - 1, d);
                if (dateObj.getDay() === 0) {
                    days[dateStr] = 'WO';
                } else {
                    days[dateStr] = ['A', 'B', 'G'][Math.floor(Math.random() * 3)];
                }
            }

            roster.push({
                emp_id: emp.emp_id,
                name: emp.full_name || `${emp.first_name} ${emp.last_name}`,
                deployment_plan: stationName,
                days: days,
                attendance_status: {},
                hierarchy_id: assign.station_id 
            });
        });
    });

    return { data: roster };
};

export const updateHeatMapShift = async (payload: any) => {
    console.log('Dummy Update Shift:', payload);
    return { success: true };
};
