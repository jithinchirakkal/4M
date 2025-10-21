


// import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
// import axios from 'axios';
// import './ControlPlanForm.css';


// interface RowData {
//   partProcessNo: string;
//   processNameOperationDescription: string;
//   machineDeviceJigToolsForMfg: string;
//   no: string;
//   productCharacteristics: string;
//   processCharacteristics: string;
//   specialCharClass: string;
//   productProcessSpec: string;
//   toleranceControlSpec: string;
//   evaluationMeasurementTechnique: string;
//   sampleSize: string;
//   sampleFreq: string;
//   periodicalResp: string;
//   primaryResp: string;
//   controlMethod: string;
//   record: string;
//   reactionPlan: string;
// }

// interface FormData {
//   controlPlanNo: string;
//   keyContact: string;
//   dateOrig: string;
//   dateRev: string;
//   prototype: boolean;
//   prelaunch: boolean;
//   production: boolean;
//   coreTeam: string;
//   customerEngApprovalDate: string;
//   refPartNo: string;
//   partNoLatestChangeLevel: string;
//   supplierPlantApprovalDate: string;
//   customerQuantityApprovalDate: string;
//   partNameDescription: string;
//   otherApprovalDateIfReqd1: string;
//   otherApprovalDate1: string;
//   supplierPlant: string;
//   otherApprovalDateIfReqd2: string;
//   otherApprovalDate2: string;
//   legend: string;
//   rows: RowData[];
//   notes: string;
//   preparedBy: string;
//   checkedBy: string;
//   approvedBy: string;
//   formatNo: string;
// }


// const initialFormData: FormData = {
//   controlPlanNo: '',
//   keyContact: '',
//   dateOrig: '',
//   dateRev: '',
//   prototype: false,
//   prelaunch: false,
//   production: false,
//   coreTeam: '',
//   customerEngApprovalDate: '',
//   refPartNo: '',
//   partNoLatestChangeLevel: '',
//   supplierPlantApprovalDate: '',
//   customerQuantityApprovalDate: '',
//   partNameDescription: '',
//   otherApprovalDateIfReqd1: '',
//   otherApprovalDate1: '',
//   supplierPlant: '',
//   otherApprovalDateIfReqd2: '',
//   otherApprovalDate2: '',
//   legend: '',
//   rows: Array(1).fill({}).map(() => ({
//     partProcessNo: '',
//     processNameOperationDescription: '',
//     machineDeviceJigToolsForMfg: '',
//     no: '',
//     productCharacteristics: '',
//     processCharacteristics: '',
//     specialCharClass: '',
//     productProcessSpec: '',
//     toleranceControlSpec: '',
//     evaluationMeasurementTechnique: '',
//     sampleSize: '',
//     sampleFreq: '',
//     periodicalResp: '',
//     primaryResp: '',
//     controlMethod: '',
//     record: '',
//     reactionPlan: ''
//   })),
//   notes: '',
//   preparedBy: '',
//   checkedBy: '',
//   approvedBy: '',
//   formatNo: ''
// };

// const API_URL = 'http://localhost:8000/api/controlplans/';

// const ControlPlanForm: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>(initialFormData);
//   const [savedForms, setSavedForms] = useState<FormData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);


//   useEffect(() => {
//     const fetchForms = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(API_URL);
//         setSavedForms(response.data);
//       } catch (err) {
//         setError('Failed to fetch saved forms.');
//         console.error('Error fetching forms:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchForms();
//   }, []);

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;

//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleRowChange = (index: number, field: keyof RowData, value: string) => {
//     const updatedRows = [...formData.rows];
//     updatedRows[index] = { ...updatedRows[index], [field]: value };
//     setFormData(prev => ({ ...prev, rows: updatedRows }));
//   };

//   const addRow = () => {
//     setFormData(prev => ({
//       ...prev,
//       rows: [
//         ...prev.rows,
//         {
//           partProcessNo: '',
//           processNameOperationDescription: '',
//           machineDeviceJigToolsForMfg: '',
//           no: '',
//           productCharacteristics: '',
//           processCharacteristics: '',
//           specialCharClass: '',
//           productProcessSpec: '',
//           toleranceControlSpec: '',
//           evaluationMeasurementTechnique: '',
//           sampleSize: '',
//           sampleFreq: '',
//           periodicalResp: '',
//           primaryResp: '',
//           controlMethod: '',
//           record: '',
//           reactionPlan: ''
//         }
//       ]
//     }));
//   };

//   const removeRow = (index: number) => {
//     if (formData.rows.length > 1) {
//       const updatedRows = [...formData.rows];
//       updatedRows.splice(index, 1);
//       setFormData(prev => ({ ...prev, rows: updatedRows }));
//     }
//   };

//   const handleSave = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const response = await axios.post(API_URL, formData);
//       setSavedForms(prev => [...prev, response.data]);
//       setFormData(initialFormData);
//       setError(null);
//       alert('Form data saved successfully!');
//     } catch (err) {
//       setError('Failed to save form data. Please try again.');
//       console.error('Error saving form:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="control-plan-container">
//       <div className="control-plan-header">
//         <h1>Control Plan</h1>
//       </div>

//       <form onSubmit={handleSave}>
//         {/* Header Information Section */}
//         <div className="card">
//           <div className="card-header">
//             <h2>Header Information</h2>
//           </div>
//           <div className="card-content">
//             <div className="form-grid">
//               <div className="form-group">
//                 <label>Control Plan No.:</label>
//                 <input
//                   type="text"
//                   name="controlPlanNo"
//                   value={formData.controlPlanNo}
//                   onChange={handleChange}
//                   className="form-control"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Key Contact:</label>
//                 <input
//                   type="text"
//                   name="keyContact"
//                   value={formData.keyContact}
//                   onChange={handleChange}
//                   className="form-control"
//                 />
//               </div>
//               <div className="form-group">
//                 <div className="date-group">
//                   <div className="date-item">
//                     <label>Date (Orig)</label>
//                     <input
//                       type="date"
//                       name="dateOrig"
//                       value={formData.dateOrig}
//                       onChange={handleChange}
//                       className="form-control"
//                     />
//                   </div>
//                   <div className="date-item">
//                     <label>Date (Rev)</label>
//                     <input
//                       type="date"
//                       name="dateRev"
//                       value={formData.dateRev}
//                       onChange={handleChange}
//                       className="form-control"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="form-grid">
//               <div className="form-group">
//                 <div className="checkbox-group">
//                   <label>
//                     <input type="checkbox" name="prototype" checked={formData.prototype} onChange={handleChange} />
//                     Prototype
//                   </label>
//                   <label>
//                     <input type="checkbox" name="prelaunch" checked={formData.prelaunch} onChange={handleChange} />
//                     Prelaunch
//                   </label>
//                   <label>
//                     <input type="checkbox" name="production" checked={formData.production} onChange={handleChange} />
//                     Production
//                   </label>
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>Core Team:</label>
//                 <input type="text" name="coreTeam" value={formData.coreTeam} onChange={handleChange} className="form-control" />
//               </div>
//               <div className="form-group">
//                 <label>Customer Engg. Approval/Date:</label>
//                 <input type="text" name="customerEngApprovalDate" value={formData.customerEngApprovalDate} onChange={handleChange} className="form-control" />
//               </div>
//             </div>

//             <div className="form-grid">
//               <div className="form-group">
//                 <label>Ref. Part No.:</label>
//                 <input type="text" name="refPartNo" value={formData.refPartNo} onChange={handleChange} className="form-control" />
//               </div>
//               <div className="form-group">
//                 <label>Part No/Latest change Level:</label>
//                 <input type="text" name="partNoLatestChangeLevel" value={formData.partNoLatestChangeLevel} onChange={handleChange} className="form-control" />
//               </div>
//               <div className="form-group">
//                 <label>Supplier / Plant. Approval / Date:</label>
//                 <input type="text" name="supplierPlantApprovalDate" value={formData.supplierPlantApprovalDate} onChange={handleChange} className="form-control" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Part Information Section */}
//         <div className="card">
//           <div className="card-header">
//             <h2>Part Information</h2>
//           </div>
//           <div className="card-content">
//             <div className="form-grid">
//               <div className="form-group">
//                 <label>Part Name/Description:</label>
//                 <input type="text" name="partNameDescription" value={formData.partNameDescription} onChange={handleChange} className="form-control" />
//               </div>
//               <div className="form-group">
//                 <label>Customer Quantity Approval /Date:</label>
//                 <input type="text" name="customerQuantityApprovalDate" value={formData.customerQuantityApprovalDate} onChange={handleChange} className="form-control" />
//               </div>
//               <div className="form-group">
//                 <label>Supplier Plant:</label>
//                 <input type="text" name="supplierPlant" value={formData.supplierPlant} onChange={handleChange} className="form-control" />
//               </div>
//             </div>

