"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, BarChart3, Trash2, Pencil, Loader2, Eye, Download, X } from "lucide-react"
import { getProject } from "@/lib/projects"
import { getReportsByProjectId } from "@/lib/reports"
import { deleteImage, getProjectImages } from "@/lib/images"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { DeleteProjectDialog } from "@/components/delete-project-dialog"
import { DeleteReportDialog } from "@/components/delete-report-dialog"
import { DeleteImageDialog } from "@/components/delete-image-dialog"

export default function ProjectDetailPage() {
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [reports, setReports] = useState<any[]>([])
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingReports, setLoadingReports] = useState(false)
  const [loadingImages, setLoadingImages] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteReportDialogOpen, setDeleteReportDialogOpen] = useState(false)
  const [reportToDelete, setReportToDelete] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("images")
  const [imageToDelete, setImageToDelete] = useState<any>(null)
  const [deleteImageDialogOpen, setDeleteImageDialogOpen] = useState(false)
  const params = useParams()

const loadProject = async () => {
  try {
    const rawId = params.id as string;
    const decodedId = decodeURIComponent(rawId);
    const id = decodedId.replace(/^"|"$/g, ""); // quita comillas
    const projectData = await getProject(id);
    console.log("Proyecto cargado:", projectData);
    setProject(projectData);
  } catch (error) {
    console.error("Error al cargar el proyecto:", error);
    toast({
      title: "Error",
      description: "No se pudo cargar el proyecto. Por favor, inténtalo de nuevo.",
      variant: "destructive",
    });
    router.push("/projects");
  } finally {
    setLoading(false);
  }
}

  const loadReports = async () => {
    setLoadingReports(true)
    try {
      const id = params.id as string
      const reportsData = await getReportsByProjectId(id)
      setReports(reportsData as any[])
    } catch (error) {
      console.error("Error al cargar los reportes:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los reportes. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoadingReports(false)
    }
  }

  const loadImages = async () => {
    setLoadingImages(true)
    try {
    const id = params.id as string; 
    const encoded = id;
    const decoded = decodeURIComponent(encoded); 
    const cleaned = decoded.replace(/^"|"$/g, ''); 
    const number = Number(cleaned); 
    const imagesData = await getProjectImages(number);
      setImages(imagesData as any[])
    } catch (error) {
      console.error("Error al cargar las imágenes:", error)
      toast({ 
        title: "Error",
        description: "No se pudieron cargar las imágenes. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoadingImages(false)
    }
  }

  useEffect(() => {
    loadProject()
  }, [params.id])

  // Cargar reportes cuando se cambia a la pestaña de reportes
  useEffect(() => {
    if (activeTab === "reports") {
      loadReports()
    } else if (activeTab === "images") {
      loadImages()
    }
  }, [activeTab, params.id])

  const handleEditClick = () => {
    router.push(`/projects/${params.id}/edit`)
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

    const handleDeleteImageClick = (image: any) => {
      setImageToDelete(image)
      setDeleteImageDialogOpen(true)
  }


  const handleDeleteReportClick = (report: any) => {
    setReportToDelete(report)
    setDeleteReportDialogOpen(true)
  }

  const handleReportDeleted = () => {
    // Recargar los reportes y el proyecto después de eliminar un reporte
    loadReports()
    loadProject()
  }

  const handleDeleteImage = async (image: any) => {
    try {
      await deleteImage(image.id)
      // Actualiza la lista quitando la imagen eliminada
      setImages((prevImages) => prevImages.filter((img) => img.id !== image.id))
      loadProject()
    } catch (error) {
      alert("Error al eliminar la imagen. Intenta de nuevo.")
      console.error(error)
    }
  }

    const handleImageDeleted = () => {
    // Recargar las imágenes y el proyecto después de eliminar una imagen
    loadImages()
    loadProject()
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

  if (!project) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Proyecto no encontrado</CardTitle>
            <CardDescription>No se pudo encontrar el proyecto solicitado.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/projects" className="w-full">
              <Button className="w-full">Volver a Proyectos</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" className="mr-4" onClick={() => router.push(`/projects`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">ID del Paciente: {project.patientId}</p>
        </div>
        <div className="ml-auto space-x-2">
          <Button variant="outline" size="sm" onClick={handleEditClick}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={handleDeleteClick}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Fecha:</div>
                <div>{project.date}</div>

                <div className="font-medium">Radiografías:</div>
                <div>{project.imageCount}</div>

                <div className="font-medium">Reportes:</div>
                <div>{project.reportCount}</div>
              </div>

              {project.description && (
                <div className="pt-4 border-t">
                  <div className="font-medium mb-2">Descripción:</div>
                  <p className="text-sm">{project.description}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Link href={`/upload?projectId=${project.id}`} className="w-full">
                <Button className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Radiografías
                </Button>
              </Link>
          {project.imageCount === 0 ? (
            <Button
              variant="outline"
              className="w-full opacity-50 cursor-not-allowed"
              disabled
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analizar
            </Button>
          ) : (
            <Link
              href={`/projects/${project.id}/analyze`}
              className="w-full"
              passHref
            >
              <Button
                variant="outline"
                className="w-full"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analizar
              </Button>
            </Link>
          )}

            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="images" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="images">Radiografías</TabsTrigger>
              <TabsTrigger value="reports">Reportes</TabsTrigger>
            </TabsList>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Radiografías</CardTitle>
                <CardDescription>Radiografías subidas a este proyecto</CardDescription>
              </CardHeader>
              <CardContent>
                  {loadingImages ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : project.imageCount === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No hay radiografías en este proyecto</p>
                      <Link href={`/upload?projectId=${project.id}`}>
                        <Button>
                          <Upload className="mr-2 h-4 w-4" />
                          Subir Radiografías
                        </Button>
                      </Link>
                    </div>
                  ) : images.length === 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: project.imageCount }).map((_, index) => (
                        <div key={index} className="relative aspect-[3/4] bg-muted rounded-md overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-muted-foreground">Imagen {index + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <div className="relative aspect-[3/4] bg-muted rounded-md overflow-hidden">
                            <Image
                              src={image.url || "/placeholder.svg"}
                              alt={`Radiografía ${index + 1}`}
                              fill
                              className="object-contain"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm truncate">
                              {image.name}
                            </div>
                            {/* Botón de eliminar que aparece al hacer hover */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDeleteImageClick(image)}
                                title="Eliminar imagen"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
            </Card>
          </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Reportes</CardTitle>
                  <CardDescription>Reportes generados para este proyecto</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[400px] overflow-y-auto pr-2">
                  {loadingReports ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : reports.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No hay reportes en este proyecto</p>
                      <Link href={`/projects/${project.id}/analyze`}>
                        <Button>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Analizar Radiografías
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reports.map((report) => (
                        <Card key={report.id}>
                          <CardHeader>
                            <CardTitle className="text-base">{report.name || `Reporte #${report.id}`}</CardTitle>
                            <CardDescription>Generado el {report.date}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2">{report.notes}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Link href={`/reports/${report.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Reporte
                              </Button>
                            </Link>
                            <div className="space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Descargar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteReportClick(report)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Diálogo de confirmación para eliminar proyecto */}
      {project && (
        <DeleteProjectDialog
          project={{ id: project.id, name: project.name }}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}

      {/* Diálogo de confirmación para eliminar reporte */}
      {reportToDelete && (
        <DeleteReportDialog
          report={{ id: reportToDelete.id, projectName: reportToDelete.projectName }}
          open={deleteReportDialogOpen}
          onOpenChange={setDeleteReportDialogOpen}
          onDeleted={handleReportDeleted}
        />
      )}

      {/* Diálogo de confirmación para eliminar imagen */}
      {imageToDelete && (
        <DeleteImageDialog
          image={{ id: imageToDelete.id, name: imageToDelete.name }}
          open={deleteImageDialogOpen}
          onOpenChange={setDeleteImageDialogOpen}
          onDeleted={handleImageDeleted}
        />
      )}
      
      <Toaster />
    </div>
  )
}
