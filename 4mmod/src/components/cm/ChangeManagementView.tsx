import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Users, Settings, Package, Wrench,
  FileText, ClipboardCheck, ListChecks, Flag, Calendar, 
  Trash2, Send, Building2, Router, MapPin, Clock, Zap, GitCommit, List, CheckSquare
} from 'lucide-react';

const changeCategories = [
  { name: 'Man', label: 'Man', description: 'Personnel Changes', icon: Users, gradient: 'from-blue-600 to-indigo-600', color: '#3B82F6' },
  { name: 'Machine/Tool', label: 'Machine/Tool', description: 'Equipment Changes', icon: Settings, gradient: 'from-green-600 to-emerald-600', color: '#10B981' },
  { name: 'Material', label: 'Material', description: 'Material Changes', icon: Package, gradient: 'from-purple-600 to-fuchsia-600', color: '#8B5CF6' },
  { name: 'Method', label: 'Method', description: 'Process Changes', icon: Wrench, gradient: 'from-orange-600 to-red-500', color: '#F59E0B' },
];

const categoryOptions = [
  { value: 'Planned', label: 'Planned' },
  { value: 'Unplanned', label: 'Unplanned' },
  { value: 'Abnormal', label: 'Abnormal' },
];

const initialState = {
  four_m: 'Man',
  shopfloor: '',
  line: '',
  station: '',
  category: '',
  action: '',
  date: '',
  time: '',
};

