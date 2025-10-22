
// import React, { useState, useEffect } from 'react';

// // Define the record interface
// interface Record {
//   srNo: number;
//   recordNo: string;
//   revNo: string;
//   revDate: string;
//   recordName: string;
//   retentionPeriod: string;
//   disposalAuthority: string;
//   file: File | null;
// }

// // Demo Data with placeholder files
// const demoData: Record[] = [
//   {
//     srNo: 1,
//     recordNo: 'MS-4M-WI-01',
//     revNo: '0.0',
//     revDate: '4/1/2017',
//     recordName: '4M change identification sheet (Planned/unplanned)',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Head quality/Prod.',
//     file: new File(['sample content'], 'sample1.pdf', { type: 'application/pdf' }),
//   },
//   {
//     srNo: 2,
//     recordNo: 'MS-4M-WI-01a',
//     revNo: '0.0',
//     revDate: '4/1/2017',
//     recordName: 'Handling of abnormal situation',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Head quality/Prod.',
//     file: new File(['sample content'], 'sample2.doc', { type: 'application/msword' }),
//   },
//   {
//     srNo: 3,
//     recordNo: 'MS-4M-02',
//     revNo: '0.0',
//     revDate: '3/25/2017',
//     recordName: 'List of break down',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Head quality/Prod.',
//     file: null,
//   },
//   {
//     srNo: 4,
//     recordNo: 'MS-4M-03',
//     revNo: '0.0',
//     revDate: '4/1/2017',
//     recordName: '4M change information flow sheet',
//     retentionPeriod: 'Up to tool life',
//     disposalAuthority: 'Head quality/Prod.',
//     file: new File(['sample content'], 'sample3.png', { type: 'image/png' }),
//   },
//   {
//     srNo: 5,
//     recordNo: 'MS-4M-04',
//     revNo: '0.0',
//     revDate: '4/1/2017',
//     recordName: '4M change identification tag',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Head quality/Prod.',
//     file: null,
//   },
//   {
//     srNo: 6,
//     recordNo: 'MS-4M-07',
//     revNo: '0.0',
//     revDate: '4/1/2017',
//     recordName: '4M change traceability record sheet',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Head quality/Prod.',
//     file: new File(['sample content'], 'sample4.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
//   },
//   {
//     srNo: 7,
//     recordNo: 'MS-4M-06',
//     revNo: '0.0',
//     revDate: '4/1/2017',
//     recordName: '4M Change inspection report',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Head quality',
//     file: null,
//   },
//   {
//     srNo: 8,
//     recordNo: 'MS-4M-05A',
//     revNo: '0.0',
//     revDate: '4/10/2017',
//     recordName: '4M Change summary sheet',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Head quality',
//     file: new File(['sample content'], 'sample5.jpg', { type: 'image/jpeg' }),
//   },
//   {
//     srNo: 9,
//     recordNo: 'MS-4M-05',
//     revNo: '0.0',
//     revDate: '4/1/2017',
//     recordName: '4M Change record sheet',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Quality Sup.',
//     file: null,
//   },
//   {
//     srNo: 10,
//     recordNo: 'MS-4M-08',
//     revNo: '0.0',
//     revDate: '4/1/2017',
//     recordName: '4M Change display board',
//     retentionPeriod: 'Daily',
//     disposalAuthority: 'Quality Sup.',
//     file: new File(['sample content'], 'sample6.pdf', { type: 'application/pdf' }),
//   },
// ];

// // Header Info
// const headerInfo = {
//   docNo: 'MS/4M/PR/05',
//   revNo: '28.02.20',
//   date: '28.02.20',
//   processName: '4M Change Procedure',
//   purpose: 'To implement the system for control the 4M (Man, Machine, Material, Method) changes in process',
//   scope: 'Applicable to all manufacturing process',
//   processOwner: 'Head quality & Production',
// };

