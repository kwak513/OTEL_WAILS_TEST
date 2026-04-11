![Adobe Express - logs](https://github.com/user-attachments/assets/85910e0f-8170-448f-96b4-a82ca5b95b6d)# OpenTelemetry (OTEL) Monitoring System Demo

## 📢 Introduction
This project is a monitoring application designed to visualize the **three pillars of observability**: Metrics, Traces, and Logs. By integrating with the SigNoz API, this tool provides a centralized dashboard to monitor system health and performance.

## 👥 Developer

| Name   | Role         |
|--------|--------------|
| Chaeyeon Kwak | Full-stack development |

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, BlueprintJS
- **Backend**: Golang (Wails Framework)
- **Data Source**: SigNoz API (OpenTelemetry)


## 📁 Key File Structure
```
otel_wails_demo/
├── main.go
├── app.go
├── wails.json
│
├── backend/
│ ├── api/     
│ └── models/ 
│
└── frontend/
    ├── src/
    │ ├── layout/
    │ ├── pages/
    │ ├── App.tsx
    │ └── main.tsx
    └── index.html
```

## 📌 Key Features
### 1. SigNoz API Integration
- Connects to SigNoz to fetch observability data using a user-provided API key.

### 2. Metrics, Traces, and Logs Monitoring
- Metrics: Displays metric names, descriptions, and types in a table.
  ![Adobe Express - Adobe Express - metrics](https://github.com/user-attachments/assets/fc2557c3-e1a1-4528-aa2f-2e74bad98944)

- Traces: Visualizes service names, timestamps, and duration in a table.
  ![Adobe Express - traces](https://github.com/user-attachments/assets/45447a85-dd40-4772-a274-ced84b7d103f)

- Logs:  Monitoring with service names, timestamps, severity levels (INFO, ERROR, etc.) and body content
  ![Adobe Express - logs](https://github.com/user-attachments/assets/81883708-2ab2-4aaf-8297-c19811df7619)


## 🚀 Getting Started (Local Execution)
Follow these steps to set up the full observability stack, including the Spring Boot instrumentation and the SigNoz backend.

### 1. Spring Boot Application Setup
To collect data, you must attach the OpenTelemetry Javaagent to your target Spring Boot application.

1. Download the Javaagent
- Download opentelemetry-javaagent.jar from the [Official OpenTelemetry Repo](https://github.com/open-telemetry/opentelemetry-java-instrumentation?tab=readme-ov-file#getting-started).
- Place the .jar file in your Spring Boot project's root directory.

2. Configure VM Options
- In your IDE (e.g., IntelliJ), add the following to your Edit Configurations > VM Options

```
-javaagent:opentelemetry-javaagent.jar
-Dotel.exporter.otlp.endpoint=http://localhost:4317
-Dotel.exporter.otlp.protocol=grpc
-Dotel.resource.attributes=service.name=demo-for-signoz1  # Set your service name
-Dotel.logs.exporter=otlp
```

### 2. Run SigNoz via Docker
SigNoz acts as the backend to store and process your OTel data.

1. Start Docker Desktop
2. Clone and Launch SigNoz:

```
# Clone the repository
git clone -b main https://github.com/SigNoz/signoz.git
cd signoz/deploy/docker

# Start SigNoz containers
docker-compose up -d --remove-orphans
```
The SigNoz dashboard will be available at http://localhost:8080.

### 3. Run OTEL_WAILS_DEMO
Once your Spring Boot app and SigNoz are running, launch this dashboard.

1. Clone and Run

```
# Clone this repository
git clone https://github.com/kwak513/OTEL_WAILS_DEMO.git
cd OTEL_WAILS_DEMO

# Run in development mode
wails dev
```

2. Connect
- Copy your SigNoz API Key from [SigNoz API Key Setting Page](http://localhost:8080/settings/api-keys).
- Paste it into the API Key tab of this app to start monitoring.
