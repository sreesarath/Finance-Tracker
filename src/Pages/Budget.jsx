import React, { useState, useEffect } from "react";
import Navbar from "../Components/Header";
import {
    addBudgetAPI,
    getBudgetAPI,
    deleteBudgetAPI,
    updateBudgetAPI
} from "../Serveices/AllApi";
import { DollarSign, PlusCircle, Trash2, Pencil, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
useNavigate

const CATEGORIES = ["Fees", "Petrol/Disel", "Food", "Rent", "Shopping", "Transport", "Health", "Other"];

const Budget = () => {
    const [budgets, setBudgets] = useState([]);
    const [form, setForm] = useState({ category: "", limit: "" });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const token = sessionStorage.getItem("token");
    const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });

    // 1. Fetching Logic (Called after every action to sync UI)
    const fetchBudgets = async () => {
        setLoading(true);
        try {
            const res = await getBudgetAPI(token);
            setBudgets(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to sync budgets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBudgets(); }, []);
    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if (!token) {
            navigate('/login')
        }
    }, [])

    // 2. Add / Update Logic
const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    category: form.category,
    limit: Number(form.limit)   // 🔥 IMPORTANT
  };

  try {
    if (editId) {
      await updateBudgetAPI(editId, payload, token);
      toast.success("Budget updated successfully");
    } else {
      await addBudgetAPI({ ...payload, month: currentMonth }, token);
      toast.success("Budget set for " + form.category);
    }

    setForm({ category: "", limit: "" });
    setEditId(null);
    fetchBudgets();

  } catch (err) {
    console.log("UPDATE ERROR FRONTEND:", err);
    toast.error(err.response?.data?.message || "Operation failed");
  }
};

    // 3. Delete Logic
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This will remove your budget limit for this category.")) return;
        try {
            await deleteBudgetAPI(id, token);
            toast.success("Budget removed");
            fetchBudgets(); // <--- REFRESHES UI
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleEdit = (b) => {
        setForm({ category: b.category, limit: String(b.limit) });
        setEditId(b._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getProgressColor = (percent) => {
        if (percent < 70) return "bg-blue-500";
        if (percent < 100) return "bg-amber-500";
        return "bg-rose-500";
    };

    // Calculate Summary Stats
    const totalLimit = budgets.reduce((acc, curr) => acc + Number(curr.limit), 0);
    const totalSpent = budgets.reduce((acc, curr) => acc + Number(curr.spent || 0), 0);

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            <Navbar />

            <div className="max-w-6xl mx-auto p-6">
                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Budget Planner</h1>
                        <p className="text-gray-500 font-medium flex items-center gap-2">
                            <TrendingUp size={16} /> Financial Overview for {currentMonth}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-400 uppercase font-bold">Total Budget</p>
                            <p className="text-xl font-bold text-gray-800">${totalLimit.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-400 uppercase font-bold">Total Spent</p>
                            <p className={`text-xl font-bold ${totalSpent > totalLimit ? 'text-red-500' : 'text-blue-600'}`}>
                                ${totalSpent.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* INPUT CARD */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700">
                        {editId ? <Pencil size={20} className="text-blue-500" /> : <PlusCircle size={20} className="text-blue-500" />}
                        {editId ? "Modify Category Limit" : "Create New Budget Limit"}
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                            required
                        >
                            <option value="">Select Category</option>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <div className="relative">
                            <span className="absolute left-3 top-3.5 text-gray-400">$</span>
                            <input
                                type="number"
                                value={form.limit}
                                onChange={(e) => setForm({ ...form, limit: e.target.value })}
                                placeholder="Enter Limit"
                                className="w-full border-gray-200 border p-3 pl-8 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                                required
                            />
                        </div>

                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95">
                                {editId ? "Update Plan" : "Set Budget"}
                            </button>
                            {editId && (
                                <button
                                    type="button"
                                    onClick={() => { setEditId(null); setForm({ category: "", limit: "" }); }}
                                    className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* BUDGET GRID */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Updating budgets...</div>
                ) : budgets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
                        <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No active budgets found. Start by adding one above!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {budgets.map((b) => {
                            const spent = b.spent || 0;
                            const percent = Math.min((spent / b.limit) * 100, 100);
                            const remaining = b.limit - spent;

                            return (
                                <div key={b._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-xs font-black uppercase tracking-wider text-blue-500 mb-1 block">Category</span>
                                            <h3 className="text-xl font-bold text-gray-800">{b.category}</h3>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEdit(b)} className="p-2 hover:bg-blue-50 text-blue-400 hover:text-blue-600 rounded-lg transition">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(b._id)} className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end mb-2">
                                        <div className="text-2xl font-black text-gray-900">
                                            ${spent.toLocaleString()}
                                            <span className="text-sm font-medium text-gray-400 ml-1">/ ${b.limit}</span>
                                        </div>
                                        <div className={`text-xs font-bold px-2 py-1 rounded-lg ${remaining >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {remaining >= 0 ? `$${remaining} left` : `$${Math.abs(remaining)} over`}
                                        </div>
                                    </div>

                                    {/* Progress Bar with Smooth Animation */}
                                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-3">
                                        <div
                                            className={`h-full transition-all duration-1000 ease-out ${getProgressColor(percent)}`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 mt-4">
                                        {percent >= 100 ? (
                                            <AlertCircle size={16} className="text-red-500" />
                                        ) : (
                                            <CheckCircle2 size={16} className="text-green-500" />
                                        )}
                                        <p className="text-sm font-semibold text-gray-500">
                                            {percent >= 100 ? "Over Budget" : `${(100 - percent).toFixed(0)}% Capacity remaining`}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Budget;