export default function ChangeManagementView() {
  const [selectedCategory, setSelectedCategory] = useState('Man');
  const [form, setForm] = useState({ ...initialState, four_m: 'Man' });
  const [message, setMessage] = useState('');
  const [changeList, setChangeList] = useState<any[]>([]);
  const [showList, setShowList] = useState(false);

  // Dropdown data
  const [shopfloors, setShopfloors] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [selectedCategoryType, setSelectedCategoryType] = useState('');
  const [descriptions, setDescriptions] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [selectedAction, setSelectedAction] = useState<any>(null);

  const selected = changeCategories.find((c) => c.name === selectedCategory);


  // --- Data Fetching and Logic (Unchanged Functional Core) ---

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/shopfloors/')
      .then(res => res.json())
      .then(data => setShopfloors(data))
      .catch(() => setShopfloors([]));
  }, []);


  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/4m-changes/')
      .then(res => res.json())
      .then(data => setChangeList(data))
      .catch(() => setChangeList([]));
  }, [message]);


  useEffect(() => {
    if (form.shopfloor) {
      fetch(`http://127.0.0.1:8000/api/lines/?shopfloor=${form.shopfloor}`)
        .then(res => res.json())
        .then(data => setLines(data))
        .catch(() => setLines([]));
    } else {
      setLines([]);
      setForm(prev => ({ ...prev, line: '', station: '' }));
    }
  }, [form.shopfloor]);


  useEffect(() => {
    if (form.line) {
      fetch(`http://127.0.0.1:8000/api/stations/?line=${form.line}`)
        .then(res => res.json())
        .then(data => setStations(data))
        .catch(() => setStations([]));
    } else {
      setStations([]);
      setForm(prev => ({ ...prev, station: '' }));
    }
  }, [form.line]);

  // Fetch descriptions when category type changes
  useEffect(() => {
    if (selectedCategoryType) {
      fetch(`http://127.0.0.1:8000/api/4m-categories/?category_type=${selectedCategoryType}`)
        .then(res => res.json())
        .then(data => setDescriptions(data))
        .catch(() => setDescriptions([]));
    } else {
      setDescriptions([]);
      setForm(prev => ({ ...prev, category: '' }));
    }
  }, [selectedCategoryType]);

  // Fetch actions when description (category) changes
  useEffect(() => {
    if (form.category) {
      fetch(`http://127.0.0.1:8000/api/actions/?category=${form.category}`)
        .then(res => res.json())
        .then(data => {
          setActions(data);
          // If only one action, auto-select it
          if (data.length === 1) {
            setForm(prev => ({ ...prev, action: data[0].id }));
            setSelectedAction(data[0]);
          }
        })
        .catch(() => setActions([]));
    } else {
      setActions([]);
      setForm(prev => ({ ...prev, action: '' }));
      setSelectedAction(null);
    }
  }, [form.category]);

  // Auto-fill when action changes
  useEffect(() => {
    if (form.action) {
      const action = actions.find(a => a.id === parseInt(form.action));
      setSelectedAction(action);
    }
  }, [form.action, actions]);

  // Handle form field changes
  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle category card click
  const handleCategory = (cat: string) => {
    setSelectedCategory(cat);
    setForm((prev) => ({
      ...prev,
      four_m: cat,
    }));
  };

  // Handle form submit
  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setMessage('');
    
    // Validate required fields
    if (!form.shopfloor || !form.line || !form.station || !form.category || !form.action || !form.date || !form.time) {
      setMessage('❌ Error: Please fill all required fields');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/4m-changes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        setMessage('✅ 4M Change record created!');
        setForm({ ...initialState, four_m: selectedCategory });
        setSelectedCategoryType('');
        setSelectedAction(null);
      } else {
        const data = await response.json();
        setMessage('❌ Error: ' + JSON.stringify(data));
      }
    } catch (error: any) {
      setMessage('❌ Error: ' + error.toString());
    }
  }
  
  // --- End Data Fetching and Logic (Unchanged Functional Core) ---


  // --- UI START ---

  const renderStatusTag = (status: boolean | undefined) => (
    <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
      status 
        ? 'bg-green-100 text-green-700' 
        : 'bg-red-100 text-red-700'
    }`}>
      {status ? 'REQUIRED' : 'N/A'}
    </span>
  );
  
  const InputSelect = ({ name, label, value, onChange, options, disabled = false, required = true, icon: Icon, placeholder = 'Select...' }: any) => (
    <div>
      <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-blue-500" /> {label} {required && <span className="text-red-500">*</span>}
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
          <option key={opt.id || opt.value} value={opt.id || opt.value}>{opt.name || opt.label || opt.description || opt.action_taken}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">4M Change Management</h1>
          <p className="text-gray-500 text-lg">Select a category to record and track manufacturing changes.</p>
        </div>
      </div>

      {/* Category Cards: High-Impact Tiles */}
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
                ${isSelected 
                  ? 'ring-4 ring-offset-4 ring-offset-[#f6faff] ring-blue-500 shadow-blue-500/40 transform scale-[1.03] translate-y-[-4px]' 
                  : 'hover:shadow-2xl hover:scale-[1.01] hover:border-blue-200'
                }
              `}
              onClick={() => handleCategory(cat.name)}
            >
              <div className="flex items-start gap-4 z-10 relative">
                <div 
                  className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${cat.gradient} shadow-lg shadow-black/30`}
                  style={{ backgroundColor: cat.color }} // Fallback/primary color
                >
                  {Icon && <Icon className="w-8 h-8 text-white" />}
                </div>
                <div className='mt-1'>
                  <div className="text-xl font-extrabold text-gray-900">{cat.label}</div>
                  <div className="text-gray-500 text-sm mt-1">{cat.description}</div>
                </div>
              </div>
              {/* Corner accent for visual depth */}
              <div className={`absolute bottom-[-20px] right-[-20px] w-12 h-12 rounded-full opacity-10`} style={{ backgroundColor: cat.color }}></div>
            </div>
          );
        })}
      </div>

      {/* Selected Category Header */}
      {selected && (
        <div className={`rounded-3xl bg-gradient-to-r ${selected.gradient} p-8 mb-8 flex items-center gap-6 shadow-2xl shadow-gray-500/30`}>
          <div className={`w-16 h-16 flex items-center justify-center rounded-xl bg-white/20 border border-white/50 backdrop-blur-sm`}>
            {selected.icon && <selected.icon className="w-9 h-9 text-white" />}
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white mb-1 tracking-wider">{selected.label} Change Management</h3>
            <p className="text-white/90 text-lg font-medium">{selected.description}</p>
          </div>
        </div>
      )}

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-8 border border-gray-100/80">
        
        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3 border-b pb-4">
            <GitCommit className="w-6 h-6 text-blue-600"/> Record New Change
        </h2>

        {/* Shopfloor, Line, Station Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputSelect name="shopfloor" label="Shopfloor" value={form.shopfloor} onChange={handleChange} options={shopfloors.map((sf: any) => ({ id: sf.id, name: sf.name }))} icon={Building2} placeholder="Select Shopfloor..." />
          <InputSelect name="line" label="Line" value={form.line} onChange={handleChange} options={lines.map((l: any) => ({ id: l.id, name: l.name }))} icon={Router} disabled={!form.shopfloor} placeholder="Select Line..." />
          <InputSelect name="station" label="Station" value={form.station} onChange={handleChange} options={stations.map((s: any) => ({ id: s.id, name: s.name }))} icon={MapPin} disabled={!form.line} placeholder="Select Station..." />
        </div>

        {/* Category Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputSelect name="categoryType" label="Change Type" value={selectedCategoryType} onChange={(e: any) => setSelectedCategoryType(e.target.value)} options={categoryOptions} icon={ListChecks} placeholder="Select Change Type..." required />
          <InputSelect name="category" label="Change Description" value={form.category} onChange={handleChange} options={descriptions.map((d: any) => ({ id: d.id, description: d.description }))} icon={FileText} disabled={!selectedCategoryType} placeholder="Select Description..." required />
          <InputSelect name="action" label="Action Taken" value={form.action} onChange={handleChange} options={actions.map((a: any) => ({ id: a.id, action_taken: a.action_taken }))} icon={ClipboardCheck} disabled={!form.category || actions.length <= 1} placeholder="Select Action..." required />
        </div>

        {/* Auto-filled fields (read-only display) */}
        {selectedAction && (
          <div className="bg-blue-50/70 rounded-xl p-6 space-y-4 border border-blue-200 shadow-inner">
            <h4 className="font-extrabold text-xl text-blue-900 mb-4 flex items-center gap-2">
                <CheckSquare className='w-5 h-5'/> Required Post-Change Actions
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className='p-3 rounded-lg border bg-white shadow-sm'>
                <label className="text-sm font-bold text-gray-700 mb-1 block flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" /> Set-Up Approval:
                </label>
                {renderStatusTag(selectedAction.set_up_approval)}
              </div>

              <div className='p-3 rounded-lg border bg-white shadow-sm'>
                <label className="text-sm font-bold text-gray-700 mb-1 block flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-purple-500" /> Retroactive Inspection:
                </label>
                {renderStatusTag(selectedAction.retroactive_inspection)}
              </div>

              <div className='p-3 rounded-lg border bg-white shadow-sm'>
                <label className="text-sm font-bold text-gray-700 mb-1 block flex items-center gap-2">
                  <Flag className="w-4 h-4 text-red-500" /> Suspected Lot Check:
                </label>
                {renderStatusTag(selectedAction.suspected_lot_check)}
              </div>
            </div>

            {selectedAction.remarks && (
              <div className='pt-2'>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Action Details:</label>
                <p className="text-gray-900 bg-white p-3 rounded-xl border font-medium shadow-inner">{selectedAction.action_taken}</p>
                <p className="text-gray-700 bg-white p-3 rounded-xl border mt-2 text-sm italic">{selectedAction.remarks}</p>
              </div>
            )}
          </div>
        )}

        {/* Date and Time Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <InputSelect name="date" label="Date of Change" value={form.date} onChange={handleChange} options={[]} type="date" icon={Calendar} required /> */}
          {/* <InputSelect name="time" label="Time of Change" value={form.time} onChange={handleChange} options={[]} type="time" icon={Clock} required /> */}
        
       {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
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
        {/* </div>         */}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
          <div className="flex-1"></div>
          <button
            type="button"
            onClick={() => {
              setForm({ ...initialState, four_m: selectedCategory });
              setSelectedCategoryType('');
              setSelectedAction(null);
              setMessage('');
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
          <div className={`mt-4 p-4 rounded-xl font-medium ${message.startsWith('❌') ? 'bg-red-50 text-red-600 border border-red-300' : 'bg-green-50 text-green-700 border border-green-300'}`}>
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
          <List className="w-5 h-5" /> {showList ? 'Hide' : 'Show'} All 4M Change Records ({changeList.length})
        </button>
      </div>

      {showList && (
        <div className="mt-6 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100/80 overflow-x-auto">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-6 border-b pb-3">Change Record History</h3>
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-inner">
            <table className="w-full bg-white border-collapse" style={{ minWidth: '2000px' }}>
              <thead className="bg-gray-50/80 sticky top-0">
                <tr className='text-left'>
                  {['S.No', 'ID', 'Date', 'Time', '4M', 'Shopfloor', 'Line', 'Station', 'Category', 'Description', 'Action', 'Set-Up', 'Retro Inspect', 'Lot Check', 'Remarks'].map((header) => (
                    <th key={header} className="p-3 text-xs font-extrabold text-gray-700 uppercase tracking-wider border-b border-gray-200">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {changeList.length === 0 && (
                  <tr>
                    <td colSpan={15} className="text-center text-gray-400 py-6 border-b">
                      No records found.
                    </td>
                  </tr>
                )}
                {changeList.map((item: any, idx: number) => (
                  <tr key={item.id || idx} className="border-b hover:bg-blue-50/50 transition-colors">
                    <td className="p-3 whitespace-nowrap">{idx + 1}</td>
                    <td className="p-3 font-bold text-blue-600 whitespace-nowrap">{item.record_id || item.id}</td>
                    <td className="p-3 whitespace-nowrap font-medium">
                      {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-3 whitespace-nowrap font-medium">{item.time || '-'}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        item.four_m === 'Man' ? 'bg-blue-100 text-blue-700' :
                        item.four_m === 'Machine/Tool' ? 'bg-green-100 text-green-700' :
                        item.four_m === 'Material' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {item.four_m}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">{item.shopfloor_name || '-'}</td>
                    <td className="p-3 whitespace-nowrap">{item.line_name || '-'}</td>
                    <td className="p-3 whitespace-nowrap">{item.station_name || '-'}</td>
                    <td className="p-3 whitespace-nowrap font-bold">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            item.category_details?.category_type === 'Planned' ? 'bg-green-50 text-green-700' :
                            item.category_details?.category_type === 'Unplanned' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-red-50 text-red-700'
                        }`}>
                            {item.category_details?.category_type || '-'}
                        </span>
                    </td>
                    <td className="p-3 text-sm text-gray-700" style={{ minWidth: '300px' }}>
                      {item.category_details?.description || '-'}
                    </td>
                    <td className="p-3 text-sm text-gray-700" style={{ minWidth: '300px' }}>
                      {item.action_details?.action_taken || '-'}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {renderStatusTag(item.action_details?.set_up_approval)}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {renderStatusTag(item.action_details?.retroactive_inspection)}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {renderStatusTag(item.action_details?.suspected_lot_check)}
                    </td>
                    <td className="p-3 text-sm text-gray-700" style={{ minWidth: '250px' }}>
                      {item.action_details?.remarks || '-'}
                    </td>
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


