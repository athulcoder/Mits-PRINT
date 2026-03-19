"use client";
import { IoMdCheckmarkCircleOutline, IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";

import { FiPackage, FiClock, FiShield } from "react-icons/fi";
import { MdOutlineVerified, MdPendingActions } from "react-icons/md";
import { formatDate } from "../utils/dateFormater";
import { RiPrinterCloudFill } from "react-icons/ri";

export default function MyPrintsPage({data}) {
  const [showPopup, setShowPopup] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState();
  const [handledOrderId, setHandledOrderId] = useState(null);

  const searchParams = useSearchParams();
  const order_id = searchParams.get("order_id");


  useEffect(() => {
    setAllOrders(data || [])
    if (!order_id) return;
    if (handledOrderId === order_id) return;

    setHandledOrderId(order_id);
    showOrderPlacedMessage(order_id);
    
  }, [order_id, handledOrderId, data]);

  const showOrderPlacedMessage = async (orderId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/myorders?order_id=${orderId}`,
        {
          method: "GET",
        }
      );
  
      const mes = await res.json();
      if (mes.success) {
        setCurrentOrder(mes.data);
        setShowPopup(true);
      }
    } catch (err) {
      console.error("Failed to fetch recent order", err);
    }
  }; 

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 bg-gray-50/30">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Heading */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-green-600">
              <FiPackage className="text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                My Prints
              </h2>
              <p className="text-sm font-medium text-gray-500">
                Track and manage your recent print orders
              </p>
            </div>
          </div>
          
          {allOrders?.length > 0 && (
            <span className="bg-green-50 text-green-700 font-semibold px-3.5 py-1.5 border border-green-100 rounded-lg text-sm shadow-sm self-start sm:self-auto">
              {allOrders.length} Order{allOrders.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Empty State */}
        {(!allOrders || allOrders.length === 0) && (
          <div className="mt-12 flex flex-col items-center justify-center px-4 py-16 bg-white border border-dashed border-gray-200 rounded-[2rem]">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-400 mb-5 shadow-sm">
              <FiPackage className="text-4xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">No Orders Found</h2>
            <p className="text-sm text-gray-500 mt-2 font-medium max-w-xs text-center leading-relaxed">
              You haven't placed any print orders yet. Once you do, they will securely appear here.
            </p>
          </div>
        )}

        {/* Orders List */}
        {allOrders?.length > 0 && (
          <div className="space-y-4">
            {allOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                {/* Info Section */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50/50 rounded-xl flex items-center justify-center text-green-600 shrink-0 border border-green-50">
                    <FiPackage className="text-xl" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Order ID</p>
                    <p className="font-mono text-sm sm:text-base font-bold text-gray-800">{order.id}</p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mt-1">
                      <FiClock className="text-gray-400" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center">
                  {order.status === "PENDING" && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-yellow-50 border border-yellow-100/50 text-yellow-700 rounded-xl shadow-sm">
                      <MdPendingActions className="text-lg" />
                      <span className="text-xs font-bold tracking-wide">WAITING</span>
                    </div>
                  )}

                  {order.status === "PRINTING" && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 border border-blue-100/50 text-blue-700 rounded-xl shadow-sm">
                      <RiPrinterCloudFill className="text-lg" />
                      <span className="text-xs font-bold tracking-wide">PRINTING</span>
                    </div>
                  )}

                  {order.status === "PRINTED" && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-green-50 border border-green-100/50 text-green-700 rounded-xl shadow-sm">
                      <FaThumbsUp className="text-lg" />
                      <span className="text-xs font-bold tracking-wide">READY</span>
                    </div>
                  )}
                </div>

                {/* OTP Block */}
                <div className="flex flex-col items-center justify-center bg-gray-50/80 border border-gray-100 rounded-xl px-6 py-3 min-w-[140px] group-hover:bg-green-50 group-hover:border-green-100 transition-colors">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <FiShield /> Secret Code
                  </p>
                  <p className="font-mono text-xl sm:text-2xl font-extrabold tracking-[0.2em] text-gray-800 group-hover:text-green-700 transition-colors">
                    {order.otpCode}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-gray-400 flex items-center justify-center gap-1">
                    <MdOutlineVerified /> Show to collect
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern SaaS Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-sm relative transform scale-100 animate-[bounce_0.2s_ease-out]">
            <button
              onClick={() => {
                setShowPopup(false);
                setCurrentOrder(null);
                window.history.replaceState({}, "", "/myprints");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <IoMdClose size={24} />
            </button>

            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-2 shadow-inner">
                 <IoMdCheckmarkCircleOutline size={40} />
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                Success! Files Sent
              </h2>

              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                Your files have been sent to the MITS Store PC. Provide the secret code below to collect your prints.
              </p>

              <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 mt-2 shadow-sm">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Your Code</p>
                <p className="font-mono text-3xl font-extrabold tracking-widest text-green-600">
                  {currentOrder?.otpCode}
                </p>
              </div>

              <span className="text-[11px] mt-2 font-semibold text-gray-400 uppercase tracking-wide">
                {currentOrder ? formatDate(currentOrder.createdAt) : ''}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
