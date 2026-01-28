// import { useState, useEffect } from 'react';
// // import manimg from '../../assets/Images/man.jpg'
// import manimg from '../../assets/Images/man1.png'
// // import machineimg from '../../assets/Images/machine.jpg'
// import machineimg from '../../assets/Images/machine1.png'
// import materialimg from '../../assets/Images/meterial22.png'
// // import materialimg from '../../assets/Images/material1.jpg'
// // import methodimg from '../../assets/Images/method.jpg'
// import methodimg from '../../assets/Images/method2.png'
// import GraphicalMonitoring4MChart from '../GraphicalMonitoring4MChart/GraphicalMonitoring4MChart';

// // Define TypeScript interfaces for data structures
// interface FourMStatus {
//   status: 'change' | 'no-change';
//   image: string;
// }

// interface FourMData {
//   MAN: FourMStatus;
//   MACHINE: FourMStatus;
//   MATERIAL: FourMStatus;
//   METHOD: FourMStatus;
//   [key: string]: FourMStatus; // Index signature for dynamic access
// }

// interface ActionPlanItem {
//   mcNo: string;
//   partNo: string;
//   changeType: 'Man' | 'Machine' | 'Material' | 'Method';
//   actionTaken: string;
//   resp: string;
//   targetDate: string;
//   status: 'Completed' | 'In Progress' | 'Pending';
//   location: string;
//   shopFloor: string;
//   line: string;
//   machine: string;
// }

// // Helper function to generate random action plan items
// const generateRandomActionItems = (location: any, shopFloor: any, line: any, machine: any, count = 5) => {
//   const changeTypes: ('Man' | 'Machine' | 'Material' | 'Method')[] = ['Man', 'Machine', 'Material', 'Method'];
//   const statuses: ('Completed' | 'In Progress' | 'Pending')[] = ['Completed', 'In Progress', 'Pending'];
//   const actions = [
//     'Training provided', 'Preventive maintenance', 'Quality check improved',
//     'Process standardized', 'New supplier onboarded', 'Equipment calibrated',
//     'Software updated', 'SOP revised', 'Inspection criteria updated',
//     'Ergonomic improvements', 'Visual management implemented', 'Error-proofing added',
//     'Skill matrix updated', 'Cross-training completed', 'Material testing enhanced'
//   ];
//   const names = [
//     'John', 'Sarah', 'Mike', 'Emma', 'Robert', 'Chris', 'Kate', 'David',
//     'Lisa', 'James', 'Anna', 'Tom', 'Jessica', 'Daniel', 'Laura'
//   ];

//   // Generate random items
//   return Array.from({ length: count }, (_, i) => {
//     const mcNumber = Math.floor(1000 + Math.random() * 9000);
//     const partNumber = `P${Math.floor(100 + Math.random() * 900)}`;
//     const changeType = changeTypes[Math.floor(Math.random() * changeTypes.length)];
//     const action = actions[Math.floor(Math.random() * actions.length)];
//     const name = names[Math.floor(Math.random() * names.length)];
//     const status = statuses[Math.floor(Math.random() * statuses.length)];

//     // Generate a random date in the next 30 days
//     const today = new Date();
//     const futureDate = new Date(today);
//     futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30));
//     const targetDate = futureDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

//     return {
//       mcNo: `MC${mcNumber}`,
//       partNo: partNumber,
//       changeType,
//       actionTaken: `${action} for ${changeType.toLowerCase()}`,
//       resp: name,
//       targetDate,
//       status,
//       location,
//       shopFloor,
//       line,
//       machine
//     };
//   });
// };

// // Component for the 4M Card
// const FourMCard: React.FC<{ title: keyof FourMData; status: FourMStatus; image: string }> = ({ title, status, image }) => {
//   const isChange = status.status === 'change';
  
//   // Dynamic color classes for 'Change' status
//   const changeStatusColor = isChange ? 'bg-red-600' : 'bg-gray-200';
//   const changeStatusRing = isChange ? 'ring-red-300' : 'ring-gray-100';
//   const noChangeStatusColor = !isChange ? 'bg-green-600' : 'bg-gray-200';
//   const noChangeStatusRing = !isChange ? 'ring-green-300' : 'ring-gray-100';

//   return (
//     // <div className="flex flex-col bg-white rounded-xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl">
//     <div className="flex flex-col overflow-hidden transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl">
//       <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-extrabold p-3 text-center text-xl tracking-wider uppercase">
//         {title}
//       </div>
//       <div className="p-3 flex flex-col items-center">
//         <img 
//           src={image} 
//           alt={title as string} // FIX: Cast to string to resolve TS2322 error
//           className="w-full h-40 object-cover rounded-lg shadow-md mb-3" 
//         />
        
//         {/* Status Indicators */}
//         <div className="w-full space-y-2">
//           <div className="flex items-center justify-between p-2 rounded-lg border border-gray-200 transition duration-150 ease-in-out hover:bg-gray-50">
//             <span className="font-semibold text-gray-700">Change</span>
//             <div className={`w-8 h-8 rounded-full shadow-inner flex items-center justify-center ring-4 ${changeStatusColor} ${changeStatusRing}`}>
//               <div className={`w-4 h-4 rounded-full ${isChange ? 'bg-white' : 'bg-gray-400'}`}></div>
//             </div>
//           </div>

//           <div className="flex items-center justify-between p-2 rounded-lg border border-gray-200 transition duration-150 ease-in-out hover:bg-gray-50">
//             <span className="font-semibold text-gray-700">No Change</span>
//             <div className={`w-8 h-8 rounded-full shadow-inner flex items-center justify-center ring-4 ${noChangeStatusColor} ${noChangeStatusRing}`}>
//               <div className={`w-4 h-4 rounded-full ${!isChange ? 'bg-white' : 'bg-gray-400'}`}></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// const ChangeDisplayBoard = () => {
//   // State for dropdown selections
//   const [location, setLocation] = useState('Manesar');
//   const [shopFloor, setShopFloor] = useState('Floor 1');
//   const [line, setLine] = useState('Line 1');
//   const [machine, setMachine] = useState('Machine 1');

//   // State for the 4M data with random initial values
//   const [data, setData] = useState<FourMData>({
//     MAN: {
//       status: Math.random() > 0.5 ? 'change' : 'no-change',
//       image: manimg
//     },
//     MACHINE: {
//       status: Math.random() > 0.5 ? 'change' : 'no-change',
//       image: machineimg
//     },
//     MATERIAL: {
//       status: Math.random() > 0.5 ? 'change' : 'no-change',
//       image: materialimg
//     },
//     METHOD: {
//       status: Math.random() > 0.5 ? 'change' : 'no-change',
//       image: methodimg
//     }
//   });

