"use client";
import { v4 as uuid } from "uuid"
import { useEffect, useState } from "react";
import { calculateAmountServer, getSignedUploadUrls } from "./action";
import PrinterStatus from "../../components/PrinterStatusBar";
import FileCard from "../../components/FIleCard";
import { uploadToGCS } from "../../lib/uploadToGCS";
import { deleteFile } from "./action.server";
import PaymentBox from "../../components/PaymentBox";

// A sleek inline spinner
const SleekSpinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Homepage = () => {
  const [BW_PRINTER_STATUS, setBW_PRINTER_STATUS] = useState("READY");
  const [isCalculating, setIsCalculating] = useState(false);
  const [showPayBox, setShowPayBox] = useState(false);
  const [amount, setAmount] = useState("");
  const [printer, setPrinter] = useState();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchPrinterStatus = async () => {
      try {
        const res = await fetch("/api/printer/condition?type=BW_1");
        const data = await res.json();

        if (data.success) {
          const { printer } = data;
          setPrinter(printer);
          setBW_PRINTER_STATUS(printer.status);
        }
      } catch (error) {
        console.error("Failed to fetch printer status", error);
      }
    };

    fetchPrinterStatus();
  }, []);

  const allowedTypes = ["application/pdf"];

  async function calculateAmount() {
    setIsCalculating(true);
    const a = await calculateAmountServer(files);
    setAmount(a);
    setIsCalculating(false);
    setShowPayBox(true);
  }

  async function handleFiles(e) {
    const choosedFiles = Array.from(e.target.files).filter((file) =>
      allowedTypes.includes(file.type) && file.size < 10000000
    );

    const selectedFiles = choosedFiles.map(file => (
      {
        file,
        id: uuid()
      }
    ))

    if (selectedFiles.length === 0) return;

    const tempFiles = selectedFiles.map(({ file, id }) => ({
      id,
      file,
      uploadUrl: null,
      fileUrl: null,
      copies: 1,
      color: "BLACK_WHITE",
      doubleSide: false,
      orientation: "PORTRAIT",
      pagesRange: "ALL",
      pagesCustomValue: "",
      uploadStatus: "preparing",
      uploadProgress: 0,
    }));

    setFiles((prev) => [...prev, ...tempFiles]);
    e.target.value = "";

    try {
      const fileMetaData = selectedFiles.map(({ file, id }) => ({
        id,
        type: file.type,
        name: file.name,
      }));
      const urls = await getSignedUploadUrls(fileMetaData);
      const urlMap = new Map(urls.map(u => [u.id, u]));

      setFiles((prev) =>
        prev.map((f) => {
          const match = urlMap.get(f.id);
          return match
            ? {
              ...f,
              uploadUrl: match.uploadUrl,
              fileUrl: match.fileUrl,
              uploadStatus: "uploading",
              uploadProgress: 0,
            }
            : f;
        })
      );

      tempFiles.forEach((tempFile) => {
        const match = urlMap.get(tempFile.id);
        if (!match) return;

        uploadToGCS({
          file: tempFile.file,
          uploadUrl: match.uploadUrl,
          onProgress: (p) => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === tempFile.id ? { ...f, uploadProgress: p } : f
              )
            );
          },
          onSuccess: () => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === tempFile.id
                  ? { ...f, uploadStatus: "uploaded", uploadProgress: 100 }
                  : f
              )
            );
          },
          onError: () => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === tempFile.id ? { ...f, uploadStatus: "error" } : f
              )
            );
          },
        });
      });
    } catch (err) {
      console.log("Upload init failed", err);
    }
  }

  function update(id, key, value) {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  }

  async function removeFile(item) {
    setFiles((prev) => prev.filter((f) => f.id !== item.id));
    if (item.fileUrl) {
      await deleteFile(item.fileUrl);
    }
  }

  return (
    <section className="flex flex-col items-center py-6 w-full min-h-screen px-4 font-sans bg-gray-50/50">

      {files.length > 0 && (
        <div className="w-full max-w-4xl mx-auto space-y-5 lg:mt-4 pb-32">

          <div className="flex items-center justify-between mb-2 mt-2 px-1">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Print Queue</h2>
            <span className="bg-green-50 text-green-700 font-semibold px-3 py-1 border border-green-100 rounded-lg text-sm shadow-sm">{files.length} Document{files.length > 1 ? 's' : ''}</span>
          </div>

          <PaymentBox
            open={showPayBox}
            onClose={() => setShowPayBox(false)}
            amount={amount}
            files={files}
          />

          <div className="space-y-4">
            {files.map((item, index) => (
              <FileCard
                key={index}
                item={item}
                index={index}
                update={update}
                removeFile={removeFile}
              />
            ))}
          </div>

          <label className="cursor-pointer block mt-4 group">
            <input
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={handleFiles}
            />
            <div className="border border-dashed border-gray-300 bg-white hover:bg-green-50 hover:border-green-400 hover:text-green-700 rounded-2xl py-6 text-center font-semibold text-gray-500 transition-all flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow active:scale-[0.995]">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-green-600 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              </div>
              <span className="text-sm">Add another document</span>
            </div>
          </label>

          <div className="pt-6 max-w-md mx-auto">
            <PrinterStatus printer={printer} />
          </div>

          {BW_PRINTER_STATUS === "READY" && (
            <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 sm:p-5 z-40 shadow-[0_-4px_20px_rgb(0,0,0,0.04)] flex justify-center">
              <div className="w-full max-w-3xl">
                <button
                  disabled={
                    isCalculating ||
                    !files.every((file) => file.uploadStatus === "uploaded")
                  }
                  onClick={calculateAmount}
                  className={`w-full py-3.5 sm:py-4 rounded-xl text-white text-base font-semibold transition-all flex justify-center items-center shadow-md active:scale-[0.99] ${isCalculating || !files.every((file) => file.uploadStatus === "uploaded")
                    ? "bg-gray-300 cursor-not-allowed shadow-none text-gray-500"
                    : "bg-green-600 hover:bg-green-700 hover:shadow-lg cursor-pointer"
                    }`}
                >
                  {isCalculating ? (
                    <div className="flex justify-center items-center gap-2">
                      <SleekSpinner /> Calculating total...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Proceed to Pay
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {files.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-3xl mx-auto px-4">

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              Upload Documents
            </h2>
            <p className="text-gray-500 font-medium max-w-md mx-auto text-sm mt-1.5">
              Select your PDF files and customize your print settings.
            </p>
          </div>

          <label className="w-full relative group cursor-pointer block max-w-xl mx-auto">
            <input
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={handleFiles}
            />
            {/* Soft background glow on hover */}
            <div className="absolute inset-0 bg-green-50/50 rounded-[2rem] transform scale-[0.98] group-hover:scale-100 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 blur-lg" />

            {/* Dashed dropzone */}
            <div className="absolute inset-0 border-2 border-dashed border-gray-200 group-hover:border-green-400 group-hover:bg-green-50/30 rounded-3xl transition-all duration-200" />

            <div className="relative py-16 px-6 flex flex-col items-center justify-center space-y-4 text-center z-10 bg-white/60 backdrop-blur-sm rounded-3xl">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-green-500 group-hover:scale-105 group-hover:shadow transition-all duration-300">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>

              <div>
                <p className="text-lg font-bold text-gray-800">Choose files or drag & drop</p>
                <p className="text-xs font-medium text-gray-500 mt-1 flex items-center justify-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  PDF only, up to 10MB each
                </p>
              </div>

              <div className="inline-flex items-center justify-center px-6 py-2.5 mt-2 bg-green-400 text-white text-sm font-semibold rounded-xl group-hover:bg-green-400 transition-colors shadow-sm">
                Browse Files
              </div>
            </div>
          </label>

        </div>
      )}
    </section>
  );
};

export default Homepage;
