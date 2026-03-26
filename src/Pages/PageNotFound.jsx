import React from 'react'
import Navbar from '../Components/Header'
import Footer from '../Components/Footer'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Search, LifeBuoy, AlertCircle } from "lucide-react";


const PageNotFound = () => {
    const navigate=useNavigate()
  return (
   <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="max-w-3xl w-full text-center">
          
          {/* ICON & ERROR CODE */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-blue-100 blur-3xl opacity-50 rounded-full"></div>
            <div className="relative bg-white border border-gray-100 shadow-xl p-6 rounded-3xl inline-flex items-center justify-center">
              <span className="text-7xl md:text-8xl font-black tracking-tighter text-gray-900">4</span>
              <div className="mx-2 bg-blue-600 rounded-2xl p-3 animate-bounce">
                <Search size={48} className="text-white" />
              </div>
              <span className="text-7xl md:text-8xl font-black tracking-tighter text-gray-900">4</span>
            </div>
          </div>

          {/* TEXT CONTENT */}
          <div className="space-y-4 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              This Transaction Doesn't Exist
            </h1>
            <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
              The page you are looking for might have been moved, deleted, or perhaps it never existed in your records.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
            
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              <Home size={18} />
              Return to Dashboard
            </button>
          </div>

          {/* HELP SECTION */}
          <div className="mt-20 pt-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition">
              <div className="bg-amber-50 p-3 rounded-xl h-fit">
                <AlertCircle className="text-amber-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Check the URL</h3>
                <p className="text-sm text-gray-500 mt-1">Make sure the web address is correct and try again.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition">
              <div className="bg-blue-50 p-3 rounded-xl h-fit">
                <LifeBuoy className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Need Support?</h3>
                <p className="text-sm text-gray-500 mt-1">Contact our help center if you believe this is an error.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default PageNotFound