//   // Initialize with random action plan for current selection
//   const [actionPlan, setActionPlan] = useState<ActionPlanItem[]>(
//     generateRandomActionItems(location, shopFloor, line, machine)
//   );

//   // Generate new random data and action plan items when selections change
//   useEffect(() => {
//     console.log(`Generating random data for ${location}, ${shopFloor}, ${line}, ${machine}`);

//     // Create a new data object with random status values
//     const newData: FourMData = {
//       MAN: {
//         status: Math.random() > 0.5 ? 'change' : 'no-change',
//         image: manimg
//       },
//       MACHINE: {
//         status: Math.random() > 0.5 ? 'change' : 'no-change',
//         image: machineimg
//       },
//       MATERIAL: {
//         status: Math.random() > 0.5 ? 'change' : 'no-change',
//         image: materialimg
//       },
//       METHOD: {
//         status: Math.random() > 0.5 ? 'change' : 'no-change',
//         image: methodimg
//       }
//     };

//     // Update the data state with random values
//     setData(newData);

//     // Generate new random action items for the current selection
//     const itemCount = Math.floor(3 + Math.random() * 5); // Random number between 3-7 items
//     const newActionItems = generateRandomActionItems(location, shopFloor, line, machine, itemCount);

//     // Update the action plan state
//     setActionPlan(prevPlan => {
//       // Filter out items for the current selection to replace them
//       const otherItems = prevPlan.filter(item =>
//         item.location !== location ||
//         item.shopFloor !== shopFloor ||
//         item.line !== line ||
//         item.machine !== machine
//       );

//       // Return combined items
//       return [...otherItems, ...newActionItems];
//     });
//   }, [location, shopFloor, line, machine]);

//   // Filter action plan based on selected filters
//   const filteredActionPlan = actionPlan.filter(item =>
//     item.location === location &&
//     item.shopFloor === shopFloor &&
//     item.line === line &&
//     item.machine === machine
//   );

//   // Helper function for status badge styling
//   const getStatusBadge = (status: ActionPlanItem['status']) => {
//     let colorClass = '';
//     switch (status) {
//       case 'Completed':
//         colorClass = 'bg-green-100 text-green-800';
//         break;
//       case 'In Progress':
//         colorClass = 'bg-blue-100 text-blue-800';
//         break;
//       case 'Pending':
//         colorClass = 'bg-red-100 text-red-800';
//         break;
//       default:
//         colorClass = 'bg-gray-100 text-gray-800';
//     }
//     return (
//       <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
//         {status}
//       </span>
//     );
//   };
  
//   // Helper function for change type pill styling
//   const getChangeTypePill = (changeType: ActionPlanItem['changeType']) => {
//     let colorClass = '';
//     switch (changeType) {
//       case 'Man':
//         colorClass = 'bg-yellow-200 text-yellow-800';
//         break;
//       case 'Machine':
//         colorClass = 'bg-purple-200 text-purple-800';
//         break;
//       case 'Material':
//         colorClass = 'bg-cyan-200 text-cyan-800';
//         break;
//       case 'Method':
//         colorClass = 'bg-pink-200 text-pink-800';
//         break;
//       default:
//         colorClass = 'bg-gray-200 text-gray-800';
//     }
//     return (
//       <span className={`px-2 py-0.5 text-xs font-medium rounded-lg ${colorClass}`}>
//         {changeType}
//       </span>
//     );
//   };


//   return (
//     <div className="flex flex-col min-h-screen w-full p-6">
//       {/* Main Container with Shadow and Rounded Corners */}
//       <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-8">
        
//         {/* Header and Dropdowns Section */}
//         <header className="border-b-4 border-blue-500 pb-4">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <h1 className="text-3xl font-extrabold text-gray-800 mb-4 md:mb-0 tracking-tight">
//               🏭 4M CHANGE DISPLAY BOARD
//             </h1>
            
//             {/* Dropdown Filters */}
//             <div className="flex flex-wrap gap-4 items-end">
//               {/* Dropdown Structure Refinement */}
//               {[
//                 { label: 'Location', value: location, setter: setLocation, options: ['Manesar', 'Nimrana', 'Bhawal'] },
//                 { label: 'Shop Floor', value: shopFloor, setter: setShopFloor, options: ['Floor 1', 'Floor 2', 'Floor 3'] },
//                 { label: 'Line', value: line, setter: setLine, options: ['Line 1', 'Line 2', 'Line 3'] },
//                 { label: 'Machine', value: machine, setter: setMachine, options: ['Machine 1', 'Machine 2', 'Machine 3'] },
//               ].map(({ label, value, setter, options }) => (
//                 <div key={label} className="flex flex-col min-w-[120px]">
//                   <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
//                   <select
//                     className="border border-gray-300 rounded-lg p-2 text-gray-700 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
//                     value={value}
//                     onChange={(e) => setter(e.target.value)}
//                   >
//                     {options.map(option => (
//                       <option key={option} value={option}>{option}</option>
//                     ))}
//                   </select>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </header>
        
//         {/* --- */}

//         {/* 4M Display Grid */}
//         <section>
//           <h2 className="text-2xl font-bold text-gray-700 mb-4 border-l-4 border-yellow-500 pl-3">4M Change Status Overview</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <FourMCard title="MAN" status={data.MAN} image={manimg} />
//             <FourMCard title="MACHINE" status={data.MACHINE} image={machineimg} />
//             <FourMCard title="MATERIAL" status={data.MATERIAL} image={materialimg} />
//             <FourMCard title="METHOD" status={data.METHOD} image={methodimg} />
//           </div>
//         </section>
        
//         {/* --- */}
        
