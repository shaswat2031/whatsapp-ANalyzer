import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { FiArrowRight, FiShield, FiBarChart2, FiClock, FiMessageSquare } from "react-icons/fi";

function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    setIsVisible(true);
    const sequence = async () => {
      await controls.start("visible");
    };
    sequence();
  }, [controls]);

  // Floating animation for decorative elements
  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      y: {
        repeat: Infinity,
        duration: 4,
        ease: "easeInOut"
      }
    }
  };

  // Feature cards data
  const features = [
    {
      title: "Message Statistics",
      desc: "Total messages, averages per day, and full conversation timeline.",
      icon: <FiBarChart2 className="text-2xl" />
    },
    {
      title: "User Activity",
      desc: "See the most active users, chat distribution, and contributions.",
      icon: <FiMessageSquare className="text-2xl" />
    },
    {
      title: "Time Patterns",
      desc: "Spot active hours, busy days, and overall messaging rhythms.",
      icon: <FiClock className="text-2xl" />
    },
    {
      title: "Privacy First",
      desc: "Your data never leaves your browser. No server storage.",
      icon: <FiShield className="text-2xl" />
    }
  ];

  // Steps data
  const steps = [
    "Open the WhatsApp conversation",
    "Tap the three dots (⋮)",
    "Select 'More → Export chat'",
    "Choose 'Without Media'",
    "Save the .txt file",
    "Upload using our tool"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-40 left-20 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <main className="flex-grow py-16 relative z-10">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <motion.div
            className="max-w-4xl mx-auto text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center mb-6 bg-green-100 text-green-800 rounded-full px-5 py-2 text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Privacy First • No Data Storage
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                Decode Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                WhatsApp Conversations
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Unlock hidden patterns and insights from your WhatsApp chats with our advanced, privacy-focused analysis tool.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link
                to="/upload"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105"
              >
                <span>Start Analyzing</span>
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>
              
            </div>
          </motion.div>

          {/* Stats Preview */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {[
              { value: "10K+", label: "Chats Analyzed" },
              { value: "100%", label: "Private" },
              { value: "15+", label: "Insight Types" },
              { value: "0", label: "Data Stored" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="text-3xl font-bold text-emerald-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Section */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-20 border border-gray-100"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                Powerful Chat Insights
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover meaningful patterns and statistics from your WhatsApp conversations with our comprehensive analysis suite.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="p-6 border border-gray-200 rounded-2xl hover:border-emerald-200 hover:shadow-lg bg-gradient-to-b from-white to-gray-50/50 transition-all duration-300 group"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-start mb-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl mr-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed pl-12">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Instructions Section */}
          <motion.div
            className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl shadow-2xl p-8 md:p-12 mb-20 border border-emerald-100"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                How to Export Your Chat
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Follow these simple steps to export your WhatsApp chat for analysis.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold mr-4">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{step}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-white p-5 rounded-2xl border-l-4 border-yellow-400 flex items-start max-w-2xl mx-auto">
              <div className="flex-shrink-0 mr-4 text-yellow-500 text-xl">💡</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Important Note</h4>
                <p className="text-gray-600 text-sm">
                  Your chat data is processed locally and <span className="font-medium">never stored on our servers</span>. 
                  We value your privacy above all else.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            className="text-center bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Explore Your Chats?</h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who've discovered fascinating insights about their communication patterns.
            </p>
            
            <Link
              to="/upload"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-full bg-white text-emerald-600 shadow-lg hover:scale-105 transform transition duration-200 group"
            >
              <span>Start Analyzing Now</span>
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <p className="text-emerald-200 text-sm mt-6">
              No registration required • 100% free • Privacy guaranteed
            </p>
          </motion.div>
        </div>
      </main>
      
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default HomePage;