// import React, { useState, useEffect, ChangeEvent } from 'react';
// import {
//   Users, Settings, Package, Wrench,
//   FileText, ClipboardCheck, ListChecks, Flag, Calendar, 
//   Trash2, Send, Building2, Router, MapPin, Clock
// } from 'lucide-react';

// const changeCategories = [
//   { name: 'Man', label: 'Man', description: 'Personnel Changes', icon: Users, gradient: 'from-blue-500 to-indigo-500', color: 'bg-blue-500' },
//   { name: 'Machine/Tool', label: 'Machine/Tool', description: 'Equipment Changes', icon: Settings, gradient: 'from-green-600 to-green-800', color: 'bg-green-600' },
//   { name: 'Material', label: 'Material', description: 'Material Changes', icon: Package, gradient: 'from-purple-500 to-purple-600', color: 'bg-purple-500' },
//   { name: 'Method', label: 'Method', description: 'Process Changes', icon: Wrench, gradient: 'from-orange-500 to-orange-600', color: 'bg-orange-500' },
// ];

// const categoryOptions = [
//   { value: 'Planned', label: 'Planned' },
//   { value: 'Unplanned', label: 'Unplanned' },
//   { value: 'Abnormal', label: 'Abnormal' },
// ];

// const initialState = {
//   four_m: 'Man',
//   shopfloor: '',
//   line: '',
//   station: '',
//   category: '',
//   action: '',
//   date: '',
//   time: '',
// };

