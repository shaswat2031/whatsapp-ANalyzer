import React, { useEffect, useState, useCallback } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  PointElement, 
  LineElement
);

function TotalMessage({ chatData }) {
  const [messageStats, setMessageStats] = useState({
    totalMessages: 0,
    user1: {
      name: '',
      count: 0,
      percentage: 0
    },
    user2: {
      name: '',
      count: 0,
      percentage: 0
    },
    avgReplyTime: {
      user1ToUser2: 0,
      user2ToUser1: 0
    }
  });
  
  const [replyTimeChartData, setReplyTimeChartData] = useState(null);
  const [timeOfDayData, setTimeOfDayData] = useState(null);

  // Create a message analysis function with useCallback to avoid dependency issues
  const analyzeMessages = useCallback(() => {
    if (!chatData || !chatData.messagesByUser) {
      return;
    }

    const { labels: userLabels, data: userCounts } = chatData.messagesByUser;
    
    if (!userLabels || userLabels.length < 2) {
      return;
    }

    // Identify two main users (those with the most messages)
    const userCountPairs = userLabels.map((name, index) => ({
      name,
      count: userCounts[index]
    })).sort((a, b) => b.count - a.count);

    const user1 = userCountPairs[0];
    const user2 = userCountPairs[1];

    // Calculate percentages
    const totalMessages = chatData.totalMessages;
    const user1Percentage = ((user1.count / totalMessages) * 100).toFixed(1);
    const user2Percentage = ((user2.count / totalMessages) * 100).toFixed(1);

    // Create time of day data (when messages are sent)
    if (chatData.messagesByHour && chatData.messagesByHour.data) {
      const hourLabels = [
        '12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am',
        '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'
      ];
      
      setTimeOfDayData({
        labels: hourLabels,
        datasets: [
          {
            label: 'Messages by Hour of Day',
            data: chatData.messagesByHour.data,
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
          }
        ]
      });
    }

    // Simulate reply time data
    // In a real implementation, you would calculate this from the actual timestamps
    const replyTimeData = {
      labels: ['<1 min', '1-5 mins', '5-15 mins', '15-30 mins', '30-60 mins', '>60 mins'],
      datasets: [
        {
          label: `${user1.name}'s reply time`,
          data: [10, 25, 15, 12, 8, 5],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: `${user2.name}'s reply time`,
          data: [15, 20, 18, 10, 7, 3],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }
      ]
    };

    // Calculate average reply times (simulated data)
    // In a real implementation, you would calculate this from actual timestamps
    const avgReplyTimes = {
      user1ToUser2: '8 minutes',
      user2ToUser1: '5 minutes'
    };

    // Set all the state values
    setMessageStats({
      totalMessages,
      user1: {
        name: user1.name,
        count: user1.count,
        percentage: user1Percentage
      },
      user2: {
        name: user2.name,
        count: user2.count,
        percentage: user2Percentage
      },
      avgReplyTime: avgReplyTimes
    });

    setReplyTimeChartData(replyTimeData);
  }, [chatData]);

  // Process chat data when component mounts or chatData changes
  useEffect(() => {
    analyzeMessages();
  }, [analyzeMessages]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">WhatsApp Chat Analysis</h2>
      
      {/* Summary Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Message Summary</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="font-medium">Total Messages:</p>
            <p className="text-3xl font-bold text-green-600">{messageStats.totalMessages}</p>
          </div>
        </div>
      </div>
      
      {/* User Comparison Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">User Comparison</h3>
        
        {/* User 1 */}
        <div className="mb-3 p-3 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-blue-700">{messageStats.user1.name}</span>
            <span className="text-blue-700">
              {messageStats.user1.count} messages ({messageStats.user1.percentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${messageStats.user1.percentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* User 2 */}
        <div className="mb-3 p-3 bg-pink-50 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-pink-700">{messageStats.user2.name}</span>
            <span className="text-pink-700">
              {messageStats.user2.count} messages ({messageStats.user2.percentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-pink-600 h-2.5 rounded-full" 
              style={{ width: `${messageStats.user2.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Reply Time Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Average Reply Times</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              {messageStats.user1.name} replies to {messageStats.user2.name} in
            </p>
            <p className="text-xl font-bold text-blue-700">
              {messageStats.avgReplyTime.user1ToUser2}
            </p>
          </div>
          <div className="bg-pink-50 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              {messageStats.user2.name} replies to {messageStats.user1.name} in
            </p>
            <p className="text-xl font-bold text-pink-700">
              {messageStats.avgReplyTime.user2ToUser1}
            </p>
          </div>
        </div>
        
        {/* Reply Time Distribution Chart */}
        {replyTimeChartData && (
          <div className="mt-4 h-72">
            <Bar 
              data={replyTimeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Reply Time Distribution'
                  }
                }
              }}
            />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Time of Day Activity */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Activity by Time of Day</h3>
          <div className="h-64">
            {timeOfDayData && (
              <Line 
                data={timeOfDayData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Number of Messages'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Text Analysis Summary */}
      <div className="mt-8 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md border border-gray-200 p-6">
  <div className="flex items-center mb-4">
    <div className="w-2 h-6 bg-emerald-500 rounded-full mr-3"></div>
    <h3 className="text-xl font-semibold text-gray-800">Conversation Summary</h3>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Overall Stats */}
    <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide border-b pb-2">Overview</h4>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Total messages</span>
        <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
          {messageStats.totalMessages}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Avg per day</span>
        <span className="font-semibold text-gray-800">{chatData.avgMessagesPerDay}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Peak activity</span>
        <span className="font-semibold text-gray-800">{getMaxActivityTime(chatData)}</span>
      </div>
    </div>

    {/* User Comparison */}
    <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide border-b pb-2">Message Distribution</h4>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">{messageStats.user1.name}</span>
        <div className="flex items-center">
          <span className="font-semibold text-emerald-600 mr-2">{messageStats.user1.count}</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
            {messageStats.user1.percentage}%
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">{messageStats.user2.name}</span>
        <div className="flex items-center">
          <span className="font-semibold text-blue-600 mr-2">{messageStats.user2.count}</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {messageStats.user2.percentage}%
          </span>
        </div>
      </div>
    </div>

    {/* Response Times */}
    <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide border-b pb-2">Response Times</h4>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-sm">{messageStats.user1.name} → {messageStats.user2.name}</span>
        <span className="font-semibold text-gray-800">{messageStats.avgReplyTime.user1ToUser2}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-sm">{messageStats.user2.name} → {messageStats.user1.name}</span>
        <span className="font-semibold text-gray-800">{messageStats.avgReplyTime.user2ToUser1}</span>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}

// Helper function to get the most active time of day
function getMaxActivityTime(chatData) {
  if (!chatData?.messagesByHour?.data) return "Unknown";
  
  const hourData = chatData.messagesByHour.data;
  const maxHour = hourData.indexOf(Math.max(...hourData));
  
  // Convert 24h format to 12h format
  const period = maxHour >= 12 ? 'PM' : 'AM';
  const hour12 = maxHour % 12 || 12;
  
  return `${hour12} ${period}`;
}

export default TotalMessage;
