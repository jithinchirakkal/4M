import React, { useMemo } from "react";
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
  PlayCircle,
  Shield
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext"; 

// --- HELPER: Render Main Record Status ---
const renderMainStatus = (status: string) => {

// 1. Normalize to uppercase to be safe
  const s = status ? status.toUpperCase() : "";

  if (s === "APPROVED") 
    return <span className="px-4 py-2 rounded-xl text-sm font-bold bg-green-100 text-green-700 flex items-center gap-2 border border-green-200"><CheckCircle className="w-5 h-5" /> APPROVED & CLOSED</span>;
  if (s === "REJECTED")
    return <span className="px-4 py-2 rounded-xl text-sm font-bold bg-red-100 text-red-700 flex items-center gap-2 border border-red-200"><XCircle className="w-5 h-5" /> REJECTED</span>;
  return <span className="px-4 py-2 rounded-xl text-sm font-bold bg-yellow-100 text-yellow-700 flex items-center gap-2 border border-yellow-200 animate-pulse"><Clock className="w-5 h-5" /> APPROVAL PENDING</span>;
};

// --- HELPER: Render Setup Status (Matches your Table Logic) ---
const renderSetupStatus = (record: any) => {
    if (!record.action_details?.set_up_approval) return <span className="text-gray-400 font-bold text-xs bg-gray-100 px-3 py-1 rounded-full border border-gray-200">N/A</span>;

    const nonCustomerApprovals = record.approvals?.filter((a: any) => a.role_code !== 'CUSTOMER') || [];

    if (nonCustomerApprovals.length === 0) {
        return <span className="text-yellow-700 font-bold text-xs bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200 animate-pulse">PENDING</span>;
    }

    const hasRejected = nonCustomerApprovals.some((a: any) => a.status === 'rejected');
    if (hasRejected) {
        return <span className="text-red-700 font-bold text-xs bg-red-100 px-3 py-1 rounded-full border border-red-200">✗ REJECTED</span>;
    }

    const allApproved = nonCustomerApprovals.every((a: any) => a.status === 'approved');
    if (allApproved) {
        return <span className="text-green-700 font-bold text-xs bg-green-100 px-3 py-1 rounded-full border border-green-200">✓ APPROVED</span>;
    }

    return <span className="text-yellow-700 font-bold text-xs bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200 animate-pulse">PENDING</span>;
}

// --- HELPER: Render Customer Status ---
const renderCustomerStatus = (item: any) => {
    if (!item.action_details?.customer_approval) return <span className="text-gray-400 font-bold text-xs bg-gray-100 px-3 py-1 rounded-full border border-gray-200">N/A</span>;
    const approval = item.approvals?.find((a: any) => a.role_code === 'CUSTOMER');
    if (!approval) return <span className="text-yellow-700 font-bold text-xs bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200 animate-pulse">PENDING</span>;
    if (approval.status === 'approved') return <span className="text-green-700 font-bold text-xs bg-green-100 px-3 py-1 rounded-full border border-green-200">✓ APPROVED</span>;
    if (approval.status === 'rejected') return <span className="text-red-700 font-bold text-xs bg-red-100 px-3 py-1 rounded-full border border-red-200">✗ REJECTED</span>;
    return <span className="text-yellow-700 font-bold text-xs bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200 animate-pulse">PENDING</span>;
}

// --- HELPER: Generic Requirement Tag ---
const renderRequirementTag = (isRequired: boolean) => {
    return isRequired 
      ? <span className="text-green-700 font-extrabold text-xs bg-green-100 px-3 py-1 rounded-full shadow-sm border border-green-200">REQUIRED</span>
      : <span className="text-gray-400 font-bold text-xs bg-gray-100 px-3 py-1 rounded-full border border-gray-200">N/A</span>;
}

interface WorkflowTask {
  id: string;
  label: string;
  description: string;
  module: string;
  icon: any;
  priority: string;
  canResolve: boolean;
  statusLabel?: string; // Optional label for specific status
}

interface DetailProps {
  record: any;
  onBack: () => void;
  setSelectedModule: (id: string) => void;
}

