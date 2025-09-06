import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import chroma from 'chroma-js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function MostMessage({ chatData }) {
  const [topWords, setTopWords] = useState([]);
  const [topEmojis, setTopEmojis] = useState([]);
  const [wordChartData, setWordChartData] = useState(null);
  const [emojiChartData, setEmojiChartData] = useState(null);
  const [mediaData, setMediaData] = useState(null);
  const [messageInsights, setMessageInsights] = useState(null);

  // Enhanced emoji meaning mapping with more comprehensive data
  const emojiMeanings = useMemo(() => ({
    '😊': 'Smiling Face with Smiling Eyes',
    '😂': 'Face with Tears of Joy',
    '❤️': 'Red Heart',
    '👍': 'Thumbs Up',
    '🙏': 'Folded Hands',
    '😍': 'Smiling Face with Heart-Eyes',
    '🤣': 'Rolling on the Floor Laughing',
    '😘': 'Face Blowing a Kiss',
    '😭': 'Loudly Crying Face',
    '😁': 'Beaming Face with Smiling Eyes',
    '🥰': 'Smiling Face with Hearts',
    '😅': 'Grinning Face with Sweat',
    '🔥': 'Fire',
    '💕': 'Two Hearts',
    '👏': 'Clapping Hands',
    '🙄': 'Face with Rolling Eyes',
    '😉': 'Winking Face',
    '🤔': 'Thinking Face',
    '😎': 'Smiling Face with Sunglasses',
    '🤗': 'Hugging Face',
    '👀': 'Eyes',
    '🥺': 'Pleading Face',
    '😢': 'Crying Face',
    '👌': 'OK Hand',
    '✨': 'Sparkles',
    '😴': 'Sleeping Face',
    '🙂': 'Slightly Smiling Face',
    '😋': 'Face Savoring Food',
    '🤪': 'Zany Face',
    '😳': 'Flushed Face',
    '🤦': 'Person Facepalming',
    '🤷': 'Person Shrugging',
    '😜': 'Winking Face with Tongue',
  }), []);

  // More sophisticated topic categories for better word analysis
  const topicCategories = useMemo(() => ({
    personal: ['love', 'miss', 'feel', 'think', 'hope', 'good', 'care', 'happy', 'sad', 'sorry'],
    planning: ['come', 'going', 'plan', 'meet', 'time', 'tomorrow', 'weekend', 'tonight', 'schedule', 'date'],
    work: ['work', 'meeting', 'project', 'office', 'send', 'email', 'call', 'deadline', 'report', 'client', 'team'],
    food: ['food', 'lunch', 'dinner', 'hungry', 'eat', 'restaurant', 'order', 'breakfast', 'coffee', 'recipe'],
    travel: ['trip', 'travel', 'visit', 'place', 'flight', 'ticket', 'hotel', 'vacation', 'tour', 'journey'],
    education: ['study', 'class', 'test', 'exam', 'assignment', 'school', 'college', 'course', 'learn', 'grade'],
    entertainment: ['movie', 'show', 'watch', 'game', 'play', 'music', 'song', 'concert', 'series', 'film'],
    technology: ['phone', 'app', 'computer', 'tech', 'software', 'update', 'device', 'laptop', 'internet', 'download'],
    health: ['health', 'doctor', 'sick', 'feel', 'better', 'hospital', 'medicine', 'pain', 'sleep', 'exercise'],
    shopping: ['buy', 'shop', 'store', 'purchase', 'price', 'order', 'delivery', 'amazon', 'online', 'mall'],
  }), []);

  // Advanced message analysis function
  const analyzeMessages = useCallback(() => {
    if (!chatData) return;

    // Process top words with improved visualization
    if (chatData.topWords && chatData.topWords.length > 0) {
      // Get top 12 words for better visualization
      const words = chatData.topWords.slice(0, 12);
      setTopWords(words);

      // Generate a more visually appealing color gradient
      const colorScale = chroma.scale(['#3B82F6', '#1E40AF', '#1D4ED8']).mode('lch').colors(words.length);
      
      setWordChartData({
        labels: words.map(w => w.word),
        datasets: [
          {
            label: 'Frequency',
            data: words.map(w => w.count),
            backgroundColor: colorScale,
            borderColor: colorScale.map(c => chroma(c).darken(0.2).hex()),
            borderWidth: 1,
            borderRadius: 6,
            maxBarThickness: 50,
          }
        ]
      });
    }

    // Process top emojis with improved visualization
    if (chatData.topEmojis && chatData.topEmojis.length > 0) {
      setTopEmojis(chatData.topEmojis);

      // Generate vibrant colors for emoji chart with better contrast
      const emojiColors = [
        'rgba(255, 99, 132, 0.8)',   // red
        'rgba(54, 162, 235, 0.8)',   // blue
        'rgba(255, 206, 86, 0.8)',   // yellow
        'rgba(75, 192, 192, 0.8)',   // teal
        'rgba(153, 102, 255, 0.8)',  // purple
        'rgba(255, 159, 64, 0.8)',   // orange
        'rgba(220, 53, 69, 0.8)',    // crimson
        'rgba(40, 167, 69, 0.8)',    // green
        'rgba(111, 66, 193, 0.8)',   // indigo
        'rgba(23, 162, 184, 0.8)',   // cyan
        'rgba(253, 126, 20, 0.8)',   // orange-red
        'rgba(32, 201, 151, 0.8)',   // teal-green
      ];

      setEmojiChartData({
        labels: chatData.topEmojis.map(e => `${e.emoji}`),
        datasets: [
          {
            data: chatData.topEmojis.map(e => e.count),
            backgroundColor: emojiColors.slice(0, chatData.topEmojis.length),
            borderColor: emojiColors.map(c => c.replace('0.8', '1')),
            borderWidth: 1,
            hoverOffset: 6,
          }
        ]
      });
    }

    // Enhanced media data processing
    if (chatData.mediaCount) {
      const mediaLabels = [];
      const mediaCounts = [];
      const mediaColors = {
        images: 'rgba(54, 162, 235, 0.8)',
        videos: 'rgba(255, 99, 132, 0.8)',
        audio: 'rgba(255, 206, 86, 0.8)',
        documents: 'rgba(75, 192, 192, 0.8)',
        stickers: 'rgba(153, 102, 255, 0.8)',
        gifs: 'rgba(255, 159, 64, 0.8)',
      };

      Object.entries(chatData.mediaCount).forEach(([type, count]) => {
        if (count > 0) {
          mediaLabels.push(type.charAt(0).toUpperCase() + type.slice(1));
          mediaCounts.push(count);
        }
      });

      if (mediaLabels.length > 0) {
        setMediaData({
          labels: mediaLabels,
          datasets: [
            {
              data: mediaCounts,
              backgroundColor: mediaLabels.map(label => mediaColors[label.toLowerCase()] || 'rgba(128, 128, 128, 0.8)'),
              borderColor: mediaLabels.map(label => 
                (mediaColors[label.toLowerCase()] || 'rgba(128, 128, 128, 0.8)').replace('0.8', '1')
              ),
              borderWidth: 1,
              hoverOffset: 6,
            }
          ]
        });
      }
    }

    // Generate advanced insights about the conversation
    generateInsights(chatData, topicCategories);
  }, [chatData, topicCategories]);

  // New function to generate more advanced insights
  const generateInsights = useCallback((data, topicCategories) => {
    if (!data) return;
    
    const insights = {};
    
    // Word usage patterns
    if (data.topWords && data.topWords.length > 0) {
      insights.dominantTopic = getDominantTopic(data.topWords.slice(0, 10).map(w => w.word), topicCategories);
      insights.vocabularyRichness = calculateVocabularyRichness(data);
    }
    
    // Emoji sentiment analysis
    if (data.topEmojis && data.topEmojis.length > 0) {
      insights.emojiMood = getEmojiMoodSuggestion(data.topEmojis.map(e => e.emoji).slice(0, 5));
      insights.emojiDiversity = data.topEmojis.length > 8 ? 'High' : data.topEmojis.length > 4 ? 'Medium' : 'Low';
    }
    
    // Media sharing patterns
    if (data.mediaCount) {
      const totalMedia = Object.values(data.mediaCount).reduce((sum, count) => sum + count, 0);
      insights.mediaPreference = getMediaPreference(data.mediaCount);
      insights.mediaSharing = totalMedia > 100 ? 'Very High' : totalMedia > 50 ? 'High' : totalMedia > 20 ? 'Medium' : 'Low';
    }
    
    // Message frequency insights if available
    if (data.messageCount) {
      insights.conversationFrequency = data.messageCount > 1000 ? 'Very Active' : 
                                       data.messageCount > 500 ? 'Active' : 
                                       data.messageCount > 200 ? 'Moderate' : 'Occasional';
    }
    
    setMessageInsights(insights);
  }, []);

  // Process chat data when component mounts or chatData changes
  useEffect(() => {
    analyzeMessages();
  }, [analyzeMessages]);

  // Helper function to get emoji meaning
  const getEmojiMeaning = (emoji) => {
    return emojiMeanings[emoji] || 'Unknown emoji';
  };

  // Advanced function to determine dominant conversation topic
  function getDominantTopic(words, topicCategories) {
    const topicMatches = {};
    let totalMatches = 0;
    
    Object.entries(topicCategories).forEach(([topic, topicWords]) => {
      const matches = words.filter(word => 
        topicWords.some(topicWord => word.toLowerCase().includes(topicWord.toLowerCase()))
      ).length;
      
      topicMatches[topic] = matches;
      totalMatches += matches;
    });
    
    // Calculate percentages and find primary and secondary topics
    const topicPercentages = {};
    Object.entries(topicMatches).forEach(([topic, matches]) => {
      topicPercentages[topic] = totalMatches > 0 ? Math.round((matches / totalMatches) * 100) : 0;
    });
    
    const sortedTopics = Object.entries(topicPercentages)
      .sort((a, b) => b[1] - a[1]);
      
    const primaryTopic = sortedTopics[0] && sortedTopics[0][1] > 0 ? 
      { name: sortedTopics[0][0], percentage: sortedTopics[0][1] } : 
      { name: "general", percentage: 0 };
      
    const secondaryTopic = sortedTopics[1] && sortedTopics[1][1] > 0 ? 
      { name: sortedTopics[1][0], percentage: sortedTopics[1][1] } : 
      null;
    
    return {
      primary: primaryTopic,
      secondary: secondaryTopic,
      distribution: topicPercentages
    };
  }

  // Function to calculate vocabulary richness
  function calculateVocabularyRichness(data) {
    if (!data.wordCount || !data.uniqueWordCount) return "Unknown";
    
    const ratio = data.uniqueWordCount / data.wordCount;
    
    if (ratio > 0.7) return "Very Rich";
    if (ratio > 0.5) return "Rich";
    if (ratio > 0.3) return "Average";
    return "Basic";
  }

  // Function to determine media preference
  function getMediaPreference(mediaCount) {
    if (!mediaCount) return "None";
    
    const sorted = Object.entries(mediaCount)
      .sort((a, b) => b[1] - a[1]);
      
    if (sorted.length === 0 || sorted[0][1] === 0) return "None";
    
    return sorted[0][0].charAt(0).toUpperCase() + sorted[0][0].slice(1);
  }

  // Enhanced mood suggestion based on emoji patterns
  function getEmojiMoodSuggestion(emojis) {
    const moodCategories = {
      happy: ['😊', '😁', '😄', '😃', '😀', '🙂', '😉', '😍', '🥰', '😘', '😚', '😙', '😗', '🤗', '😺', '😸'],
      love: ['❤️', '💕', '💓', '💗', '💖', '💘', '💝', '💞', '💜', '💙', '💚', '💛', '🧡', '😍', '🥰'],
      laughter: ['😂', '🤣', '😅', '😆', '😄', '😃'],
      sad: ['😢', '😭', '😔', '😞', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩'],
      surprise: ['😮', '😯', '😲', '😱', '😨', '😧', '😦', '😳', '🤯'],
      neutral: ['😐', '😑', '😶', '🤔', '🤨', '😏', '🙄'],
      anxious: ['😬', '😰', '😥', '😓', '😟'],
      angry: ['😠', '😡', '🤬', '😤', '😤'],
      impressed: ['👏', '🔥', '✨', '👍', '👌'],
    };
    
    const moodScores = {};
    let totalMatches = 0;
    
    Object.entries(moodCategories).forEach(([mood, moodEmojis]) => {
      const matches = emojis.filter(emoji => 
        moodEmojis.includes(emoji)
      ).length;
      
      moodScores[mood] = matches;
      totalMatches += matches;
    });
    
    // Get primary and secondary moods
    const sortedMoods = Object.entries(moodScores)
      .sort((a, b) => b[1] - a[1]);
      
    const primaryMood = sortedMoods[0] && sortedMoods[0][1] > 0 ? sortedMoods[0][0] : "neutral";
    const secondaryMood = sortedMoods[1] && sortedMoods[1][1] > 0 ? sortedMoods[1][0] : null;
    
    // Generate a more nuanced mood description
    if (secondaryMood && moodScores[primaryMood] < totalMatches * 0.7) {
      // Blended mood
      return getMoodDescription(primaryMood, secondaryMood);
    } else {
      // Dominant single mood
      return getMoodDescription(primaryMood);
    }
  }

  // Get more descriptive mood explanations
  function getMoodDescription(primaryMood, secondaryMood = null) {
    const moodDescriptions = {
      happy: "cheerful and positive",
      love: "affectionate and caring",
      laughter: "humorous and fun-loving",
      sad: "somewhat melancholic",
      surprise: "surprised or amazed",
      neutral: "thoughtful and contemplative",
      anxious: "concerned or nervous",
      angry: "frustrated or irritated",
      impressed: "appreciative and impressed",
    };
    
    if (secondaryMood) {
      return `${moodDescriptions[primaryMood]} with moments of being ${moodDescriptions[secondaryMood]}`;
    } else {
      return moodDescriptions[primaryMood];
    }
  }

  // Chart options with improved styling
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context) {
            return `Used ${context.raw} times`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: {
          display: true,
          text: 'Frequency',
          font: {
            weight: 'bold',
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Words',
          font: {
            weight: 'bold',
          }
        }
      }
    },
    animation: {
      duration: 1500,
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12,
          },
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
      }
    },
    cutout: '70%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Message & Emoji Analysis</h2>
      
      {/* Top Words Section with improved styling */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Most Frequent Words</h3>
          {topWords.length > 0 && (
            <span className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-medium">
              {topWords.length} words analyzed
            </span>
          )}
        </div>
        
        {topWords.length > 0 ? (
          <>
            <div className="h-80 mb-6 bg-gray-50 p-4 rounded-lg">
              {wordChartData && (
                <Bar 
                  data={wordChartData} 
                  options={barChartOptions}
                />
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {topWords.slice(0, 12).map((wordData, index) => (
                <div key={index} 
                     className={`bg-blue-50 p-3 rounded-lg text-center transition-transform duration-300 hover:scale-105 ${
                       index === 0 ? 'bg-gradient-to-br from-blue-100 to-blue-200 shadow' : ''
                     }`}>
                  <p className="font-bold text-blue-800 truncate">{wordData.word}</p>
                  <p className="text-sm text-blue-600">{wordData.count} times</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500 italic">No word frequency data available</p>
          </div>
        )}
      </div>
      
      {/* Top Emojis Section with improved styling */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Most Used Emojis</h3>
          {topEmojis.length > 0 && (
            <span className="text-sm bg-purple-100 text-purple-800 py-1 px-3 rounded-full font-medium">
              {topEmojis.length} emoji types found
            </span>
          )}
        </div>
        
        {topEmojis.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-72 bg-gray-50 p-4 rounded-lg flex items-center justify-center">
              {emojiChartData && (
                <Doughnut
                  data={emojiChartData}
                  options={doughnutOptions}
                />
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 self-center">
              {topEmojis.slice(0, 8).map((emojiData, index) => (
                <div key={index} 
                     className={`bg-gray-50 p-4 rounded-lg transition-all duration-300 hover:bg-gray-100 ${
                       index === 0 ? 'border-2 border-purple-200' : ''
                     }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{emojiData.emoji}</span>
                    <div>
                      <span className="text-sm font-bold text-gray-700 block">
                        {emojiData.count} times
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {getEmojiMeaning(emojiData.emoji)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500 italic">No emoji data available</p>
          </div>
        )}
      </div>
      
      {/* Media Sharing Section with improved styling */}
      {mediaData && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Media Sharing</h3>
            <span className="text-sm bg-green-100 text-green-800 py-1 px-3 rounded-full font-medium">
              {Object.values(chatData.mediaCount).reduce((sum, count) => sum + count, 0)} total files
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-72 bg-gray-50 p-4 rounded-lg flex items-center justify-center">
              <Doughnut
                data={mediaData}
                options={doughnutOptions}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 self-center">
              {mediaData.labels.map((label, index) => (
                <div key={index} 
                     className="bg-gray-50 p-4 rounded-lg text-center transition-all duration-300 hover:bg-gray-100">
                  <p className="text-2xl font-bold text-gray-800">{mediaData.datasets[0].data[index]}</p>
                  <p className="text-sm text-gray-600">{label}</p>
                  <div className="w-full h-1 mt-2 rounded-full" style={{
                    backgroundColor: mediaData.datasets[0].backgroundColor[index]
                  }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced Insights Section */}
      {messageInsights && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-lg mt-6 shadow-inner">
          <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            Advanced Conversation Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Conversation Topics</h4>
              {messageInsights.dominantTopic ? (
                <>
                  <p>
                    <span className="font-medium">Primary topic:</span> 
                    <span className="ml-1 capitalize">{messageInsights.dominantTopic.primary.name}</span>
                    <span className="ml-1 text-xs text-gray-500">({messageInsights.dominantTopic.primary.percentage}%)</span>
                  </p>
                  {messageInsights.dominantTopic.secondary && (
                    <p>
                      <span className="font-medium">Secondary topic:</span> 
                      <span className="ml-1 capitalize">{messageInsights.dominantTopic.secondary.name}</span>
                      <span className="ml-1 text-xs text-gray-500">({messageInsights.dominantTopic.secondary.percentage}%)</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Based on word frequency analysis
                  </p>
                </>
              ) : (
                <p className="text-gray-500 italic">Topic analysis not available</p>
              )}
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Emoji Usage Pattern</h4>
              {messageInsights.emojiMood ? (
                <>
                  <p>Conversation mood: <span className="font-medium">{messageInsights.emojiMood}</span></p>
                  <p>Emoji diversity: <span className="font-medium">{messageInsights.emojiDiversity}</span></p>
                  <p className="text-xs text-gray-500 mt-1">
                    Based on emoji frequency and sentiment analysis
                  </p>
                </>
              ) : (
                <p className="text-gray-500 italic">Emoji analysis not available</p>
              )}
            </div>
            
            {messageInsights.vocabularyRichness && (
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Language Style</h4>
                <p>Vocabulary richness: <span className="font-medium">{messageInsights.vocabularyRichness}</span></p>
                {topWords.length > 0 && (
                  <p>Most frequent word: <span className="font-medium">{topWords[0].word}</span> ({topWords[0].count} times)</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Based on word variety and vocabulary analysis
                </p>
              </div>
            )}
            
            {messageInsights.mediaPreference && (
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Media Sharing</h4>
                <p>Preferred media type: <span className="font-medium">{messageInsights.mediaPreference}</span></p>
                <p>Media sharing level: <span className="font-medium">{messageInsights.mediaSharing}</span></p>
                <p className="text-xs text-gray-500 mt-1">
                  Based on media type and frequency analysis
                </p>
              </div>
            )}
            
            {messageInsights.conversationFrequency && (
              <div className="bg-white p-3 rounded-lg shadow-sm md:col-span-2">
                <h4 className="font-semibold text-gray-800 mb-2">Conversation Activity</h4>
                <p>Frequency: <span className="font-medium">{messageInsights.conversationFrequency}</span></p>
                <p className="text-xs text-gray-500 mt-1">
                  Based on message count and conversation patterns
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get topic suggestion (moved inside the component)
function getTopicSuggestion(words) {
  // This is a simplified topic suggestion
  // In a real app, you might use NLP or more sophisticated analysis
  
  const commonTopics = {
    personal: ['love', 'miss', 'feel', 'think', 'hope', 'good', 'time', 'today', 'tomorrow'],
    planning: ['come', 'going', 'plan', 'meet', 'time', 'tomorrow', 'weekend', 'tonight'],
    work: ['work', 'meeting', 'project', 'office', 'send', 'email', 'call', 'deadline'],
    food: ['food', 'lunch', 'dinner', 'hungry', 'eat', 'restaurant', 'order'],
    travel: ['trip', 'travel', 'visit', 'place', 'flight', 'ticket', 'hotel'],
  };
  
  const topicMatches = {};
  
  Object.entries(commonTopics).forEach(([topic, topicWords]) => {
    topicMatches[topic] = words.filter(word => 
      topicWords.some(topicWord => word.includes(topicWord))
    ).length;
  });
  
  const bestMatch = Object.entries(topicMatches)
    .sort((a, b) => b[1] - a[1])[0];
    
  if (bestMatch[1] > 0) {
    return bestMatch[0];
  } else {
    return "various personal interests";
  }
}

export default MostMessage;
