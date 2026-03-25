import { DUMMY_EMPLOYEES } from "../../MasterTable/dummyData";
import {
    type SkillMatrix, type Operation, type Section,
    type MonthlySkill, type OperatorLevel, type StationRequirement
} from "../api/types";

// ─── Skill Matrices (one per dept) ───────────────────────────────────────────
export const DUMMY_SKILL_MATRICES: SkillMatrix[] = [
    { id: 1, department: "Production",   updated_on: "2025-12-01", next_review: "2026-06-01", doc_no: "SM-PROD-001", prepared_by: "Manager", uploaded_by: "Admin" },
    { id: 2, department: "Quality",      updated_on: "2025-12-05", next_review: "2026-06-05", doc_no: "SM-QUAL-001", prepared_by: "Manager", uploaded_by: "Admin" },
    { id: 3, department: "Maintenance",  updated_on: "2025-12-10", next_review: "2026-06-10", doc_no: "SM-MAINT-001",prepared_by: "Manager", uploaded_by: "Admin" },
];

export const DUMMY_SECTIONS: Section[] = [
    { id: 1, name: "Body Assembly",     department: 1 },
    { id: 2, name: "Wiring & Sealing",  department: 1 },
    { id: 3, name: "Sub-Assembly",      department: 1 },
    { id: 4, name: "QC Incoming",       department: 2 },
    { id: 5, name: "QC In-Process",     department: 2 },
    { id: 6, name: "Preventive Maint.", department: 3 },
];

// ─── Stations (matches hierarchy) ─────────────────────────────────────────────
// Line 1 & 2: Stations 101–105 | Line 3: 106–110 | Line 4: 201–204 | Line 5: 205–208 | Line 6: 301–304
export const DUMMY_OPERATIONS: Operation[] = [
    // Production - Body Assembly stations (Lines 1 & 2)
    { id: 101, name: "Frame Welding",   minimum_skill_required: 3, section: 1, section_name: "Body Assembly",    number: 1,  matrix: 1, department: 1 },
    { id: 102, name: "Panel Fitting",   minimum_skill_required: 2, section: 1, section_name: "Body Assembly",    number: 2,  matrix: 1, department: 1 },
    { id: 103, name: "Wire Harness",    minimum_skill_required: 3, section: 2, section_name: "Wiring & Sealing", number: 3,  matrix: 1, department: 1 },
    { id: 104, name: "Torque Check",    minimum_skill_required: 2, section: 2, section_name: "Wiring & Sealing", number: 4,  matrix: 1, department: 1 },
    { id: 105, name: "Sealing",         minimum_skill_required: 2, section: 2, section_name: "Wiring & Sealing", number: 5,  matrix: 1, department: 1 },
    // Production - Sub-Assembly stations (Line 3 only)
    { id: 106, name: "Gasket Install",  minimum_skill_required: 2, section: 3, section_name: "Sub-Assembly",     number: 6,  matrix: 1, department: 1 },
    { id: 107, name: "Bearing Press",   minimum_skill_required: 4, section: 3, section_name: "Sub-Assembly",     number: 7,  matrix: 1, department: 1 },
    { id: 108, name: "Leak Test",       minimum_skill_required: 3, section: 3, section_name: "Sub-Assembly",     number: 8,  matrix: 1, department: 1 },
    { id: 109, name: "Final Torque",    minimum_skill_required: 3, section: 3, section_name: "Sub-Assembly",     number: 9,  matrix: 1, department: 1 },
    { id: 110, name: "Cosmetic Check",  minimum_skill_required: 2, section: 3, section_name: "Sub-Assembly",     number: 10, matrix: 1, department: 1 },
    // Quality - QC Line 1
    { id: 201, name: "Incoming QC",     minimum_skill_required: 3, section: 4, section_name: "QC Incoming",      number: 1,  matrix: 2, department: 2 },
    { id: 202, name: "In-Process QC",   minimum_skill_required: 3, section: 5, section_name: "QC In-Process",    number: 2,  matrix: 2, department: 2 },
    { id: 203, name: "Final Audit",     minimum_skill_required: 4, section: 5, section_name: "QC In-Process",    number: 3,  matrix: 2, department: 2 },
    { id: 204, name: "CMM Inspection",  minimum_skill_required: 4, section: 5, section_name: "QC In-Process",    number: 4,  matrix: 2, department: 2 },
    // Quality - QC Line 2
    { id: 205, name: "Dimensional Chk", minimum_skill_required: 3, section: 5, section_name: "QC In-Process",   number: 5,  matrix: 2, department: 2 },
    { id: 206, name: "Surface Insp.",   minimum_skill_required: 2, section: 5, section_name: "QC In-Process",    number: 6,  matrix: 2, department: 2 },
    { id: 207, name: "Leak Detection",  minimum_skill_required: 3, section: 5, section_name: "QC In-Process",    number: 7,  matrix: 2, department: 2 },
    { id: 208, name: "Report Filing",   minimum_skill_required: 1, section: 5, section_name: "QC In-Process",    number: 8,  matrix: 2, department: 2 },
    // Maintenance
    { id: 301, name: "Pneumatics",      minimum_skill_required: 3, section: 6, section_name: "Preventive Maint.",number: 1,  matrix: 3, department: 3 },
    { id: 302, name: "Hydraulics",      minimum_skill_required: 4, section: 6, section_name: "Preventive Maint.",number: 2,  matrix: 3, department: 3 },
    { id: 303, name: "Electrical Panel",minimum_skill_required: 4, section: 6, section_name: "Preventive Maint.",number: 3,  matrix: 3, department: 3 },
    { id: 304, name: "Conveyor Belt",   minimum_skill_required: 2, section: 6, section_name: "Preventive Maint.",number: 4,  matrix: 3, department: 3 },
];

