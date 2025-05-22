export default function Loading() {
  return (
    <div className="container mx-auto py-10 flex justify-center">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span>Cargando...</span>
      </div>
    </div>
  )
}
