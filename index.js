/**
 * UCare Mental Health Chatbot - Root Entry Point
 * 
 * This file serves as the main entry point for deployment platforms
 * like Render, Heroku, etc. It imports and starts the backend server.
 */

// Import and start the backend server
require('./backend/index.js');

console.log('🚀 UCare Chatbot starting from root entry point...');
console.log('📁 Backend server will be available on the configured port');
console.log('🌐 Frontend should be built and served separately');
