"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Loader2, ArrowLeft } from "lucide-react"
import { createProject } from "@/lib/projects"

export default function NewProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    patient_id: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validación básica
      if (!formData.name.trim() || !formData.patient_id.trim()) {
        toast({
          title: "Error de validación",
          description: "El nombre del proyecto y el ID del paciente son obligatorios.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      console.log("Enviando datos del formulario:", formData)

      // Crear el proyecto
      const projectId = await createProject(formData)

      console.log("Proyecto creado con ID:", projectId)

      // Verificar que el ID del proyecto sea válido
      if (!projectId) {
        throw new Error("No se pudo crear el proyecto")
      }

      toast({
        title: "Proyecto creado",
        description: `El proyecto "${formData.name}" ha sido creado exitosamente.`,
      })

      // Redirigir a la página del proyecto creado
      router.push(`/projects/${projectId}`)
    } catch (error) {
      console.error("Error al crear el proyecto:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el proyecto. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/projects">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Crear Nuevo Proyecto</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
            <CardDescription>
              Ingresa los detalles para crear un nuevo proyecto de análisis de radiografías.
            </CardDescription>
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
              <Label htmlFor="patient_id">
                ID del Paciente <span className="text-destructive">*</span>
              </Label>
              <Input
                id="patient_id"
                name="patient_id"
                placeholder="Ej: PAC-001"
                value={formData.patient_id}
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
            <Link href="/projects">
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Proyecto"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  )
}
