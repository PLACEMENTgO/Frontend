"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Star, Globe, Share2 } from "lucide-react";
import Navbar from "../component/Navbar";

const PricingPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* Navigation */}
      <Navbar></Navbar>

      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        {/* Header Section */}
        <motion.div {...fadeIn}>
          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-100">
            Membership Plans
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-6 mb-4 tracking-tight">
            Simple, transparent pricing.
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Choose the plan that fits your career goals. Unlock tools designed
            to accelerate your job search.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-10 rounded-3xl border border-slate-200 text-left shadow-sm transition-shadow hover:shadow-xl relative"
          >
            <h3 className="text-xl font-bold mb-2">Free Plan</h3>
            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-black">$0</span>
              <span className="text-slate-400 ml-2">/month</span>
            </div>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" /> Basic
                Resume Builder
              </li>
              <li className="flex items-center text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" /> 5 Job
                Applications/mo
              </li>
              <li className="flex items-center text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" /> Manual
                Application Tracker
              </li>
              <li className="flex items-center text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />{" "}
                Interview Guides
              </li>
            </ul>
            <button className="w-full py-3 px-6 rounded-xl border-2 border-slate-100 font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              Get Started Free
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-10 rounded-3xl border-2 border-blue-500 text-left shadow-xl relative"
          >
            <div className="absolute -top-4 right-8 bg-[#2563eb] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
              Recommended
            </div>
            <h3 className="text-xl font-bold text-blue-600 mb-2">Pro Plan</h3>
            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-black">$19</span>
              <span className="text-slate-400 ml-2">/month</span>
            </div>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center text-slate-900 font-medium">
                <Star className="w-5 h-5 text-blue-500 fill-blue-500 mr-3" /> AI
                Resume Optimization
              </li>
              <li className="flex items-center text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" />{" "}
                Unlimited Applications
              </li>
              <li className="flex items-center text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> Premium
                Postings Feed
              </li>
              <li className="flex items-center text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" />{" "}
                Auto-Apply Credits
              </li>
              <li className="flex items-center text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> Priority
                Support
              </li>
            </ul>
            <button className="w-full py-4 px-6 rounded-xl bg-[#2563eb] font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
              Upgrade to Pro
            </button>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 bg-[#2563eb] rounded-[40px] py-16 px-8 text-white relative overflow-hidden"
        >
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to level up your career?
          </h2>
          <p className="text-blue-100 mb-10 max-w-xl mx-auto text-lg">
            Join over 50,000 professionals who found their next role with
            PlacementGo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-blue-50 transition-colors shadow-lg">
              Get Started Now
            </button>
            <button className="border border-white/30 bg-white/10 backdrop-blur-sm px-10 py-4 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors">
              Talk to Advisor
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold mb-6">PlacementGo</h4>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Building the future of professional placement with precision and
              AI-driven insights.
            </p>
          </div>
          {[
            {
              title: "Product",
              links: ["Features", "Integrations", "Enterprise"],
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Security"],
            },
            {
              title: "Contact",
              links: ["Contact Us", "Support Center", "Press Kit"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold mb-6 text-sm">{col.title}</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-slate-200 flex flex-col md:row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2024 PlacementGo Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <Globe className="w-5 h-5 cursor-pointer hover:text-blue-600 transition-colors" />
            <Share2 className="w-5 h-5 cursor-pointer hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