//         {/* Action Plan Table */}
//         <section>
//           <h2 className="text-2xl font-bold text-gray-700 mb-4 border-l-4 border-red-500 pl-3">Action Plan for 4M Changes</h2>
//           <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">M/C No.</th>
//                   <th className="px-6 py- text-left text-xs font-semibold uppercase tracking-wider">Part No.</th>
//                   <th className="px-6 py- text-left text-xs font-semibold uppercase tracking-wider">Change Type</th>
//                   <th className="px-6 py- text-left text-xs font-semibold uppercase tracking-wider">Action Taken</th>
//                   <th className="px-6 py- text-left text-xs font-semibold uppercase tracking-wider">Resp.</th>
//                   <th className="px-6 py- text-left text-xs font-semibold uppercase tracking-wider">Target Date</th>
//                   <th className="px-6 py- text-left text-xs font-semibold uppercase tracking-wider">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredActionPlan.length > 0 ? (
//                   filteredActionPlan.map((item, index) => (
//                     <tr key={index} className="hover:bg-blue-50 transition duration-150">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.mcNo}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.partNo}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         {getChangeTypePill(item.changeType)}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.actionTaken}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.resp}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.targetDate}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         {getStatusBadge(item.status)}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-10 text-center text-lg text-gray-500">
//                       🎉 All clear! No open action items for the selected area.
//                     </td>
//                   </tr>
//                 )}
//                 {/* Empty rows for consistent table height (5 rows visible if no data) */}
//                 {Array.from({ length: Math.max(0, 5 - filteredActionPlan.length) }).map((_, index) => (
//                   <tr key={`empty-${index}`}>
//                     <td colSpan={7} className="px-6 py-4 text-gray-200 text-center">...</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>
        
//         {/* --- */}

//         {/* Optional Graphical Chart Section (uncomment if GraphicalMonitoring4MChart is implemented) */}
//         {/* <section>
//           <h2 className="text-2xl font-bold text-gray-700 mb-4 border-l-4 border-green-500 pl-3">4M Change Trend Monitoring</h2>
//           <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
//             <GraphicalMonitoring4MChart />
//           </div>
//         </section> */}

//       </div>
//     </div>
//   );
// };

// export default ChangeDisplayBoard;






// import { useState, useEffect } from 'react';
// import manimg from '../../assets/Images/man1.png';
// import machineimg from '../../assets/Images/machine1.png';
// import materialimg from '../../assets/Images/meterial22.png';
// import methodimg from '../../assets/Images/method2.png';

// // ────────────────────────────────────────────────
// // Interfaces
// // ────────────────────────────────────────────────

// interface FourMStatus {
//   status: 'change' | 'no-change';
//   image: string;
// }

// interface FourMData {
//   MAN: FourMStatus;
//   MACHINE: FourMStatus;
//   MATERIAL: FourMStatus;
//   METHOD: FourMStatus;
// }

// interface ChangeRecord {
//   id: number;
//   record_id?: string;
//   date: string;
//   time?: string;
//   shift: string;
//   four_m: string; // Flexible string from API (e.g., "Man", "Machine/Tool", etc.)
//   shopfloor: number;
//   shopfloor_name?: string;
//   line: number;
//   line_name?: string;
//   station: number;
//   station_name?: string;
//   category_details?: { category_type?: string };
//   action_details?: any;
// }

// interface Shopfloor {
//   id: number;
//   name: string;
// }

// interface Line {
//   id: number;
//   name: string;
// }

// interface Station {
//   id: number;
//   name: string;
// }

// // ────────────────────────────────────────────────
// // Helper Functions
// // ────────────────────────────────────────────────

// const normalizeFourM = (apiValue: string): keyof FourMData | null => {
//   const lower = apiValue.toLowerCase().trim();
//   if (lower.includes('man')) return 'MAN';
//   if (lower.includes('machine') || lower.includes('tool')) return 'MACHINE';
//   if (lower.includes('material')) return 'MATERIAL';
//   if (lower.includes('method')) return 'METHOD';
//   return null;
// };

// const getImageForFourM = (key: keyof FourMData): string => {
//   switch (key) {
//     case 'MAN': return manimg;
//     case 'MACHINE': return machineimg;
//     case 'MATERIAL': return materialimg;
//     case 'METHOD': return methodimg;
//     default: return manimg;
//   }
// };

// // ────────────────────────────────────────────────
// // FourM Card Component
// // ────────────────────────────────────────────────

// const FourMCard: React.FC<{
//   title: keyof FourMData;
//   status: FourMStatus;
//   image: string;
//   isMostRecent?: boolean;
//   onClick: () => void;
//   count: number;
// }> = ({ title, status, image, isMostRecent = false, onClick, count }) => {
//   const isChange = status.status === 'change';
//   const cardBg = isChange ? 'bg-gradient-to-br from-red-50 to-red-100' : 'bg-gradient-to-br from-green-50 to-green-100';
//   const headerBg = isChange ? 'from-red-600 to-red-500' : 'from-green-600 to-green-500';
//   const ringColor = isChange ? 'ring-red-300' : 'ring-green-300';

//   return (
//     <div
//       onClick={onClick}
//       className={`
//         flex flex-col rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 
//         hover:scale-[1.02] hover:shadow-2xl cursor-pointer
//         border ${isChange ? 'border-red-200' : 'border-green-200'}
//         ${cardBg}
//         ${isMostRecent ? 'ring-4 ring-offset-2 ring-yellow-400 animate-pulse' : ''}
//       `}
//     >
//       <div className={`bg-gradient-to-r ${headerBg} text-white font-bold p-4 text-center text-xl uppercase tracking-wide`}>
//         {title}
//         {count > 0 && <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded-full">{count}</span>}
//       </div>
//       <div className="p-4 flex flex-col items-center flex-1">
//         <img 
//           src={image} 
//           alt={title as string} 
//           className="w-full h-40 object-cover rounded-lg shadow-md mb-3" 
//         />
        
//         {/* Status Indicators */}
//         <div className="w-full space-y-2">
//           <div className="flex items-center justify-between p-2 rounded-lg border border-gray-200 transition duration-150 ease-in-out hover:bg-gray-50">
//             <span className="font-semibold text-gray-700">Change</span>
//             <div className={`w-8 h-8 rounded-full shadow-inner flex items-center justify-center ring-4 ${isChange ? 'bg-red-600 ring-red-300' : 'bg-gray-200 ring-gray-100'}`}>
//               <div className={`w-4 h-4 rounded-full ${isChange ? 'bg-white' : 'bg-gray-400'}`}></div>
//             </div>
//           </div>

//           <div className="flex items-center justify-between p-2 rounded-lg border border-gray-200 transition duration-150 ease-in-out hover:bg-gray-50">
//             <span className="font-semibold text-gray-700">No Change</span>
//             <div className={`w-8 h-8 rounded-full shadow-inner flex items-center justify-center ring-4 ${!isChange ? 'bg-green-600 ring-green-300' : 'bg-gray-200 ring-gray-100'}`}>
//               <div className={`w-4 h-4 rounded-full ${!isChange ? 'bg-white' : 'bg-gray-400'}`}></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ────────────────────────────────────────────────
// // Main Component
// // ────────────────────────────────────────────────

// const ChangeDisplayBoard: React.FC = () => {
//   // Filter states
//   const [shopFloor, setShopFloor] = useState<string>('');
//   const [line, setLine] = useState<string>('');
//   const [station, setStation] = useState<string>('');

