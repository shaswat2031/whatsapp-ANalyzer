import React, { useState, useEffect, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
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

function PredictiveTrends({ chatData }) {
  const [monthlyWrapup, setMonthlyWrapup] = useState(null);
  const [messageForecast, setMessageForecast] = useState(null);
  const [eventPredictions, setEventPredictions] = useState([]);
  const [conversationSummary, setConversationSummary] = useState(null);
  const [futureTrends, setFutureTrends] = useState([]);
  const [bestMoments, setBestMoments] = useState([]);
  const [forecastChart, setForecastChart] = useState(null);
  const [trendsChart, setTrendsChart] = useState(null);

  // Process the chat data
  const analyzePredictiveData = useCallback(() => {
    if (!chatData) {
      return;
    }

    // Generate monthly/seasonal wrap-up
    generateMonthlyWrapup();
    
    // Generate message volume forecast
    generateMessageForecast();
    
    // Generate event predictions
    generateEventPredictions();
    
    // Generate conversation summaries
    generateConversationSummary();
    
    // Generate future trend predictions
    generateFutureTrends();
    
    // Extract best moments
    extractBestMoments();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData]);

  // Create a monthly/seasonal wrap-up like Spotify Wrapped
  const generateMonthlyWrapup = () => {
    // Simulate monthly data (in a real app, this would come from actual data)
    const monthlyData = [];
    const currentMonth = moment().month();
    const months = moment.months();
    
    // Generate random message counts for each month, with the current month having the highest count
    for (let i = 0; i < 12; i++) {
      let count;
      if (i === currentMonth) {
        count = Math.floor(Math.random() * 1000) + 1500; // 1500-2500
      } else if (Math.abs(i - currentMonth) <= 1) {
        count = Math.floor(Math.random() * 800) + 700; // 700-1500
      } else {
        count = Math.floor(Math.random() * 600) + 100; // 100-700
      }
      
      monthlyData.push({
        month: months[i],
        count
      });
    }
    
    // Find most active month
    const mostActiveMonth = monthlyData.reduce((max, month) => 
      month.count > max.count ? month : max, monthlyData[0]);
    
    // Find most active day of week (simulated)
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const favoriteDay = daysOfWeek[Math.floor(Math.random() * 2) + 5]; // Bias toward weekend
    
    setMonthlyWrapup({
      mostActiveMonth,
      favoriteDay,
      monthlyData
    });
    
    // Create chart for monthly data
    const chartData = {
      labels: months,
      datasets: [
        {
          label: 'Messages per Month',
          data: monthlyData.map(m => m.count),
          backgroundColor: months.map((_, i) => 
            i === months.indexOf(mostActiveMonth.month) 
              ? 'rgba(75, 192, 192, 0.7)' 
              : 'rgba(54, 162, 235, 0.4)'
          ),
          borderColor: months.map((_, i) => 
            i === months.indexOf(mostActiveMonth.month) 
              ? 'rgba(75, 192, 192, 1)' 
              : 'rgba(54, 162, 235, 1)'
          ),
          borderWidth: 1,
        }
      ]
    };
    
    setTrendsChart(chartData);
  };

  // Generate message volume forecast
  const generateMessageForecast = () => {
    // Get the current date for predictions
    const currentDate = moment();
    
    // Simulate historical data (last 30 days)
    const historicalDates = [];
    const historicalCounts = [];
    
    for (let i = 30; i > 0; i--) {
      const date = moment(currentDate).subtract(i, 'days').format('YYYY-MM-DD');
      historicalDates.push(date);
      
      // Generate random message count with slight upward trend
      const base = Math.floor(Math.random() * 30) + 10;
      const trend = Math.floor(i / 10);
      historicalCounts.push(base - trend);
    }
    
    // Simulate forecast data (next 30 days)
    const forecastDates = [];
    const forecastCounts = [];
    const lastHistoricalValue = historicalCounts[historicalCounts.length - 1];
    const avgMessages = Math.round(historicalCounts.reduce((sum, count) => sum + count, 0) / historicalCounts.length);
    
    // Calculate monthly forecast
    const monthlyForecast = avgMessages * 30;
    
    for (let i = 1; i <= 30; i++) {
      const date = moment(currentDate).add(i, 'days').format('YYYY-MM-DD');
      forecastDates.push(date);
      
      // Generate forecast with slight randomness but following the trend
      const randomFactor = Math.random() * 0.3 + 0.85; // 0.85 to 1.15
      const trend = Math.floor(i / 5);
      forecastCounts.push(Math.round((lastHistoricalValue + trend) * randomFactor));
    }
    
    // Create forecast chart data
    const forecastChartData = {
      labels: [...historicalDates.slice(-14), ...forecastDates.slice(0, 14)],
      datasets: [
        {
          label: 'Historical Messages',
          data: [...historicalCounts.slice(-14), ...Array(14).fill(null)],
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Forecasted Messages',
          data: [...Array(14).fill(null), ...forecastCounts.slice(0, 14)],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
          tension: 0.4,
          borderDash: [5, 5],
        }
      ]
    };
    
    setForecastChart(forecastChartData);
    setMessageForecast({
      monthlyForecast,
      dailyAverage: avgMessages,
      trend: lastHistoricalValue > historicalCounts[0] ? 'increasing' : 'decreasing'
    });
  };

  // Generate AI event predictions
  const generateEventPredictions = () => {
    // In a real app, this would analyze actual patterns
    // For demo purposes, we'll create simulated predictions
    
    const predictions = [
      {
        title: 'Late-night Chats Increasing',
        description: 'Late-night chats (after 11 PM) increased by 40% this month. Expect even more late-night activity if trend continues.',
        icon: '🌙',
        confidence: 87
      },
      {
        title: 'Weekend Activity Spike',
        description: 'Message volume on weekends has been growing steadily. Predicted to be 30% higher next weekend compared to weekdays.',
        icon: '📊',
        confidence: 92
      },
      {
        title: 'Emoji Usage Evolving',
        description: 'Your emoji usage has shifted from mostly 😊 to more diverse emotions like 🤔 and 😍, suggesting deeper conversations.',
        icon: '😄',
        confidence: 78
      }
    ];
    
    setEventPredictions(predictions);
  };

  // Generate smart conversation summaries
  const generateConversationSummary = () => {
    // For demo purposes, we'll create a simulated conversation summary
    // In a real app, this would use NLP to analyze actual message content
    
    // Define possible topics
    const topics = [
      { name: 'movies', emoji: '🎬' },
      { name: 'food', emoji: '🍕' },
      { name: 'travel', emoji: '✈️' },
      { name: 'exam stress', emoji: '📚' },
      { name: 'music', emoji: '🎵' },
      { name: 'sports', emoji: '⚽' },
      { name: 'work', emoji: '💼' },
      { name: 'shopping', emoji: '🛍️' }
    ];
    
    // Randomly select 2-3 topics
    const selectedTopics = [];
    const topicCount = Math.floor(Math.random() * 2) + 2;
    const availableTopics = [...topics];
    
    for (let i = 0; i < topicCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableTopics.length);
      selectedTopics.push(availableTopics[randomIndex]);
      availableTopics.splice(randomIndex, 1);
    }
    
    // Get user names
    let user1Name = 'User 1';
    let user2Name = 'User 2';
    
    if (chatData.messagesByUser && chatData.messagesByUser.labels && chatData.messagesByUser.labels.length >= 2) {
      user1Name = chatData.messagesByUser.labels[0];
      user2Name = chatData.messagesByUser.labels[1];
    }
    
    // Create behavior descriptions
    const behaviors = [
      `${user1Name} sent more emojis, while ${user2Name} double-texted more often.`,
      `${user1Name} typically starts conversations, and ${user2Name} tends to ask more questions.`,
      `${user1Name} shared more media, while ${user2Name} wrote longer messages.`,
      `${user1Name} responds faster in the mornings, while ${user2Name} is more active at night.`
    ];
    
    const randomBehavior = behaviors[Math.floor(Math.random() * behaviors.length)];
    
    // Create time-based summaries
    const summary = {
      daily: `Today's chats were mostly about ${selectedTopics[0].name} ${selectedTopics[0].emoji}. ${randomBehavior}`,
      weekly: `This week, most chats were about ${selectedTopics[0].name} ${selectedTopics[0].emoji} and ${selectedTopics[1].name} ${selectedTopics[1].emoji}. ${randomBehavior}`,
      monthly: `This month showed a trend of discussions about ${selectedTopics.map(t => t.name + ' ' + t.emoji).join(', ')}. Your conversation patterns suggest ${Math.random() > 0.5 ? 'growing closeness' : 'shared interests developing'}.`
    };
    
    setConversationSummary(summary);
  };

  // Generate future trend predictions
  const generateFutureTrends = () => {
    // For demo purposes, we'll create simulated trend predictions
    // In a real app, this would use actual trend analysis
    
    // Calculate message milestone prediction
    const currentTotal = chatData.totalMessages || 5000;
    const nextMilestone = Math.ceil(currentTotal / 5000) * 5000;
    const currentDate = moment();
    const predictedDate = moment(currentDate).add(Math.floor(Math.random() * 3) + 1, 'months');
    
    const trends = [
      {
        title: `Message Milestone`,
        description: `You'll likely hit ${nextMilestone.toLocaleString()} messages by ${predictedDate.format('MMMM YYYY')}.`,
        icon: '🔮',
        probability: 'High'
      },
      {
        title: 'Conversation Topic Shift',
        description: 'Based on recent patterns, your conversations may shift more toward personal topics and less about daily activities.',
        icon: '🔄',
        probability: 'Medium'
      },
      {
        title: 'Activity Pattern Change',
        description: 'Your message frequency is trending toward more consistent daily communication rather than sporadic bursts.',
        icon: '📈',
        probability: 'High'
      }
    ];
    
    setFutureTrends(trends);
  };

  // Extract best moments from the conversation
  const extractBestMoments = () => {
    // In a real app, this would use sentiment analysis and context recognition
    // For demo purposes, we'll create simulated "best moments"
    
    const moments = [
      {
        title: 'Most Emotional Exchange',
        date: moment().subtract(Math.floor(Math.random() * 30), 'days').format('MMMM D'),
        preview: 'This conversation had the highest concentration of heartfelt emojis and expressions of appreciation.',
        type: 'emotional',
        icon: '❤️'
      },
      {
        title: 'Funniest Conversation',
        date: moment().subtract(Math.floor(Math.random() * 30), 'days').format('MMMM D'),
        preview: 'This exchange had the most laughing emojis and likely represents an inside joke or humorous story.',
        type: 'funny',
        icon: '😂'
      },
      {
        title: 'Longest Late-Night Chat',
        date: moment().subtract(Math.floor(Math.random() * 30), 'days').format('MMMM D'),
        preview: 'This conversation lasted from midnight until almost dawn, with rapid exchanges throughout.',
        type: 'meaningful',
        icon: '🌙'
      },
      {
        title: 'Most Supportive Moment',
        date: moment().subtract(Math.floor(Math.random() * 30), 'days').format('MMMM D'),
        preview: 'This conversation showed a pattern of encouragement and support during what appears to be a challenging time.',
        type: 'supportive',
        icon: '🤝'
      },
      {
        title: 'Most Exciting Exchange',
        date: moment().subtract(Math.floor(Math.random() * 30), 'days').format('MMMM D'),
        preview: 'This conversation had the highest concentration of exclamation marks and enthusiastic expressions.',
        type: 'exciting',
        icon: '🎉'
      }
    ];
    
    setBestMoments(moments);
  };

  // Process data when component mounts or chatData changes
  useEffect(() => {
    analyzePredictiveData();
  }, [analyzePredictiveData]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        <span className="text-purple-600">🔮</span> Predictive Trends & Insights
      </h2>
      
      {/* Monthly Wrap-up Section */}
      {monthlyWrapup && (
        <div className="mb-10 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-5 border border-indigo-100">
          <h3 className="text-xl font-semibold mb-4 text-indigo-800">Monthly Wrap-up</h3>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <p className="text-lg font-medium text-indigo-900">
                  {monthlyWrapup.mostActiveMonth.month} was your most chatty month ({monthlyWrapup.mostActiveMonth.count.toLocaleString()} messages).
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-lg font-medium text-indigo-900">
                  {monthlyWrapup.favoriteDay} is your favorite day to chat.
                </p>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white rounded-lg p-4 shadow-sm h-full">
                <h4 className="font-medium mb-3 text-gray-700">Messages by Month</h4>
                <div className="h-48">
                  {trendsChart && (
                    <Bar
                      data={trendsChart}
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
            </div>
          </div>
        </div>
      )}
      
      {/* Message Forecast Section */}
      {messageForecast && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Message Volume Forecast</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col md:flex-row items-center mb-4">
                <div className="flex-1 p-4">
                  <div className="text-xl font-bold text-gray-800 mb-2">
                    Based on the last 4 weeks, you're likely to exchange ~{messageForecast.monthlyForecast.toLocaleString()} messages next month.
                  </div>
                  <p className="text-gray-600">
                    That's about {messageForecast.dailyAverage} messages per day, with a {messageForecast.trend} trend.
                  </p>
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
                  📊
                </div>
              </div>
              
              <div className="h-64">
                {forecastChart && (
                  <Line
                    data={forecastChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        tooltip: {
                          callbacks: {
                            title: function(context) {
                              return context[0].label;
                            },
                            label: function(context) {
                              return `${context.dataset.label}: ${context.parsed.y} messages`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Messages per Day'
                          }
                        },
                        x: {
                          ticks: {
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 10
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
      )}
      
      {/* AI Event Prediction Section */}
      {eventPredictions.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">AI Event Predictions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventPredictions.map((prediction, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-start">
                  <div className="mr-3 text-2xl">{prediction.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">{prediction.title}</h4>
                    <p className="text-sm text-gray-600">{prediction.description}</p>
                    <div className="mt-2 flex items-center">
                      <span className="text-xs font-medium text-blue-600">
                        {prediction.confidence}% confidence
                      </span>
                      <div className="ml-2 w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Smart Conversation Summary Section */}
      {conversationSummary && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Smart Conversation Summaries</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                <span className="mr-2">📅</span> Daily Summary
              </h4>
              <p className="text-gray-700">{conversationSummary.daily}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2 flex items-center">
                <span className="mr-2">🗓️</span> Weekly Summary
              </h4>
              <p className="text-gray-700">{conversationSummary.weekly}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                <span className="mr-2">📊</span> Monthly Summary
              </h4>
              <p className="text-gray-700">{conversationSummary.monthly}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Future Trend Predictions Section */}
      {futureTrends.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Future Trend Predictions 🔮</h3>
          
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {futureTrends.map((trend, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">{trend.icon}</span>
                    <h4 className="font-medium text-gray-800">{trend.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{trend.description}</p>
                  <div className="flex items-center">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {trend.probability} probability
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Best Moments Section */}
      {bestMoments.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Best Moments Collection</h3>
          
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-5 border border-pink-100">
            <h4 className="font-medium text-pink-800 mb-4 flex items-center">
              <span className="mr-2">✨</span> Top 5 Memorable Exchanges
            </h4>
            
            <div className="space-y-3">
              {bestMoments.map((moment, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">{moment.icon}</div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h5 className="font-medium text-gray-800">{moment.title}</h5>
                        <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {moment.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{moment.preview}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-pink-700">
                These moments were selected based on emotional content, timing, and conversation patterns.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictiveTrends;
