import React from 'react';
import './LiveEventStream.css';

const LiveEventStream = ({ latestEvent }) => {
  return (
    <div className="stream-card">
      <h3>Live Event Stream (Sample)</h3>
      <div className="stream-log">
        {latestEvent ? (
          <p className="log-entry">
            <span>&gt;</span>
            User <span className="log-user">{latestEvent.userId}</span>
            triggered <span className="log-event">{latestEvent.event}</span>
            on <span className="log-url">{latestEvent.url || 'N/A'}</span>
            from [{latestEvent.geo_country}]
          </p>
        ) : (
          <p className="log-entry muted">&gt; Waiting for events...</p>
        )}
      </div>
    </div>
  );
};

export default LiveEventStream;
