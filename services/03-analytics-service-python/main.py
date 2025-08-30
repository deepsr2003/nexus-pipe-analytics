import json
import redis
import mysql.connector  # Changed from psycopg2
from kafka import KafkaConsumer
from datetime import datetime
# --- Service Connections ---

# Kafka Consumer (unchanged)
kafka_consumer = KafkaConsumer(
    'enriched-events',
    bootstrap_servers='localhost:9092',
    group_id='analytics-service-group',
    auto_offset_reset='earliest',
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

# Redis Client (unchanged)
redis_client = redis.Redis(host='localhost', port=6379,
                           db=0, decode_responses=True)

# MySQL Connection (UPDATED)
try:
    # Use mysql.connector to connect
    mysql_conn = mysql.connector.connect(
        host="localhost",
        user="USERNAME_OF_YOUR_PRPJECT_DATABASE",         # Use the user we created
        password="PASSWORD_OF_YOUR_PROJECT_DATABASE",  # Use the password we set
        database="DATABASE_NAME"    # Connect to our database
    )
    print("MySQL connection successful.")
except mysql.connector.Error as err:
    print(f"Could not connect to MySQL: {err}")
    exit(1)


# --- Database Table Setup ---
def setup_database():
    """Ensures the required 'events' table exists in MySQL."""
    with mysql_conn.cursor() as cur:
        # UPDATED SQL for MySQL syntax
        # - INT AUTO_INCREMENT PRIMARY KEY instead of SERIAL
        # - DATETIME(6) instead of TIMESTAMPTZ. We store UTC time.
        cur.execute("""
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                event_type VARCHAR(255),
                user_id VARCHAR(255),
                url VARCHAR(2048),
                received_at DATETIME(6),
                enriched_at DATETIME(6),
                geo_country VARCHAR(10),
                device_type VARCHAR(50)
            );
        """)
        mysql_conn.commit()
    print("Database table 'events' is ready in MySQL.")


print("Analytics service starting...")
setup_database()
print("Waiting for enriched events...")

# --- Main Processing Loop ---
for message in kafka_consumer:
    try:
        event = message.value
        print(f"Processing event: {event.get(
            'event')} for user {event.get('userId')}")

        # --- 1. Real-Time Aggregation (Redis) --- (Unchanged)
        current_minute = datetime.now().strftime('%Y-%m-%dT%H:%M')
        redis_key = f"events:count:{current_minute}"
        redis_client.incr(redis_key)
        redis_client.expire(redis_key, 600)

        # --- NEW: Publish full event to a Redis Pub/Sub channel ---
        redis_client.publish('live-events-stream', json.dumps(event))

        # --- 2. Historical Storage (MySQL) --- (CORRECTED)
        with mysql_conn.cursor() as cur:
            sql = """
                INSERT INTO events (event_type, user_id, url, received_at, enriched_at, geo_country, device_type) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """

            # --- FIX IS HERE (Using strptime for compatibility) ---
            # 1. Get the ISO format string from the event (e.g., '2023-11-04T16:20:00.123Z')
            received_at_str = event.get('received_at')

            # 2. Python's strptime doesn't handle the 'Z' timezone well.
            #    We also need to handle the fractional seconds (milliseconds).
            #    So we define a format that matches the first 19 characters ('YYYY-MM-DDTHH:MM:SS').
            #    The fractional seconds will be ignored, which is fine for this use case.
            received_at_dt = datetime.strptime(
                received_at_str[:19], '%Y-%m-%dT%H:%M:%S')

            # Get the datetime object for the enriched_at timestamp
            enriched_at_dt = datetime.fromtimestamp(
                event.get('enriched_at_ts'))

            # 3. Create the tuple with the correct datetime objects
            val = (
                event.get('event'),
                event.get('userId'),
                event.get('url'),
                received_at_dt,     # Pass the parsed datetime object
                enriched_at_dt,
                event.get('geo_country'),
                event.get('device_type')
            )
            cur.execute(sql, val)
            mysql_conn.commit()

    except Exception as e:
        print(f"Error processing message for analytics: {e}")
