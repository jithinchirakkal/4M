import React, { useState } from "react";
import { PlusCircle } from "lucide-react";

interface Record {
  id?: number;
  date: string;
  partName: string;
  changeType: string;
  suspectedQty: string;
  dispatchDate: string;
  qty: string;
  city: string;
  invoice: string;
  remarks: string;
}

const Suspected: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([
    {
      date: "2025-10-20",
      partName: "Part A",
      changeType: "Type 1",
      suspectedQty: "10",
      dispatchDate: "2025-10-21",
      qty: "8",
      city: "Delhi",
      invoice: "INV001",
      remarks: "Initial",
    },
    {
      date: "2025-10-19",
      partName: "Part B",
      changeType: "Type 2",
      suspectedQty: "15",
      dispatchDate: "2025-10-20",
      qty: "12",
      city: "Mumbai",
      invoice: "INV002",
      remarks: "Follow-up",
    },
  ]);

  const [viewMode, setViewMode] = useState<"list" | "add">("list");
  const [formData, setFormData] = useState<Record>({
    date: "",
    partName: "",
    changeType: "",
    suspectedQty: "",
    dispatchDate: "",
    qty: "",
    city: "",
    invoice: "",
    remarks: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRecord = () => {
    setRecords(prev => [...prev, { ...formData, id: Date.now() }]);
    setFormData({
      date: "",
      partName: "",
      changeType: "",
      suspectedQty: "",
      dispatchDate: "",
      qty: "",
      city: "",
      invoice: "",
      remarks: "",
    });
    setViewMode("list");
  };

  return (
    <div className="max-h-screen bg-gray-50 py-8 px-4 sm:px-6 ">
      <div className="max-w-full mx-auto bg-white shadow-lg rounded-3xl">
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-3xl">
          <h1 className="text-xl font-semibold">Suspected Lot Traceability Record Sheet</h1>
          {viewMode === "list" ? (
            <button
              onClick={() => setViewMode("add")}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              <PlusCircle size={18} /> Add New Record
            </button>
          ) : (
            <button
              onClick={() => setViewMode("list")}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-sm"
            >
              Back to List
            </button>
          )}
        </div>

        {viewMode === "list" ? (
          <div className="p-6 overflow-x-auto">
            {records.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No records found. Click “Add New Record” to start.
              </p>
            ) : (
              <table className="w-full text-sm border border-gray-200">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    {[
                      "S.No.",
                      "Date",
                      "Part Name/Model",
                      "Change Type",
                      "Suspected Qty",
                      "Dispatch Date",
                      "Qty",
                      "City",
                      "Invoice",
                      "Remarks",
                    ].map((heading, idx) => (
                      <th key={idx} className="p-2 border-r border-blue-500">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr
                      key={r.id}
                      className="border-b border-gray-200 hover:bg-blue-50 transition"
                    >
                      <td className="p-2 text-center">{i + 1}</td>
                      <td className="p-2">{r.date}</td>
                      <td className="p-2">{r.partName}</td>
                      <td className="p-2">{r.changeType}</td>
                      <td className="p-2">{r.suspectedQty}</td>
                      <td className="p-2">{r.dispatchDate}</td>
                      <td className="p-2">{r.qty}</td>
                      <td className="p-2">{r.city}</td>
                      <td className="p-2">{r.invoice}</td>
                      <td className="p-2">{r.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="p-6 bg-gray-50 rounded-b-3xl">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Add New Record
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Date", name: "date", type: "date" },
                { label: "Part Name/Model", name: "partName", type: "text" },
                { label: "Change Type", name: "changeType", type: "text" },
                { label: "Suspected Qty", name: "suspectedQty", type: "number" },
                { label: "Dispatch Date", name: "dispatchDate", type: "date" },
                { label: "Qty", name: "qty", type: "number" },
                { label: "City", name: "city", type: "text" },
                { label: "Invoice", name: "invoice", type: "text" },
                { label: "Remarks", name: "remarks", type: "text" },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name as keyof Record]}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setViewMode("list")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRecord}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Record
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suspected;