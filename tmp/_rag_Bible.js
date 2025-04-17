import fs from 'fs';
import { Ollama } from 'ollama';
import { ChromaClient } from 'chromadb';
//import { embed } from '@nomic-ai/nomic-embed-text';
//import { embed } from '@nomic-ai/atlas';
//import { embed } from "@langchain/nomic";

const ollama = new Ollama();
const chroma = new ChromaClient();
const COLLECTION_NAME = 'rag_data';

// 初始化 ChromaDB 集合
async function initChroma() {
    const collections = await chroma.listCollections();
    if (!collections.includes(COLLECTION_NAME)) {
        await chroma.createCollection(COLLECTION_NAME);
    }
}

/*
// 讀取並處理文字檔案
async function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const sentences = content.split('\n').filter(line => line.trim());

    const embeddings = await embed(sentences);

    const collection = await chroma.getCollection(COLLECTION_NAME);
    await collection.add({
        ids: sentences.map((_, i) => `doc-${i}`),
        embeddings,
        metadatas: sentences.map(text => ({ text }))
    });

    console.log('資料已存入 ChromaDB');
}

// 查詢 RAG
async function queryRAG(question) {
    const questionEmbedding = await embed([question]);
    const collection = await chroma.getCollection(COLLECTION_NAME);

    const results = await collection.query({
        queryEmbeddings: questionEmbedding[0],
        nResults: 3
    });

    const context = results.metadatas.flatMap(meta => meta.text).join('\n');

    const response = await ollama.chat({
        model: 'qwen2.5:3b',
        messages: [
            { role: 'system', content: '你是一個知識豐富的 AI 助手。' },
            { role: 'user', content: `請根據以下內容回答問題：\n${context}\n\n問題：${question}` }
        ]
    });

    console.log('回答:', response.message.content);
}
*/

// 主流程
(async () => {
    await initChroma();
    //await processFile('bible.txt'); // 載入一次資料
    //await queryRAG('這段內容主要在講什麼？'); // 測試查詢
})();
