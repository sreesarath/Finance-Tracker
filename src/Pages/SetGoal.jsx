import React, { useEffect, useState } from "react";
import Navbar from "../Components/Header";
import Footer from "../Components/Footer";
import {
  addGoalAPI,
  getGoalAPI,
  addMoneyGoalAPI,
  deleteGoalAPI,
  getGoalInsightsAPI
} from "../Serveices/AllApi";
import { 
  Plus, Trash2, Target, Trophy, TrendingUp, 
  Wallet, Sparkles, Calendar, ChevronRight, Info 
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ✅ ENHANCED AI INSIGHTS COMPONENT
// ✅ NEW & IMPROVED AI INSIGHTS COMPONENT
const GoalAIBox = ({ ai, goalTitle }) => {
    
  if (!ai) return <div className="mt-4 p-8 rounded-2xl bg-slate-50 animate-pulse border border-slate-100" />;

  if (ai.status === "No Capacity") {
    return (
      <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 items-center">
        <Info size={18} className="text-amber-600 shrink-0" />
        <p className="text-[11px] text-amber-700 font-semibold italic">
          AI Notice: Update your income/expenses in the dashboard to unlock a smart plan for "{goalTitle}".
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-6 p-6 rounded-[2rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden border border-white/5"
    >
      {/* Abstract Background Glow */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute -left-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/30">
            <Sparkles size={16} className="text-indigo-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 block">AI Intelligence</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase">{ai.status}</span>
          </div>
        </div>
        <div className="text-right">
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
            ai.healthScore > 70 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            {ai.velocity || 'Optimal'} Velocity
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 relative z-10 mb-6">
        <div className="space-y-1">
          <p className="text-slate-500 text-[10px] font-bold uppercase">Monthly Target</p>
          <p className="text-2xl font-black tracking-tighter">${ai.suggestedMonthly}<span className="text-xs text-slate-600 font-medium">/mo</span></p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-slate-500 text-[10px] font-bold uppercase">Expected Finish</p>
          <p className="text-lg font-bold text-indigo-300 tracking-tight">
            {ai.completionDate ? new Date(ai.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "---"}
          </p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Strategy Insight</span>
            <TrendingUp size={12} className="text-emerald-400" />
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            "{ai.advice} Saving <b className="text-emerald-400">${Math.ceil(ai.suggestedMonthly/30)} daily</b> keeps you ahead of schedule."
          </p>
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
             <span className="text-[10px] font-bold text-slate-400 uppercase">Health Score: {ai.healthScore}%</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Weekly: ${ai.weeklyTarget}/wk</span>
        </div>
      </div>
    </motion.div>
  );
};
const SetGoal = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ title: "", targetAmount: "" });
  const [amountInputs, setAmountInputs] = useState({});
  const [aiData, setAiData] = useState({});
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await getGoalAPI(token);
      if (Array.isArray(res.data)) setGoals(res.data);
    } catch {
      toast.error("Failed to fetch goals");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (!goals.length) return;

  goals.forEach(async (g) => {
    // Only call if we don't have data AND it's not already completed
    if (aiData[g._id] || g.savedAmount >= g.targetAmount) return;

    try {
      const res = await getGoalInsightsAPI({
        goalAmount: Number(g.targetAmount) || 0,
        currentSaved: Number(g.savedAmount) || 0,
      }, token);

      if (res && res.data) {
        setAiData(prev => ({
          ...prev,
          [g._id]: res.data
        }));
      }
    } catch (err) {
      console.error("AI Insights Error for goal:", g.title, err);
    }
  });
}, [goals]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.targetAmount) return toast.warning("Missing details");
    try {
      await addGoalAPI(form, token);
      toast.success("Goal set! Time to save 🎯");
      setForm({ title: "", targetAmount: "" });
      fetchGoals();
    } catch { toast.error("Error creating goal"); }
  };

