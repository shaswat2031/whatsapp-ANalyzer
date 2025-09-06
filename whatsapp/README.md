# WhatsApp Chat Analyzer

A comprehensive tool to analyze WhatsApp chat exports and visualize the data through various graphs and statistics.

## Features

- Upload WhatsApp chat export files (.txt)
- Analyze message patterns and user activity
- View detailed statistics with interactive charts
- Multiple visualization types (bar charts, line charts, pie charts)
- Analyze content, time patterns, and user contributions

## How to Use

### 1. Export Your WhatsApp Chat

1. Open the WhatsApp conversation you want to analyze
2. Tap the three dots (⋮) in the top right corner
3. Select "More" → "Export chat"
4. Choose "Without Media" (recommended for faster analysis)
5. Save the .txt file to your device

### 2. Start the Application

Run the `start.bat` file in the root directory to launch both the backend and frontend servers.

Or start them manually:

```bash
# Start Backend
cd backend
npm install
npm start

# Start Frontend
cd frotnend
npm install
npm run dev
```

### 3. Upload and Analyze

1. Open the application in your browser (usually at http://localhost:5173)
2. Go to the Upload page
3. Drag and drop your WhatsApp chat .txt file or use the file browser
4. Click "Analyze Chat" and view your results

## Sample Message Format

The application expects WhatsApp chat export format:

```
[12/24/23, 10:15:30 AM] John Doe: Good morning everyone!
[12/24/23, 10:16:45 AM] Jane Smith: Morning John! How are you?
[12/24/23, 10:18:20 AM] John Doe: I'm good, thanks for asking
[12/24/23, 10:20:05 AM] Mike Johnson: Hello guys 👋
[12/24/23, 10:22:30 AM] Jane Smith: <Media omitted>
```

## Technologies Used

### Backend
- Node.js
- Express
- Multer (for file uploads)
- Moment.js (for date handling)

### Frontend
- React
- React Router
- Chart.js & react-chartjs-2
- Axios
- TailwindCSS

## Privacy Note

Your chat data is processed locally and not stored on our servers. The uploaded files are analyzed and then deleted immediately.
