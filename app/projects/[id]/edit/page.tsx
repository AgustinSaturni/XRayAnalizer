"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ArrowLeft, Loader2 } from "lucide-react"
import { getProject, updateProject } from "@/lib/projects"

export default function EditProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    patientId: "",
    description: "",
  })

    const params = useParams()

  useEffect(() => {
    const loadProject = async () => {
      try {
        const id = params.id as string;
        const project = await getProject(id)
        setFormData({
          name: project.name,
          patientId: project.patientId,
          description: project.description || "",
        })
      } catch (error) {
        console.error("Error al cargar el proyecto:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar el proyecto. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        })
        router.push("/projects")
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const id = params.id as string;
    try {
      // Validación básica
      if (!formData.name.trim() || !formData.patientId.trim()) {
        toast({
          title: "Error de validación",
          description: "El nombre del proyecto y el ID del paciente son obligatorios.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Actualizar el proyecto
      await updateProject(id, formData)

      toast({
        title: "Proyecto actualizado",
        description: `El proyecto "${formData.name}" ha sido actualizado exitosamente.`,
      })

      // Redirigir a la página de detalles del proyecto
      router.push(`/projects/${id}`)
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el proyecto. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span>Cargando proyecto...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" className="mr-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Editar Proyecto</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
            <CardDescription>Actualiza los detalles del proyecto.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre del Proyecto <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Ej: Evaluación Inicial - Paciente X"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientId">
                ID del Paciente <span className="text-destructive">*</span>
              </Label>
              <Input
                id="patientId"
                name="patientId"
                placeholder="Ej: PAC-001"
                value={formData.patientId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe el propósito de este proyecto..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  )
}