//   // Dropdown data
//   const [shopfloors, setShopfloors] = useState<Shopfloor[]>([]);
//   const [lines, setLines] = useState<Line[]>([]);
//   const [stationsList, setStationsList] = useState<Station[]>([]);

//   // Data states
//   const [changes, setChanges] = useState<ChangeRecord[]>([]);
//   const [loading, setLoading] = useState(true);

//   // 4M states
//   const [fourMData, setFourMData] = useState<FourMData>({
//     MAN: { status: 'no-change', image: manimg },
//     MACHINE: { status: 'no-change', image: machineimg },
//     MATERIAL: { status: 'no-change', image: materialimg },
//     METHOD: { status: 'no-change', image: methodimg },
//   });
//   const [mostRecentFourM, setMostRecentFourM] = useState<keyof FourMData | null>(null);

//   // Click to view state
//   const [selectedFourM, setSelectedFourM] = useState<keyof FourMData | null>(null);
//   const [filteredChangesForFourM, setFilteredChangesForFourM] = useState<ChangeRecord[]>([]);

//   // Load shopfloors
//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/api/shopfloors/')
//       .then(res => res.json())
//       .then((data: Shopfloor[]) => setShopfloors(data))
//       .catch(() => setShopfloors([]));
//   }, []);

//   // Load lines based on shopfloor
//   useEffect(() => {
//     if (!shopFloor) {
//       setLines([]);
//       setStationsList([]);
//       setLine('');
//       setStation('');
//       return;
//     }
//     const selectedSf = shopfloors.find(sf => sf.name.toLowerCase() === shopFloor.toLowerCase());
//     if (!selectedSf) return;

//     fetch(`http://127.0.0.1:8000/api/lines/?shopfloor=${selectedSf.id}`)
//       .then(res => res.json())
//       .then((data: Line[]) => setLines(data))
//       .catch(() => setLines([]));
//   }, [shopFloor, shopfloors]);

//   // Load stations based on line
//   useEffect(() => {
//     if (!line) {
//       setStationsList([]);
//       setStation('');
//       return;
//     }
//     const selectedLn = lines.find(l => l.name.toLowerCase() === line.toLowerCase());
//     if (!selectedLn) return;

//     fetch(`http://127.0.0.1:8000/api/stations/?line=${selectedLn.id}`)
//       .then(res => res.json())
//       .then((data: Station[]) => setStationsList(data))
//       .catch(() => setStationsList([]));
//   }, [line, lines]);

//   // Load all changes
//   useEffect(() => {
//     setLoading(true);
//     fetch('http://127.0.0.1:8000/api/4m-changes/')
//       .then(res => res.json())
//       .then((data: ChangeRecord[]) => {
//         // Sort by date descending (newest first)
//         data.sort((a, b) => {
//           const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
//           const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
//           return dateB - dateA;
//         });
//         setChanges(data);
//       })
//       .catch(err => {
//         console.error('Failed to load changes:', err);
//         setChanges([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   // Compute 4M status and counts
//   useEffect(() => {
//     if (changes.length === 0) {
//       setFourMData({
//         MAN: { status: 'no-change', image: manimg },
//         MACHINE: { status: 'no-change', image: machineimg },
//         MATERIAL: { status: 'no-change', image: materialimg },
//         METHOD: { status: 'no-change', image: methodimg },
//       });
//       setMostRecentFourM(null);
//       return;
//     }

//     // Flexible filtering
//     const sfLower = shopFloor.toLowerCase().trim();
//     const lineLower = line.toLowerCase().trim();
//     const stationLower = station.toLowerCase().trim();

//     const relevantChanges = changes.filter(record => {
//       const shopMatch = !sfLower || 
//         (record.shopfloor_name?.toLowerCase().trim().includes(sfLower)) ||
//         String(record.shopfloor).includes(sfLower);
      
//       const lineMatch = !lineLower || 
//         (record.line_name?.toLowerCase().trim().includes(lineLower)) ||
//         String(record.line).includes(lineLower);

//       const stationMatch = !stationLower || 
//         (record.station_name?.toLowerCase().trim().includes(stationLower)) ||
//         String(record.station).includes(stationLower);

//       return shopMatch && lineMatch && stationMatch;
//     });

//     // Count changes per 4M
//     const counts: Record<keyof FourMData, number> = {
//       MAN: 0, MACHINE: 0, MATERIAL: 0, METHOD: 0
//     };

//     relevantChanges.forEach(record => {
//       const normalized = normalizeFourM(record.four_m);
//       if (normalized) counts[normalized]++;
//     });

//     // Update status
//     const newData: FourMData = {
//       MAN: { status: counts.MAN > 0 ? 'change' : 'no-change', image: getImageForFourM('MAN') },
//       MACHINE: { status: counts.MACHINE > 0 ? 'change' : 'no-change', image: getImageForFourM('MACHINE') },
//       MATERIAL: { status: counts.MATERIAL > 0 ? 'change' : 'no-change', image: getImageForFourM('MATERIAL') },
//       METHOD: { status: counts.METHOD > 0 ? 'change' : 'no-change', image: getImageForFourM('METHOD') },
//     };

//     setFourMData(newData);

//     // Set most recent
//     if (relevantChanges.length > 0) {
//       const newest = relevantChanges[0];
//       const recentKey = normalizeFourM(newest.four_m);
//       setMostRecentFourM(recentKey);
//     } else {
//       setMostRecentFourM(null);
//     }
//   }, [changes, shopFloor, line, station]);

//   // Handle card click to show details
//   const handleCardClick = (key: keyof FourMData) => {
//     setSelectedFourM(prev => prev === key ? null : key);

//     if (selectedFourM !== key) {
//       // Filter changes for this specific 4M
//       const fourMValue = {
//         MAN: 'Man',
//         MACHINE: 'Machine/Tool',
//         MATERIAL: 'Material',
//         METHOD: 'Method'
//       }[key] || '';

//       const sfLower = shopFloor.toLowerCase().trim();
//       const lineLower = line.toLowerCase().trim();
//       const stationLower = station.toLowerCase().trim();

//       const filtered = changes.filter(record => {
//         const isMatchingFourM = record.four_m.toLowerCase().includes(fourMValue.toLowerCase());
//         const shopMatch = !sfLower || (record.shopfloor_name?.toLowerCase().trim().includes(sfLower));
//         const lineMatch = !lineLower || (record.line_name?.toLowerCase().trim().includes(lineLower));
//         const stationMatch = !stationLower || (record.station_name?.toLowerCase().trim().includes(stationLower));