//             <div className="form-grid">
//               <div className="form-group">
//                 <label>Other Approval Date (If Reqd.):</label>
//                 <input type="text" name="otherApprovalDateIfReqd1" value={formData.otherApprovalDateIfReqd1} onChange={handleChange} className="form-control" />
//               </div>
//               <div className="form-group">
//                 <label>Other Approval Date:</label>
//                 <input type="text" name="otherApprovalDate1" value={formData.otherApprovalDate1} onChange={handleChange} className="form-control" />
//               </div>
//               <div className="form-group">
//                 <label>Legend:</label>
//                 <input type="text" name="legend" value={formData.legend} onChange={handleChange} className="form-control" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Process Details Section */}
//         <div className="card">
//           <div className="card-header">
//             <h2>Process Details</h2>
//           </div>
//           <div className="card-content">
//             <div className="table-responsive">
//               <table className="process-table">
//                 <thead>
//                   <tr className="process-table-header-row">
//                     <th style={{ width: '7%' }}>Part / Process No.</th>
//                     <th style={{ width: '11%' }}>Process Name / Operation</th>
//                     <th style={{ width: '9%' }}>Machine / Device</th>
//                     <th style={{ width: '3%' }}>No.</th>
//                     <th style={{ width: '6%' }}>Product Char.</th>
//                     <th style={{ width: '6%' }}>Process Char.</th>
//                     <th style={{ width: '6%' }}>Special Char. Class</th>
//                     <th style={{ width: '7%' }}>Product/Process Spec.</th>
//                     <th style={{ width: '7%' }}>Tolerance/Control Spec.</th>
//                     <th style={{ width: '7%' }}>Evaluation Technique</th>
//                     <th style={{ width: '3%' }}>Sample Size</th>
//                     <th style={{ width: '3%' }}>Sample Freq.</th>
//                     <th style={{ width: '7%' }}>Periodical Resp.</th>
//                     <th style={{ width: '7%' }}>Primary Resp.</th>
//                     <th style={{ width: '7%' }}>Control Method</th>
//                     <th style={{ width: '6%' }}>Record</th>
//                     <th style={{ width: '9%' }}>Reaction Plan</th>
//                     <th style={{ width: '3%' }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {formData.rows.map((row, index) => (
//                     <tr key={index}>
//                       <td><input type="text" value={row.partProcessNo} onChange={(e) => handleRowChange(index, 'partProcessNo', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.processNameOperationDescription} onChange={(e) => handleRowChange(index, 'processNameOperationDescription', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.machineDeviceJigToolsForMfg} onChange={(e) => handleRowChange(index, 'machineDeviceJigToolsForMfg', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.no} onChange={(e) => handleRowChange(index, 'no', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.productCharacteristics} onChange={(e) => handleRowChange(index, 'productCharacteristics', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.processCharacteristics} onChange={(e) => handleRowChange(index, 'processCharacteristics', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.specialCharClass} onChange={(e) => handleRowChange(index, 'specialCharClass', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.productProcessSpec} onChange={(e) => handleRowChange(index, 'productProcessSpec', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.toleranceControlSpec} onChange={(e) => handleRowChange(index, 'toleranceControlSpec', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.evaluationMeasurementTechnique} onChange={(e) => handleRowChange(index, 'evaluationMeasurementTechnique', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.sampleSize} onChange={(e) => handleRowChange(index, 'sampleSize', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.sampleFreq} onChange={(e) => handleRowChange(index, 'sampleFreq', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.periodicalResp} onChange={(e) => handleRowChange(index, 'periodicalResp', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.primaryResp} onChange={(e) => handleRowChange(index, 'primaryResp', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.controlMethod} onChange={(e) => handleRowChange(index, 'controlMethod', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.record} onChange={(e) => handleRowChange(index, 'record', e.target.value)} className="table-form-control" /></td>
//                       <td><input type="text" value={row.reactionPlan} onChange={(e) => handleRowChange(index, 'reactionPlan', e.target.value)} className="table-form-control" /></td>
//                       <td><button type="button" onClick={() => removeRow(index)} className="btn btn-danger">Delete</button></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="button-group">
//               <button type="button" onClick={addRow} className="btn btn-primary">Add Process</button>
//             </div>
//           </div>
//         </div>

//         {/* Notes Section */}
//         <div className="card">
//           <div className="card-header">
//             <h2>Notes</h2>
//           </div>
//           <div className="card-content">
//             <div className="form-group">
//               <label>Notes</label>
//               <textarea name="notes" value={formData.notes} onChange={handleChange} className="form-control" rows={4} />
//             </div>
//           </div>
//         </div>

//         {/* Signatures Section */}
//         <div className="card">
//           <div className="card-header">
//             <h2>Signatures</h2>
//           </div>
//           <div className="card-content">
//             <div className="form-grid">
//               <div className="form-group">
//                 <label>Prepared By</label>
//                 <input type="text" name="preparedBy" value={formData.preparedBy} onChange={handleChange} className="form-control" />
//               </div>
//               <div className="form-group">
//                 <label>Checked By</label>
//                 <input type="text" name="checkedBy" value={formData.checkedBy} onChange={handleChange} className="form-control" />
//               </div>
//               <div className="form-group">
//                 <label>Approved By</label>
//                 <input type="text" name="approvedBy" value={formData.approvedBy} onChange={handleChange} className="form-control" />
//               </div>
//               <div className="form-group">
//                 <label>Format No</label>
//                 <input type="text" name="formatNo" value={formData.formatNo} onChange={handleChange} className="form-control" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="action-buttons">
//           <button type="submit" className="btn btn-primary" disabled={loading}>
//             {loading ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </form>


//       {error && (
//         <div className="alert alert-danger">
//           {error}
//         </div>
//       )}


//       <div className="saved-forms">
//         <h2>Saved Forms</h2>
//         {loading ? (
//           <p>Loading saved forms...</p>
//         ) : savedForms.length === 0 ? (
//           <p>No saved forms yet.</p>
//         ) : (
//           savedForms.map((form, index) => (
//             <div key={index} className="saved-form-item">
//               <div className="saved-form-header">
//                 <h3>Form {index + 1} - {form.controlPlanNo}</h3>
//               </div>
//               <div className="saved-form-information">
//                 <h4>General Information</h4>
//                 <p><strong>Part Name/Description:</strong> {form.partNameDescription}</p>
//                 <p><strong>Prepared By:</strong> {form.preparedBy}</p>
//                 <p><strong>Date (Orig):</strong> {form.dateOrig}</p>
//                 <p><strong>Production Type:</strong> {form.prototype && 'Prototype '}{form.prelaunch && 'Prelaunch '}{form.production && 'Production'}</p>
//               </div>
//               <h4 className="saved-process-details-heading">Process Details:</h4>
//               <div className="saved-process-table-container">
//                 <table className="saved-process-table">
//                   <thead>
//                     <tr>
//                       <th>Process Name</th>
//                       <th>Product Char.</th>
//                       <th>Control Method</th>
//                       <th>Reaction Plan</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {form.rows.map((row, rowIndex) => (
//                       <tr key={rowIndex}>
//                         <td>{row.processNameOperationDescription}</td>
//                         <td>{row.productCharacteristics}</td>
//                         <td>{row.controlMethod}</td>
//                         <td>{row.reactionPlan}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="saved-form-footer">
//                 <p><strong>Notes:</strong> {form.notes}</p>
//                 <p><strong>Approved By:</strong> {form.approvedBy}</p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ControlPlanForm;












// import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
// import axios from 'axios';

// interface RowData {
//   partProcessNo: string;
//   processNameOperationDescription: string;
//   machineDeviceJigToolsForMfg: string;
//   no: string;
//   productCharacteristics: string;
//   processCharacteristics: string;
//   specialCharClass: string;
//   productProcessSpec: string;
//   toleranceControlSpec: string;
//   evaluationMeasurementTechnique: string;
//   sampleSize: string;
//   sampleFreq: string;
//   periodicalResp: string;
//   primaryResp: string;
//   controlMethod: string;
//   record: string;
//   reactionPlan: string;
// }

