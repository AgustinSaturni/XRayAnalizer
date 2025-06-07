const BASE_URL = "https://xrayanalizer-back-end.onrender.com/reports";

// Función para obtener todos los reportes
export async function getReports() {
  try {
    const response = await fetch(`${BASE_URL}`);
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
    const response = await fetch(`${BASE_URL}/by_project/${projectId}`);
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

// Función para obtener un reporte por ID
export async function getReportById(reportId: string) {
  try {
    const response = await fetch(`${BASE_URL}/${reportId}`);
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
  const numericId = typeof id === "string" ? parseInt(id) : id;

  try {
    const response = await fetch(`${BASE_URL}/${numericId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("No se pudo eliminar el reporte");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al eliminar reporte:", error);
    return null;
  }
}

// Función para crear un nuevo reporte
export async function createReport(reportData: any) {
  try {
    console.log(reportData);
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      throw new Error("Error al crear el reporte");
    }

    const newId = await response.json();
    return newId;
  } catch (error) {
    console.error("Error al crear reporte:", error);
    return null;
  }
}

// Función para actualizar un reporte existente
export async function updateReport(id: number | string, reportData: any) {
  const numericId = typeof id === "string" ? Number.parseInt(id) : id;

  try {
    const response = await fetch(`${BASE_URL}/${numericId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el reporte");
    }

    const updatedReport = await response.json();
    return updatedReport;
  } catch (error) {
    console.error("Error al actualizar el reporte:", error);
    return null;
  }
}
