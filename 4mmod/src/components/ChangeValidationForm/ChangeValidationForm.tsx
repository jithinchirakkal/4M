

import React, { useState, useEffect } from 'react';

interface ValidationPoint {
  id?: number;
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
  id?: number;
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

const API_URL = 'http://localhost:8000/api/validation/';

const ChangeValidationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [selectedChangeType, setSelectedChangeType] = useState<string>('');
  const [savedData, setSavedData] = useState<FormData[]>([]);
  const [viewMode, setViewMode] = useState<boolean>(true);
  const [selectedEntry, setSelectedEntry] = useState<FormData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchValidations();
  }, []);

  const fetchValidations = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      
      const formattedData = data.map((item: any) => ({
        id: item.id,
        product: item.product,
        process: item.process,
        unexpectedChange: item.unexpected_change,
        line: item.line,
        customer: item.customer || '',
        shift: item.shift,
        date: item.date,
        changePoint: item.change_point || '',
        validationPoints: item.rows.map((row: any) => ({
          id: row.id,
          spec: row.spec,
          beforeMan1: row.before_change_1 || '',
          beforeMan2: row.before_change_2 || '',
          beforeMan3: row.before_change_3 || '',
          afterMan1: row.after_change_1 || '',
          afterMan2: row.after_change_2 || '',
          afterMan3: row.after_change_3 || '',
          endMan1: row.end_change_1 || '',
          endMan2: row.end_change_2 || '',
          endMan3: row.end_change_3 || '',
          remarks: row.remarks || '',
        })),
        resultConfirmation: item.result_confirmation_status,
        preparedBy: item.prepared_by || '',
        approvedBy: item.approved_by || '',
      }));
      
      setSavedData(formattedData);
    } catch (error) {
      console.error('Error fetching validations:', error);
      alert('Failed to fetch validation reports');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section: string | null,
    index: number | null = null,
    field: string | null = null
  ) => {
    const { name, value } = e.target;

    if (section === 'validationPoints' && index !== null && field) {
      const newPoints = [...formData.validationPoints];
      (newPoints[index] as any)[field] = value;
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

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const payload = {
        product: formData.product,
        process: formData.process,
        line: formData.line,
        customer: formData.customer,
        date: formData.date,
        shift: formData.shift,
        unexpected_change: formData.unexpectedChange,
        change_point: formData.changePoint,
        result_confirmation_status: formData.resultConfirmation,
        prepared_by: formData.preparedBy,
        approved_by: formData.approvedBy,
        rows: formData.validationPoints
          .filter(point => point.spec || point.beforeMan1 || point.afterMan1 || point.endMan1)
          .map(point => ({
            spec: point.spec,
            before_change_1: point.beforeMan1,
            before_change_2: point.beforeMan2,
            before_change_3: point.beforeMan3,
            after_change_1: point.afterMan1,
            after_change_2: point.afterMan2,
            after_change_3: point.afterMan3,
            end_change_1: point.endMan1,
            end_change_2: point.endMan2,
            end_change_3: point.endMan3,
            remarks: point.remarks,
          })),
      };

      let response;
      if (isEditing && formData.id) {
        response = await fetch(`${API_URL}${formData.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) throw new Error('Failed to save');

      alert(isEditing ? 'Report updated successfully!' : 'Report saved successfully!');
      await fetchValidations();
      setFormData(initialFormState);
      setSelectedChangeType('');
      setSelectedEntry(null);
      setIsEditing(false);
      setViewMode(true);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save report');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      alert('Report deleted successfully!');
      await fetchValidations();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete report');
    } finally {
      setLoading(false);
    }
  };

  const handleViewEntry = (entry: FormData) => {
    const paddedPoints = [...entry.validationPoints];
    while (paddedPoints.length < 10) {
      paddedPoints.push({
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
      });
    }
    
    setSelectedEntry(entry);
    setFormData({ ...entry, validationPoints: paddedPoints });
    setSelectedChangeType(entry.unexpectedChange);
    setIsEditing(false);
    setViewMode(false);
  };

  const handleEditEntry = (entry: FormData, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const paddedPoints = [...entry.validationPoints];
    while (paddedPoints.length < 10) {
      paddedPoints.push({
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
      });
    }
    
    setFormData({ ...entry, validationPoints: paddedPoints });
    setSelectedChangeType(entry.unexpectedChange);
    setSelectedEntry(null);
    setIsEditing(true);
    setViewMode(false);
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setSelectedChangeType('');
    setSelectedEntry(null);
    setIsEditing(false);
    setViewMode(false);
  };

  const changeTypes = [
    { id: 'Man', label: 'MAN', checked: selectedChangeType === 'Man' },
    { id: 'Machine', label: 'MACHINE', checked: selectedChangeType === 'Machine' },
    { id: 'Material', label: 'MATERIAL', checked: selectedChangeType === 'Material' },
    { id: 'Method', label: 'METHOD', checked: selectedChangeType === 'Method' },
    { id: 'Others', label: 'OTHERS', checked: selectedChangeType === 'Others' },
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 bg-gray-100 py-8">
      <div className="max-w-full mx-auto">
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-blue-800">Change Validation</h1>
          </div>
        </div>

        {viewMode ? (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-6">
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
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : savedData.length === 0 ? (
                <p className="text-gray-500 text-center">No reports available</p>
              ) : (
                <div className="grid gap-4">
                  {savedData.map(entry => (
                    <div
                      key={entry.id}
                      className="border p-4 rounded-md hover:bg-gray-50 cursor-pointer relative"
                      onClick={() => handleViewEntry(entry)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                          <div>
                            <span className="font-medium text-gray-700">Product:</span> {entry.product}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Date:</span> {entry.date}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Status:</span>{' '}
                            <span className={`font-semibold ${
                              entry.resultConfirmation === 'pass' ? 'text-green-600' :
                              entry.resultConfirmation === 'fail' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {entry.resultConfirmation.toUpperCase()}
                            </span>
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
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={(e) => handleEditEntry(entry, e)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (entry.id) handleDelete(entry.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                VALIDATION/VERIFICATION REPORT AFTER UNEXPECTED 4M CHANGE
              </h2>
              <button
                onClick={() => {
                  setViewMode(true);
                  setFormData(initialFormState);
                  setSelectedEntry(null);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium"
              >
                Back to List
              </button>
            </div>

            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Line</label>
                  <input
                    type="text"
                    name="line"
                    value={formData.line}
                    onChange={e => handleInputChange(e, null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Line #"
                    disabled={!!selectedEntry}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={e => handleInputChange(e, null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={!!selectedEntry}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unexpected Change (Mark)
                  </label>
                  <div className="flex flex-wrap gap-2">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={e => handleInputChange(e, null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Customer"
                    disabled={!!selectedEntry}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                  <input
                    type="text"
                    name="shift"
                    value={formData.shift}
                    onChange={e => handleInputChange(e, null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="A/B/C"
                    disabled={!!selectedEntry}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Change Point (Detail)
                </label>
                <input
                  type="text"
                  name="changePoint"
                  value={formData.changePoint || ''}
                  onChange={e => handleInputChange(e, null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter change point details"
                  disabled={!!selectedEntry}
                />
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                        {index + 1}
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
                          className="w-full px-1 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center bg-yellow-50"
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
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
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
                    onClick={() => {
                      setViewMode(true);
                      setFormData(initialFormState);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : isEditing ? 'Update Report' : 'Save & Submit'}
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