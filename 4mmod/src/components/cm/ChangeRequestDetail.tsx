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
  Shield,
  Activity,
  Layers,
  User
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
  const userRoleCode = typeof currentUser?.role === 'string' ? currentUser.role : currentUser?.role?.code;

  const isCustomerUser = userRoleCode === 'CUSTOMER';
  const isAdmin = currentUser?.is_superuser || userRoleCode === 'ADMIN';

  // --- SMART WORKFLOW LOGIC ---
  const { pending, completed, allTasks } = useMemo(() => {
    if (!record) return { pending: [], completed: [], allTasks: [] }; 

    const p: WorkflowTask[] = []; 
    const c: WorkflowTask[] = []; 
    const all: WorkflowTask[] = [];

    const addTask = (id: string, label: string, desc: string, mod: string, icon: any, prio: string, isDone: boolean, restrictedToCustomer: boolean, statusLabel?: string) => {
        let canResolve = true;
        if (restrictedToCustomer && !isCustomerUser && !isAdmin) canResolve = false; 
        if (!restrictedToCustomer && isCustomerUser && !isAdmin) canResolve = false;

        const item = { id, label, description: desc, module: mod, icon, priority: prio, canResolve, statusLabel };
        all.push(item);
        isDone ? c.push(item) : p.push(item);
    };

    // 1. SETUP APPROVAL
    if (record.action_details?.set_up_approval) {
        const nonCustomerApprovals = record.approvals?.filter((a: any) => a.role_code !== 'CUSTOMER') || [];
        let isDone = false;
        let desc = "Internal setup verification required.";
        let statusLabel = "PENDING";
        const hasRejected = nonCustomerApprovals.some((a: any) => a.status === 'rejected');
        const allApproved = nonCustomerApprovals.length > 0 && nonCustomerApprovals.every((a: any) => a.status === 'approved');
        if (allApproved) {
            isDone = true;
            desc = "Internal setup approved.";
        } else if (hasRejected) {
            statusLabel = "REJECTED";
            desc = "Setup rejected.";
        }
        addTask("setup", "Setup Approval", desc, "approvals", Zap, "High", isDone, false, statusLabel);
    }

    // 2. CUSTOMER APPROVAL
    if (record.action_details?.customer_approval) {
        const custAppr = record.approvals?.find((a: any) => a.role_code === 'CUSTOMER');
        const isDone = custAppr?.status === 'approved';
        const isRejected = custAppr?.status === 'rejected';
        let desc = "Customer authorization pending.";
        let statusLabel = "PENDING";
        if (isRejected) {
            desc = "Rejected by customer.";
            statusLabel = "REJECTED";
        } else if (isDone) {
            desc = "Approved by customer.";
        }
        addTask("customer", "Customer Approval", desc, "customer-approvals", UserCheck, "Critical", isDone, true, statusLabel);
    }

    // 3. RETRO INSPECTION
    if (record.action_details?.retroactive_inspection) {
        const isDone = record.is_retro_done; 
        let desc = "Previous batch inspection.";
        if (isDone) desc = "Retroactive data recorded.";
        addTask("retro", "Retroactive Check", desc, "rcr", ListChecks, "High", isDone, false);
    }

    // 4. OJT
    if (record.action_details?.ojt) {
        const isDone = record.is_ojt_done;
        let desc = "Operator training required.";
        if (isDone) desc = "OJT records submitted.";
        addTask("ojt", "On Job Training", desc, "ojt", Users, "Medium", isDone, false);
    }

    // 5. CONTAINMENT
    if (record.action_details?.containment_action) {
        const isDone = record.is_containment_done;
        let desc = "Suspect part segregation.";
        if (isDone) desc = "Containment action recorded.";
        addTask("containment", "Containment", desc, "containment", Flag, "Critical", isDone, false);
    }

    // 6. ID / BATCH NO
    if (record.action_details?.identification_psn_batch_no) {
        const isDone = record.is_batch_done;
        let desc = "Update Batch/PSN info.";
        if (isDone) desc = "Batch info updated.";
        addTask("batch", "ID / Batch No.", desc, "identification", CheckSquare, "Medium", isDone, false);
    }

    // 7. CHANGE TRACKING
    if (record.action_details?.change_record) {
        const isDone = record.is_tracking_done;
        let desc = "Update 4M tracking sheet.";
        if (isDone) desc = "Tracking sheet updated.";
        addTask("tracking", "Tracking Sheet", desc, "4m-cts", FileText, "Medium", isDone, false);
    }

    return { pending: p, completed: c, allTasks: all };
  }, [record, user, isCustomerUser, isAdmin]);

  // --- MAIN STATUS LOGIC ---
  const isFullyClosed = (record.approval_status?.toUpperCase() === "APPROVED") && (pending.length === 0);
  const isRejected = record.approval_status?.toUpperCase() === "REJECTED";

  const renderMainStatus = () => {
    if (isFullyClosed) 
      return <div className="px-4 py-2 rounded-lg text-sm font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-2 shadow-sm"><CheckCircle className="w-5 h-5" /> APPROVED & CLOSED</div>;
    
    if (isRejected)
      return <div className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white flex items-center gap-2 shadow-md"><XCircle className="w-5 h-5" /> REJECTED</div>;
    
    return <div className="px-4 py-2 rounded-lg text-sm font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-2 shadow-sm animate-pulse"><Activity className="w-5 h-5" /> IN PROGRESS</div>;
  };

  const handleNavigate = (moduleId: string) => {
    if (record?.record_id) {
        localStorage.setItem("filter_change_request_id", record.record_id);
        localStorage.setItem("return_to_detail_id", record.record_id);
        
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
    setSelectedModule(moduleId);
  };

  const handlePrint = () => { window.print(); };

  // --- Dynamic Gradient based on 4M Type ---
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
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/20 border border-white/20 shadow-sm">
                            {record.category_details?.category_type}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-blue-50 text-sm font-medium">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 opacity-80" /> {record.date}</span>
                        <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 opacity-80" /> {record.time}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {renderMainStatus()}
                {/* <button onClick={handlePrint} className="p-2.5 bg-white text-gray-800 rounded-lg hover:bg-gray-100 shadow-md transition-all">
                    <Printer className="w-5 h-5" />
                </button> */}
            </div>
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

          {/* Activity & Status List */}
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
                        
                        {/* VIEW BUTTON FOR COMPLETED ITEMS */}
                        {isCompleted ? (
                            <button 
                                onClick={() => handleNavigate(task.module)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-green-200 text-green-700 text-xs font-bold rounded-lg hover:bg-green-50 hover:border-green-300 transition-all shadow-sm"
                            >
                                <Eye className="w-3.5 h-3.5" /> VIEW DETAILS
                            </button>
                        ) : isRejected ? (
                            <span className="px-3 py-1.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-lg border border-red-200 uppercase tracking-wide">
                                Rejected
                            </span>
                        ) : (
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-lg border border-gray-200 uppercase tracking-wide">
                                Pending
                            </span>
                        )}
                      </div>
                    );
                 })
              )}
            </div>
          </div>

        </div>

        {/* RIGHT: ACTION PANEL (Span 4) */}
        <div className="xl:col-span-4 flex flex-col gap-5">
          
          {/* Action Required Box */}
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
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600 shadow-sm">
                            <CheckCircle className="w-8 h-8" />
                        </div>
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
                        
                        <div className="pl-2">
                            {task.canResolve ? (
                                <button onClick={() => handleNavigate(task.module)} className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all">
                                    RESOLVE NOW <ExternalLink className="w-3 h-3" />
                                </button>
                            ) : (
                                <div className="w-full py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg border border-gray-200 text-center flex items-center justify-center gap-2 cursor-not-allowed">
                                    <Lock className="w-3 h-3" /> WAITING / RESTRICTED
                                </div>
                            )}
                        </div>
                    </div>
                    ))
                )}
            </div>
          </div>

          {/* Quick Approver Info */}
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
//   PlayCircle,
//   Shield
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

