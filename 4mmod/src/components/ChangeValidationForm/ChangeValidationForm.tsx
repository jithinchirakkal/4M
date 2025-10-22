


import React, { useState } from 'react';

interface ValidationPoint {
  sn: string;
  spec: string;
  beforeMan1: string;
  beforeMan2: string;
  beforeMan3: string;
  afterMan1: string;
  afterMan2: string;
  afterMan3: string;
  endMan1: string;
  endMan2: string;
  endMan3: string;
  remarks: string;
}

interface FormData {
  id?: string;
  product: string;
  process: string;
  unexpectedChange: string;
  line: string;
  customer: string;
  shift: string;
  date: string;
  validationPoints: ValidationPoint[];
  resultConfirmation: string;
  preparedBy: string;
  approvedBy: string;
  changePoint?: string;
}

const initialFormState: FormData = {
  product: '',
  process: '',
  unexpectedChange: '',
  line: '',
  customer: '',
  shift: '',
  date: '',
  validationPoints: Array.from({ length: 10 }, (_, i) => ({
    sn: (i + 1).toString(),
    spec: '',
    beforeMan1: '',
    beforeMan2: '',
    beforeMan3: '',
    afterMan1: '',
    afterMan2: '',
    afterMan3: '',
    endMan1: '',
    endMan2: '',
    endMan3: '',
    remarks: '',
  })),
  resultConfirmation: '',
  preparedBy: '',
  approvedBy: '',
  changePoint: '',
};

// Demo data
const demoData: FormData[] = [
  {
    id: '1',
    product: 'Widget A',
    process: 'Assembly',
    unexpectedChange: 'machine',
    line: 'L1',
    customer: 'ABC Corp',
    shift: 'A',
    date: '2025-10-20',
    validationPoints: [
      {
        sn: '1',
        spec: 'Dimension Check',
        beforeMan1: '10.2mm',
        beforeMan2: '10.3mm',
        beforeMan3: '10.1mm',
        afterMan1: '10.4mm',
        afterMan2: '10.3mm',
        afterMan3: '10.2mm',
        endMan1: '10.2mm',
        endMan2: '10.3mm',
        endMan3: '10.2mm',
        remarks: 'Within tolerance',
      },
      {
        sn: '2',
        spec: 'Surface Finish',
        beforeMan1: 'Smooth',
        beforeMan2: 'Smooth',
        beforeMan3: 'Smooth',
        afterMan1: 'Smooth',
        afterMan2: 'Slight scratch',
        afterMan3: 'Smooth',
        endMan1: 'Smooth',
        endMan2: 'Smooth',
        endMan3: 'Smooth',
        remarks: 'Corrected scratch',
      },
    ],
    resultConfirmation: 'pass',
    preparedBy: 'John Doe',
    approvedBy: 'Jane Smith',
    changePoint: 'New machine calibration',
  },
  {
    id: '2',
    product: 'Component B',
    process: 'Welding',
    unexpectedChange: 'material',
    line: 'L2',
    customer: 'XYZ Inc',
    shift: 'B',
    date: '2025-10-21',
    validationPoints: [
      {
        sn: '1',
        spec: 'Weld Strength',
        beforeMan1: '500N',
        beforeMan2: '495N',
        beforeMan3: '502N',
        afterMan1: '510N',
        afterMan2: '508N',
        afterMan3: '509N',
        endMan1: '505N',
        endMan2: '506N',
        endMan3: '504N',
        remarks: 'Acceptable range',
      },
    ],
    resultConfirmation: 'pass',
    preparedBy: 'Mike Brown',
    approvedBy: 'Sarah Johnson',
    changePoint: 'New material batch',
  },
];

const ChangeValidationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [selectedChangeType, setSelectedChangeType] = useState<string>('');
  const [savedData, setSavedData] = useState<FormData[]>(demoData);
  const [viewMode, setViewMode] = useState<boolean>(true);
  const [selectedEntry, setSelectedEntry] = useState<FormData | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section: string | null,
    index: number | null = null,
    field: string | null = null
  ) => {
    const { name, value } = e.target;

    if (section === 'validationPoints' && index !== null && field) {
      const newPoints = [...formData.validationPoints];
      newPoints[index][field as keyof ValidationPoint] = value;
      setFormData(prev => ({ ...prev, validationPoints: newPoints }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleChangeTypeSelect = (type: string) => {
    setSelectedChangeType(type);
    handleInputChange(
      { target: { name: 'unexpectedChange', value: type } } as React.ChangeEvent<HTMLInputElement>,
      null
    );
  };

  const handleSave = () => {
    const newEntry: FormData = {
      ...formData,
      id: Date.now().toString(),
      validationPoints: formData.validationPoints.filter(
        point =>
          point.spec ||
          point.beforeMan1 ||
          point.beforeMan2 ||
          point.beforeMan3 ||
          point.afterMan1 ||
          point.afterMan2 ||
          point.afterMan3 ||
          point.endMan1 ||
          point.endMan2 ||
          point.endMan3 ||
          point.remarks
      ),
    };
    setSavedData([...savedData, newEntry]);
    setFormData(initialFormState);
    setSelectedChangeType('');
    setViewMode(true);
  };

  const handleViewEntry = (entry: FormData) => {
    setSelectedEntry(entry);
    setFormData(entry);
    setSelectedChangeType(entry.unexpectedChange);
    setViewMode(false);
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setSelectedChangeType('');
    setSelectedEntry(null);
    setViewMode(false);
  };

  const changeTypes = [
    { id: 'man', label: 'MAN', checked: selectedChangeType === 'man' },
    { id: 'machine', label: 'MACHINE', checked: selectedChangeType === 'machine' },
    { id: 'material', label: 'MATERIAL', checked: selectedChangeType === 'material' },
    { id: 'method', label: 'METHOD', checked: selectedChangeType === 'method' },
    { id: 'others', label: 'OTHERS', checked: selectedChangeType === 'others' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 ">
      <div className="max-w-full mx-auto">
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-blue-800">Change Validation</h1>
          </div>
          
        </div>

        {viewMode ? (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-semibold">Saved Validation Reports</h2>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
              >
                Add New Report
              </button>
            </div>
            <div className="p-6">
              {savedData.length === 0 ? (
                <p className="text-gray-500 text-center">No reports available</p>
              ) : (
                <div className="grid gap-4">
                  {savedData.map(entry => (
                    <div
                      key={entry.id}
                      className="border p-4 rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewEntry(entry)}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="font-medium text-gray-700">Product:</span> {entry.product}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Date:</span> {entry.date}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Status:</span>{' '}
                          {entry.resultConfirmation.toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Change Type:</span>{' '}
                          {entry.unexpectedChange.toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Prepared By:</span> {entry.preparedBy}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Approved By:</span> {entry.approvedBy}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                VALIDATION/VERIFICATION REPORT AFTER UNEXPECTED 4M CHANGE
              </h2>
              <button
                onClick={() => setViewMode(true)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium"
              >
                Back to List
              </button>
            </div>

            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={e => handleInputChange(e, null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product name"
                    disabled={!!selectedEntry}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Process</label>
                  <input
                    type="text"
                    name="process"
                    value={formData.process}
                    onChange={e => handleInputChange(e, null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter process"
                    disabled={!!selectedEntry}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unexpected Change (Mark)
                  </label>
                  <div className="flex space-x-2">
                    {changeTypes.map(type => (
                      <label key={type.id} className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="radio"
                          name="unexpectedChange"
                          value={type.id}
                          checked={type.checked}
                          onChange={() => handleChangeTypeSelect(type.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          disabled={!!selectedEntry}
                        />
                        <span className="text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Line</label>
                    <input
                      type="text"
                      name="line"
                      value={formData.line}
                      onChange={e => handleInputChange(e, null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Line #"
                      disabled={!!selectedEntry}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    <input
                      type="text"
                      name="customer"
                      value={formData.customer}
                      onChange={e => handleInputChange(e, null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Customer"
                      disabled={!!selectedEntry}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Change Point (Detail)
                  </label>
                  <input
                    type="text"
                    name="changePoint"
                    value={formData.changePoint || ''}
                    onChange={e => handleInputChange(e, null)}
                    className="w-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter change point details"
                    disabled={!!selectedEntry}
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="text-sm">
                    <label className="block text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={e => handleInputChange(e, null)}
                      className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      disabled={!!selectedEntry}
                    />
                  </div>
                  <div className="text-sm">
                    <label className="block text-gray-700 mb-1">Shift</label>
                    <input
                      type="text"
                      name="shift"
                      value={formData.shift}
                      onChange={e => handleInputChange(e, null)}
                      className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="A/B/C"
                      disabled={!!selectedEntry}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.N.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SPEC (Process & Product)
                    </th>
                    <th
                      colSpan={3}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 border-r border-gray-200"
                    >
                      <div className="font-semibold text-blue-800">BEFORE UNEXPECTED CHANGE</div>
                      <div className="text-xs text-blue-600 mt-1">Observation (Change)</div>
                    </th>
                    <th
                      colSpan={3}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50 border-r border-gray-200"
                    >
                      <div className="font-semibold text-green-800">AFTER UNEXPECTED CHANGE</div>
                      <div className="text-xs text-green-600 mt-1">Observation (Change)</div>
                    </th>
                    <th
                      colSpan={3}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-yellow-50"
                    >
                      <div className="font-semibold text-yellow-800">END OF UNEXPECTED CHANGE</div>
                      <div className="text-xs text-yellow-600 mt-1">Observation & Date (Closing)</div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                  <tr>
                    <th className="px-6 py-2 text-center text-xs text-gray-500"></th>
                    <th className="px-6 py-2 text-center text-xs text-gray-500"></th>
                    <th className="px-2 py-2 text-center text-xs text-gray-500 border-r border-gray-200">1</th>
                    <th className="px-2 py-2 text-center text-xs text-gray-500 border-r border-gray-200">2</th>
                    <th className="px-2 py-2 text-center text-xs text-gray-500 border-r border-gray-200">3</th>
                    <th className="px-2 py-2 text-center text-xs text-gray-500 border-r border-gray-200">1</th>
                    <th className="px-2 py-2 text-center text-xs text-gray-500 border-r border-gray-200">2</th>
                    <th className="px-2 py-2 text-center text-xs text-gray-500 border-r border-gray-200">3</th>
                    <th className="px-2 py-2 text-center text-xs text-gray-500">1</th>
                    <th className="px-2 py-2 text-center text-xs text-gray-500">2</th>
                    <th className="px-2 py-2 text-center text-xs text-gray-500">3</th>
                    <th className="px-6 py-2 text-center text-xs text-gray-500"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.validationPoints.map((point, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <input
                          type="text"
                          value={point.sn}
                          onChange={e => handleInputChange(e, 'validationPoints', index, 'sn')}
                          className="w-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          disabled={!!selectedEntry}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={point.spec}
                          onChange={e => handleInputChange(e, 'validationPoints', index, 'spec')}
                          className="w-full max-w-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Enter specification"
                          disabled={!!selectedEntry}
                        />
                      </td>
                      <td className="px-2 py-4">
                        <input
                          type="text"
                          value={point.beforeMan1}
                          onChange={e => handleInputChange(e, 'validationPoints', index, 'beforeMan1')}
                          className="w-full px-1 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center bg-blue-50"
                          disabled={!!selectedEntry}
                        />
                      </td>
                      <td className="px-2 py-4">
                        <input
                          type="text"
                          value={point.beforeMan2}
                          onChange={e => handleInputChange(e, 'validationPoints', index, 'beforeMan2')}
                          className="w-full px-1 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center bg-blue-50"
                          disabled={!!selectedEntry}
                        />
                      </td>
                      <td className="px-2 py-4 border-r border-gray-200">
                        <input
                          type="text"
                          value={point.beforeMan3}
                          onChange={e => handleInputChange(e, 'validationPoints', index, 'beforeMan3')}
                          className="w-full px-1 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center bg-blue-50"
                          disabled={!!selectedEntry}
                        />
                      </td>
                      <td className="px-2 py-4">
                        <input
                          type="text"
                          value={point.afterMan1}
                          onChange={e => handleInputChange(e, 'validationPoints', index, 'afterMan1')}
                          className="w-full px-1 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center bg-green-50"
                          disabled={!!selectedEntry}
                        />
                      </td>
                      <td className="px-2 py-4">
                        <input
                          type="text"
                          value={point.afterMan2}
                          onChange={e => handleInputChange(e, 'validationPoints', index, 'afterMan2')}
                          className="w-full px-1 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center bg-green-50"
                          disabled={!!selectedEntry}
                        />
                      </td>
                      <td className="px-2 py-4 border-r border-gray-200">
                        <input
                          type="text"
                          value={point.afterMan3}
                          onChange={e => handleInputChange(e, 'validationPoints', index, 'afterMan3')}
                          className="w-full px-1 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center bg-green-50"
                          disabled={!!selectedEntry}
                        />
                      </td>
                      <td className="px-2 py-4">
                        <input
                          type="text"
                          value={point.endMan1}
                          onChange={e => handleInputChange(e, 'validationPoints', index, 'endMan1')}
                          className="w-full px-1 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center bg-yellow-50"
                          disabled={!!selectedEntry}
                        />
                      </td>
                      <td className="px-2 py-4">
                        <input
                          type="text"
                          value={point.endMan2}
                          onChange={e => handleInputChange(e, 'validationPoints', index, 'endMan2')}
                          className="w-full px-1 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-collection bg-yellow-50"
                          disabled={!!selectedEntry}
                        />
                      </td>
                      <td className="px-2 py-4">
                        <input
                          type="text"
                          value={point.endMan3}
                          onChange={e => handleInputChange(e, 'validationPoints', index, 'endMan3')}
                          className="w-full px-1 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center bg-yellow-50"
                          disabled={!!selectedEntry}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={point.remarks}
                          onChange={e => handleInputChange(e, 'validationPoints', index, 'remarks')}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Remarks"
                          disabled={!!selectedEntry}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-red-50 border-t border-red-200">
              <div className="bg-red-100 border border-red-400 rounded-md p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 casque 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Validate the parts for related dimensions and performance:
                </h3>
                <div className="space-y-2 text-red-700">
                  <div className="flex items-start">
                    <span className="text-red-600 font-medium mr-2">1.</span>
                    <span>Before the change</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-600 font-medium mr-2">2.</span>
                    <span>After/During the change</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-600 font-medium mr-2">3.</span>
                    <span>At the termination of change</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Result Confirmation Status
                  </label>
                  <select
                    name="resultConfirmation"
                    value={formData.resultConfirmation}
                    onChange={e => handleInputChange(e, null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={!!selectedEntry}
                  >
                    <option value="">Select status</option>
                    <option value="pass">PASS</option>
                    <option value="fail">FAIL</option>
                    <option value="pending">PENDING</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prepared By</label>
                  <input
                    type="text"
                    name="preparedBy"
                    value={formData.preparedBy}
                    onChange={e => handleInputChange(e, null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter name"
                    disabled={!!selectedEntry}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Approved By</label>
                  <input
                    type="text"
                    name="approvedBy"
                    value={formData.approvedBy}
                    onChange={e => handleInputChange(e, null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter name"
                    disabled={!!selectedEntry}
                  />
                </div>
              </div>

              {!selectedEntry && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setViewMode(true)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save & Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeValidationForm;