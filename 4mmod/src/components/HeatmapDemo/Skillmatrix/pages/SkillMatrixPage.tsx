

import React, { useState, useEffect } from 'react';
import SkillMatrixTable from '../components/SkillMatrixTable';
import { type SkillMatrix, type Operation, type Section, type MonthlySkill, type OperatorLevel, months, type StationRequirement } from '../api/types';
import { 
  DUMMY_SKILL_MATRICES, 
  DUMMY_OPERATIONS, 
  DUMMY_SECTIONS, 
  DUMMY_MONTHLY_SKILLS, 
  DUMMY_STATION_REQUIREMENTS, 
  DUMMY_OPERATOR_LEVELS,
  DUMMY_DEPARTMENTS
} from './dummySkillData';

const SkillMatrixPage: React.FC = () => {
  const [skillMatrices, setSkillMatrices] = useState<SkillMatrix[]>([]);
  const [selectedMatrix, setSelectedMatrix] = useState<SkillMatrix | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [monthlySkills, setMonthlySkills] = useState<MonthlySkill[]>([]);
  const [operatorLevels, setOperatorLevels] = useState<OperatorLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stationRequirements, setStationRequirements] = useState<StationRequirement[]>([]); // <-- NEW STATE

  useEffect(() => {
    const loadInitialData = () => {
      try {
        setIsLoading(true);
        setError(null);

        // Normalize departments from dummy data
        const normalizedDepartments = DUMMY_DEPARTMENTS.map((d: any, idx: number) => ({
          id: d.department_id ?? d.id ?? idx + 1,
          name: d.department_name ?? d.name ?? String(d)
        }));

        // Extract unique employees from dummy monthly skills data
        const employeesFromMonthlySkills = DUMMY_MONTHLY_SKILLS.reduce((acc: any[], current: any) => {
          if (!acc.find((item: any) => item.employee_code === current.employee_code)) {
            acc.push({
              employee_code: current.employee_code,
              full_name: current.full_name,
              designation: current.designation,
              date_of_join: current.date_of_join,
              department: current.department,
              section: DUMMY_SECTIONS.find((s: any) => s.name === current.section)?.id
            });
          }
          return acc;
        }, []);

        const initialDepartment = normalizedDepartments[0]?.name || "Production";
        const initialOperatorLevels = DUMMY_OPERATOR_LEVELS.filter((ol: OperatorLevel) => ol.employee.department === initialDepartment);

        setSkillMatrices(DUMMY_SKILL_MATRICES);
        setEmployees(employeesFromMonthlySkills);
        setOperations(DUMMY_OPERATIONS);
        setSections(DUMMY_SECTIONS);
        setMonthlySkills(DUMMY_MONTHLY_SKILLS);
        setOperatorLevels(initialOperatorLevels);
        setStationRequirements(DUMMY_STATION_REQUIREMENTS);

        if (DUMMY_SKILL_MATRICES.length > 0) {
          setSelectedMatrix(DUMMY_SKILL_MATRICES[0]);
        }

      } catch (err) {
        console.error('Error loading dummy initial data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dummy data');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleMatrixChange = async (matrix: SkillMatrix) => {
    setSelectedMatrix(matrix);

    // Fetch dummy operator levels for the new department
    try {
      setIsLoading(true);
      const operatorLevelsData = DUMMY_OPERATOR_LEVELS.filter((ol: OperatorLevel) => ol.employee.department === matrix.department);
      setOperatorLevels(operatorLevelsData);
    } catch (error) {
      console.error('Error loading dummy operator levels for department:', matrix.department, error);
      setError('Failed to load dummy operator levels');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh data
  const refreshData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Re-load same dummy data
      const initialDepartment = selectedMatrix?.department || "Production";
      const initialOperatorLevels = DUMMY_OPERATOR_LEVELS.filter((ol: OperatorLevel) => ol.employee.department === initialDepartment);

      setSkillMatrices(DUMMY_SKILL_MATRICES);
      setOperations(DUMMY_OPERATIONS);
      setSections(DUMMY_SECTIONS);
      setMonthlySkills(DUMMY_MONTHLY_SKILLS);
      setOperatorLevels(initialOperatorLevels);
      setStationRequirements(DUMMY_STATION_REQUIREMENTS);

    } catch (err) {
      console.error('Error refreshing dummy data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh dummy data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SkillMatrixTable
        skillMatrices={skillMatrices}
        selectedMatrix={selectedMatrix}
        employees={employees}
        operations={operations}
        sections={sections}
        monthlySkills={monthlySkills}
        operatorLevels={operatorLevels}
        stationRequirements={stationRequirements} // <-- PASS NEW PROP
        months={months}
        isLoading={isLoading}
        error={error}
        onMatrixChange={handleMatrixChange}
        onRefresh={refreshData}
      />
    </>
  );
};

export default SkillMatrixPage;