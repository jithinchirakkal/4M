
import React, { useState, useEffect } from "react";

type TrackingStatus = "noplan" | "nochange" | "change";

interface FourMChangeRecord {
  id: number;
  record_id: string;
  date: string;
  time: string;
  four_m: string;
  category_details?: {
    category_type: string;
    description: string;
  };
  action_details?: {
    action_taken: string;
    set_up_approval: boolean;
    retroactive_inspection: boolean;
    suspected_lot_check: boolean;
    remarks: string;
  };
  shopfloor_name?: string;
  line_name?: string;
  station_name?: string;
}

interface TrackingCell {
  day: number;
  status: TrackingStatus;
  hasChange: boolean;
}

interface ChangeDetailRow {
  id?: number;
  record_id: string;
  date: string;
  time: string;
  mc_no: string;
  change_description: string;
  nature_of_change: string;
  action_taken: string;
  part_name_no: string;
  control_no: string;
  lot_no_batch_no: string;
  tracking_no_serial: string;
  retro_qty: string;
  retro_wh_no: string;
  retro_assy: string;
  retro_moog: string;
  retro_cust: string;
  retro_ott_pn: string;
  containment_assy: string;
  containment_ship: string;
  containment_lot_invoice: string;
  sl_op: string;
  sl_production: string;
  sl_plant_impl: string;
  material_details_1: string;
  material_details_2: string;
  remarks: string;
}

const categories = [
  { id: 1, name: "MAN" },
  { id: 2, name: "MACHINE" },
  { id: 3, name: "MATERIAL" },
  { id: 4, name: "METHOD" }
];

const dayColumns = Array.from({ length: 31 }, (_, i) => i + 1);