// // Component
// const FourMChangeProcedure: React.FC = () => {
//   const [records, setRecords] = useState<Record[]>(demoData);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState<Record>({
//     srNo: 0,
//     recordNo: '',
//     revNo: '',
//     revDate: '',
//     recordName: '',
//     retentionPeriod: '',
//     disposalAuthority: '',
//     file: null,
//   });
//   const [editingIndex, setEditingIndex] = useState<number>(-1);

//   useEffect(() => {
//     const updatedRecords = records.map((record, index) => ({
//       ...record,
//       srNo: index + 1,
//     }));
//     setRecords(updatedRecords);
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       file: e.target.files ? e.target.files[0] : null,
//     }));
//   };

//   const handleAdd = () => {
//     if (editingIndex === -1) {
//       const newRecord: Record = {
//         ...formData,
//         srNo: records.length + 1,
//       };
//       setRecords([...records, newRecord]);
//     } else {
//       const updatedRecords = [...records];
//       updatedRecords[editingIndex] = { ...formData, srNo: records[editingIndex].srNo };
//       setRecords(updatedRecords);
//       setEditingIndex(-1);
//     }

//     setFormData({
//       srNo: 0,
//       recordNo: '',
//       revNo: '',
//       revDate: '',
//       recordName: '',
//       retentionPeriod: '',
//       disposalAuthority: '',
//       file: null,
//     });
//     setShowForm(false);
//   };

//   const handleEdit = (index: number) => {
//     const record = records[index];
//     setFormData(record);
//     setEditingIndex(index);
//     setShowForm(true);
//   };

//   const handleDelete = (index: number) => {
//     if (window.confirm('Are you sure you want to delete this record?')) {
//       const updatedRecords = records.filter((_, i) => i !== index);
//       setRecords(updatedRecords);
//     }
//   };

//   const handleCancel = () => {
//     setShowForm(false);
//     setEditingIndex(-1);
//     setFormData({
//       srNo: 0,
//       recordNo: '',
//       revNo: '',
//       revDate: '',
//       recordName: '',
//       retentionPeriod: '',
//       disposalAuthority: '',
//       file: null,
//     });
//   };

//   // Inline CSS (truncated for brevity, include full CSS from previous version if needed)
//   const styles = `
//     .container {
//       max-width: 1400px;
//       margin: 0 auto;
//       padding: 20px;
//       font-family: 'Arial', sans-serif;
//       background-color: #f5f5f5;
//     }

//     .header-section {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       background: white;
//       padding: 20px;
//       border-radius: 8px;
//       box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//       margin-bottom: 20px;
//     }

//     .logo-placeholder {
//       font-size: 2rem;
//       margin-right: 20px;
//     }

//     .main-title {
//       font-size: 2rem;
//       font-weight: bold;
//       color: #2c3e50;
//       flex-grow: 1;
//       text-align: center;
//     }

//     .header-info {
//       display: flex;
//       flex-direction: column;
//       gap: 5px;
//       font-size: 0.9rem;
//     }

//     .info-row {
//       display: flex;
//       gap: 10px;
//     }

//     .label {
//       font-weight: bold;
//       min-width: 70px;
//     }

//     .value {
//       color: #34495e;
//     }

//     .process-info {
//       background: white;
//       padding: 20px;
//       border-radius: 8px;
//       box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//       margin-bottom: 20px;
//     }

//     .info-grid {
//       display: grid;
//       grid-template-columns: 1fr 1fr;
//       gap: 15px;
//     }

//     .info-item {
//       padding: 10px;
//       border: 1px solid #ddd;
//       border-radius: 4px;
//       background: #fafafa;
//     }

//     .action-buttons {
//       display: flex;
//       gap: 10px;
//       margin-bottom: 20px;
//       justify-content: flex-end;
//     }

//     .btn {
//       padding: 10px 20px;
//       border: none;
//       border-radius: 4px;
//       cursor: pointer;
//       font-size: 14px;
//       transition: background-color 0.3s;
//     }

//     .btn-primary {
//       background-color: #3498db;
//       color: white;
//     }

//     .btn-primary:hover {
//       background-color: #2980b9;
//     }

//     .btn-secondary {
//       background-color: #95a5a6;
//       color: white;
//     }