// ─── Station Requirements ─────────────────────────────────────────────────────
export const DUMMY_STATION_REQUIREMENTS: StationRequirement[] = [
    { id:  1, station_id: 101, station_name: "Frame Welding",   department_id: 1, department_name: "Production",  minimum_operators: 2, minimum_level_required: "Advanced",   minimum_level_number: 3 },
    { id:  2, station_id: 102, station_name: "Panel Fitting",   department_id: 1, department_name: "Production",  minimum_operators: 2, minimum_level_required: "Intermediate", minimum_level_number: 2 },
    { id:  3, station_id: 103, station_name: "Wire Harness",    department_id: 1, department_name: "Production",  minimum_operators: 1, minimum_level_required: "Advanced",   minimum_level_number: 3 },
    { id:  4, station_id: 104, station_name: "Torque Check",    department_id: 1, department_name: "Production",  minimum_operators: 1, minimum_level_required: "Intermediate", minimum_level_number: 2 },
    { id:  5, station_id: 105, station_name: "Sealing",         department_id: 1, department_name: "Production",  minimum_operators: 1, minimum_level_required: "Intermediate", minimum_level_number: 2 },
    { id:  6, station_id: 106, station_name: "Gasket Install",  department_id: 1, department_name: "Production",  minimum_operators: 1, minimum_level_required: "Intermediate", minimum_level_number: 2 },
    { id:  7, station_id: 107, station_name: "Bearing Press",   department_id: 1, department_name: "Production",  minimum_operators: 1, minimum_level_required: "Expert",     minimum_level_number: 4 },
    { id:  8, station_id: 108, station_name: "Leak Test",       department_id: 1, department_name: "Production",  minimum_operators: 1, minimum_level_required: "Advanced",   minimum_level_number: 3 },
    { id:  9, station_id: 109, station_name: "Final Torque",    department_id: 1, department_name: "Production",  minimum_operators: 1, minimum_level_required: "Advanced",   minimum_level_number: 3 },
    { id: 10, station_id: 110, station_name: "Cosmetic Check",  department_id: 1, department_name: "Production",  minimum_operators: 1, minimum_level_required: "Intermediate", minimum_level_number: 2 },
    { id: 11, station_id: 201, station_name: "Incoming QC",     department_id: 2, department_name: "Quality",     minimum_operators: 2, minimum_level_required: "Advanced",   minimum_level_number: 3 },
    { id: 12, station_id: 202, station_name: "In-Process QC",   department_id: 2, department_name: "Quality",     minimum_operators: 2, minimum_level_required: "Advanced",   minimum_level_number: 3 },
    { id: 13, station_id: 203, station_name: "Final Audit",     department_id: 2, department_name: "Quality",     minimum_operators: 1, minimum_level_required: "Expert",     minimum_level_number: 4 },
    { id: 14, station_id: 204, station_name: "CMM Inspection",  department_id: 2, department_name: "Quality",     minimum_operators: 1, minimum_level_required: "Expert",     minimum_level_number: 4 },
    { id: 15, station_id: 205, station_name: "Dimensional Chk", department_id: 2, department_name: "Quality",     minimum_operators: 1, minimum_level_required: "Advanced",   minimum_level_number: 3 },
    { id: 16, station_id: 206, station_name: "Surface Insp.",   department_id: 2, department_name: "Quality",     minimum_operators: 1, minimum_level_required: "Intermediate", minimum_level_number: 2 },
    { id: 17, station_id: 207, station_name: "Leak Detection",  department_id: 2, department_name: "Quality",     minimum_operators: 1, minimum_level_required: "Advanced",   minimum_level_number: 3 },
    { id: 18, station_id: 208, station_name: "Report Filing",   department_id: 2, department_name: "Quality",     minimum_operators: 1, minimum_level_required: "Beginner",   minimum_level_number: 1 },
    { id: 19, station_id: 301, station_name: "Pneumatics",      department_id: 3, department_name: "Maintenance", minimum_operators: 2, minimum_level_required: "Advanced",   minimum_level_number: 3 },
    { id: 20, station_id: 302, station_name: "Hydraulics",      department_id: 3, department_name: "Maintenance", minimum_operators: 1, minimum_level_required: "Expert",     minimum_level_number: 4 },
    { id: 21, station_id: 303, station_name: "Electrical Panel",department_id: 3, department_name: "Maintenance", minimum_operators: 1, minimum_level_required: "Expert",     minimum_level_number: 4 },
    { id: 22, station_id: 304, station_name: "Conveyor Belt",   department_id: 3, department_name: "Maintenance", minimum_operators: 1, minimum_level_required: "Intermediate", minimum_level_number: 2 },
];

