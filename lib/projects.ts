// Añadir al inicio del archivo para depuración
console.log("Módulo projects.ts cargado")

// Simulación de una base de datos en memoria
let projects: any[] = [
  {
    id: "1",
    name: "Paciente A - Evaluación Inicial",
    patient_id: "PAC-001",
    date: "15/04/2025",
    description: "Evaluación inicial del paciente A",
    imageCount: 3,
    reportCount: 2,
  },
  {
    id: "2",
    name: "Paciente B - Seguimiento",
    patient_id: "PAC-002",
    date: "10/04/2025",
    description: "Seguimiento del paciente B",
    imageCount: 2,
    reportCount: 1,
  },
  {
    id: "3",
    name: "Paciente C - Post-operatorio",
    patient_id: "PAC-003",
    date: "05/04/2025",
    description: "Evaluación post-operatoria del paciente C",
    imageCount: 4,
    reportCount: 3,
  },
]

// Función para obtener todos los proyectos desde la API
export async function getProjects() {
  const response = await fetch("http://127.0.0.1:8000/projects");
  
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
    const response = await fetch(`http://127.0.0.1:8000/projects/${id}`);

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
    const response = await fetch("http://127.0.0.1:8000/projects", {
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
    const response = await fetch(`http://127.0.0.1:8000/projects/${id}`, {
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
    const response = await fetch(`http://127.0.0.1:8000/projects/${id}`, {
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
