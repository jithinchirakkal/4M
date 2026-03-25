import { Employee } from "./MasterTable";

// ─── 3 Departments, 6 Lines, 20 Stations, 60+ Employees ─────────────────────

const mkEmp = (
    id: string, fn: string, ln: string, doj: string, sex: "M"|"F",
    deptId: number, deptName: string,
    lineId: number, lineName: string,
    stationId: number, stationName: string
): Employee => ({
    emp_id: id, first_name: fn, last_name: ln,
    date_of_joining: doj, birth_date: "1990-01-01", sex,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@factory.com`,
    phone: "9876500000",
    department: { department_id: deptId, department_name: deptName },
    current_line: { line_id: lineId, line_name: lineName },
    current_station: { station_id: stationId, station_name: stationName },
    photo: null
});

export const DUMMY_EMPLOYEES: Employee[] = [
    // ── DEPT 1: Production — Assembly Line A (Line 1) — Stations 101–105 ──
    mkEmp("EMP001","Arjun",   "Menon",   "2021-01-10","M", 1,"Production", 1,"Assembly Line A", 101,"Frame Welding"),
    mkEmp("EMP002","Priya",   "Nair",    "2021-03-15","F", 1,"Production", 1,"Assembly Line A", 102,"Panel Fitting"),
    mkEmp("EMP003","Rahul",   "Sharma",  "2020-06-01","M", 1,"Production", 1,"Assembly Line A", 103,"Wire Harness"),
    mkEmp("EMP004","Sneha",   "Pillai",  "2022-02-20","F", 1,"Production", 1,"Assembly Line A", 104,"Torque Check"),
    mkEmp("EMP005","Vijay",   "Krishnan","2019-11-05","M", 1,"Production", 1,"Assembly Line A", 105,"Sealing"),
    mkEmp("EMP006","Deepa",   "Varma",   "2023-01-12","F", 1,"Production", 1,"Assembly Line A", 101,"Frame Welding"),

    // ── DEPT 1: Production — Assembly Line B (Line 2) — Stations 101–105 ──
    mkEmp("EMP007","Suresh",  "Babu",    "2020-03-10","M", 1,"Production", 2,"Assembly Line B", 101,"Frame Welding"),
    mkEmp("EMP008","Kavitha", "Raj",     "2021-07-22","F", 1,"Production", 2,"Assembly Line B", 102,"Panel Fitting"),
    mkEmp("EMP009","Mohan",   "Das",     "2022-09-05","M", 1,"Production", 2,"Assembly Line B", 103,"Wire Harness"),
    mkEmp("EMP010","Lakshmi", "Rao",     "2020-12-01","F", 1,"Production", 2,"Assembly Line B", 104,"Torque Check"),
    mkEmp("EMP011","Kiran",   "Kumar",   "2023-03-18","M", 1,"Production", 2,"Assembly Line B", 105,"Sealing"),
    mkEmp("EMP012","Divya",   "Menon",   "2021-05-25","F", 1,"Production", 2,"Assembly Line B", 101,"Frame Welding"),

    // ── DEPT 1: Production — Assembly Line C (Line 3) — Stations 101–105 ──
    mkEmp("EMP013","Arun",    "Nambiar", "2019-08-20","M", 1,"Production", 3,"Assembly Line C", 106,"Gasket Install"),
    mkEmp("EMP014","Meera",   "Thomas",  "2022-11-11","F", 1,"Production", 3,"Assembly Line C", 107,"Bearing Press"),
    mkEmp("EMP015","Sanjay",  "Pillai",  "2020-04-14","M", 1,"Production", 3,"Assembly Line C", 108,"Leak Test"),
    mkEmp("EMP016","Anita",   "Iyer",    "2023-06-01","F", 1,"Production", 3,"Assembly Line C", 109,"Final Torque"),
    mkEmp("EMP017","Rajesh",  "Nair",    "2021-02-28","M", 1,"Production", 3,"Assembly Line C", 110,"Cosmetic Check"),
    mkEmp("EMP018","Suma",    "Krishnan","2022-08-15","F", 1,"Production", 3,"Assembly Line C", 106,"Gasket Install"),

    // ── DEPT 2: Quality — QC Line 1 (Line 4) — Stations 201–204 ──
    mkEmp("EMP019","Ramesh",  "Babu",    "2020-01-20","M", 2,"Quality",    4,"QC Line 1", 201,"Incoming QC"),
    mkEmp("EMP020","Padma",   "Devi",    "2021-09-10","F", 2,"Quality",    4,"QC Line 1", 202,"In-Process QC"),
    mkEmp("EMP021","Anand",   "Verma",   "2019-05-15","M", 2,"Quality",    4,"QC Line 1", 203,"Final Audit"),
    mkEmp("EMP022","Rekha",   "Sharma",  "2022-03-25","F", 2,"Quality",    4,"QC Line 1", 204,"CMM Inspection"),
    mkEmp("EMP023","Prakash", "Raj",     "2020-10-08","M", 2,"Quality",    4,"QC Line 1", 201,"Incoming QC"),
    mkEmp("EMP024","Leela",   "Nair",    "2023-02-14","F", 2,"Quality",    4,"QC Line 1", 202,"In-Process QC"),

    // ── DEPT 2: Quality — QC Line 2 (Line 5) — Stations 201–204 ──
    mkEmp("EMP025","Sunil",   "Menon",   "2021-04-22","M", 2,"Quality",    5,"QC Line 2", 205,"Dimensional Check"),
    mkEmp("EMP026","Nisha",   "Das",     "2022-07-30","F", 2,"Quality",    5,"QC Line 2", 206,"Surface Inspection"),
    mkEmp("EMP027","Govind",  "Kumar",   "2020-11-18","M", 2,"Quality",    5,"QC Line 2", 207,"Leak Detection"),
    mkEmp("EMP028","Geetha",  "Pillai",  "2019-12-03","F", 2,"Quality",    5,"QC Line 2", 208,"Report Filing"),
    mkEmp("EMP029","Nandhu",  "Rao",     "2023-05-27","M", 2,"Quality",    5,"QC Line 2", 205,"Dimensional Check"),
    mkEmp("EMP030","Sindhu",  "Iyer",    "2021-08-09","F", 2,"Quality",    5,"QC Line 2", 206,"Surface Inspection"),

    // ── DEPT 3: Maintenance — Maint. Line 1 (Line 6) — Stations 301–304 ──
    mkEmp("EMP031","Shankar", "Nambiar", "2018-03-15","M", 3,"Maintenance",6,"Maint. Line 1", 301,"Pneumatics"),
    mkEmp("EMP032","Parvati", "Thomas",  "2020-06-22","F", 3,"Maintenance",6,"Maint. Line 1", 302,"Hydraulics"),
    mkEmp("EMP033","Vinod",   "Pillai",  "2019-01-10","M", 3,"Maintenance",6,"Maint. Line 1", 303,"Electrical Panel"),
    mkEmp("EMP034","Jaya",    "Raj",     "2022-04-18","F", 3,"Maintenance",6,"Maint. Line 1", 304,"Conveyor Belt"),
    mkEmp("EMP035","Sathish", "Nair",    "2021-09-30","M", 3,"Maintenance",6,"Maint. Line 1", 301,"Pneumatics"),
    mkEmp("EMP036","Ambika",  "Kumar",   "2023-01-25","F", 3,"Maintenance",6,"Maint. Line 1", 302,"Hydraulics"),

    // ── Flex / Multi-skilled Pool — can be used as substitutes ──
    mkEmp("EMP037","Ajith",   "Menon",   "2020-07-12","M", 1,"Production", 1,"Assembly Line A", 101,"Frame Welding"),
    mkEmp("EMP038","Bindu",   "Sharma",  "2021-11-05","F", 1,"Production", 1,"Assembly Line A", 102,"Panel Fitting"),
    mkEmp("EMP039","Chandran","Nair",    "2019-04-19","M", 1,"Production", 2,"Assembly Line B", 103,"Wire Harness"),
    mkEmp("EMP040","Divya",   "Pillai",  "2022-01-30","F", 1,"Production", 2,"Assembly Line B", 104,"Torque Check"),
    mkEmp("EMP041","Edwin",   "Raj",     "2020-09-08","M", 1,"Production", 3,"Assembly Line C", 107,"Bearing Press"),
    mkEmp("EMP042","Fathima", "Das",     "2023-04-15","F", 2,"Quality",    4,"QC Line 1",       202,"In-Process QC"),
    mkEmp("EMP043","George",  "Kumar",   "2021-06-01","M", 2,"Quality",    5,"QC Line 2",       206,"Surface Inspection"),
    mkEmp("EMP044","Hema",    "Rao",     "2022-10-20","F", 3,"Maintenance",6,"Maint. Line 1",   303,"Electrical Panel"),
    mkEmp("EMP045","Irfan",   "Iyer",    "2020-02-28","M", 1,"Production", 1,"Assembly Line A", 105,"Sealing"),
    mkEmp("EMP046","Jini",    "Verma",   "2021-12-18","F", 1,"Production", 3,"Assembly Line C", 108,"Leak Test"),
    mkEmp("EMP047","Kishore", "Nambiar", "2019-07-22","M", 1,"Production", 2,"Assembly Line B", 102,"Panel Fitting"),
    mkEmp("EMP048","Laila",   "Thomas",  "2022-05-06","F", 2,"Quality",    4,"QC Line 1",       203,"Final Audit"),
    mkEmp("EMP049","Manoj",   "Babu",    "2020-08-14","M", 1,"Production", 1,"Assembly Line A", 103,"Wire Harness"),
    mkEmp("EMP050","Neethu",  "Devi",    "2021-10-25","F", 3,"Maintenance",6,"Maint. Line 1",   304,"Conveyor Belt"),
    mkEmp("EMP051","Omprakash","Raj",    "2023-02-01","M", 1,"Production", 3,"Assembly Line C", 109,"Final Torque"),
    mkEmp("EMP052","Preetha", "Sharma",  "2020-04-30","F", 2,"Quality",    5,"QC Line 2",       207,"Leak Detection"),
    mkEmp("EMP053","Qasim",   "Nair",    "2022-06-15","M", 1,"Production", 2,"Assembly Line B", 105,"Sealing"),
    mkEmp("EMP054","Renuka",  "Kumar",   "2021-01-22","F", 1,"Production", 1,"Assembly Line A", 104,"Torque Check"),
    mkEmp("EMP055","Sreeraj", "Pillai",  "2019-10-10","M", 1,"Production", 3,"Assembly Line C", 110,"Cosmetic Check"),
    mkEmp("EMP056","Treesa",  "Rao",     "2022-09-12","F", 2,"Quality",    4,"QC Line 1",       204,"CMM Inspection"),
    mkEmp("EMP057","Uma",     "Iyer",    "2020-11-28","F", 3,"Maintenance",6,"Maint. Line 1",   301,"Pneumatics"),
    mkEmp("EMP058","Vivek",   "Menon",   "2021-07-04","M", 1,"Production", 2,"Assembly Line B", 101,"Frame Welding"),
    mkEmp("EMP059","Wafiya",  "Thomas",  "2023-03-11","F", 2,"Quality",    5,"QC Line 2",       208,"Report Filing"),
    mkEmp("EMP060","Xavier",  "Babu",    "2020-05-19","M", 3,"Maintenance",6,"Maint. Line 1",   302,"Hydraulics"),
];