// // --- HELPER FUNCTIONS ---
// const renderMainStatus = (status: string) => {
//   const s = status ? status.toUpperCase() : "";
//   if (s === "APPROVED") 
//     return <span className="px-4 py-2 rounded-xl text-sm font-bold bg-green-100 text-green-700 flex items-center gap-2 border border-green-200"><CheckCircle className="w-5 h-5" /> APPROVED & CLOSED</span>;
//   if (s === "REJECTED")
//     return <span className="px-4 py-2 rounded-xl text-sm font-bold bg-red-100 text-red-700 flex items-center gap-2 border border-red-200"><XCircle className="w-5 h-5" /> REJECTED</span>;
//   return <span className="px-4 py-2 rounded-xl text-sm font-bold bg-yellow-100 text-yellow-700 flex items-center gap-2 border border-yellow-200 animate-pulse"><Clock className="w-5 h-5" /> APPROVAL PENDING</span>;
// };

// const renderSetupStatus = (record: any) => {
//     if (!record.action_details?.set_up_approval) return <span className="text-gray-400 font-bold text-xs bg-gray-100 px-3 py-1 rounded-full border border-gray-200">N/A</span>;
//     const nonCustomerApprovals = record.approvals?.filter((a: any) => a.role_code !== 'CUSTOMER') || [];
//     if (nonCustomerApprovals.length === 0) return <span className="text-yellow-700 font-bold text-xs bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200 animate-pulse">PENDING</span>;
//     const hasRejected = nonCustomerApprovals.some((a: any) => a.status === 'rejected');
//     if (hasRejected) return <span className="text-red-700 font-bold text-xs bg-red-100 px-3 py-1 rounded-full border border-red-200">✗ REJECTED</span>;
//     const allApproved = nonCustomerApprovals.every((a: any) => a.status === 'approved');
//     if (allApproved) return <span className="text-green-700 font-bold text-xs bg-green-100 px-3 py-1 rounded-full border border-green-200">✓ APPROVED</span>;
//     return <span className="text-yellow-700 font-bold text-xs bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200 animate-pulse">PENDING</span>;
// }