//     .btn-secondary:hover {
//       background-color: #7f8c8d;
//     }

//     .form-overlay {
//       position: fixed;
//       top: 0;
//       left: 0;
//       right: 0;
//       bottom: 0;
//       background: rgba(0,0,0,0.5);
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       z-index: 1000;
//     }

//     .form-container {
//       background: white;
//       padding: 30px;
//       border-radius: 8px;
//       max-width: 600px;
//       width: 90%;
//       max-height: 90vh;
//       overflow-y: auto;
//       box-shadow: 0 4px 20px rgba(0,0,0,0.3);
//     }

//     .form-container h3 {
//       margin-bottom: 20px;
//       color: #2c3e50;
//       text-align: center;
//     }

//     .form-grid {
//       display: grid;
//       gap: 15px;
//       margin-bottom: 20px;
//     }

//     .form-group {
//       display: flex;
//       flex-direction: column;
//     }

//     .form-group.full-width {
//       grid-column: 1 / -1;
//     }

//     .form-group label {
//       font-weight: bold;
//       margin-bottom: 5px;
//       color: #34495e;
//     }

//     .form-group input,
//     .form-group select,
//     .form-group textarea {
//       padding: 8px 12px;
//       border: 1px solid #ddd;
//       border-radius: 4px;
//       font-size: 14px;
//     }

//     .form-group input:focus,
//     .form-group select:focus,
//     .form-group textarea:focus {
//       outline: none;
//       border-color: #3498db;
//       box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
//     }

//     .file-preview {
//       margin-top: 5px;
//       padding: 8px;
//       background: #e8f5e8;
//       border-radius: 4px;
//       font-size: 12px;
//     }

//     .file-name {
//       font-weight: bold;
//       margin-right: 10px;
//     }

//     .form-actions {
//       display: flex;
//       gap: 10px;
//       justify-content: flex-end;
//     }

//     .table-container {
//       background: white;
//       padding: 20px;
//       border-radius: 8px;
//       box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//       margin-bottom: 20px;
//     }

//     .table-container h3 {
//       margin-bottom: 15px;
//       color: #2c3e50;
//     }

//     .table-wrapper {
//       overflow-x: auto;
//     }

//     .records-table {
//       width: 100%;
//       border-collapse: collapse;
//       min-width: 800px;
//     }

//     .records-table th,
//     .records-table td {
//       padding: 12px;
//       text-align: left;
//       border-bottom: 1px solid #ddd;
//     }

//     .records-table th {
//       background-color: #34495e;
//       color: white;
//       font-weight: bold;
//       position: sticky;
//       top: 0;
//     }

//     .records-table tr:hover {
//       background-color: #f8f9fa;
//     }

//     .record-name {
//       max-width: 300px;
//       word-wrap: break-word;
//     }

//     .actions {
//       display: flex;
//       gap: 5px;
//     }

//     .btn-small {
//       padding: 5px 8px;
//       font-size: 12px;
//       min-width: 30px;
//     }

//     .btn-edit {
//       background-color: #f39c12;
//       color: white;
//     }

//     .btn-edit:hover {
//       background-color: #e67e22;
//     }

//     .btn-delete {
//       background-color: #e74c3c;
//       color: white;
//     }

//     .btn-delete:hover {
//       background-color: #c0392b;
//     }

//     .btn-file {
//       background-color: #27ae60;
//       color: white;
//       text-decoration: none;
//       display: inline-block;
//       padding: 5px 8px;
//       border-radius: 3px;
//     }

//     .btn-file:hover {
//       background-color: #229954;
//       color: white;
//     }

//     .footer {
//       background: white;
//       padding: 20px;
//       border-radius: 8px;
//       box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//       text-align: center;
//     }

//     .footer-section {
//       display: flex;
//       justify-content: space-around;
//       margin-top: 10px;
//     }

//     .footer-section div {
//       font-size: 14px;
//       color: #7f8c8d;
//     }

//     @media (max-width: 768px) {
//       .header-section {
//         flex-direction: column;
//         text-align: center;
//       }
      
