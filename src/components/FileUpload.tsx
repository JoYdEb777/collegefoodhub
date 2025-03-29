
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  onChange: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
}

const FileUpload = ({ 
  label, 
  accept = "image/*", 
  multiple = false, 
  onChange,
  maxFiles = 5,
  className = ""
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      if (multiple && selectedFiles.length + files.length > maxFiles) {
        toast.error(`You can only upload a maximum of ${maxFiles} files`);
        return;
      }
      
      const newFiles = multiple ? [...files, ...selectedFiles] : selectedFiles;
      setFiles(newFiles);
      
      // Create previews
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
      
      onChange(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index]);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
    onChange(newFiles);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col items-center justify-center w-full">
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to {multiple ? 'upload files' : 'upload a file'}</span>
            </p>
            <p className="text-xs text-gray-500">
              {accept === "image/*" ? "PNG, JPG or GIF" : accept.replace(".", "").toUpperCase()} (Max: {multiple ? `${maxFiles} files` : '1 file'})
            </p>
          </div>
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
          />
        </label>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img 
                src={preview} 
                alt={`Preview ${index}`} 
                className="h-24 w-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
