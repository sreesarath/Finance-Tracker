import React, { useState, useEffect } from "react";
import Navbar from "../Components/Header";
import { getTransactionAPI } from "../Serveices/AllApi";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon } from "lucide-react";
import Spinner from "../Components/spinner";
import { useNavigate } from "react-router-dom";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", "#10b981", "#06b6d4"];
const TIME_RANGES = ["all", "3m", "1m"];

function Analytics() {
  const navigate=useNavigate()
  const [transaction,setTransaction]=useState([])
  const [timeRange,setTimeRange]=useState("all")
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    const fetchTransactions =async()=>{
     try {
      const res=await getTransactionAPI()
      if (res.status===200)setTransaction(res.data)
     } catch (err) {
       console.error("Failed to fetch transactions:", err);
     }
     finally{
      setLoading(false)
     }
    }
   fetchTransactions()
  },[])
  useEffect(()=>{
    const token=sessionStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }

  },[])
  // data information
  const categoryMap={};
  transaction.forEach(val=>{
    if(val.amount<0){
      const cat=val.category || "other";
      if (!categoryMap[cat]) {
        categoryMap[cat]=0;
      }
      categoryMap[cat] +=Math.abs(val.amount)
    }
  })
  const categoryData=Object.entries(categoryMap)
  .map(([name,value])=>({name,value}))
  .sort((a,b)=>b.value-a.value)

  const monthlyData=transaction.reduce((acc,t)=>{
    const date=new Date(t.date || Date.now())
    const month=date.toISOString('default',{month:'short'})
    const year=date.getFullYear()
    const key=`${month} ${year}`;

    let monthEntry=acc.find(val=>val.key === key);
    if (!monthEntry) {
      monthEntry={key,month,income:0,expense:0,rawDate:date}
      acc.push(monthEntry)
    }
    if (t.amount > 0) {
      monthEntry.income +=t.amount
    }
    else{
      monthEntry.expense += t.amount
    } 
    return acc
  },[]).sort((a,b)=>a.rawDate-b.rawDate);

  const totalIncome=transaction.filter(val=>val.amount >0).reduce((sum,tot)=>sum+tot.amount,0);
  const totaleExpense=transaction.filter(val=>val.amount<0).reduce((sum,tot)=>sum+Math.abs(tot.amount),0);
  const savingsRate=totalIncome>0?((totalIncome-totaleExpense)/totalIncome*100).toFixed(1):0
  const topCategory=categoryData[0]?.name || "N/A";
    // --- Filter transactions by timeRange  ---
      const filteredMonthlyData = monthlyData

  return (
    <>
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <Navbar/>
      <main className="p-6 max-w-7xl mx-auto space-y-8">
        {/* header */}
        <Header timeRange={timeRange} setTimeRange={setTimeRange} />
        {
          loading?
          (
            <Spinner/>
          ):transaction.length === 0?
          (
            <div className="text-center text-gray-500 mt-16">
            No transactions found. Start tracking your finances!
          </div>
          ):
          (
            <>
            {/* stats card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Savings Rate" value={`${savingsRate}%`} icon={<TrendingUp className="text-emerald-500"/>}/>
              <StatCard title="Top Spending" value={topCategory.toLocaleUpperCase()} icon={<PieIcon className="text-indigo-500"/>}/>
              <StatCard title="Total Income" value={`$ ${totalIncome.toLocaleString()}`} icon={<DollarSign className="text-blue-500"/>}/>
              <StatCard title="Total Expense" value={`$ ${totaleExpense.toLocaleString()}`} icon={<TrendingDown className="text-rose-500"/>}/>

            </div>
            {/* chart grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* cash flow */}
              <ChartCard title="Cash Flow Trend" subtitle="Monthly Overview" className="lg:col-span-8">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={filteredMonthlyData}>
                  <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                  </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                    <XAxis dataKey="key" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:12}} dy={10}/>
                    <YAxis axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:12}}/>
                    <Tooltip contentStyle={{ borderRadius: '12px', border:'none', boxShadow:'0 10px 15px rgba(0,0,0,0.1)' }} cursor={{ fill:'#f8fafc' }}/>
                    <Legend iconType="circle" verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
                    <Area type="monotone" dataKey="income" stroke="#6366f1" fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                    <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" name="Expense" />

                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
                            {/* Pie Chart */}
              <ChartCard title="Expense Distribution" className="lg:col-span-4">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie data={categoryData} innerRadius={80} outerRadius={110} paddingAngle={6} dataKey="value" label={({ name, percent }) => `${name}: ${(percent*100).toFixed(0)}%`}>
                      {categoryData.map((entry,index)=> <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip containerStyle={{ borderRadius:'12px' }} />
                    <Legend verticalAlign="bottom" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

            </div>
            
            </>
          )
        }

      </main>

    </div>

    
    </>

  );
}
function Header({timeRange,setTimeRange}) {
  return(
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Financial Analytics
        </h1>
        <p className="text-slate-500 mt-1 font-medium">Deep dive into your spending patterns.</p>
      </div>
      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
      {
        TIME_RANGES.map((val)=>(
          <button 
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg trasition-all 
            ${timeRange === val ?"bg-indigo-600 text-white shadow-md":"text-slate-500 hover:bg-slate-50"}`} 
          key={val} onClick={()=>setTimeRange(val)}>
          {val}
          </button>
        ))
      }
      </div>

    </div>
  )
  
}
function StatCard({title,value,icon}) {
  return(
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>

      </div>
      <div className="ext-2xl font-bold text-slate-800">{value}</div>

    </div>
  )
  
}
function ChartCard({ title, subtitle, className, children }) {
  return (
    <div className={`${className} bg-white p-6 rounded-3xl shadow-sm border border-slate-200`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        {subtitle && <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

export default Analytics;