//       .main-title {
//         margin: 10px 0;
//       }
      
//       .info-grid {
//         grid-template-columns: 1fr;
//       }
      
//       .action-buttons {
//         justify-content: center;
//         flex-wrap: wrap;
//       }
      
//       .records-table {
//         font-size: 12px;
//       }
      
//       .records-table th,
//       .records-table td {
//         padding: 8px 4px;
//       }
      
//       .record-name {
//         max-width: 150px;
//       }
//     }
//   `;

//   return (
//     <div className="container">
//       <style>{styles}</style>
//       {/* Header Section */}
//       <div className="header-section">
//         <div className="logo-placeholder"></div>
//         <h1 className="main-title">4M CHANGE PROCEDURE</h1>
//         {/* <div className="header-info">
//           <div className="info-row">
//             <span className="label">Doc. No.:</span>
//             <span className="value">{headerInfo.docNo}</span>
//           </div>
//           <div className="info-row">
//             <span className="label">Rev. No.:</span>
//             <span className="value">{headerInfo.revNo}</span>
//           </div>
//           <div className="info-row">
//             <span className="label">Date:</span>
//             <span className="value">{headerInfo.date}</span>
//           </div>
//         </div> */}
//       </div>

//       {/* Process Information */}
//       <div className="process-info">
//         <div className="info-grid">
//           <div className="info-item">
//             <strong>Process Name :</strong> {headerInfo.processName}
//           </div>
//           <div className="info-item">
//             <strong>Purpose :</strong> {headerInfo.purpose}
//           </div>
//           <div className="info-item">
//             <strong>Scope :</strong> {headerInfo.scope}
//           </div>
//           <div className="info-item">
//             <strong>Process Owner :</strong> {headerInfo.processOwner}
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="action-buttons">
//         <button
//           className="btn btn-primary"
//           onClick={() => setShowForm(!showForm)}
//         >
//           {showForm ? 'Cancel' : 'Add New Record'}
//         </button>
//         <button
//           className="btn btn-secondary"
//           onClick={() => setRecords(demoData)}
//         >
//           Reset to Demo Data
//         </button>
//       </div>

