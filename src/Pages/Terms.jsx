import React from 'react';
import Navbar from '../Components/Header';
import Footer from '../Components/Footer';
import { ShieldCheck, FileText, Lock, RefreshCcw, Printer, ChevronRight } from 'lucide-react';

const Terms = () => {
  const lastUpdated = "March 22, 2026";

  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms", icon: <FileText size={18} /> },
    { id: "responsibility", title: "2. User Responsibility", icon: <ShieldCheck size={18} /> },
    { id: "data", title: "3. Data Accuracy & Security", icon: <Lock size={18} /> },
    { id: "modifications", title: "4. Service Modifications", icon: <RefreshCcw size={18} /> },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <div className="bg-gray-50 border-b border-gray-200 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                Terms of Service
              </h1>
              <p className="text-gray-500 font-medium">
                Please read these terms carefully before using ExpenseTracker.
              </p>
            </div>
            <button 
              onClick={handlePrint}
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              <Printer size={16} /> Print Version
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* SIDEBAR NAVIGATION (Desktop) */}
          <aside className="hidden md:block w-64 sticky top-24 h-fit">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contents</h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center justify-between group px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all"
                >
                  <span className="flex items-center gap-3">
                    {section.icon}
                    {section.title.split('. ')[1]}
                  </span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </nav>
          </aside>

          {/* CONTENT SECTION */}
          <main className="flex-1 text-gray-700 leading-relaxed space-y-10">
            
            <section id="acceptance" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-600">01.</span> Acceptance of Terms
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
                <p className="text-sm text-blue-800 font-medium">
                  By accessing or using the ExpenseTracker platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </div>
              <p>
                This agreement constitutes a legally binding contract between you ("User") and ExpenseTracker. If you do not agree with any part of these terms, you must immediately cease all use of our services.
              </p>
            </section>

            <section id="responsibility" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-600">02.</span> User Responsibility
              </h2>
              <p className="mb-4">
                Users are solely responsible for the activity that occurs on their account. You must notify us immediately of any breach of security or unauthorized use of your account.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>You must be at least 18 years of age to use this service.</li>
                <li>You agree not to use the service for any illegal or unauthorized purpose.</li>
                <li>Account credentials must be kept confidential at all times.</li>
              </ul>
            </section>

            <section id="data" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-600">03.</span> Data Accuracy & Security
              </h2>
              <p>
                ExpenseTracker provides financial management tools for informational purposes only. We do not provide financial, legal, or tax advice. While we use industry-standard encryption to protect your data, we cannot guarantee 100% absolute security.
              </p>
              <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-gray-50 italic text-sm">
                "User data is stored using AES-256 encryption. We do not sell your personal financial information to third-party advertisers."
              </div>
            </section>

            <section id="modifications" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-600">04.</span> Service Modifications
              </h2>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of the service at any time. We will provide notice of significant changes via the email address associated with your account or through a prominent notice on our dashboard.
              </p>
            </section>

            {/* FINAL FOOTNOTE */}
            <div className="pt-8 border-t border-gray-100 mt-12">
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <RefreshCcw size={14} /> Last updated: {lastUpdated}
              </p>
            </div>
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;