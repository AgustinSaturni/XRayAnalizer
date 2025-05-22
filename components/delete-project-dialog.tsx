"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { deleteProject } from "@/lib/projects"

interface DeleteProjectDialogProps {
  project: {
    id: string
    name: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteProjectDialog({ project, open, onOpenChange }: DeleteProjectDialogProps) {
  const router = useRouter()
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirmText !== project.name) {
      toast({
        title: "Error de confirmación",
        description: "El nombre del proyecto no coincide. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)

    try {
      await deleteProject(project.id)

      toast({
        title: "Proyecto eliminado",
        description: `El proyecto "${project.name}" ha sido eliminado exitosamente.`,
      })

      onOpenChange(false)
      router.push("/projects")
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el proyecto. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar proyecto</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el proyecto y todos sus datos asociados.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="confirm">
              Para confirmar, escribe el nombre del proyecto: <span className="font-medium">{project.name}</span>
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Escribe el nombre del proyecto"
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={confirmText !== project.name || isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar proyecto"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