// interface FormData {
//   controlPlanNo: string;
//   keyContact: string;
//   dateOrig: string;
//   dateRev: string;
//   prototype: boolean;
//   prelaunch: boolean;
//   production: boolean;
//   coreTeam: string;
//   customerEngApprovalDate: string;
//   refPartNo: string;
//   partNoLatestChangeLevel: string;
//   supplierPlantApprovalDate: string;
//   customerQuantityApprovalDate: string;
//   partNameDescription: string;
//   otherApprovalDateIfReqd1: string;
//   otherApprovalDate1: string;
//   supplierPlant: string;
//   otherApprovalDateIfReqd2: string;
//   otherApprovalDate2: string;
//   legend: string;
//   rows: RowData[];
//   notes: string;
//   preparedBy: string;
//   checkedBy: string;
//   approvedBy: string;
//   formatNo: string;
// }

// const initialFormData: FormData = {
//   controlPlanNo: '',
//   keyContact: '',
//   dateOrig: '',
//   dateRev: '',
//   prototype: false,
//   prelaunch: false,
//   production: false,
//   coreTeam: '',
//   customerEngApprovalDate: '',
//   refPartNo: '',
//   partNoLatestChangeLevel: '',
//   supplierPlantApprovalDate: '',
//   customerQuantityApprovalDate: '',
//   partNameDescription: '',
//   otherApprovalDateIfReqd1: '',
//   otherApprovalDate1: '',
//   supplierPlant: '',
//   otherApprovalDateIfReqd2: '',
//   otherApprovalDate2: '',
//   legend: '',
//   rows: [
//     {
//       partProcessNo: '',
//       processNameOperationDescription: '',
//       machineDeviceJigToolsForMfg: '',
//       no: '',
//       productCharacteristics: '',
//       processCharacteristics: '',
//       specialCharClass: '',
//       productProcessSpec: '',
//       toleranceControlSpec: '',
//       evaluationMeasurementTechnique: '',
//       sampleSize: '',
//       sampleFreq: '',
//       periodicalResp: '',
//       primaryResp: '',
//       controlMethod: '',
//       record: '',
//       reactionPlan: ''
//     }
//   ],
//   notes: '',
//   preparedBy: '',
//   checkedBy: '',
//   approvedBy: '',
//   formatNo: ''
// };

// const API_URL = 'http://localhost:8000/api/controlplans/';

// const ControlPlanForm: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>(initialFormData);
//   const [savedForms, setSavedForms] = useState<FormData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchForms = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(API_URL);
//         setSavedForms(response.data);
//       } catch (err) {
//         setError('Failed to fetch saved forms.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchForms();
//   }, []);

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;

//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleRowChange = (index: number, field: keyof RowData, value: string) => {
//     const updatedRows = [...formData.rows];
//     updatedRows[index] = { ...updatedRows[index], [field]: value };
//     setFormData(prev => ({ ...prev, rows: updatedRows }));
//   };

//   const addRow = () => {
//     setFormData(prev => ({
//       ...prev,
//       rows: [
//         ...prev.rows,
//         {
//           partProcessNo: '',
//           processNameOperationDescription: '',
//           machineDeviceJigToolsForMfg: '',
//           no: '',
//           productCharacteristics: '',
//           processCharacteristics: '',
//           specialCharClass: '',
//           productProcessSpec: '',
//           toleranceControlSpec: '',
//           evaluationMeasurementTechnique: '',
//           sampleSize: '',
//           sampleFreq: '',
//           periodicalResp: '',
//           primaryResp: '',
//           controlMethod: '',
//           record: '',
//           reactionPlan: ''
//         }
//       ]
//     }));
//   };

//   const removeRow = (index: number) => {
//     if (formData.rows.length > 1) {
//       const updatedRows = [...formData.rows];
//       updatedRows.splice(index, 1);
//       setFormData(prev => ({ ...prev, rows: updatedRows }));
//     }
//   };

//   const handleSave = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const response = await axios.post(API_URL, formData);
//       setSavedForms(prev => [...prev, response.data]);
//       setFormData(initialFormData);
//       setError(null);
//       alert('Form data saved successfully!');
//     } catch (err) {
//       setError('Failed to save form data. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-full mx-auto p-6 bg-gray-100 min-h-screen">
//       <div className="text-center mb-8">
//         <h1 className="text-4xl font-bold text-blue-700 drop-shadow">Control Plan</h1>
//       </div>

//       <form onSubmit={handleSave}>
//         {/* Header Information Section */}
//         <div className="bg-white rounded-xl shadow mb-6 border border-gray-200">
//           <div className="bg-blue-700 p-4 rounded-t-xl">
//             <h2 className="text-white text-xl font-semibold m-0">Header Information</h2>
//           </div>
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
//               <div>
//                 <label className="block mb-1 font-medium text-gray-700">Control Plan No.:</label>
//                 <input
//                   type="text"
//                   name="controlPlanNo"
//                   value={formData.controlPlanNo}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 font-medium text-gray-700">Key Contact:</label>
//                 <input
//                   type="text"
//                   name="keyContact"
//                   value={formData.keyContact}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//                 />
//               </div>
//               <div className="flex gap-4">
//                 <div className="flex-1">
//                   <label className="block mb-1 font-medium text-gray-700">Date (Orig)</label>
//                   <input
//                     type="date"
//                     name="dateOrig"
//                     value={formData.dateOrig}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <label className="block mb-1 font-medium text-gray-700">Date (Rev)</label>
//                   <input
//                     type="date"
//                     name="dateRev"
//                     value={formData.dateRev}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
//               <div>
//                 <label className="block mb-1 font-medium text-gray-700">Production Type:</label>
//                 <div className="flex gap-4 items-center">
//                   <label className="flex items-center gap-1">
//                     <input type="checkbox" name="prototype" checked={formData.prototype} onChange={handleChange} />
//                     <span>Prototype</span>
//                   </label>
//                   <label className="flex items-center gap-1">
//                     <input type="checkbox" name="prelaunch" checked={formData.prelaunch} onChange={handleChange} />
//                     <span>Prelaunch</span>
//                   </label>
//                   <label className="flex items-center gap-1">
//                     <input type="checkbox" name="production" checked={formData.production} onChange={handleChange} />
//                     <span>Production</span>
//                   </label>
//                 </div>
//               </div>
//               <div>
//                 <label className="block mb-1 font-medium text-gray-700">Core Team:</label>
//                 <input type="text" name="coreTeam" value={formData.coreTeam} onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
//               </div>
//               <div>
//                 <label className="block mb-1 font-medium text-gray-700">Customer Engg. Approval/Date:</label>
//                 <input type="text" name="customerEngApprovalDate" value={formData.customerEngApprovalDate} onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
//               </div>
//             </div>
//             {/* ...continue with other fields in similar fashion... */}
//           </div>
//         </div>

//         {/* ...Repeat for other sections, using Tailwind classes... */}

