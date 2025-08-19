/**
 * UCare Mental Health Chatbot - Backend Server
 * 
 * This is the main backend server that powers your UCare chatbot.
 * It handles AI responses using Google Gemini AI and provides fallback responses.
 * 
 * Features:
 * - Google Gemini AI integration for intelligent responses
 * - Mental health focused conversation handling
 * - Indian mental health helpline integration
 * - Fallback demo responses if AI fails
 * - RESTful API endpoints
 */

// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');           // Web framework for Node.js
const cors = require('cors');                // Enable cross-origin requests
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Google's AI service
const path = require('path');

// Create Express application
const app = express();

// Middleware setup
app.use(cors());                             // Allow frontend to communicate with backend
app.use(express.json());                     // Parse JSON request bodies

/**
 * Initialize Google Gemini AI with your API key
 * This connects your chatbot to Google's AI service for intelligent responses
 * 
 * SECURITY: API key is now loaded from environment variables (.env file)
 * Never commit your .env file to version control!
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Validate that API key is present
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY not set. Running in demo-only mode (AI disabled).');
} else {
  console.log('✅ GEMINI_API_KEY detected. Note: AI calls are currently disabled (demo-only mode).');
}

/**
 * Test function to verify Gemini AI connection
 * This runs when the server starts to ensure AI is working
 */
async function testGemini() {
  try {
    // Get the Gemini model (using the latest stable version)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Test with a simple message
    const result = await model.generateContent("Hello, how are you today?");
    const response = await result.response;
    
    console.log("Gemini AI test response:");
    console.log(response.text());
  } catch (e) {
    console.error("Error during Gemini test:", e);
  }
}

// In demo-only mode, skip testing Gemini
// testGemini();

/**
 * Indian Mental Health Helpline Information
 * This is displayed in the chatbot and included in AI responses when needed
 */
const INDIAN_HELPLINE = {
  phone: '9152987821',
  website: 'https://www.mohfw.gov.in/pdf/helpline.pdf',
};

/**
 * Demo Mode Responses (Fallback System)
 * These are used when Gemini AI fails or is unavailable
 * Provides 15 different casual, supportive responses
 */
const DEMO_REPLIES = [
  "Hey there! 👋 How's your day going? Remember, it's totally okay to not be okay sometimes.",
  "Hi friend! 🌟 I'm here to chat whenever you need someone to talk to. What's on your mind?",
  "Hello! ✨ You know what? Taking care of your mental health is just as important as physical health. How are you feeling right now?",
  "Hey! 🚀 Thanks for reaching out. Sometimes just talking about what's bothering us can make a huge difference. Want to share?",
  "Hi there! 💫 I'm glad you're here. Remember, you're stronger than you think, and it's okay to ask for help when you need it.",
  "Hello friend! 🌈 How about we take a moment to breathe together? Inhale for 4 counts, hold for 4, exhale for 4. How does that feel?",
  "Hey! 🎯 Sometimes the best thing we can do is just be kind to ourselves. What's something nice you could do for yourself today?",
  "Hi! 🌙 Remember, every day is a fresh start. What's one small thing you're looking forward to today?",
  "Hey there! 🎨 You know what helps me? Writing down three things I'm grateful for. Want to try it together?",
  "Hello! 🌟 It's totally normal to have ups and downs. The important thing is that you're here and you're trying. That's brave!",
  "Hi friend! 🚀 Sometimes we all need a little reminder that we're doing better than we think. You're doing great!",
  "Hey! 💝 Remember, you don't have to have it all figured out. It's okay to take things one step at a time.",
  "Hello! ✨ You know what's amazing? The fact that you're reaching out for support. That takes courage!",
  "Hi there! 🌈 How about we do a quick check-in? On a scale of 1-10, how are you feeling right now?",
  "Hey! 🎯 Sometimes the best conversations start with 'I'm not okay.' It's totally fine to not be okay. Want to talk about it?"
];

/**
 * Special Greeting Responses
 * These are used when users say hello, hi, etc.
 * Provides 8 different welcoming responses
 */
const GREETING_RESPONSES = [
  "Hey there! 👋 Welcome to UCare! I'm your AI mental health buddy. How are you feeling today?",
  "Hi friend! 🌟 Great to see you here! I'm here to listen and chat whenever you need someone to talk to.",
  "Hello! 🚀 Thanks for stopping by! How's your mental health journey going today?",
  "Hey! ✨ Welcome! I'm here to support you through whatever you're going through. What's on your mind?",
  "Hi there! 🌈 Nice to meet you! I'm your mental health companion. How can I help you today?",
  "Hello! 💫 Welcome to the UCare family! I'm here to chat, listen, and support you. How are you doing?",
  "Hey! 🎯 Great to have you here! I'm your AI friend who's here to help with whatever's on your mind.",
  "Hi! 🌙 Welcome! I'm here to be your mental health companion. What would you like to talk about today?"
];

/**
 * Check if a message is a greeting
 * This function identifies when users say hello, hi, etc.
 * @param {string} message - The user's message
 * @returns {boolean} - True if it's a greeting, false otherwise
 */
function isGreeting(message) {
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo'];
  return greetings.some(greeting => message.toLowerCase().includes(greeting));
}

/**
 * Main Chat API Endpoint
 * This is where all chat messages are processed
 * Route: POST /api/chat
 * 
 * How it works:
 * 1. Receives user message from frontend
 * 2. Sends it to Gemini AI for intelligent response
 * 3. If AI fails, falls back to demo responses
 * 4. Returns response to frontend
 */
app.post('/api/chat', async (req, res) => {
  // Extract message from request body
  const { message } = req.body;
  
  // Validate that message exists
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // DEMO-ONLY MODE: Always return a friendly demo response (no AI calls)
  let fallbackResponse;
  if (isGreeting(message)) {
    fallbackResponse = GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)];
  } else {
    fallbackResponse = DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)];
  }

  return res.json({ response: fallbackResponse });
});

/**
 * Server Configuration
 * Set the port (default: 5050) and start listening for requests
 */
const PORT = process.env.PORT || 5050;

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Your UCare chatbot is now live! 🚀`);
  console.log(`Frontend can connect at: http://localhost:${PORT}`);
});

/**
 * HOW TO USE THIS BACKEND:
 * 
 * 1. Start the server: node index.js
 * 2. The server will test Gemini AI connection
 * 3. Frontend can send POST requests to /api/chat
 * 4. Each request gets an AI response or fallback response
 * 
 * API ENDPOINTS:
 * - POST /api/chat - Send message, get AI response
 * 
 * ERROR HANDLING:
 * - If Gemini AI fails, automatically uses demo responses
 * - No downtime - chatbot always responds
 * 
 * CUSTOMIZATION:
 * - Add more demo responses to DEMO_REPLIES array
 * - Modify the AI prompt in the chat endpoint
 * - Add new API endpoints for additional features
 */
