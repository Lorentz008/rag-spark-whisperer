
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Upload, XCircle, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  isUploading: boolean;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isUploading,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (fileName: string) => {
    setSelectedFiles(selectedFiles.filter(file => file.name !== fileName));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }

    onUpload(selectedFiles);
  };
  
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    switch(ext) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'txt':
        return <FileText className="h-4 w-4 text-gray-500" />;
      case 'csv':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'json':
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isUploading && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Upload Documents</DialogTitle>
        </DialogHeader>
        
        <div 
          className={`
            mt-4 border-2 border-dashed rounded-lg p-8 text-center transition-all
            ${isDragging ? 'border-rag-blue bg-rag-blue/5' : 'border-gray-300'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={`mx-auto h-16 w-16 rounded-full ${isDragging ? 'bg-rag-blue/10' : 'bg-gray-100'} flex items-center justify-center mb-4`}>
            <Upload className={`h-8 w-8 ${isDragging ? 'text-rag-blue' : 'text-gray-400'}`} />
          </div>
          <p className="mt-2 text-sm font-medium text-gray-900">
            {isDragging ? 'Drop files here' : 'Drag and drop files here'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supports: TXT, PDF, DOCX, CSV, JSON (Max 10MB)
          </p>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept=".txt,.pdf,.docx,.csv,.json"
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-4 border-rag-blue/30 text-rag-blue hover:bg-rag-blue/10"
            asChild
            disabled={isUploading}
          >
            <label htmlFor="file-upload">Browse Files</label>
          </Button>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">
                Selected Files ({selectedFiles.length})
              </p>
              {selectedFiles.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-gray-500 hover:text-red-500"
                  onClick={() => setSelectedFiles([])}
                  disabled={isUploading}
                >
                  Clear all
                </Button>
              )}
            </div>
            <div className="max-h-48 overflow-auto rounded-md border border-gray-200">
              <ul className="divide-y divide-gray-200">
                {selectedFiles.map((file, index) => {
                  const sizeInKB = (file.size / 1024).toFixed(0);
                  const isLarge = file.size > 5 * 1024 * 1024; // 5MB
                  
                  return (
                    <li key={index} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center space-x-3 max-w-[80%]">
                        {getFileIcon(file.name)}
                        <div className="flex flex-col">
                          <span className="text-sm truncate max-w-[15rem]">{file.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-500">{sizeInKB} KB</span>
                            {isLarge && (
                              <span className="flex items-center text-xs text-amber-600 gap-0.5">
                                <AlertTriangle className="h-3 w-3" />
                                Large file
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(file.name)}
                        disabled={isUploading}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
                        title="Remove file"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isUploading}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
            className="bg-gradient-to-r from-rag-blue to-rag-dark-blue hover:from-rag-dark-blue hover:to-rag-dark-blue"
          >
            {isUploading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentModal;
