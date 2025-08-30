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


<img width="1440" height="873" alt="Screenshot 2025-08-30 at 5 25 43 PM" src="https://github.com/user-attachments/assets/54071c06-3687-470b-b704-3f77eea2d0f4" />
<img width="1439" height="877" alt="Screenshot 2025-08-30 at 5 25 49 PM" src="https://github.com/user-attachments/assets/f81c2eaf-9439-436f-9848-569c0e58a037" />
<img width="1440" height="875" alt="Screenshot 2025-08-30 at 5 25 56 PM" src="https://github.com/user-attachments/assets/544b0bbd-8bf6-49f1-8da2-945f811d84c0" />
<img width="1437" height="873" alt="Screenshot 2025-08-30 at 5 26 06 PM" src="https://github.com/user-attachments/assets/d1d4658a-777c-4345-b5a2-c2cf210532bc" />
<img width="1390" height="838" alt="Screenshot 2025-08-30 at 6 34 16 PM" src="https://github.com/user-attachments/assets/a4d08e65-26a6-4c08-8d51-5cfec056db6a" />
<img width="1397" height="829" alt="Screenshot 2025-08-30 at 6 34 49 PM" src="https://github.com/user-attachments/assets/27f422f4-88c2-4681-b6bf-8c3d3e325817" />
<img width="1381" height="837" alt="Screenshot 2025-08-30 at 6 34 55 PM" src="https://github.com/user-attachments/assets/1bbdc0b6-86f4-48db-97a6-2c60b97c5960" />
<img width="1393" height="834" alt="Screenshot 2025-08-30 at 6 38 22 PM" src="https://github.com/user-attachments/assets/6c23cda9-f03d-4333-b41e-dd703a6d750a" />
<img width="1397" height="835" alt="Screenshot 2025-08-30 at 6 38 30 PM" src="https://github.com/user-attachments/assets/a474b165-a9f5-4c32-99de-c31051db079c" />
<img width="1440" height="836" alt="Screenshot 2025-08-30 at 6 40 43 PM" src="https://github.com/user-attachments/assets/83cfe095-2e25-4460-b0ef-750e2c5ae8af" />
<img width="1440" height="836" alt="Screenshot 2025-08-30 at 6 41 01 PM" src="https://github.com/user-attachments/assets/bb7aece3-f80f-48b4-8bae-47f0c967b575" />
<img width="1440" height="666" alt="Screenshot 2025-08-30 at 6 41 09 PM" src="https://github.com/user-attachments/assets/2e1aeaf4-9312-4161-a4af-27a5d6d97807" />
