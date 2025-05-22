// Simulación de una base de datos en memoria para imágenes
let images: any[] = []

// Función para subir una imagen
export async function uploadImage(file: File, projectId: string) {
  // Simulamos una llamada a la API
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      // Convertir el archivo a una URL de datos (base64)
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageUrl = reader.result as string

        // Crear un nuevo registro de imagen
        const newImage = {
          id: String(Date.now()) + Math.random().toString(36).substring(2, 9),
          projectId,
          name: file.name,
          url: imageUrl,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        }

        // Guardar la imagen en nuestra "base de datos"
        images.push(newImage)
        console.log("Imagen subida:", newImage.name)

        // Devolver la URL de la imagen
        resolve(newImage.url)
      }

      // Leer el archivo como una URL de datos
      reader.readAsDataURL(file)
    }, 1000) // Simulamos un retraso de 1 segundo para la carga
  })
}

// Función para obtener todas las imágenes de un proyecto
export async function getProjectImages(projectId: string) {
  // Simulamos una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      const projectImages = images.filter((img) => img.projectId === projectId)
      resolve([...projectImages])
    }, 500)
  })
}

// Función para eliminar una imagen
export async function deleteImage(imageId: string) {
  // Simulamos una llamada a la API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = images.findIndex((img) => img.id === imageId)
      if (index !== -1) {
        const deletedImage = images[index]
        images = images.filter((img) => img.id !== imageId)
        resolve(deletedImage)
      } else {
        reject(new Error("Imagen no encontrada"))
      }
    }, 500)
  })
}
