const axios = require("axios");
const fs = require("fs");

const fhirServerUrl =
  process.env.FHIR_SERVER_URL || "http://localhost:8080/fhir";

const medications = JSON.parse(fs.readFileSync("medications.json", "utf8"));

const medicationExists = async (id) => {
  try {
    const response = await axios.get(`${fhirServerUrl}/Medication/${id}`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

const loadMedications = async () => {
  for (const medication of medications) {
    const exists = await medicationExists(medication.id);
    if (!exists) {
      try {
        const response = await axios.put(
          `${fhirServerUrl}/Medication/${medication.id}`,
          medication,
          {
            headers: {
              "Content-Type": "application/fhir+json",
            },
          }
        );
        console.log(
          `Medicamento ${medication.id} cargado con éxito: ${response.status}`
        );
      } catch (error) {
        console.error(
          `Error al cargar el medicamento ${medication.id}:`,
          error.response ? error.response.data : error.message
        );
      }
    } else {
      console.log(
        `Medicamento ${medication.id} ya existe. No se carga nuevamente.`
      );
    }
  }
};

loadMedications().then(() => {
  console.log("Proceso de carga de medicamentos finalizado.");
  process.exit(0);
});
