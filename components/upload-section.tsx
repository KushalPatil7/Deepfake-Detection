"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, Play, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function UploadSection() {
  const [file, setFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionResult, setDetectionResult] = useState<"real" | "fake" | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const resetState = () => {
    setFile(null)
    setVideoUrl(null)
    setDetectionResult(null)
    setUploadProgress(0)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
  }

  const simulateUpload = (selectedFile: File) => {
    let progress = 0
    progressIntervalRef.current = setInterval(() => {
      progress += 5
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(progressIntervalRef.current!)
        handleFileUpload(selectedFile)
      }
    }, 100)
  }

  const handleNewFile = (selectedFile: File) => {
    setFile(selectedFile)
    setVideoUrl(URL.createObjectURL(selectedFile))
    setDetectionResult(null)
    simulateUpload(selectedFile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      handleNewFile(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      handleNewFile(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("video", file)

      const uploadResponse = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Video upload failed")
      }

      await handleDetect(file.name)
    } catch (error) {
      console.error("Upload error:", error)
    }
  }

  const handleDetect = async (filename: string) => {
    setIsDetecting(true)
    try {
      const detectionResponse = await fetch("http://127.0.0.1:5000/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoFilename: filename }),
      })

      if (!detectionResponse.ok) {
        throw new Error("Detection API failed")
      }

      const result = await detectionResponse.json()
      if (result?.detection === "real" || result?.detection === "fake") {
        setDetectionResult(result.detection)
      } else {
        console.error("Unexpected detection result:", result)
      }
    } catch (error) {
      console.error("Detection error:", error)
    } finally {
      setIsDetecting(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />

      {!videoUrl ? (
        <div
          className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-purple-500 transition-colors cursor-pointer"
          onClick={triggerFileInput}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-medium mb-2">Upload a video file</h3>
          <p className="text-sm text-gray-400 mb-4">Drag and drop or click to browse</p>
          <p className="text-xs text-gray-500">Supports MP4, MOV, and other video formats</p>
        </div>
      ) : (
        <>
          {uploadProgress < 100 ? (
            <div className="space-y-4">
              <p className="text-sm font-medium">Uploading video...</p>
              <Progress value={uploadProgress} className="h-2 bg-gray-700" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-lg overflow-hidden bg-gray-800 aspect-video">
                <video src={videoUrl} controls className="w-full h-full object-contain">
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400 truncate max-w-[200px]">{file?.name}</span>
                </div>

                <Button
                  onClick={() => file && handleDetect(file.name)}
                  disabled={isDetecting}
                  className={cn(
                    "min-w-[120px]",
                    !detectionResult &&
                      "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
                  )}
                >
                  {isDetecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Detect Deepfake"
                  )}
                </Button>
              </div>

              {detectionResult && (
                <div
                  className={cn(
                    "p-4 rounded-lg flex items-center gap-3 transition-all animate-in fade-in-50 duration-300",
                    detectionResult === "real"
                      ? "bg-green-900/20 text-green-400 border border-green-800"
                      : "bg-red-900/20 text-red-400 border border-red-800",
                  )}
                >
                  {detectionResult === "real" ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  )}
                  <div>
                    <h3 className="font-bold text-lg">
                      {detectionResult === "real" ? "This video is Real" : "This video is Fake"}
                    </h3>
                    <p className="text-sm opacity-80">
                      {detectionResult === "real"
                        ? "Our AI has determined this video appears to be authentic."
                        : "Our AI has detected signs of manipulation in this video."}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <Button variant="outline" onClick={resetState} size="sm">
                  Upload a different video
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}


  