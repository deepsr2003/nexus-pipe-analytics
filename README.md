# NexusPipe - A Distributed Real-Time Analytics Pipeline

NexusPipe is a distributed, fault-tolerant pipeline that ingests, processes, and visualizes high-throughput user event data in real-time.

## Architecture
[Insert a simple architecture diagram here. You can create one easily with tools like Excalidraw or draw.io]

The system consists of four main microservices that communicate asynchronously via Apache Kafka:
1.  **Collector Service (Node.js):** A high-performance ingestion endpoint.
2.  **Enrichment Service (Python):** Adds contextual data to raw events.
3.  **Analytics Service (Python):** Aggregates data for real-time dashboards (Redis) and stores it for historical analysis (PostgreSQL).
4.  **Query API (Node.js):** Serves historical data via a REST API and live data via WebSockets.

## Technology Stack
-   **Backend:** Node.js (Express), Python
-   **Frontend:** React
-   **Messaging:** Apache Kafka
-   **Databases:** Redis (real-time aggregation), MYSQL (historical storage)
-   **Real-time Communication:** WebSockets

## How to Run
1.  **Install Infrastructure:** Make sure you have Kafka, Zookeeper, Redis, and PostgreSQL running locally.
2.  **Create Kafka Topics:** Run `kafka-topics.sh --create --topic raw-events --bootstrap-server localhost:9092` and `... --create --topic enriched-events ...`.
3.  **Setup Databases:** Create a PostgreSQL database and tables.
4.  **Install Dependencies:** Run `npm install` or `pip install -r requirements.txt` in each service directory.
5.  **Run Services:** Start each of the four backend services in a separate terminal.
6.  **Run UI:** Start the React development server.