// export default function ChangeManagementView() {
//   const [selectedCategory, setSelectedCategory] = useState('Man');
//   const [form, setForm] = useState({ ...initialState, four_m: 'Man' });
//   const [message, setMessage] = useState('');
//   const [changeList, setChangeList] = useState<any[]>([]);
//   const [showList, setShowList] = useState(false);

//   // Dropdown data
//   const [shopfloors, setShopfloors] = useState<any[]>([]);
//   const [lines, setLines] = useState<any[]>([]);
//   const [stations, setStations] = useState<any[]>([]);
//   const [selectedCategoryType, setSelectedCategoryType] = useState('');
//   const [descriptions, setDescriptions] = useState<any[]>([]);
//   const [actions, setActions] = useState<any[]>([]);
//   const [selectedAction, setSelectedAction] = useState<any>(null);

//   const selected = changeCategories.find((c) => c.name === selectedCategory);


//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/api/shopfloors/')
//       .then(res => res.json())
//       .then(data => setShopfloors(data))
//       .catch(() => setShopfloors([]));
//   }, []);


//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/api/4m-changes/')
//       .then(res => res.json())
//       .then(data => setChangeList(data))
//       .catch(() => setChangeList([]));
//   }, [message]);


//   useEffect(() => {
//     if (form.shopfloor) {
//       fetch(`http://127.0.0.1:8000/api/lines/?shopfloor=${form.shopfloor}`)
//         .then(res => res.json())
//         .then(data => setLines(data))
//         .catch(() => setLines([]));
//     } else {
//       setLines([]);
//       setForm(prev => ({ ...prev, line: '', station: '' }));
//     }
//   }, [form.shopfloor]);


