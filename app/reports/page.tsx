"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Download, Loader2, FileX, Trash2 } from "lucide-react"
import { SearchInput } from "@/components/search-input"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { getReports } from "@/lib/reports"
import { DeleteReportDialog } from "@/components/delete-report-dialog"
import { Pagination } from "@/components/pagination"
import { FeatureNotImplementedDialog } from "@/components/feature-not-implemented-dialog"

// Número de reportes por página
const ITEMS_PER_PAGE = 5

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [filteredReports, setFilteredReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reportToDelete, setReportToDelete] = useState<any>(null)
  const [featureDialogOpen, setFeatureDialogOpen] = useState(false)
  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [paginatedReports, setPaginatedReports] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const loadReports = async () => {
    try {
      setLoading(true)
      const data = await getReports()
      setReports(data as any[])
      setFilteredReports(data as any[])
    } catch (error) {
      console.error("Error al cargar los reportes:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los reportes. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  // Filtrar reportes cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredReports(reports)
    } else {
      const normalizedSearchTerm = searchTerm.toLowerCase().trim()
      const filtered = reports.filter(
        (report) =>
          (report.name && report.name.toLowerCase().includes(normalizedSearchTerm)) ||
          report.projectName.toLowerCase().includes(normalizedSearchTerm) ||
          report.patientId.toLowerCase().includes(normalizedSearchTerm) ||
          report.date.includes(normalizedSearchTerm) ||
          String(report.id).includes(normalizedSearchTerm),
      )
      setFilteredReports(filtered)
    }

    // Resetear a la primera página cuando cambia el filtro
    setCurrentPage(1)
  }, [searchTerm, reports])

  // Actualizar la paginación cuando cambian los reportes filtrados o la página actual
  useEffect(() => {
    // Calcular el número total de páginas
    const total = Math.ceil(filteredReports.length / ITEMS_PER_PAGE)
    setTotalPages(total || 1) // Mínimo 1 página

    // Asegurarse de que la página actual no sea mayor que el total de páginas
    if (currentPage > total && total > 0) {
      setCurrentPage(total)
      return
    }

    // Calcular los índices de inicio y fin para la página actual
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    // Obtener los reportes para la página actual
    const paginatedItems = filteredReports.slice(startIndex, endIndex)
    setPaginatedReports(paginatedItems)
  }, [filteredReports, currentPage])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleDeleteClick = (report: any) => {
    setReportToDelete(report)
    setDeleteDialogOpen(true)
  }

  const handleReportDeleted = () => {
    // Recargar la lista de reportes después de eliminar uno
    loadReports()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll al inicio de la tabla
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDownloadReport = () => {
    setFeatureDialogOpen(true)
  }


  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Reportes de Análisis</h1>

      {!loading && reports.length > 0 && (
        <div className="mb-6">
          <SearchInput
            placeholder="Buscar por nombre, proyecto, paciente o fecha..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-md"
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : reports.length === 0 ? (
        <Card className="text-center p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-muted p-6">
              <FileX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No hay reportes</h2>
            <p className="text-muted-foreground">
              Aún no se han generado reportes. Analiza radiografías para generar reportes.
            </p>
          </div>
        </Card>
      ) : filteredReports.length === 0 ? (
        <Card className="text-center p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-muted p-6">
              <FileX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No se encontraron resultados</h2>
            <p className="text-muted-foreground">No hay reportes que coincidan con "{searchTerm}".</p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Ver todos los reportes
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Nombre</TableHead>
                  <TableHead className="text-center">Proyecto</TableHead>
                  <TableHead className="text-center">Paciente</TableHead>
                  <TableHead className="text-center">Fecha</TableHead>
                  <TableHead className="text-center">Imágenes</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="text-center font-medium">{report.name || `Reporte #${report.id}`}</TableCell>
                    <TableCell className="text-center">{report.projectName}</TableCell>
                    <TableCell className="text-center">{report.patientId}</TableCell>
                    <TableCell className="text-center">{report.date}</TableCell>
                    <TableCell className="text-center">{report.imageCount}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/reports/${report.id}`}>
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon" onClick={handleDownloadReport}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(report)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Componente de paginación */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-4"
            />
          </CardContent>
        </Card>
      )}

      {/* Diálogo de confirmación para eliminar reporte */}
      {reportToDelete && (
        <DeleteReportDialog
          report={{ id: reportToDelete.id, projectName: reportToDelete.projectName }}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDeleted={handleReportDeleted}
        />
      )}
      <FeatureNotImplementedDialog open={featureDialogOpen} onOpenChange={setFeatureDialogOpen} />

      <Toaster />
    </div>
  )
}
