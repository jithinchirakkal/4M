
// import React, { useState, useEffect, ChangeEvent } from 'react';
// import {
//   Users, Settings, Package, Wrench,
//   FileText, ClipboardCheck, ListChecks, Flag, User, Calendar, Paperclip, Eye, Trash2, Send,
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
//   changed_description: '',
//   action_taken: '',
//   change_category: '',
//   set_up_approval: false,
//   retroactive_inspection: false,
//   suspected_lot_check: false,
//   remarks: '',
// };

// export default function ChangeManagementView() {
//   const [selectedCategory, setSelectedCategory] = useState('Man');
//   const [form, setForm] = useState({ ...initialState, four_m: 'Man' });
//   const [message, setMessage] = useState('');
//   const [changeList, setChangeList] = useState<any[]>([]);
//   const [showList, setShowList] = useState(false);

//   const selected = changeCategories.find((c) => c.name === selectedCategory);

//   // Fetch all 4M changes from API
//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/api/4m-changes/')
//       .then(res => res.json())
//       .then(data => setChangeList(data))
//       .catch(() => setChangeList([]));
//   }, [message]); // refetch after submit

//   // Handle form field changes
//   const handleChange = (
//     e: ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>
//   ) => {
//     const { name, value, type } = e.target;
//     let newValue: string | boolean = value;
//     if (type === 'checkbox') {
//       newValue = (e.target as HTMLInputElement).checked;
//     }
//     setForm(prev => ({
//       ...prev,
//       [name]: newValue,
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
//     // Add current date if not present
//     const formWithDate = {
//       ...form,
//       created: new Date().toISOString(),
//     };
//     try {
//       const response = await fetch('http://127.0.0.1:8000/api/4m-changes/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formWithDate),
//       });
//       if (response.ok) {
//         setMessage('✅ 4M Change record created!');
//         setForm({ ...initialState, four_m: selectedCategory });
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
//           <h2 className="text-3xl font-bold">4M Change Management</h2>
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
//       <form className="bg-white rounded-2xl shadow p-8 space-y-8" onSubmit={handleSubmit} onReset={() => setForm({ ...initialState, four_m: selectedCategory })}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div>
//             <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
//               <FileText className="w-4 h-4" /> Change Description
//             </label>
//             <textarea
//               name="changed_description"
//               value={form.changed_description}
//               onChange={handleChange}
//               placeholder="Provide detailed description of the change..."
//               className="w-full rounded-xl border border-gray-200 p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
//               <ClipboardCheck className="w-4 h-4" /> Action Taken
//             </label>
//             <textarea
//               name="action_taken"
//               value={form.action_taken}
//               onChange={handleChange}
//               placeholder="Describe the actions taken..."
//               className="w-full rounded-xl border border-gray-200 p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div>
//             <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
//               <ListChecks className="w-4 h-4" /> Change Category
//             </label>
//             <select
//               name="change_category"
//               value={form.change_category}
//               onChange={handleChange}
//               className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             >
//               <option value="">Select category...</option>
//               {categoryOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
//               <Flag className="w-4 h-4" /> Set-Up Approval
//             </label>
//             <input
//               type="checkbox"
//               name="set_up_approval"
//               checked={form.set_up_approval}
//               onChange={handleChange}
//               className="w-6 h-6"
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
//               <Calendar className="w-4 h-4" /> Retroactive Inspection
//             </label>
//             <input
//               type="checkbox"
//               name="retroactive_inspection"
//               checked={form.retroactive_inspection}
//               onChange={handleChange}
//               className="w-6 h-6"
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
//               <User className="w-4 h-4" /> Suspected Lot Check
//             </label>
//             <input
//               type="checkbox"
//               name="suspected_lot_check"
//               checked={form.suspected_lot_check}
//               onChange={handleChange}
//               className="w-6 h-6"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
//             <FileText className="w-4 h-4" /> Remarks
//           </label>
//           <input
//             type="text"
//             name="remarks"
//             value={form.remarks}
//             onChange={handleChange}
//             placeholder="Any remarks..."
//             className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-wrap gap-4 mt-8 border-t pt-6">
//           <button
//             type="button"
//             className="flex items-center gap-2 border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50"
//             tabIndex={-1}
//           >
//             <Paperclip className="w-4 h-4" /> Attach Files
//           </button>
//           <button
//             type="button"
//             className="flex items-center gap-2 border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50"
//             tabIndex={-1}
//           >
//             <Eye className="w-4 h-4" /> Preview
//           </button>
//           <div className="flex-1"></div>
//           <button
//             type="reset"
//             className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
//           >
//             <Trash2 className="w-4 h-4" /> Clear Form
//           </button>
//           <button
//             type="submit"
//             className={`bg-gradient-to-r ${selected?.gradient} text-white px-8 py-2 rounded-lg font-semibold flex items-center gap-2`}
//           >
//             <Send className="w-4 h-4" /> Submit Changes
//           </button>
//         </div>
//         {message && (
//           <div className={`mt-4 ${message.startsWith('❌') ? 'text-red-600' : 'text-green-600'}`}>
//             {message}
//           </div>
//         )}
//       </form>

