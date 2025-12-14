"use client";
import { useState } from "react";
import FIleCard from "./FIleCard";

export default function PrintLoader() {
  const [files, setFiles] = useState([]);



  function calculateAmount(){

    console.log(files)
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  function handleFiles(e) {
    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles
      .filter(file => allowedTypes.includes(file.type))
      .map(file => ({
        file,
        copies: 1,
        color: false,      // false = B/W
        doubleSide: false, // false = single side
      }));

    setFiles(prev => [...prev, ...validFiles]);
  }

  function update(index, key, value) {
    setFiles(prev =>
      prev.map((f, i) =>
        i === index ? { ...f, [key]: value } : f
      )
    );
  }

  function removeFile(index) {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="max-w-xl space-y-4 ">

      {/* Upload Box */}
      <label className=" rounded-lg p-5 text-center cursor-pointer">
        <input
          type="file"
          multiple
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleFiles}
        />
        <p className="text-sm text-gray-600">
          Upload PDF or DOCX files
        </p>
      </label>

      {/* File Cards */}
      {files.map((item, index) => (
        <FIleCard item={item} key={index} update={update} removeFile={removeFile} index={index}/>
      ))}



      <button className="px-3 py-3 w-full bg-green-500 rounded-2xl mt-3 text-white font-bold cursor-pointer"  onClick={calculateAmount}>
        Calculate Amount
      </button>
    </div>



  );
}