//         {/* Process Details Section */}
//         <div className="bg-white rounded-xl shadow mb-6 border border-gray-200">
//           <div className="bg-blue-700 p-4 rounded-t-xl">
//             <h2 className="text-white text-xl font-semibold m-0">Process Details</h2>
//           </div>
//           <div className="p-6">
//             <div className="overflow-x-auto border rounded">
//               <table className="min-w-full text-xs">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="p-2 border">Part / Process No.</th>
//                     <th className="p-2 border">Process Name / Operation</th>
//                     <th className="p-2 border">Machine / Device</th>
//                     <th className="p-2 border">No.</th>
//                     <th className="p-2 border">Product Char.</th>
//                     <th className="p-2 border">Process Char.</th>
//                     <th className="p-2 border">Special Char. Class</th>
//                     <th className="p-2 border">Product/Process Spec.</th>
//                     <th className="p-2 border">Tolerance/Control Spec.</th>
//                     <th className="p-2 border">Evaluation Technique</th>
//                     <th className="p-2 border">Sample Size</th>
//                     <th className="p-2 border">Sample Freq.</th>
//                     <th className="p-2 border">Periodical Resp.</th>
//                     <th className="p-2 border">Primary Resp.</th>
//                     <th className="p-2 border">Control Method</th>
//                     <th className="p-2 border">Record</th>
//                     <th className="p-2 border">Reaction Plan</th>
//                     <th className="p-2 border">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {formData.rows.map((row, index) => (
//                     <tr key={index}>
//                       <td><input type="text" value={row.partProcessNo} onChange={(e) => handleRowChange(index, 'partProcessNo', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.processNameOperationDescription} onChange={(e) => handleRowChange(index, 'processNameOperationDescription', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.machineDeviceJigToolsForMfg} onChange={(e) => handleRowChange(index, 'machineDeviceJigToolsForMfg', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.no} onChange={(e) => handleRowChange(index, 'no', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.productCharacteristics} onChange={(e) => handleRowChange(index, 'productCharacteristics', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.processCharacteristics} onChange={(e) => handleRowChange(index, 'processCharacteristics', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.specialCharClass} onChange={(e) => handleRowChange(index, 'specialCharClass', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.productProcessSpec} onChange={(e) => handleRowChange(index, 'productProcessSpec', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.toleranceControlSpec} onChange={(e) => handleRowChange(index, 'toleranceControlSpec', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.evaluationMeasurementTechnique} onChange={(e) => handleRowChange(index, 'evaluationMeasurementTechnique', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.sampleSize} onChange={(e) => handleRowChange(index, 'sampleSize', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.sampleFreq} onChange={(e) => handleRowChange(index, 'sampleFreq', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.periodicalResp} onChange={(e) => handleRowChange(index, 'periodicalResp', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.primaryResp} onChange={(e) => handleRowChange(index, 'primaryResp', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.controlMethod} onChange={(e) => handleRowChange(index, 'controlMethod', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.record} onChange={(e) => handleRowChange(index, 'record', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td><input type="text" value={row.reactionPlan} onChange={(e) => handleRowChange(index, 'reactionPlan', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
//                       <td>
//                         <button type="button" onClick={() => removeRow(index)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="flex justify-end mt-4">
//               <button type="button" onClick={addRow} className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Add Process</button>
//             </div>
//           </div>
//         </div>

//         {/* ...Repeat for Notes, Signatures, Saved Forms, etc. using Tailwind... */}

//         <div className="flex justify-end gap-4 mt-8">
//           <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded shadow hover:bg-blue-800 transition" disabled={loading}>
//             {loading ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </form>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6">
//           {error}
//         </div>
//       )}

//       {/* Saved Forms Section */}
//       <div className="mt-12">
//         <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-6">Saved Forms</h2>
//         {loading ? (
//           <p>Loading saved forms...</p>
//         ) : savedForms.length === 0 ? (
//           <p>No saved forms yet.</p>
//         ) : (
//           savedForms.map((form, index) => (
//             <div key={index} className="bg-white rounded-xl shadow mb-6 border border-gray-200 p-6">
//               <div className="bg-blue-700 text-white px-4 py-2 rounded-t-xl -mx-6 -mt-6 mb-4">
//                 <h3 className="text-lg font-semibold">Form {index + 1} - {form.controlPlanNo}</h3>
//               </div>
//               <div>
//                 <h4 className="text-blue-700 font-semibold border-b border-dashed pb-1 mb-2">General Information</h4>
//                 <p><span className="font-bold">Part Name/Description:</span> {form.partNameDescription}</p>
//                 <p><span className="font-bold">Prepared By:</span> {form.preparedBy}</p>
//                 <p><span className="font-bold">Date (Orig):</span> {form.dateOrig}</p>
//                 <p><span className="font-bold">Production Type:</span> {form.prototype && 'Prototype '}{form.prelaunch && 'Prelaunch '}{form.production && 'Production'}</p>
//               </div>
//               {/* ...continue for process details and notes... */}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ControlPlanForm;


// import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
// import axios from 'axios';

// interface RowData {
//   partProcessNo: string;
//   processNameOperationDescription: string;
//   machineDeviceJigToolsForMfg: string;
//   no: string;
//   productCharacteristics: string;
//   processCharacteristics: string;
//   specialCharClass: string;
//   productProcessSpec: string;
//   toleranceControlSpec: string;
//   evaluationMeasurementTechnique: string;
//   sampleSize: string;
//   sampleFreq: string;
//   periodicalResp: string;
//   primaryResp: string;
//   controlMethod: string;
//   record: string;
//   reactionPlan: string;
// }

// interface FormData {
//   id?: number;
//   controlPlanNo: string;
//   keyContact: string;
//   dateOrig: string;
//   dateRev: string;
//   prototype: boolean;
//   prelaunch: boolean;
//   production: boolean;
//   coreTeam: string;
//   customerEngApprovalDate: string;
//   refPartNo: string;
//   partNoLatestChangeLevel: string;
//   supplierPlantApprovalDate: string;
//   customerQuantityApprovalDate: string;
//   partNameDescription: string;
//   otherApprovalDateIfReqd1: string;
//   otherApprovalDate1: string;
//   supplierPlant: string;
//   otherApprovalDateIfReqd2: string;
//   otherApprovalDate2: string;
//   legend: string;
//   rows: RowData[];
//   notes: string;
//   preparedBy: string;
//   checkedBy: string;
//   approvedBy: string;
//   formatNo: string;
// }

// const initialFormData: FormData = {
//   controlPlanNo: '',
//   keyContact: '',
//   dateOrig: '',
//   dateRev: '',
//   prototype: false,
//   prelaunch: false,
//   production: false,
//   coreTeam: '',
//   customerEngApprovalDate: '',
//   refPartNo: '',
//   partNoLatestChangeLevel: '',
//   supplierPlantApprovalDate: '',
//   customerQuantityApprovalDate: '',
//   partNameDescription: '',
//   otherApprovalDateIfReqd1: '',
//   otherApprovalDate1: '',
//   supplierPlant: '',
//   otherApprovalDateIfReqd2: '',
//   otherApprovalDate2: '',
//   legend: '',
//   rows: [
//     {
//       partProcessNo: '',
//       processNameOperationDescription: '',
//       machineDeviceJigToolsForMfg: '',
//       no: '',
//       productCharacteristics: '',
//       processCharacteristics: '',
//       specialCharClass: '',
//       productProcessSpec: '',
//       toleranceControlSpec: '',
//       evaluationMeasurementTechnique: '',
//       sampleSize: '',
//       sampleFreq: '',
//       periodicalResp: '',
//       primaryResp: '',
//       controlMethod: '',
//       record: '',
//       reactionPlan: ''
//     }
//   ],
//   notes: '',
//   preparedBy: '',
//   checkedBy: '',
//   approvedBy: '',
//   formatNo: ''
// };

// const API_URL = 'http://localhost:8000/api/controlplans/';

// const ControlPlanForm: React.FC = () => {
//   const [currentView, setCurrentView] = useState<'list' | 'form' | 'details'>('list');
//   const [formData, setFormData] = useState<FormData>(initialFormData);
//   const [savedForms, setSavedForms] = useState<FormData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedForm, setSelectedForm] = useState<FormData | null>(null);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     fetchForms();
//   }, []);

//   const fetchForms = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(API_URL);
//       setSavedForms(response.data);
//     } catch (err) {
//       setError('Failed to fetch saved forms.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;

//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleRowChange = (index: number, field: keyof RowData, value: string) => {
//     const updatedRows = [...formData.rows];
//     updatedRows[index] = { ...updatedRows[index], [field]: value };
//     setFormData(prev => ({ ...prev, rows: updatedRows }));
//   };

//   const addRow = () => {
//     setFormData(prev => ({
//       ...prev,
//       rows: [
//         ...prev.rows,
//         {
//           partProcessNo: '',
//           processNameOperationDescription: '',
//           machineDeviceJigToolsForMfg: '',
//           no: '',
//           productCharacteristics: '',
//           processCharacteristics: '',
//           specialCharClass: '',
//           productProcessSpec: '',
//           toleranceControlSpec: '',
//           evaluationMeasurementTechnique: '',
//           sampleSize: '',
//           sampleFreq: '',
//           periodicalResp: '',
//           primaryResp: '',
//           controlMethod: '',
//           record: '',
//           reactionPlan: ''
//         }
//       ]
//     }));
//   };

