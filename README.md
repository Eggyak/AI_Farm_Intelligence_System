# 🌾 Agentic AI Farm Intelligence System

> **Intelligent, Autonomous Multi-Agent System for Modern Farm Management**

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-green.svg)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Agentic--AI--Farm-blue?logo=github)](https://github.com/Vansh-Thakur-Sadyal/Agentic-AI-Farm-Intelligence-System)

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🏗️ Architecture](#️-architecture)
- [🤖 Agents](#-agents)
- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [📂 Project Structure](#-project-structure)
- [⚙️ Configuration](#️-configuration)
- [🔌 API Endpoints](#-api-endpoints)
- [🛠️ Technology Stack](#️-technology-stack)
- [📚 Usage Examples](#-usage-examples)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Overview

**Agentic AI Farm Intelligence System** is a cutting-edge autonomous farm management platform powered by multiple specialized AI agents. It harvests data from diverse sources (sensors, weather APIs, satellite imagery, market data) and intelligently orchestrates them to provide actionable insights for farm management.

### Key Highlights:
- 🌐 **Multi-Source Data Collection** - Sensors, Weather, Imagery, Market Data
- 🔄 **Real-time Data Processing** - Clean, Standardize & Synchronize
- 🧠 **AI-Powered Decision Making** - ML Models for crop recommendations
- 💬 **Natural Language Chat Interface** - Talk to your farm AI
- 📊 **Comprehensive Monitoring** - Track field health & performance
- 🔗 **Plug-and-Play API** - Easy integration with existing systems

---

## 🏗️ Architecture

The system follows a **modular, event-driven architecture** with five specialized agents and a conversational interface:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Dashboard                       │
│              (HTML/CSS/JavaScript Interface)                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Server (FastAPI)                      │
│            /run-agent  /chat  /analyze  endpoints            │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┼──────────────┼──────────────┐
        ▼            ▼            ▼              ▼              ▼
    ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   ┌──────────┐
    │ Agent1 │  │ Agent2 │  │ Agent3 │  │ Agent4 │   │ Agent5   │
    │        │  │        │  │        │  │        │   │          │
    └────────┘  └────────┘  └────────┘  └────────┘   └──────────┘
                                │
                                ▼
                           ┌───────────┐
                           │ Chatbot   │
                           │ (Ollama)  │
                           └───────────┘
                                │
                                ▼
                   ┌──────────────────────────────────┐
                   │    Data & Memory Storage         │
                   │  (JSON, MongoDB, TimeSeries)     │
                   └──────────────────────────────────┘
```

---

## 🤖 Agents

### **Agent 1: Data Ingestion & Standardization** 
`📥 Data Collection Pipeline`

**Purpose:** Collects multi-source farm data and standardizes it into a unified format.

**Data Sources:**
- 🌡️ **IoT Sensors** - Soil moisture, temperature, nutrients
- 🌤️ **Weather APIs** - Real-time & forecast data
- 🛰️ **Satellite/Drone Imagery** - NDVI indices, field health
- 💹 **Market Data** - Crop prices, demand trends

**Processing Pipeline:**
1. **Collection** - Gather data from sensors & APIs
2. **Cleaning** - Handle missing values, remove noise
3. **Standardization** - Convert to unified schema
4. **Synchronization** - Time-align multi-source data
5. **Storage** - Buffer & persist standardized data

**Key Components:**
```
collectors/          # Data collection modules
├── sensor_collector.py
├── weather_collector.py
├── image_collector.py
└── market_collector.py

processors/          # Data processing modules
├── cleaning.py
├── standardization.py
├── synchronization.py
└── reliability.py

storage/            # Data persistence
├── json_storage.py
├── mongodb_storage.py
└── buffer.py
```

**Output Schema:**
```json
{
  "timestamp": "2026-04-02T10:00:00",
  "location": "field_12",
  "soil_moisture": 23.4,
  "soil_nitrogen": 45.2,
  "temperature": 31.5,
  "humidity": 68,
  "rain_forecast": 0.6,
  "ndvi_index": 0.72,
  "reliability_score": 0.95
}
```

---

### **Agent 2: ML Crop Analytics & Recommendation**
`🌾 Machine Learning Intelligence`

**Purpose:** Analyzes field conditions and provides crop-specific recommendations using trained ML models.

**Capabilities:**
- 🌾 **Crop Recommendation** - Suitable crops based on soil & climate
- 🦠 **Disease Detection** - Identify crop diseases from images
- 🎯 **Yield Prediction** - Forecast crop yield
- 📊 **Quality Assessment** - Predict produce quality

**Supported Crops:**
- 🌾 **Rice** - With disease detection for bacterial leaf blight, brown spot, leaf smut
- 🌳 **Cotton** - Cotton disease classification (diseased/fresh leaves & plants)
- 🌽 **Wheat**
- 🍬 **Sugarcane**

**Disease Detection Models:**
```
Cotton Disease Classification:
├── Diseased Cotton Leaf
├── Diseased Cotton Plant
├── Fresh Cotton Leaf
└── Fresh Cotton Plant

Rice Leaf Disease Classification:
├── Bacterial Leaf Blight
├── Brown Spot
└── Leaf Smut
```

**ML Models:**
- Decision Trees, Random Forests, Neural Networks
- Convolutional Neural Networks (CNN) for image classification
- Time-series forecasting for yield prediction

---

### **Agent 3: True Agentic Decision Engine**
`🧠 Core Planning & Strategy Agent`

**Purpose:** Produces autonomous farming strategies, optimizes resource allocation, and creates actionable plans.

**Capabilities:**
- 🧠 LLM-driven decision-making
- 📋 Strategy selection for cost, yield, and risk
- 💰 Budget planning and water usage forecasting
- ⚖️ Priority balancing between yield and sustainability
- 🔁 Integration with execution and monitoring agents

---

### **Agent 4: Intelligent Monitoring & LLM Core**
`📡 System Health & Risk Monitoring`

**Purpose:** Continuously monitors farm conditions, evaluates risks, and provides intelligent feedback using LLM analysis.

**Responsibilities:**
- 🔍 Assess sensor and weather data
- 🚨 Detect water stress, heat stress, and environmental risks
- 📈 Track trend performance over time
- 🧠 Generate practical monitoring recommendations
- 🔄 Escalate or adjust plans when needed

---

### **Agent 5: Memory & Learning Agent**
`🧠 Adaptive Memory System`

**Purpose:** Stores historical runs, learns from past performance, and improves future recommendations.

**Capabilities:**
- 💾 Save the last 50 system runs as memory
- 📚 Learn from historical patterns using Ollama
- 💡 Generate optimization insights and improvement suggestions
- 🔄 Feed learning back into the planning pipeline

---

### **💬 Chatbot Interface** 
`🤖 Natural Language Interaction`

**Purpose:** Provides a conversational interface for farmers to interact with the system.

**Features:**
- 🗣️ Natural language queries in local languages
- 📝 Ask questions about field conditions
- 💡 Get recommendations in plain English
- 📊 Request data summaries
- 🆘 Troubleshooting & support

**Powered by:** Ollama (Local LLM)

**Sample Queries:**
- "Should I irrigate today?"
- "What's the disease detected in my field?"
- "Recommend the best crop for my soil"
- "How much fertilizer do I need?"
- "What's the weather forecast?"

---

## ✨ Features

### 🔄 **Data Pipeline**
- ✅ Real-time data ingestion from multiple sources
- ✅ Automatic data cleaning & validation
- ✅ Unified data standardization
- ✅ Time-series synchronization
- ✅ Reliability scoring for data quality

### 🤖 **AI & Machine Learning**
- ✅ Crop recommendation engine
- ✅ Disease detection from imagery
- ✅ Yield prediction models
- ✅ Autonomous decision making
- ✅ Adaptive learning from feedback

### 🌐 **Connectivity**
- ✅ RESTful API endpoints
- ✅ WebSocket support for real-time updates
- ✅ MQTT integration for IoT sensors
- ✅ Low-connectivity offline mode
- ✅ Cloud & edge deployment support

### 📊 **Monitoring & Analytics**
- ✅ Real-time dashboard
- ✅ Historical data analysis
- ✅ Performance metrics
- ✅ Anomaly detection
- ✅ Trend analysis

### 💬 **User Interaction**
- ✅ Natural language chatbot
- ✅ Conversational AI
- ✅ Multi-language support ready
- ✅ Mobile-friendly interface

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip or conda
- Virtual environment tools

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Vansh-Thakur-Sadyal/Agentic-AI-Farm-Intelligence-System.git
cd Agentic-AI-Farm-Intelligence-System
```

### 2️⃣ Create Virtual Environment
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 3️⃣ Install Dependencies
```bash
# Install backend dependencies
pip install -r backend/agents/agent1/requirements.txt

# Install Ollama for chatbot (optional)
# Follow: https://ollama.ai
ollama pull llama2
```

### 4️⃣ Start API Server
```bash
cd backend
python -m uvicorn api.server:app --reload --host 0.0.0.0 --port 8000
```

### 5️⃣ Open Dashboard
```bash
# Open in browser
http://localhost:8000/docs            # API documentation
http://localhost:3000                 # Frontend dashboard
```

---

## 📦 Installation

### Full Setup Guide

#### **Step 1: System Requirements**
```bash
# Windows
python --version  # Should be 3.8+
pip --version

# macOS/Linux
python3 --version
pip3 --version
```

#### **Step 2: Clone & Navigate**
```bash
git clone https://github.com/Vansh-Thakur-Sadyal/Agentic-AI-Farm-Intelligence-System.git
cd Agentic-AI-Farm-Intelligence-System
```

#### **Step 3: Setup Virtual Environment**
```bash
# Create virtual environment
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

#### **Step 4: Install Dependencies**
```bash
# Agent 1 - Data Ingestion
cd backend/agents/agent1
pip install -r requirements.txt

# Return to root
cd ../../../
```

#### **Step 5: Configure Environment**
```bash
# Create .env file
cp .env.example .env

# Edit .env with your settings
# API_HOST=0.0.0.0
# API_PORT=8000
# MONGODB_URI=mongodb://localhost:27017
```

#### **Step 6: Run Agents**
```bash
# Terminal 1 - Start API Server
python -m uvicorn backend.api.server:app --reload

# Terminal 2 - Start Agent 1
python backend/agents/agent1/main.py

# Terminal 3 - Start Agent 3
python backend/agents/agent3/main.py
```

#### **Step 7: Access Dashboard**
```
API Docs:  http://localhost:8000/docs
Frontend:  http://localhost:3000
```

---

## 📂 Project Structure

```
Agentic-AI-Farm-Intelligence-System/
├── backend/
│   ├── agents/
│   │   ├── agent1/                    # Data Ingestion Agent
│   │   │   ├── main.py
│   │   │   ├── collectors/            # Data collection modules
│   │   │   ├── processors/            # Data processing modules
│   │   │   ├── storage/               # Data storage handlers
│   │   │   ├── config/                # Configuration files
│   │   │   ├── utils/                 # Utilities & logging
│   │   │   ├── tests/                 # Unit tests
│   │   │   ├── api/                   # REST endpoints
│   │   │   └── requirements.txt
│   │   │
│   │   ├── agent2/                    # ML Analytics Agent
│   │   │   ├── app.py
│   │   │   ├── Dataset/               # Training datasets
│   │   │   │   ├── Crop_recommendation.csv
│   │   │   │   ├── Cotton Disease/    # Cotton disease images
│   │   │   │   └── rice_leaf_diseases/# Rice disease images
│   │   │   └── requirements.txt
│   │   │
│   │   ├── agent3/                    # Decision & Planning Agent
│   │   │   ├── memory_agent.py        # Memory management
│   │   │   ├── executor/              # Execution engine
│   │   │   │   ├── executor_agent.py
│   │   │   │   ├── farm_agent.py
│   │   │   │   ├── tools/             # Farm management tools
│   │   │   │   └── agents/
│   │   │   ├── planner/               # Planning engine
│   │   │   │   ├── agent.py
│   │   │   │   └── data_adapters.py
│   │   │   ├── monitoring/            # Monitoring agent
│   │   │   │   ├── feedback_agent.py
│   │   │   │   └── monitoring_api.py
│   │   │   ├── shared/                # Shared utilities
│   │   │   └── orchestrator/          # Orchestration logic
│   │   │
│   │   └── orchestrator.py            # Agent coordination
│   │
│   ├── api/
│   │   └── server.py                  # FastAPI server
│   │
│   └── logs/                          # System logs
│
├── frontend/
│   ├── index.html                     # Main dashboard
│   ├── index.js
│   ├── index.css
│   ├── dashboard2.html
│   ├── dashboard2.js
│   └── dashboard2.css
│
├── .gitignore
├── README.md                          # This file
└── requirements.txt                   # All dependencies
```

---

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# Database
MONGODB_URI=mongodb://localhost:27017/farm_ai
INFLUXDB_URL=http://localhost:8086

# Data Collection
WEATHER_API_KEY=your_api_key
MARKET_API_ENDPOINT=https://api.example.com

# Ollama (Chatbot)
OLLAMA_MODEL=llama2
OLLAMA_ENDPOINT=http://localhost:11434

# MQTT (IoT Sensors)
MQTT_BROKER=mqtt.broker.com
MQTT_PORT=1883
MQTT_TOPIC=farm/sensors/#
```

### Configuration Files

**Agent 1 Config** (`backend/agents/agent1/config/settings.py`):
```python
DATA_COLLECTION_INTERVAL = 300  # seconds
STANDARDIZATION_ENABLED = True
SYNC_TOLERANCE = 60  # seconds
RELIABILITY_THRESHOLD = 0.8
```

**Agent 3 Config** (`backend/agents/agent3/shared/schemas.py`):
```python
PLANNING_HORIZON = 30  # days
EXECUTION_TIMEOUT = 3600  # seconds
FEEDBACK_WINDOW = 7  # days
```

---

## 🔌 API Endpoints

### Core Endpoints

#### **1. Run Pipeline**
```
POST /run-agent
Content-Type: application/json

Request:
{
  "query": "Analyze field conditions",
  "agent1": {
    "field_id": "field_12"
  },
  "agent2": {
    "analyze_disease": true
  },
  "agent3": {
    "generate_plan": true
  }
}

Response:
{
  "status": "success",
  "pipeline_output": {
    "agent1_data": {...},
    "agent2_analysis": {...},
    "agent3_plan": {...}
  }
}
```

#### **2. Chat Interface**
```
POST /chat
Content-Type: application/json

Request:
{
  "message": "Should I irrigate my field today?"
}

Response:
{
  "status": "success",
  "response": "Yes, based on current soil moisture of 23.4%, irrigation is recommended..."
}
```

#### **3. Get Field Data**
```
GET /data/field/{field_id}?days=7

Response:
{
  "field_id": "field_12",
  "data_points": [
    {
      "timestamp": "2026-04-02T10:00",
      "soil_moisture": 23.4,
      "temperature": 31.5,
      ...
    }
  ]
}
```

#### **4. Get Recommendations**
```
GET /recommendations/field/{field_id}?type=crop

Response:
{
  "recommendations": [
    {
      "crop": "Rice",
      "confidence": 0.92,
      "reasoning": "Soil conditions are suitable..."
    }
  ]
}
```

#### **5. Get Disease Analysis**
```
POST /analyze/disease
Content-Type: multipart/form-data

File: image.jpg

Response:
{
  "disease_detected": "Leaf Blight",
  "confidence": 0.87,
  "severity": "moderate",
  "recommendations": [...]
}
```

### Full API Documentation
Visit: `http://localhost:8000/docs` (Swagger UI)

---

## 🛠️ Technology Stack

### Backend
- **Framework:** FastAPI 0.111+
- **Server:** Uvicorn
- **Python:** 3.8+
- **Async:** AsyncIO

### Data & Storage
- **Primary:** JSON
- **Database:** MongoDB (optional)
- **Time-Series:** InfluxDB (optional)
- **Processing:** Pandas, NumPy

### AI & ML
- **Local LLM:** Ollama (Llama2)
- **Image Processing:** OpenCV, Pillow
- **ML Models:** Scikit-learn, TensorFlow/Keras

### IoT & Communication
- **MQTT:** Paho-MQTT (sensor integration)
- **HTTP:** Requests
- **Async HTTP:** aiohttp

### Frontend
- **HTML5/CSS3/JavaScript**
- **Interactive Dashboard**
- **Real-time Updates**

---

## 📚 Usage Examples

### Example 1: Collect & Analyze Field Data
```python
from backend.agents.agent1.main import Agent1

# Initialize Agent 1
agent = Agent1()

# Collect field data
field_data = agent.collect_data(field_id="field_12")

# Process & standardize
standardized_data = agent.process_data(field_data)

# Get reliability score
print(f"Data Quality: {standardized_data['reliability_score']}")
```

### Example 2: Get Crop Recommendation
```python
from backend.agents.agent2.app import Agent2

agent2 = Agent2()

# Analyze field conditions
field_conditions = {
    "soil_moisture": 23.4,
    "soil_nitrogen": 45,
    "temperature": 31.5,
    "pH": 6.8
}

# Get recommendations
recommendations = agent2.recommend_crop(field_conditions)
for rec in recommendations:
    print(f"{rec['crop']}: {rec['confidence']*100:.1f}% confidence")
```

### Example 3: Create & Execute Plan
```python
from backend.agents.agent3.planner.agent import PlannerAgent

planner = PlannerAgent()

# Create management plan
plan = planner.create_plan(
    field_id="field_12",
    horizon_days=30,
    objectives=["maximize_yield", "reduce_water"]
)

# Execute plan
results = planner.execute_plan(plan)
print(f"Plan Status: {results['status']}")
```

### Example 4: Chat with Chatbot
```python
import requests

response = requests.post("http://localhost:8000/chat", json={
    "message": "What's the nitrogen level in my soil?"
})

print(response.json()["response"])
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository
```bash
git clone https://github.com/YOUR_USERNAME/Agentic-AI-Farm-Intelligence-System.git
```

### 2. Create Feature Branch
```bash
git checkout -b feature/amazing-feature
```

### 3. Make Changes
```bash
# Make your changes
git add .
git commit -m "Add amazing feature"
```

### 4. Push to Branch
```bash
git push origin feature/amazing-feature
```

### 5. Open Pull Request
- Describe your changes clearly
- Reference any related issues
- Include test cases if applicable

### Contribution Guidelines
- Follow PEP 8 for Python code
- Add unit tests for new features
- Update documentation
- Keep commits atomic and descriptive

---

## 📝 Code of Conduct

This project adheres to the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

---

## 🐛 Bug Reports & Feature Requests

- **Report Bugs:** [GitHub Issues](https://github.com/Vansh-Thakur-Sadyal/Agentic-AI-Farm-Intelligence-System/issues)
- **Feature Requests:** [GitHub Discussions](https://github.com/Vansh-Thakur-Sadyal/Agentic-AI-Farm-Intelligence-System/discussions)

---

## 📞 Support & Contact

- 📧 **Email:** support@farmaintelligence.com
- 🐦 **Twitter:** [@FarmAI](https://twitter.com)
- 💬 **Discord:** [Join Community](https://discord.gg)
- 📖 **Documentation:** [Full Docs](https://docs.farmaintelligence.com)

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Ollama Documentation](https://ollama.ai)
- [MongoDB Guide](https://docs.mongodb.com/)
- [IoT Sensor Integration](https://mqtt.org/)
- [Machine Learning Models](https://scikit-learn.org/)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### You are free to:
- ✅ Use the software for any purpose
- ✅ Modify and distribute
- ✅ Include in commercial projects
- ✅ Include in private use

### Requirements:
- 📋 Include license and copyright notice
- 📝 Provide notice of modifications

---

## 🙌 Acknowledgments

- 🌾 All farmers and agricultural experts who provided feedback
- 🤖 AI/ML communities and open-source projects
- 🔧 Open-source developers and contributors
- 🚀 FastAPI, Ollama, and the Python community

---

## 🎯 Roadmap

### 🔜 Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Drone integration with real-time imagery
- [ ] Advanced AR features for field visualization
- [ ] Multi-language chatbot support
- [ ] Blockchain for supply chain tracking
- [ ] IoT device marketplace
- [ ] Advanced predictive analytics
- [ ] Integration with agricultural markets
- [ ] Government subsidy recommendation engine

### 📅 Version History
- **v1.0** - Initial release with 5 agents and chatbot
- **v1.1** - Added disease detection models


---

## 🌟 Star ⭐ & Follow us!

If you find this project helpful, please consider giving us a star and sharing with your network!

[![GitHub Stars](https://img.shields.io/github/stars/Vansh-Thakur-Sadyal/Agentic-AI-Farm-Intelligence-System?style=social)](https://github.com/Vansh-Thakur-Sadyal/Agentic-AI-Farm-Intelligence-System)

---

<div align="center">

### Made with ❤️ for sustainable agriculture

🌍 **Together, we can revolutionize farming!** 🌾

</div>
