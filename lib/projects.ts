// Añadir al inicio del archivo para depuración
console.log("Módulo projects.ts cargado")

const BASE_URL = "https://xrayanalizer-back-end.onrender.com/projects"

// Función para obtener todos los proyectos desde la API
export async function getProjects() {
  const response = await fetch(BASE_URL);
  
  if (!response.ok) {
    throw new Error("Error al obtener los proyectos");
  }

  const data = await response.json();
  return data;
}

// Función para obtener un proyecto por ID desde la API
export async function getProject(id: string) {
  console.log("Buscando proyecto con ID:", id);

  try {
    const response = await fetch(`${BASE_URL}/${id}`);

    if (!response.ok) {
      throw new Error("Proyecto no encontrado");
    }

    const project = await response.json();
    console.log("Proyecto encontrado:", project);
    return project;
  } catch (error) {
    console.error("Error al obtener el proyecto:", error);
    throw error;
  }
}

// Función para crear un nuevo proyecto usando la API real
export async function createProject(projectData: any): Promise<string> {
  console.log("Creando nuevo proyecto con datos:", projectData);
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error("Error al crear el proyecto");
    }

    const newId = await response.text(); // El backend devuelve el ID como string plano
    console.log("Proyecto creado con ID:", newId);
    return newId;
  } catch (error) {
    console.error("Error creando el proyecto:", error);
    throw error;
  }
}

export async function updateProject(id: string, projectData: any) {
  console.log("Actualizando proyecto con ID:", id, "Datos:", projectData)

  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData)
    })
 
    if (!response.ok) {
      throw new Error("Error al actualizar el proyecto");
    }

    console.log("Proyecto actualizado");
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error)
    throw error
  }
}

export async function deleteProject(id: string) {
  console.log("Eliminando proyecto con ID:", id)

  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.detail || "Error al eliminar el proyecto")
    }

    console.log("Proyecto eliminado con éxito")
    return true
  } catch (error) {
    console.error("Error al eliminar el proyecto:", error)
    throw error
  }
}
