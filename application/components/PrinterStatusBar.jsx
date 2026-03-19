import { SIMPLE_STATUS } from "../constants/status";

const PrinterStatus = ({ printer }) => {
  if (!printer) return null; // Defensive check
  
  const status = SIMPLE_STATUS[printer.status] || SIMPLE_STATUS.ERROR;
  const isReady = printer.status === "READY";

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm flex flex-col relative overflow-hidden">
      
      {/* Decorative colored edge based on status */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isReady ? 'bg-green-500' : 'bg-red-500'}`} />

      <div className="flex items-center justify-between pl-1">
        <div>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Printer Status</p>
          <div className="flex items-center gap-2">
             <h3 className="text-sm font-bold text-gray-800">
               {printer.name}
             </h3>
             <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-gray-600">
               {printer.type}
             </span>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
             <span className={`w-2 h-2 rounded-full ${status.color}`} />
             <p className={`text-[11px] font-medium ${status.text}`}>
               {status.label}
             </p>
          </div>
        </div>

        {/* Status Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isReady ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
           </svg>
        </div>
      </div>

      {!isReady && (
        <div className="mt-3 pl-1 text-[11px]">
          <div className="p-2 bg-red-50/50 border border-red-50 rounded-lg">
             <p className="text-red-700 font-medium">
               <span className="font-semibold">Reason:</span> {printer.reason || "Printer offline"}
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrinterStatus;
