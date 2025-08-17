/**
 * UCare Mental Health Chatbot - Frontend React Application
 * 
 * This is the main frontend component that provides the user interface for your UCare chatbot.
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

// Import Material-UI icons
import SendIcon from '@mui/icons-material/Send';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

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
  website: 'https://www.mohfw.gov.in/pdf/helpline.pdf',
};

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
      text: 'Welcome to UCare! I\'m your mental health companion. How are you feeling today? I\'m here to listen and support you. 💚' 
    },
  ]);
  
  // Store the current input text as user types
  const [input, setInput] = useState('');
  
  // Track if the bot is currently processing a message
  const [loading, setLoading] = useState(false);
  
  // Reference to the bottom of the chat for auto-scrolling
  const chatEndRef = useRef(null);

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
            {/* Health and Safety Icon */}
            <HealthAndSafetyIcon sx={{ mr: 2, fontSize: 28, color: 'white' }} />
            
            {/* Chatbot Title */}
            <Typography variant="h6" sx={{ 
              flexGrow: 1, 
              letterSpacing: 1, 
              fontWeight: 'bold', 
              color: 'white' 
            }}>
              UCare Chatbot
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
        <Container maxWidth="md" sx={{ 
          flex: 1,                        // Take remaining space
          display: 'flex', 
          flexDirection: 'column', 
          py: 3                           // Vertical padding
        }}>
          
          {/* Chat Messages Area */}
          <Paper elevation={2} sx={{ 
            flex: 1,                      // Take available space
            p: 3,                         // Padding inside
            mb: 2,                        // Bottom margin
            bgcolor: 'white',             // White background
            overflowY: 'auto',            // Scrollable if many messages
            borderRadius: 2,              // Rounded corners
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',  // Subtle shadow
            border: '1px solid #e0e0e0'  // Light border
          }}>
            
            {/* Display All Messages */}
            {messages.map((msg, idx) => (
              <Box key={idx} sx={{ 
                my: 2,                    // Vertical margin between messages
                display: 'flex', 
                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start'  // User right, bot left
              }}>
                
                {/* Individual Message Bubble */}
                <Box
                  sx={{
                    px: 3,                // Horizontal padding
                    py: 2,                // Vertical padding
                    borderRadius: 2,      // Rounded corners
                    
                    // Different colors for user vs bot messages
                    bgcolor: msg.from === 'user' 
                      ? '#4CAF50'         // Green for user messages
                      : '#E3F2FD',        // Light blue for bot messages
                      
                    color: msg.from === 'user' ? 'white' : '#1976D2',  // Text colors
                    maxWidth: '75%',      // Don't let messages get too wide
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',  // Message shadow
                    border: msg.from === 'user' ? 'none' : '1px solid #BBDEFB'  // Bot message border
                  }}
                >
                  {/* Message Text */}
                  <Typography variant="body1" sx={{ 
                    whiteSpace: 'pre-line',  // Preserve line breaks
                    fontWeight: msg.from === 'user' ? 500 : 400,  // User messages slightly bolder
                    lineHeight: 1.6          // Comfortable reading spacing
                  }}>
                    {msg.text}
                  </Typography>
                </Box>
              </Box>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', my: 2 }}>
                <CircularProgress size={24} color="primary" />
                <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                  Thinking...
                </Typography>
              </Box>
            )}
            
            {/* Invisible element for auto-scrolling */}
            <div ref={chatEndRef} />
          </Paper>

          {/* Quick Reply Buttons Section */}
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outlined"
                size="small"
                onClick={() => handleQuickReply(reply)}
                sx={{
                  borderColor: '#4CAF50',  // Green border
                  color: '#4CAF50',        // Green text
                  '&:hover': {
                    borderColor: '#388E3C',  // Darker green on hover
                    bgcolor: 'rgba(76, 175, 80, 0.1)',  // Light green background
                    transform: 'translateY(-1px)',  // Slight lift effect
                    transition: 'all 0.2s ease'  // Smooth animation
                  }
                }}
              >
                {reply}
              </Button>
            ))}
          </Box>

          {/* Message Input Section */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            
            {/* Text Input Field */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              sx={{ 
                bgcolor: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',  // Default border
                  },
                  '&:hover fieldset': {
                    borderColor: '#4CAF50',  // Green border on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4CAF50',  // Green border when focused
                  },
                }
              }}
              multiline
              minRows={1}
              maxRows={4}
            />
            
            {/* Send Button */}
            <IconButton 
              color="primary" 
              onClick={sendMessage} 
              disabled={loading || !input.trim()} 
              size="large" 
              sx={{ 
                alignSelf: 'flex-end',
                bgcolor: '#4CAF50',        // Green background
                color: 'white',            // White icon
                '&:hover': {
                  bgcolor: '#388E3C',      // Darker green on hover
                  transform: 'scale(1.05)', // Slight grow effect
                  transition: 'all 0.2s ease'  // Smooth animation
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Container>

        {/* Footer with Helpline Information */}
        <Box sx={{ 
          bgcolor: '#f8f9fa',             // Light gray background
          py: 2,                          // Vertical padding
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
