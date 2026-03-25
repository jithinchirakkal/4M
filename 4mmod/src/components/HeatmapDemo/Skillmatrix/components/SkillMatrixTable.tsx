import React, { useEffect, useState } from 'react';
import {
  Users, Calendar, FileText, RefreshCw, ChevronDown, Building,
  GitBranch, Layers, Cpu, Download, Hexagon, User
} from 'lucide-react';
import type { SkillMatrix, Operation, Section, MonthlySkill, OperatorLevel, Month } from '../api/types';
import LevelBlock from './shapes/Levelblocks';
import PieChart from './shapes/piechart';
import axios from 'axios';
import MonthlySkillDisplay from './MonthlySkillDisplay';
import { 
  DUMMY_HIERARCHY, 
  DUMMY_SKILL_MATRIX_API_DATA, 
  DUMMY_MULTI_SKILLINGS 
} from '../pages/dummySkillData';
import { DUMMY_EMPLOYEES } from '../../MasterTable/dummyData';

const API_BASE_URL = ''; // Mocked for dummy data mode

// --- Interfaces ---

interface SkillMatrixApiData {
  station_id: number;
  id: number;
  employee_name: string;
  emp_id: string;
  doj: string;
  updated_at: string;
  employee: string;
  level: number;
  skill: number;
  // Optional: In case backend sends it directly
  photo?: string | null;
}

interface MultiSkillingData {
  id?: number;
  emp_id: string;
  station: { station_id: number; station_name?: string } | number;
  skill_level: { level_number: number } | number;
  start_date: string;
  status: string;
  current_status: string;
  department?: number;
  department_name?: string;
}

interface StationTypeConfig {
  type_id: number;
  code: string;
  name: string;
  icon: string | null;
  icon_url: string | null;
  color: string;
}

// Internal Interface used by the Component State
interface HierarchyStation {
  station_id: number;
  station_name: string;
  station_type?: string;
  station_type_name?: string;
}
interface HierarchySubline {
  subline_id: number;
  subline_name: string;
  stations: HierarchyStation[];
}
interface HierarchyLine {
  line_id: number;
  line_name: string;
  sublines: HierarchySubline[];
  stations: HierarchyStation[];
}
interface HierarchyDepartment {
  department_id: number;
  department_name: string;
  lines: HierarchyLine[];
  sublines: HierarchySubline[];
  stations: HierarchyStation[];
}

// Interface for the incoming specific JSON Structure
interface JsonStation {
  id: number;
  station_name: string;
  station_type?: string;
  station_type_name?: string;
}
interface JsonSubline {
  id: number;
  subline_name: string;
  stations: JsonStation[];
}
interface JsonLine {
  id: number;
  line_name: string;
  sublines: JsonSubline[];
  stations: JsonStation[];
}
interface JsonDepartment {
  id: number;
  department_name: string;
  lines: JsonLine[];
  stations: JsonStation[];
}
interface JsonStructureData {
  hq_name: string;
  factory_name: string;
  departments: JsonDepartment[];
}

interface StationRequirement {
  id: number;
  station_id?: number;
  station_name: string;
  department_id: number | null;
  department_name: string;
  minimum_operators: number | null;
  minimum_level_required: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | null | string;
  minimum_level_number: number;
}

interface SkillMatrixTableProps {
  skillMatrices: SkillMatrix[];
  selectedMatrix: SkillMatrix | null;
  employees: any[]; // We expect MasterTable data here (containing emp_id and photo)
  operations: Operation[];
  sections: Section[];
  monthlySkills: MonthlySkill[];
  operatorLevels: OperatorLevel[];
  months: Month[];
  isLoading: boolean;
  error: string | null;
  onMatrixChange: (matrix: SkillMatrix) => void;
  onRefresh: () => Promise<void>;
  stationRequirements: StationRequirement[];
}
// ✅ NEW: Level Configuration Interface
interface LevelConfig {
  level_id: number;
  level_name: string;
  training_mode: 'daywise' | 'hierarchywise';
  training_mode_display: string;
  is_hierarchy_enabled: boolean;
}

