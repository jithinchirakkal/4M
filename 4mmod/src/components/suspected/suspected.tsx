
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, XCircle } from "lucide-react";

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

interface RecordRowProps {
  index: number;
  data: Record;
}

interface FormProps {
  onSubmit: (data: Record) => void;
  onCancel: () => void;
}

const RecordRow: React.FC<RecordRowProps> = ({ index, data }) => (
  <tr className="hover:bg-blue-50 transition-colors border-b border-gray-200">
    <td className="p-3 text-center font-medium text-gray-700">{index}</td>
    <td className="p-3 text-gray-700">{data.date}</td>
    <td className="p-3 text-gray-700">{data.partName}</td>
    <td className="p-3 text-gray-700">{data.changeType}</td>
    <td className="p-3 text-gray-700">{data.suspectedQty}</td>
    <td className="p-3 text-gray-700">{data.dispatchDate}</td>
    <td className="p-3 text-gray-700">{data.qty}</td>
    <td className="p-3 text-gray-700">{data.city}</td>
    <td className="p-3 text-gray-700">{data.invoice}</td>
    <td className="p-3 text-gray-700">{data.remarks}</td>
  </tr>
);

const Form: React.FC<FormProps> = ({ onSubmit, onCancel }) => {
  const initialData: Record = {
    date: "",
    partName: "",
    changeType: "",
    suspectedQty: "",
    dispatchDate: "",
    qty: "",
    city: "",
    invoice: "",
    remarks: "",
  };

  const [formData, setFormData] = useState<Record>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialData);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Add New Record
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <XCircle size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "Date", name: "date", type: "date" },
              { label: "Part Name/Model", name: "partName", type: "text" },
              { label: "Change Type", name: "changeType", type: "text" },
              { label: "Suspected Qty", name: "suspectedQty", type: "number" },
              { label: "Dispatch Date", name: "dispatchDate", type: "date" },
              { label: "Qty", name: "qty", type: "number" },
              { label: "City", name: "city", type: "text" },
              { label: "Invoice", name: "invoice", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label
                htmlFor="remarks"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Remarks
              </label>
              <input
                type="text"
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter remarks (optional)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 font-semibold transition"
            >
              Add Record
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

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
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleAddRecord = (newRecord: Record) => {
    setRecords([...records, { ...newRecord, id: Date.now() }]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex flex-col sm:flex-row sm:justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Suspected Lot Traceability Record Sheet
          </h1>
          {/* <div className="flex space-x-6 text-sm mt-3 sm:mt-0">
            <span>Doc No: MS-FM-07</span>
            <span>Rev No: 00</span>
            <span>Date: 01.04.2017</span>
          </div> */}
        </div>

        <div className="p-6">
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 font-medium transition"
            >
              <PlusCircle size={20} /> Add New Record
            </button>
          </div>

          {records.length > 0 ? (
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-blue-600 text-white sticky top-0 z-10">
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
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="p-3 font-semibold border-r border-blue-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {records.map((record, index) => (
                    <RecordRow
                      key={record.id || index}
                      index={index + 1}
                      data={record}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              No records available. Click “Add New Record” to start.
            </div>
          )}
        </div>

        <AnimatePresence>
          {showForm && (
            <Form onSubmit={handleAddRecord} onCancel={() => setShowForm(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Suspected;
