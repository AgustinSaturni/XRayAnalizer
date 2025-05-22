import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, FolderOpen, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center text-center space-y-4 mb-10">
        <h1 className="text-4xl font-bold">Analizador de Radiografías</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Plataforma para análisis de radiografías de pies con detección automática de ángulos mediante IA
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Proyectos</CardTitle>
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Gestiona tus proyectos de análisis de radiografías</p>
          </CardContent>
          <CardFooter>
            <Link href="/projects" className="w-full">
              <Button className="w-full">Ver Proyectos</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Nuevo Proyecto</CardTitle>
            <PlusCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Crea un nuevo proyecto para análisis de radiografías</p>
          </CardContent>
          <CardFooter>
            <Link href="/new-project" className="w-full">
              <Button className="w-full">Crear Proyecto</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Reportes</CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Consulta los reportes de análisis generados</p>
          </CardContent>
          <CardFooter>
            <Link href="/reports" className="w-full">
              <Button className="w-full">Ver Reportes</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