//       {/* Add/Edit Form */}
//       {showForm && (
//         <div className="form-overlay">
//           <div className="form-container">
//             <h3>{editingIndex === -1 ? 'Add New Record' : 'Edit Record'}</h3>
//             <div className="form-grid">
//               <div className="form-group">
//                 <label>Record No./Rev. no.:</label>
//                 <input
//                   type="text"
//                   name="recordNo"
//                   value={formData.recordNo}
//                   onChange={handleInputChange}
//                   placeholder="e.g., MS-4M-WI-01"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Rev. no.:</label>
//                 <input
//                   type="text"
//                   name="revNo"
//                   value={formData.revNo}
//                   onChange={handleInputChange}
//                   placeholder="e.g., 0.0"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Rev. date:</label>
//                 <input
//                   type="date"
//                   name="revDate"
//                   value={formData.revDate}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="form-group full-width">
//                 <label>Record Name:</label>
//                 <textarea
//                   name="recordName"
//                   value={formData.recordName}
//                   onChange={handleInputChange}
//                   placeholder="Enter record name"
//                   rows={2}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Retention Period:</label>
//                 <select
//                   name="retentionPeriod"
//                   value={formData.retentionPeriod}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="">Select...</option>
//                   <option value="One Year">One Year</option>
//                   <option value="Up to tool life">Up to tool life</option>
//                   <option value="Daily">Daily</option>
//                   <option value="Custom">Custom</option>
//                 </select>
//                 {formData.retentionPeriod === 'Custom' && (
//                   <input
//                     type="text"
//                     name="customRetention"
//                     placeholder="Enter custom period"
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         retentionPeriod: e.target.value,
//                       }))
//                     }
//                   />
//                 )}
//               </div>
//               <div className="form-group full-width">
//                 <label>Disposal Authority:</label>
//                 <input
//                   type="text"
//                   name="disposalAuthority"
//                   value={formData.disposalAuthority}
//                   onChange={handleInputChange}
//                   placeholder="e.g., Head quality/Prod."
//                   required
//                 />
//               </div>
//               <div className="form-group full-width">
//                 <label>Upload File (Optional):</label>
//                 <input
//                   type="file"
//                   name="file"
//                   onChange={handleFileChange}
//                   accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
//                 />
//                 {formData.file && (
//                   <div className="file-preview">
//                     <span className="file-name">{formData.file.name}</span>
//                     <span className="file-size">
//                       {(formData.file.size / 1024).toFixed(2)} KB
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="form-actions">
//               <button className="btn btn-primary" onClick={handleAdd}>
//                 {editingIndex === -1 ? 'Add Record' : 'Update Record'}
//               </button>
//               <button className="btn btn-secondary" onClick={handleCancel}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Records Table */}
//       <div className="table-container">
//         <h3>Master List of Formats and Records</h3>
//         <div className="table-wrapper">
//           <table className="records-table">
//             <thead>
//               <tr>
//                 <th>Sr. No.</th>
//                 <th>Record No./Rev. no.</th>
//                 <th>Rev. no.</th>
//                 <th>Rev. date</th>
//                 <th>Record Name</th>
//                 <th>Retention Period</th>
//                 <th>Disposal Authority</th>
//                 <th>File</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {records.map((record, index) => (
//                 <tr key={index}>
//                   <td>{record.srNo}</td>
//                   <td>{record.recordNo}</td>
//                   <td>{record.revNo}</td>
//                   <td>{record.revDate}</td>
//                   <td className="record-name">{record.recordName}</td>
//                   <td>{record.retentionPeriod}</td>
//                   <td>{record.disposalAuthority}</td>
//                   <td>
//                     {record.file && (
//                       <a
//                         href={URL.createObjectURL(record.file)}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="btn btn-small btn-file"
//                         title="Open File"
//                       >
//                         📎 {record.file.name}
//                       </a>
//                     )}
//                   </td>
//                   <td className="actions">
//                     <button
//                       className="btn btn-small btn-edit"
//                       onClick={() => handleEdit(index)}
//                       title="Edit"
//                     >
//                       ✏️
//                     </button>
//                     <button
//                       className="btn btn-small btn-delete"
//                       onClick={() => handleDelete(index)}
//                       title="Delete"
//                     >
//                       🗑️
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="footer">
//         <div className="footer-section">
//           <div>
//             <strong>Prepared By:</strong> S.K Sharma
//           </div>
//           <div>
//             <strong>Approved By:</strong> _______________
//           </div>
//           <div>
//             <strong>Issued By:</strong> _______________
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FourMChangeProcedure;





import React, { useState, useEffect } from 'react';

// Define the record interface
interface Record {
  srNo: number;
  recordNo: string;
  revNo: string;
  revDate: string;
  recordName: string;
  retentionPeriod: string;
  disposalAuthority: string;
  file: File | null;
}