// const renderCustomerStatus = (item: any) => {
//     if (!item.action_details?.customer_approval) return <span className="text-gray-400 font-bold text-xs bg-gray-100 px-3 py-1 rounded-full border border-gray-200">N/A</span>;
//     const approval = item.approvals?.find((a: any) => a.role_code === 'CUSTOMER');
//     if (!approval) return <span className="text-yellow-700 font-bold text-xs bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200 animate-pulse">PENDING</span>;
//     if (approval.status === 'approved') return <span className="text-green-700 font-bold text-xs bg-green-100 px-3 py-1 rounded-full border border-green-200">✓ APPROVED</span>;
//     if (approval.status === 'rejected') return <span className="text-red-700 font-bold text-xs bg-red-100 px-3 py-1 rounded-full border border-red-200">✗ REJECTED</span>;
//     return <span className="text-yellow-700 font-bold text-xs bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200 animate-pulse">PENDING</span>;
// }

// const renderRequirementTag = (isRequired: boolean) => {
//     return isRequired 
//       ? <span className="text-green-700 font-extrabold text-xs bg-green-100 px-3 py-1 rounded-full shadow-sm border border-green-200">REQUIRED</span>
//       : <span className="text-gray-400 font-bold text-xs bg-gray-100 px-3 py-1 rounded-full border border-gray-200">N/A</span>;
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
//   const userRoleCode = typeof currentUser?.role === 'string' ? currentUser.role : currentUser?.role?.code;

//   const isCustomerUser = userRoleCode === 'CUSTOMER';
//   const isAdmin = currentUser?.is_superuser || userRoleCode === 'ADMIN';

//   // --- 🔥 ENHANCED NAVIGATION WITH DATA PASSING ---
//   const handleNavigate = (moduleId: string) => {
//     if (record?.record_id) {
//         // Store the change request ID for filtering
//         localStorage.setItem("filter_change_request_id", record.record_id);
//         localStorage.setItem("return_to_detail_id", record.record_id);
        
