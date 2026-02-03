import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  Package,
  Calendar,
  MapPin,
  Hash,
  FileText,
  Truck,
  Clock,
  Receipt,
  CheckCircle2,
  XCircle,
  Box,
  Layers,
  MapPinned,
} from "lucide-react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface QRDataPacket {
  type: "SUSPECTED_LOT";
  version: string;
  record_id: string;
  part_name: string;
  quantity: string;
  location: string;
  date: string;
  change_type: string;
  four_m_type: string;
  dispatch_date: string;
  city: string;
  invoice: string;
  generated_at: string;
}

// ============================================================================
// COMPONENT: Info Row
// ============================================================================

const InfoRow = ({
  icon: Icon,
  label,
  value,
  iconColor = "text-gray-500",
  iconBg = "bg-gray-100",
}: {
  icon: any;
  label: string;
  value: string;
  iconColor?: string;
  iconBg?: string;
}) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
    <div className={`${iconBg} p-3 rounded-xl`}>
      <Icon size={24} className={iconColor} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </div>
      <div className="text-lg font-bold text-gray-900 truncate mt-0.5">
        {value || "—"}
      </div>
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT: Suspected Lot Viewer
// ============================================================================

const SuspectedLotViewer: React.FC = () => {
  const [data, setData] = useState<QRDataPacket | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const encodedData = urlParams.get("data");

      if (!encodedData) {
        setError("No data found in QR code");
        setLoading(false);
        return;
      }

      // Decode base64 data
      const decodedString = atob(encodedData);
      const parsedData: QRDataPacket = JSON.parse(decodedString);

      // Validate data structure
      if (parsedData.type !== "SUSPECTED_LOT") {
        setError("Invalid QR code type");
        setLoading(false);
        return;
      }

      setData(parsedData);
      setLoading(false);
    } catch (err) {
      console.error("Error decoding QR data:", err);
      setError("Failed to decode QR code data");
      setLoading(false);
    }
  }, []);

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-indigo-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-8 shadow-2xl">
              <Package className="w-16 h-16 text-white animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Loading QR Data...</h2>
          <p className="text-gray-500 mt-2">Decoding information</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // ERROR STATE
  // ============================================================================

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border-2 border-red-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
                <XCircle size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black">Error</h2>
                <p className="text-red-100 text-sm mt-1">QR Code Issue</p>
              </div>
            </div>
          </div>
          <div className="p-8 text-center">
            <p className="text-gray-700 text-lg font-medium mb-4">
              {error || "Unable to load data"}
            </p>
            <p className="text-gray-500 text-sm">
              Please ensure you're scanning a valid Suspected Lot QR code.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // SUCCESS STATE - DISPLAY DATA
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-6">
          {/* Alert Banner */}
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 p-6 text-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24 blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <AlertTriangle size={36} />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight">
                    SUSPECTED LOT
                  </h1>
                  <p className="text-orange-100 text-sm mt-1">
                    Quality Hold - Material Under Investigation
                  </p>
                </div>
              </div>

              {/* Record ID Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <Hash size={18} />
                <span className="font-mono font-bold text-lg">
                  {data.record_id}
                </span>
              </div>
            </div>
          </div>

          {/* Quantity Showcase */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 border-b border-orange-200">
            <div className="text-center">
              <div className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">
                Suspected Quantity
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="text-6xl font-black text-orange-600">
                  {data.quantity}
                </div>
                <div className="text-2xl font-bold text-orange-400">pcs</div>
              </div>
            </div>
          </div>

          {/* Location Banner - PROMINENT */}
          <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 p-6 text-white">
            <div className="flex items-center justify-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
                <MapPinned size={32} />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold opacity-90 uppercase tracking-wider">
                  Storage Location
                </div>
                <div className="text-3xl font-black mt-1 tracking-wide">
                  {data.location}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 lg:p-8 mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Layers size={24} className="text-indigo-600" />
            </div>
            Part & Change Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <InfoRow
              icon={Package}
              label="Part Name / Model"
              value={data.part_name}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
            />
            <InfoRow
              icon={FileText}
              label="Change Type"
              value={data.change_type}
              iconColor="text-red-600"
              iconBg="bg-red-100"
            />
            <InfoRow
              icon={Box}
              label="4M Type"
              value={data.four_m_type || "—"}
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
            />
            <InfoRow
              icon={Calendar}
              label="Date of Change"
              value={data.date}
              iconColor="text-indigo-600"
              iconBg="bg-indigo-100"
            />
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3 mt-10">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Truck size={24} className="text-emerald-600" />
            </div>
            Dispatch Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow
              icon={Clock}
              label="Dispatch Date"
              value={data.dispatch_date || "Not dispatched"}
              iconColor="text-orange-600"
              iconBg="bg-orange-100"
            />
            <InfoRow
              icon={MapPin}
              label="Customer City"
              value={data.city || "—"}
              iconColor="text-teal-600"
              iconBg="bg-teal-100"
            />
            <InfoRow
              icon={Receipt}
              label="Invoice / Reference"
              value={data.invoice || "—"}
              iconColor="text-gray-600"
              iconBg="bg-gray-100"
            />
            <InfoRow
              icon={MapPinned}
              label="Storage Location"
              value={data.location}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-100"
            />
          </div>
        </div>

        {/* QR Metadata Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                QR Generated
              </div>
              <div className="text-sm font-bold text-gray-700 mt-1">
                {new Date(data.generated_at).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">
                Version {data.version}
              </span>
            </div>
          </div>
        </div>

        {/* Warning Footer */}
        <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-200 rounded-xl">
              <AlertTriangle size={24} className="text-yellow-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-yellow-900 mb-2">
                ⚠️ Quality Hold Notice
              </h3>
              <p className="text-yellow-800 text-sm leading-relaxed">
                This material is under suspected lot status and should not be
                used in production until cleared by Quality Assurance. Contact
                the Quality Department for disposition instructions.
              </p>
            </div>
          </div>
        </div>

        {/* Powered By Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by{" "}
            <span className="font-bold text-indigo-600">
              Suspected Lot Traceability System
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Scan QR codes with any smartphone camera • No app required
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuspectedLotViewer;