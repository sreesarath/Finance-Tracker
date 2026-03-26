import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, X, Wallet, User, LogOut, 
  Settings as SettingsIcon, LayoutDashboard, 
  PieChart, Target, ChevronDown 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();

  // ✅ Handle Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Sync User State
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try { setUser(JSON.parse(storedUser)); } catch { setUser(null); }
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={14} /> },
    { name: "Analytics", path: "/analytics", icon: <PieChart size={14} /> },
    { name: "Goals", path: "/goal", icon: <Target size={14} /> },
    { name: "Settings", path: "/settings", icon: <SettingsIcon size={14} /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      scrolled ? "py-3" : "py-5"
    }`}>
      <div className={`mx-auto max-w-7xl px-4 md:px-8`}>
        <div className={`relative flex items-center justify-between rounded-[2rem] px-6 py-3 transition-all duration-300 border ${
          scrolled 
          ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-xl shadow-slate-200/50" 
          : "bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-200/20"
        }`}>
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-xl transition-colors ${scrolled ? "bg-indigo-600 text-white" : "bg-white text-indigo-600"}`}>
              <Wallet size={22} />
            </div>
            <h1 className={`text-xl font-black tracking-tighter transition-colors ${scrolled ? "text-slate-900" : "text-white"}`}>
              Finance<span className={scrolled ? "text-indigo-600" : "text-indigo-200"}>  Tracker</span>
            </h1>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
                  isActive(link.path)
                    ? scrolled ? "bg-indigo-50 text-indigo-600" : "bg-white/20 text-white"
                    : scrolled ? "text-slate-500 hover:text-indigo-600" : "text-indigo-100 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className={`h-6 w-[1px] mx-2 ${scrolled ? "bg-slate-200" : "bg-white/20"}`} />

            {!user ? (
              <Link
                to="/login"
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  scrolled ? "bg-slate-900 text-white hover:bg-black" : "bg-white text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-full transition-all border ${
                    scrolled ? "border-slate-100 bg-slate-50" : "border-white/20 bg-white/10"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-black shadow-inner">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <ChevronDown size={14} className={scrolled ? "text-slate-400" : "text-white/70"} />
                </button>

                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 overflow-hidden py-2"
                    >
                      <div className="px-5 py-3 border-b border-slate-50 mb-1">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Logged in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.username}</p>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} /> Logout Account
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-lg ${scrolled ? "text-slate-900" : "text-white"}`}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mx-4 mt-2 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden p-4"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold ${
                    isActive(link.path) ? "bg-indigo-50 text-indigo-600" : "text-slate-600"
                  }`}
                >
                  {link.icon} {link.name}
                </Link>
              ))}
              {!user ? (
                <Link to="/login" className="mt-2 bg-indigo-600 text-white p-4 rounded-2xl text-center font-black uppercase text-xs tracking-widest">
                  Login
                </Link>
              ) : (
                <button onClick={handleLogout} className="mt-2 bg-red-50 text-red-600 p-4 rounded-2xl text-center font-black uppercase text-xs tracking-widest">
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;