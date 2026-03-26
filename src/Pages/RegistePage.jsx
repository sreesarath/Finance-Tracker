import React from 'react'
import { Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupAPI } from '../Serveices/AllApi';
import { toast } from 'react-toastify';



const RegistePage = () => {
    const navigate=useNavigate()
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""

    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handlesignup = async (e) => {
    e.preventDefault(); // ✅ fixed

    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
        toast.error("Please fill all fields");
        return;
    }

    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
    }

    try {
        setIsLoading(true);

        const result = await signupAPI(formData);

        if (result.status === 200) {
            toast.success("Registration successful ✅");
            navigate('/login');
        } else {
            toast.error("Signup failed");
        }

    } catch (err) {
        toast.error("Something went wrong");
    } finally {
        setIsLoading(false);
    }
};
    return (
        <>
            <div className='min-h-screen flex items-center justify-center bg-slate-50 p-4'>
                <div className='max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100'>
                    {/* header and branding */}
                    <div className="px-8 pt-10 pb-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl mb-4">
                            <span className="text-2xl font-bold">$</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900">Create Account</h2>
                        <p className="text-slate-500 mt-2">Start tracking your wealth today</p>
                    </div>
                    <form onSubmit={handlesignup}  className='px-8 pb-10 space-y-4'>
                        {/* full name field */}
                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-1'>Full Name</label>
                            <div className='relative'>
                                <input placeholder="John Doe"
                                onChange={(e)=>setFormData({...formData,fullName:e.target.value})}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    required
                                    name='fullName'
                                    type="text" />
                                <User className="absolute left-3 top-3.5 text-slate-400 h-5 w-5" />

                            </div>
                        </div>
                        {/* email field */}
                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-1'>Email</label>
                            <div className='relative'>

                                <input placeholder="name@gmail.com"
                                  onChange={(e)=>setFormData({...formData,email:e.target.value})}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    required
                                    name='email'
                                    type="email" />
                                <Mail className="absolute left-3 top-3.5 text-slate-400 h-5 w-5" />

                            </div>
                        </div>
                        {/* password */}
                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-1'>Password</label>
                            <div className='relative'>
                                <input placeholder="Create a strong password"
                                  onChange={(e)=>setFormData({...formData,password:e.target.value})}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    required
                                    name='password'
                                    type={showPassword ? "text" : "password"} />
                                <Lock className="absolute left-3 top-3.5 text-slate-400 h-5 w-5" />
                                <button onClick={() => setShowPassword(!showPassword)} type='button' className='absolute right-3 top-3.5 text-slate-400 hover:text-slate-600'>
                                    {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                                </button>
                                {/* confirm password */}
                         
<div>
  <label className='block text-sm font-semibold text-slate-700 mb-1'>
    Confirm Password
  </label>
  <div className='relative'>
    <input
      placeholder="Repeat your password"
      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
      required
      name='confirmPassword'
      type={showPassword ? "text" : "password"}
      onChange={(e)=>setFormData({...formData,confirmPassword:e.target.value})}
    />
    <CheckCircle2 className="absolute left-3 top-3.5 text-slate-400 h-5 w-5" />
  </div>
</div>
                                {/* terms checkbox */}
                                <div className='flex items-center justify-center space-x-2 py-2'>
                                    <input className='w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 mt-1' type="checkbox" required />
                                    <span className='text-xs text-slate-600'>
                                        I agree to the <Link to={'/terms'} className='text-indigo-600 font-medium'>Terms of Service</Link> and <Link className='text-indigo-600 font-medium' to={''}>Privacy policy</Link>

                                    </span>
                                </div>
                                {/* submit button */}
                                <button className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex justify-center items-center shadow-lg shadow-indigo-100 disabled:opacity-70 disabled:cursor-not-allowed' disabled={isLoading} type='submit'>
                                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
                                </button>
                                {/* footer link */}
                                <p className='text-center text-sm text-slate-600 mt-6'>
                                    Already have an account?{" "}
                                    <Link className='font-bold text-indigo-600 hover:underline' to={'/login'}>Log in</Link>
                                </p>
                            </div>
                        </div>

                    </form>
                </div>

            </div>

        </>
    )
}

export default RegistePage