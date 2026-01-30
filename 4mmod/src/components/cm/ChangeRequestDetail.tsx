// import React, { useMemo } from "react";
// import {
//   ArrowLeft,
//   Calendar,
//   Clock,
//   Building2,
//   FileText,
//   ListChecks,
//   ExternalLink,
//   Printer,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Users,
//   CheckSquare,
//   MapPin,
//   Router,
//   Zap,
//   Flag,
//   UserCheck,
//   Eye,
//   Lock,
//   Shield,
//   Activity,
//   Layers,
//   User,
//   Edit,
//   Settings,
// } from "lucide-react";

// import { useAuth } from "../../contexts/AuthContext"; 

// // --- TYPES ---
// export interface OJTRecordData {
//   changeId: string;
//   fourMChangeId: number;
//   shopfloorName: string;
//   lineName: string;
//   stationName: string;
//   departmentName: string;
//   processName: string;
// }

// interface WorkflowTask {
//   id: string;
//   label: string;
//   description: string;
//   module: string;
//   icon: any;
//   priority: string;
//   canResolve: boolean;
//   statusLabel?: string;
//   extraProps?: any;
  
//   // Secondary Button Properties
//   secondaryLabel?: string;
//   secondaryModule?: string;
//   secondaryIcon?: any;
// }

// interface DetailProps {
//   record: any;
//   onBack: () => void;
//   setSelectedModule: (id: string, data?: any) => void;
// }

// export default function ChangeRequestDetail({
//   record,
//   onBack,
//   setSelectedModule,
// }: DetailProps) {
  
//   const { user } = useAuth(); 
  
//   const currentUser = user as any;
//   const userRoleCode = typeof currentUser?.role === 'string' 
//     ? currentUser.role 
//     : currentUser?.role?.code;

//   const isCustomerUser = userRoleCode === 'CUSTOMER';
//   const isAdmin = currentUser?.is_superuser || userRoleCode === 'ADMIN';

//   const isApprover = ['QA_HOD', 'PROD_HOD', 'CUSTOMER'].includes(userRoleCode);

//   // --- SMART WORKFLOW LOGIC ---
//   const { pending, completed, allTasks } = useMemo(() => {
//     if (!record) return { pending: [], completed: [], allTasks: [] }; 

//     const p: WorkflowTask[] = []; 
//     const c: WorkflowTask[] = []; 
//     const all: WorkflowTask[] = [];

//     const addTask = (
//         id: string, label: string, desc: string, mod: string, icon: any, 
//         prio: string, isDone: boolean, restrictedToCustomer: boolean, 
//         statusLabel?: string, 
//         secondary?: { label: string, module: string, icon: any }
//     ) => {
//         let canResolve = true;
//         if (restrictedToCustomer && !isCustomerUser && !isAdmin) canResolve = false; 
//         if (!restrictedToCustomer && isCustomerUser && !isAdmin) canResolve = false;

//         const item = { 
//             id, label, description: desc, module: mod, icon, priority: prio, 
//             canResolve, statusLabel, 
//             secondaryLabel: secondary?.label, 
//             secondaryModule: secondary?.module,
//             secondaryIcon: secondary?.icon
//         };
//         all.push(item);
//         isDone ? c.push(item) : p.push(item);
//     };

//     // 1. SETUP APPROVAL
//     if (record.action_details?.set_up_approval) {
//         const isSheetFilled = record.is_setup_sheet_filled;
        
//         if (!isSheetFilled) {
//              addTask("setup_sheet", "Fill Setup Checksheet", "Required before approval.", "setup", Zap, "High", false, false);
//         } else {
//              const nonCustomerApprovals = record.approvals?.filter((a: any) => a.role_code !== 'CUSTOMER') || [];
//              const hasRejected = nonCustomerApprovals.some((a: any) => a.status === 'rejected');
//              const allApproved = nonCustomerApprovals.length > 0 && nonCustomerApprovals.every((a: any) => a.status === 'approved');
             
//              let isDone = false;
//              let desc = "Review setup data and approve.";
//              let statusLabel = "PENDING";

//              if (allApproved) {
//                 isDone = true;
//                 desc = "Internal setup approved.";
//              } else if (hasRejected) {
//                 statusLabel = "REJECTED";
//                 desc = "Setup rejected.";
//              }

//              // Add Task with SECONDARY "VIEW SHEET" BUTTON
//              addTask(
//                  "setup_approval", "Setup Approval", desc, "approvals", UserCheck, "High", isDone, false, statusLabel,
//                  { label: "VIEW SHEET", module: "setup", icon: Eye }
//              );
//         }
//     }

//     // 2. CUSTOMER APPROVAL
//     if (record.action_details?.customer_approval) {
//         const custAppr = record.approvals?.find((a: any) => a.role_code === 'CUSTOMER');
//         const isDone = custAppr?.status === 'approved';
//         const isRejected = custAppr?.status === 'rejected';
//         let desc = "Customer authorization pending.";
//         let statusLabel = "PENDING";
//         if (isRejected) { desc = "Rejected by customer."; statusLabel = "REJECTED"; } 
//         else if (isDone) { desc = "Approved by customer."; }
//         // ✅ DYNAMIC BUTTON LOGIC
//         // If Customer -> "VIEW SHEET" (Eye Icon)
//         // If Internal -> "FILL SHEET" (Edit Icon)
//         const sheetActionLabel = isCustomerUser ? "VIEW SHEET" : "FILL SHEET";
//         const sheetActionIcon = isCustomerUser ? Eye : Edit;
        
//         addTask("customer", "Customer Approval", desc, "customer-approvals", UserCheck, "Critical", isDone, true, statusLabel,{ 
//                 label: sheetActionLabel, 
//                 module: "customer-sheet", // This opens your new Sheet Component
//                 icon: FileText 
//             });
//     }

//     // 3. RETRO INSPECTION
//     if (record.action_details?.retroactive_inspection) {
//         const isDone = record.is_retro_done; 
//         let desc = isDone ? "Retroactive data recorded." : "Previous batch inspection.";
//         addTask("retro", "Retroactive Check", desc, "rcr", ListChecks, "High", isDone, false);
//     }
  

//     // 4. OJT
//     if (record.action_details?.ojt) {
//         const isDone = record.is_ojt_done;
//         let desc = isDone ? "OJT records submitted." : "Operator training required.";
//         addTask("ojt", "On Job Training", desc, "ojt", Users, "Medium", isDone, false);
//     }

//     // 5. CONTAINMENT
//     if (record.action_details?.containment_action) {
//     const isDone = record.is_containment_done;
//     let desc = "Segregation of suspect parts.";
//     if (isDone) desc = "Containment action recorded.";
    
//     // Ensure the 4th parameter is "containment-form"
//     addTask("containment", "Containment Action", desc, "containment-form", Flag, "Critical", isDone, false);
// }
//     // 6. ID / BATCH NO
//     if (record.action_details?.identification_psn_batch_no) {
//         const isDone = record.is_batch_done;
//         let desc = isDone ? "Batch info updated." : "Update Batch/PSN info.";
//         addTask("batch", "ID / Batch No.", desc, "identification", CheckSquare, "Medium", isDone, false);
//     }

//     // 7. CHANGE TRACKING
//     if (record.action_details?.change_record) {
//         const isDone = record.is_tracking_done;
//         let desc = isDone ? "Tracking sheet updated." : "Update 4M tracking sheet.";
//         addTask("tracking", "Tracking Sheet", desc, "4m-cts", FileText, "Medium", isDone, false);
//     }
//     // 8. MACHINE CHECK SHEET
//     if (record.action_details?.machine_check_sheet) {
//         const isDone = record.is_machine_sheet_done; // Assumes backend field
//         let desc = isDone ? "Machine verification completed." : "Verify machine parameters.";
//         addTask("machine_sheet", "Machine Check Sheet", desc, "mcs", Settings, "High", isDone, false);
//     }

//     // 9. IN-PROCESS SHEET
//     if (record.action_details?.in_process_sheet) {
//         const isDone = record.is_inprocess_sheet_done; // Assumes backend field
//         let desc = isDone ? "Process inspection recorded." : "Check first-piece quality.";
//         addTask("in_process_sheet", "In-Process Sheet", desc, "in-process-sheet", ListChecks, "High", isDone, false);
//     }

//     return { pending: p, completed: c, allTasks: all };
//   }, [record, user, isCustomerUser, isAdmin, isApprover]);

//   // --- MAIN STATUS LOGIC ---
//   const isFullyClosed = (record.approval_status?.toUpperCase() === "APPROVED") && (pending.length === 0);
//   const isRejected = record.approval_status?.toUpperCase() === "REJECTED";

