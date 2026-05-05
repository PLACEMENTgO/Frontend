"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Star, Globe, Share2 } from "lucide-react";
import Navbar from "../component/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, API_BASE_URL } from "@/lib/api";
import { useAuth } from "../context/AuthContext";

interface CreateOrderResponse {
  orderId: string;
  amountPaise: number;
  currency: string;
  keyId: string;
  planName: string;
  description: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}

const PricingPage = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUpgrade = async () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      setError("Please login first to upgrade to Pro.");
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const order: CreateOrderResponse = await apiFetch(
        `${API_BASE_URL}/api/v1/payments/create-order`,
        { method: "POST" }
      );

      if (typeof window.Razorpay === "undefined") {
        setError("Payment gateway not loaded. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amountPaise,
        currency: order.currency,
        name: "PlacementGO",
        description: order.description,
        order_id: order.orderId,
        handler: async (response) => {
          try {
            await apiFetch(`${API_BASE_URL}/api/v1/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            // Redirect to dashboard on success
            router.push('/dashboard');
          } catch (err) {
            console.error("Payment verification error:", err);
            setError("Payment captured but verification failed. Contact support.");
            setLoading(false);
          }
        },
        theme: { color: "#2563eb" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch (err) {
      console.error("Payment order creation error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create payment order. Please try again.";
      setError(errorMessage || "Failed to create payment order. Please try again.");
      setLoading(false);
    }
  };
  
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
            <button 
              onClick={() => router.push('/resumeoptimizer')}
              className="w-full py-3 px-6 rounded-xl border-2 border-slate-100 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
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
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            <button 
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-[#2563eb] font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Opening Payment..." : "Upgrade to Pro"}
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
            <button 
              onClick={() => router.push('/resumeoptimizer')}
              className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-blue-50 transition-colors shadow-lg"
            >
              Get Started Now
            </button>
            <button 
              onClick={() => window.open('mailto:support@placementgo.in', '_blank')}
              className="border border-white/30 bg-white/10 backdrop-blur-sm px-10 py-4 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors"
            >
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
              links: [
                { label: "Features", href: "/resumeoptimizer" },
                { label: "Integrations", href: "/dashboard" },
                { label: "Enterprise", href: "mailto:support@placementgo.in" }
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "mailto:support@placementgo.in" },
                { label: "Security", href: "mailto:support@placementgo.in" }
              ],
            },
            {
              title: "Contact",
              links: [
                { label: "Contact Us", href: "mailto:support@placementgo.in" },
                { label: "Support Center", href: "mailto:support@placementgo.in" },
                { label: "Press Kit", href: "mailto:support@placementgo.in" }
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold mb-6 text-sm">{col.title}</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-slate-200 flex flex-col md:row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2026 PlacementGo Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="https://placementgo.in" target="_blank" rel="noopener noreferrer">
              <Globe className="w-5 h-5 cursor-pointer hover:text-blue-600 transition-colors" />
            </a>
            <a href="mailto:support@placementgo.in">
              <Share2 className="w-5 h-5 cursor-pointer hover:text-blue-600 transition-colors" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
