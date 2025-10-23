

// import React, { useState } from 'react';

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
//     <div className="min-h-screen bg-gray-100">
//       {/* Document Info and Title */}
//       <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-xl">
//         <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
//           <div className="flex items-center justify-between flex-col sm:flex-row gap-4 sm:gap-6">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-md">
//                 <span className="text-white font-bold text-2xl">MS</span>
//               </div>
//               <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
//                 4M Change Responsibility
//               </h2>
//             </div>
//             <div className="bg-white text-gray-800 rounded-lg shadow-md">
//               {/* <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-200">
//                     <th className="p-2 font-semibold border-r border-gray-300">DOC. NO.</th>
//                     <th className="p-2 font-semibold">MSF-QA-10</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td className="p-2 border-r border-gray-300">REVISION NO.</td>
//                     <td className="p-2">00</td>
//                   </tr>
//                   <tr>
//                     <td className="p-2 border-r border-gray-300">DATE</td>
//                     <td className="p-2">05.04.18</td>
//                   </tr>
//                 </tbody>
//               </table> */}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Responsibility Table */}
//       <section className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
//         <div className="bg-white rounded-lg shadow-xl p-6 overflow-x-auto">
//           <div className="relative">
//             <table
//               className="w-full min-w-[800px] border-collapse text-sm"
//               aria-label="4M Change Responsibility Table"
//             >
//               <thead className="bg-blue-700 text-white">
//                 <tr>
//                   <th
//                     className="p-3 text-left font-semibold"
//                     rowSpan={2}
//                     scope="col"
//                     aria-label="Designation"
//                   >
//                     DESIGNATION
//                   </th>
//                   <th
//                     className="p-3 text-left font-semibold"
//                     colSpan={4}
//                     scope="colgroup"
//                     aria-label="Department Areas"
//                   >
//                     DEPARTMENT (AREA)
//                   </th>
//                   <th
//                     className="p-3 text-center font-semibold"
//                     rowSpan={2}
//                     scope="col"
//                     aria-label="Alternate Information"
//                   >
//                     ALTERNATE TO EACH OTHER
//                   </th>
//                 </tr>
//                 <tr>
//                   <th className="p-3 text-left" scope="col">
//                     ENGINEER
//                   </th>
//                   <th className="p-3 text-left" scope="col">
//                     PRESS SHOP (SUPERVISOR)
//                   </th>
//                   <th className="p-3 text-left" scope="col">
//                     PRESS SHOP (SUPERVISOR)
//                   </th>
//                   <th className="p-3 text-left" scope="col">
//                     WELD SHOP (SUPERVISOR)
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr
//                   className="hover:bg-blue-50 transition duration-300 transform hover:scale-[1.01]"
//                   role="row"
//                 >
//                   <td
//                     className="border border-gray-300 p-3 bg-yellow-100 font-semibold text-center"
//                     data-tooltip="Personnel responsible for 4M changes"
//                     tabIndex={0}
//                   >
//                     Personnel
//                   </td>
//                   <td className="border border-gray-300 p-3 relative" data-tooltip="Parvesh, Engineer">
//                     <button
//                       className="flex flex-col items-center justify-center h-36 w-full focus:outline-none"
//                       onClick={() => handleImageClick(demoImages.parvesh)}
//                       aria-label="Preview Parvesh's image"
//                     >
//                       <img
//                         src={demoImages.parvesh}
//                         alt="Parvesh"
//                         className="w-24 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
//                         onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/96?text=Parvesh')}
//                       />
//                       <div className="text-center mt-2">
//                         <span className="font-medium text-gray-800">PARVESH</span>
//                       </div>
//                     </button>
//                   </td>
//                   <td
//                     className="border border-gray-300 p-3 relative"
//                     data-tooltip="Sunil, Press Shop Supervisor, Contact: 858823584"
//                   >
//                     <button
//                       className="flex flex-col items-center justify-center h-36 w-full focus:outline-none"
//                       onClick={() => handleImageClick(demoImages.sunil)}
//                       aria-label="Preview Sunil's image"
//                     >
//                       <img
//                         src={demoImages.sunil}
//                         alt="Sunil"
//                         className="w-24 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
//                         onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/96?text=Sunil')}
//                       />
//                       <div className="text-center mt-2">
//                         <span className="font-medium text-gray-800">SUNIL</span>
//                         <br />
//                         <span className="text-gray-600 text-xs">858823584</span>
//                       </div>
//                     </button>
//                   </td>
//                   <td
//                     className="border border-gray-300 p-3 relative"
//                     data-tooltip="Shiv, Press Shop Supervisor, Contact: 958742477"
//                   >
//                     <button
//                       className="flex flex-col items-center justify-center h-36 w-full focus:outline-none"
//                       onClick={() => handleImageClick(demoImages.shiv)}
//                       aria-label="Preview Shiv's image"
//                     >
//                       <img
//                         src={demoImages.shiv}
//                         alt="Shiv"
//                         className="w-24 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
//                         onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/96?text=Shiv')}
//                       />
//                       <div className="text-center mt-2">
//                         <span className="font-medium text-gray-800">SHIV</span>
//                         <br />
//                         <span className="text-gray-600 text-xs">958742477</span>
//                       </div>
//                     </button>
//                   </td>
//                   <td
//                     className="border border-gray-300 p-3 relative"
//                     data-tooltip="Sanjay, Weld Shop Supervisor, Contact: 946701718"
//                   >
//                     <button
//                       className="flex flex-col items-center justify-center h-36 w-full focus:outline-none"
//                       onClick={() => handleImageClick(demoImages.sanjay)}
//                       aria-label="Preview Sanjay's image"
//                     >
//                       <img
//                         src={demoImages.sanjay}
//                         alt="Sanjay"
//                         className="w-24 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
//                         onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/96?text=Sanjay')}
//                       />
//                       <div className="text-center mt-2">
//                         <span className="font-medium text-gray-800">SANJAY</span>
//                         <br />
//                         <span className="text-gray-600 text-xs">946701718</span>
//                       </div>
//                     </button>
//                   </td>
//                   <td
//                     className="border border-gray-300 p-3 text-center bg-yellow-100 font-semibold"
//                     data-tooltip="Personnel are alternate contacts for each other"
//                     tabIndex={0}
//                   >
//                     Alternate to<br />each other
//                   </td>
//                 </tr>
//                 <tr
//                   className="hover:bg-blue-50 transition duration-300 transform hover:scale-[1.01]"
//                   role="row"
//                 >
//                   <td
//                     className="border border-gray-300 p-3 text-center bg-blue-100 font-semibold"
//                     data-tooltip="Assigned responsibilities"
//                     tabIndex={0}
//                   >
//                     Responsibilities
//                   </td>
//                   <td
//                     className="border border-gray-300 p-3 text-center bg-blue-100 font-semibold"
//                     data-tooltip="Responsible for 4M recording"
//                     tabIndex={0}
//                   >
//                     4M RECORDING RESPONSIBILITY
//                   </td>
//                   <td
//                     className="border border-gray-300 p-3 text-center bg-blue-100 font-semibold"
//                     data-tooltip="Responsible for 4M changes"
//                     tabIndex={0}
//                   >
//                     4M CHANGE RESPONSIBILITY
//                   </td>
//                   <td
//                     className="border border-gray-300 p-3 text-center bg-blue-100 font-semibold"
//                     data-tooltip="Responsible for 4M changes"
//                     tabIndex={0}
//                   >
//                     4M CHANGE RESPONSIBILITY
//                   </td>
//                   <td
//                     className="border border-gray-300 p-3 text-center bg-blue-100 font-semibold"
//                     data-tooltip="Responsible for 4M changes"
//                     tabIndex={0}
//                   >
//                     4M CHANGE RESPONSIBILITY
//                   </td>
//                   <td className="border border-gray-300 p-3"></td>
//                 </tr>
//                 <tr
//                   className="hover:bg-blue-50 transition duration-300 transform hover:scale-[1.01]"
//                   role="row"
//                 >
//                   <td className="border border-gray-300 p-3" data-tooltip="Document preparer" tabIndex={0}>
//                     <strong className="text-gray-700">PREPARED BY:</strong>
//                     <br />
//                     <span className="font-medium text-gray-800">PARVESH</span>
//                   </td>
//                   <td
//                     className="border border-gray-300 p-3 text-center"
//                     colSpan={2}
//                     data-tooltip="Parvesh's signature"
//                     tabIndex={0}
//                   >
//                     <span className="font-medium text-gray-800">PARVESH</span>
//                   </td>
//                   <td
//                     className="border border-gray-300 p-3 text-center"
//                     colSpan={3}
//                     data-tooltip="Approved by S K Sharma"
//                     tabIndex={0}
//                   >
//                     <strong className="text-gray-700">APPROVED BY:</strong>
//                     <br />
//                     <span className="font-medium text-gray-800">S K SHARMA</span>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//             {/* Custom Tooltip Styling */}
//             <style>{`
//               td[data-tooltip]:hover::after {
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
//               td[data-tooltip]:focus::after {
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
//         </div>
//       </section>