const handleAddMoney = async (id) => {
  const amount = amountInputs[id];
  if (!amount || amount <= 0) return toast.warning("Enter a valid amount");
  
  try {
    const res = await addMoneyGoalAPI(id, { amount: Number(amount) }, token);
    
    // ✅ TRIGGER MILESTONE CHECK
    const updatedGoal = res.data; 
    checkMilestones(updatedGoal, updatedGoal.savedAmount);

    toast.success("Progress updated! 💰");
    setAmountInputs(prev => ({ ...prev, [id]: "" }));
    fetchGoals();
  } catch { 
    toast.error("Failed to update"); 
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this goal?")) return;
    try {
      await deleteGoalAPI(id, token);
      toast.success("Goal removed");
      fetchGoals();
    } catch { toast.error("Error deleting"); }
  };
  const checkMilestones = (goal, newSavedAmount) => {
  const percent = (newSavedAmount / goal.targetAmount) * 100;
  const milestones = [25, 50, 75, 100];
  
  // Find the next upcoming milestone
  const nextMilestone = milestones.find(m => percent < m);
  
  if (nextMilestone) {
    const amountNeeded = (goal.targetAmount * (nextMilestone / 100)) - newSavedAmount;
    
    // Only show if they are within 10% of the next milestone
    if (amountNeeded > 0 && (amountNeeded / goal.targetAmount) <= 0.1) {
      toast.info(`🚀 Almost there! Only $${Math.ceil(amountNeeded)} more to hit your ${nextMilestone}% milestone!`, {
        icon: "🎯",
        theme: "dark"
      });
    }
  }

  // Special celebration for hitting a milestone exactly or crossing it
  if (percent >= 100) {
    toast.success(`TREMENDOUS! You've fully funded: ${goal.title}! 🏆`, { duration: 5000 });
  }
};

  return (
<div className="bg-[#f8fafc] min-h-screen flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto w-full p-6 py-12">
        {/* MODERNISED HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} /> Financial Planning
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900">
              Ambitions<span className="text-indigo-600">.</span>
            </h1>
            <p className="text-slate-500 font-medium">Precision tracking for your financial milestones.</p>
          </div>

          <form onSubmit={handleAdd} className="bg-white p-3 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex items-center gap-3 w-full md:w-auto transition-transform focus-within:scale-[1.02]">
            <div className="flex items-center gap-3 px-4">
              <Target size={20} className="text-slate-400" />
              <input
                placeholder="New Goal Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-transparent py-2 outline-none text-sm font-bold w-full md:w-48"
              />
            </div>
            <div className="h-10 w-[1px] bg-slate-100" />
            <div className="flex items-center gap-2 px-4">
              <span className="text-slate-400 font-bold">$</span>
              <input
                type="number"
                placeholder="Amount"
                value={form.targetAmount}
                onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                className="bg-transparent py-2 outline-none text-sm font-black w-20"
              />
            </div>
            <button className="bg-slate-900 hover:bg-black text-white p-4 rounded-[2rem] transition-all shadow-lg hover:shadow-indigo-200">
              <Plus size={20} />
            </button>
          </form>
        </div>

        {/* GOALS GRID */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-10 animate-pulse">
            {[1, 2].map(i => <div key={i} className="h-96 bg-slate-100 rounded-[3rem]" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            <AnimatePresence mode="popLayout">
              {goals.map((g) => {
                const percent = Math.min((g.savedAmount / g.targetAmount) * 100, 100);
                const isCompleted = percent >= 100;

                return (
                  <motion.div
                    layout
                    key={g._id}
                    className={`group bg-white p-10 rounded-[3rem] border transition-all relative ${
                      isCompleted ? 'border-emerald-100' : 'border-slate-100 hover:shadow-2xl hover:shadow-indigo-100/50'
                    }`}
                  >
                    {/* Top Section */}
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase group-hover:text-indigo-600 transition-colors">
                          {g.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500" />
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target: ${g.targetAmount.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-3xl text-right min-w-[100px]">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Saved</p>
                        <p className="text-xl font-black text-slate-900">${g.savedAmount.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Pro Progress Section */}
                    <div className="mb-8">
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-[11px] font-black text-indigo-600 uppercase tracking-wider">{percent.toFixed(0)}% Complete</span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase">${(g.targetAmount - g.savedAmount).toLocaleString()} to go</span>
                      </div>
                      <div className="relative h-6 bg-slate-100 rounded-full p-1 border border-slate-50">
                        {/* Milestone Pips */}
                        {[25, 50, 75].map((m) => (
                          <div key={m} className="absolute top-0 bottom-0 w-[2px] bg-white/60 z-10" style={{ left: `${m}%` }} />
                        ))}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          className={`h-full rounded-full shadow-inner relative z-0 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-indigo-600'}`}
                        />
                      </div>
                    </div>

                    <GoalAIBox ai={aiData[g._id]} goalTitle={g.title} />

                    {/* Deposit Actions */}
                    <div className="flex gap-3 mt-10 pt-8 border-t border-slate-50">
                      <div className="relative flex-grow">
                        <input
                          type="number"
                          placeholder="Deposit amount"
                          value={amountInputs[g._id] || ""}
                          onChange={(e) => setAmountInputs({ ...amountInputs, [g._id]: e.target.value })}
                          className="w-full bg-slate-50 border border-gray-300  p-4 pl-6 rounded-2xl text-sm font-bold outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-400 transition-all"
                        />
                      </div>
                      <button
                        onClick={() => handleAddMoney(g._id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-100"
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => handleDelete(g._id)}
                        className="p-4 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SetGoal;