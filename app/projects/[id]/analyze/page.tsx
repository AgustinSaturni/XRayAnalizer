"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ArrowLeft, Download, Save, Loader2 } from "lucide-react"
import { getProject } from "@/lib/projects"
import { createReport } from "@/lib/reports"
import { SaveReportDialog } from "@/components/save-report-dialog"
import { getProjectImages } from "@/lib/images"

export default function AnalyzePage() {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const params = useParams();
  const [images, setImages] = useState<string[]>([])

  // Datos de ejemplo para resultados de análisis
  const analysisResults = [
    {
      angles: [
        { name: "Ángulo de Hallux Valgus", value: "23°" },
        { name: "Ángulo Intermetatarsiano", value: "12°" },
        { name: "Ángulo PASA", value: "8°" },
        { name: "Ángulo DASA", value: "6°" },
      ],
    },
    {
      angles: [
        { name: "Ángulo de Hallux Valgus", value: "18°" },
        { name: "Ángulo Intermetatarsiano", value: "10°" },
        { name: "Ángulo PASA", value: "7°" },
        { name: "Ángulo DASA", value: "5°" },
      ],
    },
    {
      angles: [
        { name: "Ángulo de Hallux Valgus", value: "25°" },
        { name: "Ángulo Intermetatarsiano", value: "14°" },
        { name: "Ángulo PASA", value: "9°" },
        { name: "Ángulo DASA", value: "7°" },
      ],
    },
  ]

  useEffect(() => {
    const loadProject = async () => {
      try {
        const id = params.id as string;
        const projectData = await getProject(id)
        setProject(projectData)
        
      // Obtener imágenes del proyecto
        const imageList = await getProjectImages(id)
        const urls = imageList.map((img: { url: string }) => img.url)
        setImages(urls)
      } catch (error) {
        console.error("Error al cargar el proyecto:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar el proyecto. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        })
        router.push("/projects")
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [params.id, router])

  // Simular análisis de IA
  const runAnalysis = () => {
    setIsAnalyzing(true)

    // Simulamos el tiempo de procesamiento de la IA
    setTimeout(() => {
      setIsAnalyzing(false)
      setIsAnalyzed(true)
      toast({
        title: "Análisis completado",
        description: "La IA ha detectado los ángulos en las radiografías correctamente.",
      })
    }, 3000)
  }

  const handleSaveClick = () => {
    setSaveDialogOpen(true)
  }

  const saveReport = async (formData: { name: string; notes: string }) => {
    if (!project) return

    setIsSaving(true)

    try {
      // Preparamos los datos del reporte
      const reportData = {
        projectId: project.id,
        projectName: project.name,
        patient_id: project.patient_id,
        name: formData.name,
        imageCount: 1, // Solo guardamos la imagen seleccionada
        angles: analysisResults[selectedImage].angles,
        notes:
          formData.notes ||
          `Análisis de radiografía para el paciente ${project.patient_id}. Imagen ${selectedImage + 1}.`,
      }

      // Guardamos el reporte
      const reportId = await createReport(reportData)

      toast({
        title: "Reporte guardado",
        description: `El reporte "${formData.name}" ha sido guardado exitosamente.`,
      })

      // Cerramos el diálogo
      setSaveDialogOpen(false)

      // Redirigir a la página del reporte recién creado
      router.push(`/reports/${reportId}`)
    } catch (error) {
      console.error("Error al guardar el reporte:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el reporte. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const downloadReport = () => {
    // Aquí iría la lógica para descargar el reporte en PDF
    toast({
      title: "Descargando reporte",
      description: "El reporte se está descargando.",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" className="mr-4" onClick={() => router.push(`/projects/${project.id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Análisis de Radiografías</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Visualización de Radiografía</CardTitle>
              <CardDescription>Selecciona una radiografía para ver su análisis detallado</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="relative w-full max-w-md aspect-[3/4] bg-muted rounded-md overflow-hidden">
                {isAnalyzing ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  images[selectedImage] ? (
                    <Image
                      src={images[selectedImage]}
                      alt="Radiografía de pie"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <Skeleton className="w-full h-full" />

                ))}

                {isAnalyzed && (
                  <div className="absolute inset-0">
                    {/* Aquí se mostrarían las líneas y ángulos detectados por la IA */}
                    <svg className="w-full h-full" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
                      {/* Líneas de ejemplo para representar los ángulos detectados */}
                      <line x1="150" y1="300" x2="250" y2="300" stroke="red" strokeWidth="2" />
                      <line x1="200" y1="250" x2="200" y2="350" stroke="blue" strokeWidth="2" />
                      <path d="M 180,280 A 30,30 0 0 1 220,280" fill="none" stroke="green" strokeWidth="2" />
                      <text x="230" y="270" fill="green" fontSize="12">
                        23°
                      </text>
                    </svg>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="flex space-x-2">
            {images.map((_, index) => (
              <Button
                key={index}
                variant={selectedImage === index ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedImage(index)}
              >
                Imagen {index + 1}
              </Button>
            ))}

              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Resultados del Análisis</CardTitle>
              <CardDescription>Ángulos detectados por la IA en la radiografía seleccionada</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {isAnalyzing ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : isAnalyzed ? (
                <div className="space-y-4">
                  {analysisResults[selectedImage].angles.map((angle, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <span className="font-medium">{angle.name}:</span>
                      <span className="text-lg">{angle.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                  <p className="text-muted-foreground">
                    Haz clic en "Analizar" para detectar automáticamente los ángulos en las radiografías.
                  </p>
                  <Button onClick={runAnalysis}>Analizar con IA</Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={downloadReport} disabled={!isAnalyzed}>
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </Button>
              <Button onClick={handleSaveClick} disabled={!isAnalyzed}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Reporte
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Diálogo para guardar el reporte */}
      <SaveReportDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={saveReport}
        isSaving={isSaving}
        defaultName={project ? `Análisis - ${project.patient_id} - Imagen ${selectedImage + 1}` : ""}
      />

      <Toaster />
    </div>
  )
}
