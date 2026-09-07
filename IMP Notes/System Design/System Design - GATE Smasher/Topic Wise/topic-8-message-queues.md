# Topic 8 Master Study Guide: Message Queues & Event-Driven Systems (Kafka vs. RabbitMQ)

## 1. WHAT, WHY, WHERE, HOW (Technical Mechanics)
An **Event-Driven / Message Queue System** acts as an asynchronous transport layer that enables decoupled microservices to communicate without direct dependencies.

### Why Use Message Queues?
* **Decoupling**: Service A does not need to know the location, API contract, or availability of Service B.
* **Resilience**: If downstream services crash, incoming messages remain securely buffered in the queue and are processed when services recover.
* **Rate Leveling (Traffic Shaving)**: Acts as a buffer to protect downstream databases during traffic spikes, allowing consumers to pull and process messages at their own stable pace.

### RabbitMQ (Smart Broker, Dumb Consumer)
* **Design Philosophy**: It focuses on targeted routing and message delivery guarantees. It routes messages to exchanges, which distribute them to queues based on complex bindings.
* **Consumption Model**: The broker **pushes** messages to active consumers. Once a consumer acknowledges receipt (**Ack**), the message is instantly deleted from the broker.

### Apache Kafka (Dumb Broker, Smart Consumer)
* **Design Philosophy**: Kafka is built as an append-only distributed **Commit Log**. Messages are written sequentially to a partition on disk and are **Immutable**. They are never deleted upon consumption—they persist on disk based on a defined time retention policy.
* **Consumption Model**: Consumers **pull** messages from Kafka partitions and track their own progress using an index pointer called an **Offset**. This allows multiple consumer groups to read the same log stream at completely different speeds.

---

## 2. TRADEOFFS (Advantages & Disadvantages under High Load)

| Feature | RabbitMQ (Message Queue) | Apache Kafka (Distributed Log Stream) |
| :--- | :--- | :--- |
| **Throughput Capacity** | Moderate (Tends to degrade if backlogs build up in memory). | Extremely High (Handles millions of events/sec natively). |
| **Consumer Flexibility** | Message is consumed once and disappears. | Messages persist; consumers can replay streams from the beginning. |
| **Complex Routing** | Excellent. Supports wildcards, fan-outs, and direct headers. | Basic. Routes events straight to targeted Partitions. |
| **Ordering Guarantees** | Guaranteed within a queue, but complex with parallel consumers. | Guaranteed strictly inside a single physical Partition. |

---

## 3. PRODUCTION EXAMPLES
* **Uber**: Leverages **Apache Kafka** as their primary real-world event stream bus. Every single trip state update, driver location ping, passenger fare search, and billing update is published as a distinct Kafka event. Dozens of downstream consumer fleets (dynamic pricing engines, fraud detection frameworks, audit databases) read these streams simultaneously without interfering with one another.
* **Amazon**: Employs **RabbitMQ-style routing systems (via AWS SQS & SNS)** within their shipping and fulfillment pipelines. When an order completes, SQS queues an atomic "Shipment Packing Order". A warehouse robot pulls the order, packages it, acknowledges receipt, and SQS deletes the job. This prevents two robots from picking the same order.

---

## 4. MEMORY ANCHORS

### The 20-Year Non-Tech Analogy: The Local Postal Mailbox vs. The Security Camera DVR
* **RabbitMQ (The Local Mailbox)**: You receive letters in a physical mailbox. When you get home, you open the mailbox, pull the letters out, and read them. Once you take the mail inside, the mailbox is empty again. No one else can read those letters.
* **Apache Kafka (The Security Camera DVR)**: You install a security camera system that writes continuous footage onto a master DVR hard drive in a locked room. The DVR sequentially writes every frame onto a hard disk partition and never deletes footage until the drive fills up after 30 days. Your security team (Consumer Group 1) watches the live feed on Monitor 1. Your audit team (Consumer Group 2) wants to investigate a theft that happened yesterday, so they rewind the hard drive to yesterday's offset and replay the video without interrupting the live monitors.

### ASCII Architecture Diagram
```
     [ Producer Service ] ───> [ Exchange / Topic ]
                                      │
                     ┌────────────────┴────────────────┐
                     ▼                                 ▼
         [ Kafka Commit Log Disk ]            [ RabbitMQ In-Memory Queue ]
        ┌─────────────────────────┐          ┌──────────────────────────┐
        │ [Offset 1] [Offset 2]   │          │  [Job 1]  [Job 2] [Job 3]│
        └─────────────────────────┘          └──────────────────────────┘
           (Pull: Dumb Broker)                  (Push: Smart Broker)
```

---

## 5. LANGUAGES

### Node.js / TypeScript (Kafka Event Producer Setup)
This code initializes a Kafka client connection and publishes telemetry messages asynchronously:
```typescript
import { Kafka, Producer } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'telemetry-app',
    brokers: ['kafka-broker-production:9092']
});

const producer: Producer = kafka.producer();

async function publishUserEvent(userId: string, action: string) {
    await producer.connect();
    
    // Publish payload to event log
    await producer.send({
        topic: 'user-clicks',
        messages: [
            { key: userId, value: JSON.stringify({ userId, action, timestamp: Date.now() }) }
        ]
    });
}
```

### Java 25+ (RabbitMQ Consumer on Virtual Threads)
By running SQS/RabbitMQ consumers on virtual threads, your consumer nodes can block waiting for messages indefinitely without locking OS threads:
```java
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;
import java.util.concurrent.Executors;

public class RabbitVirtualThreadConsumer {
    private final static String QUEUE_NAME = "shipment_orders";

    public static void main(String[] argv) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("rabbitmq-broker");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        channel.queueDeclare(QUEUE_NAME, true, false, false, null);
        System.out.println("Waiting for messages...");

        // Delivery Callback
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            
            // Spin up a Project Loom virtual thread to process each incoming order
            Thread.startVirtualThread(() -> {
                try {
                    processOrder(message);
                    channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
                } catch (Exception e) {
                    System.err.println("Processing error");
                }
            });
        };

        channel.basicConsume(QUEUE_NAME, false, deliverCallback, consumerTag -> {});
    }

    private static void processOrder(String message) throws Exception {
        // High latency shipment logic
        Thread.sleep(500);
        System.out.println("Order Processed: " + message);
    }
}
```

---

## 6. INFRASTRUCTURE

### Production Decoupled Event-Bus Docker Compose Setup
This configuration sets up Apache Kafka with Apache ZooKeeper inside a single network block:
```yaml
# docker-compose-event-bus.yml
version: '3.8'

services:
  zookeeper:
    image: bitnami/zookeeper:3.8
    container_name: production_zookeeper
    ports:
      - "2181:2181"
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes
    networks:
      - queue_network

  kafka_broker:
    image: bitnami/kafka:3.4
    container_name: production_kafka_broker
    ports:
      - "9092:9092"
    environment:
      - KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181
      - ALLOW_PLAINTEXT_LISTENER=yes
    depends_on:
      - zookeeper
    networks:
      - queue_network

networks:
  queue_network:
    driver: bridge
```
