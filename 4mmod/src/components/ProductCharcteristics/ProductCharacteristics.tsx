import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface Row {
  id: number;
  sno: string;
  characteristic: string;
  method: string;
  criteria: string;
  ovenNo: string;
}

interface CheckData {
  [key: string]: 'O' | 'X';
}

const ProcessCheckSheet = () => {
  const [formData, setFormData] = useState({
    processName: 'ASSEMBLY SHOP',
    line: '',
    model: '',
    month: '',
    engineerSign: '',
    inchargeSign: '',
    hodProdSign: '',
    engineerQASign: '',
    hodQASign: ''
  });

  const [rows, setRows] = useState<Row[]>([
    { id: 1, sno: '', characteristic: '', method: '', criteria: '', ovenNo: '' }
  ]);

  const [checkData, setCheckData] = useState<CheckData>({});
  const [saveMessage, setSaveMessage] = useState('');

  const addRow = () => {
    setRows([...rows, { 
      id: rows.length + 1, 
      sno: '', 
      characteristic: '', 
      method: '', 
      criteria: '', 
      ovenNo: '' 
    }]);
  };

  const updateRow = (id: number, field: keyof Row, value: string) => {
    setRows(rows.map(row => 
      row.id === id ? {...row, [field]: value} : row
    ));
  };

  const saveProgress = () => {
    const data = {
      formData,
      rows,
      checkData,
      savedAt: new Date().toISOString()
    };
    
    console.log('Saving data:', data);
    setSaveMessage('✓ Progress saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const CellWithClick = ({ rowId, day }: { rowId: number; day: number }) => {
    const key = `${rowId}-${day}`;
    const value = checkData[key];
    
    const handleClick = () => {
      setCheckData(prev => {
        const currentValue = prev[key];
        const newData = {...prev};
        
        if (!currentValue) {
          newData[key] = 'O';
        } else if (currentValue === 'O') {
          newData[key] = 'X';
        } else {
          delete newData[key];
        }
        
        return newData;
      });
    };

    return (
      <td 
        className="border border-gray-300 text-center cursor-pointer hover:bg-blue-50 transition h-16 w-12"
        onClick={handleClick}
      >
        {value === 'O' && <span className="text-green-600 font-bold text-2xl">O</span>}
        {value === 'X' && <X className="w-6 h-6 text-red-600 mx-auto" strokeWidth={3} />}
      </td>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm mb-6 rounded-lg">
          <h1 className="text-center text-xl font-semibold py-5 text-gray-800">
            PROCESS CHARACTERISTICS / JOB SET - UP CHECK SHEET
          </h1>
        </div>
        
        {/* Machine & Schedule Information Section */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <h2 className="bg-teal-500 text-white font-semibold text-base px-6 py-3 rounded-t-lg flex items-center">
            <span className="bg-white text-teal-500 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs font-bold">●</span>
            Machine & Schedule Information
          </h2>
          <div className="p-6">
            <div className="grid grid-cols-4 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Process Name</label>
                <input
                  type="text"
                  value={formData.processName}
                  onChange={(e) => setFormData({...formData, processName: e.target.value})}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:border-teal-500 focus:outline-none text-sm"
                  placeholder="Enter process name"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Line</label>
                <input
                  type="text"
                  value={formData.line}
                  onChange={(e) => setFormData({...formData, line: e.target.value})}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:border-teal-500 focus:outline-none text-sm"
                  placeholder="Enter line"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:border-teal-500 focus:outline-none text-sm"
                  placeholder="Enter model"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Month</label>
                <select
                  value={formData.month}
                  onChange={(e) => setFormData({...formData, month: e.target.value})}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:border-teal-500 focus:outline-none text-sm bg-white"
                >
                  <option value="">Select month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Process Characteristics Checksheet Section */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <h2 className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-base px-6 py-3 rounded-t-lg flex items-center">
            <span className="bg-white text-purple-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs font-bold">●</span>
            Process Characteristics Checksheet
          </h2>
          
          <div className="p-6">
            {/* Main Table */}
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-3 py-3 text-xs font-semibold text-gray-700 w-16">S.NO</th>
                      <th className="border border-gray-300 px-3 py-3 text-xs font-semibold text-gray-700 w-48">PROCESS CHARACTERISTIC</th>
                      <th className="border border-gray-300 px-3 py-3 text-xs font-semibold text-gray-700 w-48">CHECKING METHOD</th>
                      <th className="border border-gray-300 px-3 py-3 text-xs font-semibold text-gray-700 w-40">ACCEPTANCE CRITERIA</th>
                      <th className="border border-gray-300 px-3 py-3 text-xs font-semibold text-gray-700 w-32">DATE / OVEN NO</th>
                      {[...Array(31)].map((_, i) => (
                        <th key={i} className="border border-gray-300 px-2 py-3 text-xs font-semibold text-gray-700 w-12">{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={row.id} className={idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                        <td className="border border-gray-300 p-0">
                          <input
                            type="text"
                            value={row.sno}
                            onChange={(e) => updateRow(row.id, 'sno', e.target.value)}
                            className="w-full px-2 py-2 text-center border-0 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent text-sm"
                          />
                        </td>
                        <td className="border border-gray-300 p-0">
                          <input
                            type="text"
                            value={row.characteristic}
                            onChange={(e) => updateRow(row.id, 'characteristic', e.target.value)}
                            className="w-full px-2 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent text-sm"
                          />
                        </td>
                        <td className="border border-gray-300 p-0">
                          <input
                            type="text"
                            value={row.method}
                            onChange={(e) => updateRow(row.id, 'method', e.target.value)}
                            className="w-full px-2 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent text-sm"
                          />
                        </td>
                        <td className="border border-gray-300 p-0">
                          <input
                            type="text"
                            value={row.criteria}
                            onChange={(e) => updateRow(row.id, 'criteria', e.target.value)}
                            className="w-full px-2 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent text-sm"
                          />
                        </td>
                        <td className="border border-gray-300 p-0">
                          <input
                            type="text"
                            value={row.ovenNo}
                            onChange={(e) => updateRow(row.id, 'ovenNo', e.target.value)}
                            className="w-full px-2 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent text-xs"
                            placeholder="OVEN NO"
                          />
                        </td>
                        {[...Array(31)].map((_, day) => (
                          <CellWithClick key={day} rowId={row.id} day={day + 1} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Scroll hint */}
              <div className="text-center py-2 text-xs text-blue-600 bg-blue-50 border-t border-gray-200">
                ← Scroll horizontally to view all days of the month →
              </div>
            </div>

            {/* Add Row Button */}
            <button
              onClick={addRow}
              className="mt-4 px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition"
            >
              + Add Row
            </button>
          </div>
        </div>

        {/* Signature Section */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <h2 className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold text-base px-6 py-3 rounded-t-lg">
            Signatures
          </h2>
          <div className="p-6">
            <div className="grid grid-cols-5 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">ENGINEER (PROD) SIGN.</label>
                <input
                  type="text"
                  value={formData.engineerSign}
                  onChange={(e) => setFormData({...formData, engineerSign: e.target.value})}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">INCHARGE (PROD) SIGN.</label>
                <input
                  type="text"
                  value={formData.inchargeSign}
                  onChange={(e) => setFormData({...formData, inchargeSign: e.target.value})}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">HOD (PROD) SIGN. (WEEKLY)</label>
                <input
                  type="text"
                  value={formData.hodProdSign}
                  onChange={(e) => setFormData({...formData, hodProdSign: e.target.value})}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">ENGINEER (QA) SIGN.</label>
                <input
                  type="text"
                  value={formData.engineerQASign}
                  onChange={(e) => setFormData({...formData, engineerQASign: e.target.value})}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">HOD (QA) SIGN. (WEEKLY)</label>
                <input
                  type="text"
                  value={formData.hodQASign}
                  onChange={(e) => setFormData({...formData, hodQASign: e.target.value})}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Instructions and Save Button */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <strong className="text-purple-600">Instructions:</strong> Click once on a date cell to mark as <span className="text-green-600 font-bold">"O"</span> (OK), 
                click twice for <span className="text-red-600 font-bold">"X"</span> (Not OK), click three times to clear.
              </p>
            </div>
            <button
              onClick={saveProgress}
              className="ml-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition shadow-md"
            >
              <Save className="w-5 h-5" />
              Save Progress
            </button>
          </div>
          
          {saveMessage && (
            <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded">
              {saveMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessCheckSheet;