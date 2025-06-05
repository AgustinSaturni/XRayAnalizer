// Simulación de una base de datos en memoria para imágenes
let images: any[] = []

const BASE_URL = "http://127.0.0.1:8000/images"

// Subir una imagen real al backend
export async function uploadImage(file: File, projectId: string): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("projectId", projectId)

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Error al subir la imagen")
  }

  const imageUrl = await response.text()
  return imageUrl
}

// Obtener todas las imágenes de un proyecto
export async function getProjectImages(projectId: number) {
  
  const response = await fetch(`${BASE_URL}/project/${projectId}`)

  if (!response.ok) {
    throw new Error("Error al obtener las imágenes del proyecto")
  }

  const images = await response.json()
  return images
}

// Eliminar una imagen
export async function deleteImage(imageId: string) {
  const response = await fetch(`${BASE_URL}/${imageId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Error al eliminar la imagen")
  }

  const deletedImage = await response.json()
  return deletedImage
}