//   const removeRow = (index: number) => {
//     if (formData.rows.length > 1) {
//       const updatedRows = [...formData.rows];
//       updatedRows.splice(index, 1);
//       setFormData(prev => ({ ...prev, rows: updatedRows }));
//     }
//   };

//   const handleSave = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
      
//       if (isEditing && formData.id) {
//         const response = await axios.put(`${API_URL}${formData.id}/`, formData);
//         setSavedForms(prev => prev.map(form => 
//           form.id === formData.id ? response.data : form
//         ));
//       } else {
//         const response = await axios.post(API_URL, formData);
//         setSavedForms(prev => [...prev, response.data]);
//       }
      
//       setFormData(initialFormData);
//       setError(null);
//       setIsEditing(false);
//       setCurrentView('list');
//       alert(`Control Plan ${isEditing ? 'updated' : 'saved'} successfully!`);
//     } catch (err) {
//       setError(`Failed to ${isEditing ? 'update' : 'save'} form data. Please try again.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (form: FormData) => {
//     setFormData(form);
//     setIsEditing(true);
//     setCurrentView('form');
//   };

//   const handleViewDetails = (form: FormData) => {
//     setSelectedForm(form);
//     setCurrentView('details');
//   };

//   const handleAddNew = () => {
//     setFormData(initialFormData);
//     setIsEditing(false);
//     setCurrentView('form');
//   };

//   const getProductionType = (form: FormData) => {
//     const types = [];
//     if (form.prototype) types.push('Prototype');
//     if (form.prelaunch) types.push('Prelaunch');
//     if (form.production) types.push('Production');
//     return types.join(', ') || 'Not specified';
//   };

//   // LIST VIEW
//   if (currentView === 'list') {
//     return (
//       <div className="flex justify-center">
//         <div className="w-full max-w-7xl mt-12 mb-20 bg-white rounded-xl shadow-lg p-6">
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
//                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">Control Plans</h2>
//                 <p className="text-sm text-gray-500">Manage quality control plans and processes</p>
//               </div>
//             </div>
//             <button
//               onClick={handleAddNew}
//               className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Add New Plan
//             </button>
//           </div>

//           {loading ? (
//             <div className="flex items-center justify-center py-12">
//               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
//             </div>
//           ) : error ? (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//               {error}
//             </div>
//           ) : savedForms.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No Control Plans Found</h3>
//               <p className="text-gray-500 mb-4">Get started by creating your first control plan</p>
//               <button
//                 onClick={handleAddNew}
//                 className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//               >
//                 Create First Plan
//               </button>
//             </div>
//           ) : (
//             <div className="grid gap-6">
//               {savedForms.map((form, index) => (
//                 <div key={form.id || index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
//                   <div className="flex justify-between items-start mb-4">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2">
//                         <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
//                           Plan #{form.controlPlanNo || `${index + 1}`}
//                         </span>
//                         <span className="text-sm text-gray-500">
//                           Created: {form.dateOrig ? new Date(form.dateOrig).toLocaleDateString() : 'No date'}
//                         </span>
//                       </div>
//                       <h3 className="text-xl font-bold text-gray-900 mb-2">
//                         {form.partNameDescription || 'Untitled Control Plan'}
//                       </h3>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                         <div>
//                           <span className="font-medium text-gray-600">Key Contact:</span>
//                           <p className="text-gray-900">{form.keyContact || 'Not specified'}</p>
//                         </div>
//                         <div>
//                           <span className="font-medium text-gray-600">Core Team:</span>
//                           <p className="text-gray-900">{form.coreTeam || 'Not specified'}</p>
//                         </div>
//                         <div>
//                           <span className="font-medium text-gray-600">Production Type:</span>
//                           <p className="text-gray-900">{getProductionType(form)}</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleViewDetails(form)}
//                         className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
//                       >
//                         View
//                       </button>
//                       <button
//                         onClick={() => handleEdit(form)}
//                         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
//                       >
//                         Edit
//                       </button>
//                     </div>
//                   </div>
                  
//                   <div className="border-t pt-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-4 text-sm text-gray-600">
//                         <span className="flex items-center gap-1">
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                             <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                           </svg>
//                           {form.rows?.length || 0} processes
//                         </span>
//                         {form.preparedBy && (
//                           <span className="flex items-center gap-1">
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                               <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                             </svg>
//                             Prepared by {form.preparedBy}
//                           </span>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {form.dateRev && (
//                           <span className="text-xs text-gray-500">
//                             Rev: {new Date(form.dateRev).toLocaleDateString()}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // DETAILS VIEW
//   if (currentView === 'details' && selectedForm) {
//     return (
//       <div className="max-w-full mx-auto p-6">
//         <div className="bg-white rounded-xl shadow-lg mb-6">
//           <div className="flex justify-between items-center p-6 border-b">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900">Control Plan Details</h2>
//               <p className="text-gray-500">Plan #{selectedForm.controlPlanNo}</p>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setCurrentView('list')}
//                 className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
//               >
//                 Back to List
//               </button>
//               <button
//                 onClick={() => handleEdit(selectedForm)}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//               >
//                 Edit Plan
//               </button>
//             </div>
//           </div>

//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//               <div className="space-y-1">
//                 <dt className="text-sm font-medium text-gray-600">Part Name/Description</dt>
//                 <dd className="text-sm text-gray-900">{selectedForm.partNameDescription || 'Not specified'}</dd>
//               </div>
//               <div className="space-y-1">
//                 <dt className="text-sm font-medium text-gray-600">Key Contact</dt>
//                 <dd className="text-sm text-gray-900">{selectedForm.keyContact || 'Not specified'}</dd>
//               </div>
//               <div className="space-y-1">
//                 <dt className="text-sm font-medium text-gray-600">Core Team</dt>
//                 <dd className="text-sm text-gray-900">{selectedForm.coreTeam || 'Not specified'}</dd>
//               </div>
//               <div className="space-y-1">
//                 <dt className="text-sm font-medium text-gray-600">Production Type</dt>
//                 <dd className="text-sm text-gray-900">{getProductionType(selectedForm)}</dd>
//               </div>
//               <div className="space-y-1">
//                 <dt className="text-sm font-medium text-gray-600">Date Original</dt>
//                 <dd className="text-sm text-gray-900">
//                   {selectedForm.dateOrig ? new Date(selectedForm.dateOrig).toLocaleDateString() : 'Not specified'}
//                 </dd>
//               </div>
//               <div className="space-y-1">
//                 <dt className="text-sm font-medium text-gray-600">Date Revised</dt>
//                 <dd className="text-sm text-gray-900">
//                   {selectedForm.dateRev ? new Date(selectedForm.dateRev).toLocaleDateString() : 'Not specified'}
//                 </dd>
//               </div>
//             </div>

//             {selectedForm.rows && selectedForm.rows.length > 0 && (
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Details</h3>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full border border-gray-200 rounded-lg">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Part/Process No.</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Process Name/Operation</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Machine/Device/Jig</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product Char.</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Process Char.</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Special Char. Class</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product/Process Spec.</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tolerance/Control Spec.</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Evaluation Technique</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sample Size</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sample Freq.</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Periodical Resp.</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Primary Resp.</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Control Method</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Record</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reaction Plan</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {selectedForm.rows.map((row, index) => (
//                         <tr key={index} className="hover:bg-gray-50">
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.partProcessNo}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.processNameOperationDescription}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.machineDeviceJigToolsForMfg}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.no}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.productCharacteristics}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.processCharacteristics}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.specialCharClass}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.productProcessSpec}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.toleranceControlSpec}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.evaluationMeasurementTechnique}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.sampleSize}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.sampleFreq}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.periodicalResp}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.primaryResp}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.controlMethod}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.record}</td>
//                           <td className="px-3 py-2 text-sm text-gray-900">{row.reactionPlan}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // FORM VIEW
//   return (
//     <div className="max-w-full mx-auto p-6 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             {isEditing ? 'Edit Control Plan' : 'New Control Plan'}
//           </h1>
//           <p className="text-gray-600">
//             {isEditing ? 'Update control plan details' : 'Create a comprehensive quality control plan'}
//           </p>
//         </div>
//         <button
//           onClick={() => setCurrentView('list')}
//           className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
//         >
//           Back to List
//         </button>
//       </div>

