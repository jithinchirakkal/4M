import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Users,
  Settings,
  Package,
  Wrench,
  FileText,
  ClipboardCheck,
  ListChecks,
  Flag,
  Calendar,
  Trash2,
  Send,
  Building2,
  Router,
  MapPin,
  Clock,
  Zap,
  GitCommit,
  List,
  CheckSquare,
  Sun,
  Moon,
  Search,         // Added for Search Bar
  ExternalLink    // Added for Click Icon
} from "lucide-react";

// IMPORTANT: Import the Detail Component
import ChangeRequestDetail from "./ChangeRequestDetail";

// --- 1. HELPER FUNCTIONS (EXACTLY FROM YOUR OLD CODE) ---

// const renderApprovalStatus = (item: any) => {
//   const approvalStatus = item.approval_status;

//   if (approvalStatus === "N/A") {
//     return (
//       <span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-gray-100 text-gray-600">
//         N/A
//       </span>
//     );
//   }

//   if (approvalStatus === "REQUIRED") {
//     return (
//       <span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-yellow-100 text-yellow-700 animate-pulse">
//         PENDING
//       </span>
//     );
//   }

//   if (approvalStatus === "APPROVED") {
//     return (
//       <span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-green-100 text-green-700">
//         ✓ APPROVED
//       </span>
//     );
//   }

//   if (approvalStatus === "REJECTED") {
//     return (
//       <span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-red-100 text-red-700">
//         ✗ REJECTED
//       </span>
//     );
//   }

//   return (
//     <span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-gray-100 text-gray-600">
//       UNKNOWN
//     </span>
//   );
// };

const renderApprovalStatus = (item: any) => {
  // Check if set-up approval is required from action details
  if (!item.action_details?.set_up_approval) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-gray-100 text-gray-600">
        N/A
      </span>
    );
  }

  // Check if there are any approvals for non-customer roles (Prod HOD, QA HOD)
  const nonCustomerApprovals = item.approvals?.filter(
    (approval: any) => approval.role_code !== 'CUSTOMER'
  ) || [];

  if (nonCustomerApprovals.length === 0) {
    // No approvals created yet
    return (
      <span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-yellow-100 text-yellow-700 animate-pulse">
        PENDING
      </span>
    );
  }

  // Check if any approval is rejected
  const hasRejected = nonCustomerApprovals.some(
    (approval: any) => approval.status === 'rejected'
  );
  
  if (hasRejected) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-red-100 text-red-700">
         ✗ REJECTED
      </span>
    );
  }

  // Check if all approvals are approved
  const allApproved = nonCustomerApprovals.every(
    (approval: any) => approval.status === 'approved'
  );

  if (allApproved) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-green-100 text-green-700">
        ✓ APPROVED
      </span>
    );
  }

  // Some approvals are still pending
  return (
    <span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-yellow-100 text-yellow-700 animate-pulse">
      PENDING
    </span>
  );
};

const renderCustomerApprovalStatus = (item: any) => {
  // Check if customer approval is required
  if (!item.action_details?.customer_approval) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-gray-100 text-gray-600">
        N/A
      </span>
    );
  }

  // If customer approval is required, check the approval status
  // Look for a CUSTOMER role approval in the approvals array
  const customerApproval = item.approvals?.find(
    (approval: any) => approval.role_code === 'CUSTOMER'
  );

  if (!customerApproval) {
    // Approval required but not yet created
    return (
      <span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-yellow-100 text-yellow-700 animate-pulse">
        PENDING
      </span>
    );
  }

  // Check the status of the customer approval
  if (customerApproval.status === 'approved') {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-green-100 text-green-700">
        ✓ APPROVED
      </span>
    );
  }

  if (customerApproval.status === 'rejected') {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-red-100 text-red-700">
        ✗ REJECTED
      </span>
    );
  }

  // Pending approval
  return (
    <span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-yellow-100 text-yellow-700 animate-pulse">
      PENDING
    </span>
  );
};

const renderStatusTag = (status: boolean | undefined) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
      status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}
  >
    {status ? "REQUIRED" : "N/A"}
  </span>
);

const renderClickableStatusTag = (
  status: boolean | undefined,
  onClick: () => void
) => {
  if (!status) {
    return renderStatusTag(status); // N/A → not clickable
  }

  return (
    <span
      onClick={(e) => {
          e.stopPropagation(); // Stop row click
          onClick();
      }}
      className="px-2 py-1 rounded-full text-xs font-bold shadow-sm
                 bg-green-100 text-green-700 cursor-pointer underline
                 hover:bg-green-200"
    >
      REQUIRED
    </span>
  );
};


// --- 2. CONFIGURATION & STATE (EXACTLY FROM YOUR CODE) ---

const changeCategories = [
  {
    name: "Man",
    label: "Man",
    description: "Personnel Changes",
    icon: Users,
    gradient: "from-blue-600 to-indigo-600",
    color: "#3B82F6",
  },
  {
    name: "Machine/Tool",
    label: "Machine/Tool",
    description: "Equipment Changes",
    icon: Settings,
    gradient: "from-green-600 to-emerald-600",
    color: "#10B981",
  },
  {
    name: "Material",
    label: "Material",
    description: "Material Changes",
    icon: Package,
    gradient: "from-purple-600 to-fuchsia-600",
    color: "#8B5CF6",
  },
  {
    name: "Method",
    label: "Method",
    description: "Process Changes",
    icon: Wrench,
    gradient: "from-orange-600 to-red-500",
    color: "#F59E0B",
  },
];

const categoryOptions = [
  { value: "Planned", label: "Planned" },
  { value: "Unplanned", label: "Unplanned" },
  { value: "Abnormal", label: "Abnormal" },
];

const shiftOptions = [
  { value: "A", label: "Shift A" },
  { value: "B", label: "Shift B" },
  { value: "C", label: "Shift C" },
];

const today = new Date();   
const initialState = {
  four_m: "Man",
  shift: "A",
  shopfloor: "",
  line: "",
  station: "",
  category: "",
  action: "",
  date: today.toISOString().split("T")[0], 
  time: today.toTimeString().slice(0, 5),  
};

export default function ChangeManagementView({
  setSelectedModule,
}: {
  setSelectedModule: (id: string) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState("Man");
  const [form, setForm] = useState({
    ...initialState,
    four_m: "Man",
    shift: "A",
  });
  const [message, setMessage] = useState("");
  const [changeList, setChangeList] = useState<any[]>([]);
  const [showList, setShowList] = useState(false);

  // --- NEW: View Mode & Search State ---
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Dropdown data
  const [shopfloors, setShopfloors] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [selectedCategoryType, setSelectedCategoryType] = useState("");
  const [descriptions, setDescriptions] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [selectedAction, setSelectedAction] = useState<any>(null);

  const selected = changeCategories.find((c) => c.name === selectedCategory);


  // --- NEW: AUTO-OPEN DETAIL ON RETURN ---
  useEffect(() => {
    const returnId = localStorage.getItem("return_to_detail_id");

    // Only run this if we have a return ID and data is loaded
    if (returnId && changeList.length > 0) {
      const recordToOpen = changeList.find(
        (item) => item.record_id === returnId || item.id.toString() === returnId
      );

      if (recordToOpen) {
        console.log("Auto-opening returned record:", recordToOpen.record_id);
        setSelectedRecord(recordToOpen);
        setViewMode("detail");
        
        // CRITICAL: Clear the flag so it doesn't get stuck open forever
        localStorage.removeItem("return_to_detail_id");
      }
    }
  }, [changeList]); // Run whenever list loads/updates
  
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/shopfloors/")
      .then((res) => res.json())
      .then((data) => setShopfloors(data))
      .catch(() => setShopfloors([]));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/4m-changes/")
      .then((res) => res.json())
      .then((data) => setChangeList(data))
      .catch(() => setChangeList([]));
  }, [message]);

  useEffect(() => {
    if (form.shopfloor) {
      fetch(`http://127.0.0.1:8000/api/lines/?shopfloor=${form.shopfloor}`)
        .then((res) => res.json())
        .then((data) => setLines(data))
        .catch(() => setLines([]));
    } else {
      setLines([]);
      setForm((prev) => ({ ...prev, line: "", station: "" }));
    }
  }, [form.shopfloor]);

  useEffect(() => {
    if (form.line) {
      fetch(`http://127.0.0.1:8000/api/stations/?line=${form.line}`)
        .then((res) => res.json())
        .then((data) => setStations(data))
        .catch(() => setStations([]));
    } else {
      setStations([]);
      setForm((prev) => ({ ...prev, station: "" }));
    }
  }, [form.line]);

  useEffect(() => {
    if (selectedCategoryType) {
      fetch(
        `http://127.0.0.1:8000/api/4m-categories/?category_type=${selectedCategoryType}&four_m=${selectedCategory}`
      )
        .then((res) => res.json())
        .then((data) => setDescriptions(data))
        .catch(() => setDescriptions([]));
    } else {
      setDescriptions([]);
      setForm((prev) => ({ ...prev, category: "" }));
    }
  }, [selectedCategoryType]);

  useEffect(() => {
    if (form.category) {
      fetch(`http://127.0.0.1:8000/api/actions/?category=${form.category}`)
        .then((res) => res.json())
        .then((data) => {
          setActions(data);
          if (data.length === 1) {
            setForm((prev) => ({ ...prev, action: data[0].id }));
            setSelectedAction(data[0]);
          }
        })
        .catch(() => setActions([]));
    } else {
      setActions([]);
      setForm((prev) => ({ ...prev, action: "" }));
      setSelectedAction(null);
    }
  }, [form.category]);

  useEffect(() => {
    if (form.action) {
      const action = actions.find((a) => a.id === parseInt(form.action));
      setSelectedAction(action);
    }
  }, [form.action, actions]);

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedCategoryType(""); // ✅ RESET
    setDescriptions([]); // ✅ RESET
    setActions([]); // ✅ RESET
    setSelectedAction(null);
    setForm((prev) => ({
      ...prev,
      four_m: cat,
      category: "",
      action: "",
    }));
  };
  
  // --- NEW: Handle Click on ID to show Detail ---
  const handleRecordClick = (item: any) => {
      setSelectedRecord(item);
      setViewMode("detail");
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setMessage("");

    if (
      !form.shopfloor ||
      !form.line ||
      !form.station ||
      !form.category ||
      !form.action ||
      !form.date ||
      !form.time ||
      !form.shift
    ) {
      setMessage("❌ Error: Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/4m-changes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        setMessage("✅ 4M Change record created!");
        setForm({ ...initialState, four_m: selectedCategory, shift: "A" });
        setSelectedCategoryType("");
        setSelectedAction(null);
      } else {
        const data = await response.json();
        setMessage("❌ Error: " + JSON.stringify(data));
      }
    } catch (error: any) {
      setMessage("❌ Error: " + error.toString());
    }
  }

  const InputSelect = ({
    name,
    label,
    value,
    onChange,
    options,
    disabled = false,
    required = true,
    icon: Icon,
    placeholder = "Select...",
  }: any) => (
    <div>
      <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-blue-500" /> {label}{" "}
        {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-300 p-3 shadow-inner bg-gray-50/80 focus:outline-none focus:ring-4 focus:ring-blue-400/30 transition-all disabled:opacity-50"
        required={required}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((opt: any) => (
          <option key={opt.id || opt.value} value={opt.id || opt.value}>
            {opt.name || opt.label || opt.description || opt.action_taken}
          </option>
        ))}
      </select>
    </div>
  );

  // --- 3. FILTER LOGIC ---
  const filteredChangeList = changeList.filter((item) => {
    // 1. Category Match
    const matchesCategory = item.four_m === selectedCategory;
    
    // 2. Search Match
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
        !searchQuery || 
        (item.record_id && item.record_id.toLowerCase().includes(searchLower)) ||
        (item.shopfloor_name && item.shopfloor_name.toLowerCase().includes(searchLower)) ||
        (item.line_name && item.line_name.toLowerCase().includes(searchLower));

    return matchesCategory && matchesSearch;
  });

  // --- 4. RENDER DETAIL PAGE ---
  if (viewMode === "detail") {
      return (
        <ChangeRequestDetail
          record={selectedRecord}
          onBack={() => setViewMode("list")}
          setSelectedModule={setSelectedModule}
        />
      );
  }

  // --- 5. RENDER MAIN VIEW ---
  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl py-6 font-extrabold text-gray-900">
            4M Change Management
          </h1>
          <p className="text-gray-500 text-lg">
            Select a category to record and track manufacturing changes.
          </p>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {changeCategories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = cat.name === selectedCategory;
          return (
            <div
              key={cat.name}
              className={`
                cursor-pointer rounded-3xl bg-white p-6 transition-all duration-300 relative overflow-hidden
                shadow-xl border border-gray-100 
                ${
                  isSelected
                    ? "ring-4 ring-offset-4 ring-offset-[#f6faff] ring-blue-500 shadow-blue-500/40 transform scale-[1.03] translate-y-[-4px]"
                    : "hover:shadow-2xl hover:scale-[1.01] hover:border-blue-200"
                }
              `}
              onClick={() => handleCategory(cat.name)}
            >
              <div className="flex items-start gap-4 z-10 relative">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${cat.gradient} shadow-lg shadow-black/30`}
                  style={{ backgroundColor: cat.color }}
                >
                  {Icon && <Icon className="w-8 h-8 text-white" />}
                </div>
                <div className="mt-1">
                  <div className="text-xl font-extrabold text-gray-900">
                    {cat.label}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">
                    {cat.description}
                  </div>
                </div>
              </div>
              <div
                className={`absolute bottom-[-20px] right-[-20px] w-12 h-12 rounded-full opacity-10`}
                style={{ backgroundColor: cat.color }}
              ></div>
            </div>
          );
        })}
      </div>

      {/* Selected Category Header */}
      {selected && (
        <div
          className={`rounded-3xl bg-gradient-to-r ${selected.gradient} p-8 mb-8 flex items-center gap-6 shadow-2xl shadow-gray-500/30`}
        >
          <div
            className={`w-16 h-16 flex items-center justify-center rounded-xl bg-white/20 border border-white/50 backdrop-blur-sm`}
          >
            {selected.icon && <selected.icon className="w-9 h-9 text-white" />}
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white mb-1 tracking-wider">
              {selected.label} Change Management
            </h3>
            <p className="text-white/90 text-lg font-medium">
              {selected.description}
            </p>
          </div>
        </div>
      )}

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl p-8 space-y-8 border border-gray-100/80"
      >
        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3 border-b pb-4">
          <GitCommit className="w-6 h-6 text-blue-600" /> Record New Change
        </h2>

        {/* Shopfloor, Line, Station, Shift Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InputSelect
            name="shopfloor"
            label="Shopfloor"
            value={form.shopfloor}
            onChange={handleChange}
            options={shopfloors.map((sf: any) => ({
              id: sf.id,
              name: sf.name,
            }))}
            icon={Building2}
            placeholder="Select Shopfloor..."
          />
          <InputSelect
            name="line"
            label="Line"
            value={form.line}
            onChange={handleChange}
            options={lines.map((l: any) => ({ id: l.id, name: l.name }))}
            icon={Router}
            disabled={!form.shopfloor}
            placeholder="Select Line..."
          />
          <InputSelect
            name="station"
            label="Station"
            value={form.station}
            onChange={handleChange}
            options={stations.map((s: any) => ({ id: s.id, name: s.name }))}
            icon={MapPin}
            disabled={!form.line}
            placeholder="Select Station..."
          />
          <InputSelect
            name="shift"
            label="Shift"
            value={form.shift}
            onChange={handleChange}
            options={shiftOptions}
            icon={Sun}
            placeholder="Select Shift..."
          />
        </div>

        {/* Category Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputSelect
            name="categoryType"
            label="Change Type"
            value={selectedCategoryType}
            onChange={(e: any) => setSelectedCategoryType(e.target.value)}
            options={categoryOptions}
            icon={ListChecks}
            placeholder="Select Change Type..."
            required
          />
          <InputSelect
            name="category"
            label="Change Description"
            value={form.category}
            onChange={handleChange}
            options={descriptions.map((d: any) => ({
              id: d.id,
              description: d.description,
            }))}
            icon={FileText}
            disabled={!selectedCategoryType}
            placeholder="Select Description..."
            required
          />
          <InputSelect
            name="action"
            label="Action Taken"
            value={form.action}
            onChange={handleChange}
            options={actions.map((a: any) => ({
              id: a.id,
              action_taken: a.action_taken,
            }))}
            icon={ClipboardCheck}
            disabled={!form.category || actions.length <= 1}
            placeholder="Select Action..."
            required
          />
        </div>

        {/* Auto-filled fields */}
        {selectedAction && (
          <div className="bg-blue-50/70 rounded-xl p-6 space-y-4 border border-blue-200 shadow-inner">
            <h4 className="font-extrabold text-xl text-blue-900 mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              Required Post-Change Actions
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-3 rounded-lg border bg-white shadow-sm">
                <label className="text-sm font-bold text-gray-700 mb-1 block flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-blue-500" />
                  Change Record:
                </label>
                {renderStatusTag(selectedAction.change_record)}
              </div>

              <div className="p-3 rounded-lg border bg-white shadow-sm">
                <label className="text-sm font-bold text-gray-700 mb-1 block flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Identification PSN / Batch No.:
                </label>
                {renderStatusTag(selectedAction.identification_psn_batch_no)}
              </div>

              <div className="p-3 rounded-lg border bg-white shadow-sm">
                <label className="text-sm font-bold text-gray-700 mb-1 block flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-500" />
                  OJT:
                </label>
                {renderStatusTag(selectedAction.ojt)}
              </div>

              <div className="p-3 rounded-lg border bg-white shadow-sm">
                <label className="text-sm font-bold text-gray-700 mb-1 block flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  Set-Up Approval:
                </label>
                {renderStatusTag(selectedAction.set_up_approval)}
              </div>

              <div className="p-3 rounded-lg border bg-white shadow-sm">
                <label className="text-sm font-bold text-gray-700 mb-1 block flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-purple-500" />
                  Retroactive Inspection:
                </label>
                {renderStatusTag(selectedAction.retroactive_inspection)}
              </div>

              <div className="p-3 rounded-lg border bg-white shadow-sm">
                <label className="text-sm font-bold text-gray-700 mb-1 block flex items-center gap-2">
                  <Flag className="w-4 h-4 text-red-500" />
                  Containment Action:
                </label>
                {renderStatusTag(selectedAction.containment_action)}
              </div>

              <div className="p-3 rounded-lg border bg-white shadow-sm">
                <label className="text-sm font-bold text-gray-700 mb-1 block flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-green-600" />
                  Customer Approval:
                </label>
                {renderStatusTag(selectedAction.customer_approval)}
              </div>

              <div className="p-3 rounded-lg border bg-white shadow-sm md:col-span-2">
                <label className="text-sm font-bold text-gray-700 mb-1 block flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-gray-600" />
                  Approving Authority:
                </label>
                <p className="text-gray-900 font-medium">
                  {selectedAction.approving_authority || "—"}
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-white shadow-sm">
              <label className="text-sm font-bold text-gray-700 mb-1 block flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-500" />
                Machine Check Sheet:
              </label>
              {renderStatusTag(selectedAction.machine_check_sheet)}
            </div>

            {/* <div className="p-3 rounded-lg border bg-white shadow-sm">
              <label className="text-sm font-bold text-gray-700 mb-1 block flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-orange-500" />
                In-Process Sheet:
              </label>
              {renderStatusTag(selectedAction.in_process_sheet)}
            </div> */}
            </div>

            {(selectedAction.action_taken || selectedAction.remarks) && (
              <div className="pt-2">
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  Action Details:
                </label>
                <p className="text-gray-900 bg-white p-3 rounded-xl border font-medium shadow-inner">
                  {selectedAction.action_taken}
                </p>
                {selectedAction.remarks && (
                  <p className="text-gray-700 bg-white p-3 rounded-xl border mt-2 text-sm italic">
                    {selectedAction.remarks}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Date and Time Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" /> Date of Change *
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" /> Time of Change *
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
          <div className="flex-1"></div>
          <button
            type="button"
            onClick={() => {
              setForm({
                ...initialState,
                four_m: selectedCategory,
                shift: "A",
              });
              setSelectedCategoryType("");
              setSelectedAction(null);
              setMessage("");
            }}
            className="border border-gray-300 px-6 py-3 rounded-xl font-bold text-gray-700 hover:bg-red-50/50 hover:text-red-600 transition-all flex items-center gap-3 shadow-md"
          >
            <Trash2 className="w-5 h-5" /> Clear Form
          </button>
          <button
            type="submit"
            className={`bg-gradient-to-r ${selected?.gradient} text-white px-8 py-3 rounded-xl font-extrabold uppercase tracking-wide shadow-xl shadow-gray-500/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 text-lg`}
            disabled={!form.action}
          >
            <Send className="w-5 h-5" /> Submit Change Record
          </button>
        </div>

        {message && (
          <div
            className={`mt-4 p-4 rounded-xl font-medium ${
              message.startsWith("❌")
                ? "bg-red-50 text-red-600 border border-red-300"
                : "bg-green-50 text-green-700 border border-green-300"
            }`}
          >
            {message}
          </div>
        )}
      </form>

      {/* Submitted Details Table Section */}
      <div className="mt-10">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-xl shadow-blue-500/30 hover:bg-blue-700 transform hover:scale-[1.02] transition-all flex items-center gap-3"
          onClick={() => setShowList(!showList)}
        >
          <List className="w-5 h-5" /> {showList ? "Hide" : "Show"} All 4M
          Change Records ({changeList.length})
        </button>
      </div>

      {showList && (
        <div className="mt-6 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100/80 overflow-x-auto">
          
          {/* --- NEW: Search Header (Added per request) --- */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b pb-3">
             <h3 className="text-2xl font-extrabold text-gray-900">
                Change Record History
             </h3>
             <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Search by ID, Line, or Shopfloor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-inner">
            <table
              className="w-full bg-white border-collapse"
              // style={{ minWidth: "2000px" }}
            >
              <thead className="bg-gray-50/80 sticky top-0">
                <tr className="text-left">
                  {[
                    "S.No",
                    "ID",
                    "Date",
                    // "Time",
                    "Shift",
                    "4M",
                    "Shopfloor",
                    // "Line",
                    // "Station",
                    "Category",
                    // "Description",
                    // "Action",
                    // "Change Record",
                    // "ID PSN / Batch",
                    // "OJT",
                    // "Set-Up Approval",
                    // "Retro Inspection",
                    // "Containment",
                    // "Customer Approval",
                    // "Approving Authority",
                    // "Remarks",
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-3 text-xs font-extrabold text-gray-700 uppercase tracking-wider border-b border-gray-200"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredChangeList.length === 0 && (
                  <tr>
                    <td
                      colSpan={16}
                      className="text-center text-gray-400 py-6 border-b"
                    >
                      No records found.
                    </td>
                  </tr>
                )}
                {filteredChangeList.map((item: any, idx: number) => (
                  <tr
                    key={item.id || idx}
                    className="border-b hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="p-3 whitespace-nowrap">{idx + 1}</td>
                    <td className="p-3 font-bold text-blue-600 whitespace-nowrap">
                       {/* --- CLICKABLE ID (Open Detail View) --- */}
                       <button 
                         onClick={() => handleRecordClick(item)} 
                         className="hover:underline flex items-center gap-1 transition-all"
                      >
                         {item.record_id || item.id}
                         <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                      </button>
                    </td>
                    <td className="p-3 whitespace-nowrap font-medium">
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "-"}
                    </td>
                    {/* <td className="p-3 whitespace-nowrap font-medium">
                      {item.time || "-"}
                    </td> */}
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          item.shift === "A"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        Shift {item.shift || "A"}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          item.four_m === "Man"
                            ? "bg-blue-100 text-blue-700"
                            : item.four_m === "Machine/Tool"
                            ? "bg-green-100 text-green-700"
                            : item.four_m === "Material"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {item.four_m}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {item.shopfloor_name || "-"}
                    </td>
                    {/* <td className="p-3 whitespace-nowrap">
                      {item.line_name || "-"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {item.station_name || "-"}
                    </td> */}
                    <td className="p-3 whitespace-nowrap font-bold">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          item.category_details?.category_type === "Planned"
                            ? "bg-green-50 text-green-700"
                            : item.category_details?.category_type ===
                              "Unplanned"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {item.category_details?.category_type || "-"}
                      </span>
                    </td>
                    {/* <td
                      className="p-3 text-sm text-gray-700"
                      style={{ minWidth: "300px" }}
                    >
                      {item.category_details?.description || "-"}
                    </td> */}
                    {/* <td
                      className="p-3 text-sm text-gray-700"
                      style={{ minWidth: "300px" }}
                    >
                      {item.action_details?.action_taken || "-"}
                    </td> */}
                    {/* <td className="p-3 whitespace-nowrap">
                      {renderClickableStatusTag(
                        item.action_details?.change_record,
                        () => setSelectedModule("4m-cts")
                      )}
                    </td> */}

                    {/* <td className="p-3 whitespace-nowrap">
                      {renderStatusTag(
                        item.action_details?.identification_psn_batch_no
                      )}
                    </td> */}

                    {/* <td className="p-3 whitespace-nowrap">
                      {renderStatusTag(item.action_details?.ojt)}
                    </td> */}

                    {/* <td className="p-3 whitespace-nowrap">
                      {renderApprovalStatus(item)}
                    </td> */}
                    {/* <td className="p-3 whitespace-nowrap">
                      {renderClickableStatusTag(
                        item.action_details?.retroactive_inspection,
                        () => setSelectedModule("rcr") 
                      )}
                    </td> */}

                    {/* <td className="p-3 whitespace-nowrap">
                      {renderStatusTag(item.action_details?.containment_action)}
                    </td> */}


                    {/* <td className="p-3 whitespace-nowrap">
                      {renderCustomerApprovalStatus(item)}
                    </td> */}
                
                    {/* <td className="p-3 whitespace-nowrap text-sm font-medium">
                      {item.action_details?.approving_authority || "-"}
                    </td> */}

                    {/* <td
                      className="p-3 text-sm text-gray-700"
                      style={{ minWidth: "250px" }}
                    >
                      {item.action_details?.remarks || "-"}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

