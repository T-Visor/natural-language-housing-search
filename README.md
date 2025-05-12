# 🏡 Real Estate Search App

![Homepage Screenshot](./housing-search-screenshot.png)

This is a full-stack real estate search application that integrates **natural language search** using LLM inference via **Ollama**, fast filtering via **Elasticsearch**, and a modern **Next.js** frontend. It allows users to explore homes for sale with a seamless and intuitive interface.

## 🚀 Features

* 🌐 Search for homes using natural language
* ⚡️ Fast, faceted filtering with Elasticsearch
* 🧠 Local LLM inference using Ollama
* 🗺️ Interactive frontend using React/Next.js
* 🐳 Docker-ready setup for Ollama and Elasticsearch

---

## 🧱 Prerequisites

Ensure the following are installed:

* **Docker** (for running Ollama and Elasticsearch locally)
* **Python 3.9+**
* **Node.js 18+**
* **npm** or **yarn**

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/real-estate-search-app.git
cd real-estate-search-app
```

---

### 2. Start Local Services (Elasticsearch & Ollama)

You can use Docker to run both services locally:

#### Start Elasticsearch

```bash
docker run -d --name es -p 9200:9200 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:8.11.3
```

#### Start Ollama and Download Model

```bash
docker run -d --name ollama -p 11434:11434 ollama/ollama
```

Once running:

```bash
ollama pull llama3.1:8b-instruct-q3_K_S
```

> 💡 Make sure port `11434` is available and not blocked by firewall or VPN.

---

### 3. Download Dataset

Download the dataset from Kaggle and place it in the following path:

* [Kaggle Dataset](https://www.kaggle.com/datasets/polartech/500000-us-homes-data-for-sale-properties?resource=download)
* Rename and move the file to:
  `backend/data/input_file.csv`

---

### 4. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

### 5. Load Data into Elasticsearch

```bash
python real_estate_bulk_builder.py
```

This script parses the dataset and indexes it into Elasticsearch.

---

### 6. Build and Start Frontend

```bash
cd ..
npm install
npm run build
npm run start
```

---

## 🌐 Access the App

Open your browser and visit:

```
http://localhost:3000
```

---

## 📄 License

This project is released under the [MIT License](LICENSE).

---

## Acknowledgements

* Dataset by [Polartech on Kaggle](https://www.kaggle.com/datasets/polartech/500000-us-homes-data-for-sale-properties)
* Ollama for local LLM inference
* Elasticsearch for powerful search capabilities
