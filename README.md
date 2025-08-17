# UCare Mental Health Chatbot 🧠💚

An AI-powered mental health chatbot built with React, Node.js, and Google Gemini AI. UCare provides supportive conversations and mental health guidance with a focus on Indian users.

## 🏗️ Project Structure

```
ucare-mental-health-chatbot/
├── backend/                 # Backend server files
│   ├── index.js            # Main server file with Gemini AI integration
│   ├── package.json        # Backend dependencies
│   ├── package-lock.json   # Backend dependency lock file
│   └── node_modules/       # Backend packages
├── frontend/               # React frontend application
│   ├── src/                # Source code
│   │   ├── App.js          # Main React component
│   │   ├── index.js        # React entry point
│   │   └── ...             # Other React files
│   ├── public/             # Public assets
│   ├── package.json        # Frontend dependencies
│   └── ...                 # Other frontend files
├── package.json            # Root project configuration
└── README.md               # This file
```

## ✨ Features

- **🤖 AI-Powered Responses**: Google Gemini AI integration for intelligent conversations
- **🧠 Mental Health Focus**: Specialized in stress, anxiety, and burnout detection
- **🇮🇳 Indian Helpline Integration**: Includes official mental health resources
- **💬 Interactive UI**: Quick reply buttons and modern chat interface
- **🔄 Fallback System**: Demo responses when AI is unavailable
- **📱 Responsive Design**: Works on all devices and screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini AI API key

### 1. Install Dependencies
```bash
# Install all dependencies (backend + frontend)
npm run install-all

# Or install manually:
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment
Create a `.env` file in the `backend/` folder:
```env
# Your Google Gemini API key
GEMINI_API_KEY=your_api_key_here
```

### 3. Start the Chatbot
```bash
# Start both backend and frontend simultaneously
npm start

# Or start them separately:
npm run backend    # Start backend server
npm run frontend   # Start React app
```

## 🎯 How to Use

### Backend Development
```bash
cd backend
npm run dev        # Start with nodemon (auto-restart on changes)
npm start          # Start production server
```

### Frontend Development
```bash
cd frontend
npm start          # Start React development server
npm run build      # Build for production
```

## 🔧 Configuration

### Backend Settings
- **Port**: Default 5050 (configurable via `PORT` environment variable)
- **AI Model**: Gemini 1.5 Flash
- **CORS**: Enabled for frontend communication

### Frontend Settings
- **Port**: Default 3000 (auto-assigned if busy)
- **API Endpoint**: `http://localhost:5050/api/chat`
- **Theme**: Health-focused green color scheme

## 📡 API Endpoints

### POST `/api/chat`
Send a message and receive an AI response.

**Request:**
```json
{
  "message": "I'm feeling anxious today"
}
```

**Response:**
```json
{
  "response": "I understand anxiety can be really challenging..."
}
```

## 🎨 Customization

### Adding New Demo Responses
Edit `backend/index.js` and add to the `DEMO_REPLIES` array:
```javascript
const DEMO_REPLIES = [
  // ... existing responses
  "Your new response here! 💚"
];
```

### Changing Colors
Edit `frontend/src/App.js` and modify the theme:
```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#your-color-here' },
    // ... other colors
  },
});
```

### Adding New Features
- **Backend**: Add new routes in `backend/index.js`
- **Frontend**: Create new components in `frontend/src/`

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check if port 5050 is available
- Verify your Gemini API key
- Ensure all dependencies are installed

**Frontend can't connect to backend:**
- Make sure backend is running on port 5050
- Check browser console for CORS errors
- Verify the API endpoint URL

**AI responses not working:**
- Check Gemini API key validity
- Monitor backend console for errors
- Verify internet connection

### Debug Mode
```bash
# Backend with detailed logging
cd backend && DEBUG=* npm start

# Frontend with React DevTools
cd frontend && npm start
```

## 📚 Learning Resources

- **React**: [Official Documentation](https://reactjs.org/)
- **Node.js**: [Official Guide](https://nodejs.org/en/learn/)
- **Material-UI**: [Component Library](https://mui.com/)
- **Google Gemini**: [AI Documentation](https://ai.google.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Mental Health Crisis**: Call the Indian helpline at 9152987821
- **Technical Issues**: Check the troubleshooting section above
- **Feature Requests**: Open an issue on GitHub

---

**Remember**: UCare is a supportive companion, but it's not a replacement for professional mental health care. If you're in crisis, please reach out to a mental health professional or emergency services.

**Built with ❤️ for better mental health support**