//   const renderMainStatus = () => {
//     if (isFullyClosed) return <div className="px-4 py-2 rounded-lg text-sm font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-2 shadow-sm"><CheckCircle className="w-5 h-5" /> APPROVED & CLOSED</div>;
//     if (isRejected) return <div className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white flex items-center gap-2 shadow-md"><XCircle className="w-5 h-5" /> REJECTED</div>;
//     return <div className="px-4 py-2 rounded-lg text-sm font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-2 shadow-sm animate-pulse"><Activity className="w-5 h-5" /> IN PROGRESS</div>;
//   };

//   const handleNavigate = (moduleId: string) => {
//     if (record?.record_id) {
//         localStorage.setItem("filter_change_request_id", record.record_id);
//         localStorage.setItem("return_to_detail_id", record.record_id);
        
//         if (moduleId === "mcs") {
//             // These two items allow the MachineCheckSheet to fetch the specific data
//             localStorage.setItem("active_record_id", record.record_id);
//             localStorage.setItem("active_four_m_id", record.id.toString());
//         }

//         if (moduleId === "containment-form") {
//         const prefillData = {
//         record_id: record.record_id,
//         department: record.shopfloor_name || "",
//         line: record.line_name || "",
//         process: record.station_name || "",
//         change_type: record.four_m || "",
//         reason: record.category_details?.description || ""
//       };
      
//       localStorage.setItem("containment_prefill_data", JSON.stringify(prefillData));
//     }
//         if (moduleId === "ojt") {
//             const ojtData: OJTRecordData = {
//                 changeId: record.record_id,
//                 fourMChangeId: record.id,
//                 shopfloorName: record.shopfloor_name || "",
//                 lineName: record.line_name || "",
//                 stationName: record.station_name || "",
//                 departmentName: record.department_name || "Production",
//                 processName: record.category_details?.description || "OJT Process"
//             };
//             localStorage.setItem("ojt_record_data", JSON.stringify(ojtData));
//         }
//     }

//     if (moduleId === "setup") {
//         const sheetType = record.shopfloor_sheet_type || 'PRODUCT';
//         const isFilled = record.is_setup_sheet_filled;
//         const readOnlyMode = isFilled || isApprover; 

//         localStorage.setItem("setup_sheet_record", JSON.stringify(record));
//         localStorage.setItem("setup_sheet_readonly", JSON.stringify(readOnlyMode));

//         switch (sheetType) {
//             case 'PAINT': setSelectedModule("paint-sheet"); break;
//             case 'PROCESS': setSelectedModule("process-sheet"); break;
//             case 'TOOLING': setSelectedModule("tool-sheet"); break;
//             case 'PRODUCT': default: setSelectedModule("product-sheet"); break;
//         }
//         return;
//     }

//     // 3. ✅ NEW: CUSTOMER SHEET LOGIC
//     if (moduleId === "customer-sheet") {
//         // We use the SAME storage key "setup_sheet_record" because your 
//         // CustomerApprovalSheet.tsx is coded to look for this specific key.
//         localStorage.setItem("setup_sheet_record", JSON.stringify(record));
        
//         // We usually don't force read-only here because the sheet has its own 
//         // internal logic (Internal users = Edit, Customer = View), 
//         // but you can set a hint if you want.
//         localStorage.setItem("setup_sheet_readonly", "false"); 

//         setSelectedModule("customer-sheet");
//         return;
//     }
//     setSelectedModule(moduleId);
//   };

//   const getGradient = () => {
//     switch(record.four_m) {
//         case "Man": return "from-blue-600 to-indigo-700";
//         case "Machine/Tool": return "from-emerald-600 to-teal-700";
//         case "Material": return "from-purple-600 to-fuchsia-700";
//         case "Method": return "from-orange-600 to-red-700";
//         default: return "from-gray-700 to-gray-900";
//     }
//   };

//   if (!record) return null;

//   return (
//     <div className="bg-gray-100 min-h-screen p-4 animate-in fade-in duration-300 font-sans text-gray-900">
      
//       {/* VIBRANT HEADER */}
//       <div className={`rounded-2xl shadow-lg mb-5 overflow-hidden bg-gradient-to-r ${getGradient()} text-white`}>
//         <div className="px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
//             <div className="flex items-center gap-4 w-full md:w-auto">
//                 <button onClick={onBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm border border-white/10">
//                     <ArrowLeft className="w-6 h-6 text-white" />
//                 </button>
//                 <div>
//                     <div className="flex items-center gap-3">
//                         <h1 className="text-2xl font-extrabold tracking-tight">{record.record_id}</h1>
//                         <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/20 border border-white/20 shadow-sm">{record.category_details?.category_type}</span>
//                     </div>
//                     <div className="flex items-center gap-4 mt-1 text-blue-50 text-sm font-medium">
//                         <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 opacity-80" /> {record.date}</span>
//                         <span className="w-1 h-1 bg-white/40 rounded-full"></span>
//                         <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 opacity-80" /> {record.time}</span>
//                     </div>
//                 </div>
//             </div>
//             <div className="flex items-center gap-3 w-full md:w-auto justify-end">{renderMainStatus()}</div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 max-w-[1920px] mx-auto">
        
//         {/* LEFT COLUMN: INFO & TIMELINE (Span 8) */}
//         <div className="xl:col-span-8 flex flex-col gap-5">
          
//           {/* Main Info Card */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//             <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
//                <Layers className="w-5 h-5 text-gray-500" />
//                <h3 className="font-bold text-gray-700">Change Context</h3>
//             </div>
//             <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
//               <div><div className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Building2 className="w-3 h-3"/> Shopfloor</div><div className="font-bold text-gray-900">{record.shopfloor_name}</div></div>
//               <div><div className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Router className="w-3 h-3"/> Line</div><div className="font-bold text-gray-900">{record.line_name}</div></div>
//               <div><div className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Station</div><div className="font-bold text-gray-900">{record.station_name}</div></div>
//               <div><div className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Shift</div><div className="font-bold text-gray-900">Shift {record.shift}</div></div>
//             </div>
//             <div className="px-6 pb-6 grid md:grid-cols-2 gap-4">
//                 <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
//                     <div className="text-[10px] font-bold text-blue-400 uppercase mb-2 flex items-center gap-1"><FileText className="w-3 h-3"/> Description</div>
//                     <p className="text-sm text-gray-800 font-medium leading-relaxed">{record.category_details?.description}</p>
//                 </div>
//                 <div className="bg-green-50/50 rounded-xl p-4 border border-green-100">
//                     <div className="text-[10px] font-bold text-green-500 uppercase mb-2 flex items-center gap-1"><Shield className="w-3 h-3"/> Action Taken</div>
//                     <p className="text-sm text-gray-800 font-medium leading-relaxed">{record.action_details?.action_taken}</p>
//                 </div>
//             </div>
//           </div>

//           {/* ✅ Workflow Status List (UPDATED) */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 overflow-hidden">
//             <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-100 flex items-center justify-between">
//                <h3 className="font-bold text-gray-700 flex items-center gap-2"><ListChecks className="w-5 h-5 text-gray-500"/> Workflow Status</h3>
//                <span className="text-xs font-medium text-gray-500">{completed.length} / {allTasks.length} Completed</span>
//             </div>
            
//             <div className="divide-y divide-gray-100">
//               {allTasks.length === 0 ? (
//                  <p className="text-sm text-gray-400 italic text-center py-8">No requirements tracked for this change.</p>
//               ) : (
//                  allTasks
//                  .sort((a, b) => {
//                     const isADone = completed.some(c => c.id === a.id);
//                     const isBDone = completed.some(c => c.id === b.id);
//                     return Number(isADone) - Number(isBDone); // Pending first
//                  })
//                  .map((task) => {
//                     const isCompleted = completed.some(t => t.id === task.id);
//                     const isRejected = task.statusLabel === 'REJECTED';

//                     return (
//                       <div key={task.id} className="group flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
//                         <div className="flex items-center gap-4">
//                            <div className={`p-2.5 rounded-xl shadow-sm ${isCompleted ? 'bg-green-100 text-green-700' : isRejected ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
//                                <task.icon className="w-5 h-5" />
//                            </div>
//                            <div>
//                                <div className="text-sm font-bold text-gray-900">{task.label}</div>
//                                <div className="text-xs text-gray-500">{task.description}</div>
//                            </div>
//                         </div>
                        
//                         {/* ✅ VIEW BUTTONS FOR COMPLETED ITEMS */}
//                         {isCompleted ? (
//                             <div className="flex gap-2">
//                                 {/* Primary Button (e.g. View Approval) */}
//                                 <button 
//                                     onClick={() => handleNavigate(task.module)}
//                                     className="flex items-center gap-2 px-4 py-2 bg-white border border-green-200 text-green-700 text-xs font-bold rounded-lg hover:bg-green-50 hover:border-green-300 transition-all shadow-sm"
//                                 >
//                                     <Eye className="w-3.5 h-3.5" /> VIEW DETAILS
//                                 </button>
                                