//         return isMatchingFourM && shopMatch && lineMatch && stationMatch;
//       });

//       setFilteredChangesForFourM(filtered);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-lg text-gray-500">Loading 4M Change Data...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen w-full p-6 bg-gray-50">
//       {/* Main Container */}
//       <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-8 max-w-7xl mx-auto">
        
//         {/* Header and Dropdowns */}
//         <header className="border-b-4 border-blue-500 pb-4">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <h1 className="text-3xl font-extrabold text-gray-800 mb-4 md:mb-0 tracking-tight">
//               🏭 4M CHANGE DISPLAY BOARD
//             </h1>
            
//             {/* Dropdown Filters */}
//             <div className="flex flex-wrap gap-4 items-end">
//               {[
//                 { label: 'Shop Floor', value: shopFloor, setter: setShopFloor, options: shopfloors.map(sf => sf.name), disabled: false },
//                 { label: 'Line', value: line, setter: setLine, options: lines.map(l => l.name), disabled: !shopFloor },
//                 { label: 'Station', value: station, setter: setStation, options: stationsList.map(s => s.name), disabled: !line },
//               ].map(({ label, value, setter, options, disabled }) => (
//                 <div key={label} className="flex flex-col min-w-[140px]">
//                   <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
//                   <select
//                     className="border border-gray-300 rounded-lg p-2 text-gray-700 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out disabled:opacity-50"
//                     value={value}
//                     onChange={(e) => setter(e.target.value)}
//                     disabled={disabled}
//                   >
//                     <option value="">{`Select ${label.toLowerCase()}...`}</option>
//                     {options.map(option => (
//                       <option key={option} value={option}>{option}</option>
//                     ))}
//                   </select>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </header>
        
//         {/* 4M Display Grid */}
//         <section>
//           <h2 className="text-2xl font-bold text-gray-700 mb-4 border-l-4 border-yellow-500 pl-3">4M Change Status Overview</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {(['MAN', 'MACHINE', 'MATERIAL', 'METHOD'] as (keyof FourMData)[]).map(key => {
//               const status = fourMData[key];
//               const count = changes.filter(c => {
//                 const normalized = normalizeFourM(c.four_m);
//                 const sfMatch = !shopFloor || (c.shopfloor_name?.toLowerCase().includes(shopFloor.toLowerCase()));
//                 const lineMatch = !line || (c.line_name?.toLowerCase().includes(line.toLowerCase()));
//                 const stationMatch = !station || (c.station_name?.toLowerCase().includes(station.toLowerCase()));
//                 return normalized === key && sfMatch && lineMatch && stationMatch;
//               }).length;

//               return (
//                 <FourMCard
//                   key={key}
//                   title={key}
//                   status={status}
//                   image={status.image}
//                   isMostRecent={mostRecentFourM === key}
//                   onClick={() => handleCardClick(key)}
//                   count={count}
//                 />
//               );
//             })}
//           </div>
//         </section>
        
//         {/* Clicked 4M Details Table */}
//         {selectedFourM && (
//           <section>
//             <h2 className="text-2xl font-bold text-gray-700 mb-4 border-l-4 border-red-500 pl-3">
//               {selectedFourM} Change Details
//               <button 
//                 onClick={() => setSelectedFourM(null)} 
//                 className="ml-4 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
//               >
//                 Close
//               </button>
//             </h2>
//             <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Time</th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Shift</th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Shopfloor</th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Line</th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Station</th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category Type</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredChangesForFourM.length > 0 ? (
//                     filteredChangesForFourM.map((item, index) => (
//                       <tr key={index} className="hover:bg-blue-50 transition duration-150">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.record_id || item.id}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Shift {item.shift}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.shopfloor_name}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.line_name}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.station_name}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                             item.category_details?.category_type === 'Planned' ? 'bg-green-100 text-green-800' :
//                             item.category_details?.category_type === 'Unplanned' ? 'bg-yellow-100 text-yellow-800' :
//                             'bg-red-100 text-red-800'
//                           }`}>
//                             {item.category_details?.category_type || 'Unknown'}
//                           </span>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={8} className="px-6 py-10 text-center text-lg text-gray-500">
//                         No {selectedFourM.toLowerCase()} changes found for the selected area.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         )}

//       </div>
//     </div>
//   );
// };

// export default ChangeDisplayBoard;


import { useState, useEffect, useMemo } from 'react';
import manimg from '../../assets/Images/man1.png';
import machineimg from '../../assets/Images/machine1.png';
import materialimg from '../../assets/Images/meterial22.png';
import methodimg from '../../assets/Images/method2.png';

// ────────────────────────────────────────────────
// Interfaces
// ────────────────────────────────────────────────

interface FourMStatus {
  status: 'change' | 'no-change';
  image: string;
}

interface FourMData {
  MAN: FourMStatus;
  MACHINE: FourMStatus;
  MATERIAL: FourMStatus;
  METHOD: FourMStatus;
}

interface ChangeRecord {
  id: number;
  record_id?: string;
  date: string;
  time?: string;
  shift: string;
  four_m: string;
  shopfloor: number;
  shopfloor_name?: string;
  line: number;
  line_name?: string;
  station: number;
  station_name?: string;
  category_details?: { category_type?: string };
  action_details?: any;
}

interface Shopfloor {
  id: number;
  name: string;
}

interface Line {
  id: number;
  name: string;
}

interface Station {
  id: number;
  name: string;
}

// ────────────────────────────────────────────────
// Helper Functions
// ────────────────────────────────────────────────

const normalizeFourM = (apiValue: string): keyof FourMData | null => {
  const lower = apiValue.toLowerCase().trim();
  if (lower.includes('man')) return 'MAN';
  if (lower.includes('machine') || lower.includes('tool')) return 'MACHINE';
  if (lower.includes('material')) return 'MATERIAL';
  if (lower.includes('method')) return 'METHOD';
  return null;
};

const getImageForFourM = (key: keyof FourMData): string => {
  switch (key) {
    case 'MAN': return manimg;
    case 'MACHINE': return machineimg;
    case 'MATERIAL': return materialimg;
    case 'METHOD': return methodimg;
    default: return manimg;
  }
};

const getFourMIcon = (key: keyof FourMData): string => {
  switch (key) {
    case 'MAN': return '👤';
    case 'MACHINE': return '⚙️';
    case 'MATERIAL': return '📦';
    case 'METHOD': return '📋';
    default: return '📌';
  }
};

