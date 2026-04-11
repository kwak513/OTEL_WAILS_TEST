# OpenTelemetry (OTEL) Monitoring System Demo

## Introduction
이 프로그램은 3가지 주요 pillar인 metrics, traces, logs를 각 탭에서 모니터링하는 앱입니다.

## 👥 Developer

| Name   | Role         |
|--------|--------------|
| Chaeyeon Kwak | Full-stack development |

## 🛠 Tech Stack

- **Frontend**: React, TypeScript  
- **Backend**: Golang


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
### SigNoz API 연동
- SigNoz의 metrics, traces, logs 목록 조회 API를 연동합니다.

### Metrics, Traces, Logs 조회
- Metrics: metrics명, description, type 등을 테이블 형식으로 표시합니다.
- Traces: trace명, service name, timestamp, duration 등을 테이블 형식으로 표시합니다. 
- Logs: service name, timestamp, severity level, body 내용을 표시합니다.

## 🚀 Getting Started (Local Execution)