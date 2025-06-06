"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { deleteImage } from "@/lib/images"

interface DeleteImageDialogProps {
  image: {
    id: string
    name: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}

export function DeleteImageDialog({ image, open, onOpenChange, onDeleted }: DeleteImageDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await deleteImage(image.id)

      toast({
        title: "Imagen eliminada",
        description: `La imagen "${image.name}" ha sido eliminada exitosamente.`,
      })

      onOpenChange(false)

      // Si se proporciona una función de callback, la llamamos
      if (onDeleted) {
        onDeleted()
      }
    } catch (error) {
      console.error("Error al eliminar la imagen:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la imagen. Por favor, inténtalo de nuevo.",
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
          <DialogTitle>Eliminar imagen</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <p className="text-sm">
            Estás a punto de eliminar la imagen <span className="font-medium">"{image.name}"</span>.
          </p>
        </div>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar imagen"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
