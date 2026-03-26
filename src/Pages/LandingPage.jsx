import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const LandingPage = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111827] text-white font-sans">
      <Header />

      {/* HERO */}
      <section className="relative pt-28 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30 blur-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />

        <div className="relative container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            Take Control of Your
            <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Financial Future
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 max-w-2xl mx-auto text-lg mb-10"
          >
            Track spending, optimize budgets, and grow your wealth with powerful insights and a beautifully simple dashboard.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full font-semibold flex items-center gap-2 shadow-lg hover:scale-105 transition"
                >
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/10 transition"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-8 py-4 bg-indigo-600 rounded-full flex items-center gap-2 hover:bg-indigo-500"
                >
                  Dashboard <TrendingUp size={18} />
                </button>
                <button onClick={handleLogout} className="underline text-gray-400 hover:text-white">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white text-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-gray-600">Everything you need to manage your money smarter.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<Wallet className="text-indigo-600" size={30} />}
              title="Smart Tracking"
              desc="Automatically categorize and track your expenses in real-time."
            />

            <FeatureCard
              icon={<TrendingUp className="text-green-500" size={30} />}
              title="Insights & Analytics"
              desc="Understand spending patterns and save more every month."
            />

            <FeatureCard
              icon={<ShieldCheck className="text-blue-500" size={30} />}
              title="Secure & Private"
              desc="Your data is encrypted and protected with bank-level security."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-gradient-to-r from-indigo-600 to-purple-600">
        <h3 className="text-3xl font-bold mb-6">Start Building Wealth Today</h3>
        <Link
          to="/register"
          className="px-10 py-4 bg-white text-indigo-700 font-semibold rounded-full hover:scale-105 transition"
        >
          Create Free Account
        </Link>
      </section>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="p-8 rounded-2xl border bg-white shadow-md hover:shadow-xl transition"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{desc}</p>
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <CheckCircle2 size={16} className="text-indigo-500" /> Real-time data
    </div>
  </motion.div>
);

export default LandingPage;
