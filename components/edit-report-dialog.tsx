"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface EditReportDialogProps {
  report: {
    id: number
    name?: string
    notes?: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: { name: string; notes: string }) => void
  isSaving: boolean
}

export function EditReportDialog({ report, open, onOpenChange, onSave, isSaving }: EditReportDialogProps) {
  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")

  // Cargar los datos del reporte cuando cambia o se abre el diálogo
  useEffect(() => {
    if (open) {
      setName(report.name || `Reporte #${report.id}`)
      setNotes(report.notes || "")
      setError("")
    }
  }, [report, open])

  const handleSave = () => {
    if (!name.trim()) {
      setError("El nombre del reporte es obligatorio")
      return
    }

    onSave({ name: name.trim(), notes: notes.trim() })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Reporte</DialogTitle>
          <DialogDescription>Modifica el nombre y las notas del reporte.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="report-name">
              Nombre del Reporte <span className="text-destructive">*</span>
            </Label>
            <Input
              id="report-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError("")
              }}
              placeholder="Ej: Análisis inicial - Hallux Valgus"
              className="w-full"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-notes">Notas</Label>
            <Textarea
              id="report-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Añade notas o comentarios sobre este análisis..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
