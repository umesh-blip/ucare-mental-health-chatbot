/* WizCare Mental Health Chatbot - Frontend React Application
 * 
 * This is the main frontend component that provides the user interface for your WizCare chatbot.
 * It handles the chat interface, message display, and communication with the backend.
 * 
 * Features:
 * - Modern, responsive chat interface
 * - Real-time message updates
 * - Quick reply buttons for common feelings
 * - Professional mental health app design
 * - Integration with backend AI service
 */

// Import React hooks and components
import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Import Material-UI components for the user interface
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  IconButton, 
  CircularProgress, 
  AppBar, 
  Toolbar, 
  Container, 
  Button, 
  Chip 
} from '@mui/material';

// Import Material-UI iconshttps
import SendIcon from '@mui/icons-material/Send';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

/**
 * Material-UI Theme Configuration
 * This defines the color scheme and styling for your chatbot
 */
const theme = createTheme({
  palette: {
    mode: 'light',                           // Light theme (easier on eyes)
    primary: { main: '#4CAF50' },           // Health green - represents wellness
    secondary: { main: '#2196F3' },         // Professional blue - trust and calm
    background: {
      default: '#f5f5f5',                   // Light gray background
      paper: '#ffffff',                      // White chat containers
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Clean, readable font
  },
});

/**
 * Indian Mental Health Helpline Information
 * This is displayed prominently in the chatbot interface
 */
const INDIAN_HELPLINE = {
  phone: '9152987821',
  website: 'https://manastha.com/',
};

/**
 * Add wizard SVG as a React component (fallback)
 */
const WizardAvatarSVG = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: 12}}>
    <circle cx="24" cy="24" r="24" fill="#E8F5E8"/>
    <circle cx="24" cy="20" r="12" fill="#4CAF50"/>
    <path d="M12 36 Q24 28 36 36" stroke="#4CAF50" strokeWidth="2" fill="none"/>
    <circle cx="20" cy="18" r="2" fill="white"/>
    <circle cx="28" cy="18" r="2" fill="white"/>
    <path d="M22 24 Q24 26 26 24" stroke="white" strokeWidth="1.5" fill="none"/>
    <path d="M16 12 L20 8 L28 8 L32 12" stroke="#4CAF50" strokeWidth="2" fill="#E8F5E8"/>
  </svg>
);

// Image-based avatar that falls back to SVG if the image is not found
const DoctorAvatarImage = ({ size = 48, className }) => {
  const [errored, setErrored] = React.useState(false);
  if (errored) {
    return <WizardAvatarSVG />;
  }
  return (
    <img
      src="/codewizard.jpeg"
      alt="Wizard Assistant"
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className={className || 'doctor-avatar-img'}
      style={{ marginRight: 12, borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.12)' }}
    />
  );
};

/**
 * Add DoctorAvatarFloating component
 */
const DoctorAvatarFloating = ({ visible }) => (
  <div className={`doctor-avatar-floating ${visible ? 'slide-in-doctor' : 'slide-out-doctor'}`}>
    <DoctorAvatarImage size={80} className="doctor-avatar-img" />
  </div>
);

/**
 * Stress meter component
 */
const stressLevels = [
  { label: 'Low', emoji: '😊', color: '#4CAF50' },
  { label: 'Mid', emoji: '😐', color: '#FFC107' },
  { label: 'High', emoji: '😟', color: '#FF9800' },
  { label: 'Very High', emoji: '😫', color: '#F44336' },
];

const StressMeter = ({ level }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
    <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 'bold' }}>Stress Meter:</Typography>
    {stressLevels.map((s, idx) => (
      <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', mx: 1 }}>
        <span style={{ fontSize: 24, opacity: idx === level ? 1 : 0.3 }}>{s.emoji}</span>
        <Typography variant="body2" sx={{ ml: 0.5, color: idx === level ? s.color : '#888', fontWeight: idx === level ? 'bold' : 'normal' }}>{s.label}</Typography>
      </Box>
    ))}
  </Box>
);

/**
 * Health-safety rotating tips
 */
const HEALTH_TIPS = [
  'Take 3 slow breaths — in 4, hold 2, out 6. 🌿',
  'Sip some water and relax your shoulders. 💧',
  'Step away for 2 minutes; stretch gently. 🧘',
  'Write one worry down; park it for later. 📝',
  'Text a friend or loved one to say hi. 💬',
  'Notice 5 things you can see right now. 👀',
];

/**
 * Main App Component
 * This is the heart of your chatbot frontend
 */