//         // 🔥 PREPARE OJT DATA PACKAGE
//         if (moduleId === "ojt") {
//             const ojtData: OJTRecordData = {
//                 changeId: record.record_id,
//                 fourMChangeId: record.id, // Assuming 'id' is the primary key
//                 shopfloorName: record.shopfloor_name || "",
//                 lineName: record.line_name || "",
//                 stationName: record.station_name || "",
//                 departmentName: record.department_name || "Production",
//                 processName: record.category_details?.description || "OJT Process"
//             };
            
//             // Store in localStorage for OJT to retrieve
//             localStorage.setItem("ojt_record_data", JSON.stringify(ojtData));
//         }
//     }
    
//     // Navigate to the module
//     setSelectedModule(moduleId);
//   };

//   // --- SMART WORKFLOW LOGIC ---
//   const { pending, completed } = useMemo(() => {
//     if (!record) return { pending: [], completed: [] }; 

//     const p: WorkflowTask[] = []; 
//     const c: WorkflowTask[] = []; 

//     const addTask = (id: string, label: string, desc: string, mod: string, icon: any, prio: string, isDone: boolean, restrictedToCustomer: boolean, statusLabel?: string) => {
//         let canResolve = true;
//         if (restrictedToCustomer && !isCustomerUser && !isAdmin) canResolve = false; 
//         if (!restrictedToCustomer && isCustomerUser && !isAdmin) canResolve = false;

//         const item = { id, label, description: desc, module: mod, icon, priority: prio, canResolve, statusLabel };
//         isDone ? c.push(item) : p.push(item);
//     };

//     // 1. SETUP APPROVAL
//     if (record.action_details?.set_up_approval) {
//         const nonCustomerApprovals = record.approvals?.filter((a: any) => a.role_code !== 'CUSTOMER') || [];
//         let isDone = false;
//         let desc = "Machine/Process setup verification required.";
//         let statusLabel = "PENDING";
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

//     // 2. CUSTOMER APPROVAL
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

//     // 3. RETRO INSPECTION
//     if (record.action_details?.retroactive_inspection) {
//         const isDone = record.is_retro_done; 
//         let desc = "Quality inspection for previous batches.";
//         if (isDone) desc = "Retroactive inspection data submitted successfully.";
//         addTask("retro", "Retroactive Inspection", desc, "rcr", ListChecks, "High", isDone, false);
//     }

//     // 4. OJT
//     if (record.action_details?.ojt) {
//         const isDone = record.is_ojt_done;
//         let desc = "Operator training records.";
//         if (isDone) desc = "OJT records submitted.";
//         addTask("ojt", "On Job Training (OJT)", desc, "ojt", Users, "Medium", isDone, false);
//     }

//     // 5. CONTAINMENT
//     if (record.action_details?.containment_action) {
//         const isDone = record.is_containment_done;
//         let desc = "Segregation of suspect parts.";
//         if (isDone) desc = "Containment action recorded.";
//         addTask("containment", "Containment Action", desc, "containment", Flag, "Critical", isDone, false);
//     }

//     // 6. ID / BATCH NO
//     if (record.action_details?.identification_psn_batch_no) {
//         const isDone = record.is_batch_done;
//         let desc = "Update Batch or PSN identification.";
//         if (isDone) desc = "Batch info updated.";
//         addTask("batch", "ID / Batch No.", desc, "identification", CheckSquare, "Medium", isDone, false);
//     }

//     // 7. CHANGE TRACKING
//     if (record.action_details?.change_record) {
//         const isDone = record.is_tracking_done;
//         let desc = "Update 4M tracking sheet details.";
//         if (isDone) desc = "Tracking sheet updated.";
//         addTask("tracking", "Change Tracking Sheet", desc, "4m-cts", FileText, "Medium", isDone, false);
//     }

//     return { pending: p, completed: c };
//   }, [record, user, isCustomerUser, isAdmin]);

//   const handlePrint = () => { window.print(); };

//   if (!record) return null;

