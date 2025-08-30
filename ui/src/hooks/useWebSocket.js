import { useState, useEffect, useRef } from 'react';

// The URL of our WebSocket server
const WEBSOCKET_URL = 'ws://localhost:8080';

export const useWebSocket = () => {
  // Store the most recent message received from the WebSocket
  const [latestMessage, setLatestMessage] = useState(null);
  // Store the connection status
  const [isWsConnected, setIsWsConnected] = useState(false);

  // useRef is used to hold a mutable value that doesn't cause a re-render
  // We use it to store the WebSocket instance itself.
  const ws = useRef(null);

  useEffect(() => {
    // Create a new WebSocket connection when the component mounts
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      setIsWsConnected(true);
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsWsConnected(false);
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setLatestMessage(message);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // This is the cleanup function.
    // It will be called when the component that uses this hook unmounts.
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []); // The empty dependency array ensures this effect runs only once

  // The hook returns the latest message and the connection status
  return { latestMessage, isWsConnected };
};