export default function FourMChangeTrackingSheet() {
  const [month, setMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [fourMChanges, setFourMChanges] = useState<FourMChangeRecord[]>([]);
  const [trackingMatrix, setTrackingMatrix] = useState<TrackingCell[][]>([]);
  const [changeDetailRows, setChangeDetailRows] = useState<ChangeDetailRow[]>([]);
  const [allChangeDetailRows, setAllChangeDetailRows] = useState<ChangeDetailRow[]>([]);
  
  // Filter states
  const [filterDate, setFilterDate] = useState('');
  const [filterShopfloor, setFilterShopfloor] = useState('');
  const [filterLine, setFilterLine] = useState('');
  const [filterStation, setFilterStation] = useState('');
  
  // Dropdown data for filters
  const [shopfloors, setShopfloors] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);

  // Fetch shopfloors on mount
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/shopfloors/')
      .then(res => res.json())
      .then(data => setShopfloors(data))
      .catch(err => console.error('Error fetching shopfloors:', err));
  }, []);

  // Fetch 4M Changes and saved change details
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

  // Fetch lines when shopfloor filter changes
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

  // Fetch stations when line filter changes
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

  // Apply filters to change detail rows
  useEffect(() => {
    let filtered = [...allChangeDetailRows];

    if (filterDate) {
      filtered = filtered.filter(row => row.date === filterDate);
    }

    // For shopfloor, line, station - we need to match with the original fourMChanges data
    if (filterShopfloor || filterLine || filterStation) {
      filtered = filtered.filter(row => {
        const originalChange = fourMChanges.find(
          change => change.record_id === row.record_id
        );
        if (!originalChange) return true;

        if (filterShopfloor && originalChange.shopfloor_name !== shopfloors.find(s => s.id === parseInt(filterShopfloor))?.name) {
          return false;
        }
        if (filterLine && originalChange.line_name !== lines.find(l => l.id === parseInt(filterLine))?.name) {
          return false;
        }
        if (filterStation && originalChange.station_name !== stations.find(s => s.id === parseInt(filterStation))?.name) {
          return false;
        }
        return true;
      });
    }

    setChangeDetailRows(filtered);
  }, [filterDate, filterShopfloor, filterLine, filterStation, allChangeDetailRows, fourMChanges, shopfloors, lines, stations]);

  const clearFilters = () => {
    setFilterDate('');
    setFilterShopfloor('');
    setFilterLine('');
    setFilterStation('');
  };

  const processTrackingMatrix = (changes: FourMChangeRecord[], selectedMonth: string) => {
    const matrix: TrackingCell[][] = [];
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    const fourMToCategoryMap: { [key: string]: string } = {
      'Man': 'MAN',
      'Machine/Tool': 'MACHINE',
      'Material': 'MATERIAL',
      'Method': 'METHOD'
    };

    categories.forEach((category) => {
      const categoryRow: TrackingCell[] = [];

      const categoryChanges = changes.filter(change => {
        if (!change.date) return false;
        const changeDate = new Date(change.date);
        const changeDateStr = `${changeDate.getFullYear()}-${String(changeDate.getMonth() + 1).padStart(2, "0")}`;
        const mappedCategory = fourMToCategoryMap[change.four_m] || change.four_m.toUpperCase();
        return changeDateStr === selectedMonth && mappedCategory === category.name;
      });

      const changeDays = categoryChanges.map(change => new Date(change.date).getDate());

      dayColumns.forEach(day => {
        let status: TrackingStatus = "noplan";
        let hasChange = false;

        if (changeDays.includes(day)) {
          status = "change";
          hasChange = true;
        } else {
          if (selectedMonth === currentMonth) {
            if (day <= currentDay) {
              status = "nochange";
            } else {
              status = "noplan";
            }
          } else if (selectedMonth < currentMonth) {
            status = "nochange";
          } else {
            status = "noplan";
          }
        }

        categoryRow.push({ day, status, hasChange });
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
      const key = `${detail.date}_${detail.time}`;
      savedDetailsMap.set(key, detail);
    });

    const detailRows: ChangeDetailRow[] = filteredChanges.map(change => {
      const key = `${change.date}_${change.time}`;
      const savedDetail = savedDetailsMap.get(key);

      if (savedDetail) {
        return {
          id: savedDetail.id,
          record_id: savedDetail.record_id || change.record_id || '',
          date: savedDetail.date || change.date || '',
          time: savedDetail.time || change.time || '',
          mc_no: savedDetail.mc_no || '',
          change_description: savedDetail.change_description || change.category_details?.description || '',
          nature_of_change: savedDetail.nature_of_change || '',
          action_taken: savedDetail.action_taken || change.action_details?.action_taken || '',
          part_name_no: savedDetail.part_name_no || '',
          control_no: savedDetail.control_no || '',
          lot_no_batch_no: savedDetail.lot_no_batch_no || '',
          tracking_no_serial: savedDetail.tracking_no_serial || '',
          retro_qty: savedDetail.retro_qty || '',
          retro_wh_no: savedDetail.retro_wh_no || '',
          retro_assy: savedDetail.retro_assy || '',
          retro_moog: savedDetail.retro_moog || '',
          retro_cust: savedDetail.retro_cust || '',
          retro_ott_pn: savedDetail.retro_ott_pn || '',
          containment_assy: savedDetail.containment_assy || '',
          containment_ship: savedDetail.containment_ship || '',
          containment_lot_invoice: savedDetail.containment_lot_invoice || '',
          sl_op: savedDetail.sl_op || '',
          sl_production: savedDetail.sl_production || '',
          sl_plant_impl: savedDetail.sl_plant_impl || '',
          material_details_1: savedDetail.material_details_1 || '',
          material_details_2: savedDetail.material_details_2 || '',
          remarks: savedDetail.remarks || change.action_details?.remarks || '',
        };
      } else {
        return {
          record_id: change.record_id || '',
          date: change.date || '',
          time: change.time || '',
          mc_no: '',
          change_description: change.category_details?.description || '',
          nature_of_change: '',
          action_taken: change.action_details?.action_taken || '',
          part_name_no: '',
          control_no: '',
          lot_no_batch_no: '',
          tracking_no_serial: '',
          retro_qty: '',
          retro_wh_no: '',
          retro_assy: '',
          retro_moog: '',
          retro_cust: '',
          retro_ott_pn: '',
          containment_assy: '',
          containment_ship: '',
          containment_lot_invoice: '',
          sl_op: '',
          sl_production: '',
          sl_plant_impl: '',
          material_details_1: '',
          material_details_2: '',
          remarks: change.action_details?.remarks || '',
        };
      }
    });

    setChangeDetailRows(detailRows);
    setAllChangeDetailRows(detailRows);
  };

  const handleDetailInput = (
    rowIdx: number,
    field: keyof ChangeDetailRow,
    value: string
  ) => {
    const newDetails = [...changeDetailRows];
    newDetails[rowIdx] = { ...newDetails[rowIdx], [field]: value };
    setChangeDetailRows(newDetails);
  };

  const submitChangeDetails = async () => {
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
        } catch (err: any) {
          alert(`Error for row ${i + 1}: ${err.message}`);
        }
      }
    }
    setChangeDetailRows([...changeDetailRows]);
    alert("Change details submitted!");
  };

  const getStatusBg = (status: TrackingStatus) =>
    status === "nochange"
      ? "bg-green-500"
      : status === "change"
        ? "bg-red-500"
        : "bg-blue-100";

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

  return (
    <div className="max-w-full min-h-screen">
      <div className="max-w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl shadow-xl mb-6">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl md:text-3xl font-bold">4M CHANGE TRACKING SHEET</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Matrix */}
        <div className="overflow-x-auto rounded-lg shadow-inner bg-white">
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead className="sticky top-0 z-10 bg-indigo-50">
              <tr className="text-center">
                <th className="border border-gray-300 p-2 w-10" rowSpan={2}>No.</th>
                <th className="border border-gray-300 p-2 w-28" rowSpan={2}>
                  Category
                </th>
                <th colSpan={31} className="border border-gray-300 p-2">
                  <span className="font-semibold">Month:</span>
                  <input
                    type="month"
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    className="ml-2 border border-indigo-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-300 transition"
                  />
                </th>
                <th className="border border-gray-300 p-2 w-40" rowSpan={2}>Remarks</th>
              </tr>
              <tr className="text-center h-8">
                {dayColumns.map(day => (
                  <th key={day} className="border border-gray-300 p-0 w-6 font-normal text-xs">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={category.id} className="text-center h-10 hover:bg-indigo-50 transition">
                  <td className="border border-gray-200 font-semibold">{category.id}</td>
                  <td className="border border-gray-200 font-medium">{category.name}</td>
                  {trackingMatrix[index] &&
                    trackingMatrix[index].map((cell, dayIndex) => (
                      <td key={dayIndex} className="border border-gray-200 p-0">
                        <div
                          className={`w-5 h-5 rounded-full border-2 mx-auto transition-all duration-150
                            ${getStatusBg(cell.status)}
                            ${cell.status === "change" ? "border-red-400" : cell.status === "nochange" ? "border-green-400" : "border-blue-200"}`}
                        ></div>
                      </td>
                    ))}
                  <td className="border border-gray-200 text-left pl-2">
                    {index === 0 && (<div className="font-medium text-gray-700">Legends:</div>)}
                    {index === 1 && (<div className="flex items-center gap-2 text-xs md:text-sm">
                        <span className="inline-block w-4 h-4 rounded-full border border-green-600 bg-green-500"></span>
                        <span className="text-gray-600">No Change</span>
                    </div>)}
                    {index === 2 && (<div className="flex items-center gap-2 text-xs md:text-sm">
                        <span className="inline-block w-4 h-4 rounded-full border border-red-600 bg-red-500"></span>
                        <span className="text-gray-600">Change</span>
                    </div>)}
                    {index === 3 && (<div className="flex items-center gap-2 text-xs md:text-sm">
                        <span className="inline-block w-4 h-4 rounded-full border border-blue-400 bg-blue-100"></span>
                        <span className="text-gray-600">No Plan</span>
                    </div>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4M Change Detail */}
        <div className="mt-10 mb-2">
          <div className="w-full text-center font-bold text-lg p-2 border-t-2 border-b-2 border-indigo-300 bg-indigo-50 rounded-t-lg">
            4M Change Detail
          </div>
          
          {/* Filters Section */}
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
            <table className="border-collapse text-xs w-full">
              <thead className="bg-indigo-50 sticky top-0 z-10">
                <tr className="text-center border border-gray-300">
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[100px]" rowSpan={2}>Record ID</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[90px]" rowSpan={2}>Date</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[70px]" rowSpan={2}>Time</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[90px]" rowSpan={2}>M/C No.</th>
                  <th className="border border-gray-300 p-2 w-[180px]" rowSpan={2}>Change Desc.</th>
                  <th className="border border-gray-300 p-2 w-[150px]" rowSpan={2}>
                    Nature of Change (P/S/D)
                  </th>
                  <th className="border border-gray-300 p-2 w-[180px]" rowSpan={2}>Action Taken</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[120px]" rowSpan={2}>Part Name/No.</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[80px]" rowSpan={2}>Control No.</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[100px]" rowSpan={2}>Lot/Batch No.</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[100px]" rowSpan={2}>Tracking/Serial</th>
                  <th className="border border-gray-300 p-2" colSpan={6}>Retroactive</th>
                  <th className="border border-gray-300 p-2" colSpan={3}>
                    Containment (Suspected)
                  </th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>SL/OP</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[90px]" rowSpan={2}>SL Prod</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[90px]" rowSpan={2}>SL PI</th>
                  <th className="border border-gray-300 p-2" colSpan={2}>Material Details</th>
                  <th className="border border-gray-300 p-2 w-[150px]" rowSpan={2}>Remarks</th>
                </tr>
                <tr className="text-center border border-gray-300">
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[50px]">QTY</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[80px]">W/H No.</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[50px]">Assy</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[50px]">Moog</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[50px]">Cust</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[80px]">OTT P/N</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[50px]">Assy</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[50px]">Ship</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[90px]">Lot/Invoice No.</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[80px]">1</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap w-[80px]">2</th>
                </tr>
              </thead>
              <tbody>
                {changeDetailRows.length === 0 ? (
                  <tr>
                    <td colSpan={26} className="text-center text-gray-500 py-4">
                      No change details available for the selected filters
                    </td>
                  </tr>
                ) : (
                  changeDetailRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-indigo-50 transition">
                      
                      {/* Read-only cells using the new component */}
                      <td className="border border-gray-200 p-2 align-top">
                        <div className="whitespace-pre-wrap break-words max-w-[100px] text-center mx-auto">
                          {row.record_id}
                        </div>
                      </td>
                      
                      {/* Data entry fields: wrap in div for vertical centering */}
                      <td className="border border-gray-200 p-1">
                        <div className="flex items-center justify-center h-full">
                          <input
                            type="date"
                            value={row.date}
                            onChange={e => handleDetailInput(rowIdx, 'date', e.target.value)}
                            className="w-full p-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition"
                          />
                        </div>
                      </td>
                      <td className="border border-gray-200 p-1">
                        <div className="flex items-center justify-center h-full">
                          <input
                            type="time"
                            value={row.time}
                            onChange={e => handleDetailInput(rowIdx, 'time', e.target.value)}
                            className="w-full p-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition"
                          />
                        </div>
                      </td>
                      <td className="border border-gray-200 p-1">
                        <div className="flex items-center justify-center h-full">
                          <input
                            type="text"
                            value={row.mc_no}
                            onChange={e => handleDetailInput(rowIdx, 'mc_no', e.target.value)}
                            className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition"
                          />
                        </div>
                      </td>
                      
                      {/* Change Description: Fixed height, truncation, and tooltip */}
                      <td className="border border-gray-200 p-2 align-top">
                        <TruncatedTextCell text={row.change_description} maxWidth="180px" />
                      </td>
                      
                      {/* Nature of Change (Input/TextArea): Aligns to top, but rows={2} keeps it compact */}
                      <td className="border border-gray-200 p-1 align-top">
                        <textarea
                          value={row.nature_of_change}
                          onChange={e => handleDetailInput(rowIdx, 'nature_of_change', e.target.value)}
                          className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition resize-none"
                          rows={2} // Keep it to 2 rows fixed height
                          style={{ minHeight: '40px', maxHeight: '40px' }}
                        />
                      </td>

                      {/* Action Taken: Fixed height, truncation, and tooltip */}
                      <td className="border border-gray-200 p-2 align-top">
                        <TruncatedTextCell text={row.action_taken} maxWidth="180px" />
                      </td>
                      
                      {/* Remaining Input fields: wrapped for vertical centering */}
                      {(['part_name_no', 'control_no', 'lot_no_batch_no', 'tracking_no_serial',
                        'retro_qty', 'retro_wh_no', 'retro_assy', 'retro_moog', 'retro_cust', 'retro_ott_pn',
                        'containment_assy', 'containment_ship', 'containment_lot_invoice',
                        'sl_op', 'sl_production', 'sl_plant_impl',
                        'material_details_1', 'material_details_2'] as const).map(field => (
                          <td key={field} className="border border-gray-200 p-1">
                            <div className="flex items-center justify-center h-full">
                              <input
                                type="text"
                                value={row[field]}
                                onChange={e => handleDetailInput(rowIdx, field, e.target.value)}
                                className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition"
                              />
                            </div>
                          </td>
                        ))}
                      
                      {/* Remarks: Fixed height, truncation, and tooltip */}
                      <td className="border border-gray-200 p-2 align-top">
                        <TruncatedTextCell text={row.remarks} maxWidth="150px" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}