//   useEffect(() => {
//     if (form.line) {
//       fetch(`http://127.0.0.1:8000/api/stations/?line=${form.line}`)
//         .then(res => res.json())
//         .then(data => setStations(data))
//         .catch(() => setStations([]));
//     } else {
//       setStations([]);
//       setForm(prev => ({ ...prev, station: '' }));
//     }
//   }, [form.line]);

//   // Fetch descriptions when category type changes
//   useEffect(() => {
//     if (selectedCategoryType) {
//       fetch(`http://127.0.0.1:8000/api/4m-categories/?category_type=${selectedCategoryType}`)
//         .then(res => res.json())
//         .then(data => setDescriptions(data))
//         .catch(() => setDescriptions([]));
//     } else {
//       setDescriptions([]);
//       setForm(prev => ({ ...prev, category: '' }));
//     }
//   }, [selectedCategoryType]);

//   // Fetch actions when description (category) changes
//   useEffect(() => {
//     if (form.category) {
//       fetch(`http://127.0.0.1:8000/api/actions/?category=${form.category}`)
//         .then(res => res.json())
//         .then(data => {
//           setActions(data);
//           // If only one action, auto-select it
//           if (data.length === 1) {
//             setForm(prev => ({ ...prev, action: data[0].id }));
//             setSelectedAction(data[0]);
//           }
//         })
//         .catch(() => setActions([]));
//     } else {
//       setActions([]);
//       setForm(prev => ({ ...prev, action: '' }));
//       setSelectedAction(null);
//     }
//   }, [form.category]);

//   // Auto-fill when action changes
//   useEffect(() => {
//     if (form.action) {
//       const action = actions.find(a => a.id === parseInt(form.action));
//       setSelectedAction(action);
//     }
//   }, [form.action, actions]);

