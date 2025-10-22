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

  const processTrackingMatrix = (changes: FourMChangeRecord[], selectedMonth: string) => {
    const matrix: TrackingCell[][] = [];
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    
    // Map four_m values to category names
    const fourMToCategoryMap: { [key: string]: string } = {
      'Man': 'MAN',
      'Machine/Tool': 'MACHINE',
      'Material': 'MATERIAL',
      'Method': 'METHOD'
    };
    
    categories.forEach((category) => {
      const categoryRow: TrackingCell[] = [];
      
      // Filter changes for this category and month
      const categoryChanges = changes.filter(change => {
        if (!change.date) return false;
        const changeDate = new Date(change.date);
        const changeDateStr = `${changeDate.getFullYear()}-${String(changeDate.getMonth() + 1).padStart(2, "0")}`;
        
        // Map the four_m value to category name for comparison
        const mappedCategory = fourMToCategoryMap[change.four_m] || change.four_m.toUpperCase();
        
        return changeDateStr === selectedMonth && mappedCategory === category.name;
      });

      // Get all change days for this category
      const changeDays = categoryChanges.map(change => new Date(change.date).getDate());
      
      dayColumns.forEach(day => {
        let status: TrackingStatus = "noplan";
        let hasChange = false;

        // Check if this day has a change
        if (changeDays.includes(day)) {
          status = "change";
          hasChange = true;
        } else {
          // If selected month is current month
          if (selectedMonth === currentMonth) {
            if (day <= currentDay) {
              // Past or today: no change (green)
              status = "nochange";
            } else {
              // Future: no plan (blue)
              status = "noplan";
            }
          } else if (selectedMonth < currentMonth) {
            // Past months: all days without changes are "no change" (green)
            status = "nochange";
          } else {
            // Future months: all days are "no plan" (blue)
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

    // Create a map of saved details by date and time for quick lookup
    const savedDetailsMap = new Map();
    savedDetails.forEach(detail => {
      const key = `${detail.date}_${detail.time}`;
      savedDetailsMap.set(key, detail);
    });

    const detailRows: ChangeDetailRow[] = filteredChanges.map(change => {
      const key = `${change.date}_${change.time}`;
      const savedDetail = savedDetailsMap.get(key);

      // If we have saved details, use them; otherwise use defaults from the form
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
        // No saved details, use defaults from the form
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

  return (
    <div className="max-w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-2 md:px-8">
      <div className="max-w-full shadow-2xl rounded-2xl bg-white p-6 md:p-10 border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">4M CHANGE TRACKING SHEET</h1>
              </div>
              
            </div>
          </div>
        </div>

        {/* Tracking Matrix */}
        <div className="overflow-x-auto rounded-lg shadow-inner bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-indigo-50">
              <tr className="text-center">
                <th className="border border-gray-300 p-2 w-10" rowSpan={2}>No.</th>
                <th className="border border-gray-300 p-2 w-28" rowSpan={2}>
                  Category<br />of Change
                </th>
                <th colSpan={31} className="border border-gray-300 p-2">
                  <span className="font-semibold">Month:</span>
                  <input
                    type="month"
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    className="ml-2 border border-indigo-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-300 transition"
                  />
                </th>
                <th className="border border-gray-300 p-2 w-40" rowSpan={2}>Remarks</th>
              </tr>
              <tr className="text-center h-8">
                {dayColumns.map(day => (
                  <th key={day} className="border border-gray-300 p-0 w-6">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={category.id} className="text-center h-12 hover:bg-indigo-50 transition">
                  <td className="border border-gray-200 font-semibold">{category.id}</td>
                  <td className="border border-gray-200 font-medium">{category.name}</td>
                  {trackingMatrix[index] &&
                    trackingMatrix[index].map((cell, dayIndex) => (
                      <td key={dayIndex} className="border border-gray-200 p-0">
                        <div
                          className={`w-7 h-7 rounded-full border-2 mx-auto transition-all duration-150
                            ${getStatusBg(cell.status)}
                            ${cell.status === "change" ? "border-red-400" : cell.status === "nochange" ? "border-green-400" : "border-blue-200"}`}
                        ></div>
                      </td>
                    ))}
                  <td className="border border-gray-200 text-left pl-2">
                    {index === 0 && (
                      <div className="font-medium text-gray-700">Legends:</div>
                    )}
                    {index === 1 && (
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-5 h-5 rounded-full border border-green-600 bg-green-500"></span>
                        <span className="text-gray-600">No Change</span>
                      </div>
                    )}
                    {index === 2 && (
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-5 h-5 rounded-full border border-red-600 bg-red-500"></span>
                        <span className="text-gray-600">Change</span>
                      </div>
                    )}
                    {index === 3 && (
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-5 h-5 rounded-full border border-blue-400 bg-blue-100"></span>
                        <span className="text-gray-600">No Plan</span>
                      </div>
                    )}
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
          <div className="flex justify-end my-3">
            <button
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700 font-semibold transition"
              onClick={submitChangeDetails}
            >
              Submit Change Details
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg shadow-inner bg-white border border-gray-200" style={{ maxWidth: '100%', overflowX: 'auto' }}>
            <table className="border-collapse text-xs" style={{ minWidth: '2800px', width: 'auto' }}>
              <thead className="bg-indigo-50 sticky top-0 z-10">
                <tr className="text-center border border-gray-300">
                  <th className="border border-gray-300 p-2 whitespace-nowrap" rowSpan={2} style={{ minWidth: '100px' }}>Record ID</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" rowSpan={2} style={{ minWidth: '120px' }}>Date</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" rowSpan={2} style={{ minWidth: '100px' }}>Time</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" rowSpan={2} style={{ minWidth: '100px' }}>M/C No.</th>
                  <th className="border border-gray-300 p-2" rowSpan={2} style={{ minWidth: '250px' }}>Change Description</th>
                  <th className="border border-gray-300 p-2" rowSpan={2} style={{ minWidth: '200px' }}>
                    Nature of Change<br />
                    (Part/Supplier & dimension)
                  </th>
                  <th className="border border-gray-300 p-2" rowSpan={2} style={{ minWidth: '250px' }}>Action Taken</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" rowSpan={2} style={{ minWidth: '150px' }}>Part Name/No.</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" rowSpan={2} style={{ minWidth: '120px' }}>Control No.</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" rowSpan={2} style={{ minWidth: '150px' }}>Lot No./Batch No.</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" rowSpan={2} style={{ minWidth: '150px' }}>Tracking No./Serial</th>
                  <th className="border border-gray-300 p-2" colSpan={6}>Retroactive</th>
                  <th className="border border-gray-300 p-2" colSpan={3}>
                    Containment<br />
                    Suspected/
                  </th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" rowSpan={2} style={{ minWidth: '100px' }}>SL/OP</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" rowSpan={2} style={{ minWidth: '120px' }}>SL Production</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" rowSpan={2} style={{ minWidth: '120px' }}>SL Plant Impl</th>
                  <th className="border border-gray-300 p-2" colSpan={2}>Material Details</th>
                  <th className="border border-gray-300 p-2" rowSpan={2} style={{ minWidth: '200px' }}>Remarks</th>
                </tr>
                <tr className="text-center border border-gray-300">
                  <th className="border border-gray-300 p-2 whitespace-nowrap" style={{ minWidth: '80px' }}>QTY</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" style={{ minWidth: '100px' }}>W/H No.</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" style={{ minWidth: '80px' }}>Assy</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" style={{ minWidth: '80px' }}>Moog</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" style={{ minWidth: '80px' }}>Cust</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" style={{ minWidth: '100px' }}>OTT P/N</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" style={{ minWidth: '80px' }}>Assy</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" style={{ minWidth: '80px' }}>Ship</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" style={{ minWidth: '130px' }}>
                    Lot No.<br />
                    /Invoice No.
                  </th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" style={{ minWidth: '100px' }}>1</th>
                  <th className="border border-gray-300 p-2 whitespace-nowrap" style={{ minWidth: '100px' }}>2</th>
                </tr>
              </thead>
              <tbody>
                {changeDetailRows.length === 0 ? (
                  <tr>
                    <td colSpan={26} className="text-center text-gray-500 py-4">
                      No change details available for selected month
                    </td>
                  </tr>
                ) : (
                  changeDetailRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-indigo-50 transition" style={{ height: 'auto' }}>
                      <td className="border border-gray-200 p-2">
                        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                          {row.record_id}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2">
                        <input
                          type="date"
                          value={row.date}
                          onChange={e => handleDetailInput(rowIdx, 'date', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 bg-white transition"
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <input
                          type="time"
                          value={row.time}
                          onChange={e => handleDetailInput(rowIdx, 'time', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 bg-white transition"
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <input
                          type="text"
                          value={row.mc_no}
                          onChange={e => handleDetailInput(rowIdx, 'mc_no', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 bg-white transition"
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '250px' }}>
                          {row.change_description}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2">
                        <textarea
                          value={row.nature_of_change}
                          onChange={e => handleDetailInput(rowIdx, 'nature_of_change', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 bg-white transition resize-vertical"
                          rows={2}
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '250px' }}>
                          {row.action_taken}
                        </div>
                      </td>
                      {/* Remaining fields */}
                      {(['part_name_no', 'control_no', 'lot_no_batch_no', 'tracking_no_serial',
                        'retro_qty', 'retro_wh_no', 'retro_assy', 'retro_moog', 'retro_cust', 'retro_ott_pn',
                        'containment_assy', 'containment_ship', 'containment_lot_invoice',
                        'sl_op', 'sl_production', 'sl_plant_impl',
                        'material_details_1', 'material_details_2'] as const).map(field => (
                        <td key={field} className="border border-gray-200 p-2">
                          <input
                            type="text"
                            value={row[field]}
                            onChange={e => handleDetailInput(rowIdx, field, e.target.value)}
                            className="w-full px-2 py-1 rounded border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 bg-white transition"
                          />
                        </td>
                      ))}
                      <td className="border border-gray-200 p-2">
                        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '200px' }}>
                          {row.remarks || '-'}
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
    </div>
  );
}