function App() {
  /**
   * State Management using React Hooks
   * These variables store the current state of your chatbot
   */
  
  // Store all chat messages (both user and bot)
  const [messages, setMessages] = useState([
    { 
      from: 'bot', 
      text: 'Welcome to WizCare! I\'m your mental health companion. How are you feeling today? I\'m here to listen and support you. 💚' 
    },
  ]);
  
  // Store the current input text as user types
  const [input, setInput] = useState('');
  
  // Track if the bot is currently processing a message
  const [loading, setLoading] = useState(false);
  
  // Reference to the bottom of the chat for auto-scrolling
  const chatEndRef = useRef(null);
  const messagesRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [hasTop, setHasTop] = useState(false);
  const [hasBottom, setHasBottom] = useState(false);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive only if user is near bottom
    if (isNearBottom) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleMessagesScroll = () => {
    const el = messagesRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setIsNearBottom(nearBottom);
    setHasTop(el.scrollTop > 8);
    setHasBottom(!nearBottom);
  };

  // Add state for stress level (0: Low, 1: Mid, 2: High, 3: Very High)
  const [stressLevel, setStressLevel] = useState(0);

  // Add state for doctor avatar visibility (existing) and new tip index
  const [doctorVisible, setDoctorVisible] = useState(false);
  const doctorTimeoutRef = useRef();
  const [tipIdx, setTipIdx] = useState(0);

  // Rotate tips every 7 seconds
  useEffect(() => {
    const id = setInterval(() => setTipIdx((i) => (i + 1) % HEALTH_TIPS.length), 7000);
    return () => clearInterval(id);
  }, []);

  // Show doctor when bot replies (existing)
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].from === 'bot') {
      setDoctorVisible(true);
      clearTimeout(doctorTimeoutRef.current);
      doctorTimeoutRef.current = setTimeout(() => setDoctorVisible(false), 4000);
    }
    return () => clearTimeout(doctorTimeoutRef.current);
  }, [messages]);

  /**
   * Auto-scroll to bottom when new messages arrive
   * This ensures users always see the latest message
   */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Send Message Function
   * This handles sending messages to the backend and receiving AI responses
   */
  const sendMessage = async () => {
    // Don't send empty messages
    if (!input.trim()) return;
    
    // Add user message to chat immediately
    const userMsg = { from: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    
    // Clear input field and show loading state
    setInput('');
    setLoading(true);
    
    try {
      // Send message to backend API
      const API_URL = process.env.REACT_APP_API_URL || "/api/chat";
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      
      // Check if the request was successful
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      // Parse the response from the backend
      const data = await res.json();
      
      // Check if backend returned an error
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Add bot response to chat
      setMessages((msgs) => [...msgs, { from: 'bot', text: data.response }]);
      
      // Set stress level from backend if available
      if (typeof data.stressLevel === 'number') {
        setStressLevel(data.stressLevel);
      }
      
    } catch (e) {
      // Handle any errors that occur
      console.error('Chat error:', e);
      
      // Provide user-friendly error messages
      let errorMessage = 'Sorry, I am having trouble responding right now.';
      
      if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
        errorMessage = 'Unable to connect to the server. Please make sure the backend is running.';
      } else if (e.message.includes('HTTP error')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      // Show error message in chat
      setMessages((msgs) => [...msgs, { from: 'bot', text: errorMessage }]);
    }
    
    // Hide loading state
    setLoading(false);
  };

  /**
   * Handle Enter Key Press
   * Allows users to send messages by pressing Enter
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();  // Prevent new line
      sendMessage();        // Send the message
    }
  };

  /**
   * Quick Reply Buttons
   * These provide common conversation starters for users
   */
  const quickReplies = [
    "I'm feeling anxious",
    "I need motivation", 
    "I'm stressed",
    "I feel lonely",
    "I need a breathing exercise",
    "Tell me a positive quote"
  ];

  /**
   * Handle Quick Reply Button Click
   * When user clicks a quick reply, it automatically sends that message
   */
  const handleQuickReply = (reply) => {
    setInput(reply);                    // Set the input to the quick reply
    setTimeout(() => sendMessage(), 100); // Send it after a short delay
  };

  /**
   * Render the Chatbot Interface
   * This returns the JSX that creates your chatbot's visual appearance
   */
  return (
    // Wrap everything in the Material-UI theme
    <ThemeProvider theme={theme}>
      {/* Main container for the entire app */}
      <Box sx={{ 
        minHeight: '100vh',              // Full screen height
        bgcolor: 'background.default',   // Use theme background color
        display: 'flex',                 // Flexbox layout
        flexDirection: 'column'          // Stack elements vertically
      }}>
        
        {/* Top Navigation Bar */}
        <AppBar position="static" color="primary" sx={{ 
          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.2)',  // Subtle shadow
          background: 'linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%)'  // Green gradient
        }}>
          <Toolbar>
            {/* App Logo */}
            <img src="/logo.svg" alt="WizCare Logo" style={{ width: 22, height: 22, marginRight: 12 }} />
            
            {/* Chatbot Title */}
            <Typography variant="h6" sx={{ 
              flexGrow: 1, 
              letterSpacing: 1, 
              fontWeight: 'bold', 
              color: 'white' 
            }}>
              WizCare Chatbot
            </Typography>
            
            {/* Helpline Number Display */}
            <Chip 
              label="Helpline: 9152987821" 
              color="secondary" 
              size="small"
              sx={{ fontWeight: 'bold', bgcolor: 'white' }}
            />
          </Toolbar>
        </AppBar>

        {/* Main Chat Container */}
        <Container maxWidth="md" className="main-container-area" sx={{ 
          flex: 1,                        // Take remaining space
          display: 'flex', 
          flexDirection: 'column', 
          py: 0                           // No vertical padding - handled by CSS
        }}>
          
          {/* Inline Chat Card - centered */}
          <Box sx={{ flex: 1, position: 'relative' }}>
            <Box className="chat-card fixed" sx={{ borderRadius: 3, boxShadow: 3, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Box className="chat-card-header" sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <img src="/codewizard.jpeg" alt="WizCare" style={{ width: 32, height: 32, borderRadius: 8 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ m: 0 }}>WizCare Chat</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>Online • Here to help</Typography>
                </Box>
              </Box>

              {/* Messages area: only this scrolls. */}
              <Box
                className={`inline-chat-messages ${hasTop ? 'has-top' : ''} ${hasBottom ? 'has-bottom' : ''}`}
                sx={{ p: 3, flex: 1, position: 'relative' }}
                ref={messagesRef}
                onScroll={handleMessagesScroll}
              >
                {messages.map((msg, idx) => (
                  <Box key={idx} sx={{ display: 'flex', mb: 2, justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                    {msg.from === 'bot' && <DoctorAvatarImage size={40} />}
                    <Box sx={{ maxWidth: '75%' }}>
                      <Box className={`message-bubble ${msg.from === 'user' ? 'user-fill' : 'bot'}`} sx={{ p: 1.5 }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{msg.text}</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}> </Typography>
                    </Box>
                  </Box>
                ))}
                {loading && (
                  <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                    <DoctorAvatarImage size={40} />
                    <div className="typing-bubble" style={{ marginLeft: 12 }}>
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </Box>
                )}
                <div ref={chatEndRef} />
              </Box>

              <Box className="chat-card-footer" sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 1, flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {quickReplies.map((q, i) => (
                    <Button key={i} size="small" variant="outlined" onClick={() => handleQuickReply(q)} sx={{ borderRadius: 20 }}>{q}</Button>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField fullWidth variant="outlined" placeholder="Type your message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} multiline minRows={1} maxRows={4} />
                  <IconButton color="primary" onClick={sendMessage} disabled={loading || !input.trim()} sx={{ bgcolor: '#6d28d9', color: 'white' }}>
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>

        {/* Footer with Helpline Information */}
        <Box className="app-footer" sx={{ 
          bgcolor: '#f8f9fa',             // Light gray background
          py: 1,                          // Reduced vertical padding
          textAlign: 'center',            // Center text
          borderTop: '1px solid #e0e0e0'  // Top border
        }}>
          
          {/* Helpline Phone Number */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <EmojiEmotionsIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
            <strong>Indian Mental Health Helpline:</strong> {INDIAN_HELPLINE.phone}
          </Typography>
          
          {/* Helpline Website Link */}
          <Typography variant="body2" color="primary">
            <a 
              href={INDIAN_HELPLINE.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                color: '#4CAF50',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Visit Official Helpline Website
            </a>
          </Typography>
        </Box>
        <DoctorAvatarFloating visible={doctorVisible} />
        <div className="doctor-tip-bubble" key={tipIdx}>{HEALTH_TIPS[tipIdx]}</div>
        {/* Floating chat removed per request */}
      </Box>
    </ThemeProvider>
  );
}

// Export the App component so it can be used in other files
export default App;

/**
 * HOW THIS FRONTEND WORKS:
 * 
 * 1. COMPONENT STRUCTURE:
 *    - AppBar: Top navigation with title and helpline
 *    - Chat Container: Main area for messages
 *    - Quick Reply Buttons: Common conversation starters
 *    - Input Section: Text field and send button
 *    - Footer: Helpline information
 * 
 * 2. STATE MANAGEMENT:
 *    - messages: Array of all chat messages
 *    - input: Current text being typed
 *    - loading: Whether bot is processing
 * 
 * 3. USER INTERACTION:
 *    - Type message and press Enter or click Send
 *    - Click quick reply buttons for instant responses
 *    - Messages automatically scroll to bottom
 * 
 * 4. BACKEND COMMUNICATION:
 *    - Sends POST requests to http://localhost:5050/api/chat
 *    - Receives AI responses from Gemini
 *    - Handles errors gracefully with fallback messages
 * 
 * 5. STYLING:
 *    - Material-UI components for professional look
 *    - Green color scheme representing health and wellness
 *    - Responsive design that works on all screen sizes
 * 
 * 6. CUSTOMIZATION:
 *    - Change colors in the theme object
 *    - Add more quick reply buttons
 *    - Modify the layout and spacing
 *    - Add new features like file uploads or voice messages
 */