// ─── Full hierarchy ───────────────────────────────────────────────────────────
export const DUMMY_HIERARCHY = [
    {
        department_id: 1, department_name: "Production",
        stations: [],
        sublines: [],
        lines: [
            {
                line_id: 1, line_name: "Assembly Line A", sublines: [],
                stations: [
                    { station_id: 101, station_name: "Frame Welding",  station_type: "STD" },
                    { station_id: 102, station_name: "Panel Fitting",  station_type: "STD" },
                    { station_id: 103, station_name: "Wire Harness",   station_type: "STD" },
                    { station_id: 104, station_name: "Torque Check",   station_type: "STD" },
                    { station_id: 105, station_name: "Sealing",        station_type: "STD" },
                ]
            },
            {
                line_id: 2, line_name: "Assembly Line B", sublines: [],
                stations: [
                    { station_id: 101, station_name: "Frame Welding",  station_type: "STD" },
                    { station_id: 102, station_name: "Panel Fitting",  station_type: "STD" },
                    { station_id: 103, station_name: "Wire Harness",   station_type: "STD" },
                    { station_id: 104, station_name: "Torque Check",   station_type: "STD" },
                    { station_id: 105, station_name: "Sealing",        station_type: "STD" },
                ]
            },
            {
                line_id: 3, line_name: "Assembly Line C", sublines: [],
                stations: [
                    { station_id: 106, station_name: "Gasket Install", station_type: "STD" },
                    { station_id: 107, station_name: "Bearing Press",  station_type: "STD" },
                    { station_id: 108, station_name: "Leak Test",      station_type: "STD" },
                    { station_id: 109, station_name: "Final Torque",   station_type: "STD" },
                    { station_id: 110, station_name: "Cosmetic Check", station_type: "STD" },
                ]
            }
        ]
    },
    {
        department_id: 2, department_name: "Quality",
        stations: [],
        sublines: [],
        lines: [
            {
                line_id: 4, line_name: "QC Line 1", sublines: [],
                stations: [
                    { station_id: 201, station_name: "Incoming QC",    station_type: "QC" },
                    { station_id: 202, station_name: "In-Process QC",  station_type: "QC" },
                    { station_id: 203, station_name: "Final Audit",    station_type: "QC" },
                    { station_id: 204, station_name: "CMM Inspection", station_type: "QC" },
                ]
            },
            {
                line_id: 5, line_name: "QC Line 2", sublines: [],
                stations: [
                    { station_id: 205, station_name: "Dimensional Chk",station_type: "QC" },
                    { station_id: 206, station_name: "Surface Insp.",  station_type: "QC" },
                    { station_id: 207, station_name: "Leak Detection", station_type: "QC" },
                    { station_id: 208, station_name: "Report Filing",  station_type: "QC" },
                ]
            }
        ]
    },
    {
        department_id: 3, department_name: "Maintenance",
        stations: [],
        sublines: [],
        lines: [
            {
                line_id: 6, line_name: "Maint. Line 1", sublines: [],
                stations: [
                    { station_id: 301, station_name: "Pneumatics",      station_type: "MAINT" },
                    { station_id: 302, station_name: "Hydraulics",      station_type: "MAINT" },
                    { station_id: 303, station_name: "Electrical Panel",station_type: "MAINT" },
                    { station_id: 304, station_name: "Conveyor Belt",   station_type: "MAINT" },
                ]
            }
        ]
    }
];

