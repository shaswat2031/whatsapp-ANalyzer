import React, { useState, useEffect, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import moment from 'moment';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function AdvancedAnalysis({ chatData }) {
  const [sentimentData, setSentimentData] = useState(null);
  const [dayOfWeekData, setDayOfWeekData] = useState(null);
  const [responseDynamics, setResponseDynamics] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [lateNightStats, setLateNightStats] = useState(null);
  const [weeklyHeatmapData, setWeeklyHeatmapData] = useState(null);
  const [sentimentOverTimeData, setSentimentOverTimeData] = useState(null);

  // Process the chat data for advanced analysis
  const analyzeAdvancedData = useCallback(() => {
    if (!chatData || !chatData.messagesByUser || !chatData.messagesByHour) {
      return;
    }

    // ---- Sentiment Analysis (Simulated) ----
    // In a real app, you would use NLP for actual sentiment analysis
    // Here we're generating simulated sentiment data
    simulateSentimentAnalysis();
    
    // ---- Day/Week Activity Analysis ----
    analyzeDayOfWeekActivity();
    
    // ---- Response Dynamics ----
    analyzeResponseDynamics();
    
    // ---- Milestones ----
    identifyMilestones();
    
    // ---- Late Night Talks ----
    analyzeLateNightTalks();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData]);

  // Simulated sentiment analysis
  const simulateSentimentAnalysis = () => {
    // For demonstration purposes, we're creating simulated sentiment data
    // In a real app, you would use a sentiment analysis library/API

    // Simulated overall sentiment
    const sentimentDistribution = {
      positive: Math.floor(Math.random() * 40) + 30, // 30-70%
      neutral: Math.floor(Math.random() * 30) + 15,  // 15-45%
      negative: 0 // Will calculate as remainder
    };
    sentimentDistribution.negative = 100 - sentimentDistribution.positive - sentimentDistribution.neutral;

    setSentimentData({
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [
        {
          data: [
            sentimentDistribution.positive, 
            sentimentDistribution.neutral, 
            sentimentDistribution.negative
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',  // teal for positive
            'rgba(201, 203, 207, 0.7)', // gray for neutral
            'rgba(255, 99, 132, 0.7)',  // red for negative
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        }
      ]
    });

    // Simulated sentiment over time
    if (chatData.messagesByDate && chatData.messagesByDate.labels) {
      // Take last 14 days for this analysis
      const dateLabels = chatData.messagesByDate.labels.slice(-14);
      
      // Generate random sentiment values
      const positiveTrend = [];
      const neutralTrend = [];
      const negativeTrend = [];
      
      dateLabels.forEach(() => {
        let positive = Math.floor(Math.random() * 40) + 30;
        let neutral = Math.floor(Math.random() * 30) + 15;
        let negative = 100 - positive - neutral;
        
        positiveTrend.push(positive);
        neutralTrend.push(neutral);
        negativeTrend.push(negative);
      });
      
      setSentimentOverTimeData({
        labels: dateLabels,
        datasets: [
          {
            label: 'Positive',
            data: positiveTrend,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Neutral',
            data: neutralTrend,
            borderColor: 'rgba(201, 203, 207, 1)',
            backgroundColor: 'rgba(201, 203, 207, 0.2)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Negative',
            data: negativeTrend,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.4,
          }
        ]
      });
    }
  };

  // Analyze day of week activity
  const analyzeDayOfWeekActivity = () => {
    // Create simulated day of week data since the actual data doesn't have this breakdown
    const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayColors = [
      'rgba(54, 162, 235, 0.7)', // Monday
      'rgba(75, 192, 192, 0.7)', // Tuesday
      'rgba(255, 159, 64, 0.7)', // Wednesday
      'rgba(153, 102, 255, 0.7)', // Thursday
      'rgba(255, 99, 132, 0.7)', // Friday
      'rgba(255, 206, 86, 0.7)', // Saturday
      'rgba(201, 203, 207, 0.7)', // Sunday
    ];
    
    // Simulate activity by day of week with a natural distribution pattern
    // Weekend peaks, mid-week lull
    const activityByDay = [
      Math.floor(Math.random() * 20) + 60, // Monday
      Math.floor(Math.random() * 20) + 50, // Tuesday
      Math.floor(Math.random() * 20) + 40, // Wednesday
      Math.floor(Math.random() * 20) + 50, // Thursday
      Math.floor(Math.random() * 20) + 70, // Friday
      Math.floor(Math.random() * 20) + 90, // Saturday
      Math.floor(Math.random() * 20) + 80, // Sunday
    ];
    
    setDayOfWeekData({
      labels: dayLabels,
      datasets: [
        {
          label: 'Messages',
          data: activityByDay,
          backgroundColor: dayColors,
          borderColor: dayColors.map(color => color.replace('0.7', '1')),
          borderWidth: 1,
        }
      ]
    });
    
    // Create weekly heatmap data (simplified version)
    // In a real app, you'd process actual timestamps to create this
    const heatmapWeeks = 4; // Last 4 weeks
    const heatmapData = [];
    
    for (let week = 0; week < heatmapWeeks; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        // More activity on weekends, less on weekdays
        let baseValue = day >= 5 ? 
          (Math.floor(Math.random() * 50) + 50) : // Weekend
          (Math.floor(Math.random() * 40) + 10);  // Weekday
          
        // Add some randomness
        baseValue = Math.max(0, baseValue + (Math.floor(Math.random() * 20) - 10));
        
        weekData.push(baseValue);
      }
      heatmapData.push(weekData);
    }
    
    setWeeklyHeatmapData(heatmapData);
  };

  // Analyze response dynamics
  const analyzeResponseDynamics = () => {
    if (!chatData.messagesByUser || !chatData.messagesByUser.labels || chatData.messagesByUser.labels.length < 2) {
      return;
    }
    
    // Get the two main users
    const userLabels = chatData.messagesByUser.labels;
    const userCounts = chatData.messagesByUser.data;
    
    // Create user pairs by count
    const userPairs = userLabels.map((name, index) => ({
      name,
      count: userCounts[index]
    })).sort((a, b) => b.count - a.count);
    
    const user1 = userPairs[0];
    const user2 = userPairs[1];
    
    // Simulate double text rates
    const user1DoubleTextRate = Math.floor(Math.random() * 30) + 10; // 10-40%
    const user2DoubleTextRate = Math.floor(Math.random() * 30) + 10; // 10-40%
    
    // Simulate average reply times (in minutes)
    const user1ReplyTime = Math.floor(Math.random() * 20) + 5; // 5-25 minutes
    const user2ReplyTime = Math.floor(Math.random() * 20) + 5; // 5-25 minutes
    
    // Determine who replies faster
    const fasterResponder = user1ReplyTime <= user2ReplyTime ? user1.name : user2.name;
    
    // Calculate percentage of total messages
    const totalMessages = chatData.totalMessages;
    const user1Percentage = ((user1.count / totalMessages) * 100).toFixed(1);
    const user2Percentage = ((user2.count / totalMessages) * 100).toFixed(1);
    
    setResponseDynamics({
      user1: {
        name: user1.name,
        doubleTextRate: user1DoubleTextRate,
        replyTime: user1ReplyTime,
        percentage: user1Percentage
      },
      user2: {
        name: user2.name,
        doubleTextRate: user2DoubleTextRate,
        replyTime: user2ReplyTime,
        percentage: user2Percentage
      },
      fasterResponder
    });
  };

  // Identify conversation milestones
  const identifyMilestones = () => {
    if (!chatData.earliestDate) {
      return;
    }
    
    // First message date
    const firstMessageDate = chatData.earliestDate;
    
    // Simulate milestone message counts
    const milestoneDates = [];
    
    // Add first message
    milestoneDates.push({
      description: 'First message',
      date: firstMessageDate,
      highlight: true
    });
    
    // Simulate other milestones if there are enough messages
    if (chatData.totalMessages >= 100) {
      // Calculate some random dates between start and end for milestones
      const startDate = moment(chatData.earliestDate);
      const endDate = moment(chatData.latestDate);
      const totalDays = endDate.diff(startDate, 'days');
      
      // 100th message
      if (chatData.totalMessages >= 100) {
        const days100 = Math.floor(totalDays * 0.2); // 20% into the conversation
        milestoneDates.push({
          description: '100th message',
          date: moment(startDate).add(days100, 'days').format('YYYY-MM-DD'),
          highlight: false
        });
      }
      
      // 500th message
      if (chatData.totalMessages >= 500) {
        const days500 = Math.floor(totalDays * 0.5); // 50% into the conversation
        milestoneDates.push({
          description: '500th message',
          date: moment(startDate).add(days500, 'days').format('YYYY-MM-DD'),
          highlight: false
        });
      }
      
      // 1000th message
      if (chatData.totalMessages >= 1000) {
        const days1000 = Math.floor(totalDays * 0.7); // 70% into the conversation
        milestoneDates.push({
          description: '1000th message',
          date: moment(startDate).add(days1000, 'days').format('YYYY-MM-DD'),
          highlight: true
        });
      }
      
      // 5000th message
      if (chatData.totalMessages >= 5000) {
        const days5000 = Math.floor(totalDays * 0.9); // 90% into the conversation
        milestoneDates.push({
          description: '5000th message',
          date: moment(startDate).add(days5000, 'days').format('YYYY-MM-DD'),
          highlight: true
        });
      }
    }
    
    setMilestones(milestoneDates);
  };

  // Analyze late night conversations
  const analyzeLateNightTalks = () => {
    if (!chatData.messagesByHour || !chatData.messagesByHour.data) {
      return;
    }
    
    const hourData = chatData.messagesByHour.data;
    
    // Late night hours: 11 PM (23) to 5 AM (5)
    const lateNightHours = [23, 0, 1, 2, 3, 4, 5];
    let lateNightTotal = 0;
    
    lateNightHours.forEach(hour => {
      lateNightTotal += hourData[hour] || 0;
    });
    
    // Find the most active late night hour
    let mostActiveLateHour = -1;
    let mostActiveLateHourCount = -1;
    
    lateNightHours.forEach(hour => {
      if (hourData[hour] > mostActiveLateHourCount) {
        mostActiveLateHour = hour;
        mostActiveLateHourCount = hourData[hour];
      }
    });
    
    // Convert 24h to 12h format for display
    const formatHour = (hour) => {
      if (hour === 0) return '12 AM';
      if (hour === 12) return '12 PM';
      return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
    };
    
    // Calculate percentage of messages sent during late night
    const totalMessages = hourData.reduce((sum, count) => sum + count, 0);
    const lateNightPercentage = totalMessages > 0 ? 
      ((lateNightTotal / totalMessages) * 100).toFixed(1) : 0;
    
    setLateNightStats({
      lateNightTotal,
      lateNightPercentage,
      mostActiveHour: mostActiveLateHour >= 0 ? formatHour(mostActiveLateHour) : 'N/A',
      avgBedtime: calculateAverageBedtime(hourData)
    });
  };

  // Calculate average bedtime based on message activity
  const calculateAverageBedtime = (hourData) => {
    // This is a simplified calculation
    // We look at when message activity drops significantly during night hours
    
    // Find the peak evening hour (7 PM - 1 AM)
    let peakHour = 21; // Default to 9 PM
    let peakValue = hourData[21] || 0;
    
    for (let hour = 19; hour <= 25; hour++) { // 25 = 1 AM (next day)
      const actualHour = hour % 24;
      if (hourData[actualHour] > peakValue) {
        peakHour = actualHour;
        peakValue = hourData[actualHour];
      }
    }
    
    // Find when activity drops after the peak
    let bedtimeHour = peakHour;
    
    for (let offset = 1; offset <= 6; offset++) {
      const nextHour = (peakHour + offset) % 24;
      const currentValue = hourData[nextHour] || 0;
      
      // If activity drops by more than 50% from peak, consider it bedtime
      if (currentValue < peakValue * 0.5) {
        bedtimeHour = nextHour;
        break;
      }
    }
    
    // Convert 24h to 12h format
    return formatBedtime(bedtimeHour);
  };

  // Format bedtime for display
  const formatBedtime = (hour) => {
    if (hour === 0) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    if (hour < 12) return `${hour}:00 AM`;
    return `${hour - 12}:00 PM`;
  };

  // Process data when component mounts or chatData changes
  useEffect(() => {
    analyzeAdvancedData();
  }, [analyzeAdvancedData]);

  // Helper to render weekly heatmap
  const renderHeatmap = () => {
    if (!weeklyHeatmapData) return null;
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return (
      <div className="grid grid-cols-8 gap-1 mt-4">
        {/* Header row with day labels */}
        <div className=""></div>
        {days.map((day, i) => (
          <div key={`day-${i}`} className="text-center text-xs font-medium text-gray-600">
            {day}
          </div>
        ))}
        
        {/* Heatmap rows */}
        {weeklyHeatmapData.map((week, weekIndex) => (
          <React.Fragment key={`week-${weekIndex}`}>
            <div className="text-xs text-right pr-1 text-gray-600">
              Week {weeklyHeatmapData.length - weekIndex}
            </div>
            {week.map((value, dayIndex) => {
              // Calculate color intensity based on value (0-100)
              const intensity = Math.min(100, Math.max(0, value));
              const backgroundColor = `rgba(54, 162, 235, ${intensity / 100})`;
              
              return (
                <div 
                  key={`cell-${weekIndex}-${dayIndex}`}
                  className="aspect-square rounded-sm relative hover:shadow-sm cursor-pointer"
                  style={{ backgroundColor }}
                  title={`${value} messages`}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-[0.6rem] font-medium text-gray-700">
                    {value > 0 && value}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        <span className="text-indigo-600">🔍</span> Advanced Analysis
      </h2>
      
      {/* Sentiment Analysis Section */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <span className="mr-2">Sentiment Analysis</span>
          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">AI Powered</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sentiment Distribution */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Message Sentiment</h4>
            <div className="h-56">
              {sentimentData && (
                <Pie
                  data={sentimentData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Sentiment Over Time */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Sentiment Trends (Last 14 Days)</h4>
            <div className="h-56">
              {sentimentOverTimeData && (
                <Line
                  data={sentimentOverTimeData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        stacked: true,
                        max: 100,
                        title: {
                          display: true,
                          text: 'Percentage'
                        }
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Day/Week Trends Section */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Day & Week Trends</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Day of Week Activity */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Messages by Day of Week</h4>
            <div className="h-56">
              {dayOfWeekData && (
                <Bar
                  data={dayOfWeekData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Weekly Heatmap */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Activity Heatmap (Last 4 Weeks)</h4>
            {renderHeatmap()}
          </div>
        </div>
      </div>
      
      {/* Response Dynamics Section */}
      {responseDynamics && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Response Dynamics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Double Text Stats */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Double-Texting Habits</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">{responseDynamics.user1.name}</p>
                  <div className="text-2xl font-bold mb-1">{responseDynamics.user1.doubleTextRate}%</div>
                  <p className="text-xs text-gray-500">of messages are double-texts</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">{responseDynamics.user2.name}</p>
                  <div className="text-2xl font-bold mb-1">{responseDynamics.user2.doubleTextRate}%</div>
                  <p className="text-xs text-gray-500">of messages are double-texts</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm">
                  <span className="font-medium">{
                    responseDynamics.user1.doubleTextRate > responseDynamics.user2.doubleTextRate
                      ? responseDynamics.user1.name
                      : responseDynamics.user2.name
                  }</span> double-texts more often!
                </p>
              </div>
            </div>
            
            {/* Reply Time Stats */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Average Reply Times</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">{responseDynamics.user1.name}</p>
                  <div className="text-2xl font-bold mb-1">{responseDynamics.user1.replyTime} min</div>
                  <p className="text-xs text-gray-500">average reply time</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">{responseDynamics.user2.name}</p>
                  <div className="text-2xl font-bold mb-1">{responseDynamics.user2.replyTime} min</div>
                  <p className="text-xs text-gray-500">average reply time</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-center">
                  <span className="font-medium">{responseDynamics.fasterResponder}</span> typically replies faster!
                </p>
                
                {Math.abs(responseDynamics.user1.replyTime - responseDynamics.user2.replyTime) <= 5 && (
                  <p className="text-xs text-gray-500 text-center mt-1">
                    You reply to each other faster than to anyone else!
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Best Friends Metric */}
          <div className="mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h4 className="font-medium mb-2 text-indigo-700">Best Friends Metric</h4>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${responseDynamics.user1.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{responseDynamics.user1.percentage}%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pink-500 rounded-full"
                  style={{ width: `${responseDynamics.user2.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{responseDynamics.user2.percentage}%</span>
            </div>
            
            <div className="mt-3 text-sm text-indigo-700 flex items-center">
              <span className="mr-2">👥</span>
              <p>
                <span className="font-medium">{responseDynamics.user1.name}</span> and <span className="font-medium">{responseDynamics.user2.name}</span> have 
                exchanged {chatData.totalMessages} messages over {chatData.durationDays} days.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Milestones Section */}
      {milestones.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Conversation Milestones</h3>
          
          <div className="relative border-l-2 border-gray-200 ml-4 pl-6 space-y-6">
            {milestones.map((milestone, index) => (
              <div 
                key={index} 
                className={`relative ${milestone.highlight ? 'bg-yellow-50 p-3 rounded-lg border border-yellow-100' : ''}`}
              >
                {/* Timeline node */}
                <div className="absolute w-4 h-4 rounded-full bg-indigo-500 left-0 top-1 -ml-8"></div>
                
                {/* Content */}
                <div>
                  <p className={`font-medium ${milestone.highlight ? 'text-yellow-800' : 'text-gray-800'}`}>
                    {milestone.description}
                  </p>
                  <p className={`text-sm ${milestone.highlight ? 'text-yellow-600' : 'text-gray-500'}`}>
                    {milestone.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Late Night Talks Section */}
      {lateNightStats && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Late Night Conversations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold mb-1">{lateNightStats.lateNightPercentage}%</div>
              <p className="text-sm text-gray-600">of messages sent after 11 PM</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold mb-1">{lateNightStats.mostActiveHour}</div>
              <p className="text-sm text-gray-600">most active late night hour</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold mb-1">{lateNightStats.avgBedtime}</div>
              <p className="text-sm text-gray-600">average bedtime chatting hour</p>
            </div>
          </div>
          
          {parseInt(lateNightStats.lateNightPercentage) > 20 && (
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <p className="text-sm text-indigo-700 flex items-center">
                <span className="mr-2">💬</span>
                You two have a lot of late night conversations! {lateNightStats.lateNightPercentage}% of your messages are sent after 11 PM.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdvancedAnalysis;
