"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Calendar, Loader2, Search, FileX } from "lucide-react"
import { getProjects } from "@/lib/projects"
import { SearchInput } from "@/components/search-input"
import { Pagination } from "@/components/pagination"
import { Toaster } from "@/components/ui/toaster"

// Número de proyectos por página
const ITEMS_PER_PAGE = 6

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [paginatedProjects, setPaginatedProjects] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects()
        setProjects(data as any[])
        setFilteredProjects(data as any[])
      } catch (error) {
        console.error("Error al cargar los proyectos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  // Filtrar proyectos cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProjects(projects)
    } else {
      const normalizedSearchTerm = searchTerm.toLowerCase().trim()
      const filtered = projects.filter(
        (project) =>
          project.name.toLowerCase().includes(normalizedSearchTerm) ||
          project.patientId.toLowerCase().includes(normalizedSearchTerm),
      )
      setFilteredProjects(filtered)
    }

    // Resetear a la primera página cuando cambia el filtro
    setCurrentPage(1)
  }, [searchTerm, projects])

  // Actualizar la paginación cuando cambian los proyectos filtrados o la página actual
  useEffect(() => {
    // Calcular el número total de páginas
    const total = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
    setTotalPages(total || 1) // Mínimo 1 página

    // Asegurarse de que la página actual no sea mayor que el total de páginas
    if (currentPage > total && total > 0) {
      setCurrentPage(total)
      return
    }

    // Calcular los índices de inicio y fin para la página actual
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    // Obtener los proyectos para la página actual
    const paginatedItems = filteredProjects.slice(startIndex, endIndex)
    setPaginatedProjects(paginatedItems)
  }, [filteredProjects, currentPage])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll al inicio de la lista
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Proyectos</h1>
        <Link href="/new-project">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </Link>
      </div>

      {!loading && projects.length > 0 && (
        <div className="mb-6">
          <SearchInput
            placeholder="Buscar por nombre o ID de paciente..."
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
      ) : projects.length === 0 ? (
        <Card className="text-center p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-muted p-6">
              <PlusCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No hay proyectos</h2>
            <p className="text-muted-foreground">
              Aún no has creado ningún proyecto. Crea tu primer proyecto para comenzar.
            </p>
            <Link href="/new-project">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Primer Proyecto
              </Button>
            </Link>
          </div>
        </Card>
      ) : filteredProjects.length === 0 ? (
        <Card className="text-center p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-muted p-6">
              <FileX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No se encontraron resultados</h2>
            <p className="text-muted-foreground">No hay proyectos que coincidan con "{searchTerm}".</p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              <Search className="mr-2 h-4 w-4" />
              Ver todos los proyectos
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {project.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span>ID: {project.patientId}</span>
                    <span>{project.imageCount} radiografías</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/projects/${project.id}`}>
                    <Button variant="outline">Ver Detalles</Button>
                  </Link>
                  <Link href={`/projects/${project.id}/analyze`}>
                    <Button>Analizar</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Componente de paginación */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          )}
        </>
      )}
      <Toaster />
    </div>
  )
}