export const DUMMY_DEPARTMENTS = [
    { department_id: 1, department_name: "Production" },
    { department_id: 2, department_name: "Quality" },
    { department_id: 3, department_name: "Maintenance" },
];

// ─── Skill matrix data (emp → station → level) ───────────────────────────────
// Realistic: each emp is skilled at their home station, some multi-skilled
const rawSkillMap: [string, number, number][] = [
    // EMP, stationId, level
    ["EMP001",101,4],["EMP001",102,3],["EMP001",104,2],
    ["EMP002",102,3],["EMP002",101,2],["EMP002",105,2],
    ["EMP003",103,4],["EMP003",102,3],["EMP003",104,2],
    ["EMP004",104,3],["EMP004",103,2],["EMP004",105,2],
    ["EMP005",105,3],["EMP005",101,2],["EMP005",102,2],
    ["EMP006",101,2],["EMP006",105,2],
    ["EMP007",101,4],["EMP007",102,2],
    ["EMP008",102,3],["EMP008",101,2],["EMP008",105,2],
    ["EMP009",103,4],["EMP009",104,3],
    ["EMP010",104,3],["EMP010",103,2],["EMP010",105,2],
    ["EMP011",105,3],["EMP011",102,2],
    ["EMP012",101,2],["EMP012",102,2],
    ["EMP013",106,3],["EMP013",108,2],
    ["EMP014",107,4],["EMP014",108,3],
    ["EMP015",108,4],["EMP015",109,3],
    ["EMP016",109,4],["EMP016",110,3],["EMP016",108,2],
    ["EMP017",110,3],["EMP017",106,2],
    ["EMP018",106,2],["EMP018",110,2],
    ["EMP019",201,4],["EMP019",202,3],
    ["EMP020",202,4],["EMP020",201,2],
    ["EMP021",203,4],["EMP021",202,3],["EMP021",201,2],
    ["EMP022",204,4],["EMP022",203,3],
    ["EMP023",201,3],["EMP023",202,2],
    ["EMP024",202,3],["EMP024",201,2],
    ["EMP025",205,4],["EMP025",206,3],
    ["EMP026",206,3],["EMP026",205,2],
    ["EMP027",207,4],["EMP027",205,3],
    ["EMP028",208,3],["EMP028",206,2],
    ["EMP029",205,3],["EMP029",207,2],
    ["EMP030",206,3],["EMP030",208,2],
    ["EMP031",301,4],["EMP031",304,3],
    ["EMP032",302,4],["EMP032",301,3],
    ["EMP033",303,4],["EMP033",302,3],
    ["EMP034",304,3],["EMP034",301,2],
    ["EMP035",301,3],["EMP035",304,2],
    ["EMP036",302,3],["EMP036",303,2],
    // Flex pool — multi-skilled across lines
    ["EMP037",101,3],["EMP037",102,3],["EMP037",103,2],
    ["EMP038",102,3],["EMP038",105,3],["EMP038",104,2],
    ["EMP039",103,4],["EMP039",101,2],["EMP039",104,3],
    ["EMP040",104,4],["EMP040",103,3],["EMP040",105,2],
    ["EMP041",107,3],["EMP041",106,3],["EMP041",108,2],
    ["EMP042",202,4],["EMP042",201,3],["EMP042",203,2],
    ["EMP043",206,3],["EMP043",205,3],["EMP043",207,2],
    ["EMP044",303,3],["EMP044",302,2],["EMP044",304,3],
    ["EMP045",105,4],["EMP045",101,2],["EMP045",104,2],
    ["EMP046",108,3],["EMP046",109,3],["EMP046",107,2],
    ["EMP047",102,4],["EMP047",101,2],["EMP047",103,3],
    ["EMP048",203,3],["EMP048",201,3],["EMP048",202,2],
    ["EMP049",103,3],["EMP049",104,3],["EMP049",102,2],
    ["EMP050",304,3],["EMP050",301,2],["EMP050",302,2],
    ["EMP051",109,4],["EMP051",108,3],["EMP051",110,2],
    ["EMP052",207,4],["EMP052",205,3],["EMP052",206,2],
    ["EMP053",105,3],["EMP053",102,2],["EMP053",104,2],
    ["EMP054",104,4],["EMP054",101,2],["EMP054",103,2],
    ["EMP055",110,3],["EMP055",109,2],["EMP055",106,2],
    ["EMP056",204,4],["EMP056",203,3],["EMP056",202,2],
    ["EMP057",301,3],["EMP057",304,3],["EMP057",302,2],
    ["EMP058",101,3],["EMP058",102,2],["EMP058",105,2],
    ["EMP059",208,3],["EMP059",206,2],["EMP059",207,2],
    ["EMP060",302,4],["EMP060",301,3],["EMP060",303,2],
];

