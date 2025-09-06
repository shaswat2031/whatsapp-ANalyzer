import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TotalMessage from '../whatsappcomponents/TotalMessage';
import MostMessage from '../whatsappcomponents/mostmessage';
import AdvancedAnalysis from '../whatsappcomponents/AdvancedAnalysis';
import PredictiveTrends from '../whatsappcomponents/PredictiveTrends';
import DigitalWellbeing from '../whatsappcomponents/DigitalWellbeing';

function ResultsPage() {
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('chatAnalysis');
    
    if (!storedData) {
      navigate('/upload');
      return;
    }
    
    try {
      setChatData(JSON.parse(storedData));
    } catch (error) {
      console.error('Error parsing chat data:', error);
      navigate('/upload');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        WhatsApp Chat Analysis Results
      </h1>
      
      {chatData && (
        <>
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto mb-6 bg-white rounded-lg shadow">
            <button 
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'overview' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-600 hover:text-green-500'}`}
              onClick={() => setActiveTab('overview')}
            >
              Message Overview
            </button>
            <button 
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'most-used' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-600 hover:text-green-500'}`}
              onClick={() => setActiveTab('most-used')}
            >
              Most Used Messages
            </button>
            <button 
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'advanced' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-600 hover:text-green-500'}`}
              onClick={() => setActiveTab('advanced')}
            >
              Advanced Analysis
            </button>
           
            <button 
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'wellbeing' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-600 hover:text-green-500'}`}
              onClick={() => setActiveTab('wellbeing')}
            >
              Digital Wellbeing
            </button>
            <button 
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'predictions' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-600 hover:text-green-500'}`}
              onClick={() => setActiveTab('predictions')}
            >
              Predictive Trends
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="grid grid-cols-1">
            {activeTab === 'overview' && <TotalMessage chatData={chatData} />}
            {activeTab === 'most-used' && <MostMessage chatData={chatData} />}
            {activeTab === 'advanced' && <AdvancedAnalysis chatData={chatData} />}
            {activeTab === 'sentiment' && <SentimentAnalyzer chatData={chatData} />}
            {activeTab === 'wellbeing' && <DigitalWellbeing chatData={chatData} />}
            {activeTab === 'predictions' && <PredictiveTrends chatData={chatData} />}
          </div>
        </>
      )}
      
      <div className="mt-8 text-center">
        <button 
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          onClick={() => navigate('/upload')}
        >
          Analyze Another Chat
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;
