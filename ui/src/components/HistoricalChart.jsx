import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { fetchHistoricalData } from '../api/analyticsApi';

const HistoricalChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const apiData = await fetchHistoricalData();
        // The API returns data, let's format it for the chart
        const formattedData = apiData.map(item => ({
          ...item,
          // Convert timestamp string to a Date object for formatting
          minute: new Date(item.minute),
        }));
        setData(formattedData);
      } catch (err) {
        setError('Failed to load chart data.');
      } finally {
        setLoading(false);
      }
    };
    
    getData();
  }, []); // Empty dependency array means this runs once on component mount

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <h2>Events Per Minute (Last Hour)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis 
            dataKey="minute" 
            tickFormatter={(time) => format(time, 'HH:mm')}
            stroke="#888"
          />
          <YAxis stroke="#888" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#242424', border: '1px solid #444' }} 
            labelFormatter={(label) => format(new Date(label), 'MMM d, HH:mm')}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="event_count" 
            stroke="#8884d8" 
            strokeWidth={2}
            dot={false}
            name="Events"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default HistoricalChart;