let skillId = 1;
export const DUMMY_SKILL_MATRIX_API_DATA = rawSkillMap.map(([empId, stationId, level]) => {
    const emp = DUMMY_EMPLOYEES.find(e => e.emp_id === empId);
    return {
        id: skillId++,
        station_id: stationId,
        emp_id: empId,
        employee_name: emp ? `${emp.first_name} ${emp.last_name}` : empId,
        level,
        skill: level,
        doj: emp?.date_of_joining || "2020-01-01",
        updated_at: "2025-12-01",
        employee: empId,
        photo: null
    };
});

// ─── Monthly Skills (for Skill Matrix page) ───────────────────────────────────
const generateMonthlySkills = (): MonthlySkill[] => {
    const result: MonthlySkill[] = [];
    rawSkillMap.forEach(([empId, stationId, level], i) => {
        const emp = DUMMY_EMPLOYEES.find(e => e.emp_id === empId)!;
        const op = DUMMY_OPERATIONS.find(o => o.id === stationId)!;
        if (!emp || !op) return;
        result.push({
            id: i + 1,
            employee_code: empId,
            full_name: `${emp.first_name} ${emp.last_name}`,
            date_of_join: emp.date_of_joining,
            designation: "Operator",
            department: emp.department?.department_name || "Production",
            section: op.section_name,
            operation: op.name,
            operation_number: op.number,
            skill_level: String(level),
            date: "2025-12-01",
            remarks: "Certified",
            status: "Completed",
            level: String(level)
        });
    });
    return result;
};
export const DUMMY_MONTHLY_SKILLS = generateMonthlySkills();

// ─── Operator Levels ──────────────────────────────────────────────────────────
const generateOperatorLevels = (): OperatorLevel[] => {
    return rawSkillMap.map(([empId, stationId, level], i) => {
        const emp = DUMMY_EMPLOYEES.find(e => e.emp_id === empId)!;
        const matrix = DUMMY_SKILL_MATRICES.find(m => m.department === emp.department?.department_name) || DUMMY_SKILL_MATRICES[0];
        const op = DUMMY_OPERATIONS.find(o => o.id === stationId) || DUMMY_OPERATIONS[0];
        return {
            employee: {
                id: i + 1,
                employee_code: empId,
                full_name: `${emp.first_name} ${emp.last_name}`,
                date_of_join: emp.date_of_joining,
                designation: "Operator",
                department: emp.department?.department_name || "Production"
            },
            skill_matrix: { ...matrix },
            operation: { ...op, department: String(op.department) } as any,
            level
        };
    });
};
export const DUMMY_OPERATOR_LEVELS = generateOperatorLevels();

export const DUMMY_MULTI_SKILLINGS = DUMMY_EMPLOYEES.slice(0, 5).map((emp, i) => ({
    id: i + 1,
    emp_id: emp.emp_id,
    station: { station_id: 101 + i, station_name: DUMMY_OPERATIONS[i]?.name || `Station ${i+1}` },
    skill_level: { level_number: (i % 4) + 1 },
    start_date: "2025-10-01",
    status: "in-progress",
    current_status: "in-progress"
}));
