// Simulación de una base de datos en memoria para reportes
let reports: any[] = [
  {
    id: 1,
    name: "nombre prueba",
    projectName: "Paciente A - Evaluación Inicial",
    patientId: "PAC-001",
    date: "15/04/2025",
    imageCount: 3,
    projectId: "1",
    angles: [
      { name: "Ángulo de Hallux Valgus", value: "23°" },
      { name: "Ángulo Intermetatarsiano", value: "12°" },
      { name: "Ángulo PASA", value: "8°" },
      { name: "Ángulo DASA", value: "6°" },
    ],
    notes: "El paciente presenta un hallux valgus moderado en el pie derecho.",
  },
  {
    id: 2,
    name: "nombre prueba",
    projectName: "Paciente A - Evaluación Inicial",
    patientId: "PAC-001",
    date: "15/04/2025",
    imageCount: 1,
    projectId: "1",
    angles: [
      { name: "Ángulo de Hallux Valgus", value: "18°" },
      { name: "Ángulo Intermetatarsiano", value: "10°" },
      { name: "Ángulo PASA", value: "7°" },
      { name: "Ángulo DASA", value: "5°" },
    ],
    notes: "Seguimiento del paciente A, se observa mejoría.",
  },
  {
    id: 3,
    name: "nombre prueba",
    projectName: "Paciente B - Seguimiento",
    patientId: "PAC-002",
    date: "10/04/2025",
    imageCount: 2,
    projectId: "2",
    angles: [
      { name: "Ángulo de Hallux Valgus", value: "15°" },
      { name: "Ángulo Intermetatarsiano", value: "9°" },
      { name: "Ángulo PASA", value: "6°" },
      { name: "Ángulo DASA", value: "4°" },
    ],
    notes: "Evaluación de seguimiento del paciente B.",
  },
  {
    id: 4,
    name: "nombre prueba",
    projectName: "Paciente C - Post-operatorio",
    patientId: "PAC-003",
    date: "05/04/2025",
    imageCount: 4,
    projectId: "3",
    angles: [
      { name: "Ángulo de Hallux Valgus", value: "8°" },
      { name: "Ángulo Intermetatarsiano", value: "7°" },
      { name: "Ángulo PASA", value: "5°" },
      { name: "Ángulo DASA", value: "3°" },
    ],
    notes: "Evaluación post-operatoria, resultados satisfactorios.",
  },
  {
    id: 5,
    name: "nombre prueba",
    projectName: "Paciente D - Evaluación Pre-quirúrgica",
    patientId: "PAC-004",
    date: "01/04/2025",
    imageCount: 2,
    projectId: "4",
    angles: [
      { name: "Ángulo de Hallux Valgus", value: "28°" },
      { name: "Ángulo Intermetatarsiano", value: "15°" },
      { name: "Ángulo PASA", value: "10°" },
      { name: "Ángulo DASA", value: "8°" },
    ],
    notes: "Evaluación pre-quirúrgica, se recomienda intervención.",
  },
]

// Función para obtener todos los reportes
export async function getReports() {
  try {
    const response = await fetch("http://127.0.0.1:8000/reports");
    if (!response.ok) {
      throw new Error("Error al obtener los reportes");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return [];
  }
}

// Función para obtener reportes por ID de proyecto
export async function getReportsByProjectId(projectId: string) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/reports/by_project/${projectId}`);
    if (!response.ok) {
      throw new Error("No se pudieron obtener los reportes");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener reportes por projectId:", error);
    return [];
  }
}

export async function getReportById(reportId: string) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/reports/${reportId}`);
    if (!response.ok) {
      throw new Error("Reporte no encontrado");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    return null;
  }
}

// Función para eliminar un reporte
export async function deleteReport(id: number | string) {
  const numericId = typeof id === "string" ? parseInt(id) : id

  try {
    const response = await fetch(`http://127.0.0.1:8000/reports/${numericId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("No se pudo eliminar el reporte")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error al eliminar reporte:", error)
    return null
  }
}

// Función para crear un nuevo reporte
export async function createReport(reportData: any) {
  try {
    console.log(reportData)
    const response = await fetch("http://127.0.0.1:8000/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    })

    if (!response.ok) {
      throw new Error("Error al crear el reporte")
    }

    const newId = await response.json()
    return newId
  } catch (error) {
    console.error("Error al crear reporte:", error)
    return null
  }
}

// Función para actualizar un reporte existente
export async function updateReport(id: number | string, reportData: any) {
  const numericId = typeof id === "string" ? Number.parseInt(id) : id

  try {
    const response = await fetch(`http://127.0.0.1:8000/reports/${numericId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    })

    if (!response.ok) {
      throw new Error("Error al actualizar el reporte")
    }

    const updatedReport = await response.json()
    return updatedReport
  } catch (error) {
    console.error("Error al actualizar el reporte:", error)
    return null
  }
}
