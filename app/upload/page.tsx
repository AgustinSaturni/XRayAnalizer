"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ArrowLeft, Upload, Loader2 } from "lucide-react"
import { getProject, updateProject } from "@/lib/projects"
import { uploadImage } from "@/lib/images"

export default function UploadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId")

  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setLoading(false)
        return
      }

      try {
        const projectData = await getProject(projectId)
        setProject(projectData)
      } catch (error) {
        console.error("Error al cargar el proyecto:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar el proyecto. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [projectId])

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles(files)
  }

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, selecciona al menos una radiografía para subir.",
        variant: "destructive",
      })
      return
    }

    if (!projectId || !project) {
      toast({
        title: "Error",
        description: "No se ha seleccionado un proyecto válido.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Subir cada imagen y obtener sus URLs
      const uploadPromises = uploadedFiles.map((file) => uploadImage(file, projectId))
      const uploadedImages = await Promise.all(uploadPromises)

      // Actualizar el contador de imágenes del proyecto
      const newImageCount = project.imageCount + uploadedFiles.length
      await updateProject(projectId, { imageCount: newImageCount })

      toast({
        title: "Radiografías subidas",
        description: `Se han subido ${uploadedFiles.length} radiografías exitosamente.`,
      })

      // Redirigir a la página del proyecto
      router.push(`/projects/${projectId}`)
    } catch (error) {
      console.error("Error al subir las radiografías:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al subir las radiografías. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" className="mr-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Subir Radiografías</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !projectId ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Selecciona un proyecto</CardTitle>
            <CardDescription>Debes seleccionar un proyecto antes de subir radiografías.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/projects" className="w-full">
              <Button className="w-full">Ir a Proyectos</Button>
            </Link>
          </CardFooter>
        </Card>
      ) : !project ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Proyecto no encontrado</CardTitle>
            <CardDescription>No se pudo encontrar el proyecto seleccionado.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/projects" className="w-full">
              <Button className="w-full">Volver a Proyectos</Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Subir Radiografías</CardTitle>
            <CardDescription>
              Proyecto: <span className="font-medium">{project.name}</span> - Paciente:{" "}
              <span className="font-medium">{project.patientId}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader onFilesSelected={handleFilesSelected} uploadedFiles={uploadedFiles} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()} disabled={isUploading}>
              Cancelar
            </Button>
            <Button onClick={handleUpload} disabled={uploadedFiles.length === 0 || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Radiografías
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
      <Toaster />
    </div>
  )
}
