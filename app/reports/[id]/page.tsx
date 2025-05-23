"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { getReportById, updateReport } from "@/lib/reports"
import { DeleteReportDialog } from "@/components/delete-report-dialog"
import { EditReportDialog } from "@/components/edit-report-dialog"

export default function ReportDetailPage() {
  const router = useRouter()
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const params = useParams();
  
  const loadReport = async () => {
    try {
      const id = params.id as string;
      const reportData = await getReportById(id)
      setReport(reportData)
    } catch (error) {
      console.error("Error al cargar el reporte:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el reporte. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
      router.push("/reports")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReport()
  }, [params.id, router])

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleEditClick = () => {
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async (formData: { name: string; notes: string }) => {
    if (!report) return

    setIsSaving(true)

    try {
      // Actualizar el reporte
      await updateReport(report.id, {
        name: formData.name,
        notes: formData.notes,
      })

      // Actualizar el reporte en el estado local
      setReport({
        ...report,
        name: formData.name,
        notes: formData.notes,
      })

      toast({
        title: "Reporte actualizado",
        description: "Los cambios han sido guardados exitosamente.",
      })

      // Cerrar el diálogo
      setEditDialogOpen(false)
    } catch (error) {
      console.error("Error al actualizar el reporte:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el reporte. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span>Cargando reporte...</span>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Reporte no encontrado</CardTitle>
            <CardDescription>No se pudo encontrar el reporte solicitado.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/reports">
              <Button className="w-full">Volver a Reportes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/reports">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{report.name || `Reporte #${report.id}`}</h1>
          <p className="text-muted-foreground">ID: {report.id}</p>
        </div>
        <div className="ml-auto space-x-2">
          <Button variant="outline" onClick={handleEditClick}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
          <Button variant="outline" className="text-destructive hover:text-destructive" onClick={handleDeleteClick}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Información del Reporte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Proyecto:</div>
                <div>{report.projectName}</div>

                <div className="font-medium">ID Paciente:</div>
                <div>{report.patientId}</div>

                <div className="font-medium">Fecha:</div>
                <div>{report.date}</div>

                <div className="font-medium">Imágenes:</div>
                <div>{report.imageCount}</div>
              </div>

              {report.notes && (
                <div className="pt-4 border-t">
                  <div className="font-medium mb-2">Notas:</div>
                  <p className="text-sm">{report.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Resultados del Análisis</CardTitle>
              <CardDescription>Ángulos detectados por la IA en las radiografías</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative aspect-[3/4] bg-muted rounded-md overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=600&width=400"
                      alt={`Radiografía`}
                      fill
                      className="object-contain"
                    />
                    <div className="absolute inset-0">
                      {/* Aquí se mostrarían las líneas y ángulos detectados por la IA */}
                      <svg className="w-full h-full" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
                        <line x1="150" y1="300" x2="250" y2="300" stroke="red" strokeWidth="2" />
                        <line x1="200" y1="250" x2="200" y2="350" stroke="blue" strokeWidth="2" />
                        <path d="M 180,280 A 30,30 0 0 1 220,280" fill="none" stroke="green" strokeWidth="2" />
                        <text x="230" y="270" fill="green" fontSize="12">
                          23°
                        </text>
                      </svg>
                    </div>
                  </div>

                  <div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ángulo</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.angles.map((angle: any, angleIndex: number) => (
                          <TableRow key={angleIndex}>
                            <TableCell>{angle.name}</TableCell>
                            <TableCell className="text-right font-medium">{angle.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Diálogo de confirmación para eliminar reporte */}
      <DeleteReportDialog
        report={{ id: report.id, projectName: report.projectName }}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />

      {/* Diálogo para editar reporte */}
      <EditReportDialog
        report={report}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEdit}
        isSaving={isSaving}
      />

      <Toaster />
    </div>
  )
}
