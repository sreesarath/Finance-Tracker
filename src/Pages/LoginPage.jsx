import React from 'react'
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import {  signinAPI } from '../Serveices/AllApi';
import { toast } from 'react-toastify';





const LoginPage = () => {
    const navigate=useNavigate()
    const [showPassword,setShowPassword]=useState(false)
    const [isLoading,setIsLoading]=useState(false)
    const [userData,setUserData]=useState({
        email:"",
        password:""
    })
    const handleLogin=async(e)=>{
        e.preventDefault();
        const {email,password}=userData
        if (!email || !password) {
            toast.error("Please fill all fields!!")
            return
        }
        try {
            setIsLoading(true);
           const result=await signinAPI(userData); 
      
           
           if (result.status===200) {
            sessionStorage.setItem("token",result.data.token)
            sessionStorage.setItem("user",JSON.stringify(result.data.user))
            console.log("USER FROM API:", result.data.user);
            toast.success("Login successfull")
             console.log(result.data)
            navigate('/dashboard')
            
           }
           else{
            toast.error("Login filed!!")
           }
        } catch (err) {
            toast.error('Something went wrong')
        }
        finally{
            setIsLoading(false)
        }
        
       
    }



  return (
    <>
    <div className='min-h-screen flex items-center justify-center bg-slate-50 p-4'>
     {/* main card */}
     <div className='max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100'>
     {/* header and branding */}
     <div className='px-8 pt-10 pb-6 text-center'>
        <div className='inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl mb-4'>
         <span className='text-2xl font-bold'>$</span>
         
        </div>
        <h2 className='text-3xl font-extrabold text-slate-900'>Welcome back</h2>
        <p className='text-slate-500 mt-2'>Manage your expenses with precision</p>
     </div>
     <form onSubmit={handleLogin} className='px-8 pb-10 space-y-5' >
        <div>
            <label className='block text-sm font-semibold text-slate-700 mb-1'>Email Address</label>
            <div className='relative'>
                <input onChange={(e)=>setUserData({...userData,email:e.target.value})} 
                 className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all' placeholder='name@gmail.com' required name='email' type="email" />
                <Mail className='absolute left-3 top-3.5 text-slate-400 h-5 w-5'/>
            </div>
        </div>
        {/* password field */}
        <div>
            <div className='flex justify-between mb-1'>
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link className='text-xs font-medium text-indigo-600 hover:text-indigo-500' to={''}>Forgot?</Link>
 
            </div>
            <div className='relative'>
                <input onChange={(e)=>setUserData({...userData,password:e.target.value})}
                 className='w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all' placeholder='........' name='password' type={showPassword?"text":"password"} />
                <Lock className='absolute left-3 top-3.5 text-slate-400 h-5 w-5'/>
            <button className='absolute right-3 top-3.5 text-slate-400 hover:text-slate-600' onClick={()=>setShowPassword(!showPassword)} type='button'>
            {showPassword ? <EyeOff className='h-5 w-5'/>:<Eye className='h-5 w-5'/>}
            </button>
            </div>
        </div>
        {/* submit button */}
        <button  className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex justify-center items-center shadow-lg shadow-indigo-100 disabled:opacity-70' disabled={isLoading} type='submit'>
         {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign In"}
        </button>
        {/* footer link */}
        <p className='text-center text-sm text-slate-600 mt-6'>
        New to SpendTrack?{" "}
        <Link to={'/register'} className="font-bold text-indigo-600 hover:underline">Create an account</Link>
        </p>

     </form>
     </div>
    </div>
    
    
    </>

  )
}

export default LoginPage