//       <form onSubmit={handleSave}>
//         {/* Header Information Section */}
//         <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
//           <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-xl">
//             <h2 className="text-white text-xl font-semibold">Header Information</h2>
//           </div>
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Control Plan No.</label>
//                 <input
//                   type="text"
//                   name="controlPlanNo"
//                   value={formData.controlPlanNo}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter control plan number"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Key Contact</label>
//                 <input
//                   type="text"
//                   name="keyContact"
//                   value={formData.keyContact}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter key contact name"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Part Name/Description</label>
//                 <input
//                   type="text"
//                   name="partNameDescription"
//                   value={formData.partNameDescription}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter part name or description"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Date (Original)</label>
//                 <input
//                   type="date"
//                   name="dateOrig"
//                   value={formData.dateOrig}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Date (Revised)</label>
//                 <input
//                   type="date"
//                   name="dateRev"
//                   value={formData.dateRev}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Production Type</label>
//                 <div className="flex gap-6">
//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       name="prototype"
//                       checked={formData.prototype}
//                       onChange={handleChange}
//                       className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     />
//                     Prototype
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       name="prelaunch"
//                       checked={formData.prelaunch}
//                       onChange={handleChange}
//                       className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     />
//                     Prelaunch
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       name="production"
//                       checked={formData.production}
//                       onChange={handleChange}
//                       className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     />
//                     Production
//                   </label>
//                 </div>
//               </div>
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Core Team</label>
//                 <input
//                   type="text"
//                   name="coreTeam"
//                   value={formData.coreTeam}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter core team members"
//                 />
//               </div>
//             </div>

//             {/* Additional Header Fields */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Customer Engg. Approval/Date</label>
//                 <input
//                   type="text"
//                   name="customerEngApprovalDate"
//                   value={formData.customerEngApprovalDate}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Ref. Part No.</label>
//                 <input
//                   type="text"
//                   name="refPartNo"
//                   value={formData.refPartNo}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Part No. Latest Change Level</label>
//                 <input
//                   type="text"
//                   name="partNoLatestChangeLevel"
//                   value={formData.partNoLatestChangeLevel}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Supplier/Plant Approval Date</label>
//                 <input
//                   type="text"
//                   name="supplierPlantApprovalDate"
//                   value={formData.supplierPlantApprovalDate}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Customer Quantity Approval Date</label>
//                 <input
//                   type="text"
//                   name="customerQuantityApprovalDate"
//                   value={formData.customerQuantityApprovalDate}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Supplier/Plant</label>
//                 <input
//                   type="text"
//                   name="supplierPlant"
//                   value={formData.supplierPlant}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Other Approval Date if Req'd 1</label>
//                 <input
//                   type="text"
//                   name="otherApprovalDateIfReqd1"
//                   value={formData.otherApprovalDateIfReqd1}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Other Approval Date 1</label>
//                 <input
//                   type="text"
//                   name="otherApprovalDate1"
//                   value={formData.otherApprovalDate1}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Other Approval Date if Req'd 2</label>
//                 <input
//                   type="text"
//                   name="otherApprovalDateIfReqd2"
//                   value={formData.otherApprovalDateIfReqd2}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Other Approval Date 2</label>
//                 <input
//                   type="text"
//                   name="otherApprovalDate2"
//                   value={formData.otherApprovalDate2}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Legend</label>
//                 <input
//                   type="text"
//                   name="legend"
//                   value={formData.legend}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Format No.</label>
//                 <input
//                   type="text"
//                   name="formatNo"
//                   value={formData.formatNo}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Process Details Section - WITH ALL COLUMNS */}
//         <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
//           <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-xl">
//             <h2 className="text-white text-xl font-semibold">Process Details</h2>
//           </div>
//           <div className="p-6">
//             <div className="overflow-x-auto">
//               <table className="min-w-full border border-gray-200 rounded-lg text-xs">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Part / Process No.</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Process Name / Operation</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Machine / Device</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">No.</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Product Char.</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Process Char.</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Special Char. Class</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Product/Process Spec.</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Tolerance/Control Spec.</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Evaluation Technique</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Sample Size</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Sample Freq.</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Periodical Resp.</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Primary Resp.</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Control Method</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Record</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Reaction Plan</th>
//                     <th className="p-2 border text-left font-medium text-gray-500 uppercase">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {formData.rows.map((row, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.partProcessNo}
//                           onChange={(e) => handleRowChange(index, 'partProcessNo', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.processNameOperationDescription}
//                           onChange={(e) => handleRowChange(index, 'processNameOperationDescription', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.machineDeviceJigToolsForMfg}
//                           onChange={(e) => handleRowChange(index, 'machineDeviceJigToolsForMfg', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.no}
//                           onChange={(e) => handleRowChange(index, 'no', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.productCharacteristics}
//                           onChange={(e) => handleRowChange(index, 'productCharacteristics', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.processCharacteristics}
//                           onChange={(e) => handleRowChange(index, 'processCharacteristics', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.specialCharClass}
//                           onChange={(e) => handleRowChange(index, 'specialCharClass', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.productProcessSpec}
//                           onChange={(e) => handleRowChange(index, 'productProcessSpec', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.toleranceControlSpec}
//                           onChange={(e) => handleRowChange(index, 'toleranceControlSpec', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.evaluationMeasurementTechnique}
//                           onChange={(e) => handleRowChange(index, 'evaluationMeasurementTechnique', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.sampleSize}
//                           onChange={(e) => handleRowChange(index, 'sampleSize', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.sampleFreq}
//                           onChange={(e) => handleRowChange(index, 'sampleFreq', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.periodicalResp}
//                           onChange={(e) => handleRowChange(index, 'periodicalResp', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.primaryResp}
//                           onChange={(e) => handleRowChange(index, 'primaryResp', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.controlMethod}
//                           onChange={(e) => handleRowChange(index, 'controlMethod', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.record}
//                           onChange={(e) => handleRowChange(index, 'record', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <input
//                           type="text"
//                           value={row.reactionPlan}
//                           onChange={(e) => handleRowChange(index, 'reactionPlan', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-1 border">
//                         <button
//                           type="button"
//                           onClick={() => removeRow(index)}
//                           className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors disabled:opacity-50"
//                           disabled={formData.rows.length === 1}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="flex justify-end mt-4">
//               <button
//                 type="button"
//                 onClick={addRow}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//               >
//                 Add Process
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Additional Fields */}
//         <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
//           <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-t-xl">
//             <h2 className="text-white text-xl font-semibold">Additional Information</h2>
//           </div>
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Prepared By</label>
//                 <input
//                   type="text"
//                   name="preparedBy"
//                   value={formData.preparedBy}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter name"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Checked By</label>
//                 <input
//                   type="text"
//                   name="checkedBy"
//                   value={formData.checkedBy}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter name"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Approved By</label>
//                 <input
//                   type="text"
//                   name="approvedBy"
//                   value={formData.approvedBy}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter name"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Notes</label>
//               <textarea
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 rows={4}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter any additional notes or comments"
//               />
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         <div className="flex justify-end gap-4">
//           <button
//             type="button"
//             onClick={() => setCurrentView('list')}
//             className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? 'Saving...' : isEditing ? 'Update Plan' : 'Save Plan'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ControlPlanForm;

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';

interface RowData {
  partProcessNo: string;
  processNameOperationDescription: string;
  machineDeviceJigToolsForMfg: string;
  no: string;
  productCharacteristics: string;
  processCharacteristics: string;
  specialCharClass: string;
  productProcessSpec: string;
  toleranceControlSpec: string;
  evaluationMeasurementTechnique: string;
  sampleSize: string;
  sampleFreq: string;
  periodicalResp: string;
  primaryResp: string;
  controlMethod: string;
  record: string;
  reactionPlan: string;
}

interface FormData {
  id?: number;
  controlPlanNo: string;
  keyContact: string;
  dateOrig: string;
  dateRev: string;
  prototype: boolean;
  prelaunch: boolean;
  production: boolean;
  coreTeam: string;
  customerEngApprovalDate: string;
  refPartNo: string;
  partNoLatestChangeLevel: string;
  supplierPlantApprovalDate: string;
  customerQuantityApprovalDate: string;
  partNameDescription: string;
  otherApprovalDateIfReqd1: string;
  otherApprovalDate1: string;
  supplierPlant: string;
  otherApprovalDateIfReqd2: string;
  otherApprovalDate2: string;
  legend: string;
  rows: RowData[];
  notes: string;
  preparedBy: string;
  checkedBy: string;
  approvedBy: string;
  formatNo: string;
}

