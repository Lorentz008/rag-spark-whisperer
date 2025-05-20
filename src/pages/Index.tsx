
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Bot, UploadCloud, Database, FileText } from "lucide-react";
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-rag-blue" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">RAG Chatbot</h1>
              <p className="text-sm text-gray-500">Powered by LangChain and Python</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              <Database className="h-3 w-3" />
              <span>Docs: {uploadedDocuments.length}</span>
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1"
            >
              <UploadCloud className="h-4 w-4" />
              Upload Documents
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Chat area */}
          <Card className="col-span-1 lg:col-span-3 flex flex-col h-[calc(100vh-12rem)]">
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-xl">Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden">
              <ScrollArea className="h-full p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <ChatMessage 
                      key={message.id} 
                      message={message.content} 
                      isBot={message.isBot} 
                      timestamp={message.timestamp}
                    />
                  ))}
                  {isLoading && (
                    <div className="flex items-start space-x-4 animate-pulse pl-2">
                      <div className="bg-rag-blue rounded-full h-8 w-8 flex items-center justify-center text-white">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="flex-1 pt-1">
                        <LoadingDots />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <div className="flex items-center w-full space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask a question..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={input.trim() === "" || isLoading}
                  className="bg-rag-blue hover:bg-rag-dark-blue"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Info sidebar */}
          <div className="col-span-1 space-y-6">
            <Card>
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-lg">Documents</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-2">
                {uploadedDocuments.length === 0 ? (
                  <p className="text-sm text-gray-500">No documents uploaded yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {uploadedDocuments.map((doc, index) => (
                      <li key={index} className="flex items-center text-sm gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{doc}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter className="px-6 py-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setShowUploadModal(true)}
                >
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-lg">About this Project</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-2">
                <p className="text-sm text-gray-600 mb-4">
                  This is a RAG (Retrieval-Augmented Generation) chatbot built with:
                </p>
                <div className="space-y-2">
                  {["Python", "LangChain", "React", "Tailwind CSS"].map((tech, i) => (
                    <Badge key={i} variant="secondary" className="mr-2 mb-2">
                      {tech}
                    </Badge>
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