//   return (
//     <div className="min-h-screen p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
//       {/* HEADER */}
//       <div className="flex items-center justify-between p-6 mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="flex items-center gap-4">
//           <button onClick={onBack} className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm">
//             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
//           </button>
//           <div>
//             <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">{record.record_id}</h1>
//             <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
//                <Calendar className="w-4 h-4" /> {record.date} <span className="text-gray-300">|</span> <Clock className="w-4 h-4" /> {record.time}
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           {renderMainStatus(record.approval_status)}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto">
        
//         {/* LEFT COLUMN: DETAILS */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//             <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <span className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-white ${record.four_m === "Man" ? "bg-blue-500" : record.four_m === "Machine/Tool" ? "bg-green-500" : record.four_m === "Material" ? "bg-purple-500" : "bg-orange-500"}`}>{record.four_m.charAt(0)}</span>
//                 <h3 className="font-bold text-white text-lg">{record.four_m} Change Details</h3>
//               </div>
//               <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30">{record.category_details?.category_type}</span>
//             </div>
//             <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-gray-100">
//               <div><div className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Building2 className="w-3 h-3"/> Shopfloor</div><div className="font-bold text-gray-900">{record.shopfloor_name}</div></div>
//               <div><div className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Router className="w-3 h-3"/> Line</div><div className="font-bold text-gray-900">{record.line_name}</div></div>
//               <div><div className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Station</div><div className="font-bold text-gray-900">{record.station_name}</div></div>
//               <div><div className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Shift</div><div className="font-bold text-gray-900">Shift {record.shift}</div></div>
//             </div>
//             <div className="p-6 space-y-4 bg-gray-50/50">
//               <div><div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> Description</div><p className="text-gray-800 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">{record.category_details?.description}</p></div>
//               <div><div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-gray-400" /> Action Taken</div><p className="text-gray-800 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">{record.action_details?.action_taken}</p></div>
//               {record.action_details?.remarks && (<div><div className="text-sm font-bold text-gray-700 mb-2">Remarks</div><p className="text-gray-600 italic bg-yellow-50 p-3 rounded-lg border border-yellow-100">{record.action_details?.remarks}</p></div>)}
//             </div>
//              <div className="border-t border-gray-200 p-6 bg-white">
//                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Approving Authority</h4>
//                 <div className="flex items-center gap-4">
//                     <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${record.action_details?.approving_authority ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"}`}>{record.action_details?.approving_authority ? record.action_details.approving_authority.charAt(0) : "?"}</div>
//                     <div><div className="font-bold text-gray-900 text-lg">{record.action_details?.approving_authority || "Pending Assignment"}</div><div className="text-sm text-gray-500">{record.action_details?.approving_authority ? "Authorized Signatory" : "No authority assigned yet"}</div></div>
//                 </div>
//              </div>
//           </div>
//         </div>

//         {/* RIGHT COLUMN: ACTION CENTER */}
//         <div className="space-y-6">
          
//           <div className="bg-white rounded-2xl border border-blue-200 shadow-lg overflow-hidden relative">
//             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
//             <div className="p-5 border-b border-blue-100 bg-blue-50/50 flex items-center justify-between">
//               <h3 className="font-bold text-blue-900 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-blue-600" /> Required Actions ({pending.length})</h3>
//             </div>

//             {pending.length === 0 && completed.length > 0 && (
//                 <div className="p-8 text-center">
//                     <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-3"><CheckCircle className="w-6 h-6" /></div>
//                     <h3 className="text-gray-900 font-bold">All Actions Complete</h3>
//                     <p className="text-sm text-gray-500 mt-1">This record is fully compliant.</p>
//                 </div>
//             )}

//             {pending.length === 0 && completed.length === 0 && (
//                 <div className="p-8 text-center">
//                     <h3 className="text-gray-900 font-bold">No Actions Required</h3>
//                     <p className="text-sm text-gray-500 mt-1">This record has no pending requirements.</p>
//                 </div>
//             )}