//   // Handle form field changes
//   const handleChange = (
//     e: ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle category card click
//   const handleCategory = (cat: string) => {
//     setSelectedCategory(cat);
//     setForm((prev) => ({
//       ...prev,
//       four_m: cat,
//     }));
//   };

//   // Handle form submit
//   async function handleSubmit(e: { preventDefault: () => void; }) {
//     e.preventDefault();
//     setMessage('');
    
//     // Validate required fields
//     if (!form.shopfloor || !form.line || !form.station || !form.category || !form.action || !form.date || !form.time) {
//       setMessage('❌ Error: Please fill all required fields');
//       return;
//     }

//     try {
//       const response = await fetch('http://127.0.0.1:8000/api/4m-changes/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(form),
//       });
//       if (response.ok) {
//         setMessage('✅ 4M Change record created!');
//         setForm({ ...initialState, four_m: selectedCategory });
//         setSelectedCategoryType('');
//         setSelectedAction(null);
//       } else {
//         const data = await response.json();
//         setMessage('❌ Error: ' + JSON.stringify(data));
//       }
//     } catch (error: any) {
//       setMessage('❌ Error: ' + error.toString());
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#f6faff] p-6">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h3 className="text-3xl font-bold">4M Change Management</h3>
//           <p className="text-gray-500">Select a category to manage changes effectively</p>
//         </div>
//       </div>

//       {/* Category Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {changeCategories.map((cat) => {
//           const Icon = cat.icon;
//           const isSelected = cat.name === selectedCategory;
//           return (
//             <div
//               key={cat.name}
//               className={`cursor-pointer rounded-2xl bg-white shadow p-6 transition hover:shadow-lg border relative ${
//                 isSelected ? 'ring-2 ring-blue-500' : ''
//               }`}
//               onClick={() => handleCategory(cat.name)}
//             >
//               <div className="flex items-center gap-3 mb-2">
//                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color} bg-opacity-90`}>
//                   {Icon && <Icon className="w-7 h-7 text-white" />}
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold">{cat.label}</div>
//                   <div className="text-gray-500 text-sm">{cat.description}</div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Selected Category Header */}
//       {selected && (
//         <div className={`rounded-2xl bg-gradient-to-r ${selected.gradient} p-6 mb-8 flex items-center gap-4 shadow`}>
//           <div className={`w-14 h-14 flex items-center justify-center rounded-xl ${selected.color}`}>
//             {selected.icon && <selected.icon className="w-8 h-8 text-white" />}
//           </div>
//           <div>
//             <h3 className="text-2xl font-bold text-white mb-1">{selected.label} Management</h3>
//             <p className="text-white text-lg">{selected.description}</p>
//           </div>
//         </div>
//       )}

//       {/* Form Section */}
//       <div className="bg-white rounded-2xl shadow p-8 space-y-6">
        
//         {/* Shopfloor, Line, Station Selection */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div>
//             <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
//               <Building2 className="w-4 h-4" /> Shopfloor *
//             </label>
//             <select
//               name="shopfloor"
//               value={form.shopfloor}
//               onChange={handleChange}
//               className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             >
//               <option value="">Select Shopfloor...</option>
//               {shopfloors.map((sf) => (
//                 <option key={sf.id} value={sf.id}>{sf.name}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
//               <Router className="w-4 h-4" /> Line *
//             </label>
//             <select
//               name="line"
//               value={form.line}
//               onChange={handleChange}
//               className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//               disabled={!form.shopfloor}
//             >
//               <option value="">Select Line...</option>
//               {lines.map((line) => (
//                 <option key={line.id} value={line.id}>{line.name}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
//               <MapPin className="w-4 h-4" /> Station *
//             </label>
//             <select
//               name="station"
//               value={form.station}
//               onChange={handleChange}
//               className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//               disabled={!form.line}
//             >
//               <option value="">Select Station...</option>
//               {stations.map((station) => (
//                 <option key={station.id} value={station.id}>{station.name}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Category Type Selection */}
//         <div>
//           <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
//             <ListChecks className="w-4 h-4" /> Change Category *
//           </label>
//           <select
//             value={selectedCategoryType}
//             onChange={(e) => setSelectedCategoryType(e.target.value)}
//             className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           >
//             <option value="">Select Category...</option>
//             {categoryOptions.map((opt) => (
//               <option key={opt.value} value={opt.value}>{opt.label}</option>
//             ))}
//           </select>
//         </div>