export default function ChangeRequestDetail({
  record,
  onBack,
  setSelectedModule,
}: DetailProps) {
  

    // --- 🔴 INSERT DEBUGGING HERE 🔴 ---
  console.log("=== DEBUGGING RECORD ID:", record.record_id, "===");
  console.log("1. Main Status Field:", record.approval_status); // Check exact spelling/case
  console.log("2. Approvals List:", record.approvals); // Check who is still pending
  console.log("3. Action Details:", record.action_details);
  // ------------------------------------
  const { user } = useAuth(); 
  
  // Safe User Role Access
  const currentUser = user as any;
  const userRoleCode = typeof currentUser?.role === 'string' ? currentUser.role : currentUser?.role?.code;

  const isCustomerUser = userRoleCode === 'CUSTOMER';
  const isAdmin = currentUser?.is_superuser || userRoleCode === 'ADMIN';

  // --- NAVIGATION ---
  const handleNavigate = (moduleId: string) => {
    if (record?.record_id) {
        // 1. Send ID to filter the next page
        localStorage.setItem("filter_change_request_id", record.record_id);
        
        // 2. THIS WAS MISSING: Set the flag to come back here later!
        localStorage.setItem("return_to_detail_id", record.record_id);
    }
    setSelectedModule(moduleId);
  };

  // --- SMART WORKFLOW LOGIC ---
//   const { pending, completed } = useMemo(() => {
//     if (!record) return { pending: [], completed: [] }; 

//     const p: WorkflowTask[] = []; 
//     const c: WorkflowTask[] = []; 

//     // Helper to add tasks
//     const addTask = (id: string, label: string, desc: string, mod: string, icon: any, prio: string, isDone: boolean, restrictedToCustomer: boolean, statusLabel?: string) => {
//         let canResolve = true;
//         if (restrictedToCustomer && !isCustomerUser && !isAdmin) canResolve = false; 
//         if (!restrictedToCustomer && isCustomerUser && !isAdmin) canResolve = false;

//         const item = { id, label, description: desc, module: mod, icon, priority: prio, canResolve, statusLabel };
//         isDone ? c.push(item) : p.push(item);
//     };

//     // --- 1. SETUP APPROVAL (Updated Logic) ---
//     if (record.action_details?.set_up_approval) {
//         const nonCustomerApprovals = record.approvals?.filter((a: any) => a.role_code !== 'CUSTOMER') || [];
        
//         let isDone = false;
//         let desc = "Machine/Process setup verification required.";
//         let statusLabel = "PENDING";

//         // Logic matched from your table:
//         const hasRejected = nonCustomerApprovals.some((a: any) => a.status === 'rejected');
//         const allApproved = nonCustomerApprovals.length > 0 && nonCustomerApprovals.every((a: any) => a.status === 'approved');

//         if (allApproved) {
//             isDone = true;
//             desc = "Setup approved by all authorities.";
//         } else if (hasRejected) {
//             statusLabel = "REJECTED";
//             desc = "Setup approval was REJECTED.";
//         }

//         addTask("setup", "Setup Approval", desc, "approvals", Zap, "High", isDone, false, statusLabel);
//     }

//     // --- 2. CUSTOMER APPROVAL (Updated Logic) ---
//     if (record.action_details?.customer_approval) {
//         const custAppr = record.approvals?.find((a: any) => a.role_code === 'CUSTOMER');
//         const isDone = custAppr?.status === 'approved';
//         const isRejected = custAppr?.status === 'rejected';
        
//         let desc = "Approval required from customer.";
//         let statusLabel = "PENDING";

//         if (isRejected) {
//             desc = "Request REJECTED by customer.";
//             statusLabel = "REJECTED";
//         } else if (isDone) {
//             desc = "Approved by customer.";
//         }

//         addTask("customer", "Customer Approval", desc, "customer-approvals", UserCheck, "Critical", isDone, true, statusLabel);
//     }

//     // --- 3. IDENTIFICATION ---
//     if (record.action_details?.identification_psn_batch_no) {
//         addTask("batch", "ID / Batch No.", "Update Batch or PSN identification.", "identification", CheckSquare, "Medium", false, false);
//     }

//     // --- 4. RETRO INSPECTION ---
//     if (record.action_details?.retroactive_inspection) {
//         addTask("retro", "Retroactive Inspection", "Quality inspection for previous batches.", "rcr", ListChecks, "High", false, false);
//     }

//     // --- 5. CHANGE TRACKING ---
//     if (record.action_details?.change_record) {
//         addTask("tracking", "Change Tracking Sheet", "Update 4M tracking sheet details.", "4m-cts", FileText, "Medium", false, false);
//     }

//     // --- 6. CONTAINMENT ---
//     if (record.action_details?.containment_action) {
//         addTask("containment", "Containment Action", "Segregation of suspect parts.", "containment", Flag, "Critical", false, false);
//     }

//     // --- 7. OJT ---
//     if (record.action_details?.ojt) {
//         addTask("ojt", "On Job Training (OJT)", "Operator training records.", "ojt", Users, "Medium", false, false);
//     }

//     return { pending: p, completed: c };
//   }, [record, user, isCustomerUser, isAdmin]);

// --- SMART WORKFLOW LOGIC ---
  const { pending, completed } = useMemo(() => {
    if (!record) return { pending: [], completed: [] }; 

    const p: WorkflowTask[] = []; 
    const c: WorkflowTask[] = []; 

    // Helper to add tasks (Unchanged)
    const addTask = (id: string, label: string, desc: string, mod: string, icon: any, prio: string, isDone: boolean, restrictedToCustomer: boolean, statusLabel?: string) => {
        let canResolve = true;
        if (restrictedToCustomer && !isCustomerUser && !isAdmin) canResolve = false; 
        if (!restrictedToCustomer && isCustomerUser && !isAdmin) canResolve = false;

        const item = { id, label, description: desc, module: mod, icon, priority: prio, canResolve, statusLabel };
        isDone ? c.push(item) : p.push(item);
    };

    // 1. SETUP APPROVAL (Existing Logic)
    if (record.action_details?.set_up_approval) {
        const nonCustomerApprovals = record.approvals?.filter((a: any) => a.role_code !== 'CUSTOMER') || [];
        
        let isDone = false;
        let desc = "Machine/Process setup verification required.";
        let statusLabel = "PENDING";

        // Logic matched from your table:
        const hasRejected = nonCustomerApprovals.some((a: any) => a.status === 'rejected');
        const allApproved = nonCustomerApprovals.length > 0 && nonCustomerApprovals.every((a: any) => a.status === 'approved');

        if (allApproved) {
            isDone = true;
            desc = "Setup approved by all authorities.";
        } else if (hasRejected) {
            statusLabel = "REJECTED";
            desc = "Setup approval was REJECTED.";
        }

        addTask("setup", "Setup Approval", desc, "approvals", Zap, "High", isDone, false, statusLabel);
    }

    // 2. CUSTOMER APPROVAL (Existing Logic)
      if (record.action_details?.customer_approval) {
        const custAppr = record.approvals?.find((a: any) => a.role_code === 'CUSTOMER');
        const isDone = custAppr?.status === 'approved';
        const isRejected = custAppr?.status === 'rejected';
        
        let desc = "Approval required from customer.";
        let statusLabel = "PENDING";

        if (isRejected) {
            desc = "Request REJECTED by customer.";
            statusLabel = "REJECTED";
        } else if (isDone) {
            desc = "Approved by customer.";
        }

        addTask("customer", "Customer Approval", desc, "customer-approvals", UserCheck, "Critical", isDone, true, statusLabel);
    }

    // --- 3. RETRO INSPECTION (Updated for RCR) ---
    if (record.action_details?.retroactive_inspection) {
        // READ FROM BACKEND
        const isDone = record.is_retro_done; 
        
        let desc = "Quality inspection for previous batches.";
        if (isDone) desc = "Retroactive inspection data submitted successfully.";

        addTask("retro", "Retroactive Inspection", desc, "rcr", ListChecks, "High", isDone, false);
    }

    // --- 4. OJT (Placeholder Ready) ---
    if (record.action_details?.ojt) {
        // READ FROM BACKEND
        const isDone = record.is_ojt_done;

        let desc = "Operator training records.";
        if (isDone) desc = "OJT records submitted.";

        addTask("ojt", "On Job Training (OJT)", desc, "ojt", Users, "Medium", isDone, false);
    }

    // --- 5. CONTAINMENT (Placeholder Ready) ---
    if (record.action_details?.containment_action) {
        // READ FROM BACKEND
        const isDone = record.is_containment_done;
        
        let desc = "Segregation of suspect parts.";
        if (isDone) desc = "Containment action recorded.";

        addTask("containment", "Containment Action", desc, "containment", Flag, "Critical", isDone, false);
    }

    // --- 6. ID / BATCH NO (Placeholder Ready) ---
    if (record.action_details?.identification_psn_batch_no) {
        // READ FROM BACKEND
        const isDone = record.is_batch_done;
        
        let desc = "Update Batch or PSN identification.";
        if (isDone) desc = "Batch info updated.";

        addTask("batch", "ID / Batch No.", desc, "identification", CheckSquare, "Medium", isDone, false);
    }

    // --- 7. CHANGE TRACKING (Placeholder Ready) ---
    if (record.action_details?.change_record) {
        // READ FROM BACKEND
        const isDone = record.is_tracking_done;

        let desc = "Update 4M tracking sheet details.";
        if (isDone) desc = "Tracking sheet updated.";

        addTask("tracking", "Change Tracking Sheet", desc, "4m-cts", FileText, "Medium", isDone, false);
    }

    return { pending: p, completed: c };
  }, [record, user, isCustomerUser, isAdmin]);

  const handlePrint = () => { window.print(); };

  if (!record) return null;

  return (
    <div className=" min-h-screen p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* HEADER */}
      <div className="flex items-center justify-between p-6 mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-4 ">
          <button onClick={onBack} className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">{record.record_id}</h1>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
               <Calendar className="w-4 h-4" /> {record.date} <span className="text-gray-300">|</span> <Clock className="w-4 h-4" /> {record.time}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {renderMainStatus(record.approval_status)}
          {/* <button onClick={handlePrint} className="p-3 bg-white text-gray-600 border border-gray-200 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"><Printer className="w-5 h-5" /></button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto">
        
        {/* LEFT COLUMN: DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-white ${record.four_m === "Man" ? "bg-blue-500" : record.four_m === "Machine/Tool" ? "bg-green-500" : record.four_m === "Material" ? "bg-purple-500" : "bg-orange-500"}`}>{record.four_m.charAt(0)}</span>
                <h3 className="font-bold text-white text-lg">{record.four_m} Change Details</h3>
              </div>
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30">{record.category_details?.category_type}</span>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-gray-100">
              <div><div className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Building2 className="w-3 h-3"/> Shopfloor</div><div className="font-bold text-gray-900">{record.shopfloor_name}</div></div>
              <div><div className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Router className="w-3 h-3"/> Line</div><div className="font-bold text-gray-900">{record.line_name}</div></div>
              <div><div className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Station</div><div className="font-bold text-gray-900">{record.station_name}</div></div>
              <div><div className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Shift</div><div className="font-bold text-gray-900">Shift {record.shift}</div></div>
            </div>
            <div className="p-6 space-y-4 bg-gray-50/50">
              <div><div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> Description</div><p className="text-gray-800 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">{record.category_details?.description}</p></div>
              <div><div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-gray-400" /> Action Taken</div><p className="text-gray-800 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">{record.action_details?.action_taken}</p></div>
              {record.action_details?.remarks && (<div><div className="text-sm font-bold text-gray-700 mb-2">Remarks</div><p className="text-gray-600 italic bg-yellow-50 p-3 rounded-lg border border-yellow-100">{record.action_details?.remarks}</p></div>)}
            </div>
             <div className="border-t border-gray-200 p-6 bg-white">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Approving Authority</h4>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${record.action_details?.approving_authority ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"}`}>{record.action_details?.approving_authority ? record.action_details.approving_authority.charAt(0) : "?"}</div>
                    <div><div className="font-bold text-gray-900 text-lg">{record.action_details?.approving_authority || "Pending Assignment"}</div><div className="text-sm text-gray-500">{record.action_details?.approving_authority ? "Authorized Signatory" : "No authority assigned yet"}</div></div>
                </div>
             </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: USER-AWARE ACTION CENTER --- */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-blue-200 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="p-5 border-b border-blue-100 bg-blue-50/50 flex items-center justify-between">
              <h3 className="font-bold text-blue-900 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-blue-600" /> Required Actions ({pending.length})</h3>
            </div>

            {pending.length === 0 && completed.length > 0 && (
                <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-3"><CheckCircle className="w-6 h-6" /></div>
                    <h3 className="text-gray-900 font-bold">All Actions Complete</h3>
                    <p className="text-sm text-gray-500 mt-1">This record is fully compliant.</p>
                </div>
            )}

            {pending.length === 0 && completed.length === 0 && (
                <div className="p-8 text-center">
                    <h3 className="text-gray-900 font-bold">No Actions Required</h3>
                    <p className="text-sm text-gray-500 mt-1">This record has no pending requirements.</p>
                </div>
            )}

            {pending.length > 0 && (
                <div className="p-5 space-y-4">
                    {pending.map((task: any) => (
                    <div key={task.id} className="flex flex-col gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-300 transition-all">
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${task.priority === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}><task.icon className="w-5 h-5" /></div>
                            <div>
                                <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                    {task.label}
                                    {task.priority === 'Critical' && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">CRITICAL</span>}
                                    {task.statusLabel === 'REJECTED' && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">REJECTED</span>}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">{task.description}</div>
                            </div>
                        </div>
                        
                        {task.canResolve ? (
                            <button onClick={() => handleNavigate(task.module)} className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-md flex items-center justify-center gap-1 transition-all">
                                OPEN / RESOLVE <ExternalLink className="w-3 h-3" />
                            </button>
                        ) : (
                            <button disabled className="w-full py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-not-allowed border border-gray-200">
                                <Lock className="w-3 h-3" /> ACCESS RESTRICTED
                            </button>
                        )}
                    </div>
                    ))}
                </div>
            )}
          </div>

          {/* COMPLETED TASKS */}
          {completed.length > 0 && (
            <div className="bg-white rounded-2xl border border-green-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-green-100 bg-green-50/50">
                    <h3 className="font-bold text-green-900 flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-600" /> Completed Steps ({completed.length})</h3>
                </div>
                <div className="p-4 space-y-2">
                    {completed.map((task: any) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50/50 border border-gray-100 rounded-xl opacity-75 hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-3">
                                <div className="text-green-600"><CheckCircle className="w-4 h-4" /></div>
                                <div className="text-sm font-medium text-gray-700">{task.label}</div>
                            </div>
                            <button onClick={() => handleNavigate(task.module)} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">VIEW <Eye className="w-3 h-3"/></button>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* QUICK STATUS SUMMARY */}
          {/* <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Status Overview</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm border-b border-gray-50 pb-2"><span className="text-gray-600 flex items-center gap-2"><PlayCircle className="w-4 h-4" /> Setup Approval</span>{renderSetupStatus(record)}</div>
              <div className="flex items-center justify-between text-sm border-b border-gray-50 pb-2"><span className="text-gray-600 flex items-center gap-2"><CheckSquare className="w-4 h-4" /> ID/Batch No.</span>{renderRequirementTag(record.action_details?.identification_psn_batch_no)}</div>
              <div className="flex items-center justify-between text-sm border-b border-gray-50 pb-2"><span className="text-gray-600 flex items-center gap-2"><Flag className="w-4 h-4" /> Containment</span>{renderRequirementTag(record.action_details?.containment_action)}</div>
              <div className="flex items-center justify-between text-sm"><span className="text-gray-600 flex items-center gap-2"><Users className="w-4 h-4" /> Customer Approval</span>{renderCustomerStatus(record)}</div>
            </div>
          </div> */}
          {/* ... (inside your component return) ... */}

          {/* DYNAMIC QUICK STATUS SUMMARY */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Status Overview</h4>
            <div className="space-y-4">
              
              {/* 1. Combine Pending & Completed to show EVERYTHING required */}
              {[...pending, ...completed].length === 0 ? (
                 <p className="text-sm text-gray-400 italic text-center py-2">No requirements tracked.</p>
              ) : (
                 [...pending, ...completed]
                 // Optional: Sort them so Completed items sink to the bottom, or keep specific order
                 .sort((a, b) => {
                    // Simple sort: Put 'setup' and 'customer' at the top, others below
                    const priority = ['setup', 'customer', 'containment'];
                    const idxA = priority.indexOf(a.id);
                    const idxB = priority.indexOf(b.id);
                    if (idxA > -1 && idxB > -1) return idxA - idxB;
                    if (idxA > -1) return -1;
                    if (idxB > -1) return 1;
                    return 0; 
                 })
                 .map((task) => {
                    // Determine Status Display
                    const isCompleted = completed.find(t => t.id === task.id);
                    const isRejected = task.statusLabel === 'REJECTED';

                    return (
                      <div key={task.id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                        <span className="text-gray-700 flex items-center gap-2 font-medium">
                           {/* Use the specific icon for each task type */}
                           <task.icon className="w-4 h-4 text-gray-400" /> 
                           {task.label}
                        </span>
                        
                        {/* Dynamic Status Badge */}
                        {isCompleted ? (
                            <span className="text-green-700 font-bold text-[10px] bg-green-100 px-2 py-1 rounded-full border border-green-200 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> COMPLETED
                            </span>
                        ) : isRejected ? (
                            <span className="text-red-700 font-bold text-[10px] bg-red-100 px-2 py-1 rounded-full border border-red-200 animate-pulse">
                                ✗ REJECTED
                            </span>
                        ) : (
                            <span className="text-yellow-700 font-bold text-[10px] bg-yellow-100 px-2 py-1 rounded-full border border-yellow-200">
                                ⚠ PENDING
                            </span>
                        )}
                      </div>
                    );
                 })
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}