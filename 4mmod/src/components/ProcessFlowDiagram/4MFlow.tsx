import React from 'react';
import { ArrowDown, Diamond } from 'lucide-react';

const FourMChangeProcedure = () => {
  const steps = [
    {
      sn: 1,
      input: "Make the list of changes related to Man, Machine, Material, Method in shop floor",
      output: "4M Changes",
      resp: "Head Production / Quality",
      checkpoint: "List down the Planned & Un planned changes in shop floor\nMake list of break down to be consider in 4M change and list of abnormal situations",
      document: "4M Change identification(plan)\nMS-F-4M-WI-01\nList of break down\nMS-F-4M-02\nHandling of Abnormal",
      freq: "Once in a year"
    },
    {
      sn: 2,
      input: "If any change occurred during process in shop floor.",
      output: "",
      resp: "Quality/Production Supervisor",
      checkpoint: "At occurrence of 4M change in process inform to concerned functional head as per 4M change information flow sheet",
      document: "4M change Information flow sheet\nMS-F-4M-03",
      freq: ""
    },
    {
      sn: 3,
      input: "Is customer information",
      decision: true,
      output: "4M Change detail",
      resp: "Head Production / Quality",
      checkpoint: "Update the 4M change display board in shop floor and identify the 4M change on machine by defined colour coding tags and update in 4M change records as per 4M change identification sheet",
      document: "4M change information flow sheet\nMS-F-4M-03\n4M Change display board\nMS-F-4M-08\nChanges(Red)\nNo changes(Green)",
      freq: "During occurrence of 4M changes in shop floor"
    },
    {
      sn: 4,
      input: "Inform to customer",
      output: "",
      resp: "",
      checkpoint: "",
      document: "",
      freq: ""
    },
    {
      sn: 5,
      input: "Note down the 4M change details and update on 4M change board and machine with in 30 minutes",
      output: "Type of change",
      resp: "Quality/Production Supervisor",
      checkpoint: "Move the suspected parts in suspected part area with 4M change identification tags and inspection to be done as per final quality inspection standard and separate out the NC parts and send in red",
      document: "4M change inspection report\nMS-F-4M-06",
      freq: ""
    },
    {
      sn: 6,
      input: "Record the 4M change details in record sheet as per 4M change work instructions.",
      output: "4M change records",
      resp: "Quality supervisor",
      checkpoint: "bin area for analysis",
      document: "4M change record sheet",
      freq: ""
    },
    {
      sn: 7,
      input: "Identify the 4M change suspected parts with identification tag and keep in suspected part area",
      output: "Suspected Parts",
      resp: "Quality/Production Supervisor",
      checkpoint: "Put identification mark on ok parts after inspection before dispatch\n\ninform to customer if required and follow-up the 4M change parts till customer end",
      document: "4M change identification tag\nMS-F-4M-04",
      freq: ""
    },
    {
      sn: 8,
      input: "Maintain the record of 4M change lot traceability register linked with invoice number.",
      output: "Lot traceability",
      resp: "Final quality supervisor",
      checkpoint: "4M change lot traceability for suspected parts will be linked with invoice no.\n\n4M change summary sheet to be make",
      document: "Suspected lot traceability sheet\nMS-F-4M-07\n4M change summary sheet MS-F-4M-05A",
      freq: "4M changes summarise in end of the month"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-lg">
        {/* Header */}
        <div className="grid grid-cols-12 border-b-2 border-gray-800">
          <div className="col-span-1 border-r border-gray-300 p-4 bg-green-50 flex items-center justify-center">
            <div className="text-2xl font-bold text-green-600">LOGO</div>
          </div>
          <div className="col-span-8 p-4 flex items-center justify-center">
            <h1 className="text-3xl font-bold">4M CHANGE PROCEDURE</h1>
          </div>
          <div className="col-span-3 border-l border-gray-300 text-xs">
            <div className="grid grid-cols-2 h-full">
              <div className="p-2 border-b border-gray-300"><strong>DocNo.</strong></div>
              <div className="p-2 border-b border-gray-300">MS/4M/PR/05</div>
              <div className="p-2 border-b border-gray-300"><strong>Rev.No</strong></div>
              <div className="p-2 border-b border-gray-300">01</div>
              <div className="p-2"><strong>Date</strong></div>
              <div className="p-2">28.02.20</div>
            </div>
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-12 border-b-2 border-gray-800 bg-gray-100">
          <div className="col-span-1 border-r border-gray-300 p-3 text-center font-bold">S.N</div>
          <div className="col-span-4 border-r border-gray-300 p-3 text-center font-bold">INPUT (ACTIVITY)</div>
          <div className="col-span-1 border-r border-gray-300 p-3 text-center font-bold">OUTPUT</div>
          <div className="col-span-2 border-r border-gray-300 p-3 text-center font-bold">RESP.(WHO)</div>
          <div className="col-span-2 border-r border-gray-300 p-3 text-center font-bold">CHECK POINT (WHAT)</div>
          <div className="col-span-1 border-r border-gray-300 p-3 text-center font-bold bg-yellow-200">DOCUME (HOW)</div>
          <div className="col-span-1 p-3 text-center font-bold">FREQ. (WHEN)</div>
        </div>

        {/* Step 1 */}
        <div className="grid grid-cols-12 border-b border-gray-300">
          <div className="col-span-1 border-r border-gray-300 p-4 text-center font-bold text-lg">1</div>
          <div className="col-span-4 border-r border-gray-300 p-4">
            <div className="border-2 border-gray-400 p-3 rounded">
              {steps[0].input}
            </div>
          </div>
          <div className="col-span-1 border-r border-gray-300 p-4 text-center font-semibold">
            {steps[0].output}
          </div>
          <div className="col-span-2 border-r border-gray-300 p-4 text-sm">
            {steps[0].resp}
          </div>
          <div className="col-span-2 border-r border-gray-300 p-4 text-sm whitespace-pre-line">
            {steps[0].checkpoint}
          </div>
          <div className="col-span-1 border-r border-gray-300 p-4 text-xs whitespace-pre-line">
            {steps[0].document}
          </div>
          <div className="col-span-1 p-4 text-xs text-center">
            {steps[0].freq}
          </div>
        </div>

        {/* Arrow Down */}
        <div className="grid grid-cols-12 border-b border-gray-300">
          <div className="col-span-1 border-r border-gray-300"></div>
          <div className="col-span-4 border-r border-gray-300 p-2 flex justify-center">
            <ArrowDown className="w-6 h-6" />
          </div>
          <div className="col-span-7"></div>
        </div>

        {/* Step 2 */}
        <div className="grid grid-cols-12 border-b border-gray-300">
          <div className="col-span-1 border-r border-gray-300 p-4 text-center font-bold text-lg">2</div>
          <div className="col-span-4 border-r border-gray-300 p-4">
            <div className="border-2 border-gray-400 p-3 rounded">
              {steps[1].input}
            </div>
          </div>
          <div className="col-span-1 border-r border-gray-300 p-4"></div>
          <div className="col-span-2 border-r border-gray-300 p-4 text-sm">
            {steps[1].resp}
          </div>
          <div className="col-span-2 border-r border-gray-300 p-4 text-sm">
            {steps[1].checkpoint}
          </div>
          <div className="col-span-1 border-r border-gray-300 p-4 text-xs whitespace-pre-line">
            {steps[1].document}
          </div>
          <div className="col-span-1 p-4"></div>
        </div>

        {/* Arrow Down */}
        <div className="grid grid-cols-12 border-b border-gray-300">
          <div className="col-span-1 border-r border-gray-300"></div>
          <div className="col-span-4 border-r border-gray-300 p-2 flex justify-center">
            <ArrowDown className="w-6 h-6" />
          </div>
          <div className="col-span-7"></div>
        </div>

        {/* Step 3 - Decision Diamond */}
        <div className="grid grid-cols-12 border-b border-gray-300">
          <div className="col-span-1 border-r border-gray-300 p-4 text-center font-bold text-lg">3</div>
          <div className="col-span-4 border-r border-gray-300 p-4">
            <div className="relative flex items-center justify-center h-32">
              <div className="absolute w-32 h-32 border-2 border-gray-600 bg-white transform rotate-45"></div>
              <div className="relative z-10 text-center text-sm px-4">
                Is customer<br/>information
              </div>
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-xs font-semibold">no</div>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold">yes</div>
            </div>
          </div>
          <div className="col-span-1 border-r border-gray-300 p-4 text-center font-semibold">
            {steps[2].output}
          </div>
          <div className="col-span-2 border-r border-gray-300 p-4 text-sm">
            {steps[2].resp}
          </div>
          <div className="col-span-2 border-r border-gray-300 p-4 text-sm whitespace-pre-line">
            {steps[2].checkpoint}
          </div>
          <div className="col-span-1 border-r border-gray-300 p-4 text-xs whitespace-pre-line">
            {steps[2].document}
          </div>
          <div className="col-span-1 p-4 text-xs">
            {steps[2].freq}
          </div>
        </div>

        {/* Arrow Down from decision (yes path) */}
        <div className="grid grid-cols-12 border-b border-gray-300 relative" style={{height: '40px'}}>
          <div className="col-span-1 border-r border-gray-300"></div>
          <div className="col-span-4 border-r border-gray-300 p-2 flex justify-center">
            <ArrowDown className="w-6 h-6" />
          </div>
          <div className="col-span-7 relative">
            {/* Horizontal line going right from decision diamond (no path) */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600" style={{width: 'calc(100% - 10px)', height: '2px'}}></div>
            {/* Right arrow indicator for "no" path */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="w-0 h-0 border-l-8 border-l-gray-600 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          </div>
        </div>

        {/* Step 4 with vertical line going down on the right */}
        <div className="grid grid-cols-12 border-b border-gray-300 relative">
          <div className="col-span-1 border-r border-gray-300 p-4 text-center font-bold text-lg">4</div>
          <div className="col-span-4 border-r border-gray-300 p-4">
            <div className="border-2 border-gray-400 p-3 rounded">
              {steps[3].input}
            </div>
          </div>
          <div className="col-span-7 relative">
            {/* Vertical line continuing down on right side */}
            <div className="absolute bg-gray-600" style={{width: '2px', height: '100%', right: '10px'}}></div>
          </div>
        </div>

        {/* Arrow Down from step 4 with continuing vertical line on right */}
        <div className="grid grid-cols-12 border-b border-gray-300 relative" style={{height: '40px'}}>
          <div className="col-span-1 border-r border-gray-300"></div>
          <div className="col-span-4 border-r border-gray-300 p-2 flex justify-center">
            <ArrowDown className="w-6 h-6" />
          </div>
          <div className="col-span-7 relative">
            {/* Vertical line continuing down on right side */}
            <div className="absolute bg-gray-600" style={{width: '2px', height: '100%', right: '10px'}}></div>
          </div>
        </div>

        {/* Merging point - horizontal line from right to center flow */}
        <div className="grid grid-cols-12 border-b border-gray-300 relative" style={{height: '40px'}}>
          <div className="col-span-1 border-r border-gray-300"></div>
          <div className="col-span-11 relative">
            {/* Horizontal line from right edge to center */}
            <div className="absolute top-1/2 transform -translate-y-1/2 bg-gray-600" style={{width: 'calc(36% + 10px)', height: '2px', right: '10px'}}></div>
            {/* Vertical line segment at right edge */}
            <div className="absolute bg-gray-600" style={{width: '2px', height: '50%', right: '10px', top: '0'}}></div>
            {/* Arrow pointing down at the junction */}
            <div className="absolute top-1/2 transform -translate-y-1/2" style={{right: 'calc(64% + 10px)'}}>
              <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-8 border-t-gray-600"></div>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="grid grid-cols-12 border-b border-gray-300">
          <div className="col-span-1 border-r border-gray-300 p-4 text-center font-bold text-lg">5</div>
          <div className="col-span-4 border-r border-gray-300 p-4">
            <div className="border-2 border-gray-400 p-3 rounded text-sm">
              {steps[4].input}
            </div>
          </div>
          <div className="col-span-1 border-r border-gray-300 p-4 text-center font-semibold">
            {steps[4].output}
          </div>
          <div className="col-span-2 border-r border-gray-300 p-4 text-sm">
            {steps[4].resp}
          </div>
          <div className="col-span-2 border-r border-gray-300 p-4 text-sm">
            {steps[4].checkpoint}
          </div>
          <div className="col-span-1 border-r border-gray-300 p-4 text-xs whitespace-pre-line">
            {steps[4].document}
          </div>
          <div className="col-span-1 p-4"></div>
        </div>

        {/* Arrow Down */}
        <div className="grid grid-cols-12 border-b border-gray-300">
          <div className="col-span-1 border-r border-gray-300"></div>
          <div className="col-span-4 border-r border-gray-300 p-2 flex justify-center">
            <ArrowDown className="w-6 h-6" />
          </div>
          <div className="col-span-7"></div>
        </div>

        {/* Step 6 */}
        <div className="grid grid-cols-12 border-b border-gray-300">
          <div className="col-span-1 border-r border-gray-300 p-4 text-center font-bold text-lg">6</div>
          <div className="col-span-4 border-r border-gray-300 p-4">
            <div className="border-2 border-gray-400 p-3 rounded text-sm">
              {steps[5].input}
            </div>
          </div>
          <div className="col-span-1 border-r border-gray-300 p-4 text-center font-semibold">
            {steps[5].output}
          </div>
          <div className="col-span-2 border-r border-gray-300 p-4 text-sm">
            {steps[5].resp}
          </div>
          <div className="col-span-2 border-r border-gray-300 p-4 text-sm">
            {steps[5].checkpoint}
          </div>
          <div className="col-span-1 border-r border-gray-300 p-4 text-xs">
            {steps[5].document}
          </div>
          <div className="col-span-1 p-4"></div>
        </div>

        {/* Arrow Down */}
        <div className="grid grid-cols-12 border-b border-gray-300">
          <div className="col-span-1 border-r border-gray-300"></div>
          <div className="col-span-4 border-r border-gray-300 p-2 flex justify-center">
            <ArrowDown className="w-6 h-6" />
          </div>
          <div className="col-span-7"></div>
        </div>

        {/* Step 7 */}
        <div className="grid grid-cols-12 border-b border-gray-300">
          <div className="col-span-1 border-r border-gray-300 p-4 text-center font-bold text-lg">7</div>
          <div className="col-span-4 border-r border-gray-300 p-4">
            <div className="border-2 border-gray-400 p-3 rounded text-sm">
              {steps[6].input}
            </div>
          </div>
          <div className="col-span-1 border-r border-gray-300 p-4 text-center font-semibold">
            {steps[6].output}
          </div>
          <div className="col-span-2 border-r border-gray-300 p-4 text-sm">
            {steps[6].resp}
          </div>
          <div className="col-span-2 border-r border-gray-300 p-4 text-sm whitespace-pre-line">
            {steps[6].checkpoint}
          </div>
          <div className="col-span-1 border-r border-gray-300 p-4 text-xs whitespace-pre-line bg-yellow-100">
            {steps[6].document}
          </div>
          <div className="col-span-1 p-4"></div>
        </div>

        {/* Arrow Down */}
        <div className="grid grid-cols-12 border-b border-gray-300">
          <div className="col-span-1 border-r border-gray-300"></div>
          <div className="col-span-4 border-r border-gray-300 p-2 flex justify-center">
            <ArrowDown className="w-6 h-6" />
          </div>
          <div className="col-span-7"></div>
        </div>

        {/* Step 8 */}
        <div className="grid grid-cols-12 border-b border-gray-300">
          <div className="col-span-1 border-r border-gray-300 p-4 text-center font-bold text-lg">8</div>
          <div className="col-span-4 border-r border-gray-300 p-4">
            <div className="border-2 border-gray-400 p-3 rounded text-sm">
              {steps[7].input}
            </div>
          </div>
          <div className="col-span-1 border-r border-gray-300 p-4 text-center font-semibold">
            {steps[7].output}
          </div>
          <div className="col-span-2 border-r border-gray-300 p-4 text-sm">
            {steps[7].resp}
          </div>
          <div className="col-span-2 border-r border-gray-300 p-4 text-sm whitespace-pre-line">
            {steps[7].checkpoint}
          </div>
          <div className="col-span-1 border-r border-gray-300 p-4 text-xs whitespace-pre-line">
            {steps[7].document}
          </div>
          <div className="col-span-1 p-4 text-xs">
            {steps[7].freq}
          </div>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-12 border-t-2 border-gray-800 bg-gray-50">
          <div className="col-span-6 p-3 border-r border-gray-300">
            <strong>Prepared By:</strong> S.K Sharma
          </div>
          <div className="col-span-3 p-3 border-r border-gray-300">
            <strong>Approved by :</strong>
          </div>
          <div className="col-span-3 p-3">
            <strong>Issued by :</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FourMChangeProcedure;