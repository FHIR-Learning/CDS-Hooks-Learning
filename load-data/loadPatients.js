const axios = require("axios");
const fs = require("fs");

const fhirServerUrl =
  process.env.FHIR_SERVER_URL || "http://localhost:8080/fhir";

// Leer el archivo de pacientes
const patients = JSON.parse(fs.readFileSync("patients.json", "utf-8"));

// Función para verificar si un paciente ya existe en el servidor FHIR
const patientExists = async (id) => {
  try {
    const response = await axios.get(`${fhirServerUrl}/Patient/${id}`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Función para cargar cada paciente al servidor FHIR si no existe
const loadPatients = async () => {
  for (const patient of patients) {
    const exists = await patientExists(patient.id);
    if (!exists) {
      try {
        const response = await axios.put(
          `${fhirServerUrl}/Patient/${patient.id}`,
          patient,
          {
            headers: {
              "Content-Type": "application/fhir+json",
            },
          }
        );
        console.log(
          `Paciente ${patient.id} cargado con éxito: ${response.status}`
        );
      } catch (error) {
        console.error(
          `Error al cargar el paciente ${patient.id}:`,
          error.response ? error.response.data : error.message
        );
      }
    } else {
      console.log(`Paciente ${patient.id} ya existe. No se carga nuevamente.`);
    }
  }
};

// Ejecutar la carga de pacientes
loadPatients().then(() => {
  console.log("Proceso de carga de pacientes finalizado.");
  process.exit(0); // Finaliza el script
});