const initialFormData: FormData = {
  controlPlanNo: '',
  keyContact: '',
  dateOrig: '',
  dateRev: '',
  prototype: false,
  prelaunch: false,
  production: false,
  coreTeam: '',
  customerEngApprovalDate: '',
  refPartNo: '',
  partNoLatestChangeLevel: '',
  supplierPlantApprovalDate: '',
  customerQuantityApprovalDate: '',
  partNameDescription: '',
  otherApprovalDateIfReqd1: '',
  otherApprovalDate1: '',
  supplierPlant: '',
  otherApprovalDateIfReqd2: '',
  otherApprovalDate2: '',
  legend: '',
  rows: [
    {
      partProcessNo: '',
      processNameOperationDescription: '',
      machineDeviceJigToolsForMfg: '',
      no: '',
      productCharacteristics: '',
      processCharacteristics: '',
      specialCharClass: '',
      productProcessSpec: '',
      toleranceControlSpec: '',
      evaluationMeasurementTechnique: '',
      sampleSize: '',
      sampleFreq: '',
      periodicalResp: '',
      primaryResp: '',
      controlMethod: '',
      record: '',
      reactionPlan: ''
    }
  ],
  notes: '',
  preparedBy: '',
  checkedBy: '',
  approvedBy: '',
  formatNo: ''
};

const API_URL = 'http://localhost:8000/api/controlplans/';