const SkillMatrixTable: React.FC<SkillMatrixTableProps> = ({
  skillMatrices,
  selectedMatrix,
  employees, // <--- Using this prop for photo lookup
  monthlySkills,
  operatorLevels,
  months,
  isLoading,
  error,
  onMatrixChange,
  onRefresh,
  stationRequirements,
}) => {
  // --- State Declarations ---
  const [hierarchyData, setHierarchyData] = useState<HierarchyDepartment[]>([]);
  const [availableLines, setAvailableLines] = useState<HierarchyLine[]>([]);
  const [availableSublines, setAvailableSublines] = useState<HierarchySubline[]>([]);
  const [availableStations, setAvailableStations] = useState<HierarchyStation[]>([]);

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
  const [selectedSublineId, setSelectedSublineId] = useState<number | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);
  
  const [multiSkillingsData, setMultiSkillingsData] = useState<MultiSkillingData[]>([]);
  const [searchEmployee, setSearchEmployee] = useState<string>('');
  const [levelColors, setLevelColors] = useState<{ 1: string; 2: string; 3: string; 4: string }>({
    1: '#ef4444',
    2: '#f59e0b',
    3: '#10b981',
    4: '#3b82f6'
  });
  const [displayShape, setDisplayShape] = useState<'piechart' | 'levelblock'>('piechart');

  const [skillMatrixData, setSkillMatrixData] = useState<SkillMatrixApiData[]>([]);
  const [skillMatrixLoading, setSkillMatrixLoading] = useState(false);
  const [hierarchyError, setHierarchyError] = useState<string | null>(null);
  const [skillMatrixError, setSkillMatrixError] = useState<string | null>(null);
  const [downloadLoading, setDownloadLoading] = useState<'template' | 'report' | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const [stationTypeMap, setStationTypeMap] = useState<Record<string, StationTypeConfig>>({});

  const getStationMinOperators = (stationId: number): number | string => {
    const requirement = stationRequirements.find(req =>
      req.station_id === stationId
    );
    return requirement ? (requirement.minimum_operators ?? '-') : '-';
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // --- Initial Data Loading ---
  useEffect(() => {
    loadHierarchyData();
    loadSkillMatrixData();
    loadMultiSkillingsData();
    
    // Mock station types
    setStationTypeMap({
      'STD': { type_id: 1, code: 'STD', name: 'Standard', icon: null, icon_url: null, color: '#3b82f6' },
      'QC': { type_id: 2, code: 'QC', name: 'Quality Control', icon: null, icon_url: null, color: '#10b981' }
    });
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ UPDATED: Load Hierarchy Data (Using Dummy Data)
  // ═══════════════════════════════════════════════════════════════════════════
  const loadHierarchyData = async () => {
    try {
      setHierarchyError(null);
      setHierarchyData(DUMMY_HIERARCHY as any);
    } catch (err) {
      console.error('Failed to load hierarchy data:', err);
      setHierarchyError('Could not load organization structure.');
    }
  };

  const loadSkillMatrixData = async (stationId?: number | null) => {
    try {
      setSkillMatrixLoading(true);
      setSkillMatrixError(null);
      
      let data = [...DUMMY_SKILL_MATRIX_API_DATA];
      if (stationId) {
        data = data.filter(sm => sm.station_id === stationId);
      } else if (selectedMatrix?.department) {
        data = data.filter(sm => {
          const emp = DUMMY_EMPLOYEES.find(e => e.emp_id === sm.emp_id);
          return emp?.department?.department_name === selectedMatrix.department;
        });
      }
      setSkillMatrixData(data as any);
    } catch (err) {
      console.error('Failed to load skill matrix data:', err);
      setSkillMatrixError('Failed to retrieve employee skills.');
    } finally {
      setSkillMatrixLoading(false);
    }
  };

  const loadMultiSkillingsData = async () => {
    try {
      setMultiSkillingsData(DUMMY_MULTI_SKILLINGS as any);
    } catch (err) {
      console.error('Failed to load multiskilling data:', err);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      // Mocked settings for dummy data mode
      setDisplayShape('piechart');
      setLevelColors({
        1: '#ef4444',
        2: '#f59e0b',
        3: '#10b981',
        4: '#3b82f6'
      });
    };
    loadSettings();
  }, []);

  // --- Hierarchy Selection Logic ---

  useEffect(() => {
    if (!selectedMatrix || hierarchyData.length === 0) return;
    const targetDepartment = (selectedMatrix.department || '').toString().trim().toLowerCase();
    const matchingDept = hierarchyData.find((dept) =>
      dept.department_name.toLowerCase().trim() === targetDepartment
    );
    if (matchingDept && matchingDept.department_id !== selectedDepartmentId) {
      setSelectedDepartmentId(matchingDept.department_id);
    }
  }, [selectedMatrix, hierarchyData]);

  useEffect(() => {
    if (hierarchyData.length > 0 && selectedDepartmentId === null) {
      setSelectedDepartmentId(hierarchyData[0].department_id);
    }
  }, [hierarchyData, selectedDepartmentId]);

  useEffect(() => {
    if (!selectedDepartmentId) {
      setAvailableLines([]);
      setAvailableSublines([]);
      setAvailableStations([]);
      return;
    }
    const selectedDepartment = hierarchyData.find(dept => dept.department_id === selectedDepartmentId);
    if (selectedDepartment) {
      setAvailableLines(selectedDepartment.lines || []);
      setSelectedLineId(null);
      setSelectedSublineId(null);
      setSelectedStationId(null);
      setAvailableSublines([]);
      setAvailableStations([]);
    }
  }, [selectedDepartmentId, hierarchyData]);

  useEffect(() => {
    if (availableLines.length > 0 && selectedLineId === null) {
      setSelectedLineId(availableLines[0].line_id);
    }
  }, [availableLines, selectedLineId]);

  useEffect(() => {
    if (!selectedLineId) {
      setAvailableSublines([]);
      setAvailableStations([]);
      return;
    }
    const selectedLine = availableLines.find(line => line.line_id === selectedLineId);
    if (selectedLine) {
      setAvailableSublines(selectedLine.sublines || []);
      if (!selectedLine.sublines || selectedLine.sublines.length === 0) {
        setAvailableStations(selectedLine.stations || []);
      } else {
        setAvailableStations([]);
      }
      setSelectedSublineId(null);
      setSelectedStationId(null);
    }
  }, [selectedLineId, availableLines]);

  useEffect(() => {
    if (availableSublines.length > 0 && selectedSublineId === null) {
      setSelectedSublineId(availableSublines[0].subline_id);
    }
  }, [availableSublines, selectedSublineId]);

  useEffect(() => {
    if (!selectedSublineId) {
      if (selectedLineId) {
        const selectedLine = availableLines.find(line => line.line_id === selectedLineId);
        if (selectedLine && (!selectedLine.sublines || selectedLine.sublines.length === 0)) {
          setAvailableStations(selectedLine.stations || []);
        }
      }
      return;
    }
    const selectedSubline = availableSublines.find(subline => subline.subline_id === selectedSublineId);
    if (selectedSubline) {
      setAvailableStations(selectedSubline.stations || []);
    }
    setSelectedStationId(null);
  }, [selectedSublineId, availableSublines, selectedLineId, availableLines]);

  useEffect(() => {
    if (selectedStationId) {
      loadSkillMatrixData(selectedStationId);
    } else {
      loadSkillMatrixData();
    }
  }, [selectedStationId]);



  useEffect(() => {
    if (selectedMatrix) {
      loadMultiSkillingsData();
    }
  }, [selectedMatrix]);


  // --- Helper Functions ---

  const handleDownload = async (type: 'template' | 'report') => {
    try {
      setDownloadLoading(type);
      setDownloadError(null);

      const filters: { [key: string]: number | undefined } = {};

      if (selectedDepartmentId) filters.department_id = selectedDepartmentId;
      if (selectedLineId) filters.main_line_id = selectedLineId;
      if (selectedSublineId) filters.sub_line_id = selectedSublineId;
      if (selectedStationId) filters.station_id = selectedStationId;

      const url = type === 'template'
        ? `${API_BASE_URL}/skill-matrix/template/download/`
        : `${API_BASE_URL}/skill-matrix/report/download/`;

      const response = await axios.post(url, filters, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const filename = type === 'template'
        ? `skill_matrix_template.xlsx`
        : `skill_matrix_report.xlsx`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(`Failed to download ${type}:`, err);
      setDownloadError(`Failed to download ${type}. Please try again.`);
    } finally {
      setDownloadLoading(null);
    }
  };

  const getRelevantStations = (): HierarchyStation[] => {
    if (!selectedDepartmentId || hierarchyData.length === 0) return [];

    const dept = hierarchyData.find(d => d.department_id === selectedDepartmentId);
    if (!dept) return [];

    const stationMap = new Map<number, HierarchyStation>();
    const add = (stations: HierarchyStation[]) => {
      stations.forEach(s => stationMap.set(s.station_id, s));
    };

    if (selectedStationId) {
      const all = [
        ...dept.stations,
        ...dept.lines.flatMap(l => [...l.stations, ...l.sublines.flatMap(sl => sl.stations)])
      ];
      const found = all.find(s => s.station_id === selectedStationId);
      return found ? [found] : [];
    }

    if (selectedSublineId) {
      const subline = dept.lines.flatMap(l => l.sublines).find(sl => sl.subline_id === selectedSublineId);
      return subline?.stations || [];
    }

    if (selectedLineId) {
      const line = dept.lines.find(l => l.line_id === selectedLineId);
      if (!line) return [];
      add(line.stations);
      line.sublines.forEach(sl => add(sl.stations));
      return Array.from(stationMap.values());
    }

    add(dept.stations);
    dept.lines.forEach(line => {
      add(line.stations);
      line.sublines.forEach(sl => add(sl.stations));
    });

    return Array.from(stationMap.values());
  };

  const getDropdownStations = (): HierarchyStation[] => {
    if (!selectedDepartmentId || hierarchyData.length === 0) return [];

    const dept = hierarchyData.find(d => d.department_id === selectedDepartmentId);
    if (!dept) return [];

    const stationMap = new Map<number, HierarchyStation>();
    const add = (stations: HierarchyStation[]) => {
      stations.forEach(s => stationMap.set(s.station_id, s));
    };

    if (selectedSublineId) {
      const subline = dept.lines.flatMap(l => l.sublines).find(sl => sl.subline_id === selectedSublineId);
      return subline?.stations || [];
    }

    if (selectedLineId) {
      const line = dept.lines.find(l => l.line_id === selectedLineId);
      if (!line) return [];
      add(line.stations);
      line.sublines.forEach(sl => add(sl.stations));
      return Array.from(stationMap.values());
    }

    add(dept.stations);
    dept.lines.forEach(line => {
      add(line.stations);
      line.sublines.forEach(sl => add(sl.stations));
    });

    return Array.from(stationMap.values());
  };

  const stationHeaders = getRelevantStations();
  const dropdownStations = getDropdownStations();

  // *** KEY FILTER LOGIC (UPDATED WITH MASTER LIST LOOKUP) ***
  const getDepartmentEmployees = (): any[] => {
    const departmentName = hierarchyData.find(d => d.department_id === selectedDepartmentId)?.department_name;
    if (!departmentName) return [];

    // 1. Create a lookup map from the 'employees' prop (Master Data) to find photos
    // This handles cases where the Skill Matrix API doesn't include the photo yet.
    const masterEmployeeMap = new Map();
    if (employees && Array.isArray(employees)) {
      employees.forEach(emp => {
        if (emp.emp_id) masterEmployeeMap.set(emp.emp_id, emp);
      });
    }

    const relevantStationIds = stationHeaders.map(s => s.station_id);

    // Filter employees from Skill Matrix Data
    const filteredSkillMatrixEmployees = skillMatrixData
      .filter(sm => relevantStationIds.includes(sm.station_id))
      .map(sm => {
        const masterRecord = masterEmployeeMap.get(sm.emp_id);
        return {
          emp_id: sm.emp_id,
          full_name: sm.employee_name,
          date_of_join: sm.doj,
          // PRIORITY: 1. Master List, 2. API Response, 3. Null
          photo: masterRecord?.photo || sm.photo || null
        };
      });


    // Filter employees from Operator Levels (fallback)
    const filteredOperatorLevelEmployees = operatorLevels
      .filter(ol =>
        ol.skill_matrix.department.toLowerCase() === departmentName.toLowerCase() &&
        relevantStationIds.includes(Number(ol.operation.id))
      )
      .map(ol => {
        const empId = ol.employee.employee_code;
        const masterRecord = masterEmployeeMap.get(empId);
        return {
          emp_id: empId,
          full_name: ol.employee.full_name,
          date_of_join: ol.employee.date_of_join,
          // PRIORITY: 1. Master List, 2. Operator Level Nested, 3. Null
          photo: masterRecord?.photo || (ol.employee as any).photo || null
        };
      });

    const allEmployees = [
      ...filteredSkillMatrixEmployees,
      ...filteredOperatorLevelEmployees
    ];

    // Deduplicate by emp_id
    return allEmployees.filter((emp, index, self) =>
      emp.emp_id && index === self.findIndex(e => e.emp_id === emp.emp_id)
    );
  };

  const departmentEmployees = getDepartmentEmployees();

  // Filter by employee search
  const filteredEmployeesForTable = departmentEmployees.filter(emp => {
    if (!searchEmployee) return true;
    const searchLower = searchEmployee.toLowerCase();
    return (
      emp.full_name?.toLowerCase().includes(searchLower) ||
      emp.emp_id?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployeesForTable.length / itemsPerPage);
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentEmployees = filteredEmployeesForTable.slice(firstItemIndex, lastItemIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDepartmentId, selectedLineId, selectedSublineId, selectedStationId]);

  const getEmployeeMonthlySkills = (employeeCode: string): MonthlySkill[] => {
    if (!selectedMatrix) return [];
    return monthlySkills.filter(ms =>
      ms.employee_code === employeeCode &&
      ms.department === selectedMatrix.department
    );
  };

  const getEmployeeMultiSkills = (employeeCode: string): MultiSkillingData[] => {
    return multiSkillingsData.filter(ms =>
      ms.emp_id === employeeCode &&
      ms.status !== 'completed'
    );
  };

  const getOperatorSkillLevel = (employeeCode: string, stationId: number | string): number => {
    const skillRecord = skillMatrixData.find(skill =>
      skill.emp_id === employeeCode &&
      skill.station_id === parseInt(stationId.toString())
    );
    if (skillRecord) return skillRecord.level;
    const operatorLevel = operatorLevels.find(ol =>
      ol.employee.employee_code === employeeCode &&
      ol.operation.id.toString() === stationId.toString()
    );
    return operatorLevel ? parseInt(operatorLevel.level?.toString() || '0') : 0;
  };

  const getStationMinimumLevel = (stationId: number): number => {
    const requirement = stationRequirements.find(
      req => req.station_id === stationId
    );

    if (!requirement) return 0;

    if (requirement.minimum_level_number &&
      requirement.minimum_level_number >= 1 &&
      requirement.minimum_level_number <= 4) {
      return requirement.minimum_level_number;
    }

    if (requirement.minimum_level_required) {
      const match = requirement.minimum_level_required.match(/Level\s*(\d+)/i);
      if (match) {
        const level = parseInt(match[1], 10);
        if (level >= 1 && level <= 4) return level;
      }
    }

    return 0;
  };

  const renderStationIcon = (station: HierarchyStation) => {
    const typeConfig = station.station_type ? stationTypeMap[station.station_type] : null;
    if (typeConfig && typeConfig.icon_url) {
      const imageUrl = typeConfig.icon_url.startsWith('http')
        ? typeConfig.icon_url
        : `${API_BASE_URL}${typeConfig.icon_url}`;
      return (
        <img
          src={imageUrl}
          alt={typeConfig.name}
          className="w-5 h-5 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }
    if (typeConfig) {
      return (
        <span className="text-[9px] font-extrabold text-gray-600 uppercase">
          {typeConfig.code.substring(0, 3)}
        </span>
      );
    }
    return <Hexagon size={16} className="text-gray-400" />;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-GB');
    } catch { return '-'; }
  };

  // Helper to construct robust photo URL
  const getPhotoUrl = (photoPath: string | null) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;

    // Ensure we don't double slash if API_BASE_URL ends with / and path starts with /
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const path = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;

    return `${baseUrl}${path}`;
  };

  // const SkillDisplay: React.FC<{ level: number }> = ({ level }) => {
  //   const safeLevel = Math.max(0, Math.min(4, level || 0));
  //   if (displayShape === 'levelblock') {
  //     return <LevelBlock level={safeLevel} colors={levelColors} />;
  //   }
  //   return <PieChart level={safeLevel} colors={levelColors} size={32} />;
  // };
  const SkillDisplay: React.FC<{ level: number }> = ({ level }) => {
    const safeLevel = Math.max(0, Math.min(4, level || 0));
    const size = 34; // adjustable: 32 / 36 / 40

    if (displayShape === 'levelblock') {
      return (
        <div className="flex justify-center items-center w-full h-full min-h-16">
          <div className="w-14 h-10">
            <LevelBlock
              level={safeLevel}
              colors={levelColors}
              size={size}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-center items-center w-full h-full min-h-16">
        <div className="w-14 h-10">
          <PieChart
            level={safeLevel}
            colors={levelColors}
            size={size}
          />
        </div>
      </div>
    );
  };


const handleRefresh = async () => {
  setSkillMatrixLoading(true);
  await Promise.all([
    onRefresh(),
    loadSkillMatrixData(selectedStationId),
    loadHierarchyData(),
    loadMultiSkillingsData()
  ]);
  setSkillMatrixLoading(false);
};

  const handleDepartmentChange = (departmentId: number | null) => {
    setSelectedDepartmentId(departmentId);
    if (departmentId) {
      const selectedDept = hierarchyData.find(d => d.department_id === departmentId);
      if (selectedDept) {
        const matrix = skillMatrices.find(m =>
          (m.department || '').toString().trim().toLowerCase() ===
          selectedDept.department_name.toLowerCase().trim()
        );
        if (matrix) onMatrixChange(matrix);
      }
    }
  };

  const showLoading = (isLoading || skillMatrixLoading) && skillMatrices.length === 0;
  const showErrorBanner = error || hierarchyError || skillMatrixError || downloadError;

  if (showLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-blue-600 animate-pulse">Loading skill matrix data...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Error Banner */}
        {showErrorBanner && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Attention Needed</h3>
                <p className="text-sm mt-1">
                  {error || hierarchyError || skillMatrixError || downloadError}
                </p>
              </div>
              <button
                onClick={() => { setHierarchyError(null); setSkillMatrixError(null); setDownloadError(null); }}
                className="ml-auto bg-red-100 hover:bg-red-200 text-red-800 p-1 rounded"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="border-b-2 border-blue-200 p-6 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Skill Matrix & Skill Upgradation Plan
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleDownload('report')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
              title="Download skill matrix report"
              disabled={downloadLoading === 'report' || !selectedDepartmentId}
            >
              <Download className="w-4 h-4" />
              <span>{downloadLoading === 'report' ? 'Downloading...' : 'Download Report'}</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              title="Refresh skill matrix data"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="text-md font-semibold mb-3 text-gray-700 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Legend
          </div>
          <div className="mb-3">
            <div className="text-sm font-semibold mb-2 text-gray-600">Skill Level Scale:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div className="text-sm flex items-center space-x-2 bg-gray-100 p-2 rounded-md">
                <SkillDisplay level={0} />
                <span>0 = Beginner</span>
              </div>
              <div className="text-sm flex items-center space-x-1 bg-gray-100 p-2 rounded-md">
                <SkillDisplay level={1} />
                <span>1 = Learner</span>
              </div>
              <div className="text-sm flex items-center space-x-1 bg-gray-100 p-2 rounded-md">
                <SkillDisplay level={2} />
                <span>2 = Practitioner</span>
              </div>
              <div className="text-sm flex items-center space-x-1 bg-gray-100 p-2 rounded-md">
                <SkillDisplay level={3} />
                <span>3 = Expert</span>
              </div>
              <div className="text-sm flex items-center space-x-1 bg-gray-100 p-2 rounded-md">
                <SkillDisplay level={4} />
                <span>4 = Master</span>
              </div>
            </div>
          </div>
        </div>

        {/* Matrix Info + Dropdown Row */}
        <div className="border-b border-gray-200 p-5 bg-white">
          <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex-shrink-0 flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 shadow-sm relative pr-6">
              <Building className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-700">Department:</span>
              <select
                value={selectedDepartmentId ?? ''}
                onChange={(e) => handleDepartmentChange(e.target.value ? Number(e.target.value) : null)}
                className="appearance-none border-0 bg-transparent rounded px-2 py-1 focus:outline-none focus:ring-0 text-blue-700 font-medium cursor-pointer"
              >
                <option value="">Select Department</option>
                {hierarchyData.map((dept) => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 shadow-sm relative pr-6">
              <GitBranch className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-700">Line:</span>
              <select
                value={selectedLineId ?? ''}
                onChange={(e) => setSelectedLineId(e.target.value ? Number(e.target.value) : null)}
                className="appearance-none border-0 bg-transparent rounded px-2 py-1 focus:outline-none focus:ring-0 text-blue-700 font-medium cursor-pointer"
                disabled={!selectedDepartmentId || availableLines.length === 0}
              >
                <option value="">Select Line</option>
                {availableLines.map((line) => (
                  <option key={line.line_id} value={line.line_id}>
                    {line.line_name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 shadow-sm relative pr-6">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-700">Sub Line:</span>
              <select
                value={selectedSublineId ?? ''}
                onChange={(e) => setSelectedSublineId(e.target.value ? Number(e.target.value) : null)}
                className="appearance-none border-0 bg-transparent rounded px-2 py-1 focus:outline-none focus:ring-0 text-blue-700 font-medium cursor-pointer"
                disabled={!selectedLineId || availableSublines.length === 0}
              >
                <option value="">
                  {availableSublines.length === 0 ? 'No Sub Lines' : 'Select Sub Line'}
                </option>
                {availableSublines.map((subline) => (
                  <option key={subline.subline_id} value={subline.subline_id}>
                    {subline.subline_name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 shadow-sm relative pr-6">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-700">Station:</span>
              <select
                value={selectedStationId ?? ''}
                onChange={(e) => setSelectedStationId(e.target.value ? Number(e.target.value) : null)}
                className="appearance-none border-0 bg-transparent rounded px-2 py-1 focus:outline-none focus:ring-0 text-blue-700 font-medium min-w-[150px] cursor-pointer"
              >
                <option value="">All Stations ({dropdownStations.length})</option>
                {dropdownStations
                  .sort((a, b) => a.station_name.localeCompare(b.station_name))
                  .map((station) => (
                    <option key={station.station_id} value={station.station_id}>
                      {station.station_name}
                    </option>
                  ))}
              </select>
              <div className="absolute right-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>

          </div>

          {/* Context Info Box */}
          <div className="mt-3 text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
            {(() => {
              const selectedDept = hierarchyData.find(d => d.department_id === selectedDepartmentId);
              const selectedLine = availableLines.find(l => l.line_id === selectedLineId);
              const selectedSubline = availableSublines.find(sl => sl.subline_id === selectedSublineId);
              const selectedStation = availableStations.find(st => st.station_id === selectedStationId);
              const depName = selectedDept?.department_name || '-';
              const lineName = selectedLine?.line_name || '-';
              const sublineName = selectedSubline?.subline_name || '-';
              const stationName = selectedStation?.station_name || 'All Stations';
              return (
                <div className="flex flex-wrap gap-4">

                  <span className="flex items-center">
                    <Building className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="font-semibold mr-1">Department:</span> {depName}
                  </span>
                  <span className="flex items-center">
                    <GitBranch className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="font-semibold mr-1">Line:</span> {lineName}
                  </span>
                  <span className="flex items-center">
                    <Layers className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="font-semibold mr-1">Sub Line:</span> {sublineName}
                  </span>
                  <span className="flex items-center">
                    <Cpu className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="font-semibold mr-1">Station:</span> {stationName}
                  </span>
                  <span className="flex items-center ml-4 text-green-700">
                    <span className="font-semibold mr-1">Showing:</span> {stationHeaders.length} station(s)
                  </span>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="px-5 py-2 bg-blue-50 text-sm text-blue-700 flex items-center justify-between border-b border-blue-100">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span className="font-semibold">{departmentEmployees.length} employees</span>
            <span className="ml-1">found matching current filters</span>
            {selectedStationId && (
              <span className="ml-4 text-purple-700 border-l border-blue-200 pl-4">
                Filtered by station: {availableStations.find(s => s.station_id === selectedStationId)?.station_name}
              </span>
            )}
          </div>

          {/* Search Dropdown on the Right */}
          <div className="flex items-center space-x-2 bg-white border border-blue-200 rounded-lg px-3 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition-all min-w-[350px]">
            <User className="w-4 h-4 text-blue-500" />
            <input
              list="employee-search-list"
              value={searchEmployee}
              onChange={(e) => setSearchEmployee(e.target.value)}
              placeholder="Quick Search (Name or ID)..."
              className="border-0 bg-transparent flex-1 focus:outline-none text-gray-700 placeholder-gray-400 text-xs"
            />
            <datalist id="employee-search-list">
              {departmentEmployees.map(emp => (
                <option key={emp.emp_id} value={emp.emp_id}>
                  {emp.full_name} ({emp.emp_id})
                </option>
              ))}
            </datalist>
            {searchEmployee && (
              <button 
                onClick={() => setSearchEmployee('')}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear search"
              >
                <RefreshCw className="w-3.5 h-3.5 hover:rotate-180 transition-all duration-500" />
              </button>
            )}
          </div>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 w-12 bg-gray-100" rowSpan={3}>Sl. No.</th>
                <th className="border border-gray-300 p-2 w-16 bg-gray-100" rowSpan={3}>CC No/EMP Code</th>
                {/* Photo Column */}
                <th className="border border-gray-300 p-2 w-16 bg-gray-100" rowSpan={3}>Photo</th>
                <th className="border border-gray-300 p-2 w-32 bg-gray-100" rowSpan={3}>Employee Name</th>
                <th className="border border-gray-300 p-2 w-24 bg-gray-100" rowSpan={3}>DOJ</th>
                <th
                  className="border border-gray-300 p-2 text-center font-bold bg-blue-100"
                  colSpan={Math.max(1, stationHeaders.length)}
                >
                  Training Points (Stations)
                </th>
                <th
                  className="border border-gray-300 p-2 text-center font-bold bg-green-100"
                  colSpan={months.length}
                >
                  Skill Matrix & Skill Upgradation Plan
                </th>
                <th className="border border-gray-300 p-2 text-center font-bold bg-gray-100" rowSpan={3}>
                  Remarks
                </th>
              </tr>
              <tr>
                {stationHeaders.length > 0 ? stationHeaders.map(st => {
                  const typeConfig = st.station_type ? stationTypeMap[st.station_type] : null;
                  return (
                    <th
                      key={st.station_id}
                      className="border border-gray-300 p-1 text-center text-xs font-bold bg-yellow-100"
                      title={typeConfig ? typeConfig.name : 'Standard Station'}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{st.station_id}</span>
                      </div>
                    </th>
                  );
                }) : <th className="border border-gray-300 p-1 bg-yellow-100"></th>}

                {/* Monthly Plan Header */}
                <th className="border border-gray-300 p-2 text-center font-bold bg-green-50" colSpan={months.length}>
                  Monthly Plan
                </th>
              </tr>
              <tr>
                {stationHeaders.length > 0 ? (
                  stationHeaders.map(st => {
                    const typeConfig = st.station_type ? stationTypeMap[st.station_type] : null;
                    return (
                      <th
                        key={st.station_id}
                        className="border border-gray-300 p-1 text-center text-xs font-bold h-20 bg-blue-50"
                        title={typeConfig ? `${typeConfig.name} ` : 'Standard Station'}
                      >
                        <div className="flex flex-col items-center justify-center h-full gap-1">
                          {renderStationIcon(st)}
                          <span className="text-xs">{st.station_name}</span>
                        </div>
                      </th>
                    );
                  })
                ) : (
                  <th className="border border-gray-300 p-1 text-center text-xs font-bold bg-gray-50 h-20">
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      No Stations
                    </div>
                  </th>
                )}
                {months.map(month => (
                  <th
                    key={month.id}
                    className="border border-gray-300 p-1 text-center text-xs font-bold bg-green-50"
                    style={{ height: '80px', width: '24px' }}
                  >
                    <div
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        textAlign: 'center',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {month.displayName}
                    </div>
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-100">
                {/* Updated colspan for Photo (4 -> 5) */}
                <td className="border border-gray-300 p-2 text-center font-bold" colSpan={5}>Required Level</td>
                {stationHeaders.length > 0 ? (
                  stationHeaders.map(st => {
                    const requiredLevel = getStationMinimumLevel(st.station_id) || 0;
                    return (
                      <td key={st.station_id} className="border border-gray-300 p-1 text-center font-bold">
                        <div className="flex items-center justify-center">
                          <SkillDisplay level={requiredLevel} />
                        </div>
                      </td>
                    );
                  })
                ) : (
                  <td className="border border-gray-300 p-1 text-center font-bold">-</td>
                )}
                <td className="border border-gray-300 p-1 text-center font-bold bg-gray-100" colSpan={months.length + 1}>
                </td>
              </tr>
              <tr className="bg-gray-50">
                {/* Updated colspan for Photo (4 -> 5) */}
                <td className="border border-gray-300 p-2 text-center font-bold text-gray-700" colSpan={5}>
                  Min Operators
                </td>
                {stationHeaders.length > 0 ? (
                  stationHeaders.map(st => {
                    const minOps = getStationMinOperators(st.station_id);
                    return (
                      <td key={st.station_id} className="border border-gray-300 p-1 text-center font-bold text-blue-800">
                        {minOps}
                      </td>
                    );
                  })
                ) : (
                  <td className="border border-gray-300 p-1 text-center font-bold">-</td>
                )}
                {/* Empty cell for calendar columns */}
                <td className="border border-gray-300 p-1 text-center font-bold bg-gray-50" colSpan={months.length + 1}></td>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.length > 0 ? (
                currentEmployees.map((employee, index) => {
                  const employeeMonthlySkills = getEmployeeMonthlySkills(employee.emp_id || employee.employee_code);
                  const photoUrl = getPhotoUrl(employee.photo);


                  return (
                    <tr key={employee.emp_id || employee.employee_code} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 p-2 text-center">{firstItemIndex + index + 1}</td>
                      <td className="border border-gray-300 p-2 text-center font-mono">{employee.emp_id || employee.employee_code || '-'}</td>

                      {/* Photo Data Cell */}
                      <td className="border border-gray-300 p-1 text-center">
                        <div className="flex justify-center items-center">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={employee.full_name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200"
                              onError={(e) => {
                                // Fallback if image fails to load
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          {/* Fallback Icon (also used if photoUrl is null) */}
                          <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 ${photoUrl ? 'hidden' : ''}`}>
                            <User size={20} />
                          </div>
                        </div>
                      </td>

                      <td className="border border-gray-300 p-2">{employee.full_name || '-'}</td>
                      <td className="border border-gray-300 p-2 text-center">{formatDate(employee.date_of_join)}</td>
                      {stationHeaders.length > 0 ? (
                        stationHeaders.map(st => {
                          const skillLevel = getOperatorSkillLevel(
                            employee.emp_id || employee.employee_code,
                            st.station_id
                          );
                          const skillRecord = skillMatrixData.find(skill =>
                            skill.emp_id === (employee.emp_id || employee.employee_code) &&
                            skill.station_id === st.station_id
                          );
                          const updatedDate = skillRecord?.updated_at ? formatDate(skillRecord.updated_at) : null;
                          return (
                            <td
                              key={st.station_id}
                              className="border border-gray-300 p-1 text-center"
                              title={`${employee.full_name} - ${st.station_name}: Level ${skillLevel}${updatedDate ? ` (Updated: ${updatedDate})` : ''}`}
                            >
                              <div className="flex flex-col items-center justify-center space-y-1">
                                <div className="flex items-center justify-center">
                                  <SkillDisplay level={skillLevel} />
                                </div>
                                {updatedDate && (
                                  <div className="text-xs text-gray-500 font-mono leading-tight">
                                    {updatedDate}
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })
                      ) : (
                        <td className="border border-gray-300 p-1 text-center">
                          <div className="flex items-center justify-center">
                            <span className="text-xs text-gray-400">No stations</span>
                          </div>
                        </td>
                      )}
                      {months.map(month => {
                        const employeeMultiSkills = getEmployeeMultiSkills(employee.emp_id || employee.employee_code);
                        const monthMultiSkills = employeeMultiSkills.filter(ms => {
                          if (!ms.start_date) return false;
                          try {
                            const startDate = new Date(ms.start_date);
                            return startDate.getMonth() + 1 === month.id &&
                              startDate.getFullYear() === month.year;
                          } catch {
                            return false;
                          }
                        });
                        return (
                          <td
                            key={month.id}
                            className="border border-gray-300 p-1 text-center"
                            style={{ width: '24px' }}
                          >
                            {monthMultiSkills.length > 0 ? (
                              <div className="flex flex-col items-center justify-center h-full space-y-1">
                                {monthMultiSkills.map(ms => {
                                  const stationId = (typeof ms.station === 'object' && ms.station !== null)
                                    ? ms.station.station_id
                                    : (ms.station as number);

                                  let stationName = (typeof ms.station === 'object' && ms.station !== null)
                                    ? ms.station.station_name
                                    : undefined;

                                  if (!stationName) {
                                    const foundStation = availableStations.find(st =>
                                      st.station_id === parseInt(stationId.toString())
                                    );
                                    stationName = foundStation?.station_name;
                                  }
                                  if (!stationName) {
                                    const allStations = hierarchyData.flatMap(dept => [
                                      ...(dept.stations || []),
                                      ...(dept.lines || []).flatMap(line => [
                                        ...(line.stations || []),
                                        ...(line.sublines || []).flatMap(sl => sl.stations || [])
                                      ]),
                                      ...(dept.sublines || []).flatMap(sl => sl.stations || [])
                                    ]);
                                    const foundInAll = allStations.find(st =>
                                      st.station_id === parseInt(stationId.toString())
                                    );
                                    stationName = foundInAll?.station_name;
                                  }
                                  if (!stationName) {
                                    stationName = `Station ${stationId}`;
                                  }

                                  const skillLevel = (typeof ms.skill_level === 'object' && ms.skill_level !== null)
                                    ? ms.skill_level.level_number
                                    : Number(ms.skill_level);

                                  const isCompleted = ms.status === 'completed';
                                  const isInProgress = ms.current_status === 'in-progress';
                                  return (
                                    <div
                                      key={ms.id || `${ms.emp_id}-${stationId}-${ms.start_date}`}
                                      className="flex flex-col items-center space-y-1"
                                    >
                                      {isCompleted ? (
                                        <div
                                          className="flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-sm font-bold"
                                          title={`Station ${stationId} (${stationName}) - Level ${skillLevel} - Completed`}
                                        >
                                          ✓
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center space-y-1">
                                          <MonthlySkillDisplay
                                            stationId={stationId}
                                            stationName={stationName}
                                            skillLevel={skillLevel}
                                            size={24}
                                            colors={levelColors}
                                            title={`Station ${stationId} (${stationName}) - Level ${skillLevel} - ${isInProgress ? 'In Progress' : 'Scheduled'}`}
                                          />
                                          <div className="text-xs text-gray-500 font-sans leading-tight truncate w-20">
                                            {stationName}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400">-</div>
                            )}
                          </td>
                        );
                      })}
                      <td className="border border-gray-300 p-2 text-xs">
                        {/* Empty remarks as requested */}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7 + stationHeaders.length + months.length + 1} className="p-8 text-center text-gray-500">
                    <div className="text-lg font-semibold mb-2">No Employees Found</div>
                    <div className="text-sm max-w-md mx-auto">
                      No employees have been assigned to
                      {selectedStationId ? ' this specific station ' :
                        selectedSublineId ? ' this specific subline ' :
                          selectedLineId ? ' this specific line ' : ' this department '}
                      yet.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50 text-sm">
          <div>
            Showing{' '}
            <span className="font-semibold">{departmentEmployees.length > 0 ? firstItemIndex + 1 : 0}</span> to{' '}
            <span className="font-semibold">{Math.min(lastItemIndex, departmentEmployees.length)}</span> of{' '}
            <span className="font-semibold">{departmentEmployees.length}</span> employees
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || totalPages === 0}
              className="px-3 py-1 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >Previous</button>
            <span>
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages || 1}</span>
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillMatrixTable;