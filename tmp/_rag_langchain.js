const { ChromaClient } = require('chromadb');
//const { NomicEmbedText } = require('@nomic-ai/nomic-embed-text');
//const { NomicEmbedText } = require('@nomic-ai/atlas');
const ollama = require('ollama');

// 初始化 ChromaDB 客戶端
const chromaClient = new ChromaClient('http://localhost:8000');

// 初始化 Nomic Embedding Model
//const embedder = new NomicEmbedText();

// 初始化 Ollama 客戶端
const ollamaClient = ollama.createClient('http://localhost:11434');