//                                 {/* Secondary Button (e.g. View Sheet) */}
//                                 {task.secondaryLabel && (
//                                     <button 
//                                         onClick={() => handleNavigate(task.secondaryModule!)} 
//                                         className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm"
//                                     >
//                                         {task.secondaryIcon && <task.secondaryIcon className="w-3.5 h-3.5" />} {task.secondaryLabel}
//                                     </button>
//                                 )}
//                             </div>
//                         ) : isRejected ? (
//                             <span className="px-3 py-1.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-lg border border-red-200 uppercase tracking-wide">Rejected</span>
//                         ) : (
//                             <span className="px-3 py-1.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-lg border border-gray-200 uppercase tracking-wide">Pending</span>
//                         )}
//                       </div>
//                     );
//                  })
//               )}
//             </div>
//           </div>

//         </div>

//         {/* RIGHT: ACTION PANEL (Span 4) */}
//         <div className="xl:col-span-4 flex flex-col gap-5">
//           <div className="bg-white rounded-2xl border border-blue-200 shadow-md overflow-hidden flex flex-col h-full max-h-[600px] ring-4 ring-blue-50/50">
//             <div className="bg-gradient-to-r from-blue-50 to-white px-5 py-4 border-b border-blue-100 flex items-center justify-between">
//               <h3 className="font-bold text-blue-900 text-sm flex items-center gap-2">
//                   <AlertTriangle className="w-5 h-5 text-blue-600" /> Pending Actions
//               </h3>
//               {pending.length > 0 && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{pending.length}</span>}
//             </div>

//             <div className="overflow-y-auto p-4 space-y-3 flex-1 bg-gray-50/30 custom-scrollbar">
//                 {pending.length === 0 ? (
//                     <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-70">
//                         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600 shadow-sm"><CheckCircle className="w-8 h-8" /></div>
//                         <p className="text-base font-bold text-gray-900">All Clear!</p>
//                         <p className="text-xs text-gray-500 mt-1 max-w-[200px]">No actions required at this moment.</p>
//                     </div>
//                 ) : (
//                     pending.map((task) => (
//                     <div key={task.id} className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all duration-200 relative overflow-hidden">
//                         <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                         <div className="flex justify-between items-start mb-3 pl-2">
//                             <div className="flex items-center gap-2.5">
//                                 <task.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
//                                 <span className="font-bold text-gray-800 text-sm">{task.label}</span>
//                             </div>
//                             {task.priority === 'Critical' && <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-extrabold border border-red-200">CRITICAL</span>}
//                         </div>
//                         <div className="pl-2 flex gap-2">
//                             {task.canResolve ? (
//                                 <button onClick={() => handleNavigate(task.module)} className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all">
//                                     RESOLVE NOW <ExternalLink className="w-3 h-3" />
//                                 </button>
//                             ) : (
//                                 <div className="flex-1 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg border border-gray-200 text-center flex items-center justify-center gap-2 cursor-not-allowed">
//                                     <Lock className="w-3 h-3" /> WAITING / RESTRICTED
//                                 </div>
//                             )}
//                             {task.secondaryLabel && (
//                                 <button 
//                                     onClick={() => handleNavigate(task.secondaryModule!)} 
//                                     className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 text-xs font-bold rounded-lg hover:bg-indigo-100 flex items-center justify-center gap-2 transition-all"
//                                     title={task.secondaryLabel}
//                                 >
//                                     {task.secondaryIcon && <task.secondaryIcon className="w-3.5 h-3.5" />}
//                                     <span className="hidden xl:inline">{task.secondaryLabel}</span>
//                                     <span className="xl:hidden"><Eye className="w-3.5 h-3.5" /></span>
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                     ))
//                 )}
//             </div>
//           </div>
          
