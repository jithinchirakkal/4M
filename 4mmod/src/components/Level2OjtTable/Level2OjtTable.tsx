import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

// --- Interfaces (Keep these as they are) ---
interface TraineeInfo { id?: number; traineeId: string; trainee_name: string; trainer_name: string; line_name: string; revision_date: string; DOJ: string; line?: number; }
interface LocationState { operatorId?: string; employeeName?: string; lineId?: string | number; lineName?: string; levelId?: number | string; levelName?: string; }
interface OJTDay { id: number; name: string; day_number?: number }
interface DailyScore { day: number; date: string; plan: string; actual: string; production_marks: number; rejections: string; quality_marks: number; submitted?: boolean; scoreId?: number; }
interface Line { id: number; title: string; }
interface Station { id: number; title: string; section: number }

const OnJobTraining = () => {
  const location = useLocation()

  // 1. Setup Demo Data fallbacks
  const demoState: LocationState = {
    operatorId: "DEMO-001",
    employeeName: "John Doe",
    lineName: "Main Assembly Line",
    lineId: 1,
    levelName: "Level 2",
    levelId: "2"
  };

  // 2. Extract data ONCE (Cleaned up your duplicate lines)
  const state = (location.state as LocationState) || demoState;
  const { 
    operatorId = "DEMO-001", 
    employeeName = "John Doe", 
    lineName: passedLineName, 
    lineId: passedLineId,
    levelId: passedLevelId,
    levelName: passedLevelName 
  } = state;

  // --- States ---
  const [lines] = useState<Line[]>([{ id: 1, title: passedLineName || "Demo Line" }])
  const [stations] = useState<Station[]>([{ id: 101, title: "Assembly Station 1", section: 1 }])
  const [selectedLineId] = useState<number | null>(1)
  const [selectedStationId] = useState<number | null>(101)
  const [currentLineName] = useState<string>(passedLineName || "Demo Line")
  const [currentStationName] = useState<string>("Assembly Station 1")
  const [trainee, setTrainee] = useState<TraineeInfo | null>(null)
  const [ojtDays] = useState<OJTDay[]>([
    {id: 1, name: 'Day 1', day_number: 1}, {id: 2, name: 'Day 2', day_number: 2},
    {id: 3, name: 'Day 3', day_number: 3}, {id: 4, name: 'Day 4', day_number: 4},
    {id: 5, name: 'Day 5', day_number: 5}, {id: 6, name: 'Day 6', day_number: 6}
  ])
  const [dailyScores, setDailyScores] = useState<DailyScore[]>([
    { day: 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
    { day: 2, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
    { day: 3, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
    { day: 4, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
    { day: 5, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
    { day: 6, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
  ])
  
  const [loading] = useState(false)
  const [submitError] = useState('')
  const [engineerJudge, setEngineerJudge] = useState('')
  const [preparedBy, setPreparedBy] = useState('')
  const [approvedBy, setApprovedBy] = useState('')
  const [dojValue] = useState('01/01/2024') // Hardcoded for demo
  const [totalProductionMarks, setTotalProductionMarks] = useState(0)
  const [totalQualityMarks, setTotalQualityMarks] = useState(0)
  const [overallResult, setOverallResult] = useState('Pending')
  const [dataLoaded, setDataLoaded] = useState(true) // Force to true for demo

  // --- Initialize trainee info for Demo ---
  useEffect(() => {
    setTrainee({
      traineeId: operatorId,
      trainee_name: employeeName,
      trainer_name: 'Trainer Name',
      line_name: currentLineName,
      revision_date: new Date().toLocaleDateString(),
      DOJ: dojValue,
      line: 1,
    })
    setDataLoaded(true)
  }, []);

  // Helpers (Keep your original date helpers here)
  const formatDateForInput = (d: string) => d; 
  const formatDateForDisplay = (d: string) => d;

  const handleInputChange = (index: number, field: string, value: string | number) => {
    const updatedScores = [...dailyScores];
    updatedScores[index] = { ...updatedScores[index], [field]: value };
    
    // Simple demo logic for marks
    if(field === 'actual') updatedScores[index].production_marks = 4;
    if(field === 'rejections') updatedScores[index].quality_marks = 4;
    
    setDailyScores(updatedScores);
    
    const pTotal = updatedScores.reduce((sum, s) => sum + s.production_marks, 0);
    const qTotal = updatedScores.reduce((sum, s) => sum + s.quality_marks, 0);
    setTotalProductionMarks(pTotal);
    setTotalQualityMarks(qTotal);
    setOverallResult(pTotal > 10 ? 'Pass' : 'Pending');
  }

  return (
    <div className="p-4 text-sm bg-white min-h-screen">
      <div className="max-w-8xl mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-8 border border-gray-200">
        <table className="w-full border border-gray-300 rounded-xl overflow-hidden text-center">
          <tbody>
            <tr>
              <td rowSpan={4} colSpan={2} className="border border-gray-300 bg-white">
                <div className="flex flex-col justify-center h-full items-center">
                  <h1 className="text-2xl font-extrabold text-blue-900 tracking-wide">ON JOB TRAINING SHEET</h1>
                </div>
              </td>
              <td className="border border-gray-300 font-semibold bg-gray-50">Revision Date</td>
              <td className="border border-gray-300 bg-white" colSpan={3}>{trainee?.revision_date}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 font-semibold bg-gray-50">TRAINEE NAME :</td>
              <td className="border border-gray-300 bg-white">{trainee?.trainee_name}</td>
              <td className="border border-gray-300 font-semibold bg-gray-50">TRAINER :</td>
              <td className="border border-gray-300 bg-white">
                <input type="text" className="w-full p-1" placeholder="Enter trainer name" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 font-semibold bg-gray-50">EMP NO. :</td>
              <td className="border border-gray-300 bg-white">{trainee?.traineeId}</td>
              <td className="border border-gray-300 font-semibold bg-gray-50">LINE :</td>
              <td className="border border-gray-300 bg-white">{currentLineName}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 font-semibold bg-gray-50">D.O.J. :</td>
              <td className="border border-gray-300 bg-white" colSpan={3}>{dojValue}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 text-center font-semibold p-2 bg-blue-50" colSpan={7}>
                PROCESS NAME: {currentStationName}
              </td>
            </tr>
            <tr className="bg-gray-100">
              <th className="border border-gray-300" rowSpan={2}>DAYS</th>
              <th className="border border-gray-300" rowSpan={2}>DATE</th>
              <th className="border border-gray-300 text-blue-900" colSpan={3}>Production</th>
              <th className="border border-gray-300 text-blue-900" colSpan={2}>QUALITY</th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border border-gray-300">PLAN</th>
              <th className="border border-gray-300">ACT.</th>
              <th className="border border-gray-300">Marks</th>
              <th className="border border-gray-300">NO. OF REJ.</th>
              <th className="border border-gray-300">Marks</th>
            </tr>
            {dailyScores.map((dayScore, index) => (
              <tr key={dayScore.day}>
                <td className="border border-gray-300">{dayScore.day}</td>
                <td className="border border-gray-300">
                  <input type="date" className="w-full p-1" onChange={(e) => handleInputChange(index, 'date', e.target.value)} />
                </td>
                <td className="border border-gray-300">
                  <input type="number" className="w-full p-1" placeholder="0" onChange={(e) => handleInputChange(index, 'plan', e.target.value)} />
                </td>
                <td className="border border-gray-300">
                  <input type="number" className="w-full p-1" placeholder="0" onChange={(e) => handleInputChange(index, 'actual', e.target.value)} />
                </td>
                <td className="border border-gray-300 font-bold text-blue-600">{dayScore.production_marks}</td>
                <td className="border border-gray-300">
                  <input type="number" className="w-full p-1" placeholder="0" onChange={(e) => handleInputChange(index, 'rejections', e.target.value)} />
                </td>
                <td className="border border-gray-300 font-bold text-blue-600">{dayScore.quality_marks}</td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td className="border border-gray-300" colSpan={4}>Total Marks</td>
              <td className="border border-gray-300 text-blue-700">{totalProductionMarks}</td>
              <td className="border border-gray-300">Total Marks</td>
              <td className="border border-gray-300 text-blue-700">{totalQualityMarks}</td>
            </tr>
            <tr className="bg-yellow-50 font-bold text-lg">
              <td className="border border-gray-300 p-2" colSpan={5}>OVERALL RESULT:</td>
              <td className="border border-gray-300 p-2 text-green-600" colSpan={2}>{overallResult}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => alert("Data saved Successfully")}
            className="bg-blue-600 text-white px-12 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition"
          >
            Submit Data
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnJobTraining