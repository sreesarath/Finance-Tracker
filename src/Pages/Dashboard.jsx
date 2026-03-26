    import React, { useState, useEffect } from "react";
    import Navbar from "../Components/Header";
    import { MdModeEdit } from "react-icons/md";
    import { ImCross } from "react-icons/im";
    import { addTransactionAPI, deleteTransactionAPI, getTransactionAPI } from "../Serveices/AllApi";
    import CommonApi from "../Serveices/CommonApi";
    import base_url from "../Serveices/baseUrl";
import { toast } from "react-toastify";


    const CATEGORIES = ["Fees","Salary","Petrol/Disel", "Food", "Rent", "Shopping", "Transport", "Health", "Other"];

    function Dashboard() {
    const [filterType, setFilterType] = useState("all");
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        text: "",
        amount: "",
        type: "expense",
        category: "Food",
    });
    const [searchTerm, setSearchTerm] = useState("");

    // --- Fetch user from sessionStorage ---
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
    }, []);

    // --- Fetch transactions ---
    const fetchTransactions = async () => {
        try {
        const res = await getTransactionAPI();
        if (res.status === 200) setTransactions(res.data);
        } catch (err) {
        console.error("Failed to fetch transactions:", err);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // --- Filtered transactions ---
    const filteredTransactions = transactions.filter((t) => {
        const text = t.text ? t.text.toLowerCase() : "";
        const category = t.category ? t.category.toLowerCase() : "";
        const matchesSearch =
        text.includes(searchTerm.toLowerCase()) || category.includes(searchTerm.toLowerCase());
        const matchesType =
        filterType === "all" ||
        (filterType === "income" && t.amount > 0) ||
        (filterType === "expense" && t.amount < 0);
        return matchesSearch && matchesType;
    });

    // --- Calculate balances ---
    const income = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);
    const balance = income + expense;

    // --- Handle form submit ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.text || !formData.amount) return;

        const payload = {
        text: formData.text,
        amount: formData.type === "expense" ? -Math.abs(formData.amount) : Math.abs(formData.amount),
        category: formData.category,
        type: formData.type  
        };

        let res;
        const token = sessionStorage.getItem("token");

        try {
        if (formData.id) {
            // EDIT
            res = await CommonApi(`${base_url}/api/transaction/edit/${formData.id}`, "PUT", payload, {
            Authorization: `Bearer ${token}`,
            });
        } else {
            // ADD
            res = await addTransactionAPI(payload);
        }

        if (res.status === 200 || res.status === 201) fetchTransactions();

        setFormData({
            id: null,
            text: "",
            amount: "",
            type: "expense",
            category: "Food",
        });
        } catch (err) {
        console.error("Transaction error:", err);
        }
    };

    // --- Handle delete ---
const handleDelete = async (id) => {
  try {
    // Get token from sessionStorage (since LoginPage stores it there)
    const token = sessionStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

   const res =  await deleteTransactionAPI(id, token);

    // Parse safely in case backend returns empty or non-JSON
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    console.log("Deleted:", data);

    // Update state to remove deleted transaction from UI
    setTransactions(prev => prev.filter(t => t._id !== id));

    toast.success("Transaction deleted successfully");

  } catch (err) {
    console.error("Delete failed:", err);
    toast.error(err.message || "Delete failed");
  }
};
    // --- Handle edit ---
    const handleEdit = (t) => {
        setFormData({
        id: t._id,
        text: t.text,
        amount: Math.abs(t.amount),
        type: t.amount > 0 ? "income" : "expense",
        category: t.category,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
        <Navbar />
        <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column - Overview & Form */}
            <div className="lg:col-span-4 space-y-6">
            {/* Financial Overview */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">
                Hello, {user?.email?.slice(0, 10) || "Guest"}!
                </h1>
                <p className="text-gray-500 text-sm mt-1 mb-6">Manage your finances effectively.</p>
                <div className="space-y-4">
                <div className="p-5 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl text-white shadow-lg shadow-indigo-100">
                    <p className="text-xs font-medium opacity-80 uppercase tracking-wider">
                    Available Balance
                    </p>
                    <h2 className="text-3xl font-bold mt-1">${balance}</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-lg">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Income</p>
                    <p className="text-lg font-bold text-green-600">+ {income}</p>
                    </div>
                    <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Expenses</p>
                    <p className="text-lg font-bold text-red-600">-{Math.abs(expense)}</p>
                    </div>
                </div>
                </div>
            </div>

            {/* Transaction Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">
                {formData.id ? "Edit Transaction" : "New Transaction"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="What was this for?"
                    value={formData.text || ""}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
                <div className="flex gap-2">
                    <input
                    type="number"
                    placeholder="Amount"
                    value={formData.amount || ""}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="flex-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                    <select
                    value={formData.category || "Food"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="p-3 bg-gray-50 border-none rounded-xl text-sm outline-none"
                    >
                    {CATEGORIES.map((val) => (
                        <option value={val} key={val}>
                        {val}
                        </option>
                    ))}
                    </select>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "income" })}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                        formData.type === "income"
                        ? "bg-white shadow-sm text-green-400"
                        : "text-gray-500"
                    }`}
                    >
                    Income
                    </button>
                    <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "expense" })}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                        formData.type === "expense"
                        ? "bg-white shadow-sm text-red-600"
                        : "text-gray-500"
                    }`}
                    >
                    Expense
                    </button>
                </div>
                <button
                    type="submit"
                    className={`w-full py-3 rounded-xl font-bold transition text-white shadow-md ${
                    formData.id ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                    {formData.id ? "Update Transaction" : "Add Transaction"}
                </button>
                {formData.id && (
                    <button
                    type="button"
                    className="w-full text-xs text-gray-400 font-medium"
                    onClick={() =>
                        setFormData({
                        id: null,
                        text: "",
                        amount: "",
                        type: "expense",
                        category: "Food",
                        })
                    }
                    >
                    Cancel Edit
                    </button>
                )}
                </form>
            </div>
            </div>

            {/* Right column - Transaction History */}
            <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xl">
                <h3 className="font-bold text-gray-800 px-2">Transaction History</h3>
                <div className="flex gap-2">
                <button onClick={() => setFilterType("all")} className="px-3 py-1 bg-gray-200 rounded">
                    All
                </button>
                <button onClick={() => setFilterType("income")} className="px-3 py-1 bg-green-100 rounded">
                    Income
                </button>
                <button onClick={() => setFilterType("expense")} className="px-3 py-1 bg-red-100 rounded">
                    Expense
                </button>
                </div>
                <input
                type="text"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-100 border-none rounded-xl px-4 py-2 text-sm outline-none w-full md:w-64"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                {filteredTransactions.length === 0 ? (
                    <div className="p-12 text-center">
                    <h3 className="text-gray-500 font-semibold">No Transactions Yet</h3>
                    <p className="text-gray-400 text-sm">Add your first transaction 🚀</p>
                    </div>
                ) : (
                    filteredTransactions.map((val) => (
                    <div
                        className="flex justify-between items-center p-4 hover:bg-gray-50 transition group"
                        key={val._id}
                    >
                        <div className="flex items-center gap-4">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                            val.amount > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}
                        >
                            {val.category?.charAt(0) || "?"}
                        </div>
                        <div>
    <p className="font-bold text-gray-800 text-sm">{val.text || "No Description"}</p>
    <div className="flex items-center gap-2">
        <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-500 font-medium uppercase">
        {val.category || "Other"}
        </span>
        <span className="text-[10px] text-gray-400">
        {val.date ? new Date(val.date).toLocaleDateString() : "-"}
        </span>
    </div>
    </div>
                        </div>

                        <div className="flex items-center gap-6">
                        <span
                            className={`font-bold text-sm ${
                            val.amount > 0 ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {val.amount > 0 ? "+" : "-"}
                            {Math.abs(val.amount).toLocaleString()}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button
                            onClick={() => handleEdit(val)}
                            className="p-2 text-gray-400 hover:text-indigo-600 bg-gray-100 rounded-lg"
                            >
                            <MdModeEdit />
                            </button>
                            <button
                            onClick={() => handleDelete(val._id)}
                            className="p-2 text-gray-400 hover:text-red-600 bg-gray-100 rounded-lg"
                            >
                            <ImCross />
                            </button>
                        </div>
                        </div>
                    </div>
                    ))
                )}
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    }

    export default Dashboard;