//             {pending.length > 0 && (
//                 <div className="p-5 space-y-4">
//                     {pending.map((task: any) => (
//                     <div key={task.id} className="flex flex-col gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-300 transition-all">
//                         <div className="flex items-start gap-3">
//                             <div className={`p-2 rounded-lg ${task.priority === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}><task.icon className="w-5 h-5" /></div>
//                             <div>
//                                 <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
//                                     {task.label}
//                                     {task.priority === 'Critical' && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">CRITICAL</span>}
//                                     {task.statusLabel === 'REJECTED' && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">REJECTED</span>}
//                                 </div>
//                                 <div className="text-xs text-gray-500 mt-0.5">{task.description}</div>
//                             </div>
//                         </div>
                        
//                         {task.canResolve ? (
//                             <button onClick={() => handleNavigate(task.module)} className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-md flex items-center justify-center gap-1 transition-all">
//                                 OPEN / RESOLVE <ExternalLink className="w-3 h-3" />
//                             </button>
//                         ) : (
//                             <button disabled className="w-full py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-not-allowed border border-gray-200">
//                                 <Lock className="w-3 h-3" /> ACCESS RESTRICTED
//                             </button>
//                         )}
//                     </div>
//                     ))}
//                 </div>
//             )}
//           </div>

//           {/* COMPLETED TASKS */}
//           {completed.length > 0 && (
//             <div className="bg-white rounded-2xl border border-green-200 shadow-sm overflow-hidden">
//                 <div className="p-4 border-b border-green-100 bg-green-50/50">
//                     <h3 className="font-bold text-green-900 flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-600" /> Completed Steps ({completed.length})</h3>
//                 </div>
//                 <div className="p-4 space-y-2">
//                     {completed.map((task: any) => (
//                         <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50/50 border border-gray-100 rounded-xl opacity-75 hover:opacity-100 transition-opacity">
//                             <div className="flex items-center gap-3">
//                                 <div className="text-green-600"><CheckCircle className="w-4 h-4" /></div>
//                                 <div className="text-sm font-medium text-gray-700">{task.label}</div>
//                             </div>
//                             <button onClick={() => handleNavigate(task.module)} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">VIEW <Eye className="w-3 h-3"/></button>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//           )}

//           {/* QUICK STATUS SUMMARY */}
//           <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
//             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Status Overview</h4>
//             <div className="space-y-4">
//               {[...pending, ...completed].length === 0 ? (
//                  <p className="text-sm text-gray-400 italic text-center py-2">No requirements tracked.</p>
//               ) : (
//                  [...pending, ...completed]
//                  .sort((a, b) => {
//                     const priority = ['setup', 'customer', 'containment'];
//                     const idxA = priority.indexOf(a.id);
//                     const idxB = priority.indexOf(b.id);
//                     if (idxA > -1 && idxB > -1) return idxA - idxB;
//                     if (idxA > -1) return -1;
//                     if (idxB > -1) return 1;
//                     return 0; 
//                  })
//                  .map((task) => {
//                     const isCompleted = completed.find(t => t.id === task.id);
//                     const isRejected = task.statusLabel === 'REJECTED';

//                     return (
//                       <div key={task.id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
//                         <span className="text-gray-700 flex items-center gap-2 font-medium">
//                            <task.icon className="w-4 h-4 text-gray-400" /> 
//                            {task.label}
//                         </span>
                        
//                         {isCompleted ? (
//                             <span className="text-green-700 font-bold text-[10px] bg-green-100 px-2 py-1 rounded-full border border-green-200 flex items-center gap-1">
//                                 <CheckCircle className="w-3 h-3" /> COMPLETED
//                             </span>
//                         ) : isRejected ? (
//                             <span className="text-red-700 font-bold text-[10px] bg-red-100 px-2 py-1 rounded-full border border-red-200 animate-pulse">
//                                 ✗ REJECTED
//                             </span>
//                         ) : (
//                             <span className="text-yellow-700 font-bold text-[10px] bg-yellow-100 px-2 py-1 rounded-full border border-yellow-200">
//                                 ⚠ PENDING
//                             </span>
//                         )}
//                       </div>
//                     );
//                  })
//               )}
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }