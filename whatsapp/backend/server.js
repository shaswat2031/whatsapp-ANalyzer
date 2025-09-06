const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `whatsapp-chat-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only .txt files are allowed'), false);
    }
  }
});

// Routes
app.post('/api/upload', upload.single('chatFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Parse the WhatsApp chat
    const analysis = analyzeWhatsAppChat(fileContent);
    
    // Clean up the uploaded file
    fs.unlinkSync(filePath);
    
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Error processing file:', error);
    return res.status(500).json({ error: 'Error processing the chat file' });
  }
});

// Function to parse and analyze WhatsApp chat
function analyzeWhatsAppChat(chatContent) {
  // Regular expression to match WhatsApp message format
  // Format 1: [DD/MM/YY, HH:MM:SS] Contact Name: Message (traditional format)
  // Format 2: DD/MM/YY, HH:MM - Contact Name: Message (your new format)
  const messageRegex = /^(?:\[?(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{1,2}(?::\d{1,2})?(?:\s?[AP]M)?)\]?\s?-?\s([^:]+):\s(.+))$/gm;
  
  const messages = [];
  const users = new Set();
  const messageCountByUser = {};
  const messageCountByDate = {};
  const messageCountByHour = Array(24).fill(0);
  const wordFrequency = {};
  const mediaCount = { images: 0, videos: 0, audio: 0, documents: 0 };
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const emojiCount = {};
  let totalMessages = 0;
  let earliestDate = null;
  let latestDate = null;
  
  // Filter out WhatsApp system messages
  const filteredChatContent = chatContent.split('\n')
    .filter(line => !line.includes('Messages and calls are end-to-end encrypted'))
    .join('\n');
  
  let match;
  while ((match = messageRegex.exec(filteredChatContent)) !== null) {
    const [, date, time, user, message] = match;
    
    // Clean username (remove extra spaces)
    const cleanUsername = user.trim();
    users.add(cleanUsername);
    
    // Count messages by user
    messageCountByUser[cleanUsername] = (messageCountByUser[cleanUsername] || 0) + 1;
    
    // Parse date
    const parsedDate = moment(date, ['DD/MM/YY', 'DD/MM/YYYY', 'M/D/YY', 'M/D/YYYY']);
    const dateStr = parsedDate.format('YYYY-MM-DD');
    
    // Update earliest and latest date
    if (!earliestDate || parsedDate.isBefore(earliestDate)) {
      earliestDate = parsedDate;
    }
    if (!latestDate || parsedDate.isAfter(latestDate)) {
      latestDate = parsedDate;
    }
    
    // Count messages by date
    messageCountByDate[dateStr] = (messageCountByDate[dateStr] || 0) + 1;
    
    // Parse time and count messages by hour
    const timeParts = time.match(/(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?(?:\s?([APap][Mm]))?/);
    if (timeParts) {
      let hour = parseInt(timeParts[1], 10);
      const isPM = timeParts[4] && (timeParts[4].toLowerCase() === 'pm');
      
      // Convert to 24-hour format if in AM/PM format
      if (timeParts[4]) {
        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
      }
      
      messageCountByHour[hour]++;
    }
    
    // Count word frequency
    const words = message.split(/\s+/).filter(word => word.length > 3);
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w\s]/gi, '');
      if (cleanWord && cleanWord.length > 3) {
        wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
      }
    });
    
    // Count media messages
    if (message.includes('<Media omitted>') || message.includes('image omitted') || message.includes('IMG-') || message.includes('image attached') || message.includes('image omitted')) {
      mediaCount.images++;
    } else if (message.includes('video omitted') || message.includes('VID-') || message.includes('video attached') || message.includes('Video omitted')) {
      mediaCount.videos++;
    } else if (message.includes('audio omitted') || message.includes('audio attached') || message.includes('Audio omitted') || message.includes('voice message omitted')) {
      mediaCount.audio++;
    } else if (message.includes('document omitted') || message.includes('file attached') || message.includes('Document omitted') || message.includes('file omitted')) {
      mediaCount.documents++;
    }
    
    // Count emojis
    const emojis = message.match(emojiRegex);
    if (emojis) {
      emojis.forEach(emoji => {
        emojiCount[emoji] = (emojiCount[emoji] || 0) + 1;
      });
    }
    
    // Store message data
    messages.push({
      date: dateStr,
      time,
      user: cleanUsername,
      message
    });
    
    totalMessages++;
  }
  
  // Convert emoji count to array
  const topEmojis = Object.entries(emojiCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([emoji, count]) => ({ emoji, count }));
  
  // Get top words
  const topWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));
  
  // Format data for charts
  const userLabels = Object.keys(messageCountByUser);
  const userMessageCounts = userLabels.map(user => messageCountByUser[user]);
  
  const dateLabels = Object.keys(messageCountByDate).sort();
  const dateMessageCounts = dateLabels.map(date => messageCountByDate[date]);
  
  // Calculate conversation duration in days
  const durationDays = earliestDate && latestDate ? 
    latestDate.diff(earliestDate, 'days') + 1 : 0;
  
  // Calculate average messages per day
  const avgMessagesPerDay = durationDays > 0 ? 
    (totalMessages / durationDays).toFixed(2) : 0;
  
  return {
    totalMessages,
    totalUsers: users.size,
    users: Array.from(users),
    durationDays,
    avgMessagesPerDay,
    earliestDate: earliestDate ? earliestDate.format('YYYY-MM-DD') : null,
    latestDate: latestDate ? latestDate.format('YYYY-MM-DD') : null,
    messagesByUser: {
      labels: userLabels,
      data: userMessageCounts
    },
    messagesByDate: {
      labels: dateLabels,
      data: dateMessageCounts
    },
    messagesByHour: {
      labels: Array.from({ length: 24 }, (_, i) => i),
      data: messageCountByHour
    },
    topWords,
    mediaCount,
    topEmojis,
    mostActiveUser: userLabels.reduce((a, b) => 
      messageCountByUser[a] > messageCountByUser[b] ? a : b, userLabels[0])
  };
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
