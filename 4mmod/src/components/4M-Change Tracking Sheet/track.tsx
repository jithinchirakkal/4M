import React, { useState, useEffect, useRef } from "react";
import SuccessModal from '../Common/SuccessModal';

type TrackingStatus = "noplan" | "nochange" | "change";


interface PageProps {
  setSelectedModule: (id: string) => void;
}

interface FourMChangeRecord {
  id: number;
  record_id: string;
  date: string;
  time: string;
  four_m: string;
  shift: string;
  category_details?: {
    category_type: string;
    description: string;
  };
  action_details?: {
    action_taken: string;
    set_up_approval: boolean;
    retroactive_inspection: boolean;
    suspected_lot_check: boolean;
    containment_action: boolean;
    remarks: string;
  };
  shopfloor_name?: string;
  line_name?: string;
  station_name?: string;
}

interface TrackingCell {
  day: number;
  statusA: TrackingStatus;
  statusB: TrackingStatus;
  hasChangeA: boolean;
  hasChangeB: boolean;
}

interface ChangeDetailRow {
  id?: number;
  record_id: string;
  date: string;
  shift: string;
  time: string;
  model: string;
  station: string;
  line: string;
  nature_of_change: string;
  category_type: string;
  change_description: string;
  informed_maintenance: boolean;
  informed_quality: boolean;
  informed_production: boolean;
  informed_others: boolean;
  customer_approval_required: boolean;
  action_taken: string;
  applicability_retro: boolean;
  applicability_setup: boolean;
  applicability_containment: boolean;
  setup_total_qty: string;
  setup_ok_qty: string;
  setup_ng_qty: string;
  retrocheck_total_qty: string;
  retrocheck_ok_qty: string;
  retrocheck_ng_qty: string;
  containmentcheck_total_qty: string;
  containmentcheck_ok_qty: string;
  containmentcheck_ng_qty: string;
  traceability: string;
  action_taken_on_ng_parts: string;
  production_approval: string;
  quality_approval: string;
}

const categories = [
  { id: 1, name: "MAN" },
  { id: 2, name: "MACHINE" },
  { id: 3, name: "MATERIAL" },
  { id: 4, name: "METHOD" }
];

const dayColumns = Array.from({ length: 31 }, (_, i) => i + 1);

const fourMToCategoryMap: { [key: string]: string } = {
  'Man': 'MAN',
  'Machine/Tool': 'MACHINE',
  'Material': 'MATERIAL',
  'Method': 'METHOD'
};

const TruncatedTextCell: React.FC<{ text: string; maxWidth?: string }> = ({ text, maxWidth }) => {
  return (
    <div 
      className="w-full text-left overflow-hidden" 
      style={{ maxWidth: maxWidth || '100%', height: '40px', lineHeight: '20px' }}
      title={text}
    >
      <div className="line-clamp-2">
        {text || '-'}
      </div>
    </div>
  );
};

// export default function FourMChangeTrackingSheet() {
const FourMChangeTrackingSheet: React.FC<PageProps> = ({ setSelectedModule }) => {
  const detailsTableRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: React.ReactNode;
  } | null>(null);

  const [month, setMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [filterId, setFilterId] = useState<string>(''); // NEW

  const [fourMChanges, setFourMChanges] = useState<FourMChangeRecord[]>([]);
  const [trackingMatrix, setTrackingMatrix] = useState<TrackingCell[][]>([]);
  const [changeDetailRows, setChangeDetailRows] = useState<ChangeDetailRow[]>([]);
  const [allChangeDetailRows, setAllChangeDetailRows] = useState<ChangeDetailRow[]>([]);
  
  const [filterDate, setFilterDate] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [filterShopfloor, setFilterShopfloor] = useState('');
  const [filterLine, setFilterLine] = useState('');
  const [filterStation, setFilterStation] = useState('');
  
  const [shopfloors, setShopfloors] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // NEW EFFECT: Catch ID from Detail Page
  useEffect(() => {
    const passedId = localStorage.getItem("filter_change_request_id");
    if (passedId) {
      console.log("Auto-filtering for Record ID:", passedId);
      setFilterId(passedId);
      localStorage.removeItem("filter_change_request_id");
      
      // Auto-scroll to details table
      setTimeout(() => {
        detailsTableRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/shopfloors/')
      .then(res => res.json())
      .then(data => setShopfloors(data))
      .catch(err => console.error('Error fetching shopfloors:', err));
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('http://127.0.0.1:8000/api/4m-changes/').then(res => res.json()),
      fetch('http://127.0.0.1:8000/api/change-details/').then(res => res.json())
    ])
      .then(([changesData, detailsData]) => {
        setFourMChanges(changesData);
        processTrackingMatrix(changesData, month);
        processChangeDetails(changesData, detailsData, month);
      })
      .catch(err => console.error('Error fetching data:', err));
  }, [month]);

  useEffect(() => {
    if (filterShopfloor) {
      fetch(`http://127.0.0.1:8000/api/lines/?shopfloor=${filterShopfloor}`)
        .then(res => res.json())
        .then(data => setLines(data))
        .catch(err => console.error('Error fetching lines:', err));
    } else {
      setLines([]);
      setFilterLine('');
    }
  }, [filterShopfloor]);

  useEffect(() => {
    if (filterLine) {
      fetch(`http://127.0.0.1:8000/api/stations/?line=${filterLine}`)
        .then(res => res.json())
        .then(data => setStations(data))
        .catch(err => console.error('Error fetching stations:', err));
    } else {
      setStations([]);
      setFilterStation('');
    }
  }, [filterLine]);

  useEffect(() => {
    let filtered = [...allChangeDetailRows];

    // --- NEW: Filter by specific ID first ---
    if (filterId) {
      filtered = filtered.filter(row => row.record_id.toLowerCase().includes(filterId.toLowerCase()));
    }

    if (filterDate) {
      filtered = filtered.filter(row => row.date === filterDate);
    }

    if (filterShift) {
      filtered = filtered.filter(row => row.shift === filterShift);
    }

    if (filterShopfloor || filterLine || filterStation) {
      filtered = filtered.filter(row => {
        const originalChange = fourMChanges.find(
          change => change.record_id === row.record_id
        );
        if (!originalChange) return true;
        
        const getSFName = (id: string) => shopfloors.find(s => s.id === parseInt(id))?.name;
        const getLineName = (id: string) => lines.find(l => l.id === parseInt(id))?.name;
        const getStationName = (id: string) => stations.find(s => s.id === parseInt(id))?.name;

        if (filterShopfloor && originalChange.shopfloor_name !== getSFName(filterShopfloor)) {
          return false;
        }
        if (filterLine && originalChange.line_name !== getLineName(filterLine)) {
          return false;
        }
        if (filterStation && originalChange.station_name !== getStationName(filterStation)) {
          return false;
        }
        return true;
      });
    }

    setChangeDetailRows(filtered);
  }, [
    filterId,
    filterDate, filterShift, filterShopfloor, filterLine, filterStation, allChangeDetailRows, fourMChanges, shopfloors, lines, stations
  ]);

  const clearFilters = () => {
    setFilterDate('');
    setFilterShift('');
    setFilterShopfloor('');
    setFilterLine('');
    setFilterStation('');
  };

  const processTrackingMatrix = (changes: FourMChangeRecord[], selectedMonth: string) => {
    const matrix: TrackingCell[][] = [];
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    categories.forEach((category) => {
      const categoryRow: TrackingCell[] = [];

      const categoryChanges = changes.filter(change => {
        if (!change.date) return false;
        const changeDate = new Date(change.date);
        const changeDateStr = `${changeDate.getFullYear()}-${String(changeDate.getMonth() + 1).padStart(2, "0")}`;
        const mappedCategory = fourMToCategoryMap[change.four_m] || change.four_m.toUpperCase();
        return changeDateStr === selectedMonth && mappedCategory === category.name;
      });

      dayColumns.forEach(day => {
        const dayChangesA = categoryChanges.filter(c => new Date(c.date).getDate() === day && c.shift === 'A');
        const dayChangesB = categoryChanges.filter(c => new Date(c.date).getDate() === day && c.shift === 'B');

        let statusA: TrackingStatus = "noplan";
        let statusB: TrackingStatus = "noplan";
        let hasChangeA = false;
        let hasChangeB = false;

        if (dayChangesA.length > 0) {
          statusA = "change";
          hasChangeA = true;
        } else {
          if (selectedMonth === currentMonth) {
            statusA = day <= currentDay ? "nochange" : "noplan";
          } else if (selectedMonth < currentMonth) {
            statusA = "nochange";
          } else {
            statusA = "noplan";
          }
        }

        if (dayChangesB.length > 0) {
          statusB = "change";
          hasChangeB = true;
        } else {
          if (selectedMonth === currentMonth) {
            statusB = day <= currentDay ? "nochange" : "noplan";
          } else if (selectedMonth < currentMonth) {
            statusB = "nochange";
          } else {
            statusB = "noplan";
          }
        }

        categoryRow.push({ day, statusA, statusB, hasChangeA, hasChangeB });
      });

      matrix.push(categoryRow);
    });

    setTrackingMatrix(matrix);
  };

  const processChangeDetails = (changes: FourMChangeRecord[], savedDetails: any[], selectedMonth: string) => {
    const filteredChanges = changes.filter(change => {
      if (!change.date) return false;
      const changeDate = new Date(change.date);
      const changeDateStr = `${changeDate.getFullYear()}-${String(changeDate.getMonth() + 1).padStart(2, "0")}`;
      return changeDateStr === selectedMonth;
    });

    const savedDetailsMap = new Map();
    savedDetails.forEach(detail => {
      const key = `${detail.record_id}_${detail.date}_${detail.time}_${detail.shift || 'A'}`;
      savedDetailsMap.set(key, detail);
    });

    const detailRows: ChangeDetailRow[] = filteredChanges.map(change => {
      const key = `${change.record_id}_${change.date}_${change.time}_${change.shift || 'A'}`;
      const savedDetail = savedDetailsMap.get(key);

      if (savedDetail) {
        return {
          id: savedDetail.id,
          record_id: savedDetail.record_id || change.record_id || '',
          date: savedDetail.date || change.date || '',
          shift: savedDetail.shift || change.shift || 'A',
          time: savedDetail.time || change.time || '',
          model: savedDetail.model || '',
          station: savedDetail.station || change.station_name || '',
          line: savedDetail.line || change.line_name || '',
          nature_of_change: savedDetail.nature_of_change || change.four_m || '',
          category_type: savedDetail.category_type || change.category_details?.category_type || '',
          change_description: savedDetail.change_description || change.category_details?.description || '',
          informed_maintenance: savedDetail.informed_maintenance || false,
          informed_quality: savedDetail.informed_quality || false,
          informed_production: savedDetail.informed_production || false,
          informed_others: savedDetail.informed_others || false,
          customer_approval_required: savedDetail.customer_approval_required || false,
          action_taken: savedDetail.action_taken || change.action_details?.action_taken || '',
          applicability_retro: savedDetail.applicability_retro || false,
          applicability_setup: savedDetail.applicability_setup || false,
          applicability_containment: savedDetail.applicability_containment || false,
          setup_total_qty: savedDetail.setup_total_qty || '',
          setup_ok_qty: savedDetail.setup_ok_qty || '',
          setup_ng_qty: savedDetail.setup_ng_qty || '',
          retrocheck_total_qty: savedDetail.retrocheck_total_qty || '',
          retrocheck_ok_qty: savedDetail.retrocheck_ok_qty || '',
          retrocheck_ng_qty: savedDetail.retrocheck_ng_qty || '',
          containmentcheck_total_qty: savedDetail.containmentcheck_total_qty || '',
          containmentcheck_ok_qty: savedDetail.containmentcheck_ok_qty || '',
          containmentcheck_ng_qty: savedDetail.containmentcheck_ng_qty || '',
          traceability: savedDetail.traceability || '',
          action_taken_on_ng_parts: savedDetail.action_taken_on_ng_parts || '',
          production_approval: savedDetail.production_approval || '',
          quality_approval: savedDetail.quality_approval || '',
        };
      } else {
        return {
          record_id: change.record_id || '',
          date: change.date || '',
          shift: change.shift || 'A',
          time: change.time || '',
          model: '',
          station: change.station_name || '',
          line: change.line_name || '',
          nature_of_change: change.four_m || '',
          category_type: change.category_details?.category_type || '',
          change_description: change.category_details?.description || '',
          informed_maintenance: false,
          informed_quality: false,
          informed_production: false,
          informed_others: false,
          customer_approval_required: false,
          action_taken: change.action_details?.action_taken || '',
          applicability_retro: change.action_details?.retroactive_inspection || false,
          applicability_setup: change.action_details?.set_up_approval || false,
          applicability_containment: change.action_details?.containment_action || false,
          setup_total_qty: '',
          setup_ok_qty: '',
          setup_ng_qty: '',
          retrocheck_total_qty: '',
          retrocheck_ok_qty: '',
          retrocheck_ng_qty: '',
          containmentcheck_total_qty: '',
          containmentcheck_ok_qty: '',
          containmentcheck_ng_qty: '',
          traceability: '',
          action_taken_on_ng_parts: '',
          production_approval: '',
          quality_approval: '',
        };
      }
    });

    setChangeDetailRows(detailRows);
    setAllChangeDetailRows(detailRows);
  };

  const handleDetailInput = (
    rowIdx: number,
    field: keyof ChangeDetailRow,
    value: string | boolean
  ) => {
    const newDetails = [...changeDetailRows];
    newDetails[rowIdx] = { ...newDetails[rowIdx], [field]: value };
    setChangeDetailRows(newDetails);
  };

  const submitChangeDetails = async () => {
    setMessage(null);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < changeDetailRows.length; i++) {
      const row = changeDetailRows[i];
      if (row.date && row.time) {
        try {
          if (row.id) {
            await fetch(`http://127.0.0.1:8000/api/change-details/${row.id}/`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(row),
            });
          } else {
            const res = await fetch('http://127.0.0.1:8000/api/change-details/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(row),
            });
            const data = await res.json();
            changeDetailRows[i].id = data.id;
          }
          successCount++;
        } catch (err: any) {
          console.error(`Error submitting data for record ${row.record_id}:`, err);
          errorCount++;
        }
      }
    }
    setChangeDetailRows([...changeDetailRows]);

    if (errorCount > 0) {
      setMessage({ text: `Submission completed with ${errorCount} errors...`, type: 'error' });
    } else if (successCount > 0) {
      setShowSuccessModal(true);
    } else {
       // No changes made or no rows to submit
       setMessage({ text: "No changes to submit.", type: 'error' });
       setTimeout(() => setMessage(null), 3000);
    }
    // if (errorCount === 0) {
    //     // CHECK FOR RETURN FLAG
    //     const returnId = localStorage.getItem("return_to_detail_id");
        
    //     // If we are filtering by the specific ID that we need to return to
    //     if (returnId && filterId === returnId) {
    //          setTimeout(() => {
    //              // Navigate back to Main View (which will auto-open the detail)
    //              setSelectedModule("cm"); 
    //          }, 1000); // Small delay so user sees "Success" message first
    //     }
    // }
    
    // if (errorCount > 0) {
    //   setMessage({ text: `Submission completed with ${errorCount} errors. Check console for details.`, type: 'error' });
    // } else {
    //   setMessage({ text: "Change details submitted successfully!", type: 'success' });
    // }
    // setTimeout(() => setMessage(null), 5000);
  };

  const handleReturn = () => {
      setShowSuccessModal(false);
      const returnId = localStorage.getItem("return_to_detail_id");
      if (returnId && filterId === returnId) {
          setSelectedModule("cm");
      }
      // If not returning, just stay on page (modal closed)
  };

  const getStatusBg = (status: TrackingStatus) =>
    status === "nochange"
      ? "bg-green-500"
      : status === "change"
        ? "bg-red-500"
        : "bg-blue-100";

  const getChangesForCell = (categoryName: string, day: number, shift: string): FourMChangeRecord[] => {
    const [year, monthStr] = month.split('-');
    const dateString = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;

    return fourMChanges.filter(change => {
      const changeDate = change.date.split('T')[0] || change.date;
      if (changeDate !== dateString) return false;

      const changeCategory = fourMToCategoryMap[change.four_m] || change.four_m.toUpperCase();
      return categoryName === changeCategory && change.shift === shift;
    });
  };
  
  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    categoryName: string,
    day: number,
    shift: string
  ) => {
    const changes = getChangesForCell(categoryName, day, shift);
    if (changes.length === 0) return;

    const content = (
      <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-xl text-xs max-w-xs ring-2 ring-red-200">
        <h4 className="font-bold text-sm mb-1 text-red-600">
          {categoryName} Changes - Shift {shift} on {month.split('-')[1]}/{day}
        </h4>
        <ul className="list-disc list-inside space-y-1">
          {changes.slice(0, 3).map((change, index) => (
            <li key={index} className="text-gray-700">
              <span className="font-medium">{change.four_m}</span> at {change.time}: "{change.category_details?.description.substring(0, 30) || 'N/A'}..."
            </li>
          ))}
        </ul>
        {changes.length > 3 && <p className="text-gray-500 mt-1 italic">...{changes.length - 3} more changes</p>}
        <p className="text-red-500 mt-2 font-semibold text-center">Click the red dot to drill down to details ↓</p>
      </div>
    );

    setTooltip({
      x: e.clientX + 10,
      y: e.clientY + 10,
      content,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };
  
  const handleClickCell = (day: number, shift: string) => {
    const [year, monthStr] = month.split('-');
    const dateString = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;

    setFilterDate(dateString);
    setFilterShift(shift);
    setFilterShopfloor(''); 
    setFilterLine('');
    setFilterStation('');

    setTimeout(() => {
      detailsTableRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100); 
    setTooltip(null);
  };

  const CheckboxCell = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <div className="flex items-center justify-center h-full">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
    </div>
  );

  return (
    <div className="max-w-full min-h-screen p-6 relative">

      {/* ✅ ADD THIS MODAL BLOCK */}
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={handleReturn}
        title="Tracking Sheet Saved"
        message={
          <span>
            The 4M Change Tracking Sheet details have been successfully updated.
            {filterId && <span> Returning to main view...</span>}
          </span>
        }
      />
      <div className="max-w-full">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl shadow-xl mb-6">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl md:text-3xl font-bold">4M CHANGE RECORDING SHEET</h1>
              </div>
            </div>
          </div>
        </div>
        
        {message && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-2xl transition-opacity duration-300 ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            <p className="font-semibold">{message.text}</p>
          </div>
        )}

        {filterId && (
          <div className="mb-4 bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center justify-between">
              <span className="text-blue-800 font-medium text-sm">
                  Filtering Details for Record: <strong>{filterId}</strong>
              </span>
              <button 
                  onClick={() => setFilterId('')}
                  className="text-xs bg-white text-blue-600 px-3 py-1 rounded border border-blue-200 hover:bg-blue-100"
              >
                  Clear Filter
              </button>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg shadow-inner bg-white mb-8">
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead className="sticky top-0 z-10 bg-indigo-50">
              <tr className="text-center">
                <th className="border border-gray-300 p-2 w-10" rowSpan={3}>No.</th>
                <th className="border border-gray-300 p-2 w-28" rowSpan={3}>Category</th>
                <th className="border border-gray-300 p-2 w-16" rowSpan={3}>Shift</th>
                <th colSpan={31} className="border border-gray-300 p-2">
                  <span className="font-semibold">Month:</span>
                  <input
                    type="month"
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    className="ml-2 border border-indigo-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-300 transition"
                  />
                </th>
                <th className="border border-gray-300 p-2 w-40" rowSpan={3}>Remarks</th>
              </tr>
              <tr className="text-center h-8">
                {dayColumns.map(day => (
                  <th key={day} className="border border-gray-300 p-0 w-6 font-normal text-xs">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category, catIndex) => (
                <React.Fragment key={category.id}>
                  <tr className="text-center h-10 hover:bg-indigo-50 transition">
                    <td className="border border-gray-200 font-semibold" rowSpan={2}>{category.id}</td>
                    <td className="border border-gray-200 font-medium" rowSpan={2}>{category.name}</td>
                    <td className="border border-gray-200 bg-yellow-50 font-medium">A</td>
                    {trackingMatrix[catIndex] &&
                      trackingMatrix[catIndex].map((cell, dayIndex) => (
                        <td key={`${dayIndex}-A`} className="border border-gray-200 p-0">
                          <div
                            className={`w-5 h-5 rounded-full border-2 mx-auto transition-all duration-150
                              ${getStatusBg(cell.statusA)}
                              ${cell.statusA === "change" ? "border-red-400 cursor-pointer" : cell.statusA === "nochange" ? "border-green-400" : "border-blue-200"}`}
                            onClick={cell.hasChangeA ? () => handleClickCell(cell.day, 'A') : undefined}
                            onMouseEnter={cell.hasChangeA ? (e) => handleMouseEnter(e, category.name, cell.day, 'A') : undefined}
                            onMouseLeave={cell.hasChangeA ? handleMouseLeave : undefined}
                          ></div>
                        </td>
                      ))}
                    <td className="border border-gray-200 text-left pl-2" rowSpan={2}>
                      {catIndex === 0 && (<div className="font-medium text-gray-700">Legends:</div>)}
                      {catIndex === 1 && (<div className="flex items-center gap-2 text-xs md:text-sm">
                          <span className="inline-block w-4 h-4 rounded-full border border-green-600 bg-green-500"></span>
                          <span className="text-gray-600">No Change</span>
                      </div>)}
                      {catIndex === 2 && (<div className="flex items-center gap-2 text-xs md:text-sm">
                          <span className="inline-block w-4 h-4 rounded-full border border-red-600 bg-red-500"></span>
                          <span className="text-gray-600">Change (Click)</span>
                      </div>)}
                      {catIndex === 3 && (<div className="flex items-center gap-2 text-xs md:text-sm">
                          <span className="inline-block w-4 h-4 rounded-full border border-blue-400 bg-blue-100"></span>
                          <span className="text-gray-600">No Plan</span>
                      </div>)}
                    </td>
                  </tr>
                  <tr className="text-center h-10 hover:bg-indigo-50 transition">
                    <td className="border border-gray-200 bg-indigo-50 font-medium">B</td>
                    {trackingMatrix[catIndex] &&
                      trackingMatrix[catIndex].map((cell, dayIndex) => (
                        <td key={`${dayIndex}-B`} className="border border-gray-200 p-0">
                          <div
                            className={`w-5 h-5 rounded-full border-2 mx-auto transition-all duration-150
                              ${getStatusBg(cell.statusB)}
                              ${cell.statusB === "change" ? "border-red-400 cursor-pointer" : cell.statusB === "nochange" ? "border-green-400" : "border-blue-200"}`}
                            onClick={cell.hasChangeB ? () => handleClickCell(cell.day, 'B') : undefined}
                            onMouseEnter={cell.hasChangeB ? (e) => handleMouseEnter(e, category.name, cell.day, 'B') : undefined}
                            onMouseLeave={cell.hasChangeB ? handleMouseLeave : undefined}
                          ></div>
                        </td>
                      ))}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 mb-2" ref={detailsTableRef}>
          <div className="w-full text-center font-bold text-lg p-2 border-t-2 border-b-2 border-indigo-300 bg-indigo-50 rounded-t-lg">
            4M CHANGE RECORDING SHEET - DETAILS
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Date
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={e => setFilterDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition"
                />
              </div>
              
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Shift
                </label>
                <select
                  value={filterShift}
                  onChange={e => setFilterShift(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition"
                >
                  <option value="">All Shifts</option>
                  <option value="A">Shift A</option>
                  <option value="B">Shift B</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Shopfloor
                </label>
                <select
                  value={filterShopfloor}
                  onChange={e => setFilterShopfloor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition"
                >
                  <option value="">All Shopfloors</option>
                  {shopfloors.map(sf => (
                    <option key={sf.id} value={sf.id}>{sf.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Line
                </label>
                <select
                  value={filterLine}
                  onChange={e => setFilterLine(e.target.value)}
                  disabled={!filterShopfloor}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
                >
                  <option value="">All Lines</option>
                  {lines.map(line => (
                    <option key={line.id} value={line.id}>{line.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Station
                </label>
                <select
                  value={filterStation}
                  onChange={e => setFilterStation(e.target.value)}
                  disabled={!filterLine}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
                >
                  <option value="">All Stations</option>
                  {stations.map(station => (
                    <option key={station.id} value={station.id}>{station.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            
            <div className="mt-3 text-sm text-gray-600">
              Showing {changeDetailRows.length} of {allChangeDetailRows.length} records
            </div>
          </div>

          <div className="flex justify-end mb-3">
            <button
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700 font-semibold transition"
              onClick={submitChangeDetails}
            >
              Submit Change Details
            </button>
          </div>
          
          <div className="overflow-x-auto rounded-lg shadow-inner bg-white border border-gray-200">
            <table className="border-collapse text-xs w-full" style={{ minWidth: '3500px' }}>
              <thead className="bg-indigo-50 sticky top-0 z-10">
                <tr className="text-center border border-gray-300">
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[100px]" rowSpan={3}>Record ID</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[90px]" rowSpan={3}>Date</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={3}>Shift</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[70px]" rowSpan={3}>Time</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[100px]" rowSpan={3}>Model</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[100px]" rowSpan={3}>Station</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[100px]" rowSpan={3}>Line</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[120px]" colSpan={2}>Nature of Change</th>
                  <th className="border border-gray-300 p-2 w-[200px]" rowSpan={3}>Change Details</th>
                  <th className="border border-gray-300 p-2" colSpan={5}>Informed To</th>
                  <th className="border border-gray-300 p-2 w-[180px]" rowSpan={3}>Action Taken</th>
                  <th className="border border-gray-300 p-2" colSpan={3}>Applicability</th>
                  <th className="border border-gray-300 p-2" colSpan={3}>Setup</th>
                  <th className="border border-gray-300 p-2" colSpan={3}>Retro Check<br/>(Before Change)</th>
                  <th className="border border-gray-300 p-2" colSpan={3}>Containment Check<br/>(After Change)</th>
                  <th className="border border-gray-300 p-2 w-[150px]" rowSpan={3}>Traceability<br/>(PSN No./Date & Time)</th>
                  <th className="border border-gray-300 p-2 w-[150px]" rowSpan={3}>Action Taken on<br/>NG Parts</th>
                  <th className="border border-gray-300 p-2 w-[120px]" rowSpan={3}>Production<br/>Approval</th>
                  <th className="border border-gray-300 p-2 w-[120px]" rowSpan={3}>Quality<br/>Approval</th>
                </tr>
                <tr className="text-center border border-gray-300">
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[80px]" rowSpan={2}>Man/Machine/<br/>Material/Method</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[80px]" rowSpan={2}>Planned/<br/>Unplanned/<br/>Abnormality</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Maint.</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Quality</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Production</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Others</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[80px]" rowSpan={2}>Customer<br/>Approval<br/>Required</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Retro</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Set Up</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[80px]" rowSpan={2}>Containment</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Total<br/>Qty</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>OK<br/>Qty</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>NG<br/>Qty</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Total<br/>Qty</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>OK<br/>Qty</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>NG<br/>Qty</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Total<br/>Qty</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>OK<br/>Qty</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>NG<br/>Qty</th>
                </tr>
              </thead>
              <tbody>
                {changeDetailRows.length === 0 ? (
                  <tr>
                    <td colSpan={35} className="text-center text-gray-500 py-4">
                      No change details available for the selected filters
                    </td>
                  </tr>
                ) : (
                  changeDetailRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-indigo-50 transition">
                      
                      {/* Record ID */}
                      <td className="border border-gray-200 p-2 align-top">
                        <div className="whitespace-pre-wrap break-words max-w-[100px] text-center mx-auto">
                          {row.record_id}
                        </div>
                      </td>
                      
                      {/* Date */}
                      <td className="border border-gray-200 p-1">
                        <div className="flex items-center justify-center h-full">
                          <input
                            type="date"
                            value={row.date}
                            onChange={e => handleDetailInput(rowIdx, 'date', e.target.value)}
                            className="w-full p-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
                          />
                        </div>
                      </td>
                      
                      {/* Shift */}
                      <td className="border border-gray-200 p-1">
                        <div className="flex items-center justify-center h-full">
                          <select
                            value={row.shift}
                            onChange={e => handleDetailInput(rowIdx, 'shift', e.target.value)}
                            className="w-full p-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                          </select>
                        </div>
                      </td>
                      
                      {/* Time */}
                      <td className="border border-gray-200 p-1">
                        <div className="flex items-center justify-center h-full">
                          <input
                            type="time"
                            value={row.time}
                            onChange={e => handleDetailInput(rowIdx, 'time', e.target.value)}
                            className="w-full p-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
                          />
                        </div>
                      </td>
                      
                      {/* Model */}
                      <td className="border border-gray-200 p-1">
                        <div className="flex items-center justify-center h-full">
                          <input
                            type="text"
                            value={row.model}
                            onChange={e => handleDetailInput(rowIdx, 'model', e.target.value)}
                            className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
                          />
                        </div>
                      </td>
                      
                      {/* Station */}
                      <td className="border border-gray-200 p-1">
                        <div className="flex items-center justify-center h-full">
                          <input
                            type="text"
                            value={row.station}
                            onChange={e => handleDetailInput(rowIdx, 'station', e.target.value)}
                            className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
                          />
                        </div>
                      </td>
                      
                      {/* Line */}
                      <td className="border border-gray-200 p-1">
                        <div className="flex items-center justify-center h-full">
                          <input
                            type="text"
                            value={row.line}
                            onChange={e => handleDetailInput(rowIdx, 'line', e.target.value)}
                            className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
                          />
                        </div>
                      </td>
                      
                      {/* Nature of Change - Man/Machine/Material/Method */}
                      <td className="border border-gray-200 p-1">
                        <div className="flex items-center justify-center h-full">
                          <select
                            value={row.nature_of_change}
                            onChange={e => handleDetailInput(rowIdx, 'nature_of_change', e.target.value)}
                            className="w-full p-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
                          >
                            <option value="">Select</option>
                            <option value="Man">Man</option>
                            <option value="Machine/Tool">Machine</option>
                            <option value="Material">Material</option>
                            <option value="Method">Method</option>
                          </select>
                        </div>
                      </td>
                      
                      {/* Category Type - Planned/Unplanned/Abnormal */}
                      <td className="border border-gray-200 p-1">
                        <div className="flex items-center justify-center h-full">
                          <select
                            value={row.category_type}
                            onChange={e => handleDetailInput(rowIdx, 'category_type', e.target.value)}
                            className="w-full p-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
                          >
                            <option value="">Select</option>
                            <option value="Planned">Planned</option>
                            <option value="Unplanned">Unplanned</option>
                            <option value="Abnormal">Abnormal</option>
                          </select>
                        </div>
                      </td>
                      
                      {/* Change Description */}
                      <td className="border border-gray-200 p-2 align-top">
                        <textarea
                          value={row.change_description}
                          onChange={e => handleDetailInput(rowIdx, 'change_description', e.target.value)}
                          className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition resize-none text-xs"
                          rows={2}
                        />
                      </td>
                      
                      {/* Informed To - Maintenance */}
                      <td className="border border-gray-200 p-1">
                        <CheckboxCell 
                          checked={row.informed_maintenance} 
                          onChange={() => handleDetailInput(rowIdx, 'informed_maintenance', !row.informed_maintenance)} 
                        />
                      </td>
                      
                      {/* Informed To - Quality */}
                      <td className="border border-gray-200 p-1">
                        <CheckboxCell 
                          checked={row.informed_quality} 
                          onChange={() => handleDetailInput(rowIdx, 'informed_quality', !row.informed_quality)} 
                        />
                      </td>
                      
                      {/* Informed To - Production */}
                      <td className="border border-gray-200 p-1">
                        <CheckboxCell 
                          checked={row.informed_production} 
                          onChange={() => handleDetailInput(rowIdx, 'informed_production', !row.informed_production)} 
                        />
                      </td>
                      
                      {/* Informed To - Others */}
                      <td className="border border-gray-200 p-1">
                        <CheckboxCell 
                          checked={row.informed_others} 
                          onChange={() => handleDetailInput(rowIdx, 'informed_others', !row.informed_others)} 
                        />
                      </td>
                      
                      {/* Customer Approval Required */}
                      <td className="border border-gray-200 p-1">
                        <CheckboxCell 
                          checked={row.customer_approval_required} 
                          onChange={() => handleDetailInput(rowIdx, 'customer_approval_required', !row.customer_approval_required)} 
                        />
                      </td>
                      
                      {/* Action Taken */}
                      <td className="border border-gray-200 p-2 align-top">
                        <textarea
                          value={row.action_taken}
                          onChange={e => handleDetailInput(rowIdx, 'action_taken', e.target.value)}
                          className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition resize-none text-xs"
                          rows={2}
                        />
                      </td>
                      
                      {/* Applicability - Retro */}
                      <td className="border border-gray-200 p-1">
                        <CheckboxCell 
                          checked={row.applicability_retro} 
                          onChange={() => handleDetailInput(rowIdx, 'applicability_retro', !row.applicability_retro)} 
                        />
                      </td>
                      
                      {/* Applicability - Setup */}
                      <td className="border border-gray-200 p-1">
                        <CheckboxCell 
                          checked={row.applicability_setup} 
                          onChange={() => handleDetailInput(rowIdx, 'applicability_setup', !row.applicability_setup)} 
                        />
                      </td>
                      
                      {/* Applicability - Containment */}
                      <td className="border border-gray-200 p-1">
                        <CheckboxCell 
                          checked={row.applicability_containment} 
                          onChange={() => handleDetailInput(rowIdx, 'applicability_containment', !row.applicability_containment)} 
                        />
                      </td>
                      
                      {/* Setup - Total Qty, OK Qty, NG Qty */}
                      {(['setup_total_qty', 'setup_ok_qty', 'setup_ng_qty'] as const).map(field => (
                        <td key={field} className="border border-gray-200 p-1">
                          <div className="flex items-center justify-center h-full">
                            <input
                              type="text"
                              value={row[field]}
                              onChange={e => handleDetailInput(rowIdx, field, e.target.value)}
                              className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
                            />
                          </div>
                        </td>
                      ))}
                      
                      {/* Retro Check - Total Qty, OK Qty, NG Qty */}
                      {(['retrocheck_total_qty', 'retrocheck_ok_qty', 'retrocheck_ng_qty'] as const).map(field => (
                        <td key={field} className="border border-gray-200 p-1">
                          <div className="flex items-center justify-center h-full">
                            <input
                              type="text"
                              value={row[field]}
                              onChange={e => handleDetailInput(rowIdx, field, e.target.value)}
                              className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
                            />
                          </div>
                        </td>
                      ))}
                      
                      {/* Containment Check - Total Qty, OK Qty, NG Qty */}
                      {(['containmentcheck_total_qty', 'containmentcheck_ok_qty', 'containmentcheck_ng_qty'] as const).map(field => (
                        <td key={field} className="border border-gray-200 p-1">
                          <div className="flex items-center justify-center h-full">
                            <input
                              type="text"
                              value={row[field]}
                              onChange={e => handleDetailInput(rowIdx, field, e.target.value)}
                              className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
                            />
                          </div>
                        </td>
                      ))}
                      
                      {/* Traceability */}
                      <td className="border border-gray-200 p-1">
                        <div className="flex items-center justify-center h-full">
                          <input
                            type="text"
                            value={row.traceability}
                            onChange={e => handleDetailInput(rowIdx, 'traceability', e.target.value)}
                            className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
                          />
                        </div>
                      </td>
                      
                      {/* Action Taken on NG Parts */}
                      <td className="border border-gray-200 p-1">
                        <div className="flex items-center justify-center h-full">
                          <input
                            type="text"
                            value={row.action_taken_on_ng_parts}
                            onChange={e => handleDetailInput(rowIdx, 'action_taken_on_ng_parts', e.target.value)}
                            className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
                          />
                        </div>
                      </td>
                      
                      {/* Production Approval */}
                      <td className="border border-gray-200 p-1">
                        <div className="flex items-center justify-center h-full">
                          <input
                            type="text"
                            value={row.production_approval}
                            onChange={e => handleDetailInput(rowIdx, 'production_approval', e.target.value)}
                            className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
                          />
                        </div>
                      </td>
                      
                      {/* Quality Approval */}
                      <td className="border border-gray-200 p-1">
                        <div className="flex items-center justify-center h-full">
                          <input
                            type="text"
                            value={row.quality_approval}
                            onChange={e => handleDetailInput(rowIdx, 'quality_approval', e.target.value)}
                            className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {tooltip && (
        <div
          className="fixed z-50 transition-opacity duration-150"
          style={{
            top: tooltip.y,
            left: tooltip.x,
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}
export default FourMChangeTrackingSheet;