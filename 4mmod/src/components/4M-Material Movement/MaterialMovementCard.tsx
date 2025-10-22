

import React, { useState, useEffect } from "react";
import { Plus, Package, Hash, User, Calendar, Truck, Eye } from 'lucide-react';

// Types
type TableRow = {
  id: number;
  procReq: string;
  processName: string;
  mcNo: string;
  date: string;
  shift: string;
  changeInfo: string;
  oprSign: string;
  qaSign: string;
  netWt: string;
};

type Message = {
  type: "success" | "error";
  text: string;
} | null;

const initialRow: TableRow = {
  id: Date.now(),
  procReq: "",
  processName: "",
  mcNo: "",
  date: "",
  shift: "",
  changeInfo: "",
  oprSign: "",
  qaSign: "",
  netWt: "",
};

export default function MaterialMovementCard() {
  const [page, setPage] = useState<"form" | "list" | "details">("list");

  // Form state
  const [itemDescription, setItemDescription] = useState<string>("");
  const [partNo, setPartNo] = useState<string>("");
  const [wireSize, setWireSize] = useState<string>("");
  const [lotNo, setLotNo] = useState<string>("");
  const [matGrade, setMatGrade] = useState<string>("");
  const [deptC, setDeptC] = useState<string>("");
  const [wpNo, setWpNo] = useState<string>("");
  const [rows, setRows] = useState<TableRow[]>([{ ...initialRow }]);
  const [message, setMessage] = useState<Message>(null);

  // List/Details state
  const [cardList, setCardList] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);

  useEffect(() => {
    fetchCardList();
  }, []);

  // Table row handlers
  const handleRowChange = (
    index: number,
    field: keyof TableRow,
    value: string
  ) => {
    setRows((prevRows) =>
      prevRows.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  const addRow = () =>
    setRows((prevRows) => [
      ...prevRows,
      {
        ...initialRow,
        id: Date.now() + Math.floor(Math.random() * 10000),
      },
    ]);

  const removeRow = (index: number) => {
    if (rows.length === 1) return;
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  // Validation
  const validate = () => {
    if (!itemDescription || !partNo) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return false;
    }
    return true;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!validate()) return;

    const payload = {
      item_description: itemDescription,
      part_no: partNo,
      wire_size: wireSize,
      lot_no: lotNo,
      mat_grade: matGrade,
      dept_c: deptC,
      wp_no: wpNo,
      rows: rows.map((row) => ({
        proc_req: row.procReq,
        process_name: row.processName,
        mc_no: row.mcNo,
        date: row.date || null,
        shift: row.shift,
        change_info: row.changeInfo,
        opr_sign: row.oprSign,
        qa_sign: row.qaSign,
        net_wt: row.netWt ? parseFloat(row.netWt) : null,
      })),
    };

    try {
      const response = await fetch(
        "http://localhost:8000/api/material-movement-cards/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Material Movement Card submitted successfully!",
        });
        // Reset form
        setItemDescription("");
        setPartNo("");
        setWireSize("");
        setLotNo("");
        setMatGrade("");
        setDeptC("");
        setWpNo("");
        setRows([{ ...initialRow, id: Date.now() }]);
        setTimeout(() => {
          fetchCardList();
          setPage("list");
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: "Submission failed: " + JSON.stringify(errorData),
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error: " + error,
      });
    }
  };

  // Fetch all cards
  const fetchCardList = async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const res = await fetch(
        "http://localhost:8000/api/material-movement-cards/"
      );
      if (!res.ok) throw new Error("Failed to fetch list");
      const data = await res.json();
      setCardList(data);
    } catch (err: any) {
      setListError(err.message || "Unknown error");
    } finally {
      setLoadingList(false);
    }
  };

  // Fetch single card details
  const handleViewDetails = (card: any) => {
    setSelectedCard(card);
    setPage("details");
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-4 mb-3">
        <Package className="w-10 h-10 text-blue-400" />
      </div>
      <h2 className="text-xl font-bold text-blue-700 mb-2">No Material Movement Cards Yet</h2>
      <p className="text-gray-500 text-center max-w-md text-sm">
        Click the <span className="font-semibold text-blue-600">New Card</span> button to create your first material movement card.
      </p>
    </div>
  );

  // LIST PAGE
  if (page === "list") {
    return (
      <div className="bg-[#f6faff] min-h-screen">
        <div className="p-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 text-white rounded-2xl shadow-xl mb-6">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold">Material Movement Cards</h1>
                  <p className="text-blue-100 text-sm mt-1">Manufacturing material tracking and movement management</p>
                </div>
                <button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
                  onClick={() => setPage("form")}
                >
                  <Plus className="w-4 h-4" />
                  <span>New Card</span>
                </button>
              </div>
            </div>
          </div>

          {loadingList && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading material cards...</p>
            </div>
          )}

          {listError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <span className="font-medium">Error:</span> {listError}
            </div>
          )}

          {!loadingList && !listError && cardList.length === 0 && <EmptyState />}

          {!loadingList && !listError && cardList.length > 0 && (
            <div className="grid gap-4">
              {cardList.map((card: any) => (
                <div
                  key={card.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-blue-500 hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Hash className="w-4 h-4 mr-2" />
                        Card #{card.id} - {card.item_description || "Material Card"}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm opacity-90">
                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                          {card.rows?.length || 0} process{(card.rows?.length || 0) !== 1 ? 'es' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* Main Information Grid */}
                    <div className="grid md:grid-cols-3 gap-3 mb-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <Package className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="font-semibold text-gray-700 text-sm">Part Information</span>
                        </div>
                        <p className="text-base font-bold text-blue-800">{card.part_no || 'Not specified'}</p>
                        <p className="text-xs text-gray-600">Wire Size: {card.wire_size || 'Not specified'}</p>
                      </div>

                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <Truck className="w-4 h-4 text-green-600 mr-2" />
                          <span className="font-semibold text-gray-700 text-sm">Lot & Grade</span>
                        </div>
                        <p className="text-base font-bold text-green-800">{card.lot_no || 'Not specified'}</p>
                        <p className="text-xs text-gray-600">Grade: {card.mat_grade || 'Not specified'}</p>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <User className="w-4 h-4 text-purple-600 mr-2" />
                          <span className="font-semibold text-gray-700 text-sm">Department Info</span>
                        </div>
                        <p className="text-base font-bold text-purple-800">{card.dept_c || 'Not specified'}</p>
                        <p className="text-xs text-gray-600">WP No: {card.wp_no || 'Not specified'}</p>
                      </div>
                    </div>

                    {/* Process Overview */}
                    {card.rows && card.rows.length > 0 && (
                      <div className="bg-amber-50 rounded-lg p-3 mb-3">
                        <h4 className="font-semibold text-amber-800 mb-2 text-sm">Process Overview</h4>
                        <div className="text-xs text-gray-700">
                          {card.rows.slice(0, 3).map((row: any, i: number) => (
                            <div key={i} className="flex items-center mb-1">
                              <span className="bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold mr-2">
                                {i + 1}
                              </span>
                              <span className="flex-1">
                                {row.process_name || row.proc_req || 'Process not defined'}
                              </span>
                              {row.shift && (
                                <span className="bg-amber-200 text-amber-800 px-2 py-0.5 rounded text-xs ml-2">
                                  {row.shift}
                                </span>
                              )}
                              {row.net_wt && (
                                <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs ml-2">
                                  {row.net_wt}kg
                                </span>
                              )}
                            </div>
                          ))}
                          {card.rows.length > 3 && (
                            <span className="text-gray-500 text-xs">... and {card.rows.length - 3} more processes</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Summary Stats */}
                    {card.rows && card.rows.length > 0 && (
                      <div className="bg-indigo-50 rounded-lg p-3 mb-3">
                        <h4 className="font-semibold text-indigo-800 mb-2 text-sm">Statistics</h4>
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div className="text-center">
                            <div className="font-bold text-indigo-800">{card.rows.length}</div>
                            <div className="text-gray-600">Total Processes</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-indigo-800">
                              {card.rows.filter((r: any) => r.date).length}
                            </div>
                            <div className="text-gray-600">Completed</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-indigo-800">
                              {card.rows.reduce((sum: number, r: any) => sum + (parseFloat(r.net_wt) || 0), 0).toFixed(2)}kg
                            </div>
                            <div className="text-gray-600">Total Weight</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span className="flex items-center">
                          <Hash className="w-3 h-3 mr-1" />
                          <strong>ID:</strong> {card.id}
                        </span>
                        {card.created_at && (
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <strong>Created:</strong> {new Date(card.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <button
                        className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium flex items-center space-x-1"
                        onClick={() => handleViewDetails(card)}
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // FORM PAGE
  if (page === "form") {
    return (
      <div className="bg-[#f6faff] min-h-screen p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">New Material Movement Card</h1>
                <p className="text-blue-100 text-sm mt-1">Create a new material tracking and movement record</p>
              </div>
              <button
                onClick={() => setPage("list")}
                className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl font-semibold transition-all"
              >
                ← Back to List
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Item Details Card */}
          <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3">
              <h2 className="text-lg font-semibold flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                Item Details
              </h2>
            </div>
            
            {message && (
              <div className={`mx-4 mt-4 mb-2 px-4 py-2 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}>
                {message.text}
              </div>
            )}

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Item Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    required
                    placeholder="Enter item description"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Part No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={partNo}
                    onChange={(e) => setPartNo(e.target.value)}
                    required
                    placeholder="Enter part number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Wire Size</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={wireSize}
                    onChange={(e) => setWireSize(e.target.value)}
                    placeholder="Enter wire size"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Lot No.</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={lotNo}
                    onChange={(e) => setLotNo(e.target.value)}
                    placeholder="Enter lot number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mat. Grade</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={matGrade}
                    onChange={(e) => setMatGrade(e.target.value)}
                    placeholder="Enter material grade"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Dept. C</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={deptC}
                    onChange={(e) => setDeptC(e.target.value)}
                    placeholder="Enter department code"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">WP. No.</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={wpNo}
                    onChange={(e) => setWpNo(e.target.value)}
                    placeholder="Enter work piece number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Process Data Table */}
          <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Process Data
                </h2>
                <button
                  type="button"
                  className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all text-sm"
                  onClick={addRow}
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Row</span>
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200 rounded-lg">
                  <thead className="bg-gradient-to-r from-gray-100 to-slate-100">
                    <tr className="text-xs font-bold text-gray-700">
                      <th className="p-2 border border-gray-300 text-left">PROC REQ</th>
                      <th className="p-2 border border-gray-300 text-left">PROCESS NAME</th>
                      <th className="p-2 border border-gray-300 text-left">M/C NO.</th>
                      <th className="p-2 border border-gray-300 text-left">DATE OF COMPLETION</th>
                      <th className="p-2 border border-gray-300 text-left">SHIFT</th>
                      <th className="p-2 border border-gray-300 text-left">4M CHANGE INFORMATION</th>
                      <th className="p-2 border border-gray-300 text-left">OPR. SIGN</th>
                      <th className="p-2 border border-gray-300 text-left">Q.A. SIGN</th>
                      <th className="p-2 border border-gray-300 text-left">NET WT. (KG)</th>
                      <th className="p-2 border border-gray-300 text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-1 border border-gray-300">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded text-xs"
                            value={row.procReq}
                            onChange={(e) => handleRowChange(i, "procReq", e.target.value)}
                            placeholder="Proc req."
                          />
                        </td>
                        <td className="p-1 border border-gray-300">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded text-xs"
                            value={row.processName}
                            onChange={(e) => handleRowChange(i, "processName", e.target.value)}
                            placeholder="Process name"
                          />
                        </td>
                        <td className="p-1 border border-gray-300">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded text-xs"
                            value={row.mcNo}
                            onChange={(e) => handleRowChange(i, "mcNo", e.target.value)}
                            placeholder="Machine no."
                          />
                        </td>
                        <td className="p-1 border border-gray-300">
                          <input
                            type="date"
                            className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded text-xs"
                            value={row.date}
                            onChange={(e) => handleRowChange(i, "date", e.target.value)}
                          />
                        </td>
                        <td className="p-1 border border-gray-300">
                          <select
                            className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded text-xs"
                            value={row.shift}
                            onChange={(e) => handleRowChange(i, "shift", e.target.value)}
                          >
                            <option value="">Select shift</option>
                            <option value="morning">Morning</option>
                            <option value="evening">Evening</option>
                            <option value="night">Night</option>
                          </select>
                        </td>
                        <td className="p-1 border border-gray-300">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded text-xs"
                            value={row.changeInfo}
                            onChange={(e) => handleRowChange(i, "changeInfo", e.target.value)}
                            placeholder="Change info"
                          />
                        </td>
                        <td className="p-1 border border-gray-300">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded text-xs"
                            value={row.oprSign}
                            onChange={(e) => handleRowChange(i, "oprSign", e.target.value)}
                            placeholder="Operator sign"
                          />
                        </td>
                        <td className="p-1 border border-gray-300">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded text-xs"
                            value={row.qaSign}
                            onChange={(e) => handleRowChange(i, "qaSign", e.target.value)}
                            placeholder="QA sign"
                          />
                        </td>
                        <td className="p-1 border border-gray-300">
                          <input
                            type="number"
                            step="0.01"
                            className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded text-xs"
                            value={row.netWt}
                            onChange={(e) => handleRowChange(i, "netWt", e.target.value)}
                            placeholder="Weight"
                          />
                        </td>
                        <td className="p-1 border border-gray-300 text-center">
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-all"
                            onClick={() => removeRow(i)}
                            disabled={rows.length === 1}
                            title="Remove row"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Submit Material Card</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // DETAILS PAGE
  if (page === "details" && selectedCard) {
    return (
      <div className="bg-[#f6faff] min-h-screen p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Material Card Details</h1>
                <p className="text-blue-100 text-sm mt-1">Card #{selectedCard.id} - {selectedCard.item_description}</p>
              </div>
              <button
                onClick={() => setPage("list")}
                className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl font-semibold transition-all"
              >
                ← Back to List
              </button>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
              Item Information
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Item Description', value: selectedCard.item_description, icon: Package },
                { label: 'Part No.', value: selectedCard.part_no, icon: Hash },
                { label: 'Wire Size', value: selectedCard.wire_size, icon: null },
                { label: 'Lot No.', value: selectedCard.lot_no, icon: Truck },
                { label: 'Mat. Grade', value: selectedCard.mat_grade, icon: null },
                { label: 'Dept. C', value: selectedCard.dept_c, icon: User },
                { label: 'WP No.', value: selectedCard.wp_no, icon: null },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.label} className="space-y-1">
                    <dt className="text-xs font-medium text-gray-600 flex items-center">
                      {IconComponent && <IconComponent className="w-3 h-3 mr-2 text-gray-500" />}
                      {item.label}
                    </dt>
                    <dd className="text-sm text-gray-800 p-2 bg-gray-50 rounded-lg">
                      {item.value || <span className="text-gray-400">N/A</span>}
                    </dd>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Process Rows */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
              Process Rows
            </h2>
          </div>
          <div className="p-4">
            {selectedCard.rows && selectedCard.rows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200 rounded-lg">
                  <thead className="bg-gradient-to-r from-gray-100 to-slate-100">
                    <tr>
                      {["PROC REQ", "PROCESS NAME", "M/C NO.", "DATE", "SHIFT", "4M CHANGE", "OPR SIGN", "QA SIGN", "NET WT."].map((header) => (
                        <th key={header} className="p-3 text-xs font-semibold text-gray-700 text-left border border-gray-300">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {selectedCard.rows.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                        <td className="p-3 text-sm text-gray-700 border border-gray-200">{row.proc_req || '-'}</td>
                        <td className="p-3 text-sm text-gray-700 border border-gray-200">{row.process_name || '-'}</td>
                        <td className="p-3 text-sm text-gray-700 border border-gray-200">{row.mc_no || '-'}</td>
                        <td className="p-3 text-sm text-gray-700 border border-gray-200">{row.date || '-'}</td>
                        <td className="p-3 text-sm text-gray-700 border border-gray-200">
                          {row.shift && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                              {row.shift}
                            </span>
                          )}
                          {!row.shift && '-'}
                        </td>
                        <td className="p-3 text-sm text-gray-700 border border-gray-200">{row.change_info || '-'}</td>
                        <td className="p-3 text-sm text-gray-700 border border-gray-200">{row.opr_sign || '-'}</td>
                        <td className="p-3 text-sm text-gray-700 border border-gray-200">{row.qa_sign || '-'}</td>
                        <td className="p-3 text-sm text-gray-700 border border-gray-200">
                          {row.net_wt ? `${row.net_wt} kg` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Package className="w-12 h-12 mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Process Rows</h3>
                <p className="text-sm">No process data found for this material card.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