//       {/* Submitted Details Button */}
//       <div className="mt-8">
//         <button
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700"
//           onClick={() => setShowList(!showList)}
//         >
//           4M Change Management
//         </button>
//       </div>

//       {/* Show Table Below Button */}
//       {showList && (
//         <div className="mt-8">
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white rounded-xl shadow">
//               <thead>
//                 <tr>
//                   <th className="p-3 text-left">S.No</th>
//                   <th className="p-3 text-left">Date</th>
//                   <th className="p-3 text-left">4M</th>
//                   <th className="p-3 text-left">Description</th>
//                   <th className="p-3 text-left">Action</th>
//                   <th className="p-3 text-left">Category</th>
//                   <th className="p-3 text-left">Set-Up Approval</th>
//                   <th className="p-3 text-left">Retroactive Inspection</th>
//                   <th className="p-3 text-left">Suspected Lot Check</th>
//                   <th className="p-3 text-left">Remarks</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {changeList.length === 0 && (
//                   <tr>
//                     <td colSpan={10} className="text-center text-gray-400 py-6">
//                       No records found.
//                     </td>
//                   </tr>
//                 )}
//                 {changeList.map((item: any, idx: number) => (
//                   <tr key={item.id || idx}>
//                     <td className="p-3">{idx + 1}</td>
//                     <td className="p-3">
//                       {item.created
//                         ? new Date(item.created).toLocaleDateString()
//                         : '-'}
//                     </td>
//                     <td className="p-3">
//                       {changeCategories.find(c => c.name === item.four_m)?.label || item.four_m}
//                     </td>
//                     <td className="p-3">{item.changed_description}</td>
//                     <td className="p-3">{item.action_taken}</td>
//                     <td className="p-3">{item.change_category}</td>
//                     <td className="p-3">{item.set_up_approval ? 'Yes' : 'No'}</td>
//                     <td className="p-3">{item.retroactive_inspection ? 'Yes' : 'No'}</td>
//                     <td className="p-3">{item.suspected_lot_check ? 'Yes' : 'No'}</td>
//                     <td className="p-3">{item.remarks}</td>
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



import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Users, Settings, Package, Wrench,
  FileText, ClipboardCheck, ListChecks, Flag, User, Calendar, Paperclip, Eye, Trash2, Send,
} from 'lucide-react';

const changeCategories = [
  { name: 'Man', label: 'Man', description: 'Personnel Changes', icon: Users, gradient: 'from-blue-500 to-indigo-500', color: 'bg-blue-500' },
  { name: 'Machine/Tool', label: 'Machine/Tool', description: 'Equipment Changes', icon: Settings, gradient: 'from-green-600 to-green-800', color: 'bg-green-600' },
  { name: 'Material', label: 'Material', description: 'Material Changes', icon: Package, gradient: 'from-purple-500 to-purple-600', color: 'bg-purple-500' },
  { name: 'Method', label: 'Method', description: 'Process Changes', icon: Wrench, gradient: 'from-orange-500 to-orange-600', color: 'bg-orange-500' },
];

const categoryOptions = [
  { value: 'Planned', label: 'Planned' },
  { value: 'Unplanned', label: 'Unplanned' },
  { value: 'Abnormal', label: 'Abnormal' },
];

const initialState = {
  four_m: 'Man',
  date: '',
  changed_description: '',
  action_taken: '',
  change_category: '',
  set_up_approval: false,
  retroactive_inspection: false,
  suspected_lot_check: false,
  remarks: '',
};

