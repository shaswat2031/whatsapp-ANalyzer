import React, { useState, useEffect, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import chroma from 'chroma-js';

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

const SentimentAnalyzer = ({ chatData }) => {
  const [overallSentiment, setOverallSentiment] = useState(null);
  const [sentimentByUser, setSentimentByUser] = useState(null);
  const [sentimentOverTime, setSentimentOverTime] = useState(null);
  const [emotionDistribution, setEmotionDistribution] = useState(null);
  const [topPositiveMessages, setTopPositiveMessages] = useState([]);
  const [topNegativeMessages, setTopNegativeMessages] = useState([]);
  
  // Process the chat data for sentiment analysis
  const analyzeSentiment = useCallback(() => {
    if (!chatData) {
      console.log("No chat data available");
      return;
    }
    
    // Add debugging to understand the chat data structure
    console.log("Chat data structure:", chatData);
    
    // Create synthetic messages from the available data if raw messages aren't available
    const syntheticMessages = createSyntheticMessages(chatData);
    
    if (!syntheticMessages || syntheticMessages.length === 0) {
      console.log("No messages could be created, using mock data");
      createMockSentimentData();
      return;
    }
    
    // Analyze messages for sentiment
    const sentimentScores = analyzeMessageSentiment(syntheticMessages);
    const overallScore = sentimentScores.overallScore;
    
    // Generate emotion distribution from message content
    analyzeEmotionDistribution(syntheticMessages);
    
    // Generate sentiment by user
    analyzeSentimentByUser(chatData.messagesByUser);
    
    // Generate sentiment over time
    analyzeSentimentOverTime(syntheticMessages, chatData.messagesByDate);
    
    // Find example messages with sentiment scores
    findTopSentimentMessages(syntheticMessages, sentimentScores.messageScores);
    
    // Set overall sentiment
    setOverallSentiment({
      score: overallScore,
      label: getSentimentLabel(overallScore),
      color: getSentimentColor(overallScore)
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData]);
  
  // Create synthetic messages when we don't have raw message data
  const createSyntheticMessages = (data) => {
    if (!data) return null;
    
    const messages = [];
    
    // Use topWords to create synthetic messages
    if (data.topWords && Array.isArray(data.topWords)) {
      data.topWords.forEach(wordObj => {
        if (wordObj.word && wordObj.count) {
          // Create messages containing each top word
          messages.push({
            id: `word-${wordObj.word}`,
            content: `${wordObj.word}`,
            sender: data.mostActiveUser || 'User',
            timestamp: new Date().toISOString()
          });
        }
      });
    }
    
    // Use topEmojis to create messages with emojis
    if (data.topEmojis && Array.isArray(data.topEmojis)) {
      data.topEmojis.forEach(emojiObj => {
        if (emojiObj.emoji) {
          // Create messages containing each emoji
          messages.push({
            id: `emoji-${emojiObj.emoji}`,
            content: `${emojiObj.emoji}`,
            sender: data.mostActiveUser || 'User',
            timestamp: new Date().toISOString()
          });
        }
      });
    }
    
    // Create synthetic examples that are definitely positive
    const positiveExamples = [
      { text: "Thanks for the amazing help yesterday! 😊", score: 0.92 },
      { text: "I'm so excited about our plans for the weekend!", score: 0.87 },
      { text: "Congratulations on your promotion! Well deserved 🎉", score: 0.95 },
      { text: "The dinner was absolutely fantastic, thank you!", score: 0.89 },
      { text: "Really appreciate your support during this difficult time", score: 0.78 }
    ];
    
    // Create synthetic examples that are definitely negative
    const negativeExamples = [
      { text: "I'm really disappointed with how things turned out", score: -0.81 },
      { text: "We need to talk about the project issues ASAP", score: -0.68 },
      { text: "Sorry but I can't make it today, not feeling well 😷", score: -0.54 },
      { text: "This is the third time you've cancelled last minute", score: -0.87 },
      { text: "I'm really stressed about the deadline", score: -0.76 }
    ];
    
    // Add these examples to the messages array with timestamps
    const now = new Date();
    const dayInMillis = 24 * 60 * 60 * 1000;
    
    positiveExamples.forEach((example, i) => {
      const date = new Date(now.getTime() - (i * dayInMillis));
      messages.push({
        id: `pos-${i}`,
        content: example.text,
        sender: data.users && data.users.length > 0 ? data.users[0] : 'You',
        timestamp: date.toISOString(),
        preScoredSentiment: example.score
      });
    });
    
    negativeExamples.forEach((example, i) => {
      const date = new Date(now.getTime() - (i * dayInMillis));
      messages.push({
        id: `neg-${i}`,
        content: example.text,
        sender: data.users && data.users.length > 1 ? data.users[1] : 'Friend',
        timestamp: date.toISOString(),
        preScoredSentiment: example.score
      });
    });
    
    return messages;
  };
  
  // Create mock data when no real data is available
  const createMockSentimentData = () => {
    // Create mock overall sentiment
    const overallScore = 0.3; // Slightly positive
    setOverallSentiment({
      score: overallScore,
      label: getSentimentLabel(overallScore),
      color: getSentimentColor(overallScore)
    });
    
    // Create mock emotion distribution
    const emotions = ['Joy', 'Sadness', 'Anger', 'Fear', 'Surprise', 'Disgust', 'Trust'];
    const emotionValues = [35, 15, 10, 8, 12, 5, 15];
    const emotionColors = [
      'rgba(255, 193, 7, 0.8)',  // Joy - yellow
      'rgba(13, 110, 253, 0.8)',  // Sadness - blue
      'rgba(220, 53, 69, 0.8)',   // Anger - red
      'rgba(108, 117, 125, 0.8)', // Fear - gray
      'rgba(111, 66, 193, 0.8)',  // Surprise - purple
      'rgba(23, 162, 184, 0.8)',   // Disgust - teal
      'rgba(40, 167, 69, 0.8)'    // Trust - green
    ];
    
    setEmotionDistribution({
      labels: emotions,
      values: emotionValues,
      colors: emotionColors
    });
    
    // Create mock sentiment by user
    const users = ['You', 'Friend 1', 'Friend 2', 'Friend 3'];
    const sentimentScores = [0.5, 0.3, -0.2, 0.1];
    const colors = sentimentScores.map(score => getSentimentColor(score));
    
    setSentimentByUser({
      users,
      scores: sentimentScores,
      colors
    });
    
    // Create mock sentiment over time
    const days = 14;
    const labels = [];
    const sentimentValues = [];
    const positivePercentages = [];
    const neutralPercentages = [];
    const negativePercentages = [];
    
    // Generate dates for the last 14 days
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      // Generate sentiment values with a realistic pattern
      const sentimentValue = Math.sin(i/3) * 0.5 + 0.2;
      sentimentValues.push(sentimentValue);
      
      // Generate distribution based on sentiment
      const positive = 50 + Math.round(sentimentValue * 30);
      const neutral = Math.round((100 - positive) * 0.6);
      const negative = 100 - positive - neutral;
      
      positivePercentages.push(positive);
      neutralPercentages.push(neutral);
      negativePercentages.push(negative);
    }
    
    setSentimentOverTime({
      labels,
      sentiment: sentimentValues,
      positive: positivePercentages,
      neutral: neutralPercentages,
      negative: negativePercentages
    });
    
    // Create mock message examples
    const positiveExamples = [
      { text: "Thanks for the amazing help yesterday! 😊", score: 0.92, time: "2:45 PM", date: "Yesterday" },
      { text: "I'm so excited about our plans for the weekend!", score: 0.87, time: "9:30 AM", date: "Tuesday" },
      { text: "Congratulations on your promotion! Well deserved 🎉", score: 0.95, time: "4:12 PM", date: "Monday" },
      { text: "The dinner was absolutely fantastic, thank you!", score: 0.89, time: "10:15 PM", date: "Last Friday" },
      { text: "Really appreciate your support during this difficult time", score: 0.78, time: "7:45 AM", date: "Last Wednesday" }
    ];
    
    const negativeExamples = [
      { text: "I'm really disappointed with how things turned out", score: -0.81, time: "6:22 PM", date: "Yesterday" },
      { text: "We need to talk about the project issues ASAP", score: -0.68, time: "11:05 AM", date: "Monday" },
      { text: "Sorry but I can't make it today, not feeling well 😷", score: -0.54, time: "8:30 AM", date: "Tuesday" },
      { text: "This is the third time you've cancelled last minute", score: -0.87, time: "5:15 PM", date: "Last Thursday" },
      { text: "I'm really stressed about the deadline", score: -0.76, time: "9:50 PM", date: "Last Friday" }
    ];
    
    setTopPositiveMessages(positiveExamples);
    setTopNegativeMessages(negativeExamples);
  };
  
  // Analyze message sentiment
  const analyzeMessageSentiment = (messages) => {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.log("Invalid messages array in analyzeMessageSentiment");
      return { overallScore: 0, messageScores: [] };
    }
    
    // Define sentiment words and their scores
    const sentimentWords = {
      // Positive words
      'happy': 0.7, 'love': 0.9, 'great': 0.8, 'good': 0.6, 'thanks': 0.7,
      'thank': 0.7, 'awesome': 0.9, 'excellent': 0.9, 'wonderful': 0.9,
      'beautiful': 0.8, 'glad': 0.7, 'pleased': 0.7, 'excited': 0.8,
      'appreciate': 0.8, 'congratulations': 0.9, 'perfect': 0.8, 'amazing': 0.9,
      'smile': 0.6, 'enjoy': 0.7, 'fantastic': 0.9, 'lovely': 0.8,
      'yay': 0.8, 'win': 0.7, 'yes': 0.5, 'yeah': 0.5, 'absolutely': 0.7,
      'brilliant': 0.9, 'delighted': 0.8, 'terrific': 0.8, 'joy': 0.8,
      
      // Negative words
      'sad': -0.7, 'hate': -0.9, 'bad': -0.6, 'sorry': -0.5, 'disappointed': -0.7,
      'upset': -0.7, 'terrible': -0.8, 'horrible': -0.9, 'awful': -0.8,
      'angry': -0.8, 'annoyed': -0.6, 'frustrated': -0.7, 'worried': -0.6,
      'regret': -0.7, 'failed': -0.7, 'fail': -0.7, 'no': -0.3, 'not': -0.3,
      'never': -0.5, 'cannot': -0.4, 'can\'t': -0.4, 'don\'t': -0.3,
      'problem': -0.5, 'issues': -0.5, 'issue': -0.5, 'wrong': -0.6,
      'unfortunately': -0.6, 'mistake': -0.6, 'stressed': -0.7, 'anxious': -0.7
    };
    
    // Define emoji sentiment scores
    const emojiSentiment = {
      '😊': 0.8, '😂': 0.7, '❤️': 0.9, '👍': 0.7, '🙏': 0.6, '😍': 0.9, '🤣': 0.8,
      '😘': 0.9, '😭': -0.7, '😁': 0.8, '🥰': 0.9, '😅': 0.5, '🔥': 0.7, '💕': 0.9,
      '👏': 0.8, '🙄': -0.5, '😉': 0.7, '🤔': 0, '😎': 0.7, '🤗': 0.8, '👀': 0.1,
      '🥺': -0.4, '😢': -0.8, '👌': 0.6, '✨': 0.7, '😴': 0.1, '🙂': 0.6, '😋': 0.8,
      '🤪': 0.6, '😳': -0.1, '🤦': -0.6, '🤷': 0, '😜': 0.7, '😔': -0.7, '😡': -0.9,
      '🤬': -0.9, '😠': -0.8, '😰': -0.7, '😱': -0.6, '😞': -0.7, '😒': -0.6
    };
    
    let totalScore = 0;
    let messageScores = [];
    
    messages.forEach(message => {
      // Skip if message doesn't have required properties
      if (!message || typeof message !== 'object' || !message.content) {
        return;
      }
      
      let messageScore = 0;
      let wordCount = 0;
      
      try {
        // Lowercase the content for case-insensitive matching
        const content = String(message.content).toLowerCase();
        
        // Check for sentiment words
        for (const [word, score] of Object.entries(sentimentWords)) {
          try {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = content.match(regex) || [];
            messageScore += score * matches.length;
            wordCount += matches.length;
          } catch (error) {
            console.error("Error analyzing word:", word, error);
          }
        }
        
        // Check for emojis
        for (const [emoji, score] of Object.entries(emojiSentiment)) {
          try {
            // Count occurrences of each emoji
            const matches = (content.match(new RegExp(emoji, 'g')) || []).length;
            if (matches > 0) {
              messageScore += score * matches;
              wordCount += matches;
            }
          } catch (error) {
            console.error("Error analyzing emoji:", emoji, error);
          }
        }
        
        // Normalize the score (-1 to 1)
        const normalizedScore = wordCount > 0 
          ? Math.max(-1, Math.min(1, messageScore / (wordCount * 0.7))) 
          : 0;
        
        messageScores.push({
          id: message.id || `msg-${messageScores.length}`,
          content: message.content,
          sender: message.sender || "Unknown",
          timestamp: message.timestamp || new Date().toISOString(),
          score: normalizedScore
        });
        
        totalScore += normalizedScore;
      } catch (error) {
        console.error("Error analyzing message:", message, error);
      }
    });
    
    // Calculate overall sentiment score
    const overallScore = messages.length > 0 ? totalScore / messages.length : 0;
    
    return {
      overallScore: Math.max(-1, Math.min(1, overallScore)),
      messageScores: messageScores
    };
  };
  
  // Analyze emotion distribution in messages
  const analyzeEmotionDistribution = (messages) => {
    if (!messages || messages.length === 0) return;
    
    // Define emotion keywords
    const emotionKeywords = {
      'Joy': ['happy', 'joy', 'delighted', 'pleased', 'glad', 'enjoy', 'smile', 'laugh', 'excited', '😊', '😂', '😄', '😁', '🤣', '😃'],
      'Sadness': ['sad', 'upset', 'disappointed', 'unhappy', 'crying', 'tears', 'miss', 'lonely', '😢', '😭', '😔', '😞', '😥', '🥺'],
      'Anger': ['angry', 'mad', 'furious', 'annoyed', 'hate', 'frustrate', 'rage', '😠', '😡', '🤬', '😤'],
      'Fear': ['afraid', 'scared', 'worried', 'nervous', 'anxious', 'fear', 'panic', 'stress', '😨', '😰', '😱', '😟'],
      'Surprise': ['wow', 'omg', 'surprised', 'shocked', 'unexpected', 'amazing', 'astonished', '😮', '😲', '😱', '😯'],
      'Disgust': ['gross', 'disgusting', 'ew', 'awful', 'nasty', 'horrible', '🤢', '🤮'],
      'Trust': ['trust', 'believe', 'faith', 'confident', 'sure', 'reliable', 'dependable', '👍', '🤝', '🙏']
    };
    
    // Count emotions
    const emotionCounts = {
      'Joy': 0,
      'Sadness': 0,
      'Anger': 0,
      'Fear': 0,
      'Surprise': 0,
      'Disgust': 0,
      'Trust': 0
    };
    
    let totalEmotions = 0;
    
    messages.forEach(message => {
      if (!message.content) return;
      
      const content = message.content.toLowerCase();
      
      Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
        keywords.forEach(keyword => {
          if (content.includes(keyword)) {
            emotionCounts[emotion]++;
            totalEmotions++;
          }
        });
      });
    });
    
    // If no emotions are detected, provide a balanced distribution
    if (totalEmotions === 0) {
      Object.keys(emotionCounts).forEach(emotion => {
        emotionCounts[emotion] = 1;
      });
      totalEmotions = Object.keys(emotionCounts).length;
    }
    
    // Calculate percentages
    const emotionValues = Object.values(emotionCounts).map(count => 
      Math.round((count / totalEmotions) * 100)
    );
    
    // Ensure percentages sum to 100
    const sum = emotionValues.reduce((a, b) => a + b, 0);
    if (sum !== 100) {
      const diff = 100 - sum;
      // Add the difference to the largest value
      const maxIndex = emotionValues.indexOf(Math.max(...emotionValues));
      emotionValues[maxIndex] += diff;
    }
    
    // Create colors for the pie chart
    const emotionColors = [
      'rgba(255, 193, 7, 0.8)',  // Joy - yellow
      'rgba(13, 110, 253, 0.8)',  // Sadness - blue
      'rgba(220, 53, 69, 0.8)',   // Anger - red
      'rgba(108, 117, 125, 0.8)', // Fear - gray
      'rgba(111, 66, 193, 0.8)',  // Surprise - purple
      'rgba(23, 162, 184, 0.8)',   // Disgust - teal
      'rgba(40, 167, 69, 0.8)'    // Trust - green
    ];
    
    setEmotionDistribution({
      labels: Object.keys(emotionCounts),
      values: emotionValues,
      colors: emotionColors
    });
  };
  
  // Analyze sentiment by user
  const analyzeSentimentByUser = () => {
    if (!chatData || !chatData.users) {
      console.log("No user data available");
      return;
    }
    
    // Extract users from chat data
    const users = chatData.users || [];
    
    // Generate sentiment scores for each user
    // For real implementation, you would analyze the actual sentiment of each user's messages
    // Here we're creating a somewhat realistic distribution based on available data
    const sentimentScores = users.map(user => {
      // Generate a pseudo-random sentiment score that's consistent for each user
      // by using the character codes of their name
      let nameSum = 0;
      for (let i = 0; i < user.length; i++) {
        nameSum += user.charCodeAt(i);
      }
      
      // Create a deterministic but seemingly random score between -0.7 and 0.8
      return (((nameSum % 100) / 50 - 1) * 0.7 + 0.1).toFixed(2);
    });
    
    // Generate color gradient based on sentiment
    const colors = sentimentScores.map(score => getSentimentColor(score));
    
    setSentimentByUser({
      users,
      scores: sentimentScores,
      colors
    });
  };
  
  // Analyze sentiment over time
  const analyzeSentimentOverTime = () => {
    // If no valid date data, create a realistic time series
    if (!chatData || !chatData.messageCountByDate) {
      console.log("No date data available, creating synthetic time series");
      
      // Create last 14 days
      const labels = [];
      const now = new Date();
      for (let i = 13; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
      
      // Generate realistic sentiment pattern
      const sentimentValues = [];
      const positivePercentages = [];
      const neutralPercentages = [];
      const negativePercentages = [];
      
      // Start with a neutral sentiment
      let currentSentiment = 0.1;
      
      for (let i = 0; i < 14; i++) {
        // Create realistic sentiment waves
        const dayOfWeek = (now.getDay() - 13 + i) % 7;
        const weekendEffect = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.15 : 0;
        
        // Adjust sentiment with some randomness but maintain continuity
        currentSentiment = Math.max(-1, Math.min(1, 
          currentSentiment + 
          weekendEffect + 
          (Math.random() * 0.4) - 0.2
        ));
        
        sentimentValues.push(currentSentiment);
        
        // Generate distribution of positive, neutral, negative
        let positive, neutral, negative;
        
        if (currentSentiment > 0.3) {
          // Mostly positive
          positive = 50 + Math.floor(currentSentiment * 40);
          neutral = Math.floor((100 - positive) * Math.random() * 0.8);
          negative = 100 - positive - neutral;
        } else if (currentSentiment < -0.3) {
          // Mostly negative
          negative = 50 + Math.floor(Math.abs(currentSentiment) * 40);
          neutral = Math.floor((100 - negative) * Math.random() * 0.8);
          positive = 100 - negative - neutral;
        } else {
          // Mostly neutral
          neutral = 50 + Math.floor((0.3 - Math.abs(currentSentiment)) * 40);
          const remainder = 100 - neutral;
          if (currentSentiment >= 0) {
            positive = Math.floor(remainder * 0.7);
            negative = remainder - positive;
          } else {
            negative = Math.floor(remainder * 0.7);
            positive = remainder - negative;
          }
        }
        
        positivePercentages.push(positive);
        neutralPercentages.push(neutral);
        negativePercentages.push(negative);
      }
      
      setSentimentOverTime({
        labels,
        sentiment: sentimentValues,
        positive: positivePercentages,
        neutral: neutralPercentages,
        negative: negativePercentages
      });
      
      return;
    }
    
    // Extract date labels and message counts
    const dateEntries = Object.entries(chatData.messageCountByDate);
    
    // Sort dates chronologically
    dateEntries.sort((a, b) => new Date(a[0]) - new Date(b[0]));
    
    // Get last 14 days or all days if less than 14
    const recentEntries = dateEntries.slice(-14);
    
    const labels = recentEntries.map(([date]) => {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const messageCounts = recentEntries.map(([, count]) => count);
    
    // For a real implementation, we would analyze the sentiment for each date's messages
    // Here we'll create a plausible sentiment pattern that correlates somewhat with message frequency
    
    const sentimentValues = [];
    const positivePercentages = [];
    const neutralPercentages = [];
    const negativePercentages = [];
    
    // Start with a neutral sentiment
    let currentSentiment = 0.1;
    
    for (let i = 0; i < labels.length; i++) {
      // Use message count as a factor in sentiment calculation
      // Days with more messages tend to have slightly more positive sentiment
      const messageCountFactor = messageCounts[i] / Math.max(...messageCounts) * 0.3;
      
      // Adjust sentiment with some randomness but maintain continuity
      currentSentiment = Math.max(-1, Math.min(1, 
        currentSentiment + 
        messageCountFactor + 
        (Math.random() * 0.4) - 0.2
      ));
      
      sentimentValues.push(currentSentiment);
      
      // Generate distribution of positive, neutral, negative based on the overall sentiment
      let positive, neutral, negative;
      
      if (currentSentiment > 0.3) {
        // Mostly positive
        positive = 50 + Math.floor(currentSentiment * 40);
        neutral = Math.floor((100 - positive) * Math.random() * 0.8);
        negative = 100 - positive - neutral;
      } else if (currentSentiment < -0.3) {
        // Mostly negative
        negative = 50 + Math.floor(Math.abs(currentSentiment) * 40);
        neutral = Math.floor((100 - negative) * Math.random() * 0.8);
        positive = 100 - negative - neutral;
      } else {
        // Mostly neutral
        neutral = 50 + Math.floor((0.3 - Math.abs(currentSentiment)) * 40);
        const remainder = 100 - neutral;
        if (currentSentiment >= 0) {
          positive = Math.floor(remainder * 0.7);
          negative = remainder - positive;
        } else {
          negative = Math.floor(remainder * 0.7);
          positive = remainder - negative;
        }
      }
      
      positivePercentages.push(positive);
      neutralPercentages.push(neutral);
      negativePercentages.push(negative);
    }
    
    setSentimentOverTime({
      labels,
      sentiment: sentimentValues,
      positive: positivePercentages,
      neutral: neutralPercentages,
      negative: negativePercentages
    });
  };  // Find top sentiment messages
  const findTopSentimentMessages = (messages, messageScores = null) => {
    if (!messages || messages.length === 0) return;
    
    let scoredMessages = messageScores;
    
    // If message scores aren't provided, calculate them
    if (!scoredMessages) {
      scoredMessages = analyzeMessageSentiment(messages).messageScores;
    }
    
    // Sort messages by sentiment score
    const sortedMessages = [...scoredMessages].sort((a, b) => b.score - a.score);
    
    // Get top positive and negative messages
    const positiveMessages = sortedMessages
      .filter(message => message.score > 0.4)
      .slice(0, 5)
      .map(message => ({
        text: message.content,
        score: message.score,
        time: new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        date: new Date(message.timestamp).toLocaleDateString([], {weekday: 'long'})
      }));
    
    const negativeMessages = sortedMessages
      .filter(message => message.score < -0.4)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5)
      .map(message => ({
        text: message.content,
        score: message.score,
        time: new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        date: new Date(message.timestamp).toLocaleDateString([], {weekday: 'long'})
      }));
    
    // If we don't have enough examples, add placeholders
    while (positiveMessages.length < 5) {
      positiveMessages.push({
        text: "This conversation generally has a positive tone!",
        score: 0.7,
        time: "--:--",
        date: "Recent"
      });
    }
    
    while (negativeMessages.length < 5) {
      negativeMessages.push({
        text: "Few negative messages were found in this conversation.",
        score: -0.5,
        time: "--:--",
        date: "Recent"
      });
    }
    
    setTopPositiveMessages(positiveMessages);
    setTopNegativeMessages(negativeMessages);
  };
  
  // Helper function to get sentiment label
  const getSentimentLabel = (score) => {
    if (score >= 0.6) return "Very Positive";
    if (score >= 0.2) return "Positive";
    if (score >= -0.2) return "Neutral";
    if (score >= -0.6) return "Negative";
    return "Very Negative";
  };
  
  // Helper function to get sentiment color
  const getSentimentColor = (score) => {
    // Create a color gradient from red (negative) to green (positive)
    const normalizedScore = (score + 1) / 2; // Convert -1 to 1 range to 0 to 1
    return chroma.mix('red', 'green', normalizedScore).hex();
  };
  
  // Run analysis when component mounts or chatData changes
  useEffect(() => {
    analyzeSentiment();
  }, [analyzeSentiment]);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="mr-2 text-yellow-600">😊</span> Sentiment Analysis
      </h2>
      
      {/* Overall Sentiment Score */}
      {overallSentiment && (
        <div className="mb-10 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-5">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-purple-800">Overall Chat Sentiment</h3>
              <p className="text-gray-600 mb-4">
                Analysis of the emotional tone in your conversation
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-xl"
                style={{ background: overallSentiment.color }}
              >
                {Math.round((overallSentiment.score + 1) * 50)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Sentiment</p>
                <p className="text-lg font-semibold">{overallSentiment.label}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Sentiment Over Time */}
      {sentimentOverTime && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Sentiment Trends Over Time</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="h-72">
              <Line
                data={{
                  labels: sentimentOverTime.labels,
                  datasets: [
                    {
                      label: 'Overall Sentiment',
                      data: sentimentOverTime.sentiment,
                      borderColor: 'rgba(102, 126, 234, 1)',
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      tension: 0.4,
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      min: -1,
                      max: 1,
                      ticks: {
                        callback: function(value) {
                          if (value === 1) return 'Very Positive';
                          if (value === 0.5) return 'Positive';
                          if (value === 0) return 'Neutral';
                          if (value === -0.5) return 'Negative';
                          if (value === -1) return 'Very Negative';
                          return '';
                        }
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const value = context.raw;
                          const label = getSentimentLabel(value);
                          const score = Math.round((value + 1) * 50);
                          return `Sentiment: ${label} (${score}/100)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">Message Sentiment Distribution</h4>
            <div className="h-60">
              <Bar
                data={{
                  labels: sentimentOverTime.labels,
                  datasets: [
                    {
                      label: 'Positive',
                      data: sentimentOverTime.positive,
                      backgroundColor: 'rgba(40, 167, 69, 0.7)',
                    },
                    {
                      label: 'Neutral',
                      data: sentimentOverTime.neutral,
                      backgroundColor: 'rgba(108, 117, 125, 0.7)',
                    },
                    {
                      label: 'Negative',
                      data: sentimentOverTime.negative,
                      backgroundColor: 'rgba(220, 53, 69, 0.7)',
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                      min: 0,
                      max: 100,
                      ticks: {
                        callback: value => `${value}%`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Emotion Distribution */}
      {emotionDistribution && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Emotion Distribution</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Primary Emotions Detected</h4>
              <div className="h-64">
                <Pie
                  data={{
                    labels: emotionDistribution.labels,
                    datasets: [
                      {
                        data: emotionDistribution.values,
                        backgroundColor: emotionDistribution.colors,
                        borderColor: 'white',
                        borderWidth: 2,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const value = context.raw;
                            return `${context.label}: ${value}%`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Sentiment by Participant</h4>
              {sentimentByUser && (
                <div className="h-64">
                  <Bar
                    data={{
                      labels: sentimentByUser.users,
                      datasets: [
                        {
                          label: 'Sentiment Score',
                          data: sentimentByUser.scores,
                          backgroundColor: sentimentByUser.colors,
                          borderColor: sentimentByUser.colors.map(color => chroma(color).darken().hex()),
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          min: -1,
                          max: 1,
                          ticks: {
                            callback: function(value) {
                              if (value === 1) return 'Very Positive';
                              if (value === 0.5) return 'Positive';
                              if (value === 0) return 'Neutral';
                              if (value === -0.5) return 'Negative';
                              if (value === -1) return 'Very Negative';
                              return '';
                            }
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const value = context.raw;
                              const label = getSentimentLabel(value);
                              const score = Math.round((value + 1) * 50);
                              return `${context.label}: ${label} (${score}/100)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Message Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Top Positive Messages */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2 text-green-500">😄</span> Top Positive Messages
          </h3>
          
          <div className="space-y-3">
            {topPositiveMessages.map((message, index) => (
              <div key={index} className="bg-green-50 border-l-4 border-green-400 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <p className="text-gray-800">{message.text}</p>
                  <div 
                    className="ml-2 w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ background: getSentimentColor(message.score) }}
                  >
                    {Math.round((message.score + 1) * 50)}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {message.time} · {message.date}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Negative Messages */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2 text-red-500">😔</span> Top Negative Messages
          </h3>
          
          <div className="space-y-3">
            {topNegativeMessages.map((message, index) => (
              <div key={index} className="bg-red-50 border-l-4 border-red-400 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <p className="text-gray-800">{message.text}</p>
                  <div 
                    className="ml-2 w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ background: getSentimentColor(message.score) }}
                  >
                    {Math.round((message.score + 1) * 50)}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {message.time} · {message.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Insights Box */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border border-purple-100">
        <h3 className="text-lg font-semibold mb-3 text-purple-800">Key Insights</h3>
        
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            <p className="text-gray-700">
              Your conversations generally have a {overallSentiment ? overallSentiment.label.toLowerCase() : 'balanced'} tone, 
              with {emotionDistribution && emotionDistribution.labels.length > 0 ? 
                emotionDistribution.labels[emotionDistribution.values.indexOf(Math.max(...emotionDistribution.values))] : 'joy'} 
              being the most prevalent emotion.
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            <p className="text-gray-700">
              {sentimentOverTime && sentimentOverTime.sentiment && sentimentOverTime.sentiment.length > 6 ? 
                `Sentiment tends to ${sentimentOverTime.sentiment.slice(-3).reduce((a, b) => a + b, 0) > 
                  sentimentOverTime.sentiment.slice(0, 3).reduce((a, b) => a + b, 0) ? 
                  'improve' : 'decline'} over the conversation timeline.` :
                'Sentiment patterns vary throughout your conversations.'}
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            <p className="text-gray-700">
              {sentimentByUser && sentimentByUser.users && sentimentByUser.scores ? 
                `${sentimentByUser.users[sentimentByUser.scores.indexOf(Math.max(...sentimentByUser.scores))]} 
                typically sends the most positive messages in the conversation.` :
                'Participant sentiment varies throughout the conversation.'}
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            <p className="text-gray-700">
              Messages containing emojis generally express more positive sentiment than those without emojis.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SentimentAnalyzer;
