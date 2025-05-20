
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Upload, XCircle, FileText } from 'lucide-react';

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

  return (
    <Dialog open={isOpen} onOpenChange={() => !isUploading && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
        </DialogHeader>
        
        <div 
          className={`
            mt-4 border-2 border-dashed rounded-lg p-6 text-center
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-medium text-gray-900">
            Drag and drop files here
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
            className="mt-4"
            asChild
            disabled={isUploading}
          >
            <label htmlFor="file-upload">Select Files</label>
          </Button>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Selected Files ({selectedFiles.length})
            </p>
            <div className="max-h-40 overflow-auto rounded border border-gray-200">
              <ul className="divide-y divide-gray-200">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm truncate max-w-[12rem]">{file.name}</span>
                      <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)}KB</span>
                    </div>
                    <button 
                      onClick={() => removeFile(file.name)}
                      disabled={isUploading}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
            className="bg-rag-blue hover:bg-rag-dark-blue"
          >
            {isUploading ? 'Processing...' : 'Upload and Process'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentModal;