export default function ChangeManagementView() {
  const [selectedCategory, setSelectedCategory] = useState('Man');
  const [form, setForm] = useState({ ...initialState, four_m: 'Man' });
  const [message, setMessage] = useState('');
  const [changeList, setChangeList] = useState<any[]>([]);
  const [showList, setShowList] = useState(false);

  const selected = changeCategories.find((c) => c.name === selectedCategory);

  // Fetch all 4M changes from API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/4m-changes/')
      .then(res => res.json())
      .then(data => setChangeList(data))
      .catch(() => setChangeList([]));
  }, [message]); // refetch after submit

  // Handle form field changes
  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setForm(prev => ({
      ...prev,
      [name]: newValue,
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
    try {
      const response = await fetch('http://127.0.0.1:8000/api/4m-changes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        setMessage('✅ 4M Change record created!');
        setForm({ ...initialState, four_m: selectedCategory });
      } else {
        const data = await response.json();
        setMessage('❌ Error: ' + JSON.stringify(data));
      }
    } catch (error: any) {
      setMessage('❌ Error: ' + error.toString());
    }
  }

  return (
    <div className="min-h-screen bg-[#f6faff] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-3xl font-bold">Change Categories</h3>
          {/* 4M Change Management */}
          <p className="text-gray-500">Select a category to manage changes effectively</p>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {changeCategories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = cat.name === selectedCategory;
          return (
            <div
              key={cat.name}
              className={`cursor-pointer rounded-2xl bg-white shadow p-6 transition hover:shadow-lg border relative ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleCategory(cat.name)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color} bg-opacity-90`}>
                  {Icon && <Icon className="w-7 h-7 text-white" />}
                </div>
                <div>
                  <div className="text-lg font-bold">{cat.label}</div>
                  <div className="text-gray-500 text-sm">{cat.description}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Category Header */}
      {selected && (
        <div className={`rounded-2xl bg-gradient-to-r ${selected.gradient} p-6 mb-8 flex items-center gap-4 shadow`}>
          <div className={`w-14 h-14 flex items-center justify-center rounded-xl ${selected.color}`}>
            {selected.icon && <selected.icon className="w-8 h-8 text-white" />}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{selected.label} Management</h3>
            <p className="text-white text-lg">{selected.description}</p>
          </div>
        </div>
      )}

      {/* Form Section */}
      <div className="bg-white rounded-2xl shadow p-8 space-y-8">
        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" /> Change Description
            </label>
            <textarea
              name="changed_description"
              value={form.changed_description}
              onChange={handleChange}
              placeholder="Provide detailed description of the change..."
              className="w-full rounded-xl border border-gray-200 p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <ClipboardCheck className="w-4 h-4" /> Action Taken
            </label>
            <textarea
              name="action_taken"
              value={form.action_taken}
              onChange={handleChange}
              placeholder="Describe the actions taken..."
              className="w-full rounded-xl border border-gray-200 p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <ListChecks className="w-4 h-4" /> Change Category
            </label>
            <select
              name="change_category"
              value={form.change_category}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select category...</option>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap- mb-">
              <Flag className="w-4 h-4" /> Set-Up Approval
            </label>
            <input
              type="checkbox"
              name="set_up_approval"
              checked={form.set_up_approval}
              onChange={handleChange}
              className="w-6 h-6"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" /> Retroactive Inspection
            </label>
            <input
              type="checkbox"
              name="retroactive_inspection"
              checked={form.retroactive_inspection}
              onChange={handleChange}
              className="w-6 h-6"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap- mb-2">
              <User className="w-4 h-4" /> Suspected Lot Check
            </label>
            <input
              type="checkbox"
              name="suspected_lot_check"
              checked={form.suspected_lot_check}
              onChange={handleChange}
              className="w-6 h-6"
            />
          </div>
        </div></div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4" /> Remarks
          </label>
          <input
            type="text"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            placeholder="Any remarks..."
            className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* Date Field */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" /> Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className=" rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8 border-t pt-6">
          {/* <button
            type="button"
            className="flex items-center gap-2 border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50"
            tabIndex={-1}
          >
            <Paperclip className="w-4 h-4" /> Attach Files
          </button>
          <button
            type="button"
            className="flex items-center gap-2 border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50"
            tabIndex={-1}
          >
            <Eye className="w-4 h-4" /> Preview
          </button> */}
          <div className="flex-1"></div>
          <button
            type="button"
            onClick={() => setForm({ ...initialState, four_m: selectedCategory })}
            className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Clear Form
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`bg-gradient-to-r ${selected?.gradient} text-white px-8 py-2 rounded-lg font-semibold flex items-center gap-2`}
          >
            <Send className="w-4 h-4" /> Submit Changes
          </button>
        </div>
        {message && (
          <div className={`mt-4 ${message.startsWith('❌') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </div>
        )}
      </div>

      {/* Submitted Details Button */}
      <div className="mt-8">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700"
          onClick={() => setShowList(!showList)}
        >
          4M Change Management
        </button>
      </div>

      {/* Show Table Below Button */}
      {showList && (
        <div className="mt-8">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow">
              <thead>
                <tr>
                  <th className="p-3 text-left">S.No</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">4M</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Action</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Set-Up Approval</th>
                  <th className="p-3 text-left">Retroactive Inspection</th>
                  <th className="p-3 text-left">Suspected Lot Check</th>
                  <th className="p-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {changeList.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center text-gray-400 py-6">
                      No records found.
                    </td>
                  </tr>
                )}
                {changeList.map((item: any, idx: number) => (
                  <tr key={item.id || idx}>
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3">
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="p-3">
                      {changeCategories.find(c => c.name === item.four_m)?.label || item.four_m}
                    </td>
                    <td className="p-3">{item.changed_description}</td>
                    <td className="p-3">{item.action_taken}</td>
                    <td className="p-3">{item.change_category}</td>
                    <td className="p-3">{item.set_up_approval ? 'Yes' : 'No'}</td>
                    <td className="p-3">{item.retroactive_inspection ? 'Yes' : 'No'}</td>
                    <td className="p-3">{item.suspected_lot_check ? 'Yes' : 'No'}</td>
                    <td className="p-3">{item.remarks}</td>
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


