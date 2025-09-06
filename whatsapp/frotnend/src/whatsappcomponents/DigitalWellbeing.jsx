import React, { useState, useEffect, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import moment from 'moment';
import chroma from 'chroma-js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);
const DigitalWellbeing = ({ chatData }) => {
  const [sleepImpactData, setSleepImpactData] = useState(null);
  const [lateNightStats, setLateNightStats] = useState(null);
  const [wellbeingScore, setWellbeingScore] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [sleepCorrelationChart, setSleepCorrelationChart] = useState(null);
  
  const analyzeDigitalWellbeing = useCallback(() => {
    if (!chatData) return;
    analyzeLateNightPatterns();
    analyzeSleepImpact();
    calculateWellbeingScore();
    generateRecommendations();
  }, [chatData]);
  
  // Analyze late night chat patterns
  const analyzeLateNightPatterns = () => {
    // In a real app, we would analyze actual timestamps
    // For demo purposes, we'll create simulated data
    
    // Define late night as messages sent after 11 PM
    const lateNightThreshold = 23; // 11 PM
    
    // Generate simulated data for the last 30 days
    const days = 30;
    const lateNightCounts = [];
    const dayLabels = [];
    let totalLateNightMessages = 0;
    let daysWithLateNightChats = 0;
    
    for (let i = 0; i < days; i++) {
      const date = moment().subtract(days - i - 1, 'days');
      dayLabels.push(date.format('MMM D'));
      
      // Generate random message count with higher probability on weekends
      const isWeekend = date.day() === 0 || date.day() === 6;
      const baseCount = isWeekend ? 15 : 5;
      const randomFactor = Math.random() * 10;
      const lateNightCount = Math.round(baseCount + randomFactor);
      
      lateNightCounts.push(lateNightCount);
      totalLateNightMessages += lateNightCount;
      
      if (lateNightCount > 0) {
        daysWithLateNightChats++;
      }
    }
    
    // Calculate stats
    const averageLateNightMessages = totalLateNightMessages / days;
    const lateNightFrequency = (daysWithLateNightChats / days) * 100;
    
    // Simulate a weekly trend (positive value means increasing late night chats)
    const firstWeekAvg = lateNightCounts.slice(0, 7).reduce((sum, count) => sum + count, 0) / 7;
    const lastWeekAvg = lateNightCounts.slice(-7).reduce((sum, count) => sum + count, 0) / 7;
    const weeklyTrend = ((lastWeekAvg - firstWeekAvg) / firstWeekAvg) * 100;
    
    setLateNightStats({
      totalLateNightMessages,
      averageLateNightMessages,
      lateNightFrequency,
      weeklyTrend,
      daysWithLateNightChats,
      dayLabels,
      lateNightCounts
    });
  };
  
  // Analyze sleep impact based on late night chats
  const analyzeSleepImpact = () => {
    // In a real app, we would correlate message timestamps with next day activity
    // For demo purposes, we'll create simulated data
    
    const days = 14; // Two weeks of data
    const dates = [];
    const lateNightActivity = [];
    const nextDayStartTime = [];
    const sleepQualityEstimate = [];
    
    for (let i = 0; i < days; i++) {
      const date = moment().subtract(days - i - 1, 'days');
      dates.push(date.format('MMM D'));
      
      // Generate random late night activity (messages after 11 PM)
      // Higher values mean more late night activity
      const lateNightValue = Math.floor(Math.random() * 60); // 0-60 minutes of activity after 11 PM
      lateNightActivity.push(lateNightValue);
      
      // Generate correlated next day start time
      // Base start time is 7:30 AM (450 minutes after midnight)
      // Add delay based on late night activity (with some randomness)
      const baseStartTime = 450; // 7:30 AM in minutes after midnight
      const impactFactor = 0.3; // How much each minute of late activity delays morning start
      const randomFactor = Math.random() * 30 - 15; // +/- 15 minutes random variation
      
      const startTimeDelay = Math.round(lateNightValue * impactFactor + randomFactor);
      const actualStartTime = baseStartTime + startTimeDelay;
      nextDayStartTime.push(actualStartTime);
      
      // Estimate sleep quality (inversely related to late night activity)
      // Scale from 0-100, where 100 is best sleep quality
      const baseQuality = 85; // Base sleep quality
      const qualityImpact = lateNightValue * 0.7; // Impact of late night chat
      const randomQualityFactor = Math.random() * 15; // Random variation
      
      const quality = Math.max(0, Math.min(100, baseQuality - qualityImpact + randomQualityFactor));
      sleepQualityEstimate.push(quality);
    }
    
    // Calculate correlation between late night activity and next day start time
    const correlation = calculateCorrelation(lateNightActivity, nextDayStartTime);
    
    // Average sleep quality
    const avgSleepQuality = sleepQualityEstimate.reduce((sum, quality) => sum + quality, 0) / days;
    
    // Identify days with poor sleep quality (below 60)
    const poorSleepDays = sleepQualityEstimate.filter(quality => quality < 60).length;
    
    // Create chart data for sleep impact visualization
    const chartData = {
      labels: dates,
      datasets: [
        {
          label: 'Late Night Chat (minutes after 11 PM)',
          data: lateNightActivity,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'Next Day Start (minutes after midnight)',
          data: nextDayStartTime,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          yAxisID: 'y1',
        },
        {
          label: 'Sleep Quality Estimate',
          data: sleepQualityEstimate,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          yAxisID: 'y2',
          borderDash: [5, 5],
        }
      ]
    };
    
    setSleepImpactData({
      correlation,
      avgSleepQuality,
      poorSleepDays,
      dates,
      lateNightActivity,
      nextDayStartTime,
      sleepQualityEstimate
    });
    
    setSleepCorrelationChart(chartData);
  };
  
  // Calculate wellbeing score based on chat patterns
  const calculateWellbeingScore = () => {
    if (!lateNightStats || !sleepImpactData) return;
    
    // Factors that affect wellbeing score:
    // 1. Frequency of late night chats (higher is worse)
    // 2. Average sleep quality (higher is better)
    // 3. Correlation between late night activity and next day start (higher is worse)
    // 4. Weekly trend of late night activity (positive trend is worse)
    
    // Convert late night frequency to a 0-100 score (0 = every day, 100 = never)
    const lateNightScore = 100 - lateNightStats.lateNightFrequency;
    
    // Sleep quality is already on a 0-100 scale
    const sleepQualityScore = sleepImpactData.avgSleepQuality;
    
    // Convert correlation to a 0-100 score (0 = perfect correlation, 100 = no correlation)
    const correlationScore = 100 - (Math.abs(sleepImpactData.correlation) * 100);
    
    // Convert weekly trend to a 0-100 score (negative trend is good, positive trend is bad)
    const trendMaxImpact = 25; // Maximum impact of trend on score
    const trendScore = Math.max(0, Math.min(100, 50 - (lateNightStats.weeklyTrend / 2)));
    
    // Calculate weighted average
    const score = Math.round(
      (lateNightScore * 0.3) +
      (sleepQualityScore * 0.4) +
      (correlationScore * 0.2) +
      (trendScore * 0.1)
    );
    
    // Determine wellbeing category
    let category;
    if (score >= 80) {
      category = 'Excellent';
    } else if (score >= 70) {
      category = 'Good';
    } else if (score >= 60) {
      category = 'Moderate';
    } else if (score >= 50) {
      category = 'Concerning';
    } else {
      category = 'Poor';
    }
    
    setWellbeingScore({
      score,
      category,
      components: {
        lateNightScore,
        sleepQualityScore,
        correlationScore,
        trendScore
      }
    });
  };
  
  // Generate personalized recommendations
  const generateRecommendations = () => {
    if (!wellbeingScore) return;
    
    const allRecommendations = [
      {
        id: 'sleep_time',
        title: 'Set a chat curfew',
        description: 'Try to finish chatting 30 minutes before your intended sleep time to allow your mind to wind down.',
        icon: '🌙',
        threshold: 70
      },
      {
        id: 'notification',
        title: 'Mute notifications after 10 PM',
        description: 'Muting notifications helps reduce the temptation to engage in late-night conversations.',
        icon: '🔕',
        threshold: 75
      },
      {
        id: 'blue_light',
        title: 'Use night mode',
        description: 'Enable night mode or blue light filter on your device to reduce sleep disruption from screen light.',
        icon: '📱',
        threshold: 80
      },
      {
        id: 'morning_routine',
        title: 'Establish a morning routine',
        description: 'Create a consistent morning routine that doesn\'t start with checking messages.',
        icon: '☀️',
        threshold: 65
      },
      {
        id: 'weekend_adjustment',
        title: 'Adjust weekend expectations',
        description: 'If you chat later on weekends, try to maintain a consistent wake-up time to avoid disrupting your sleep cycle.',
        icon: '📅',
        threshold: 85
      },
      {
        id: 'sleep_environment',
        title: 'Create a tech-free sleep environment',
        description: 'Keep your phone out of reach from your bed to resist checking messages when you should be sleeping.',
        icon: '🛌',
        threshold: 60
      }
    ];
    
    // Filter recommendations based on wellbeing score
    const filteredRecommendations = allRecommendations.filter(
      rec => wellbeingScore.score <= rec.threshold
    );
    
    // Sort by threshold (most relevant first)
    filteredRecommendations.sort((a, b) => a.threshold - b.threshold);
    
    // Take the top 3 most relevant recommendations
    setRecommendations(filteredRecommendations.slice(0, 3));
  };
  
  // Helper function to calculate correlation coefficient
  const calculateCorrelation = (arrayX, arrayY) => {
    const n = arrayX.length;
    
    // Calculate means
    const meanX = arrayX.reduce((sum, value) => sum + value, 0) / n;
    const meanY = arrayY.reduce((sum, value) => sum + value, 0) / n;
    
    // Calculate sums for correlation formula
    let numerator = 0;
    let denominatorX = 0;
    let denominatorY = 0;
    
    for (let i = 0; i < n; i++) {
      const diffX = arrayX[i] - meanX;
      const diffY = arrayY[i] - meanY;
      
      numerator += diffX * diffY;
      denominatorX += diffX * diffX;
      denominatorY += diffY * diffY;
    }
    
    // Calculate correlation coefficient
    const correlation = numerator / (Math.sqrt(denominatorX) * Math.sqrt(denominatorY));
    
    return correlation;
  };
  
  // Format time from minutes after midnight to AM/PM format
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours < 12 ? 'AM' : 'PM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };
  
  // Run analysis when component mounts or chatData changes
  useEffect(() => {
    analyzeDigitalWellbeing();
  }, [analyzeDigitalWellbeing]);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="mr-2 text-blue-600">🌙</span> Digital Wellbeing & Sleep Impact
      </h2>
      
      {/* Wellbeing Score */}
      {wellbeingScore && (
        <div className="mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-800">Digital Wellbeing Score</h3>
              <p className="text-gray-600 mb-4">
                Based on your late-night chat habits and their impact on your sleep patterns
              </p>
            </div>
            
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e6e6e6"
                  strokeWidth="3"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={wellbeingScore.score >= 80 ? "#10B981" : 
                          wellbeingScore.score >= 70 ? "#3B82F6" : 
                          wellbeingScore.score >= 60 ? "#F59E0B" : 
                          wellbeingScore.score >= 50 ? "#F97316" : "#EF4444"}
                  strokeWidth="3"
                  strokeDasharray={`${wellbeingScore.score}, 100`}
                  className="transition-all duration-1000 ease-out"
                />
                <text x="18" y="20.5" className="text-5xl font-bold" textAnchor="middle" fill="#374151">
                  {wellbeingScore.score}
                </text>
              </svg>
              <div className="absolute -bottom-2 w-full text-center">
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  wellbeingScore.score >= 80 ? "bg-green-100 text-green-800" : 
                  wellbeingScore.score >= 70 ? "bg-blue-100 text-blue-800" : 
                  wellbeingScore.score >= 60 ? "bg-yellow-100 text-yellow-800" : 
                  wellbeingScore.score >= 50 ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"
                }`}>
                  {wellbeingScore.category}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Late Night Habits</h4>
              <p className="text-lg font-semibold">{Math.round(wellbeingScore.components.lateNightScore)}/100</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Sleep Quality</h4>
              <p className="text-lg font-semibold">{Math.round(wellbeingScore.components.sleepQualityScore)}/100</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Sleep Impact</h4>
              <p className="text-lg font-semibold">{Math.round(wellbeingScore.components.correlationScore)}/100</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Trend</h4>
              <p className="text-lg font-semibold">{Math.round(wellbeingScore.components.trendScore)}/100</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Sleep Impact Analysis */}
      {sleepImpactData && sleepCorrelationChart && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Sleep Impact Detector</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Correlation between Late-Night Chats and Morning Activity</h4>
              <div className="h-72">
                <Line
                  data={sleepCorrelationChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: 'index',
                      intersect: false,
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            
                            if (label.includes('Next Day Start')) {
                              return `${label}: ${formatTime(value)}`;
                            } else if (label.includes('Sleep Quality')) {
                              return `${label}: ${value.toFixed(1)}/100`;
                            } else {
                              return `${label}: ${value} minutes`;
                            }
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                          display: true,
                          text: 'Minutes after 11 PM'
                        },
                        min: 0,
                        max: 70
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                          display: true,
                          text: 'Morning Start Time'
                        },
                        min: 400, // 6:40 AM
                        max: 550, // 9:10 AM
                        grid: {
                          drawOnChartArea: false,
                        },
                        ticks: {
                          callback: function(value) {
                            return formatTime(value);
                          }
                        }
                      },
                      y2: {
                        type: 'linear',
                        display: false,
                        min: 0,
                        max: 100,
                      }
                    }
                  }}
                />
              </div>
              <div className="text-sm text-gray-500 mt-2">
                <p>
                  Correlation coefficient: <span className="font-medium">{sleepImpactData.correlation.toFixed(2)}</span>
                  {Math.abs(sleepImpactData.correlation) >= 0.7 ? 
                    ' (Strong correlation between late-night chats and later morning start times)' : 
                    Math.abs(sleepImpactData.correlation) >= 0.4 ? 
                    ' (Moderate correlation between late-night chats and morning activity)' : 
                    ' (Weak correlation between late-night chats and morning activity)'}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Sleep Statistics</h4>
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Average Sleep Quality</p>
                  <div className="flex items-center">
                    <div className="text-xl font-bold text-indigo-700">{sleepImpactData.avgSleepQuality.toFixed(1)}/100</div>
                    <div className="ml-3 flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          sleepImpactData.avgSleepQuality >= 80 ? "bg-green-500" : 
                          sleepImpactData.avgSleepQuality >= 60 ? "bg-yellow-500" : 
                          "bg-red-500"
                        }`}
                        style={{width: `${sleepImpactData.avgSleepQuality}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Days with Poor Sleep Quality</p>
                  <p className="text-xl font-bold text-indigo-700">
                    {sleepImpactData.poorSleepDays} <span className="text-sm font-normal text-gray-500">out of {sleepImpactData.dates.length} days</span>
                  </p>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Impact on Morning Start Time</p>
                  <p className="text-xl font-bold text-indigo-700">
                    +{Math.round((Math.max(...sleepImpactData.nextDayStartTime) - Math.min(...sleepImpactData.nextDayStartTime)) / 60 * 10) / 10} hours
                  </p>
                  <p className="text-xs text-gray-500">Maximum variation in morning start times</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Late Night Chat Frequency</p>
                  <p className="text-xl font-bold text-indigo-700">
                    {lateNightStats && Math.round(lateNightStats.lateNightFrequency)}% <span className="text-sm font-normal text-gray-500">of days</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Late Night Chat Patterns */}
      {lateNightStats && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Late-Night Chat Patterns</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-indigo-700 mb-1">
                {lateNightStats.daysWithLateNightChats}
              </div>
              <p className="text-sm text-indigo-800">
                Days with late-night activity
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                Out of the past 30 days
              </p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-indigo-700 mb-1">
                {Math.round(lateNightStats.averageLateNightMessages)}
              </div>
              <p className="text-sm text-indigo-800">
                Average late-night messages
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                Messages sent after 11 PM daily
              </p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className={`text-2xl font-bold mb-1 ${
                lateNightStats.weeklyTrend > 0 ? "text-red-600" : "text-green-600"
              }`}>
                {lateNightStats.weeklyTrend > 0 ? "+" : ""}{Math.round(lateNightStats.weeklyTrend)}%
              </div>
              <p className="text-sm text-indigo-800">
                Weekly trend
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                {lateNightStats.weeklyTrend > 0 ? "Increasing" : "Decreasing"} late-night activity
              </p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-indigo-700 mb-1">
                {lateNightStats.totalLateNightMessages}
              </div>
              <p className="text-sm text-indigo-800">
                Total late-night messages
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                In the past 30 days
              </p>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">Late-Night Chat Frequency (Past 30 Days)</h4>
            <div className="h-60">
              <Bar
                data={{
                  labels: lateNightStats.dayLabels,
                  datasets: [
                    {
                      label: 'Messages after 11 PM',
                      data: lateNightStats.lateNightCounts,
                      backgroundColor: lateNightStats.lateNightCounts.map(count => 
                        count > 20 ? 'rgba(239, 68, 68, 0.7)' : 
                        count > 10 ? 'rgba(249, 115, 22, 0.7)' : 
                        'rgba(59, 130, 246, 0.7)'
                      ),
                      borderColor: lateNightStats.lateNightCounts.map(count => 
                        count > 20 ? 'rgba(239, 68, 68, 1)' : 
                        count > 10 ? 'rgba(249, 115, 22, 1)' : 
                        'rgba(59, 130, 246, 1)'
                      ),
                      borderWidth: 1,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const value = context.raw;
                          return `${value} message${value !== 1 ? 's' : ''}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Message Count',
                        font: {
                          weight: 'bold',
                        }
                      }
                    },
                    x: {
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Personalized Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((recommendation, index) => (
              <div key={recommendation.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
                <div className="flex items-start">
                  <div className="text-2xl mr-3">{recommendation.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">{recommendation.title}</h4>
                    <p className="text-sm text-gray-600">{recommendation.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalWellbeing;
