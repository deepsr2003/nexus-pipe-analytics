import json
from kafka import KafkaConsumer, KafkaProducer

import time

# --- Kafka Client Setup ---

# Consumer setup:
# - Connects to the 'raw-events' topic.
# - 'group_id' is crucial. It allows multiple instances of this service to work together
#   as a single consumer group, with Kafka distributing messages among them for scalability.
consumer = KafkaConsumer(
    'raw-events',
    bootstrap_servers='localhost:9092',
    group_id='enrichment-service-group',
    # Start reading at the earliest message if no offset is stored
    auto_offset_reset='earliest',
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

# Producer setup:
# - Will send enriched events to the 'enriched-events' topic.
producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

print("Enrichment service is running and waiting for messages...")

# --- Main Processing Loop ---
# This loop will run forever, polling Kafka for new messages.
for message in consumer:
    try:
        event_data = message.value
        print(f"Received raw event for user: {event_data.get('userId')}")

        # --- Enrichment Logic ---
        # In a real-world scenario, this is where you would perform lookups:
        # - Geo-IP lookup based on the request IP address.
        # - User-Agent parsing to get device/browser info.
        # - Fetching user details from another database.

        # For this project, we'll add some static dummy data to simulate enrichment.
        event_data['enriched'] = True
        event_data['enriched_at_ts'] = int(time.time())
        event_data['geo_country'] = 'US'  # Dummy geo data
        event_data['device_type'] = 'Desktop'  # Dummy device data

        # Produce the newly enriched message to the 'enriched-events' topic
        producer.send('enriched-events', value=event_data)
        print(f"Successfully enriched and forwarded event for user: {
              event_data.get('userId')}")

    except Exception as e:
        # Basic error handling
        print(f"Error processing message: {message.value}. Error: {e}")
