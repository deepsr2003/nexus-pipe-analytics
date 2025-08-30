import React, { useState, useEffect } from 'react';
import HistoricalChart from './components/HistoricalChart';
import StatCard from './components/StatCard';
import LiveEventStream from './components/LiveEventStream'; // Import it
import { useWebSocket } from './hooks/useWebSocket';
import './App.css';

function App() {
  const { latestMessage, isWsConnected } = useWebSocket();
  const [liveEventCount, setLiveEventCount] = useState(0);
  const [latestEvent, setLatestEvent] = useState(null); // State for the stream

  useEffect(() => {
    if (!latestMessage) return;

    // Handle different message types from the WebSocket
    if (latestMessage.type === 'live_event_update') {
      setLiveEventCount(latestMessage.payload.count);
    } else if (latestMessage.type === 'live_event_stream') {
      setLatestEvent(latestMessage.payload);
    }
  }, [latestMessage]);

  return (
    <div className="dashboard-container">
      {/* ... header is the same ... */}
      
      <main className="dashboard-main">
        {/* ... stats-grid is the same ... */}
        
        <div className="chart-container">
          <HistoricalChart />
        </div>

        {/* Add the new component here */}
        <LiveEventStream latestEvent={latestEvent} />
      </main>
    </div>
  );
}

export default App;
