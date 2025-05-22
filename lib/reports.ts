// Simulación de una base de datos en memoria para reportes
let reports: any[] = [
  {
    id: 1,
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
  // Simulamos una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...reports])
    }, 500)
  })
}

// Función para obtener reportes por ID de proyecto
export async function getReportsByProjectId(projectId: string) {
  // Simulamos una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredReports = reports.filter((r) => r.projectId === projectId)
      resolve([...filteredReports])
    }, 500)
  })
}

// Función para obtener un reporte por ID
export async function getReport(id: number | string) {
  // Convertimos id a número si es string
  const numericId = typeof id === "string" ? Number.parseInt(id) : id

  // Simulamos una llamada a la API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const report = reports.find((r) => r.id === numericId)
      if (report) {
        resolve({ ...report })
      } else {
        reject(new Error("Reporte no encontrado"))
      }
    }, 500)
  })
}

// Función para eliminar un reporte
export async function deleteReport(id: number | string) {
  // Convertimos id a número si es string
  const numericId = typeof id === "string" ? Number.parseInt(id) : id

  // Simulamos una llamada a la API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = reports.findIndex((r) => r.id === numericId)
      if (index !== -1) {
        // Guardamos una copia del reporte antes de eliminarlo
        const deletedReport = { ...reports[index] }

        // Eliminamos el reporte
        reports = reports.filter((r) => r.id !== numericId)

        // Actualizamos el contador de reportes en el proyecto correspondiente
        // Esto sería una operación en cascada en una base de datos real
        // Aquí lo simulamos para mantener la consistencia de los datos
        import("./projects").then(({ getProject, updateProject }) => {
          getProject(deletedReport.projectId).then((project) => {
            if (project && project.reportCount > 0) {
              updateProject(deletedReport.projectId, {
                reportCount: project.reportCount - 1,
              })
            }
          })
        })

        resolve(deletedReport)
      } else {
        reject(new Error("Reporte no encontrado"))
      }
    }, 1000)
  })
}

// Función para crear un nuevo reporte
export async function createReport(reportData: any) {
  // Simulamos una llamada a la API
  return new Promise<number>((resolve) => {
    setTimeout(() => {
      // Generamos un ID único para el nuevo reporte
      const newId = Math.max(...reports.map((r) => r.id), 0) + 1

      const newReport = {
        id: newId,
        ...reportData,
        date: new Date().toLocaleDateString("es-ES"),
      }

      reports.push(newReport)

      // Actualizamos el contador de reportes en el proyecto correspondiente
      import("./projects").then(({ getProject, updateProject }) => {
        getProject(reportData.projectId).then((project) => {
          if (project) {
            updateProject(reportData.projectId, {
              reportCount: (project.reportCount || 0) + 1,
            })
          }
        })
      })

      resolve(newId)
    }, 1000)
  })
}

// Función para actualizar un reporte existente
export async function updateReport(id: number | string, reportData: any) {
  // Convertimos id a número si es string
  const numericId = typeof id === "string" ? Number.parseInt(id) : id

  // Simulamos una llamada a la API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = reports.findIndex((r) => r.id === numericId)
      if (index !== -1) {
        // Actualizamos solo los campos proporcionados, manteniendo el resto
        reports[index] = { ...reports[index], ...reportData }
        resolve({ ...reports[index] })
      } else {
        reject(new Error("Reporte no encontrado"))
      }
    }, 1000)
  })
}
