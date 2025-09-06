@echo off
cd n:\timepass\whatsapp\backend
start cmd /k "npm start"
cd ../frotnend
start cmd /k "npm run dev"
echo WhatsApp Chat Analyzer is starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173 (or the port shown in the frontend terminal)
timeout /t 5