//       {/* Image Preview Modal */}
//       {previewImage && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
//           role="dialog"
//           aria-label="Image Preview Modal"
//         >
//           <div className="relative bg-white rounded-lg p-4 max-w-lg w-full">
//             <button
//               className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
//               onClick={closePreview}
//               aria-label="Close image preview"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//             <img
//               src={previewImage}
//               alt="Preview"
//               className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
//               onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400?text=Image+Not+Found')}
//             />
//           </div>
//         </div>
//       )}

//       {/* Footer Icons */}
//       <footer className="max-w-7xl mx-auto px-4 py-6 bg-gray-800 text-white rounded-lg shadow-md">
//         <div className="flex justify-end items-center gap-4 flex-wrap">
//           <div
//             className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition duration-300 transform hover:scale-110"
//             data-tooltip="Responsibility Indicator"
//             tabIndex={0}
//             aria-label="Responsibility Indicator"
//           >
//             <span className="text-white font-bold">R</span>
//           </div>
//           <div
//             className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition duration-300 transform hover:scale-110"
//             data-tooltip="Action Required"
//             tabIndex={0}
//             aria-label="Action Required Indicator"
//           >
//             <span className="text-white">●</span>
//           </div>
//           <div
//             className="flex items-center gap-2"
//             data-tooltip="Recording Status"
//             tabIndex={0}
//             aria-label="Recording Status"
//           >
//             <span className="text-sm">Recording</span>
//             <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center transform hover:scale-110 transition duration-300">
//               <span className="text-white">●</span>
//             </div>
//           </div>
//           <style>{`
//             div[data-tooltip]:hover::after,
//             div[data-tooltip]:focus::after {
//               content: attr(data-tooltip);
//               position: absolute;
//               bottom: 100%;
//               left: 50%;
//               transform: translateX(-50%);
//               background-color: rgba(0, 0, 0, 0.8);
//               color: white;
//               padding: 4px 8px;
//               border-radius: 4px;
//               font-size: 12px;
//               white-space: nowrap;
//               z-index: 10;
//             }
//           `}</style>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default FourMChangeResponsibility;



import React, { useState } from 'react';

const FourMChangeResponsibility: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageClick = (src: string) => {
    setPreviewImage(src);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  // Demo image URLs from Unsplash (professional headshots)
  const demoImages = {
    parvesh: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    sunil: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    shiv: 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    sanjay: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  };

  return (
    <div className="max-h-screen bg-gray-50 p-6 ">
      <div className="max-w-full mx-auto">
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-2xl">MS</span>
            </div>
            <h1 className="text-3xl font-bold text-blue-800">4M Change Responsibility</h1>
          </div>
        </div>

        {/* Main Responsibility Table */}
        <section className=" max-w-full mx-auto px-4 py-6 ">
          <div className="bg-white rounded-lg shadow-xl p-6 overflow-x-auto">
            <div className="rounded-b-3xl relative">
              <table
                className=" w-full min-w-[800px] border-collapse text-sm"
                aria-label=" 4M Change Responsibility Table"
              >
                <thead className=" bg-blue-700 text-white">
                  <tr>
                    <th
                      className="p-3  text-left font-semibold"
                      rowSpan={2}
                      scope="col"
                      aria-label="Designation"
                    >
                      DESIGNATION
                    </th>
                    <th
                      className="p-3 text-left font-semibold"
                      colSpan={4}
                      scope="colgroup"
                      aria-label="Department Areas"
                    >
                      DEPARTMENT (AREA)
                    </th>
                    <th
                      className="p-3 text-center font-semibold"
                      rowSpan={2}
                      scope="col"
                      aria-label="Alternate Information"
                    >
                      ALTERNATE TO EACH OTHER
                    </th>
                  </tr>
                  <tr>
                    <th className="p-3 text-left" scope="col">
                      ENGINEER
                    </th>
                    <th className="p-3 text-left" scope="col">
                      PRESS SHOP (SUPERVISOR)
                    </th>
                    <th className="p-3 text-left" scope="col">
                      PRESS SHOP (SUPERVISOR)
                    </th>
                    <th className="p-3 text-left" scope="col">
                      WELD SHOP (SUPERVISOR)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    className="hover:bg-blue-50 transition duration-300 transform hover:scale-[1.01]"
                    role="row"
                  >
                    <td
                      className="border border-gray-300 p-3 bg-yellow-100 font-semibold text-center"
                      data-tooltip="Personnel responsible for 4M changes"
                      tabIndex={0}
                    >
                      Personnel
                    </td>
                    <td className="border border-gray-300 p-3 relative" data-tooltip="Parvesh, Engineer">
                      <button
                        className="flex flex-col items-center justify-center h-36 w-full focus:outline-none"
                        onClick={() => handleImageClick(demoImages.parvesh)}
                        aria-label="Preview Parvesh's image"
                      >
                        <img
                          src={demoImages.parvesh}
                          alt="Parvesh"
                          className="w-24 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/96?text=Parvesh')}
                        />
                        <div className="text-center mt-2">
                          <span className="font-medium text-gray-800">PARVESH</span>
                           <br />
                          <span className="text-gray-600 text-xs">858823584</span>
                        </div>
                      </button>
                    </td>
                    <td
                      className="border border-gray-300 p-3 relative"
                      data-tooltip="Sunil, Press Shop Supervisor, Contact: 858823584"
                    >
                      <button
                        className="flex flex-col items-center justify-center h-36 w-full focus:outline-none"
                        onClick={() => handleImageClick(demoImages.sunil)}
                        aria-label="Preview Sunil's image"
                      >
                        <img
                          src={demoImages.sunil}
                          alt="Sunil"
                          className="w-24 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/96?text=Sunil')}
                        />
                        <div className="text-center mt-2">
                          <span className="font-medium text-gray-800">SUNIL</span>
                          <br />
                          <span className="text-gray-600 text-xs">858823584</span>
                        </div>
                      </button>
                    </td>
                    <td
                      className="border border-gray-300 p-3 relative"
                      data-tooltip="Shiv, Press Shop Supervisor, Contact: 958742477"
                    >
                      <button
                        className="flex flex-col items-center justify-center h-36 w-full focus:outline-none"
                        onClick={() => handleImageClick(demoImages.shiv)}
                        aria-label="Preview Shiv's image"
                      >
                        <img
                          src={demoImages.shiv}
                          alt="Shiv"
                          className="w-24 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/96?text=Shiv')}
                        />
                        <div className="text-center mt-2">
                          <span className="font-medium text-gray-800">SHIV</span>
                          <br />
                          <span className="text-gray-600 text-xs">958742477</span>
                        </div>
                      </button>
                    </td>
                    <td
                      className="border border-gray-300 p-3 relative"
                      data-tooltip="Sanjay, Weld Shop Supervisor, Contact: 946701718"
                    >
                      <button
                        className="flex flex-col items-center justify-center h-36 w-full focus:outline-none"
                        onClick={() => handleImageClick(demoImages.sanjay)}
                        aria-label="Preview Sanjay's image"
                      >
                        <img
                          src={demoImages.sanjay}
                          alt="Sanjay"
                          className="w-24 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/96?text=Sanjay')}
                        />
                        <div className="text-center mt-2">
                          <span className="font-medium text-gray-800">SANJAY</span>
                          <br />
                          <span className="text-gray-600 text-xs">946701718</span>
                        </div>
                      </button>
                    </td>
                    <td
                      className="border border-gray-300 p-3 text-center bg-yellow-100 font-semibold"
                      data-tooltip="Personnel are alternate contacts for each other"
                      tabIndex={0}
                    >
                      Alternate to<br />each other
                    </td>
                  </tr>
                  <tr
                    className="hover:bg-blue-50 transition duration-300 transform hover:scale-[1.01]"
                    role="row"
                  >
                    <td
                      className="border border-gray-300 p-3 text-center bg-blue-100 font-semibold"
                      data-tooltip="Assigned responsibilities"
                      tabIndex={0}
                    >
                      Responsibilities
                    </td>
                    <td
                      className="border border-gray-300 p-3 text-center bg-blue-100 font-semibold"
                      data-tooltip="Responsible for 4M recording"
                      tabIndex={0}
                    >
                      4M RECORDING RESPONSIBILITY
                    </td>
                    <td
                      className="border border-gray-300 p-3 text-center bg-blue-100 font-semibold"
                      data-tooltip="Responsible for 4M changes"
                      tabIndex={0}
                    >
                      4M CHANGE RESPONSIBILITY
                    </td>
                    <td
                      className="border border-gray-300 p-3 text-center bg-blue-100 font-semibold"
                      data-tooltip="Responsible for 4M changes"
                      tabIndex={0}
                    >
                      4M CHANGE RESPONSIBILITY
                    </td>
                    <td
                      className="border border-gray-300 p-3 text-center bg-blue-100 font-semibold"
                      data-tooltip="Responsible for 4M changes"
                      tabIndex={0}
                    >
                      4M CHANGE RESPONSIBILITY
                    </td>
                    <td className="border border-gray-300 p-3"></td>
                  </tr>
                  <tr
                    className="hover:bg-blue-50 transition duration-300 transform hover:scale-[1.01]"
                    role="row"
                  >
                    <td className="border border-gray-300 p-3" data-tooltip="Document preparer" tabIndex={0}>
                      <strong className="text-gray-700">PREPARED BY:</strong>
                      <br />
                      <span className="font-medium text-gray-800">PARVESH</span>
                    </td>
                    <td
                      className="border border-gray-300 p-3 text-center"
                      colSpan={2}
                      data-tooltip="Parvesh's signature"
                      tabIndex={0}
                    >
                      <span className="font-medium text-gray-800">PARVESH</span>
                    </td>
                    <td
                      className="border border-gray-300 p-3 text-center"
                      colSpan={3}
                      data-tooltip="Approved by S K Sharma"
                      tabIndex={0}
                    >
                      <strong className="text-gray-700">APPROVED BY:</strong>
                      <br />
                      <span className="font-medium text-gray-800">S K SHARMA</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* Custom Tooltip Styling */}
              <style>{`
                td[data-tooltip]:hover::after {
                  content: attr(data-tooltip);
                  position: absolute;
                  bottom: 100%;
                  left: 50%;
                  transform: translateX(-50%);
                  background-color: rgba(0, 0, 0, 0.8);
                  color: white;
                  padding: 4px 8px;
                  border-radius: 4px;
                  font-size: 12px;
                  white-space: nowrap;
                  z-index: 10;
                }
                td[data-tooltip]:focus::after {
                  content: attr(data-tooltip);
                  position: absolute;
                  bottom: 100%;
                  left: 50%;
                  transform: translateX(-50%);
                  background-color: rgba(0, 0, 0, 0.8);
                  color: white;
                  padding: 4px 8px;
                  border-radius: 4px;
                  font-size: 12px;
                  white-space: nowrap;
                  z-index: 10;
                }
              `}</style>
            </div>
          </div>
        </section>

        {/* Image Preview Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            role="dialog"
            aria-label="Image Preview Modal"
          >
            <div className="relative bg-white rounded-lg p-4 max-w-lg w-full">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={closePreview}
                aria-label="Close image preview"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
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

        {/* Footer Icons */}
        {/* <footer className="max-w-7xl mx-auto px-4 py-6 bg-gray-800 text-white rounded-lg shadow-md">
          <div className="flex justify-end items-center gap-4 flex-wrap">
            <div
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition duration-300 transform hover:scale-110"
              data-tooltip="Responsibility Indicator"
              tabIndex={0}
              aria-label="Responsibility Indicator"
            >
              <span className="text-white font-bold">R</span>
            </div>
            <div
              className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition duration-300 transform hover:scale-110"
              data-tooltip="Action Required"
              tabIndex={0}
              aria-label="Action Required Indicator"
            >
              <span className="text-white">●</span>
            </div>
            <div
              className="flex items-center gap-2"
              data-tooltip="Recording Status"
              tabIndex={0}
              aria-label="Recording Status"
            >
              <span className="text-sm">Recording</span>
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center transform hover:scale-110 transition duration-300">
                <span className="text-white">●</span>
              </div>
            </div>
            <style>{`
              div[data-tooltip]:hover::after,
              div[data-tooltip]:focus::after {
                content: attr(data-tooltip);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 10;
              }
            `}</style>
          </div>
        </footer> */}
      </div>
    </div>
  );
};

export default FourMChangeResponsibility;