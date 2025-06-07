"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction, Calendar, CheckCircle } from "lucide-react"

interface FeatureNotImplementedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  featureName?: string
  description?: string
}

export function FeatureNotImplementedDialog({
  open,
  onOpenChange,
  featureName = "Descarga de reportes en PDF",
  description = "Esta funcionalidad permitirá descargar reportes completos en formato PDF con todos los análisis y resultados.",
}: FeatureNotImplementedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-orange-500" />
            Funcionalidad en Desarrollo
          </DialogTitle>
          <DialogDescription>La funcionalidad que intentas usar aún no está disponible.</DialogDescription>
        </DialogHeader>

        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-orange-800 dark:text-orange-200">{featureName}</CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">{description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-orange-600" />
                <span className="text-orange-700 dark:text-orange-300">Fecha estimada: Próxima actualización</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Funcionalidades incluidas:</p>
                <ul className="space-y-1 text-sm text-orange-700 dark:text-orange-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    Exportación en formato PDF
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    Incluir imágenes y análisis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    Personalización de reportes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    Marca de agua profesional
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
