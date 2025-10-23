import { useState, useEffect } from 'react';
// import manimg from '../../assets/Images/man.jpg'
import manimg from '../../assets/Images/man1.png'
// import machineimg from '../../assets/Images/machine.jpg'
import machineimg from '../../assets/Images/machine1.png'
import materialimg from '../../assets/Images/material.jpg'
// import materialimg from '../../assets/Images/material1.jpg'
// import methodimg from '../../assets/Images/method.jpg'
import methodimg from '../../assets/Images/method1.png'
import GraphicalMonitoring4MChart from '../GraphicalMonitoring4MChart/GraphicalMonitoring4MChart';

// Define TypeScript interfaces for data structures
interface FourMStatus {
  status: 'change' | 'no-change';
  image: string;
}

interface FourMData {
  MAN: FourMStatus;
  MACHINE: FourMStatus;
  MATERIAL: FourMStatus;
  METHOD: FourMStatus;
  [key: string]: FourMStatus; // Index signature for dynamic access
}

interface ActionPlanItem {
  mcNo: string;
  partNo: string;
  changeType: 'Man' | 'Machine' | 'Material' | 'Method';
  actionTaken: string;
  resp: string;
  targetDate: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  location: string;
  shopFloor: string;
  line: string;
  machine: string;
}

// Helper function to generate random action plan items
const generateRandomActionItems = (location: any, shopFloor: any, line: any, machine: any, count = 5) => {
  const changeTypes: ('Man' | 'Machine' | 'Material' | 'Method')[] = ['Man', 'Machine', 'Material', 'Method'];
  const statuses: ('Completed' | 'In Progress' | 'Pending')[] = ['Completed', 'In Progress', 'Pending'];
  const actions = [
    'Training provided', 'Preventive maintenance', 'Quality check improved',
    'Process standardized', 'New supplier onboarded', 'Equipment calibrated',
    'Software updated', 'SOP revised', 'Inspection criteria updated',
    'Ergonomic improvements', 'Visual management implemented', 'Error-proofing added',
    'Skill matrix updated', 'Cross-training completed', 'Material testing enhanced'
  ];
  const names = [
    'John', 'Sarah', 'Mike', 'Emma', 'Robert', 'Chris', 'Kate', 'David',
    'Lisa', 'James', 'Anna', 'Tom', 'Jessica', 'Daniel', 'Laura'
  ];

  // Generate random items
  return Array.from({ length: count }, (_, i) => {
    const mcNumber = Math.floor(1000 + Math.random() * 9000);
    const partNumber = `P${Math.floor(100 + Math.random() * 900)}`;
    const changeType = changeTypes[Math.floor(Math.random() * changeTypes.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    // Generate a random date in the next 30 days
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30));
    const targetDate = futureDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    return {
      mcNo: `MC${mcNumber}`,
      partNo: partNumber,
      changeType,
      actionTaken: `${action} for ${changeType.toLowerCase()}`,
      resp: name,
      targetDate,
      status,
      location,
      shopFloor,
      line,
      machine
    };
  });
};

// Component for the 4M Card
const FourMCard: React.FC<{ title: keyof FourMData; status: FourMStatus; image: string }> = ({ title, status, image }) => {
  const isChange = status.status === 'change';
  
  // Dynamic color classes for 'Change' status
  const changeStatusColor = isChange ? 'bg-red-600' : 'bg-gray-200';
  const changeStatusRing = isChange ? 'ring-red-300' : 'ring-gray-100';
  const noChangeStatusColor = !isChange ? 'bg-green-600' : 'bg-gray-200';
  const noChangeStatusRing = !isChange ? 'ring-green-300' : 'ring-gray-100';

  return (
    // <div className="flex flex-col bg-white rounded-xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl">
    <div className="flex flex-col overflow-hidden transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-extrabold p-3 text-center text-xl tracking-wider uppercase">
        {title}
      </div>
      <div className="p-3 flex flex-col items-center">
        <img 
          src={image} 
          alt={title as string} // FIX: Cast to string to resolve TS2322 error
          className="w-full h-40 object-cover rounded-lg shadow-md mb-3" 
        />
        
        {/* Status Indicators */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg border border-gray-200 transition duration-150 ease-in-out hover:bg-gray-50">
            <span className="font-semibold text-gray-700">Change</span>
            <div className={`w-8 h-8 rounded-full shadow-inner flex items-center justify-center ring-4 ${changeStatusColor} ${changeStatusRing}`}>
              <div className={`w-4 h-4 rounded-full ${isChange ? 'bg-white' : 'bg-gray-400'}`}></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg border border-gray-200 transition duration-150 ease-in-out hover:bg-gray-50">
            <span className="font-semibold text-gray-700">No Change</span>
            <div className={`w-8 h-8 rounded-full shadow-inner flex items-center justify-center ring-4 ${noChangeStatusColor} ${noChangeStatusRing}`}>
              <div className={`w-4 h-4 rounded-full ${!isChange ? 'bg-white' : 'bg-gray-400'}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const ChangeDisplayBoard = () => {
  // State for dropdown selections
  const [location, setLocation] = useState('Manesar');
  const [shopFloor, setShopFloor] = useState('Floor 1');
  const [line, setLine] = useState('Line 1');
  const [machine, setMachine] = useState('Machine 1');

  // State for the 4M data with random initial values
  const [data, setData] = useState<FourMData>({
    MAN: {
      status: Math.random() > 0.5 ? 'change' : 'no-change',
      image: manimg
    },
    MACHINE: {
      status: Math.random() > 0.5 ? 'change' : 'no-change',
      image: machineimg
    },
    MATERIAL: {
      status: Math.random() > 0.5 ? 'change' : 'no-change',
      image: materialimg
    },
    METHOD: {
      status: Math.random() > 0.5 ? 'change' : 'no-change',
      image: methodimg
    }
  });

  // Initialize with random action plan for current selection
  const [actionPlan, setActionPlan] = useState<ActionPlanItem[]>(
    generateRandomActionItems(location, shopFloor, line, machine)
  );

  // Generate new random data and action plan items when selections change
  useEffect(() => {
    console.log(`Generating random data for ${location}, ${shopFloor}, ${line}, ${machine}`);

    // Create a new data object with random status values
    const newData: FourMData = {
      MAN: {
        status: Math.random() > 0.5 ? 'change' : 'no-change',
        image: manimg
      },
      MACHINE: {
        status: Math.random() > 0.5 ? 'change' : 'no-change',
        image: machineimg
      },
      MATERIAL: {
        status: Math.random() > 0.5 ? 'change' : 'no-change',
        image: materialimg
      },
      METHOD: {
        status: Math.random() > 0.5 ? 'change' : 'no-change',
        image: methodimg
      }
    };

    // Update the data state with random values
    setData(newData);

    // Generate new random action items for the current selection
    const itemCount = Math.floor(3 + Math.random() * 5); // Random number between 3-7 items
    const newActionItems = generateRandomActionItems(location, shopFloor, line, machine, itemCount);

    // Update the action plan state
    setActionPlan(prevPlan => {
      // Filter out items for the current selection to replace them
      const otherItems = prevPlan.filter(item =>
        item.location !== location ||
        item.shopFloor !== shopFloor ||
        item.line !== line ||
        item.machine !== machine
      );

      // Return combined items
      return [...otherItems, ...newActionItems];
    });
  }, [location, shopFloor, line, machine]);

  // Filter action plan based on selected filters
  const filteredActionPlan = actionPlan.filter(item =>
    item.location === location &&
    item.shopFloor === shopFloor &&
    item.line === line &&
    item.machine === machine
  );

  // Helper function for status badge styling
  const getStatusBadge = (status: ActionPlanItem['status']) => {
    let colorClass = '';
    switch (status) {
      case 'Completed':
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 'In Progress':
        colorClass = 'bg-blue-100 text-blue-800';
        break;
      case 'Pending':
        colorClass = 'bg-red-100 text-red-800';
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-800';
    }
    return (
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
        {status}
      </span>
    );
  };
  
  // Helper function for change type pill styling
  const getChangeTypePill = (changeType: ActionPlanItem['changeType']) => {
    let colorClass = '';
    switch (changeType) {
      case 'Man':
        colorClass = 'bg-yellow-200 text-yellow-800';
        break;
      case 'Machine':
        colorClass = 'bg-purple-200 text-purple-800';
        break;
      case 'Material':
        colorClass = 'bg-cyan-200 text-cyan-800';
        break;
      case 'Method':
        colorClass = 'bg-pink-200 text-pink-800';
        break;
      default:
        colorClass = 'bg-gray-200 text-gray-800';
    }
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-lg ${colorClass}`}>
        {changeType}
      </span>
    );
  };


  return (
    <div className="flex flex-col min-h-screen w-full p-6">
      {/* Main Container with Shadow and Rounded Corners */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-8">
        
        {/* Header and Dropdowns Section */}
        <header className="border-b-4 border-blue-500 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4 md:mb-0 tracking-tight">
              🏭 4M CHANGE DISPLAY BOARD
            </h1>
            
            {/* Dropdown Filters */}
            <div className="flex flex-wrap gap-4 items-end">
              {/* Dropdown Structure Refinement */}
              {[
                { label: 'Location', value: location, setter: setLocation, options: ['Manesar', 'Nimrana', 'Bhawal'] },
                { label: 'Shop Floor', value: shopFloor, setter: setShopFloor, options: ['Floor 1', 'Floor 2', 'Floor 3'] },
                { label: 'Line', value: line, setter: setLine, options: ['Line 1', 'Line 2', 'Line 3'] },
                { label: 'Machine', value: machine, setter: setMachine, options: ['Machine 1', 'Machine 2', 'Machine 3'] },
              ].map(({ label, value, setter, options }) => (
                <div key={label} className="flex flex-col min-w-[120px]">
                  <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
                  <select
                    className="border border-gray-300 rounded-lg p-2 text-gray-700 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                  >
                    {options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </header>
        
        {/* --- */}

        {/* 4M Display Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4 border-l-4 border-yellow-500 pl-3">4M Change Status Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FourMCard title="MAN" status={data.MAN} image={manimg} />
            <FourMCard title="MACHINE" status={data.MACHINE} image={machineimg} />
            <FourMCard title="MATERIAL" status={data.MATERIAL} image={materialimg} />
            <FourMCard title="METHOD" status={data.METHOD} image={methodimg} />
          </div>
        </section>
        
        {/* --- */}
        
        {/* Action Plan Table */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4 border-l-4 border-red-500 pl-3">Action Plan for 4M Changes</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">M/C No.</th>
                  <th className="px-6 py- text-left text-xs font-semibold uppercase tracking-wider">Part No.</th>
                  <th className="px-6 py- text-left text-xs font-semibold uppercase tracking-wider">Change Type</th>
                  <th className="px-6 py- text-left text-xs font-semibold uppercase tracking-wider">Action Taken</th>
                  <th className="px-6 py- text-left text-xs font-semibold uppercase tracking-wider">Resp.</th>
                  <th className="px-6 py- text-left text-xs font-semibold uppercase tracking-wider">Target Date</th>
                  <th className="px-6 py- text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActionPlan.length > 0 ? (
                  filteredActionPlan.map((item, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.mcNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.partNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getChangeTypePill(item.changeType)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.actionTaken}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.resp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.targetDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-lg text-gray-500">
                      🎉 All clear! No open action items for the selected area.
                    </td>
                  </tr>
                )}
                {/* Empty rows for consistent table height (5 rows visible if no data) */}
                {Array.from({ length: Math.max(0, 5 - filteredActionPlan.length) }).map((_, index) => (
                  <tr key={`empty-${index}`}>
                    <td colSpan={7} className="px-6 py-4 text-gray-200 text-center">...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        
        {/* --- */}

        {/* Optional Graphical Chart Section (uncomment if GraphicalMonitoring4MChart is implemented) */}
        {/* <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4 border-l-4 border-green-500 pl-3">4M Change Trend Monitoring</h2>
          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
            <GraphicalMonitoring4MChart />
          </div>
        </section> */}

      </div>
    </div>
  );
};

export default ChangeDisplayBoard;