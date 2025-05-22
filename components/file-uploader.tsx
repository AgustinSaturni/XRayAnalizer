"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X, FileImage } from "lucide-react"

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void
  uploadedFiles: File[]
}

export function FileUploader({ onFilesSelected, uploadedFiles }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        (file) => file.type.startsWith("image/") || file.name.endsWith(".dcm"),
      )
      onFilesSelected([...uploadedFiles, ...newFiles])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(
        (file) => file.type.startsWith("image/") || file.name.endsWith(".dcm"),
      )
      onFilesSelected([...uploadedFiles, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    onFilesSelected(newFiles)
  }

  const handlePreviewFile = (file: File) => {
    // Solo mostrar vista previa para imágenes
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement("img")
        img.src = e.target?.result as string
        const w = window.open("")
        w?.document.write(img.outerHTML)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <h3 className="font-medium text-lg">Arrastra y suelta tus archivos aquí</h3>
          <p className="text-sm text-muted-foreground">o haz clic para seleccionar archivos</p>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-2">
            Seleccionar Archivos
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/jpeg,image/png,image/dicom,.dcm"
            className="hidden"
          />
          <p className="text-xs text-muted-foreground mt-2">Formatos soportados: JPEG, PNG, DICOM (.dcm)</p>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Archivos seleccionados ({uploadedFiles.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {uploadedFiles.map((file, index) => (
              <Card key={index} className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <FileImage className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <span
                    className="text-sm truncate cursor-pointer hover:underline"
                    onClick={() => handlePreviewFile(file)}
                    title="Haz clic para previsualizar"
                  >
                    {file.name}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-8 w-8 flex-shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