const ControlPlanForm: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'form' | 'details'>('list');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [savedForms, setSavedForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setSavedForms(response.data);
    } catch (err) {
      setError('Failed to fetch saved forms.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRowChange = (index: number, field: keyof RowData, value: string) => {
    const updatedRows = [...formData.rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setFormData(prev => ({ ...prev, rows: updatedRows }));
  };

  const addRow = () => {
    setFormData(prev => ({
      ...prev,
      rows: [
        ...prev.rows,
        {
          partProcessNo: '',
          processNameOperationDescription: '',
          machineDeviceJigToolsForMfg: '',
          no: '',
          productCharacteristics: '',
          processCharacteristics: '',
          specialCharClass: '',
          productProcessSpec: '',
          toleranceControlSpec: '',
          evaluationMeasurementTechnique: '',
          sampleSize: '',
          sampleFreq: '',
          periodicalResp: '',
          primaryResp: '',
          controlMethod: '',
          record: '',
          reactionPlan: ''
        }
      ]
    }));
  };

  const removeRow = (index: number) => {
    if (formData.rows.length > 1) {
      const updatedRows = [...formData.rows];
      updatedRows.splice(index, 1);
      setFormData(prev => ({ ...prev, rows: updatedRows }));
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (isEditing && formData.id) {
        const response = await axios.put(`${API_URL}${formData.id}/`, formData);
        setSavedForms(prev => prev.map(form => 
          form.id === formData.id ? response.data : form
        ));
      } else {
        const response = await axios.post(API_URL, formData);
        setSavedForms(prev => [...prev, response.data]);
      }
      
      setFormData(initialFormData);
      setError(null);
      setIsEditing(false);
      setCurrentView('list');
      alert(`Control Plan ${isEditing ? 'updated' : 'saved'} successfully!`);
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'save'} form data. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (form: FormData) => {
    setFormData(form);
    setIsEditing(true);
    setCurrentView('form');
  };

  const handleViewDetails = (form: FormData) => {
    setSelectedForm(form);
    setCurrentView('details');
  };

  const handleAddNew = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setCurrentView('form');
  };

  const getProductionType = (form: FormData) => {
    const types = [];
    if (form.prototype) types.push('Prototype');
    if (form.prelaunch) types.push('Prelaunch');
    if (form.production) types.push('Production');
    return types.join(', ') || 'Not specified';
  };

  // LIST VIEW - COMPACT AND REDUCED HEIGHT
  if (currentView === 'list') {
    return (
      <div className="bg-[#f6faff] min-h-screen p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Control Plans</h1>
                <p className="text-blue-100 text-sm mt-1">Quality control plan management and documentation</p>
              </div>
              <button
                onClick={handleAddNew}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add New Plan</span>
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading control plans...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && savedForms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-4 mb-3">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-blue-700 mb-2">No Control Plans Found</h2>
            <p className="text-gray-500 mb-6 text-center max-w-md text-sm">
              Get started by creating your first quality control plan to manage your manufacturing processes.
            </p>
            <button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Create First Plan
            </button>
          </div>
        )}

        {!loading && savedForms.length > 0 && (
          <div className="grid gap-4">
            {savedForms.map((form, index) => (
              <div
                key={form.id || index}
                className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-blue-500 hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {form.partNameDescription || `Control Plan #${index + 1}`}
                    </h3>
                    <div className="flex items-center space-x-3 text-sm opacity-90">
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                        Plan #{form.controlPlanNo || `${index + 1}`}
                      </span>
                      <span className="flex items-center text-xs">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {form.dateOrig ? new Date(form.dateOrig).toLocaleDateString() : 'No date'}
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
                        <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-semibold text-gray-700 text-sm">Contact & Team</span>
                      </div>
                      <p className="text-base font-bold text-blue-800">{form.keyContact || 'Not specified'}</p>
                      <p className="text-xs text-gray-600">Team: {form.coreTeam || 'Not specified'}</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="font-semibold text-gray-700 text-sm">Process Count</span>
                      </div>
                      <p className="text-base font-bold text-green-800">{form.rows?.length || 0} processes</p>
                      <p className="text-xs text-gray-600">Production: {getProductionType(form)}</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 text-purple-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-semibold text-gray-700 text-sm">Part Details</span>
                      </div>
                      <p className="text-base font-bold text-purple-800">{form.refPartNo || 'Not specified'}</p>
                      <p className="text-xs text-gray-600">Supplier: {form.supplierPlant || 'Not specified'}</p>
                    </div>
                  </div>

                  {/* Process Overview */}
                  {form.rows && form.rows.length > 0 && (
                    <div className="bg-amber-50 rounded-lg p-3 mb-3">
                      <h4 className="font-semibold text-amber-800 mb-2 text-sm">Key Processes</h4>
                      <div className="text-xs text-gray-700">
                        {form.rows.slice(0, 3).map((row, i) => (
                          <div key={i} className="flex items-center mb-1">
                            <span className="bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold mr-2">
                              {i + 1}
                            </span>
                            <span className="flex-1">
                              {row.processNameOperationDescription || row.partProcessNo || 'Process not defined'}
                            </span>
                            {row.productCharacteristics && (
                              <span className="bg-amber-200 text-amber-800 px-2 py-0.5 rounded text-xs ml-2">
                                {row.productCharacteristics.slice(0, 15)}{row.productCharacteristics.length > 15 ? '...' : ''}
                              </span>
                            )}
                          </div>
                        ))}
                        {form.rows.length > 3 && (
                          <span className="text-gray-500 text-xs">... and {form.rows.length - 3} more processes</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes Preview */}
                  {form.notes && (
                    <div className="bg-indigo-50 rounded-lg p-3 mb-3">
                      <h4 className="font-semibold text-indigo-800 mb-1 text-sm">Notes</h4>
                      <p className="text-xs text-gray-700">
                        {form.notes.length > 100 ? `${form.notes.slice(0, 100)}...` : form.notes}
                      </p>
                    </div>
                  )}

                  {/* Footer with Actions */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      {form.preparedBy && (
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <strong>Prepared:</strong> {form.preparedBy}
                        </span>
                      )}
                      {form.checkedBy && (
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <strong>Checked:</strong> {form.checkedBy}
                        </span>
                      )}
                      {form.dateRev && (
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <strong>Rev:</strong> {new Date(form.dateRev).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(form)}
                        className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleEdit(form)}
                        className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium"
                      >
                        Edit Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // DETAILS VIEW - MATCHED TO DASHBOARD WIDTH
  if (currentView === 'details' && selectedForm) {
    return (
      <div className="bg-[#f6faff] min-h-screen p-6">
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Control Plan Details</h2>
              <p className="text-gray-500">Plan #{selectedForm.controlPlanNo}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentView('list')}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to List
              </button>
              <button
                onClick={() => handleEdit(selectedForm)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edit Plan
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="space-y-1">
                <dt className="text-sm font-medium text-gray-600">Part Name/Description</dt>
                <dd className="text-sm text-gray-900">{selectedForm.partNameDescription || 'Not specified'}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-gray-600">Key Contact</dt>
                <dd className="text-sm text-gray-900">{selectedForm.keyContact || 'Not specified'}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-gray-600">Core Team</dt>
                <dd className="text-sm text-gray-900">{selectedForm.coreTeam || 'Not specified'}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-gray-600">Production Type</dt>
                <dd className="text-sm text-gray-900">{getProductionType(selectedForm)}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-gray-600">Date Original</dt>
                <dd className="text-sm text-gray-900">
                  {selectedForm.dateOrig ? new Date(selectedForm.dateOrig).toLocaleDateString() : 'Not specified'}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-gray-600">Date Revised</dt>
                <dd className="text-sm text-gray-900">
                  {selectedForm.dateRev ? new Date(selectedForm.dateRev).toLocaleDateString() : 'Not specified'}
                </dd>
              </div>
            </div>

            {selectedForm.rows && selectedForm.rows.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Details</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Part/Process No.</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Process Name/Operation</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Machine/Device/Jig</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product Char.</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Process Char.</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Special Char. Class</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product/Process Spec.</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tolerance/Control Spec.</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Evaluation Technique</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sample Size</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sample Freq.</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Periodical Resp.</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Primary Resp.</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Control Method</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Record</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reaction Plan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedForm.rows.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-900">{row.partProcessNo}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.processNameOperationDescription}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.machineDeviceJigToolsForMfg}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.no}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.productCharacteristics}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.processCharacteristics}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.specialCharClass}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.productProcessSpec}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.toleranceControlSpec}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.evaluationMeasurementTechnique}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.sampleSize}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.sampleFreq}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.periodicalResp}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.primaryResp}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.controlMethod}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.record}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.reactionPlan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // FORM VIEW - MATCHED TO DASHBOARD WIDTH WITH 3 FIELDS PER ROW
  return (
    <div className="bg-[#f6faff] min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Control Plan' : 'New Control Plan'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update control plan details' : 'Create a comprehensive quality control plan'}
          </p>
        </div>
        <button
          onClick={() => setCurrentView('list')}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back to List
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* Header Information Section */}
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-100 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-t-xl">
            <h2 className="text-white text-xl font-semibold">Header Information</h2>
          </div>
          <div className="p-6">
            {/* Row 1 - 3 fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Control Plan No.</label>
                <input
                  type="text"
                  name="controlPlanNo"
                  value={formData.controlPlanNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Key Contact</label>
                <input
                  type="text"
                  name="keyContact"
                  value={formData.keyContact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Date (Orig)</label>
                <input
                  type="date"
                  name="dateOrig"
                  value={formData.dateOrig}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 2 - 3 fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Date (Rev)</label>
                <input
                  type="date"
                  name="dateRev"
                  value={formData.dateRev}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Core Team</label>
                <input
                  type="text"
                  name="coreTeam"
                  value={formData.coreTeam}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Customer Engg. Approval/Date</label>
                <input
                  type="text"
                  name="customerEngApprovalDate"
                  value={formData.customerEngApprovalDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 3 - 3 fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Ref. Part No.</label>
                <input
                  type="text"
                  name="refPartNo"
                  value={formData.refPartNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Part Name/Description</label>
                <input
                  type="text"
                  name="partNameDescription"
                  value={formData.partNameDescription}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Part No. Latest Change Level</label>
                <input
                  type="text"
                  name="partNoLatestChangeLevel"
                  value={formData.partNoLatestChangeLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 4 - 3 fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Supplier/Plant Approval Date</label>
                <input
                  type="text"
                  name="supplierPlantApprovalDate"
                  value={formData.supplierPlantApprovalDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Customer Quantity Approval Date</label>
                <input
                  type="text"
                  name="customerQuantityApprovalDate"
                  value={formData.customerQuantityApprovalDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Supplier/Plant</label>
                <input
                  type="text"
                  name="supplierPlant"
                  value={formData.supplierPlant}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 5 - 3 fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Other Approval Date if Req'd 1</label>
                <input
                  type="text"
                  name="otherApprovalDateIfReqd1"
                  value={formData.otherApprovalDateIfReqd1}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Other Approval Date 1</label>
                <input
                  type="text"
                  name="otherApprovalDate1"
                  value={formData.otherApprovalDate1}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Other Approval Date if Req'd 2</label>
                <input
                  type="text"
                  name="otherApprovalDateIfReqd2"
                  value={formData.otherApprovalDateIfReqd2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 6 - 3 fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Other Approval Date 2</label>
                <input
                  type="text"
                  name="otherApprovalDate2"
                  value={formData.otherApprovalDate2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Legend</label>
                <input
                  type="text"
                  name="legend"
                  value={formData.legend}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Format No.</label>
                <input
                  type="text"
                  name="formatNo"
                  value={formData.formatNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Production Type - Checkboxes */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Production Type</label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="prototype"
                    checked={formData.prototype}
                    onChange={handleChange}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Prototype</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="prelaunch"
                    checked={formData.prelaunch}
                    onChange={handleChange}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Prelaunch</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="production"
                    checked={formData.production}
                    onChange={handleChange}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Production</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Process Details Section - WITH ALL COLUMNS */}
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-100 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-t-xl">
            <h2 className="text-white text-xl font-semibold">Process Details</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Part / Process No.</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Process Name / Operation</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Machine / Device</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">No.</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Product Char.</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Process Char.</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Special Char. Class</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Product/Process Spec.</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Tolerance/Control Spec.</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Evaluation Technique</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Sample Size</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Sample Freq.</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Periodical Resp.</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Primary Resp.</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Control Method</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Record</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Reaction Plan</th>
                    <th className="p-2 border text-left font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.rows.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.partProcessNo}
                          onChange={(e) => handleRowChange(index, 'partProcessNo', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.processNameOperationDescription}
                          onChange={(e) => handleRowChange(index, 'processNameOperationDescription', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.machineDeviceJigToolsForMfg}
                          onChange={(e) => handleRowChange(index, 'machineDeviceJigToolsForMfg', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.no}
                          onChange={(e) => handleRowChange(index, 'no', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.productCharacteristics}
                          onChange={(e) => handleRowChange(index, 'productCharacteristics', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.processCharacteristics}
                          onChange={(e) => handleRowChange(index, 'processCharacteristics', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.specialCharClass}
                          onChange={(e) => handleRowChange(index, 'specialCharClass', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.productProcessSpec}
                          onChange={(e) => handleRowChange(index, 'productProcessSpec', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.toleranceControlSpec}
                          onChange={(e) => handleRowChange(index, 'toleranceControlSpec', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.evaluationMeasurementTechnique}
                          onChange={(e) => handleRowChange(index, 'evaluationMeasurementTechnique', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.sampleSize}
                          onChange={(e) => handleRowChange(index, 'sampleSize', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.sampleFreq}
                          onChange={(e) => handleRowChange(index, 'sampleFreq', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.periodicalResp}
                          onChange={(e) => handleRowChange(index, 'periodicalResp', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.primaryResp}
                          onChange={(e) => handleRowChange(index, 'primaryResp', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.controlMethod}
                          onChange={(e) => handleRowChange(index, 'controlMethod', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.record}
                          onChange={(e) => handleRowChange(index, 'record', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <input
                          type="text"
                          value={row.reactionPlan}
                          onChange={(e) => handleRowChange(index, 'reactionPlan', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1 border">
                        <button
                          type="button"
                          onClick={() => removeRow(index)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors disabled:opacity-50"
                          disabled={formData.rows.length === 1}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={addRow}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Add Process
              </button>
            </div>
          </div>
        </div>

        {/* Additional Fields */}
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-100 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-t-xl">
            <h2 className="text-white text-xl font-semibold">Additional Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Prepared By</label>
                <input
                  type="text"
                  name="preparedBy"
                  value={formData.preparedBy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Checked By</label>
                <input
                  type="text"
                  name="checkedBy"
                  value={formData.checkedBy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Approved By</label>
                <input
                  type="text"
                  name="approvedBy"
                  value={formData.approvedBy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setCurrentView('list')}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 text-sm"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Plan' : 'Save Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ControlPlanForm;



