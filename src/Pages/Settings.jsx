import React, { useState } from "react";
import Navbar from "../Components/Header";
import Footer from "../Components/Footer";
import { 
  Download, Trash2, Globe, ShieldAlert, 
  Settings as SettingsIcon, Check, ChevronRight 
} from "lucide-react";
import { toast } from "react-toastify";
import { deleteAccountAPI, exportCSVAPI } from "../Serveices/AllApi";
import { motion } from "framer-motion";

const Settings = () => {
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "USD");
  const token = sessionStorage.getItem("token");

  const handleCurrencyChange = (e) => {
    const value = e.target.value;
    setCurrency(value);
    localStorage.setItem("currency", value);
    toast.success(`Currency updated to ${value} 💱`);
  };

  const handleExportCSV = async () => {
    const id = toast.loading("Preparing your data...");
    try {
      const res = await exportCSVAPI(token);
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `expense_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.update(id, { render: "Export successful! ✅", type: "success", isLoading: false, autoClose: 3000 });
    } catch {
      toast.update(id, { render: "Export failed", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("CRITICAL: This will permanently erase all transaction history and goals. Proceed?")) return;
    try {
      await deleteAccountAPI(token);
      sessionStorage.clear();
      toast.error("Account Permanently Deleted");
      window.location.href = "/login";
    } catch {
      toast.error("Deletion failed. Please contact support.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full p-6 py-12">
        {/* Header Section */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
            <SettingsIcon size={12} /> System Preferences
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900">
            Settings<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Manage your data, currency, and account security.</p>
        </header>

        <div className="space-y-6">
          {/* Preference Section */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-600">
                <Globe size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Preferences</h2>
                <p className="text-sm text-slate-400 font-medium">Regional and display settings</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl border border-slate-100">
              <span className="text-sm font-bold text-slate-700 ml-2">Primary Currency</span>
              <select
                value={currency}
                onChange={handleCurrencyChange}
                className="bg-white border-none px-6 py-3 rounded-2xl text-sm font-black text-indigo-600 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none cursor-pointer"
              >
                <option value="USD">$ USD - Dollar</option>
                <option value="INR">₹ INR - Rupee</option>
                <option value="EUR">€ EUR - Euro</option>
                <option value="GBP">£ GBP - Pound</option>
              </select>
            </div>
          </section>

          {/* Data Management Section */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-600">
                <Download size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Data Management</h2>
                <p className="text-sm text-slate-400 font-medium">Export your financial activity</p>
              </div>
            </div>

            <button
              onClick={handleExportCSV}
              className="w-full group flex items-center justify-between p-6 bg-indigo-600 hover:bg-indigo-700 rounded-3xl transition-all shadow-lg shadow-indigo-100"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-xl text-white">
                  <Download size={18} />
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-sm">Download Financial Report</p>
                  <p className="text-indigo-200 text-[11px]">Format: .CSV (Excel compatible)</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-white/50 group-hover:translate-x-1 transition-transform" />
            </button>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-50/50 rounded-[2.5rem] p-8 border border-red-100 mt-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-100 rounded-2xl text-red-600">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-red-600 tracking-tight">Danger Zone</h2>
                <p className="text-sm text-red-400 font-medium">Irreversible account actions</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-red-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="font-bold text-slate-800">Delete Account Permanently</p>
                <p className="text-xs text-slate-400">All progress, goals, and history will be lost forever.</p>
              </div>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
              >
                <Trash2 size={14} /> Purge Data
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;