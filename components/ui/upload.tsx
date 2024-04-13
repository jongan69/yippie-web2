import React, { SetStateAction, useState } from "react";
import { Card, Progress } from "@radix-ui/themes";
import { Button } from "./button";
import { SquareX, Upload } from "lucide-react"
import Image from "next/image"
import { file_to_base64 } from "@/lib/utils";

interface FileUploadProps {
  onFileUpload: (files: FileList) => void;
  setFile: any;
}

const FileUpload: React.FC<FileUploadProps> = (props) => {
  const [uploadProgress] = useState<number | null>(null);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFiles(files);
      previewFiles(files);
      const base64Data = file_to_base64(files[0])
      props.setFile(await base64Data)
    }
  };

  const setFiles = async (files: FileList) => {
    try {
      const base64Data = file_to_base64(files[0])
      props.setFile(await base64Data)
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const previewFiles = (files: FileList) => {
    const previews: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        previews.push(reader.result as string);
        setFilePreviews([...previews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeletePreview = (index: number) => {
    const updatedPreviews = [...filePreviews];
    updatedPreviews.splice(index, 1);
    setFilePreviews(updatedPreviews);
  };

  return (
    <Card>
      <div>
        <div className="text-center">
          <input
            type="file"
            onChange={(e) => handleFileInputChange(e)}
            multiple // Enable multiple file selection
            className="hidden"
            accept="image/*" // Allow only image files
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="flex size-full cursor-pointer flex-col items-center justify-center text-gray-500"
          >
            <p>Drag & drop your files here or click to browse</p>
            <Upload />
          </label>
        </div>
        <div className="mt-3 flex flex-row flex-wrap gap-4">
          {filePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <Image
                src={preview}
                alt={`File Preview ${index + 1}`}
                className="size-[100px] rounded object-cover"
                width={200}
                height={200}
              />
              <Button
                onClick={() => handleDeletePreview(index)}
                className="absolute right-0 top-0 rounded-full bg-red-500 p-2 text-white"
              >
                <SquareX />
              </Button>
            </div>
          ))}
        </div>
        {uploadProgress !== null && (
          <Progress
            value={uploadProgress}
            // maxValue={100}
            className="mt-3"
            color="pink"
          />
        )}
      </div>
    </Card>
  );
};

// Usage
const StyledFileUpload: React.FC | any = (props: { image: File, setImage: SetStateAction<any> }) => {
  const handleFileUpload = (files: FileList) => {
    // Handle the uploaded files here
    alert(`Uploading files: ${files[0].name.toString()}`);
  };

  return (
    <div className="w-full">
      <FileUpload onFileUpload={handleFileUpload} setFile={props.setImage} />
    </div>
  );
};

export default StyledFileUpload;