const getCategoryBadgeStyles = (category?: string): string => {
  switch (category) {
    case 'Planned': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Unplanned': return 'bg-amber-100 text-amber-800 border-amber-200';
    default: return 'bg-rose-100 text-rose-800 border-rose-200';
  }
};

// ────────────────────────────────────────────────
// Icon Components
// ────────────────────────────────────────────────

const TableIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// ────────────────────────────────────────────────
// Pagination Component
// ────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (showEllipsisStart) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (showEllipsisEnd) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
      {/* Items per page selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600">Show</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                     hover:border-slate-400 cursor-pointer shadow-sm"
        >
          {[5, 10, 20, 50, 100].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <span className="text-sm text-slate-600">entries</span>
      </div>

      {/* Page info */}
      <div className="text-sm text-slate-600 font-medium">
        Showing <span className="text-blue-600 font-bold">{startItem}</span> to{' '}
        <span className="text-blue-600 font-bold">{endItem}</span> of{' '}
        <span className="text-blue-600 font-bold">{totalItems}</span> entries
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-slate-600 hover:bg-white hover:shadow-md disabled:opacity-40 
                     disabled:cursor-not-allowed transition-all duration-200"
          title="First page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-slate-600 hover:bg-white hover:shadow-md disabled:opacity-40 
                     disabled:cursor-not-allowed transition-all duration-200"
          title="Previous page"
        >
          <ChevronLeftIcon />
        </button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-semibold transition-all duration-200
                  ${currentPage === page
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'text-slate-600 hover:bg-white hover:shadow-md'
                  }`}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="px-2 text-slate-400 font-medium">...</span>
            )
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-slate-600 hover:bg-white hover:shadow-md disabled:opacity-40 
                     disabled:cursor-not-allowed transition-all duration-200"
          title="Next page"
        >
          <ChevronRightIcon />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-slate-600 hover:bg-white hover:shadow-md disabled:opacity-40 
                     disabled:cursor-not-allowed transition-all duration-200"
          title="Last page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────
// View Toggle Component
// ────────────────────────────────────────────────

interface ViewToggleProps {
  view: 'table' | 'card';
  onViewChange: (view: 'table' | 'card') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => (
  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
    <button
      onClick={() => onViewChange('table')}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
        ${view === 'table'
          ? 'bg-white text-blue-600 shadow-md'
          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
        }`}
    >
      <TableIcon />
      <span className="hidden sm:inline">Table</span>
    </button>
    <button
      onClick={() => onViewChange('card')}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
        ${view === 'card'
          ? 'bg-white text-blue-600 shadow-md'
          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
        }`}
    >
      <CardIcon />
      <span className="hidden sm:inline">Cards</span>
    </button>
  </div>
);

// ────────────────────────────────────────────────
// Change Record Card Component
// ────────────────────────────────────────────────

interface ChangeRecordCardProps {
  record: ChangeRecord;
  index: number;
}

const ChangeRecordCard: React.FC<ChangeRecordCardProps> = ({ record, index }) => {
  const fourMKey = normalizeFourM(record.four_m);
  const categoryType = record.category_details?.category_type || 'Unknown';

  return (
    <div
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-100 
                 overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Card Header */}
      <div className={`p-4 bg-gradient-to-r ${
        fourMKey === 'MAN' ? 'from-blue-500 to-blue-600' :
        fourMKey === 'MACHINE' ? 'from-purple-500 to-purple-600' :
        fourMKey === 'MATERIAL' ? 'from-orange-500 to-orange-600' :
        'from-teal-500 to-teal-600'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getFourMIcon(fourMKey || 'MAN')}</span>
            <div>
              <h3 className="text-white font-bold text-lg">{record.four_m}</h3>
              <p className="text-white/80 text-sm">#{record.record_id || record.id}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryBadgeStyles(categoryType)} bg-white/90`}>
            {categoryType}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        {/* Date & Time */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">{record.date}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{record.time || 'N/A'}</span>
          </div>
        </div>

        {/* Location Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Shopfloor</p>
            <p className="text-sm font-semibold text-slate-700 truncate">{record.shopfloor_name || '-'}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Line</p>
            <p className="text-sm font-semibold text-slate-700 truncate">{record.line_name || '-'}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Station</p>
            <p className="text-sm font-semibold text-slate-700 truncate">{record.station_name || '-'}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Shift</p>
            <p className="text-sm font-semibold text-slate-700">Shift {record.shift}</p>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <button className="w-full py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 
                           hover:bg-blue-50 rounded-lg transition-colors duration-200">
          View Details →
        </button>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────
// FourM Card Component
// ────────────────────────────────────────────────

const FourMCard: React.FC<{
  title: keyof FourMData;
  status: FourMStatus;
  image: string;
  isMostRecent?: boolean;
  isSelected?: boolean;
  onClick: () => void;
  count: number;
}> = ({ title, status, image, isMostRecent = false, isSelected = false, onClick, count }) => {
  const isChange = status.status === 'change';
  
  const gradients = {
    MAN: { change: 'from-red-500 to-rose-600', noChange: 'from-blue-500 to-blue-600' },
    MACHINE: { change: 'from-red-500 to-rose-600', noChange: 'from-purple-500 to-purple-600' },
    MATERIAL: { change: 'from-red-500 to-rose-600', noChange: 'from-orange-500 to-amber-600' },
    METHOD: { change: 'from-red-500 to-rose-600', noChange: 'from-teal-500 to-cyan-600' },
  };

  const headerGradient = isChange ? gradients[title].change : gradients[title].noChange;

  return (
    <div
      onClick={onClick}
      className={`
        relative flex flex-col rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 
        hover:scale-[1.03] hover:shadow-2xl cursor-pointer bg-white
        ${isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : ''}
        ${isMostRecent && isChange ? 'animate-pulse ring-4 ring-yellow-400 ring-offset-2' : ''}
      `}
    >
      {/* Badge for count */}
      {count > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <span className="flex items-center justify-center min-w-[28px] h-7 px-2 bg-white text-slate-800 
                         text-sm font-bold rounded-full shadow-lg border-2 border-slate-200">
            {count}
          </span>
        </div>
      )}

      {/* Most Recent Badge */}
      {isMostRecent && isChange && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-md">
            LATEST
          </span>
        </div>
      )}

      {/* Header */}
      <div className={`bg-gradient-to-r ${headerGradient} text-white font-bold p-5 text-center`}>
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">{getFourMIcon(title)}</span>
          <span className="text-2xl uppercase tracking-wide">{title}</span>
        </div>
      </div>

      {/* Image Section */}
      <div className="p-4">
        <div className="relative rounded-xl overflow-hidden shadow-md group">
          <img 
            src={image} 
            alt={title as string} 
            className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      
      {/* Status Indicators */}
      <div className="px-4 pb-5 space-y-3">
        <div className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300
          ${isChange ? 'bg-red-50 border-2 border-red-200' : 'bg-slate-50 border-2 border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isChange ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className={`font-semibold ${isChange ? 'text-red-700' : 'text-slate-500'}`}>Change</span>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
            ${isChange ? 'bg-red-500 shadow-lg shadow-red-500/30' : 'bg-slate-200'}`}>
            {isChange && (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>

        <div className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300
          ${!isChange ? 'bg-green-50 border-2 border-green-200' : 'bg-slate-50 border-2 border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${!isChange ? 'bg-green-500' : 'bg-slate-300'}`} />
            <span className={`font-semibold ${!isChange ? 'text-green-700' : 'text-slate-500'}`}>No Change</span>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
            ${!isChange ? 'bg-green-500 shadow-lg shadow-green-500/30' : 'bg-slate-200'}`}>
            {!isChange && (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Click indicator */}
      <div className="px-4 pb-4">
        <div className="text-center text-sm text-slate-400 font-medium">
          Click to view details
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────
// Loading Skeleton Component
// ────────────────────────────────────────────────

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto" />
        <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 mx-auto absolute top-4 left-1/2 -translate-x-1/2" style={{ animationDirection: 'reverse' }} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-700">Loading 4M Change Data</h2>
        <p className="text-slate-500">Please wait while we fetch the latest information...</p>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────

const ChangeDisplayBoard: React.FC = () => {
  // Filter states
  const [shopFloor, setShopFloor] = useState<string>('');
  const [line, setLine] = useState<string>('');
  const [station, setStation] = useState<string>('');

  // Dropdown data
  const [shopfloors, setShopfloors] = useState<Shopfloor[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [stationsList, setStationsList] = useState<Station[]>([]);

  // Data states
  const [changes, setChanges] = useState<ChangeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 4M states
  const [fourMData, setFourMData] = useState<FourMData>({
    MAN: { status: 'no-change', image: manimg },
    MACHINE: { status: 'no-change', image: machineimg },
    MATERIAL: { status: 'no-change', image: materialimg },
    METHOD: { status: 'no-change', image: methodimg },
  });
  const [mostRecentFourM, setMostRecentFourM] = useState<keyof FourMData | null>(null);

  // View states
  const [selectedFourM, setSelectedFourM] = useState<keyof FourMData | null>(null);
  const [filteredChangesForFourM, setFilteredChangesForFourM] = useState<ChangeRecord[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Pagination calculations
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredChangesForFourM.slice(startIndex, endIndex);
  }, [filteredChangesForFourM, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredChangesForFourM.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredChangesForFourM, itemsPerPage]);

  // Load shopfloors
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/shopfloors/')
      .then(res => res.json())
      .then((data: Shopfloor[]) => setShopfloors(data))
      .catch(() => setShopfloors([]));
  }, []);

  // Load lines based on shopfloor
  useEffect(() => {
    if (!shopFloor) {
      setLines([]);
      setStationsList([]);
      setLine('');
      setStation('');
      return;
    }
    const selectedSf = shopfloors.find(sf => sf.name.toLowerCase() === shopFloor.toLowerCase());
    if (!selectedSf) return;

    fetch(`http://127.0.0.1:8000/api/lines/?shopfloor=${selectedSf.id}`)
      .then(res => res.json())
      .then((data: Line[]) => setLines(data))
      .catch(() => setLines([]));
  }, [shopFloor, shopfloors]);

  // Load stations based on line
  useEffect(() => {
    if (!line) {
      setStationsList([]);
      setStation('');
      return;
    }
    const selectedLn = lines.find(l => l.name.toLowerCase() === line.toLowerCase());
    if (!selectedLn) return;

    fetch(`http://127.0.0.1:8000/api/stations/?line=${selectedLn.id}`)
      .then(res => res.json())
      .then((data: Station[]) => setStationsList(data))
      .catch(() => setStationsList([]));
  }, [line, lines]);

  // Load all changes
  const loadChanges = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/4m-changes/')
      .then(res => res.json())
      .then((data: ChangeRecord[]) => {
        data.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
          const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
          return dateB - dateA;
        });
        setChanges(data);
      })
      .catch(err => {
        console.error('Failed to load changes:', err);
        setChanges([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadChanges();
  }, []);

  // Compute 4M status and counts
  useEffect(() => {
    if (changes.length === 0) {
      setFourMData({
        MAN: { status: 'no-change', image: manimg },
        MACHINE: { status: 'no-change', image: machineimg },
        MATERIAL: { status: 'no-change', image: materialimg },
        METHOD: { status: 'no-change', image: methodimg },
      });
      setMostRecentFourM(null);
      return;
    }

    const sfLower = shopFloor.toLowerCase().trim();
    const lineLower = line.toLowerCase().trim();
    const stationLower = station.toLowerCase().trim();

    const relevantChanges = changes.filter(record => {
      const shopMatch = !sfLower || 
        (record.shopfloor_name?.toLowerCase().trim().includes(sfLower)) ||
        String(record.shopfloor).includes(sfLower);
      
      const lineMatch = !lineLower || 
        (record.line_name?.toLowerCase().trim().includes(lineLower)) ||
        String(record.line).includes(lineLower);

      const stationMatch = !stationLower || 
        (record.station_name?.toLowerCase().trim().includes(stationLower)) ||
        String(record.station).includes(stationLower);

      return shopMatch && lineMatch && stationMatch;
    });

    const counts: Record<keyof FourMData, number> = {
      MAN: 0, MACHINE: 0, MATERIAL: 0, METHOD: 0
    };

    relevantChanges.forEach(record => {
      const normalized = normalizeFourM(record.four_m);
      if (normalized) counts[normalized]++;
    });

    const newData: FourMData = {
      MAN: { status: counts.MAN > 0 ? 'change' : 'no-change', image: getImageForFourM('MAN') },
      MACHINE: { status: counts.MACHINE > 0 ? 'change' : 'no-change', image: getImageForFourM('MACHINE') },
      MATERIAL: { status: counts.MATERIAL > 0 ? 'change' : 'no-change', image: getImageForFourM('MATERIAL') },
      METHOD: { status: counts.METHOD > 0 ? 'change' : 'no-change', image: getImageForFourM('METHOD') },
    };

    setFourMData(newData);

    if (relevantChanges.length > 0) {
      const newest = relevantChanges[0];
      const recentKey = normalizeFourM(newest.four_m);
      setMostRecentFourM(recentKey);
    } else {
      setMostRecentFourM(null);
    }
  }, [changes, shopFloor, line, station]);

  // Handle card click
  const handleCardClick = (key: keyof FourMData) => {
    setSelectedFourM(prev => prev === key ? null : key);
    setCurrentPage(1);

    if (selectedFourM !== key) {
      const fourMValue = {
        MAN: 'Man',
        MACHINE: 'Machine/Tool',
        MATERIAL: 'Material',
        METHOD: 'Method'
      }[key] || '';

      const sfLower = shopFloor.toLowerCase().trim();
      const lineLower = line.toLowerCase().trim();
      const stationLower = station.toLowerCase().trim();

      const filtered = changes.filter(record => {
        const isMatchingFourM = record.four_m.toLowerCase().includes(fourMValue.toLowerCase());
        const shopMatch = !sfLower || (record.shopfloor_name?.toLowerCase().trim().includes(sfLower));
        const lineMatch = !lineLower || (record.line_name?.toLowerCase().trim().includes(lineLower));
        const stationMatch = !stationLower || (record.station_name?.toLowerCase().trim().includes(stationLower));

        return isMatchingFourM && shopMatch && lineMatch && stationMatch;
      });

      setFilteredChangesForFourM(filtered);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Main Container */}
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          {/* Header Section */}
          <header className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-2 md:p-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">🏭</span>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                      4M CHANGE DISPLAY BOARD
                    </h1>
                    <p className="text-blue-200 text-sm md:text-base mt-1">
                      Real-time monitoring of Man, Machine, Material & Method changes
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={loadChanges}
                  className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm 
                           text-white rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  <RefreshIcon />
                  <span className="font-semibold">Refresh Data</span>
                </button>
              </div>
            </div>
            
            {/* Filters Section */}
            <div className="p-2 bg-gradient-to-b from-slate-50 to-white border-t border-slate-100">
              <div className="flex flex-wrap gap-2 items-end">
                {[
                  { label: 'Shop Floor', value: shopFloor, setter: setShopFloor, options: shopfloors.map(sf => sf.name), disabled: false, icon: '🏢' },
                  { label: 'Line', value: line, setter: setLine, options: lines.map(l => l.name), disabled: !shopFloor, icon: '📍' },
                  { label: 'Station', value: station, setter: setStation, options: stationsList.map(s => s.name), disabled: !line, icon: '🎯' },
                ].map(({ label, value, setter, options, disabled, icon }) => (
                  <div key={label} className="flex flex-col min-w-[180px] flex-1 max-w-[250px]">
                    <label className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                      <span>{icon}</span>
                      {label}
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-700 
                               font-medium shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 
                               transition-all duration-200 disabled:opacity-50 disabled:bg-slate-100 
                               disabled:cursor-not-allowed cursor-pointer hover:border-slate-300"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      disabled={disabled}
                    >
                      <option value="">{`Select ${label.toLowerCase()}...`}</option>
                      {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
                
                {/* Clear Filters Button */}
                {(shopFloor || line || station) && (
                  <button
                    onClick={() => {
                      setShopFloor('');
                      setLine('');
                      setStation('');
                    }}
                    className="px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 
                             rounded-xl transition-all duration-200 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </header>
          
          {/* 4M Status Cards Section */}
          <section className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full" />
                <h2 className="text-2xl font-bold text-slate-800">4M Change Status Overview</h2>
              </div>
              <div className="text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-full font-medium">
                {changes.length} Total Records
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(['MAN', 'MACHINE', 'MATERIAL', 'METHOD'] as (keyof FourMData)[]).map(key => {
                const status = fourMData[key];
                const count = changes.filter(c => {
                  const normalized = normalizeFourM(c.four_m);
                  const sfMatch = !shopFloor || (c.shopfloor_name?.toLowerCase().includes(shopFloor.toLowerCase()));
                  const lineMatch = !line || (c.line_name?.toLowerCase().includes(line.toLowerCase()));
                  const stationMatch = !station || (c.station_name?.toLowerCase().includes(station.toLowerCase()));
                  return normalized === key && sfMatch && lineMatch && stationMatch;
                }).length;

                return (
                  <FourMCard
                    key={key}
                    title={key}
                    status={status}
                    image={status.image}
                    isMostRecent={mostRecentFourM === key}
                    isSelected={selectedFourM === key}
                    onClick={() => handleCardClick(key)}
                    count={count}
                  />
                );
              })}
            </div>
          </section>
          
          {/* Detailed View Section */}
          {selectedFourM && (
            <section className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fadeIn">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{getFourMIcon(selectedFourM)}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedFourM} Change Details</h2>
                    <p className="text-slate-300 text-sm mt-1">
                      Showing {filteredChangesForFourM.length} record{filteredChangesForFourM.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <ViewToggle view={viewMode} onViewChange={setViewMode} />
                  <button 
                    onClick={() => setSelectedFourM(null)} 
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl 
                             transition-all duration-200 hover:scale-105"
                    title="Close"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="p-6">
                {filteredChangesForFourM.length > 0 ? (
                  <>
                    {viewMode === 'table' ? (
                      /* Table View */
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                        <table className="min-w-full divide-y divide-slate-200">
                          <thead>
                            <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                              <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Time</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Shift</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Shopfloor</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Line</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Station</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Category</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-100">
                            {paginatedData.map((item, index) => (
                              <tr 
                                key={index} 
                                className="hover:bg-blue-50/50 transition-colors duration-150"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                                    {item.record_id || item.id}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{item.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.time || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg">
                                    Shift {item.shift}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.shopfloor_name || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.line_name || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.station_name || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                                    getCategoryBadgeStyles(item.category_details?.category_type)
                                  }`}>
                                    {item.category_details?.category_type || 'Unknown'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* Card View */
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {paginatedData.map((item, index) => (
                          <ChangeRecordCard key={index} record={item} index={index} />
                        ))}
                      </div>
                    )}
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-6">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          totalItems={filteredChangesForFourM.length}
                          itemsPerPage={itemsPerPage}
                          onPageChange={setCurrentPage}
                          onItemsPerPageChange={handleItemsPerPageChange}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  /* Empty State */
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-5xl opacity-50">{getFourMIcon(selectedFourM)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No Changes Found</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                      There are no {selectedFourM.toLowerCase()} changes recorded for the selected filters.
                      Try adjusting your filter criteria.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
          
          {/* Footer */}
          <footer className="text-center py-6 text-slate-500 text-sm">
            <p>4M Change Management System • Last updated: {new Date().toLocaleString()}</p>
          </footer>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChangeDisplayBoard;