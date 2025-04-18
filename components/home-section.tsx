"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function HomeSection() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const [resultType, setResultType] = useState<"real" | "fake" | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.startsWith("video/")) {
        setFile(droppedFile)
      } else {
        alert("Please upload a video file.")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setResult(null)
    setResultType(null)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + 5
      })
    }, 200)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("video", file)

      // In a real application, you would send this to your backend
      // For this example, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate a response (in a real app, this would come from your backend)
      const fakeResponse = Math.random() > 0.5 ? "Real Video" : "Deepfake Video"

      clearInterval(progressInterval)
      setUploadProgress(100)

      setTimeout(() => {
        setResult(fakeResponse)
        setResultType(fakeResponse === "Real Video" ? "real" : "fake")
        setIsUploading(false)
      }, 500)

      // In a real application, you would use fetch:
      /*
      const response = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload video");
      }
      
      const data = await response.json();
      setResult(data.result);
      setResultType(data.result === "Real Video" ? "real" : "fake");
      */
    } catch (error) {
      console.error("Error uploading video:", error)
      alert("Failed to upload video. Please try again.")
    } finally {
      clearInterval(progressInterval)
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Deepfake Detection System</h1>

      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            } transition-colors duration-200 cursor-pointer`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">{file ? file.name : "Drag and drop your video here"}</p>
            <p className="text-sm text-gray-500 mb-4">
              {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "or click to browse files"}
            </p>
            {!file && (
              <Button variant="outline" className="mt-2">
                Select Video
              </Button>
            )}
          </div>

          {file && !isUploading && !result && (
            <div className="mt-6 flex justify-center">
              <Button onClick={handleUpload} className="px-8">
                Analyze Video
              </Button>
            </div>
          )}

          {isUploading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <div className="flex items-center justify-center mt-4">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span className="text-sm">Processing video...</span>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-6">
              <div
                className={`p-4 rounded-lg flex items-center ${
                  resultType === "real" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}
              >
                {resultType === "real" ? (
                  <CheckCircle className="h-6 w-6 mr-3" />
                ) : (
                  <AlertCircle className="h-6 w-6 mr-3" />
                )}
                <div>
                  <p className="font-medium text-lg">{result}</p>
                  <p className="text-sm mt-1">
                    {resultType === "real"
                      ? "This video appears to be authentic."
                      : "This video shows signs of manipulation."}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null)
                    setResult(null)
                    setResultType(null)
                  }}
                >
                  Analyze Another Video
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
