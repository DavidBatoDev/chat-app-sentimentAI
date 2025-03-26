// MessageSelf.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { FiClock, FiAlertCircle } from 'react-icons/fi';

const MessageSelf = ({ message }) => {
  const { darkMode } = useSelector((state) => state.theme);

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

  const modifiedTime = () => {
    if (!message.createdAt) return '...';
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

  // Default background color
  let backgroundColor = darkMode ? 'rgba(55, 65, 81, 0.7)' : 'rgba(203, 213, 225, 0.7)';
  let sentimentsList = null;
  let highestEmotion = null;

  // Determine background color and prepare sentiments list if sentiment exists
  if (
    message.sentiment &&
    message.sentiment.length > 0 &&
    Array.isArray(message.sentiment[0])
  ) {
    const sentiments = message.sentiment[0];
    highestEmotion = getHighestEmotion(sentiments);
    if (highestEmotion) {
      backgroundColor = emotionColors[highestEmotion.label] || backgroundColor;
    }
    sentimentsList = sentiments.map((sent, index) => (
      <div key={index} className="text-xs text-black">
        <span className="mr-2">
          {sent.label}: {sent.score.toFixed(2)}
        </span>
      </div>
    ));

  }

  return (
    <div className="flex items-center my-3 w-full justify-end">
      <div className="flex flex-row-reverse justify-start items-center">
        <div
          style={{ backgroundColor }}
          className={`${darkMode ? 'dark-secondary' : 'bg-slate-300'} 
                      flex flex-col p-3 rounded-xl min-w-56 max-w-40 md:max-w-72 lg:max-w-96 relative`}
        >
          <p className="text-sm md:text-md break-all text-black">{message.content}</p>
          <span className="flex justify-end text-xs text-gray-400">
            {modifiedTime()}
          </span>
          {/* Render scores for each emotion */}
          {sentimentsList && (
            <div className="mt-2 flex flex-wrap">
              {sentimentsList}
            </div>
          )}
          {highestEmotion && (
            <div className="absolute right-2 top-2 flex items-center text-gray-500">
              <small className="mr-1">Emotion:</small>
              <strong>{highestEmotion.label}</strong>
            </div>
          )}
          {message?.status === 'sending' && (
            <div className="absolute left-2 bottom-2 flex items-center text-gray-500">
              <FiClock className="animate-pulse" />
              <small className="ml-1">Sending</small>
            </div>
          )}
          {message?.status === 'error' && (
            <div className="absolute left bottom-2 flex items-center text-red-500">
              <FiAlertCircle />
              <small className="ml-1">Error</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageSelf;
