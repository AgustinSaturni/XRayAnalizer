"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Upload, FolderOpen, Loader2 } from "lucide-react"
import { getProject } from "@/lib/projects"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ProjectCreatedPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProject = async () => {
      try {
        console.log("Intentando cargar el proyecto con ID:", params.id)
        const projectData = await getProject(params.id)
        console.log("Proyecto cargado:", projectData)
        setProject(projectData)
      } catch (error) {
        console.error("Error al cargar el proyecto:", error)
        // Mostramos un toast de error antes de redirigir
        toast({
          title: "Error",
          description: "No se pudo encontrar el proyecto. Redirigiendo a la lista de proyectos.",
          variant: "destructive",
        })
        // Esperamos un momento antes de redirigir para que el usuario pueda ver el mensaje
        setTimeout(() => {
          router.push("/projects")
        }, 2000)
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span>Cargando proyecto...</span>
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
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">¡Proyecto Creado!</CardTitle>
          <CardDescription>
            El proyecto <span className="font-medium">{project.name}</span> ha sido creado exitosamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <p className="font-medium">Detalles del proyecto:</p>
            <ul className="mt-2 space-y-1">
              <li>
                <span className="font-medium">ID:</span> {project.id}
              </li>
              <li>
                <span className="font-medium">Paciente:</span> {project.patient_id}
              </li>
              {project.description && (
                <li>
                  <span className="font-medium">Descripción:</span> {project.description}
                </li>
              )}
            </ul>
          </div>
          <p className="text-center text-muted-foreground">¿Qué te gustaría hacer ahora?</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href={`/upload?projectId=${project.id}`} className="w-full">
            <Button className="w-full flex items-center justify-center">
              <Upload className="mr-2 h-4 w-4" />
              Importar Radiografías
            </Button>
          </Link>
          <Link href="/projects" className="w-full">
            <Button variant="outline" className="w-full flex items-center justify-center">
              <FolderOpen className="mr-2 h-4 w-4" />
              Ir a Mis Proyectos
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}