//           <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
//              <div className="flex items-center gap-3">
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${record.action_details?.approving_authority ? "bg-indigo-50 text-indigo-600 ring-2 ring-indigo-100" : "bg-gray-100 text-gray-400"}`}>
//                     {record.action_details?.approving_authority ? <UserCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
//                 </div>
//                 <div>
//                     <div className="text-[10px] font-bold text-gray-400 uppercase">Approving Authority</div>
//                     <div className="font-bold text-gray-900 text-sm">{record.action_details?.approving_authority || "Pending Assignment"}</div>
//                 </div>
//              </div>
//              {record.action_details?.approving_authority && <div className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-100">HOD</div>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useMemo, useState, useEffect } from "react";
// import {
//   ArrowLeft,
//   Calendar,
//   Clock,
//   Building2,
//   FileText,
//   ListChecks,
//   ExternalLink,
//   Printer,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Users,
//   CheckSquare,
//   MapPin,
//   Router,
//   Zap,
//   Flag,
//   UserCheck,
//   Eye,
//   Lock,
//   Shield,
//   Activity,
//   Layers,
//   User,
//   Edit,
//   Settings,
//   ClipboardCheck,
//   ArrowRight,
// } from "lucide-react";

// import { useAuth } from "../../contexts/AuthContext"; 

// // --- TYPES ---
// export interface OJTRecordData {
//   changeId: string;
//   fourMChangeId: number;
//   shopfloorName: string;
//   lineName: string;
//   stationName: string;
//   departmentName: string;
//   processName: string;
// }

// interface WorkflowTask {
//   id: string;
//   label: string;
//   description: string;
//   module: string;
//   icon: any;
//   priority: string;
//   canResolve: boolean;
//   statusLabel?: string;
//   extraProps?: any;
  
//   // Secondary Button Properties
//   secondaryLabel?: string;
//   secondaryModule?: string;
//   secondaryIcon?: any;
// }

// interface DetailProps {
//   record: any;
//   onBack: () => void;
//   setSelectedModule: (id: string, data?: any) => void;
// }

// export default function ChangeRequestDetail({
//   record,
//   onBack,
//   setSelectedModule,
// }: DetailProps) {
  
//   const { user } = useAuth(); 
  
//   const currentUser = user as any;
//   const userRoleCode = typeof currentUser?.role === 'string' 
//     ? currentUser.role 
//     : currentUser?.role?.code;

//   const isCustomerUser = userRoleCode === 'CUSTOMER';
//   const isAdmin = currentUser?.is_superuser || userRoleCode === 'ADMIN';

//   const isApprover = ['QA_HOD', 'PROD_HOD', 'CUSTOMER'].includes(userRoleCode);
  
//   // ✅ NEW: State to show inspection sheet creation prompt
//   const [showInspectionPrompt, setShowInspectionPrompt] = useState(false);

//   // --- SMART WORKFLOW LOGIC ---
//   const { pending, completed, allTasks } = useMemo(() => {
//     if (!record) return { pending: [], completed: [], allTasks: [] }; 

//     const p: WorkflowTask[] = []; 
//     const c: WorkflowTask[] = []; 
//     const all: WorkflowTask[] = [];

//     const addTask = (
//         id: string, label: string, desc: string, mod: string, icon: any, 
//         prio: string, isDone: boolean, restrictedToCustomer: boolean, 
//         statusLabel?: string, 
//         secondary?: { label: string, module: string, icon: any }
//     ) => {
//         let canResolve = true;
//         if (restrictedToCustomer && !isCustomerUser && !isAdmin) canResolve = false; 
//         if (!restrictedToCustomer && isCustomerUser && !isAdmin) canResolve = false;

//         const item = { 
//             id, label, description: desc, module: mod, icon, priority: prio, 
//             canResolve, statusLabel, 
//             secondaryLabel: secondary?.label, 
//             secondaryModule: secondary?.module,
//             secondaryIcon: secondary?.icon
//         };
//         all.push(item);
//         isDone ? c.push(item) : p.push(item);
//     };

//     // 1. SETUP APPROVAL
//     if (record.action_details?.set_up_approval) {
//         const isSheetFilled = record.is_setup_sheet_filled;
        
//         if (!isSheetFilled) {
//              addTask("setup_sheet", "Fill Setup Checksheet", "Required before approval.", "setup", Zap, "High", false, false);
//         } else {
//              const nonCustomerApprovals = record.approvals?.filter((a: any) => a.role_code !== 'CUSTOMER') || [];
//              const hasRejected = nonCustomerApprovals.some((a: any) => a.status === 'rejected');
//              const allApproved = nonCustomerApprovals.length > 0 && nonCustomerApprovals.every((a: any) => a.status === 'approved');
             
//              let isDone = false;
//              let desc = "Review setup data and approve.";
//              let statusLabel = "PENDING";

//              if (allApproved) {
//                 isDone = true;
//                 desc = "Internal setup approved.";
//              } else if (hasRejected) {
//                 statusLabel = "REJECTED";
//                 desc = "Setup rejected.";
//              }

//              // Add Task with SECONDARY "VIEW SHEET" BUTTON
//              addTask(
//                  "setup_approval", "Setup Approval", desc, "approvals", UserCheck, "High", isDone, false, statusLabel,
//                  { label: "VIEW SHEET", module: "setup", icon: Eye }
//              );
//         }
//     }

//     // 2. CUSTOMER APPROVAL
//     if (record.action_details?.customer_approval) {
//         const custAppr = record.approvals?.find((a: any) => a.role_code === 'CUSTOMER');
//         const isDone = custAppr?.status === 'approved';
//         const isRejected = custAppr?.status === 'rejected';
//         let desc = "Customer authorization pending.";
//         let statusLabel = "PENDING";
//         if (isRejected) { desc = "Rejected by customer."; statusLabel = "REJECTED"; } 
//         else if (isDone) { desc = "Approved by customer."; }
//         // ✅ DYNAMIC BUTTON LOGIC
//         // If Customer -> "VIEW SHEET" (Eye Icon)
//         // If Internal -> "FILL SHEET" (Edit Icon)
//         const sheetActionLabel = isCustomerUser ? "VIEW SHEET" : "FILL SHEET";
//         const sheetActionIcon = isCustomerUser ? Eye : Edit;
        
//         addTask("customer", "Customer Approval", desc, "customer-approvals", UserCheck, "Critical", isDone, true, statusLabel,{ 
//                 label: sheetActionLabel, 
//                 module: "customer-sheet", // This opens your new Sheet Component
//                 icon: FileText 
//             });
//     }

//     // 3. RETRO INSPECTION
//     if (record.action_details?.retroactive_inspection) {
//         const isDone = record.is_retro_done; 
//         let desc = isDone ? "Retroactive data recorded." : "Previous batch inspection.";
//         addTask("retro", "Retroactive Check", desc, "rcr", ListChecks, "High", isDone, false);
//     }
  

//     // 4. OJT
//     if (record.action_details?.ojt) {
//         const isDone = record.is_ojt_done;
//         let desc = isDone ? "OJT records submitted." : "Operator training required.";
//         addTask("ojt", "On Job Training", desc, "ojt", Users, "Medium", isDone, false);
//     }

//     // 5. CONTAINMENT
//     if (record.action_details?.containment_action) {
//     const isDone = record.is_containment_done;
//     let desc = "Segregation of suspect parts.";
//     if (isDone) desc = "Containment action recorded.";
    
//     // Ensure the 4th parameter is "containment-form"
//     addTask("containment", "Containment Action", desc, "containment-form", Flag, "Critical", isDone, false);
// }
//     // 6. ID / BATCH NO
//     if (record.action_details?.identification_psn_batch_no) {
//         const isDone = record.is_batch_done;
//         let desc = isDone ? "Batch info updated." : "Update Batch/PSN info.";
//         addTask("batch", "ID / Batch No.", desc, "identification", CheckSquare, "Medium", isDone, false);
//     }

//     // 7. CHANGE TRACKING
//     if (record.action_details?.change_record) {
//         const isDone = record.is_tracking_done;
//         let desc = isDone ? "Tracking sheet updated." : "Update 4M tracking sheet.";
//         addTask("tracking", "Tracking Sheet", desc, "4m-cts", FileText, "Medium", isDone, false);
//     }
//     // 8. MACHINE CHECK SHEET
//     if (record.action_details?.machine_check_sheet) {
//         const isDone = record.is_machine_sheet_done; // Assumes backend field
//         let desc = isDone ? "Machine verification completed." : "Verify machine parameters.";
//         addTask("machine_sheet", "Machine Check Sheet", desc, "mcs", Settings, "High", isDone, false);
//     }

//     // 9. IN-PROCESS SHEET
//     if (record.action_details?.in_process_sheet) {
//         const isDone = record.is_inprocess_sheet_done; // Assumes backend field
//         let desc = isDone ? "Process inspection recorded." : "Check first-piece quality.";
//         addTask("in_process_sheet", "In-Process Sheet", desc, "in-process-sheet", ListChecks, "High", isDone, false);
//     }

//     return { pending: p, completed: c, allTasks: all };
//   }, [record, user, isCustomerUser, isAdmin, isApprover]);

//   // --- MAIN STATUS LOGIC ---
//   const isFullyClosed = (record.approval_status?.toUpperCase() === "APPROVED") && (pending.length === 0);
//   const isRejected = record.approval_status?.toUpperCase() === "REJECTED";

//   // ✅ NEW: Auto-show inspection prompt when fully closed
//   useEffect(() => {
//     if (isFullyClosed) {
//       // Check if we've already shown this prompt for this record
//       const hasShownPrompt = localStorage.getItem(`inspection_prompt_shown_${record.record_id}`);
//       if (!hasShownPrompt) {
//         setShowInspectionPrompt(true);
//       }
//     }
//   }, [isFullyClosed, record?.record_id]);

//   // ✅ NEW: Handle creating/navigating to inspection sheet
//   const handleCreateInspectionSheet = () => {
//     // Prepare pre-fill data for the inspection form
//     const inspectionPrefillData = {
//       partName: record.category_details?.description || "",
//       partNumber: record.record_id || "",
//       customer: record.customer_name || "",
//       operationName: `${record.station_name || ""} - ${record.line_name || ""}`,
//       reference_change_request: record.record_id,
//       shopfloor: record.shopfloor_name,
//       line: record.line_name,
//       station: record.station_name,
//     };

//     // Store prefill data
//     localStorage.setItem("inspection_prefill_data", JSON.stringify(inspectionPrefillData));
    
//     // Mark that we've shown the prompt for this record
//     localStorage.setItem(`inspection_prompt_shown_${record.record_id}`, "true");
    
//     // Hide the prompt
//     setShowInspectionPrompt(false);
    
//     // Navigate to in-process inspection sheet
//     setSelectedModule("in-process-sheet");
//   };

//   const handleDismissPrompt = () => {
//     localStorage.setItem(`inspection_prompt_shown_${record.record_id}`, "true");
//     setShowInspectionPrompt(false);
//   };

//   const renderMainStatus = () => {
//     if (isFullyClosed) return <div className="px-4 py-2 rounded-lg text-sm font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-2 shadow-sm"><CheckCircle className="w-5 h-5" /> APPROVED & CLOSED</div>;
//     if (isRejected) return <div className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white flex items-center gap-2 shadow-md"><XCircle className="w-5 h-5" /> REJECTED</div>;
//     return <div className="px-4 py-2 rounded-lg text-sm font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-2 shadow-sm animate-pulse"><Activity className="w-5 h-5" /> IN PROGRESS</div>;
//   };

//   const handleNavigate = (moduleId: string) => {
//     if (record?.record_id) {
//         localStorage.setItem("filter_change_request_id", record.record_id);
//         localStorage.setItem("return_to_detail_id", record.record_id);
        
//         if (moduleId === "mcs") {
//             // These two items allow the MachineCheckSheet to fetch the specific data
//             localStorage.setItem("active_record_id", record.record_id);
//             localStorage.setItem("active_four_m_id", record.id.toString());
//         }

//         if (moduleId === "containment-form") {
//         const prefillData = {
//         record_id: record.record_id,
//         department: record.shopfloor_name || "",
//         line: record.line_name || "",
//         process: record.station_name || "",
//         change_type: record.four_m || "",
//         reason: record.category_details?.description || ""
//       };
      
//       localStorage.setItem("containment_prefill_data", JSON.stringify(prefillData));
//     }
//         if (moduleId === "ojt") {
//             const ojtData: OJTRecordData = {
//                 changeId: record.record_id,
//                 fourMChangeId: record.id,
//                 shopfloorName: record.shopfloor_name || "",
//                 lineName: record.line_name || "",
//                 stationName: record.station_name || "",
//                 departmentName: record.department_name || "Production",
//                 processName: record.category_details?.description || "OJT Process"
//             };
//             localStorage.setItem("ojt_record_data", JSON.stringify(ojtData));
//         }
//     }

//     if (moduleId === "setup") {
//         const sheetType = record.shopfloor_sheet_type || 'PRODUCT';
//         const isFilled = record.is_setup_sheet_filled;
//         const readOnlyMode = isFilled || isApprover; 

//         localStorage.setItem("setup_sheet_record", JSON.stringify(record));
//         localStorage.setItem("setup_sheet_readonly", JSON.stringify(readOnlyMode));

//         switch (sheetType) {
//             case 'PAINT': setSelectedModule("paint-sheet"); break;
//             case 'PROCESS': setSelectedModule("process-sheet"); break;
//             case 'TOOLING': setSelectedModule("tool-sheet"); break;
//             case 'PRODUCT': default: setSelectedModule("product-sheet"); break;
//         }
//         return;
//     }

//     // 3. ✅ NEW: CUSTOMER SHEET LOGIC
//     if (moduleId === "customer-sheet") {
//         // We use the SAME storage key "setup_sheet_record" because your 
//         // CustomerApprovalSheet.tsx is coded to look for this specific key.
//         localStorage.setItem("setup_sheet_record", JSON.stringify(record));
        
//         // We usually don't force read-only here because the sheet has its own 
//         // internal logic (Internal users = Edit, Customer = View), 
//         // but you can set a hint if you want.
//         localStorage.setItem("setup_sheet_readonly", "false"); 

//         setSelectedModule("customer-sheet");
//         return;
//     }
//     setSelectedModule(moduleId);
//   };

//   const getGradient = () => {
//     switch(record.four_m) {
//         case "Man": return "from-blue-600 to-indigo-700";
//         case "Machine/Tool": return "from-emerald-600 to-teal-700";
//         case "Material": return "from-purple-600 to-fuchsia-700";
//         case "Method": return "from-orange-600 to-red-700";
//         default: return "from-gray-700 to-gray-900";
//     }
//   };

//   if (!record) return null;

//   return (
//     <div className="bg-gray-100 min-h-screen p-4 animate-in fade-in duration-300 font-sans text-gray-900">
      
//       {/* ✅ NEW: INSPECTION SHEET PROMPT MODAL */}
//       {showInspectionPrompt && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-300">
//             <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
//                   <ClipboardCheck className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold">Change Request Completed!</h3>
//                   <p className="text-green-100 text-sm">Ready for inspection verification</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="p-6">
//               <p className="text-gray-700 mb-4 leading-relaxed">
//                 This change request (<strong>{record.record_id}</strong>) has been <strong>approved and all tasks are completed</strong>.
//               </p>
//               <p className="text-gray-700 mb-6 leading-relaxed">
//                 Would you like to create an <strong>In-Process Inspection Sheet</strong> to verify the quality parameters after this change?
//               </p>
              
//               <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
//                 <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
//                   <FileText className="w-4 h-4" />
//                   Pre-filled Information:
//                 </h4>
//                 <ul className="text-sm text-blue-800 space-y-1">
//                   <li>• Part: {record.category_details?.description || "N/A"}</li>
//                   <li>• Location: {record.shopfloor_name} / {record.line_name}</li>
//                   <li>• Station: {record.station_name}</li>
//                 </ul>
//               </div>
              
//               <div className="flex gap-3">
//                 <button
//                   onClick={handleCreateInspectionSheet}
//                   className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
//                 >
//                   <ClipboardCheck className="w-5 h-5" />
//                   Create Inspection Sheet
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={handleDismissPrompt}
//                   className="px-6 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
//                 >
//                   Later
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* VIBRANT HEADER */}
//       <div className={`rounded-2xl shadow-lg mb-5 overflow-hidden bg-gradient-to-r ${getGradient()} text-white`}>
//         <div className="px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
//             <div className="flex items-center gap-4 w-full md:w-auto">
//                 <button onClick={onBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm border border-white/10">
//                     <ArrowLeft className="w-6 h-6 text-white" />
//                 </button>
//                 <div>
//                     <div className="flex items-center gap-3">
//                         <h1 className="text-2xl font-extrabold tracking-tight">{record.record_id}</h1>
//                         <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/20 border border-white/20 shadow-sm">{record.category_details?.category_type}</span>
//                     </div>
//                     <div className="flex items-center gap-4 mt-1 text-blue-50 text-sm font-medium">
//                         <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 opacity-80" /> {record.date}</span>
//                         <span className="w-1 h-1 bg-white/40 rounded-full"></span>
//                         <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 opacity-80" /> {record.time}</span>
//                     </div>
//                 </div>
//             </div>
//             <div className="flex items-center gap-3 w-full md:w-auto justify-end">{renderMainStatus()}</div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 max-w-[1920px] mx-auto">
        
//         {/* LEFT COLUMN: INFO & TIMELINE (Span 8) */}
//         <div className="xl:col-span-8 flex flex-col gap-5">
          
//           {/* Main Info Card */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//             <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
//                <Layers className="w-5 h-5 text-gray-500" />
//                <h3 className="font-bold text-gray-700">Change Context</h3>
//             </div>
//             <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
//               <div><div className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Building2 className="w-3 h-3"/> Shopfloor</div><div className="font-bold text-gray-900">{record.shopfloor_name}</div></div>
//               <div><div className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Router className="w-3 h-3"/> Line</div><div className="font-bold text-gray-900">{record.line_name}</div></div>
//               <div><div className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Station</div><div className="font-bold text-gray-900">{record.station_name}</div></div>
//               <div><div className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Shift</div><div className="font-bold text-gray-900">Shift {record.shift}</div></div>
//             </div>
//             <div className="px-6 pb-6 grid md:grid-cols-2 gap-4">
//                 <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
//                     <div className="text-[10px] font-bold text-blue-400 uppercase mb-2 flex items-center gap-1"><FileText className="w-3 h-3"/> Description</div>
//                     <p className="text-sm text-gray-800 font-medium leading-relaxed">{record.category_details?.description}</p>
//                 </div>
//                 <div className="bg-green-50/50 rounded-xl p-4 border border-green-100">
//                     <div className="text-[10px] font-bold text-green-500 uppercase mb-2 flex items-center gap-1"><Shield className="w-3 h-3"/> Action Taken</div>
//                     <p className="text-sm text-gray-800 font-medium leading-relaxed">{record.action_details?.action_taken}</p>
//                 </div>
//             </div>
//           </div>

//           {/* ✅ Workflow Status List (UPDATED) */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 overflow-hidden">
//             <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-100 flex items-center justify-between">
//                <h3 className="font-bold text-gray-700 flex items-center gap-2"><ListChecks className="w-5 h-5 text-gray-500"/> Workflow Status</h3>
//                <span className="text-xs font-medium text-gray-500">{completed.length} / {allTasks.length} Completed</span>
//             </div>
            
//             <div className="divide-y divide-gray-100">
//               {allTasks.length === 0 ? (
//                  <p className="text-sm text-gray-400 italic text-center py-8">No requirements tracked for this change.</p>
//               ) : (
//                  allTasks
//                  .sort((a, b) => {
//                     const isADone = completed.some(c => c.id === a.id);
//                     const isBDone = completed.some(c => c.id === b.id);
//                     return Number(isADone) - Number(isBDone); // Pending first
//                  })
//                  .map((task) => {
//                     const isCompleted = completed.some(t => t.id === task.id);
//                     const isRejected = task.statusLabel === 'REJECTED';

//                     return (
//                       <div key={task.id} className="group flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
//                         <div className="flex items-center gap-4">
//                            <div className={`p-2.5 rounded-xl shadow-sm ${isCompleted ? 'bg-green-100 text-green-700' : isRejected ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
//                                <task.icon className="w-5 h-5" />
//                            </div>
//                            <div>
//                                <div className="text-sm font-bold text-gray-900">{task.label}</div>
//                                <div className="text-xs text-gray-500">{task.description}</div>
//                            </div>
//                         </div>
                        
//                         {/* ✅ VIEW BUTTONS FOR COMPLETED ITEMS */}
//                         {isCompleted ? (
//                             <div className="flex gap-2">
//                                 {/* Primary Button (e.g. View Approval) */}
//                                 <button 
//                                     onClick={() => handleNavigate(task.module)}
//                                     className="flex items-center gap-2 px-4 py-2 bg-white border border-green-200 text-green-700 text-xs font-bold rounded-lg hover:bg-green-50 hover:border-green-300 transition-all shadow-sm"
//                                 >
//                                     <Eye className="w-3.5 h-3.5" /> VIEW DETAILS
//                                 </button>
                                
//                                 {/* Secondary Button (e.g. View Sheet) */}
//                                 {task.secondaryLabel && (
//                                     <button 
//                                         onClick={() => handleNavigate(task.secondaryModule!)} 
//                                         className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm"
//                                     >
//                                         {task.secondaryIcon && <task.secondaryIcon className="w-3.5 h-3.5" />} {task.secondaryLabel}
//                                     </button>
//                                 )}
//                             </div>
//                         ) : isRejected ? (
//                             <span className="px-3 py-1.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-lg border border-red-200 uppercase tracking-wide">Rejected</span>
//                         ) : (
//                             <span className="px-3 py-1.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-lg border border-gray-200 uppercase tracking-wide">Pending</span>
//                         )}
//                       </div>
//                     );
//                  })
//               )}
//             </div>
//           </div>

//           {/* ✅ NEW: Inspection Sheet Quick Access (when closed) */}
//           {isFullyClosed && (
//             <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-sm overflow-hidden">
//               <div className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                       <ClipboardCheck className="w-6 h-6 text-green-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-green-900">Ready for Quality Inspection</h4>
//                       <p className="text-sm text-green-700">Create in-process inspection sheet to verify changes</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={handleCreateInspectionSheet}
//                     className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
//                   >
//                     <ClipboardCheck className="w-5 h-5" />
//                     Create Inspection
//                     <ArrowRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//         </div>

//         {/* RIGHT: ACTION PANEL (Span 4) */}
//         <div className="xl:col-span-4 flex flex-col gap-5">
//           <div className="bg-white rounded-2xl border border-blue-200 shadow-md overflow-hidden flex flex-col h-full max-h-[600px] ring-4 ring-blue-50/50">
//             <div className="bg-gradient-to-r from-blue-50 to-white px-5 py-4 border-b border-blue-100 flex items-center justify-between">
//               <h3 className="font-bold text-blue-900 text-sm flex items-center gap-2">
//                   <AlertTriangle className="w-5 h-5 text-blue-600" /> Pending Actions
//               </h3>
//               {pending.length > 0 && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{pending.length}</span>}
//             </div>

//             <div className="overflow-y-auto p-4 space-y-3 flex-1 bg-gray-50/30 custom-scrollbar">
//                 {pending.length === 0 ? (
//                     <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-70">
//                         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600 shadow-sm"><CheckCircle className="w-8 h-8" /></div>
//                         <p className="text-base font-bold text-gray-900">All Clear!</p>
//                         <p className="text-xs text-gray-500 mt-1 max-w-[200px]">No actions required at this moment.</p>
//                     </div>
//                 ) : (
//                     pending.map((task) => (
//                     <div key={task.id} className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all duration-200 relative overflow-hidden">
//                         <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                         <div className="flex justify-between items-start mb-3 pl-2">
//                             <div className="flex items-center gap-2.5">
//                                 <task.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
//                                 <span className="font-bold text-gray-800 text-sm">{task.label}</span>
//                             </div>
//                             {task.priority === 'Critical' && <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-extrabold border border-red-200">CRITICAL</span>}
//                         </div>
//                         <div className="pl-2 flex gap-2">
//                             {task.canResolve ? (
//                                 <button onClick={() => handleNavigate(task.module)} className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all">
//                                     RESOLVE NOW <ExternalLink className="w-3 h-3" />
//                                 </button>
//                             ) : (
//                                 <div className="flex-1 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg border border-gray-200 text-center flex items-center justify-center gap-2 cursor-not-allowed">
//                                     <Lock className="w-3 h-3" /> WAITING / RESTRICTED
//                                 </div>
//                             )}
//                             {task.secondaryLabel && (
//                                 <button 
//                                     onClick={() => handleNavigate(task.secondaryModule!)} 
//                                     className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 text-xs font-bold rounded-lg hover:bg-indigo-100 flex items-center justify-center gap-2 transition-all"
//                                     title={task.secondaryLabel}
//                                 >
//                                     {task.secondaryIcon && <task.secondaryIcon className="w-3.5 h-3.5" />}
//                                     <span className="hidden xl:inline">{task.secondaryLabel}</span>
//                                     <span className="xl:hidden"><Eye className="w-3.5 h-3.5" /></span>
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                     ))
//                 )}
//             </div>
//           </div>
          
//           <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
//              <div className="flex items-center gap-3">
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${record.action_details?.approving_authority ? "bg-indigo-50 text-indigo-600 ring-2 ring-indigo-100" : "bg-gray-100 text-gray-400"}`}>
//                     {record.action_details?.approving_authority ? <UserCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
//                 </div>
//                 <div>
//                     <div className="text-[10px] font-bold text-gray-400 uppercase">Approving Authority</div>
//                     <div className="font-bold text-gray-900 text-sm">{record.action_details?.approving_authority || "Pending Assignment"}</div>
//                 </div>
//              </div>
//              {record.action_details?.approving_authority && <div className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-100">HOD</div>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useMemo, useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  FileText,
  ListChecks,
  ExternalLink,
  Printer,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  CheckSquare,
  MapPin,
  Router,
  Zap,
  Flag,
  UserCheck,
  Eye,
  Lock,
  Shield,
  Activity,
  Layers,
  User,
  Edit,
  Settings,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext"; 

// --- TYPES ---
export interface OJTRecordData {
  changeId: string;
  fourMChangeId: number;
  shopfloorName: string;
  lineName: string;
  stationName: string;
  departmentName: string;
  processName: string;
}

interface WorkflowTask {
  id: string;
  label: string;
  description: string;
  module: string;
  icon: any;
  priority: string;
  canResolve: boolean;
  statusLabel?: string;
  extraProps?: any;
  
  // Secondary Button Properties
  secondaryLabel?: string;
  secondaryModule?: string;
  secondaryIcon?: any;
}

interface DetailProps {
  record: any;
  onBack: () => void;
  setSelectedModule: (id: string, data?: any) => void;
}

export default function ChangeRequestDetail({
  record,
  onBack,
  setSelectedModule,
}: DetailProps) {
  
  const { user } = useAuth(); 
  
  const currentUser = user as any;
  const userRoleCode = typeof currentUser?.role === 'string' 
    ? currentUser.role 
    : currentUser?.role?.code;

  const isCustomerUser = userRoleCode === 'CUSTOMER';
  const isAdmin = currentUser?.is_superuser || userRoleCode === 'ADMIN';

  const isApprover = ['QA_HOD', 'PROD_HOD', 'CUSTOMER'].includes(userRoleCode);
  
  // ✅ NEW: State to show inspection sheet creation prompt
  const [showInspectionPrompt, setShowInspectionPrompt] = useState(false);

  // --- SMART WORKFLOW LOGIC ---
  const { pending, completed, allTasks } = useMemo(() => {
    if (!record) return { pending: [], completed: [], allTasks: [] }; 

    const p: WorkflowTask[] = []; 
    const c: WorkflowTask[] = []; 
    const all: WorkflowTask[] = [];

    const addTask = (
        id: string, label: string, desc: string, mod: string, icon: any, 
        prio: string, isDone: boolean, restrictedToCustomer: boolean, 
        statusLabel?: string, 
        secondary?: { label: string, module: string, icon: any }
    ) => {
        let canResolve = true;
        if (restrictedToCustomer && !isCustomerUser && !isAdmin) canResolve = false; 
        if (!restrictedToCustomer && isCustomerUser && !isAdmin) canResolve = false;

        const item = { 
            id, label, description: desc, module: mod, icon, priority: prio, 
            canResolve, statusLabel, 
            secondaryLabel: secondary?.label, 
            secondaryModule: secondary?.module,
            secondaryIcon: secondary?.icon
        };
        all.push(item);
        isDone ? c.push(item) : p.push(item);
    };

    // 1. SETUP APPROVAL
    if (record.action_details?.set_up_approval) {
        const isSheetFilled = record.is_setup_sheet_filled;
        
        if (!isSheetFilled) {
             addTask("setup_sheet", "Fill Setup Checksheet", "Required before approval.", "setup", Zap, "High", false, false);
        } else {
             const nonCustomerApprovals = record.approvals?.filter((a: any) => a.role_code !== 'CUSTOMER') || [];
             const hasRejected = nonCustomerApprovals.some((a: any) => a.status === 'rejected');
             const allApproved = nonCustomerApprovals.length > 0 && nonCustomerApprovals.every((a: any) => a.status === 'approved');
             
             let isDone = false;
             let desc = "Review setup data and approve.";
             let statusLabel = "PENDING";

             if (allApproved) {
                isDone = true;
                desc = "Internal setup approved.";
             } else if (hasRejected) {
                statusLabel = "REJECTED";
                desc = "Setup rejected.";
             }

             // Add Task with SECONDARY "VIEW SHEET" BUTTON
             addTask(
                 "setup_approval", "Setup Approval", desc, "approvals", UserCheck, "High", isDone, false, statusLabel,
                 { label: "VIEW SHEET", module: "setup", icon: Eye }
             );
        }
    }

    // 2. CUSTOMER APPROVAL
    if (record.action_details?.customer_approval) {
        const custAppr = record.approvals?.find((a: any) => a.role_code === 'CUSTOMER');
        const isDone = custAppr?.status === 'approved';
        const isRejected = custAppr?.status === 'rejected';
        let desc = "Customer authorization pending.";
        let statusLabel = "PENDING";
        if (isRejected) { desc = "Rejected by customer."; statusLabel = "REJECTED"; } 
        else if (isDone) { desc = "Approved by customer."; }
        // ✅ DYNAMIC BUTTON LOGIC
        // If Customer -> "VIEW SHEET" (Eye Icon)
        // If Internal -> "FILL SHEET" (Edit Icon)
        const sheetActionLabel = isCustomerUser ? "VIEW SHEET" : "FILL SHEET";
        const sheetActionIcon = isCustomerUser ? Eye : Edit;
        
        addTask("customer", "Customer Approval", desc, "customer-approvals", UserCheck, "Critical", isDone, true, statusLabel,{ 
                label: sheetActionLabel, 
                module: "customer-sheet", // This opens your new Sheet Component
                icon: FileText 
            });
    }

    // 3. RETRO INSPECTION
    if (record.action_details?.retroactive_inspection) {
        const isDone = record.is_retro_done; 
        let desc = isDone ? "Retroactive data recorded." : "Previous batch inspection.";
        addTask("retro", "Retroactive Check", desc, "rcr", ListChecks, "High", isDone, false);
    }
  

    // 4. OJT
    if (record.action_details?.ojt) {
        const isDone = record.is_ojt_done;
        let desc = isDone ? "OJT records submitted." : "Operator training required.";
        addTask("ojt", "On Job Training", desc, "ojt", Users, "Medium", isDone, false);
    }

    // 5. CONTAINMENT
    if (record.action_details?.containment_action) {
    const isDone = record.is_containment_done;
    let desc = "Segregation of suspect parts.";
    if (isDone) desc = "Containment action recorded.";
    
    // Ensure the 4th parameter is "containment-form"
    addTask("containment", "Containment Action", desc, "containment-form", Flag, "Critical", isDone, false);
}
    // 6. ID / BATCH NO
    if (record.action_details?.identification_psn_batch_no) {
        const isDone = record.is_batch_done;
        let desc = isDone ? "Batch info updated." : "Update Batch/PSN info.";
        addTask("batch", "ID / Batch No.", desc, "identification", CheckSquare, "Medium", isDone, false);
    }

    // 7. CHANGE TRACKING
    if (record.action_details?.change_record) {
        const isDone = record.is_tracking_done;
        let desc = isDone ? "Tracking sheet updated." : "Update 4M tracking sheet.";
        addTask("tracking", "Tracking Sheet", desc, "4m-cts", FileText, "Medium", isDone, false);
    }
    // 8. MACHINE CHECK SHEET
    if (record.action_details?.machine_check_sheet) {
        const isDone = record.is_machine_sheet_done; // Assumes backend field
        let desc = isDone ? "Machine verification completed." : "Verify machine parameters.";
        addTask("machine_sheet", "Machine Check Sheet", desc, "mcs", Settings, "High", isDone, false);
    }

    // 9. IN-PROCESS SHEET
    if (record.action_details?.in_process_sheet) {
        const isDone = record.is_inprocess_sheet_done; // Assumes backend field
        let desc = isDone ? "Process inspection recorded." : "Check first-piece quality.";
        addTask("in_process_sheet", "In-Process Sheet", desc, "in-process-sheet", ListChecks, "High", isDone, false);
    }

    return { pending: p, completed: c, allTasks: all };
  }, [record, user, isCustomerUser, isAdmin, isApprover]);

  // --- MAIN STATUS LOGIC ---
  const isFullyClosed = (record.approval_status?.toUpperCase() === "APPROVED") && (pending.length === 0);
  const isRejected = record.approval_status?.toUpperCase() === "REJECTED";

  // ✅ NEW: Auto-show inspection prompt when fully closed
  useEffect(() => {
    if (isFullyClosed) {
      // Check if we've already shown this prompt for this record
      const hasShownPrompt = localStorage.getItem(`inspection_prompt_shown_${record.record_id}`);
      if (!hasShownPrompt) {
        setShowInspectionPrompt(true);
      }
    }
  }, [isFullyClosed, record?.record_id]);

  // ✅ NEW: Handle creating/navigating to inspection sheet
  const handleCreateInspectionSheet = () => {
    // Prepare pre-fill data for the inspection form
    const inspectionPrefillData = {
      partName: record.category_details?.description || "",
      partNumber: record.record_id || "",
      customer: record.customer_name || "",
      operationName: `${record.station_name || ""} - ${record.line_name || ""}`,
      reference_change_request: record.record_id,
      shopfloor: record.shopfloor_name,
      line: record.line_name,
      station: record.station_name,
    };

    // Store prefill data
    localStorage.setItem("inspection_prefill_data", JSON.stringify(inspectionPrefillData));
    
    // Mark that we've shown the prompt for this record
    localStorage.setItem(`inspection_prompt_shown_${record.record_id}`, "true");
    
    // Hide the prompt
    setShowInspectionPrompt(false);
    
    // Navigate to in-process inspection sheet
    setSelectedModule("iic-sar");
  };

  const handleDismissPrompt = () => {
    localStorage.setItem(`inspection_prompt_shown_${record.record_id}`, "true");
    setShowInspectionPrompt(false);
  };

  const renderMainStatus = () => {
    if (isFullyClosed) return <div className="px-4 py-2 rounded-lg text-sm font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-2 shadow-sm"><CheckCircle className="w-5 h-5" /> APPROVED & CLOSED</div>;
    if (isRejected) return <div className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white flex items-center gap-2 shadow-md"><XCircle className="w-5 h-5" /> REJECTED</div>;
    return <div className="px-4 py-2 rounded-lg text-sm font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-2 shadow-sm animate-pulse"><Activity className="w-5 h-5" /> IN PROGRESS</div>;
  };

  const handleNavigate = (moduleId: string) => {
    if (record?.record_id) {
        localStorage.setItem("filter_change_request_id", record.record_id);
        localStorage.setItem("return_to_detail_id", record.record_id);
        
        if (moduleId === "mcs") {
            // These two items allow the MachineCheckSheet to fetch the specific data
            localStorage.setItem("active_record_id", record.record_id);
            localStorage.setItem("active_four_m_id", record.id.toString());
        }

        if (moduleId === "containment-form") {
        const prefillData = {
        record_id: record.record_id,
        department: record.shopfloor_name || "",
        line: record.line_name || "",
        process: record.station_name || "",
        change_type: record.four_m || "",
        reason: record.category_details?.description || ""
      };
      
      localStorage.setItem("containment_prefill_data", JSON.stringify(prefillData));
    }
        if (moduleId === "ojt") {
            const ojtData: OJTRecordData = {
                changeId: record.record_id,
                fourMChangeId: record.id,
                shopfloorName: record.shopfloor_name || "",
                lineName: record.line_name || "",
                stationName: record.station_name || "",
                departmentName: record.department_name || "Production",
                processName: record.category_details?.description || "OJT Process"
            };
            localStorage.setItem("ojt_record_data", JSON.stringify(ojtData));
        }
    }

    if (moduleId === "setup") {
        const sheetType = record.shopfloor_sheet_type || 'PRODUCT';
        const isFilled = record.is_setup_sheet_filled;
        const readOnlyMode = isFilled || isApprover; 

        localStorage.setItem("setup_sheet_record", JSON.stringify(record));
        localStorage.setItem("setup_sheet_readonly", JSON.stringify(readOnlyMode));

        switch (sheetType) {
            case 'PAINT': setSelectedModule("paint-sheet"); break;
            case 'PROCESS': setSelectedModule("process-sheet"); break;
            case 'TOOLING': setSelectedModule("tool-sheet"); break;
            case 'PRODUCT': default: setSelectedModule("product-sheet"); break;
        }
        return;
    }

    // 3. ✅ NEW: CUSTOMER SHEET LOGIC
    if (moduleId === "customer-sheet") {
        // We use the SAME storage key "setup_sheet_record" because your 
        // CustomerApprovalSheet.tsx is coded to look for this specific key.
        localStorage.setItem("setup_sheet_record", JSON.stringify(record));
        
        // We usually don't force read-only here because the sheet has its own 
        // internal logic (Internal users = Edit, Customer = View), 
        // but you can set a hint if you want.
        localStorage.setItem("setup_sheet_readonly", "false"); 

        setSelectedModule("customer-sheet");
        return;
    }
    setSelectedModule(moduleId);
  };

  const getGradient = () => {
    switch(record.four_m) {
        case "Man": return "from-blue-600 to-indigo-700";
        case "Machine/Tool": return "from-emerald-600 to-teal-700";
        case "Material": return "from-purple-600 to-fuchsia-700";
        case "Method": return "from-orange-600 to-red-700";
        default: return "from-gray-700 to-gray-900";
    }
  };

  if (!record) return null;

  return (
    <div className="bg-gray-100 min-h-screen p-4 animate-in fade-in duration-300 font-sans text-gray-900">
      
      {/* ✅ NEW: INSPECTION SHEET PROMPT MODAL */}
      {showInspectionPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Change Request Completed!</h3>
                  <p className="text-green-100 text-sm">Ready for inspection verification</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4 leading-relaxed">
                This change request (<strong>{record.record_id}</strong>) has been <strong>approved and all tasks are completed</strong>.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Would you like to create an <strong>In-Process Inspection Sheet</strong> to verify the quality parameters after this change?
              </p>
              
              <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Pre-filled Information:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Part: {record.category_details?.description || "N/A"}</li>
                  <li>• Location: {record.shopfloor_name} / {record.line_name}</li>
                  <li>• Station: {record.station_name}</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCreateInspectionSheet}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <ClipboardCheck className="w-5 h-5" />
                  Create Inspection Sheet
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDismissPrompt}
                  className="px-6 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIBRANT HEADER */}
      <div className={`rounded-2xl shadow-lg mb-5 overflow-hidden bg-gradient-to-r ${getGradient()} text-white`}>
        <div className="px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <button onClick={onBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm border border-white/10">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-extrabold tracking-tight">{record.record_id}</h1>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/20 border border-white/20 shadow-sm">{record.category_details?.category_type}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-blue-50 text-sm font-medium">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 opacity-80" /> {record.date}</span>
                        <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 opacity-80" /> {record.time}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">{renderMainStatus()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 max-w-[1920px] mx-auto">
        
        {/* LEFT COLUMN: INFO & TIMELINE (Span 8) */}
        <div className="xl:col-span-8 flex flex-col gap-5">
          
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
               <Layers className="w-5 h-5 text-gray-500" />
               <h3 className="font-bold text-gray-700">Change Context</h3>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
              <div><div className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Building2 className="w-3 h-3"/> Shopfloor</div><div className="font-bold text-gray-900">{record.shopfloor_name}</div></div>
              <div><div className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Router className="w-3 h-3"/> Line</div><div className="font-bold text-gray-900">{record.line_name}</div></div>
              <div><div className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Station</div><div className="font-bold text-gray-900">{record.station_name}</div></div>
              <div><div className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Shift</div><div className="font-bold text-gray-900">Shift {record.shift}</div></div>
            </div>
            <div className="px-6 pb-6 grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                    <div className="text-[10px] font-bold text-blue-400 uppercase mb-2 flex items-center gap-1"><FileText className="w-3 h-3"/> Description</div>
                    <p className="text-sm text-gray-800 font-medium leading-relaxed">{record.category_details?.description}</p>
                </div>
                <div className="bg-green-50/50 rounded-xl p-4 border border-green-100">
                    <div className="text-[10px] font-bold text-green-500 uppercase mb-2 flex items-center gap-1"><Shield className="w-3 h-3"/> Action Taken</div>
                    <p className="text-sm text-gray-800 font-medium leading-relaxed">{record.action_details?.action_taken}</p>
                </div>
            </div>
          </div>

          {/* ✅ Workflow Status List (UPDATED) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 overflow-hidden">
            <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-100 flex items-center justify-between">
               <h3 className="font-bold text-gray-700 flex items-center gap-2"><ListChecks className="w-5 h-5 text-gray-500"/> Workflow Status</h3>
               <span className="text-xs font-medium text-gray-500">{completed.length} / {allTasks.length} Completed</span>
            </div>
            
            <div className="divide-y divide-gray-100">
              {allTasks.length === 0 ? (
                 <p className="text-sm text-gray-400 italic text-center py-8">No requirements tracked for this change.</p>
              ) : (
                 allTasks
                 .sort((a, b) => {
                    const isADone = completed.some(c => c.id === a.id);
                    const isBDone = completed.some(c => c.id === b.id);
                    return Number(isADone) - Number(isBDone); // Pending first
                 })
                 .map((task) => {
                    const isCompleted = completed.some(t => t.id === task.id);
                    const isRejected = task.statusLabel === 'REJECTED';

                    return (
                      <div key={task.id} className="group flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className={`p-2.5 rounded-xl shadow-sm ${isCompleted ? 'bg-green-100 text-green-700' : isRejected ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                               <task.icon className="w-5 h-5" />
                           </div>
                           <div>
                               <div className="text-sm font-bold text-gray-900">{task.label}</div>
                               <div className="text-xs text-gray-500">{task.description}</div>
                           </div>
                        </div>
                        
                        {/* ✅ VIEW BUTTONS FOR COMPLETED ITEMS */}
                        {isCompleted ? (
                            <div className="flex gap-2">
                                {/* Primary Button (e.g. View Approval) */}
                                <button 
                                    onClick={() => handleNavigate(task.module)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-green-200 text-green-700 text-xs font-bold rounded-lg hover:bg-green-50 hover:border-green-300 transition-all shadow-sm"
                                >
                                    <Eye className="w-3.5 h-3.5" /> VIEW DETAILS
                                </button>
                                
                                {/* Secondary Button (e.g. View Sheet) */}
                                {task.secondaryLabel && (
                                    <button 
                                        onClick={() => handleNavigate(task.secondaryModule!)} 
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm"
                                    >
                                        {task.secondaryIcon && <task.secondaryIcon className="w-3.5 h-3.5" />} {task.secondaryLabel}
                                    </button>
                                )}
                            </div>
                        ) : isRejected ? (
                            <span className="px-3 py-1.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-lg border border-red-200 uppercase tracking-wide">Rejected</span>
                        ) : (
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-lg border border-gray-200 uppercase tracking-wide">Pending</span>
                        )}
                      </div>
                    );
                 })
              )}
            </div>
          </div>

          {/* ✅ NEW: Inspection Sheet Quick Access (when closed) */}
          {isFullyClosed && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <ClipboardCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-green-900">Ready for Quality Inspection</h4>
                      <p className="text-sm text-green-700">Create in-process inspection sheet to verify changes</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCreateInspectionSheet}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <ClipboardCheck className="w-5 h-5" />
                    Create Inspection
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT: ACTION PANEL (Span 4) */}
        <div className="xl:col-span-4 flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-blue-200 shadow-md overflow-hidden flex flex-col h-full max-h-[600px] ring-4 ring-blue-50/50">
            <div className="bg-gradient-to-r from-blue-50 to-white px-5 py-4 border-b border-blue-100 flex items-center justify-between">
              <h3 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600" /> Pending Actions
              </h3>
              {pending.length > 0 && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{pending.length}</span>}
            </div>

            <div className="overflow-y-auto p-4 space-y-3 flex-1 bg-gray-50/30 custom-scrollbar">
                {pending.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-70">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600 shadow-sm"><CheckCircle className="w-8 h-8" /></div>
                        <p className="text-base font-bold text-gray-900">All Clear!</p>
                        <p className="text-xs text-gray-500 mt-1 max-w-[200px]">No actions required at this moment.</p>
                    </div>
                ) : (
                    pending.map((task) => (
                    <div key={task.id} className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all duration-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-start mb-3 pl-2">
                            <div className="flex items-center gap-2.5">
                                <task.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                <span className="font-bold text-gray-800 text-sm">{task.label}</span>
                            </div>
                            {task.priority === 'Critical' && <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-extrabold border border-red-200">CRITICAL</span>}
                        </div>
                        <div className="pl-2 flex gap-2">
                            {task.canResolve ? (
                                <button onClick={() => handleNavigate(task.module)} className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all">
                                    RESOLVE NOW <ExternalLink className="w-3 h-3" />
                                </button>
                            ) : (
                                <div className="flex-1 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg border border-gray-200 text-center flex items-center justify-center gap-2 cursor-not-allowed">
                                    <Lock className="w-3 h-3" /> WAITING / RESTRICTED
                                </div>
                            )}
                            {task.secondaryLabel && (
                                <button 
                                    onClick={() => handleNavigate(task.secondaryModule!)} 
                                    className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 text-xs font-bold rounded-lg hover:bg-indigo-100 flex items-center justify-center gap-2 transition-all"
                                    title={task.secondaryLabel}
                                >
                                    {task.secondaryIcon && <task.secondaryIcon className="w-3.5 h-3.5" />}
                                    <span className="hidden xl:inline">{task.secondaryLabel}</span>
                                    <span className="xl:hidden"><Eye className="w-3.5 h-3.5" /></span>
                                </button>
                            )}
                        </div>
                    </div>
                    ))
                )}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${record.action_details?.approving_authority ? "bg-indigo-50 text-indigo-600 ring-2 ring-indigo-100" : "bg-gray-100 text-gray-400"}`}>
                    {record.action_details?.approving_authority ? <UserCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Approving Authority</div>
                    <div className="font-bold text-gray-900 text-sm">{record.action_details?.approving_authority || "Pending Assignment"}</div>
                </div>
             </div>
             {record.action_details?.approving_authority && <div className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-100">HOD</div>}
          </div>
        </div>
      </div>
    </div>
  );
}