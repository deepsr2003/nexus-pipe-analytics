const express = require('express');
const { Kafka, Partitioners } = require('kafkajs');

const app = express();
app.use(express.json());

// --- Kafka Producer Setup ---
// Connect to the Kafka broker (replace with your broker's address if different)
const kafka = new Kafka({
  clientId: 'nexus-pipe-collector',
  brokers: ['localhost:9092']
});

// Create a producer instance. We use the CreatePartitioner.LegacyPartitioner for broader compatibility.
const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
const topic = 'raw-events';

// --- API Endpoint to receive events ---
app.post('/event', async (req, res) => {
  try {
    const eventData = req.body;
    // Add a server-side timestamp for accuracy
    eventData.received_at = new Date().toISOString(); 

    // Basic validation to ensure the event has essential fields
    if (!eventData.event || !eventData.userId) {
      console.log('Validation failed for event:', eventData);
      return res.status(400).json({ error: 'Missing required event fields: event and userId' });
    }

    // Send the event to the 'raw-events' Kafka topic.
    // The `userId` is used as the key to ensure events from the same user go to the same partition,
    // which can be important for ordered processing downstream.
    await producer.send({
      topic: topic,
      messages: [
        { key: eventData.userId, value: JSON.stringify(eventData) },
      ],
    });

    // Return a 202 Accepted status. This is crucial for high-throughput systems.
    // It tells the client we've accepted the request for processing, but it's not done yet.
    res.status(202).json({ status: 'Event accepted for processing' });
  } catch (error) {
    console.error('Failed to send event to Kafka:', error);
    res.status(500).json({ error: 'Internal server error while processing event' });
  }
});

// --- Server Startup Logic ---
const PORT = 8000;
const startServer = async () => {
  // It's critical to connect the producer before starting the server
  await producer.connect();
  console.log('Kafka Producer connected successfully.');

  app.listen(PORT, () => {
    console.log(`Collector service is listening for events on http://localhost:${PORT}`);
  });
};

// Start the server and handle potential startup errors
startServer().catch(e => {
  console.error('Failed to start the collector service:', e);
  process.exit(1);
});
