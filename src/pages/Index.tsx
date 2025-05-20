
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Bot, UploadCloud, Database, FileText, ChevronRight, Search, X, Info, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ChatMessage from "@/components/ChatMessage";
import UploadDocumentModal from "@/components/UploadDocumentModal";
import LoadingDots from "@/components/LoadingDots";
import PythonCodeExplainer from "@/components/PythonCodeExplainer";

// Message type definition
type Message = {
  id: number;
  content: string;
  isBot: boolean;
  timestamp: Date;
};

const Index = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      content: "Hello! I'm your RAG-powered chatbot. I can answer questions based on the uploaded documents. Try uploading some documents and ask me about their content.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const { toast } = useToast();
  const [showInfo, setShowInfo] = useState(false);

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    
    const newUserMessage: Message = {
      id: messages.length,
      content: input,
      isBot: false,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate a response from the RAG system
    setTimeout(() => {
      // In a real application, this would be replaced with an actual API call to the backend
      const botResponses: { [key: string]: string } = {
        "What is RAG?": "RAG (Retrieval-Augmented Generation) is a technique that enhances large language models by retrieving relevant information from external knowledge sources before generating a response. This allows the model to provide more accurate, up-to-date, and contextually relevant answers.",
        "How does LangChain work?": "LangChain is a framework designed to simplify the development of applications using large language models. It provides a standard interface for chains, lots of integrations with other tools, and end-to-end chains for common applications. LangChain helps developers build applications that are context-aware and can reason about their specific data.",
        "What is Python?": "Python is a high-level, interpreted programming language known for its readability and simplicity. It supports multiple programming paradigms and has a comprehensive standard library. Python is widely used in various domains including web development, data analysis, artificial intelligence, scientific computing, and automation.",
      };
      
      let botResponse: string;
      if (botResponses[input.trim()]) {
        botResponse = botResponses[input.trim()];
      } else if (uploadedDocuments.length === 0) {
        botResponse = "I don't have any documents in my knowledge base yet. Please upload some documents so I can provide better answers.";
      } else {
        botResponse = "Based on the documents you've uploaded, I would analyze the content and provide a contextually relevant answer. In a real implementation, this would use a RAG pipeline to retrieve relevant information from the documents and generate a response.";
      }
      
      const newBotMessage: Message = {
        id: messages.length + 1,
        content: botResponse,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, newBotMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (files: File[]) => {
    setIsUploading(true);
    
    // Simulate file processing
    setTimeout(() => {
      const newDocuments = files.map(file => file.name);
      setUploadedDocuments(prev => [...prev, ...newDocuments]);
      setIsUploading(false);
      setShowUploadModal(false);
      
      toast({
        title: "Documents uploaded successfully",
        description: `${files.length} document(s) have been added to the knowledge base.`,
      });
      
      // Add a system message about the upload
      const uploadMessage: Message = {
        id: messages.length,
        content: `${files.length} document(s) have been uploaded and processed. You can now ask questions about their content.`,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, uploadMessage]);
    }, 2000);
  };

  const clearChat = () => {
    toast({
      title: "Chat cleared",
      description: "All messages have been removed from the conversation.",
    });
    
    setMessages([
      {
        id: 0,
        content: "Hello! I'm your RAG-powered chatbot. I can answer questions based on the uploaded documents. Try uploading some documents and ask me about their content.",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-rag-blue to-rag-dark-blue p-2 rounded-lg shadow-md">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rag-dark-blue to-rag-blue bg-clip-text text-transparent">SmartRAG</h1>
              <p className="text-sm text-gray-600">Advanced Document Intelligence</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 border-rag-blue/30 bg-rag-blue/5 text-rag-blue">
              <Database className="h-3.5 w-3.5" />
              <span className="font-medium">Documents: {uploadedDocuments.length}</span>
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 border-rag-blue/30 bg-rag-blue/5 text-rag-blue hover:bg-rag-blue/10 hover:text-rag-dark-blue"
            >
              <UploadCloud className="h-4 w-4" />
              Upload Documents
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
              className="text-gray-500 hover:text-rag-blue"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Info panel - conditionally shown */}
      {showInfo && (
        <div className="bg-white border-b border-gray-200 py-3 px-6 shadow-inner animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Sparkles className="h-5 w-5 text-rag-blue mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">How to use this RAG-powered chatbot</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    1. Upload documents using the "Upload Documents" button<br />
                    2. Ask questions about the content of your documents<br />
                    3. The system will retrieve relevant information and generate answers
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowInfo(false)} className="text-gray-500">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Chat area */}
          <Card className="col-span-1 lg:col-span-3 flex flex-col h-[calc(100vh-12rem)] border-0 shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="px-6 py-4 border-b bg-white flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center">
                <span className="bg-gradient-to-r from-rag-dark-blue to-rag-blue bg-clip-text text-transparent">Interactive Chat</span>
                <Badge variant="outline" className="ml-3 px-2 py-0.5 text-xs bg-green-50 text-green-600 border-green-200">
                  Active
                </Badge>
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearChat}
                className="text-gray-500 hover:text-red-500"
              >
                Clear chat
              </Button>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden">
              <ScrollArea className="h-full p-6 bg-gray-50">
                <div className="space-y-2">
                  {messages.map((message) => (
                    <ChatMessage 
                      key={message.id} 
                      message={message.content} 
                      isBot={message.isBot} 
                      timestamp={message.timestamp}
                    />
                  ))}
                  {isLoading && (
                    <div className="flex items-start space-x-4 animate-pulse pl-2 mt-6">
                      <div className="bg-gradient-to-br from-rag-blue to-rag-dark-blue rounded-full h-10 w-10 flex items-center justify-center text-white shadow-md">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="flex-1 pt-3">
                        <LoadingDots />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t bg-white">
              <div className="flex items-center w-full space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask a question about your documents..."
                  className="flex-1 border-gray-300 focus:border-rag-blue focus:ring-rag-blue/30 shadow-sm"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={input.trim() === "" || isLoading}
                  className="bg-gradient-to-r from-rag-blue to-rag-dark-blue hover:from-rag-dark-blue hover:to-rag-dark-blue shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <Send className="h-4 w-4 mr-1" />
                  <span>Send</span>
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Info sidebar */}
          <div className="col-span-1 space-y-6">
            <Card className="border-0 shadow-lg overflow-hidden rounded-xl">
              <CardHeader className="px-6 py-4 bg-gradient-to-r from-rag-blue to-rag-dark-blue">
                <CardTitle className="text-lg text-white">Knowledge Base</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4">
                {uploadedDocuments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-3">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mb-2">No documents uploaded yet.</p>
                    <p className="text-xs text-gray-400">Upload documents to enable SmartRAG answers</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {uploadedDocuments.map((doc, index) => (
                      <li key={index} className="flex items-center text-sm gap-2 p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                        <FileText className="h-4 w-4 text-rag-blue" />
                        <span className="truncate flex-1">{doc}</span>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                          Indexed
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter className="px-6 py-4 bg-gray-50 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-rag-blue/30 hover:bg-rag-blue/10 text-rag-blue flex items-center gap-2 group"
                  onClick={() => setShowUploadModal(true)}
                >
                  <UploadCloud className="h-4 w-4 group-hover:animate-bounce" />
                  Upload Documents
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-lg overflow-hidden rounded-xl">
              <CardHeader className="px-6 py-4 bg-gradient-to-r from-rag-blue to-rag-dark-blue">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Quick Search
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4">
                <div className="space-y-3">
                  {["What is RAG?", "How does LangChain work?", "What is Python?"].map((question, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        setInput(question);
                      }} 
                      className="w-full text-left p-3 rounded-md border border-gray-200 text-sm font-medium hover:bg-gray-50 hover:border-rag-blue/30 transition-all flex items-center justify-between group"
                    >
                      <span className="text-gray-700">{question}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-rag-blue group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg overflow-hidden rounded-xl">
              <CardHeader className="px-6 py-4 bg-gradient-to-r from-rag-blue to-rag-dark-blue">
                <CardTitle className="text-lg text-white">About SmartRAG</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4">
                <p className="text-sm text-gray-600 mb-4">
                  SmartRAG is an advanced Retrieval-Augmented Generation system that provides intelligent document analysis:
                </p>
                <div className="space-y-3">
                  {[
                    { name: "Python", color: "bg-blue-100 text-blue-800 border-blue-200" },
                    { name: "LangChain", color: "bg-green-100 text-green-800 border-green-200" },
                    { name: "Vector DB", color: "bg-amber-100 text-amber-800 border-amber-200" },
                    { name: "React", color: "bg-purple-100 text-purple-800 border-purple-200" },
                    { name: "Tailwind CSS", color: "bg-sky-100 text-sky-800 border-sky-200" }
                  ].map((tech, i) => (
                    <div key={i} className="flex items-center gap-2 group">
                      <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-rag-blue transition-colors" />
                      <Badge variant="outline" className={`${tech.color} group-hover:scale-105 transition-transform`}>
                        {tech.name}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <p className="text-sm text-gray-600">
                  Upload documents to create a knowledge base and ask questions to get contextually relevant answers.
                </p>
              </CardContent>
            </Card>

            <PythonCodeExplainer />
          </div>
        </div>
      </main>

      {/* Upload document modal */}
      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
        isUploading={isUploading}
      />
    </div>
  );
};

export default Index;
