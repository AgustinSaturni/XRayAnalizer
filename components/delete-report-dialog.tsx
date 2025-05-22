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
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { deleteReport } from "@/lib/reports"

interface DeleteReportDialogProps {
  report: {
    id: number
    projectName: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}

export function DeleteReportDialog({ report, open, onOpenChange, onDeleted }: DeleteReportDialogProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await deleteReport(report.id)

      toast({
        title: "Reporte eliminado",
        description: `El reporte #${report.id} ha sido eliminado exitosamente.`,
      })

      onOpenChange(false)

      // Si se proporciona una función de callback, la llamamos
      if (onDeleted) {
        onDeleted()
      } else {
        // Si no hay callback, redirigimos a la lista de reportes
        router.push("/reports")
      }
    } catch (error) {
      console.error("Error al eliminar el reporte:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el reporte. Por favor, inténtalo de nuevo.",
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
          <DialogTitle>Eliminar reporte</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <p className="text-sm">
            Estás a punto de eliminar el reporte <span className="font-medium">#{report.id}</span> del proyecto{" "}
            <span className="font-medium">{report.projectName}</span>.
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
              "Eliminar reporte"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
