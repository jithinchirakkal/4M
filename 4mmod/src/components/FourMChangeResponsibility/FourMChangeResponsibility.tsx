import React, { useState } from 'react';
import { Users, FileText, CheckCircle, XCircle } from 'lucide-react'; // Added icons for modern design
// Assuming these paths are correct in your project structure
import emp1 from '../../assets/Images/emp/emp5.jpeg';
import emp2 from '../../assets/Images/emp/emp2.jpeg';
import emp3 from '../../assets/Images/emp/emp3.jpeg';
import emp4 from '../../assets/Images/emp/emp4.jpeg';

const FourMChangeResponsibility: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // CORRECTED: Direct assignment of imported image paths.
  const employeeImages: Record<string, string> = {
    parvesh: emp1, // emp1 holds the string path
    sunil: emp2,  // emp2 holds the string path
    shiv: emp3,
    sanjay: emp4,
  };

  const handleImageClick = (src: string) => {
    setPreviewImage(src);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  // Helper component for the employee photo cell
  const EmployeePhotoCell: React.FC<{ name: string; phone: string; imageKey: keyof typeof employeeImages }> = ({ name, phone, imageKey }) => {
    const imgSrc = employeeImages[imageKey];
    
    // Check if the image source is valid before passing it to the button handler
    const safeSrc = typeof imgSrc === 'string' ? imgSrc : '';

    return (
      <td className="border border-gray-200 p-3 relative text-center bg-white/70 hover:bg-blue-50/50 transition-colors duration-200">
        <button
          className="flex flex-col items-center justify-center h-40 w-full focus:outline-none group"
          onClick={() => safeSrc && handleImageClick(safeSrc)}
          aria-label={`Preview ${name}'s image`}
        >
          <img
            src={safeSrc}
            alt={name}
            className="w-28 h-28 object-cover rounded-full border-4 border-blue-200 group-hover:border-blue-500 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
            // Fallback placeholder is good practice
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/112?text=Photo')} 
          />
          <div className="text-center mt-3">
            <span className="font-extrabold text-lg text-gray-800">{name.toUpperCase()}</span>
            <div className='flex items-center justify-center gap-1 text-gray-600 text-sm'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span className='font-medium'>{phone}</span>
            </div>
          </div>
        </button>
      </td>
    );
  };
  
  // Helper component for styled responsibility cells
  const ResponsibilityCell: React.FC<{ text: string; gradient: string; tooltip: string }> = ({ text, gradient, tooltip }) => (
    <td 
        className={`border border-gray-200 p-4 text-center font-extrabold text-white text-md shadow-inner transition-all duration-300 hover:shadow-xl relative`}
        style={{ backgroundImage: gradient }}
        data-tooltip={tooltip}
        tabIndex={0}
    >
      {text}
    </td>
  );

  return (
    <div className=" min-h-screen p-6">
      <div className="max-w-full mx-auto">
        
        {/* Header: Max Attractive Gradient Card */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-2xl shadow-blue-500/60 mb-8 relative overflow-hidden p-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mr-4 border border-white/50">
                        <Users className="text-white w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">4M Change Responsibility Matrix</h1>
                        <p className="text-blue-100 text-lg mt-1 font-medium">Defining personnel and duties for controlled manufacturing changes.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Responsibility Table */}
        <section className="pb-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100/80 overflow-x-auto">
            <div className="rounded-t-3xl overflow-hidden">
              <table
                className="w-full border-collapse text-sm"
                aria-label=" 4M Change Responsibility Table"
                style={{ minWidth: '1200px' }}
              >
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th
                      className="p-4 text-left font-extrabold text-lg border-r border-blue-500/50"
                      rowSpan={2}
                      scope="col"
                    >
                      DESIGNATION
                    </th>
                    <th
                      className="p-4 text-center font-extrabold text-lg"
                      colSpan={4}
                      scope="colgroup"
                    >
                      DEPARTMENT / PERSONNEL
                    </th>
                    <th
                      className="p-4 text-center font-extrabold text-lg"
                      rowSpan={2}
                      scope="col"
                    >
                      ALTERNATE CONTACT
                    </th>
                  </tr>
                  <tr className='bg-blue-700/80'>
                    <th className="p-3 text-center font-semibold border-r border-blue-500/50" scope="col">
                      ENGINEERING
                    </th>
                    <th className="p-3 text-center font-semibold border-r border-blue-500/50" scope="col">
                      PRESS SHOP (Supervisor A)
                    </th>
                    <th className="p-3 text-center font-semibold border-r border-blue-500/50" scope="col">
                      PRESS SHOP (Supervisor B)
                    </th>
                    <th className="p-3 text-center font-semibold border-r border-blue-500/50" scope="col">
                      WELD SHOP (Supervisor)
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {/* Row 1: Personnel Photos and Contacts */}
                  <tr role="row" className="bg-white hover:bg-gray-50 transition-colors duration-300">
                    <td 
                      className="border-r border-gray-200 p-3 bg-blue-50/70 font-extrabold text-center text-gray-800 uppercase tracking-wider"
                      data-tooltip="Key personnel responsible for executing 4M changes."
                      tabIndex={0}
                    >
                      Personnel
                    </td>
                    <EmployeePhotoCell name="Parvesh" phone="858823584" imageKey="parvesh" />
                    <EmployeePhotoCell name="Sunil" phone="858823584" imageKey="sunil" />
                    <EmployeePhotoCell name="Shiv" phone="958742477" imageKey="shiv" />
                    <EmployeePhotoCell name="Sanjay" phone="946701718" imageKey="sanjay" />
                    <td
                      className="border border-gray-200 p-3 text-center bg-green-50/70 font-semibold text-green-700"
                      data-tooltip="All personnel listed serve as alternate contacts for each other's absence."
                      tabIndex={0}
                    >
                      Alternate to<br />Each Other
                    </td>
                  </tr>

                  {/* Row 2: Responsibilities */}
                  <tr role="row" className="bg-white hover:bg-gray-50 transition-colors duration-300">
                    <td
                      className="border-r border-gray-200 p-3 bg-yellow-50/70 font-extrabold text-center text-gray-800 uppercase tracking-wider"
                      data-tooltip="Core responsibilities associated with the change process."
                      tabIndex={0}
                    >
                      Responsibilities
                    </td>
                    <ResponsibilityCell 
                      text="4M RECORDING" 
                      gradient="linear-gradient(to right, #3B82F6, #1D4ED8)" 
                      tooltip="Responsible for initiating and recording the 4M change entry."
                    />
                    <ResponsibilityCell 
                      text="4M CHANGE" 
                      gradient="linear-gradient(to right, #10B981, #059669)" 
                      tooltip="Responsible for execution and follow-up validation of the 4M change."
                    />
                    <ResponsibilityCell 
                      text="4M CHANGE" 
                      gradient="linear-gradient(to right, #10B981, #059669)" 
                      tooltip="Responsible for execution and follow-up validation of the 4M change."
                    />
                    <ResponsibilityCell 
                      text="4M CHANGE" 
                      gradient="linear-gradient(to right, #10B981, #059669)" 
                      tooltip="Responsible for execution and follow-up validation of the 4M change."
                    />
                    <td className="border border-gray-200 p-3"></td>
                  </tr>

                  {/* Row 3: Document Signatures (Approval/Preparation) */}
                  <tr role="row" className="bg-white hover:bg-gray-50 transition-colors duration-300">
                    <td className="border-r border-gray-200 p-3 bg-blue-50/70" data-tooltip="Document Signatories" tabIndex={0}>
                      <strong className="text-gray-700 text-sm">PREPARED BY:</strong>
                      <span className="block font-semibold text-gray-800">PARVESH</span>
                    </td>
                    <td
                      className="border border-gray-200 p-3 text-center font-medium"
                      colSpan={2}
                      data-tooltip="Signature of the Document Preparer (Parvesh)"
                      tabIndex={0}
                    >
                      <strong className="text-blue-500 block text-lg">Signature Area</strong>
                      <span className='text-gray-600 text-xs'>PARVESH, Engineer</span>
                    </td>
                    <td
                      className="border border-gray-200 p-3 text-center bg-gray-50/50 font-medium"
                      colSpan={3}
                      data-tooltip="Final approval signature of S K Sharma"
                      tabIndex={0}
                    >
                      <strong className="text-gray-700 text-sm">APPROVED BY:</strong>
                      <span className="block font-semibold text-gray-800 text-lg">S K SHARMA</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Custom Tooltip Styling is moved to global CSS or kept inline for portability */}
            <style>{`
              td[data-tooltip]:hover::after,
              td[data-tooltip]:focus::after {
                content: attr(data-tooltip);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background-color: #1f2937; /* Dark background */
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 20;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
              }
            `}</style>
          </div>
        </section>

        {/* Image Preview Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={closePreview} // Close on backdrop click
            role="dialog"
            aria-label="Image Preview Modal"
          >
            <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-lg w-[90%] md:w-full" onClick={(e) => e.stopPropagation()}>
              <button
                className="absolute top-2 right-2 text-gray-700 bg-gray-200 p-2 rounded-full hover:text-red-600 hover:bg-gray-300 transition-all"
                onClick={closePreview}
                aria-label="Close image preview"
              >
                <XCircle className="w-6 h-6" />
              </button>
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400?text=Image+Not+Found')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FourMChangeResponsibility;


// import React, { useState } from 'react';
// import emp1 from '../../assets/Images/emp/emp1.jpeg'
// import emp2 from '../../assets/Images/emp/emp2.jpeg'
// import emp3 from '../../assets/Images/emp/emp3.jpeg'
// import emp4 from '../../assets/Images/emp/emp4.jpeg'

// const FourMChangeResponsibility: React.FC = () => {
//   const [previewImage, setPreviewImage] = useState<string | null>(null);

//   const handleImageClick = (src: string) => {
//     setPreviewImage(src);
//   };

//   const closePreview = () => {
//     setPreviewImage(null);
//   };

//   // Demo image URLs from Unsplash (professional headshots)
//   const demoImages = {
//     parvesh: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
//     sunil: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
//     shiv: 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
//     sanjay: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
//   };

//   return (
//     <div className="max-h-screen">
//       <div className="max-w-full mx-auto">
//         <div className="mb-8 text-center">
//           <div className="flex justify-center items-center mb-4">
//             <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
//               <span className="text-white font-bold text-2xl">MS</span>
//             </div>
//             <h1 className="text-3xl font-bold text-blue-800">4M Change Responsibility</h1>
//           </div>
//         </div>

//         {/* Main Responsibility Table */}
//         <section className=" max-w-full mx-auto px-4 py-6 ">
//           <div className="bg-white rounded-lg shadow-xl p-6 overflow-x-auto">
//             <div className="rounded-b-3xl relative">
//               <table
//                 className=" w-full min-w-[800px] border-collapse text-sm"
//                 aria-label=" 4M Change Responsibility Table"
//               >
//                 <thead className=" bg-blue-700 text-white">
//                   <tr>
//                     <th
//                       className="p-3  text-left font-semibold"
//                       rowSpan={2}
//                       scope="col"
//                       aria-label="Designation"
//                     >
//                       DESIGNATION
//                     </th>
//                     <th
//                       className="p-3 text-left font-semibold"
//                       colSpan={4}
//                       scope="colgroup"
//                       aria-label="Department Areas"
//                     >
//                       DEPARTMENT (AREA)
//                     </th>
//                     <th
//                       className="p-3 text-center font-semibold"
//                       rowSpan={2}
//                       scope="col"
//                       aria-label="Alternate Information"
//                     >
//                       ALTERNATE TO EACH OTHER
//                     </th>
//                   </tr>
//                   <tr>
//                     <th className="p-3 text-left" scope="col">
//                       ENGINEER
//                     </th>
//                     <th className="p-3 text-left" scope="col">
//                       PRESS SHOP (SUPERVISOR)
//                     </th>
//                     <th className="p-3 text-left" scope="col">
//                       PRESS SHOP (SUPERVISOR)
//                     </th>
//                     <th className="p-3 text-left" scope="col">
//                       WELD SHOP (SUPERVISOR)
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr
//                     className="hover:bg-blue-50 transition duration-300 transform hover:scale-[1.01]"
//                     role="row"
//                   >
//                     <td
//                       className="border border-gray-300 p-3 bg-yellow-100 font-semibold text-center"
//                       data-tooltip="Personnel responsible for 4M changes"
//                       tabIndex={0}
//                     >
//                       Personnel
//                     </td>
//                     <td className="border border-gray-300 p-3 relative" data-tooltip="Parvesh, Engineer">
//                       <button
//                         className="flex flex-col items-center justify-center h-36 w-full focus:outline-none"
//                         onClick={() => handleImageClick(demoImages.parvesh)}
//                         aria-label="Preview Parvesh's image"
//                       >
//                         <img
//                           src={demoImages.parvesh}
//                           alt="Parvesh"
//                           className="w-24 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
//                           onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/96?text=Parvesh')}
//                         />
//                         <div className="text-center mt-2">
//                           <span className="font-medium text-gray-800">PARVESH</span>
//                            <br />
//                           <span className="text-gray-600 text-xs">858823584</span>
//                         </div>
//                       </button>
//                     </td>
//                     <td
//                       className="border border-gray-300 p-3 relative"
//                       data-tooltip="Sunil, Press Shop Supervisor, Contact: 858823584"
//                     >
//                       <button
//                         className="flex flex-col items-center justify-center h-36 w-full focus:outline-none"
//                         onClick={() => handleImageClick(demoImages.sunil)}
//                         aria-label="Preview Sunil's image"
//                       >
//                         <img
//                           src={demoImages.sunil}
//                           alt="Sunil"
//                           className="w-24 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
//                           onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/96?text=Sunil')}
//                         />
//                         <div className="text-center mt-2">
//                           <span className="font-medium text-gray-800">SUNIL</span>
//                           <br />
//                           <span className="text-gray-600 text-xs">858823584</span>
//                         </div>
//                       </button>
//                     </td>
//                     <td
//                       className="border border-gray-300 p-3 relative"
//                       data-tooltip="Shiv, Press Shop Supervisor, Contact: 958742477"
//                     >
//                       <button
//                         className="flex flex-col items-center justify-center h-36 w-full focus:outline-none"
//                         onClick={() => handleImageClick(demoImages.shiv)}
//                         aria-label="Preview Shiv's image"
//                       >
//                         <img
//                           src={demoImages.shiv}
//                           alt="Shiv"
//                           className="w-24 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
//                           onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/96?text=Shiv')}
//                         />
//                         <div className="text-center mt-2">
//                           <span className="font-medium text-gray-800">SHIV</span>
//                           <br />
//                           <span className="text-gray-600 text-xs">958742477</span>
//                         </div>
//                       </button>
//                     </td>
//                     <td
//                       className="border border-gray-300 p-3 relative"
//                       data-tooltip="Sanjay, Weld Shop Supervisor, Contact: 946701718"
//                     >
//                       <button
//                         className="flex flex-col items-center justify-center h-36 w-full focus:outline-none"
//                         onClick={() => handleImageClick(demoImages.sanjay)}
//                         aria-label="Preview Sanjay's image"
//                       >
//                         <img
//                           src={demoImages.sanjay}
//                           alt="Sanjay"
//                           className="w-24 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
//                           onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/96?text=Sanjay')}
//                         />
//                         <div className="text-center mt-2">
//                           <span className="font-medium text-gray-800">SANJAY</span>
//                           <br />
//                           <span className="text-gray-600 text-xs">946701718</span>
//                         </div>
//                       </button>
//                     </td>
//                     <td
//                       className="border border-gray-300 p-3 text-center bg-yellow-100 font-semibold"
//                       data-tooltip="Personnel are alternate contacts for each other"
//                       tabIndex={0}
//                     >
//                       Alternate to<br />each other
//                     </td>
//                   </tr>
//                   <tr
//                     className="hover:bg-blue-50 transition duration-300 transform hover:scale-[1.01]"
//                     role="row"
//                   >
//                     <td
//                       className="border border-gray-300 p-3 text-center bg-blue-100 font-semibold"
//                       data-tooltip="Assigned responsibilities"
//                       tabIndex={0}
//                     >
//                       Responsibilities
//                     </td>
//                     <td
//                       className="border border-gray-300 p-3 text-center bg-blue-100 font-semibold"
//                       data-tooltip="Responsible for 4M recording"
//                       tabIndex={0}
//                     >
//                       4M RECORDING RESPONSIBILITY
//                     </td>
//                     <td
//                       className="border border-gray-300 p-3 text-center bg-blue-100 font-semibold"
//                       data-tooltip="Responsible for 4M changes"
//                       tabIndex={0}
//                     >
//                       4M CHANGE RESPONSIBILITY
//                     </td>
//                     <td
//                       className="border border-gray-300 p-3 text-center bg-blue-100 font-semibold"
//                       data-tooltip="Responsible for 4M changes"
//                       tabIndex={0}
//                     >
//                       4M CHANGE RESPONSIBILITY
//                     </td>
//                     <td
//                       className="border border-gray-300 p-3 text-center bg-blue-100 font-semibold"
//                       data-tooltip="Responsible for 4M changes"
//                       tabIndex={0}
//                     >
//                       4M CHANGE RESPONSIBILITY
//                     </td>
//                     <td className="border border-gray-300 p-3"></td>
//                   </tr>
//                   <tr
//                     className="hover:bg-blue-50 transition duration-300 transform hover:scale-[1.01]"
//                     role="row"
//                   >
//                     <td className="border border-gray-300 p-3" data-tooltip="Document preparer" tabIndex={0}>
//                       <strong className="text-gray-700">PREPARED BY:</strong>
//                       <br />
//                       <span className="font-medium text-gray-800">PARVESH</span>
//                     </td>
//                     <td
//                       className="border border-gray-300 p-3 text-center"
//                       colSpan={2}
//                       data-tooltip="Parvesh's signature"
//                       tabIndex={0}
//                     >
//                       <span className="font-medium text-gray-800">PARVESH</span>
//                     </td>
//                     <td
//                       className="border border-gray-300 p-3 text-center"
//                       colSpan={3}
//                       data-tooltip="Approved by S K Sharma"
//                       tabIndex={0}
//                     >
//                       <strong className="text-gray-700">APPROVED BY:</strong>
//                       <br />
//                       <span className="font-medium text-gray-800">S K SHARMA</span>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//               {/* Custom Tooltip Styling */}
//               <style>{`
//                 td[data-tooltip]:hover::after {
//                   content: attr(data-tooltip);
//                   position: absolute;
//                   bottom: 100%;
//                   left: 50%;
//                   transform: translateX(-50%);
//                   background-color: rgba(0, 0, 0, 0.8);
//                   color: white;
//                   padding: 4px 8px;
//                   border-radius: 4px;
//                   font-size: 12px;
//                   white-space: nowrap;
//                   z-index: 10;
//                 }
//                 td[data-tooltip]:focus::after {
//                   content: attr(data-tooltip);
//                   position: absolute;
//                   bottom: 100%;
//                   left: 50%;
//                   transform: translateX(-50%);
//                   background-color: rgba(0, 0, 0, 0.8);
//                   color: white;
//                   padding: 4px 8px;
//                   border-radius: 4px;
//                   font-size: 12px;
//                   white-space: nowrap;
//                   z-index: 10;
//                 }
//               `}</style>
//             </div>
//           </div>
//         </section>

//         {/* Image Preview Modal */}
//         {previewImage && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
//             role="dialog"
//             aria-label="Image Preview Modal"
//           >
//             <div className="relative bg-white rounded-lg p-4 max-w-lg w-full">
//               <button
//                 className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
//                 onClick={closePreview}
//                 aria-label="Close image preview"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//               <img
//                 src={previewImage}
//                 alt="Preview"
//                 className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
//                 onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400?text=Image+Not+Found')}
//               />
//             </div>
//           </div>
//         )}

//         {/* Footer Icons */}
//         {/* <footer className="max-w-7xl mx-auto px-4 py-6 bg-gray-800 text-white rounded-lg shadow-md">
//           <div className="flex justify-end items-center gap-4 flex-wrap">
//             <div
//               className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition duration-300 transform hover:scale-110"
//               data-tooltip="Responsibility Indicator"
//               tabIndex={0}
//               aria-label="Responsibility Indicator"
//             >
//               <span className="text-white font-bold">R</span>
//             </div>
//             <div
//               className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition duration-300 transform hover:scale-110"
//               data-tooltip="Action Required"
//               tabIndex={0}
//               aria-label="Action Required Indicator"
//             >
//               <span className="text-white">●</span>
//             </div>
//             <div
//               className="flex items-center gap-2"
//               data-tooltip="Recording Status"
//               tabIndex={0}
//               aria-label="Recording Status"
//             >
//               <span className="text-sm">Recording</span>
//               <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center transform hover:scale-110 transition duration-300">
//                 <span className="text-white">●</span>
//               </div>
//             </div>
//             <style>{`
//               div[data-tooltip]:hover::after,
//               div[data-tooltip]:focus::after {
//                 content: attr(data-tooltip);
//                 position: absolute;
//                 bottom: 100%;
//                 left: 50%;
//                 transform: translateX(-50%);
//                 background-color: rgba(0, 0, 0, 0.8);
//                 color: white;
//                 padding: 4px 8px;
//                 border-radius: 4px;
//                 font-size: 12px;
//                 white-space: nowrap;
//                 z-index: 10;
//               }
//             `}</style>
//           </div>
//         </footer> */}
//       </div>
//     </div>
//   );
// };

// export default FourMChangeResponsibility;