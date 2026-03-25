import { DUMMY_EMPLOYEES } from "../../MasterTable/dummyData";
import { type SkillMatrix, type Operation, type Section, type MonthlySkill, type OperatorLevel, type StationRequirement } from "../api/types";

export const DUMMY_SKILL_MATRICES: SkillMatrix[] = [
    { id: 1, department: "Production", updated_on: "2024-03-25", next_review: "2024-09-25", doc_no: "SM-PROD-001", prepared_by: "Admin", uploaded_by: "Admin" },
    { id: 2, department: "Quality", updated_on: "2024-03-20", next_review: "2024-09-20", doc_no: "SM-QUAL-001", prepared_by: "Admin", uploaded_by: "Admin" },
    { id: 3, department: "Logistics", updated_on: "2024-03-15", next_review: "2024-09-15", doc_no: "SM-LOG-001", prepared_by: "Admin", uploaded_by: "Admin" },
];

export const DUMMY_SECTIONS: Section[] = [
    { id: 1, name: "Assembly", department: 1 },
    { id: 2, name: "Inspection", department: 2 },
    { id: 3, name: "Warehouse", department: 3 },
];

export const DUMMY_OPERATIONS: Operation[] = [
    { id: 1, name: "Station 1", minimum_skill_required: 2, section: 1, section_name: "Assembly", number: 1, matrix: 1, department: 1 },
    { id: 2, name: "Station 2", minimum_skill_required: 3, section: 1, section_name: "Assembly", number: 2, matrix: 1, department: 1 },
    { id: 3, name: "Station 3", minimum_skill_required: 2, section: 1, section_name: "Assembly", number: 3, matrix: 1, department: 1 },
    { id: 4, name: "Station 4", minimum_skill_required: 4, section: 1, section_name: "Assembly", number: 4, matrix: 1, department: 1 },
    { id: 5, name: "Final QC", minimum_skill_required: 4, section: 2, section_name: "Inspection", number: 5, matrix: 2, department: 2 },
    { id: 6, name: "Initial QC", minimum_skill_required: 3, section: 2, section_name: "Inspection", number: 6, matrix: 2, department: 2 },
    { id: 8, name: "Packing", minimum_skill_required: 1, section: 3, section_name: "Warehouse", number: 8, matrix: 3, department: 3 },
    { id: 9, name: "Sorting", minimum_skill_required: 2, section: 3, section_name: "Warehouse", number: 9, matrix: 3, department: 3 },
    { id: 10, name: "Station B1", minimum_skill_required: 2, section: 1, section_name: "Assembly", number: 10, matrix: 1, department: 1 },
    { id: 11, name: "Station B2", minimum_skill_required: 3, section: 1, section_name: "Assembly", number: 11, matrix: 1, department: 1 },
    { id: 12, name: "Station B3", minimum_skill_required: 2, section: 1, section_name: "Assembly", number: 12, matrix: 1, department: 1 },
];

export const DUMMY_STATION_REQUIREMENTS: StationRequirement[] = [
    { id: 1, station_id: 1, station_name: "Station 1", department_id: 1, department_name: "Production", minimum_operators: 2, minimum_level_required: 'Intermediate', minimum_level_number: 2 },
    { id: 2, station_id: 2, station_name: "Station 2", department_id: 1, department_name: "Production", minimum_operators: 1, minimum_level_required: 'Advanced', minimum_level_number: 3 },
    { id: 3, station_id: 3, station_name: "Station 3", department_id: 1, department_name: "Production", minimum_operators: 1, minimum_level_required: 'Intermediate', minimum_level_number: 2 },
    { id: 4, station_id: 4, station_name: "Station 4", department_id: 1, department_name: "Production", minimum_operators: 1, minimum_level_required: 'Expert', minimum_level_number: 4 },
    { id: 5, station_id: 10, station_name: "Station B1", department_id: 1, department_name: "Production", minimum_operators: 2, minimum_level_required: 'Intermediate', minimum_level_number: 2 },
    { id: 6, station_id: 11, station_name: "Station B2", department_id: 1, department_name: "Production", minimum_operators: 1, minimum_level_required: 'Advanced', minimum_level_number: 3 },
    { id: 7, station_id: 12, station_name: "Station B3", department_id: 1, department_name: "Production", minimum_operators: 1, minimum_level_required: 'Intermediate', minimum_level_number: 2 },
];

