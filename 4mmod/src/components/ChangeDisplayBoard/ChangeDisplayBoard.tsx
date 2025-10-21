import { useState, useEffect } from 'react';
// import manimg from '../../../Images/man.jpg'
import manimg from '../../assets/Images/man.jpg'
// import machineimg from '../../../Images/machine.jpg'
import machineimg from '../../assets/Images/machine.jpg'
import materialimg from '../../assets/Images/material.jpg'
import methodimg from '../../assets/Images/method.jpg'
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
const generateRandomActionItems = (location : any, shopFloor  : any, line  : any, machine  : any, count = 5) => {
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
      image: '/api/placeholder/200/150' 
    },
    MACHINE: { 
      status: Math.random() > 0.5 ? 'change' : 'no-change', 
      image: '/api/placeholder/200/150' 
    },
    MATERIAL: { 
      status: Math.random() > 0.5 ? 'change' : 'no-change', 
      image: '/api/placeholder/200/150' 
    },
    METHOD: { 
      status: Math.random() > 0.5 ? 'change' : 'no-change', 
      image: '/api/placeholder/200/150' 
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
        image: '/api/placeholder/200/150' 
      },
      MACHINE: { 
        status: Math.random() > 0.5 ? 'change' : 'no-change', 
        image: '/api/placeholder/200/150' 
      },
      MATERIAL: { 
        status: Math.random() > 0.5 ? 'change' : 'no-change', 
        image: '/api/placeholder/200/150' 
      },
      METHOD: { 
        status: Math.random() > 0.5 ? 'change' : 'no-change', 
        image: '/api/placeholder/200/150' 
      }
    };
    
    // Update the data state with random values
    setData(newData);
    
    // Generate new random action items for the current selection
    const itemCount = Math.floor(3 + Math.random() * 5); // Random number between 3-7 items
    const newActionItems = generateRandomActionItems(location, shopFloor, line, machine, itemCount);
    
    // Update the action plan state
    setActionPlan(prevPlan => {
      // Keep items for other locations/floors/lines/machines
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
  
  // Function to handle "Randomize" button click
  const handleRandomizeClick = () => {
    // Generate new random status for each category
    const newData: FourMData = { 
      MAN: { 
        status: Math.random() > 0.5 ? 'change' : 'no-change', 
        image: data.MAN.image 
      },
      MACHINE: { 
        status: Math.random() > 0.5 ? 'change' : 'no-change', 
        image: data.MACHINE.image 
      },
      MATERIAL: { 
        status: Math.random() > 0.5 ? 'change' : 'no-change', 
        image: data.MATERIAL.image 
      },
      METHOD: { 
        status: Math.random() > 0.5 ? 'change' : 'no-change', 
        image: data.METHOD.image 
      }
    };
    
    // Update the data state
    setData(newData);
    
    // Generate new random action items for the current selection
    const itemCount = Math.floor(3 + Math.random() * 5); // Random number between 3-7 items
    const newActionItems = generateRandomActionItems(location, shopFloor, line, machine, itemCount);
    
    // Update the action plan state
    setActionPlan(prevPlan => {
      // Keep items for other locations/floors/lines/machines
      const otherItems = prevPlan.filter(item => 
        item.location !== location || 
        item.shopFloor !== shopFloor || 
        item.line !== line || 
        item.machine !== machine
      );
      
      // Return combined items
      return [...otherItems, ...newActionItems];
    });
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-lg shadow-lg">
      {/* Header and Dropdowns */}
      <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-100 rounded-t-lg">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">4M CHANGE DISPLAY BOARD</h1>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Location</label>
            <select 
              className="border rounded p-1"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="Manesar">Manesar</option>
              <option value="Nimrana">Nimrana</option>
              <option value="Bhawal">Bhawal</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Shop Floor</label>
            <select 
              className="border rounded p-1"
              value={shopFloor}
              onChange={(e) => setShopFloor(e.target.value)}
            >
              <option value="Floor 1">Floor 1</option>
              <option value="Floor 2">Floor 2</option>
              <option value="Floor 3">Floor 3</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Line</label>
            <select 
              className="border rounded p-1"
              value={line}
              onChange={(e) => setLine(e.target.value)}
            >
              <option value="Line 1">Line 1</option>
              <option value="Line 2">Line 2</option>
              <option value="Line 3">Line 3</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Machine</label>
            <select 
              className="border rounded p-1"
              value={machine}
              onChange={(e) => setMachine(e.target.value)}
            >
              <option value="Machine 1">Machine 1</option>
              <option value="Machine 2">Machine 2</option>
              <option value="Machine 3">Machine 3</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Randomize Button */}
      {/* <div className="px-4 pt-4 flex justify-end">
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" 
          onClick={handleRandomizeClick}
        >
          Randomize Status
        </button>
      </div> */}
      
      {/* 4M Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {/* MAN */}
        <div className="flex flex-col border border-gray-300">
          <div className="bg-yellow-500 text-black font-bold p-2 text-center">MAN</div>
          <div className="p-2">
            <img src={manimg} alt="Man" className="w-full h-32 object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-2 p-2">
            <div>Change</div>
            <div className={`border ${data.MAN.status === 'change' ? 'bg-red-500' : 'bg-white'} h-6`}></div>
            <div>No Change</div>
            <div className={`border ${data.MAN.status === 'no-change' ? 'bg-green-500' : 'bg-white'} h-6`}></div>
          </div>
        </div>
        
        {/* MACHINE */}
        <div className="flex flex-col border border-gray-300">
          <div className="bg-yellow-500 text-black font-bold p-2 text-center">MACHINE</div>
          <div className="p-2">
            <img src={machineimg} alt="Machine" className="w-full h-32 object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-2 p-2">
            <div>Change</div>
            <div className={`border ${data.MACHINE.status === 'change' ? 'bg-red-500' : 'bg-white'} h-6`}></div>
            <div>No Change</div>
            <div className={`border ${data.MACHINE.status === 'no-change' ? 'bg-green-500' : 'bg-white'} h-6`}></div>
          </div>
        </div>
        
        {/* MATERIAL */}
        <div className="flex flex-col border border-gray-300">
          <div className="bg-yellow-500 text-black font-bold p-2 text-center">MATERIAL</div>
          <div className="p-2">
            <img src={materialimg} alt="Material" className="w-full h-32 object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-2 p-2">
            <div>Change</div>
            <div className={`border ${data.MATERIAL.status === 'change' ? 'bg-red-500' : 'bg-white'} h-6`}></div>
            <div>No Change</div>
            <div className={`border ${data.MATERIAL.status === 'no-change' ? 'bg-green-500' : 'bg-white'} h-6`}></div>
          </div>
        </div>
        
        {/* METHOD */}
        <div className="flex flex-col border border-gray-300">
          <div className="bg-yellow-500 text-black font-bold p-2 text-center">METHOD</div>
          <div className="p-2">
            <img src={methodimg} alt="Method" className="w-full h-32 object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-2 p-2">
            <div>Change</div>
            <div className={`border ${data.METHOD.status === 'change' ? 'bg-red-500' : 'bg-white'} h-6`}></div>
            <div>No Change</div>
            <div className={`border ${data.METHOD.status === 'no-change' ? 'bg-green-500' : 'bg-white'} h-6`}></div>
          </div>
        </div>
      </div>
      
      {/* Action Plan Table */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-center border-b-2 border-gray-300 pb-2 mb-4">4M CHANGE ACTION PLAN</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">M/C No.</th>
                <th className="border border-gray-300 p-2">Part No.</th>
                <th className="border border-gray-300 p-2">Change type</th>
                <th className="border border-gray-300 p-2">Action taken</th>
                <th className="border border-gray-300 p-2">Resp.</th>
                <th className="border border-gray-300 p-2">Target Date</th>
                <th className="border border-gray-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredActionPlan.length > 0 ? (
                filteredActionPlan.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{item.mcNo}</td>
                    <td className="border border-gray-300 p-2">{item.partNo}</td>
                    <td className="border border-gray-300 p-2">{item.changeType}</td>
                    <td className="border border-gray-300 p-2">{item.actionTaken}</td>
                    <td className="border border-gray-300 p-2">{item.resp}</td>
                    <td className="border border-gray-300 p-2">{item.targetDate}</td>
                    <td className="border border-gray-300 p-2 font-medium" 
                        style={{
                          color: item.status === 'Completed' ? 'green' : 
                                 item.status === 'In Progress' ? 'blue' : 'red'
                        }}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="border border-gray-300 p-2 text-center">
                    No action items for selected filters
                  </td>
                </tr>
              )}
              {/* Empty rows to ensure consistent table height */}
              {Array.from({ length: Math.max(0, 5 - filteredActionPlan.length) }).map((_, index) => (
                <tr key={`empty-${index}`}>
                  <td className="border border-gray-300 p-2">&nbsp;</td>
                  <td className="border border-gray-300 p-2">&nbsp;</td>
                  <td className="border border-gray-300 p-2">&nbsp;</td>
                  <td className="border border-gray-300 p-2">&nbsp;</td>
                  <td className="border border-gray-300 p-2">&nbsp;</td>
                  <td className="border border-gray-300 p-2">&nbsp;</td>
                  <td className="border border-gray-300 p-2">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <GraphicalMonitoring4MChart /> */}
    </div>
  );
};

export default ChangeDisplayBoard;