"use client"

import React, { useState } from 'react'

const FileCard = ({item, update, removeFile, index}) => {
    const [customValueClicked, setCustomValueClicked] = useState(false)
    
    // Theme classes for inputs to look custom and elegant
    const selectClass = "h-9 px-3 w-full text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-50 outline-none transition-colors appearance-none cursor-pointer hover:bg-white"
    
  return (
    <div className="relative rounded-2xl p-5 bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md group">
      
      {/* File Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3 overflow-hidden pr-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
             <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
             </svg>
          </div>
          <div className="min-w-0">
             <h3 className="font-semibold text-gray-800 truncate text-sm">
               {item.file.name}
             </h3>
             <p className="text-xs text-gray-500 mt-0.5">
               {(item.file.size / 1024 / 1024).toFixed(2)} MB
             </p>
          </div>
        </div>
        <button
          onClick={() => removeFile(item)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none shrink-0"
          title="Remove file"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 border-t border-gray-50 pt-4">
        
        {/* Copies */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide ml-0.5">Copies</label>
          <div className="relative">
            <select 
              className={selectClass}
              value={item.copies || 1}
              onChange={e => update(item.id, "copies", Number.parseInt(e.target.value))}
            >
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {/* Color Mode */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide ml-0.5">Color</label>
          <div className="relative">
            <select
              className={selectClass}
              value={item.color || "BLACK_WHITE"}
              onChange={e => update(item.id, "color", e.target.value)}
            >
              <option value="BLACK_WHITE">B&W</option>
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {/* Orientation */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide ml-0.5">Orientation</label>
          <div className="relative">
            <select
              className={selectClass}
              value={item.orientation || "PORTRAIT"}
              onChange={e => update(item.id, "orientation", e.target.value)}
            >
              <option value="PORTRAIT">Portrait</option>
              <option value="LANDSCAPE">Landscape</option>
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {/* Pages Range */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide ml-0.5">Pages Range</label>
          <div className="relative">
            <select
              className={selectClass}
              value={item.pagesRange || "ALL"}
              onChange={e => {
                update(item.id, "pagesRange", e.target.value)
                setCustomValueClicked(e.target.value === "CUSTOM")
              }}
            >
              <option value="ALL">All Pages</option>
              <option value="ODD">Odd Only</option>
              <option value="EVEN">Even Only</option>
              <option value="CUSTOM">Custom Range</option>
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Conditionally Rendered Options */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3 border-t border-gray-100 pt-3">
        
        {item.color === "BLACK_WHITE" && (
          <label className="flex items-center gap-2 cursor-pointer group/cb">
            <div className="relative flex items-center justify-center w-4 h-4">
              <input
                className="peer appearance-none w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-green-100 checked:bg-green-600 checked:border-green-600 transition-colors cursor-pointer"
                type="checkbox"
                checked={item.doubleSide || false}
                onChange={e => update(item.id, "doubleSide", e.target.checked)}
              />
              <svg className="absolute w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm text-gray-600 group-hover/cb:text-gray-900 transition-colors">Print on both sides (Duplex)</span>
          </label>
        )}

        {customValueClicked && (
          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="text-[11px] font-semibold text-gray-500 uppercase">Range:</span>
            <input
              type="text"
              className="h-8 w-24 bg-gray-50 border border-gray-200 rounded-md px-2 text-sm outline-none focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-50 transition-colors"
              placeholder="e.g. 1-5, 8"
              value={item.pagesCustomValue || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9-, ]*$/.test(value)) {
                  update(item.id, "pagesCustomValue", value);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Upload Progress Bar */}
      <div className="space-y-1.5 mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
          <span>
            {item.uploadStatus === "preparing" && "Preparing document"}
            {item.uploadStatus === "uploading" && "Uploading to server"}
            {item.uploadStatus === "uploaded" && <span className="text-green-600 flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Uploaded successfully</span>}
            {item.uploadStatus === "error" && <span className="text-red-600">Upload failed</span>}
          </span>
          <span className={item.uploadStatus === "uploaded" ? "text-green-600" : ""}>{item.uploadProgress || 0}%</span>
        </div>
        
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              item.uploadStatus === "uploaded"
                ? "bg-green-500"
                : item.uploadStatus === "error"
                ? "bg-red-500"
                : "bg-blue-500" 
            }`}
            style={{ width: `${item.uploadProgress || 0}%` }}
          />
        </div>
      </div>

    </div>
  )
}

export default FileCard;