//         {/* Change Description Dropdown */}
//         <div>
//           <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
//             <FileText className="w-4 h-4" /> Change Description *
//           </label>
//           <select
//             name="category"
//             value={form.category}
//             onChange={handleChange}
//             className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//             disabled={!selectedCategoryType}
//           >
//             <option value="">Select Description...</option>
//             {descriptions.map((desc) => (
//               <option key={desc.id} value={desc.id}>{desc.description}</option>
//             ))}
//           </select>
//         </div>

//         {/* Action Taken Dropdown (only if multiple actions) */}
//         {actions.length > 1 && (
//           <div>
//             <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
//               <ClipboardCheck className="w-4 h-4" /> Action Taken *
//             </label>
//             <select
//               name="action"
//               value={form.action}
//               onChange={handleChange}
//               className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             >
//               <option value="">Select Action...</option>
//               {actions.map((action) => (
//                 <option key={action.id} value={action.id}>{action.action_taken}</option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Auto-filled fields (read-only display) */}
//         {selectedAction && (
//           <div className="bg-blue-50 rounded-xl p-6 space-y-4 border border-blue-200">
//             {/* <h4 className="font-semibold text-blue-900 mb-3">Auto-filled Information:</h4> */}
            
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">Action Taken:</label>
//               <p className="text-gray-900 bg-white p-3 rounded-lg border">{selectedAction.action_taken}</p>
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
//                   <Flag className="w-4 h-4" /> Set-Up Approval:
//                 </label>
//                 <p className={`p-2 rounded-lg text-center font-semibold ${selectedAction.set_up_approval ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                   {selectedAction.set_up_approval ? 'Yes' : 'No'}
//                 </p>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
//                   <Calendar className="w-4 h-4" /> Retroactive Inspection:
//                 </label>
//                 <p className={`p-2 rounded-lg text-center font-semibold ${selectedAction.retroactive_inspection ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                   {selectedAction.retroactive_inspection ? 'Yes' : 'No'}
//                 </p>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
//                   <Flag className="w-4 h-4" /> Suspected Lot Check:
//                 </label>
//                 <p className={`p-2 rounded-lg text-center font-semibold ${selectedAction.suspected_lot_check ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                   {selectedAction.suspected_lot_check ? 'Yes' : 'No'}
//                 </p>
//               </div>
//             </div>

//             {selectedAction.remarks && (
//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1 block">Remarks:</label>
//                 <p className="text-gray-900 bg-white p-3 rounded-lg border">{selectedAction.remarks}</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Date and Time Fields */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
//               <Calendar className="w-4 h-4" /> Date *
//             </label>
//             <input
//               type="date"
//               name="date"
//               value={form.date}
//               onChange={handleChange}
//               className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
//               <Clock className="w-4 h-4" /> Time *
//             </label>
//             <input
//               type="time"
//               name="time"
//               value={form.time}
//               onChange={handleChange}
//               className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-wrap gap-4 mt-8 border-t pt-6">
//           <div className="flex-1"></div>
//           <button
//             type="button"
//             onClick={() => {
//               setForm({ ...initialState, four_m: selectedCategory });
//               setSelectedCategoryType('');
//               setSelectedAction(null);
//             }}
//             className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
//           >
//             <Trash2 className="w-4 h-4" /> Clear Form
//           </button>
//           <button
//             type="button"
//             onClick={handleSubmit}
//             className={`bg-gradient-to-r ${selected?.gradient} text-white px-8 py-2 rounded-lg font-semibold flex items-center gap-2`}
//           >
//             <Send className="w-4 h-4" /> Submit Changes
//           </button>
//         </div>
        
//         {message && (
//           <div className={`mt-4 p-4 rounded-lg ${message.startsWith('❌') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
//             {message}
//           </div>
//         )}
//       </div>

//       {/* Submitted Details Button */}
//       <div className="mt-8">
//         <button
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700"
//           onClick={() => setShowList(!showList)}
//         >
//           {showList ? 'Hide' : 'Show'} 4M Change Records
//         </button>
//       </div>

//       {/* Show Table Below Button */}
//       {showList && (
//         <div className="mt-8 bg-white rounded-2xl shadow p-6">
//           <h3 className="text-xl font-bold mb-4">4M Change Records</h3>
//           <div className="overflow-x-auto border border-gray-200 rounded-lg" style={{ maxWidth: '100%' }}>
//             <table className="w-full bg-white border-collapse" style={{ minWidth: '2000px' }}>
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">S.No</th>
//                   <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">Record ID</th>
//                   <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">Date</th>
//                   <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">Time</th>
//                   <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">4M</th>
//                   <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">Shopfloor</th>
//                   <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">Line</th>
//                   <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">Station</th>
//                   <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">Category</th>
//                   <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">Description</th>
//                   <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">Action</th>
//                   <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">Set-Up</th>
//                   <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">Retro Inspect</th>
//                   <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">Lot Check</th>
//                   <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">Remarks</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {changeList.length === 0 && (
//                   <tr>
//                     <td colSpan={15} className="text-center text-gray-400 py-6 border-b">
//                       No records found.
//                     </td>
//                   </tr>
//                 )}
//                 {changeList.map((item: any, idx: number) => (
//                   <tr key={item.id || idx} className="border-b hover:bg-gray-50">
//                     <td className="p-3 whitespace-nowrap">{idx + 1}</td>
//                     <td className="p-3 font-semibold text-blue-600 whitespace-nowrap">{item.record_id}</td>
//                     <td className="p-3 whitespace-nowrap">
//                       {item.date ? new Date(item.date).toLocaleDateString() : '-'}
//                     </td>
//                     <td className="p-3 whitespace-nowrap">{item.time || '-'}</td>
//                     <td className="p-3 whitespace-nowrap">
//                       <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                         item.four_m === 'Man' ? 'bg-blue-100 text-blue-700' :
//                         item.four_m === 'Machine/Tool' ? 'bg-green-100 text-green-700' :
//                         item.four_m === 'Material' ? 'bg-purple-100 text-purple-700' :
//                         'bg-orange-100 text-orange-700'
//                       }`}>
//                         {item.four_m}
//                       </span>
//                     </td>
//                     <td className="p-3 whitespace-nowrap">{item.shopfloor_name || '-'}</td>
//                     <td className="p-3 whitespace-nowrap">{item.line_name || '-'}</td>
//                     <td className="p-3 whitespace-nowrap">{item.station_name || '-'}</td>
//                     <td className="p-3 whitespace-nowrap">{item.category_details?.category_type || '-'}</td>
//                     <td className="p-3" style={{ minWidth: '300px' }}>
//                       {item.category_details?.description || '-'}
//                     </td>
//                     <td className="p-3" style={{ minWidth: '300px' }}>
//                       {item.action_details?.action_taken || '-'}
//                     </td>
//                     <td className="p-3 whitespace-nowrap">
//                       <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                         item.action_details?.set_up_approval ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                       }`}>
//                         {item.action_details?.set_up_approval ? 'Yes' : 'No'}
//                       </span>
//                     </td>
//                     <td className="p-3 whitespace-nowrap">
//                       <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                         item.action_details?.retroactive_inspection ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                       }`}>
//                         {item.action_details?.retroactive_inspection ? 'Yes' : 'No'}
//                       </span>
//                     </td>
//                     <td className="p-3 whitespace-nowrap">
//                       <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                         item.action_details?.suspected_lot_check ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                       }`}>
//                         {item.action_details?.suspected_lot_check ? 'Yes' : 'No'}
//                       </span>
//                     </td>
//                     <td className="p-3" style={{ minWidth: '250px' }}>
//                       {item.action_details?.remarks || '-'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