// Demo Data with placeholder files
const demoData: Record[] = [
  {
    srNo: 1,
    recordNo: 'MS-4M-WI-01',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: '4M change identification sheet (Planned/unplanned)',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Head quality/Prod.',
    file: new File(['sample content'], 'sample1.pdf', { type: 'application/pdf' }),
  },
  {
    srNo: 2,
    recordNo: 'MS-4M-WI-01a',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: 'Handling of abnormal situation',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Head quality/Prod.',
    file: new File(['sample content'], 'sample2.doc', { type: 'application/msword' }),
  },
  {
    srNo: 3,
    recordNo: 'MS-4M-02',
    revNo: '0.0',
    revDate: '2017-03-25',
    recordName: 'List of break down',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Head quality/Prod.',
    file: null,
  },
  {
    srNo: 4,
    recordNo: 'MS-4M-03',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: '4M change information flow sheet',
    retentionPeriod: 'Up to tool life',
    disposalAuthority: 'Head quality/Prod.',
    file: new File(['sample content'], 'sample3.png', { type: 'image/png' }),
  },
  {
    srNo: 5,
    recordNo: 'MS-4M-04',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: '4M change identification tag',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Head quality/Prod.',
    file: null,
  },
  {
    srNo: 6,
    recordNo: 'MS-4M-07',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: '4M change traceability record sheet',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Head quality/Prod.',
    file: new File(['sample content'], 'sample4.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
  },
  {
    srNo: 7,
    recordNo: 'MS-4M-06',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: '4M Change inspection report',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Head quality',
    file: null,
  },
  {
    srNo: 8,
    recordNo: 'MS-4M-05A',
    revNo: '0.0',
    revDate: '2017-04-10',
    recordName: '4M Change summary sheet',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Head quality',
    file: new File(['sample content'], 'sample5.jpg', { type: 'image/jpeg' }),
  },
  {
    srNo: 9,
    recordNo: 'MS-4M-05',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: '4M Change record sheet',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Quality Sup.',
    file: null,
  },
  {
    srNo: 10,
    recordNo: 'MS-4M-08',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: '4M Change display board',
    retentionPeriod: 'Daily',
    disposalAuthority: 'Quality Sup.',
    file: new File(['sample content'], 'sample6.pdf', { type: 'application/pdf' }),
  },
];

// Header Info
const headerInfo = {
  docNo: 'MS/4M/PR/05',
  revNo: '28.02.20',
  date: '2020-02-28',
  processName: '4M Change Procedure',
  purpose: 'To implement the system for control the 4M (Man, Machine, Material, Method) changes in process',
  scope: 'Applicable to all manufacturing process',
  processOwner: 'Head quality & Production',
};

// Component
const FourMChangeProcedure: React.FC = () => {
  const [records, setRecords] = useState<Record[]>(demoData);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record>({
    srNo: 0,
    recordNo: '',
    revNo: '',
    revDate: '',
    recordName: '',
    retentionPeriod: '',
    disposalAuthority: '',
    file: null,
  });
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  useEffect(() => {
    const updatedRecords = records.map((record, index) => ({
      ...record,
      srNo: index + 1,
    }));
    setRecords(updatedRecords);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files ? e.target.files[0] : null,
    }));
  };

  const handleAdd = () => {
    if (editingIndex === -1) {
      const newRecord: Record = {
        ...formData,
        srNo: records.length + 1,
      };
      setRecords([...records, newRecord]);
    } else {
      const updatedRecords = [...records];
      updatedRecords[editingIndex] = { ...formData, srNo: records[editingIndex].srNo };
      setRecords(updatedRecords);
      setEditingIndex(-1);
    }

    setFormData({
      srNo: 0,
      recordNo: '',
      revNo: '',
      revDate: '',
      recordName: '',
      retentionPeriod: '',
      disposalAuthority: '',
      file: null,
    });
    setShowForm(false);
  };

  const handleEdit = (index: number) => {
    const record = records[index];
    setFormData(record);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updatedRecords = records.filter((_, i) => i !== index);
      setRecords(updatedRecords);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingIndex(-1);
    setFormData({
      srNo: 0,
      recordNo: '',
      revNo: '',
      revDate: '',
      recordName: '',
      retentionPeriod: '',
      disposalAuthority: '',
      file: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold"></div>
            <h1 className="text-3xl font-extrabold text-center flex-1">4M Change Procedure</h1>
            <div className="text-sm space-y-1">
              <div className="flex gap-2">
                <span className="font-semibold">Doc. No.:</span>
                <span>{headerInfo.docNo}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">Rev. No.:</span>
                <span>{headerInfo.revNo}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">Date:</span>
                <span>{headerInfo.date}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Process Information */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <strong className="text-gray-700">Process Name:</strong>
              <p className="text-gray-900">{headerInfo.processName}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <strong className="text-gray-700">Purpose:</strong>
              <p className="text-gray-900">{headerInfo.purpose}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <strong className="text-gray-700">Scope:</strong>
              <p className="text-gray-900">{headerInfo.scope}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <strong className="text-gray-700">Process Owner:</strong>
              <p className="text-gray-900">{headerInfo.processOwner}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-end gap-4">
          <button
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            onClick={() => setShowForm(!showForm)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {showForm ? 'Cancel' : 'Add New Record'}
          </button>
          <button
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
            onClick={() => setRecords(demoData)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset to Demo Data
          </button>
        </div>
      </section>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {editingIndex === -1 ? 'Add New Record' : 'Edit Record'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Record No.:</label>
                <input
                  type="text"
                  name="recordNo"
                  value={formData.recordNo}
                  onChange={handleInputChange}
                  placeholder="e.g., MS-4M-WI-01"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Rev. No.:</label>
                <input
                  type="text"
                  name="revNo"
                  value={formData.revNo}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.0"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Rev. Date:</label>
                <input
                  type="date"
                  name="revDate"
                  value={formData.revDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Record Name:</label>
                <textarea
                  name="recordName"
                  value={formData.recordName}
                  onChange={handleInputChange}
                  placeholder="Enter record name"
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Retention Period:</label>
                <select
                  name="retentionPeriod"
                  value={formData.retentionPeriod}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select...</option>
                  <option value="One Year">One Year</option>
                  <option value="Up to tool life">Up to tool life</option>
                  <option value="Daily">Daily</option>
                  <option value="Custom">Custom</option>
                </select>
                {formData.retentionPeriod === 'Custom' && (
                  <input
                    type="text"
                    name="customRetention"
                    placeholder="Enter custom period"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({ ...prev, retentionPeriod: e.target.value }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
                  />
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Disposal Authority:</label>
                <input
                  type="text"
                  name="disposalAuthority"
                  value={formData.disposalAuthority}
                  onChange={handleInputChange}
                  placeholder="e.g., Head quality/Prod."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Upload File (Optional):</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {formData.file && (
                  <div className="mt-2 p-2 bg-green-50 rounded-md text-sm">
                    <span className="font-medium">{formData.file.name}</span>
                    <span className="ml-2">({(formData.file.size / 1024).toFixed(2)} KB)</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                onClick={handleAdd}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {editingIndex === -1 ? 'Add Record' : 'Update Record'}
              </button>
              <button
                className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
                onClick={handleCancel}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Records Table */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Master List of Formats and Records</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-blue-700 text-white">
                  <th className="p-3 text-left">Sr. No.</th>
                  <th className="p-3 text-left">Record No.</th>
                  <th className="p-3 text-left">Rev. No.</th>
                  <th className="p-3 text-left">Rev. Date</th>
                  <th className="p-3 text-left">Record Name</th>
                  <th className="p-3 text-left">Retention Period</th>
                  <th className="p-3 text-left">Disposal Authority</th>
                  <th className="p-3 text-left">File</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr
                    key={index}
                    className={`border-b ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    } hover:bg-blue-100 transition-colors duration-150`}
                  >
                    <td className="p-3">{record.srNo}</td>
                    <td className="p-3">{record.recordNo}</td>
                    <td className="p-3">{record.revNo}</td>
                    <td className="p-3">{record.revDate}</td>
                    <td className="p-3 max-w-xs break-words">{record.recordName}</td>
                    <td className="p-3">{record.retentionPeriod}</td>
                    <td className="p-3">{record.disposalAuthority}</td>
                    <td className="p-3">
                      {record.file && (
                        <a
                          href={URL.createObjectURL(record.file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                          title="Open File"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a4 4 0 00-5.656-5.656l-6.586 6.586a6 6 0 008.485 8.485l6.586-6.586"
                            />
                          </svg>
                          {record.file.name}
                        </a>
                      )}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200"
                        onClick={() => handleEdit(index)}
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                        onClick={() => handleDelete(index)}
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0h4m-9 4h12"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm">
              <strong>Prepared By:</strong> S.K Sharma
            </div>
            <div className="text-sm">
              <strong>Approved By:</strong> _______________
            </div>
            <div className="text-sm">
              <strong>Issued By:</strong> _______________
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FourMChangeProcedure;
