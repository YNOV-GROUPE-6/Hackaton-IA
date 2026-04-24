# 🤖 TechCorp AI Chat — Backend Python

## 📋 Description

Ce projet s’inscrit dans le cadre du challenge **TechCorp IA (7h)**.  
L’objectif principal est de déployer un modèle IA spécialisé en finance (**Phi-3.5-Financial**) et de le rendre accessible via une API et une interface web de chat.

---



## 🏗️ Architecture
Frontend (Web)

↓

FastAPI (Backend Python)

↓

Ollama API (ngrok)

↓

Phi-3.5-Financial


---

### 1. Cloner le projet

```bash
git clone https://github.com/YNOV-GROUPE-6/Hackaton-IA
cd Hackaton-IA

python3 -m venv venv
source venv/bin/activate

pip install fastapi uvicorn requests
```


### 2. Lancement du serveur

```
uvicorn app.main:app --reload --port 8000
```

### 3. Accès 

- API : http://localhost:8000
- Documentation interactive : http://localhost:8000/docs


## Endpoints

### POST /chat
Permet d’envoyer un prompt au modèle IA.

**Exemple de requête**

```JSON
{
  "prompt": "Analyse les risques financiers d'une entreprise endettée"
}
```

**Exemple de réponse**

```JSON
{
  "response": "L'entreprise présente un risque élevé lié à..."
}
```


## Configuration du modèle
**Modèle utilisé** : phi3-financial:latest

**Température** : 0.2

**Longueur max** : 512 tokens