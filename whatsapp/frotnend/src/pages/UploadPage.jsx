import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  FileText, 
  X, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [showFormatDetails, setShowFormatDetails] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    setError("");
    setSuccess("");
    
    if (!selectedFile.name.endsWith(".txt")) {
      setError("Please upload a valid text file (.txt)");
      return;
    }
    
    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB. Please upload a smaller file.");
      return;
    }
    
    setFile(selectedFile);
    setSuccess("File selected successfully!");
    
    // Auto-clear success message after 3 seconds
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("chatFile", file);

    try {
      // Simulate processing time for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000, // 30 second timeout
        }
      );

      localStorage.setItem("chatAnalysis", JSON.stringify(response.data));
      setSuccess("Analysis complete! Redirecting...");
      
      // Brief delay to show success message
      setTimeout(() => navigate("/results"), 1000);
    } catch (err) {
      console.error("Upload error:", err);
      
      if (err.code === 'ECONNABORTED') {
        setError("Request timeout. Please try again with a smaller file.");
      } else if (err.response?.status === 413) {
        setError("File too large. Please upload a file smaller than 10MB.");
      } else {
        setError(
          err.response?.data?.error ||
          "Error processing file. Please ensure it's a valid WhatsApp export."
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError("");
    setSuccess("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <main className="flex-grow py-8 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Upload WhatsApp Chat</h1>
              <p className="opacity-90">Get insights from your conversations</p>
            </div>
            
            <div className="p-6 md:p-10">
              {/* Upload Zone */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-6 md:p-10 text-center transition-all cursor-pointer mb-6
                  ${dragActive ? "border-green-500 bg-green-50 scale-[1.02]" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}
                  ${file ? "border-emerald-500 bg-emerald-50" : ""}
                `}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      className="flex flex-col items-center space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      key="file-present"
                    >
                      <div className="relative">
                        <FileText className="w-12 h-12 text-emerald-600" />
                        <motion.div 
                          className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      </div>
                      <div className="max-w-full">
                        <p className="text-emerald-700 font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        className="flex items-center text-red-500 hover:text-red-700 text-sm transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                      >
                        <X className="w-4 h-4 mr-1" /> Remove file
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      key="file-absent"
                    >
                      <motion.div
                        animate={{ y: dragActive ? -5 : 0 }}
                        transition={{ repeat: dragActive ? Infinity : 0, repeatType: "reverse", duration: 0.5 }}
                      >
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      </motion.div>
                      <p className="text-gray-600 mb-2 font-medium">
                        {dragActive ? "Drop your file here" : "Drag and drop your file here"}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">or</p>
                      <span className="inline-block px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium shadow-sm hover:bg-emerald-600 transition-colors">
                        Browse Files
                      </span>
                      <p className="text-xs text-gray-400 mt-4">.txt files only, max 10MB</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="flex items-start p-4 mb-6 bg-red-50 border border-red-200 rounded-xl"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </motion.div>
                )}
                
                {success && (
                  <motion.div
                    className="flex items-start p-4 mb-6 bg-green-50 border border-green-200 rounded-xl"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-green-700 text-sm">{success}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Supported Formats */}
              <div className="mb-6">
                <button 
                  className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => setShowFormatDetails(!showFormatDetails)}
                >
                  <div className="flex items-center">
                    <HelpCircle className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="font-medium text-gray-700">Supported Formats</span>
                  </div>
                  {showFormatDetails ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
                <AnimatePresence>
                  {showFormatDetails && (
                    <motion.div
                      className="overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mt-3 bg-gray-100 p-4 rounded-xl text-xs overflow-auto max-h-48">
                        <div className="mb-4">
                          <p className="font-semibold text-gray-800 mb-1">Format 1 (Traditional):</p>
                          <pre className="text-gray-700 bg-white p-2 rounded-md">
                            [12/24/23, 10:15:30 AM] John Doe: Good morning everyone!{"\n"}
                            [12/24/23, 10:16:45 AM] Jane Smith: Morning John! How are you?
                          </pre>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">Format 2 (New):</p>
                          <pre className="text-gray-700 bg-white p-2 rounded-md">
                            27/07/25, 9:28 pm - Jagruti: Areyyy{"\n"}
                            27/07/25, 9:28 pm - Jagruti: I am sorry yaar{"\n"}
                            28/07/25, 11:41 am - Prasad: I understand and respect your feelings.
                          </pre>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Both traditional and new WhatsApp formats are supported.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <motion.button
                className="w-full px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={handleUpload}
                disabled={isUploading || !file}
                whileTap={{ scale: isUploading || !file ? 1 : 0.98 }}
                whileHover={isUploading || !file ? {} : { scale: 1.02 }}
              >
                {isUploading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    />
                    <span>Processing your chat...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    <span>Analyze Chat</span>
                  </>
                )}
              </motion.button>

              {/* Privacy Note */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-sm text-blue-700 text-center">
                  <strong>Privacy First:</strong> Your data is processed locally and never stored on our servers.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default UploadPage;