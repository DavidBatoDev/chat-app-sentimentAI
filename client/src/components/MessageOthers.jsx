// MessageOthers.jsx
import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';

const MessageOthers = ({ message }) => {
  const { darkMode } = useSelector(state => state.theme);

  // Mapping each emotion to a background color
  const emotionColors = {
    joy: '#d4edda',       // light green
    anger: '#f8d7da',     // light red
    sadness: '#d1ecf1',   // light blue
    fear: '#e2e3e5',      // light gray
    disgust: '#fff3cd',   // light yellow
    surprise: '#d6d8d9',  // light silver
    neutral: 'gray'    // almost white
  };

  // Calculate modified time
  const modifiedTime = () => {
    if (new Date().getDate() - new Date(message.createdAt).getDate() > 0) {
      return new Date(message.createdAt).toLocaleString([], {
        dateStyle: 'short',
        timeStyle: 'short'
      });
    } else {
      return new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Helper to get the highest emotion from sentiment array
  const getHighestEmotion = (emotions) => {
    if (!emotions || emotions.length === 0) return null;
    return emotions.reduce((prev, current) =>
      current.score > prev.score ? current : prev
    );
  };

  // Default background color if no sentiment available
  let backgroundColor = darkMode ? 'rgba(55, 65, 81, 0.7)' : 'rgba(203, 213, 225, 0.7)';
  let sentimentsList = null;
  let highestEmotionDisplay = null;

  if (message.sentiment && message.sentiment.length > 0 && Array.isArray(message.sentiment[0])) {
    const sentiments = message.sentiment[0];
    const highestEmotion = getHighestEmotion(sentiments);
    if (highestEmotion) {
      backgroundColor = emotionColors[highestEmotion.label] || backgroundColor;
      highestEmotionDisplay = (
        <div className="mt-1 text-xs font-bold">
          Highest Emotion: {highestEmotion.label} ({highestEmotion.score.toFixed(2)})
        </div>
      );
    }
    sentimentsList = sentiments.map((sent, index) => (
      <div key={index} className="text-xs">
        <span className="mr-2">
          {sent.label}: {sent.score.toFixed(2)}
        </span>
      </div>
    ));
  }

  return (
    <div className="flex items-center my-3 w-full">
      <div className="flex flex-row items-center">
        <IconButton>
          <img 
            src={message.sender?.profilePic}
            className="w-10 h-10 rounded-full border"
            alt="Profile"
          />
        </IconButton>
        <div
          style={{ backgroundColor }}
          className={`${darkMode ? 'dark-secondary' : ''} flex flex-col bg-slate-300 p-2 rounded-xl min-w-56 max-w-40 md:max-w-72 lg:max-w-96`}
        >
          <h1 className="font-semibold text-black">{message.sender.name}</h1>
          <p className="text-sm text-wrap text-black break-words">{message.content}</p>
          <span className="flex justify-end text-xs text-gray-400">{modifiedTime()}</span>
          {/* Render emotion scores */}
          {sentimentsList && (
            <div className="mt-2 flex flex-col text-black">
              {sentimentsList}
            </div>
          )}
          {/* Clearly indicate the highest emotion */}
          {highestEmotionDisplay}
        </div>
      </div>
    </div>
  );
};

export default MessageOthers;