// Generate Monthly Skills for each employee
const generateMonthlySkills = (): MonthlySkill[] => {
    const monthlySkills: MonthlySkill[] = [];
    const months_list = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentYear = new Date().getFullYear();

    DUMMY_EMPLOYEES.forEach((emp, index) => {
        // Assign each employee some skills for a few months
        months_list.forEach((monthName, mIndex) => {
            // Only generate data for the last 3 months for variety
            if (mIndex < 3) return; 
            if (mIndex > 6) return;

            const op = DUMMY_OPERATIONS[index % DUMMY_OPERATIONS.length];
            
            monthlySkills.push({
                id: monthlySkills.length + 1,
                employee_code: emp.emp_id,
                full_name: `${emp.first_name} ${emp.last_name}`,
                date_of_join: emp.date_of_joining,
                designation: "Operator",
                department: emp.department?.department_name || "Production",
                section: op.section_name,
                operation: op.name,
                operation_number: op.number,
                skill_level: String((index + mIndex) % 4 + 1), // Level 1-4
                date: `${currentYear}-${String(mIndex + 1).padStart(2, '0')}-01`,
                remarks: "Dummy data",
                status: "Completed",
                level: String((index + mIndex) % 4 + 1)
            });
        });
    });

    return monthlySkills;
};

export const DUMMY_MONTHLY_SKILLS = generateMonthlySkills();

// Generate Operator Levels
const generateOperatorLevels = (): OperatorLevel[] => {
    return DUMMY_EMPLOYEES.map((emp, index) => {
        const matrix = DUMMY_SKILL_MATRICES.find(m => m.department === emp.department?.department_name) || DUMMY_SKILL_MATRICES[0];
        const op = DUMMY_OPERATIONS.find(o => o.matrix === matrix.id) || DUMMY_OPERATIONS[0];

        return {
            employee: {
                id: index + 1,
                employee_code: emp.emp_id,
                full_name: `${emp.first_name} ${emp.last_name}`,
                date_of_join: emp.date_of_joining,
                designation: "Operator",
                department: emp.department?.department_name || "Production",
            },
            skill_matrix: {
                ...matrix
            },
            operation: {
                ...op,
                department: String(op.department)
            } as any,
            level: (index % 4) + 1
        };
    });
};

export const DUMMY_OPERATOR_LEVELS = generateOperatorLevels();

export const DUMMY_DEPARTMENTS = [
    { department_id: 1, department_name: "Production" },
    { department_id: 2, department_name: "Quality" },
    { department_id: 3, department_name: "Logistics" },
    { department_id: 4, department_name: "Maintenance" },
];

export const DUMMY_HIERARCHY = [
    {
        department_id: 1,
        department_name: "Production",
        lines: [
            {
                line_id: 1,
                line_name: "Assembly Line A",
                sublines: [],
                stations: [
                    { station_id: 1, station_name: "Station 1", station_type: "STD" },
                    { station_id: 2, station_name: "Station 2", station_type: "STD" },
                    { station_id: 3, station_name: "Station 3", station_type: "STD" },
                    { station_id: 4, station_name: "Station 4", station_type: "STD" },
                ]
            },
            {
                line_id: 2,
                line_name: "Assembly Line B",
                sublines: [],
                stations: [
                    { station_id: 10, station_name: "Station B1", station_type: "STD" },
                    { station_id: 11, station_name: "Station B2", station_type: "STD" },
                    { station_id: 12, station_name: "Station B3", station_type: "STD" },
                ]
            }
        ],
        sublines: [],
        stations: []
    },
    {
        department_id: 2,
        department_name: "Quality",
        lines: [
            {
                line_id: 3,
                line_name: "Inspection Line 1",
                sublines: [],
                stations: [
                    { station_id: 5, station_name: "Final QC", station_type: "QC" },
                    { station_id: 6, station_name: "Initial QC", station_type: "QC" },
                ]
            }
        ],
        sublines: [],
        stations: []
    }
];

export const DUMMY_SKILL_MATRIX_API_DATA = DUMMY_MONTHLY_SKILLS.map((ms, idx) => {
    const op = DUMMY_OPERATIONS.find(o => o.name === ms.operation);
    return {
        station_id: op?.id || 1,
        id: idx + 1,
        employee_name: ms.full_name,
        emp_id: ms.employee_code,
        doj: ms.date_of_join,
        updated_at: ms.date,
        employee: ms.employee_code,
        level: parseInt(ms.level),
        skill: parseInt(ms.level),
        photo: null
    };
});

export const DUMMY_MULTI_SKILLINGS = DUMMY_EMPLOYEES.slice(0, 3).map((emp, idx) => ({
    id: idx + 1,
    emp_id: emp.emp_id,
    station: { station_id: idx + 1, station_name: `Station ${idx + 1}` },
    skill_level: { level_number: (idx % 3) + 1 },
    start_date: "2024-04-01",
    status: "in-progress",
    current_status: "in-progress"
}));
