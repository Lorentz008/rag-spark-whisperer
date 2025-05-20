
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PythonCodeExplainer: React.FC = () => {
  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-lg">RAG Implementation</CardTitle>
      </CardHeader>
      <CardContent className="px-2 py-0">
        <Tabs defaultValue="data-loading">
          <TabsList className="w-full">
            <TabsTrigger value="data-loading" className="flex-1 text-xs">Data Loading</TabsTrigger>
            <TabsTrigger value="langchain" className="flex-1 text-xs">LangChain</TabsTrigger>
            <TabsTrigger value="chatbot" className="flex-1 text-xs">Chatbot</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data-loading" className="mt-2">
            <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-auto max-h-[200px]">
              <pre>
                <code>{`
# Data loading example with Python
import pandas as pd
from langchain.document_loaders import (
    CSVLoader,
    PyPDFLoader,
    TextLoader
)

# Load CSV data
def load_csv(file_path):
    loader = CSVLoader(file_path)
    documents = loader.load()
    return documents

# Load PDF data
def load_pdf(file_path):
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    return documents

# Load text data
def load_text(file_path):
    loader = TextLoader(file_path)
    documents = loader.load()
    return documents

# Load multiple document types
def load_documents(file_paths):
    documents = []
    for file_path in file_paths:
        if file_path.endswith('.csv'):
            docs = load_csv(file_path)
        elif file_path.endswith('.pdf'):
            docs = load_pdf(file_path)
        elif file_path.endswith('.txt'):
            docs = load_text(file_path)
        documents.extend(docs)
    return documents
                `}</code>
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="langchain" className="mt-2">
            <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-auto max-h-[200px]">
              <pre>
                <code>{`
# RAG with LangChain setup
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI

# Split documents into chunks
def split_documents(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100
    )
    chunks = text_splitter.split_documents(documents)
    return chunks

# Create vector store
def create_vector_store(chunks):
    embeddings = OpenAIEmbeddings()
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings
    )
    return vector_store

# Set up RAG chain
def setup_rag_chain(vector_store):
    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3}
    )
    
    llm = OpenAI(temperature=0)
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )
    
    return qa_chain
                `}</code>
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="chatbot" className="mt-2">
            <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-auto max-h-[200px]">
              <pre>
                <code>{`
# Building the chatbot
import os
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.chat_models import ChatOpenAI

class RAGChatbot:
    def __init__(self, vector_store):
        self.vector_store = vector_store
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        self.chatbot = self._create_chatbot()
    
    def _create_chatbot(self):
        llm = ChatOpenAI(temperature=0.2)
        
        chatbot = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=self.vector_store.as_retriever(),
            memory=self.memory
        )
        
        return chatbot
    
    def ask(self, question):
        response = self.chatbot.run(question)
        return response

# Using the chatbot
documents = load_documents(["data.pdf", "info.csv"])
chunks = split_documents(documents)
vector_store = create_vector_store(chunks)
chatbot = RAGChatbot(vector_store)

response = chatbot.ask("What is RAG?")
print(response)
                `}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PythonCodeExplainer;
