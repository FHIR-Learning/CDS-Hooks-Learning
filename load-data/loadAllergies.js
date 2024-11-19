const axios = require("axios");
const fs = require("fs");

const fhirServerUrl =
  process.env.FHIR_SERVER_URL || "http://localhost:8080/fhir";

const allergies = JSON.parse(fs.readFileSync("allergies.json", "utf8"));

const allergyExists = async (id) => {
  try {
    const response = await axios.get(
      `${fhirServerUrl}/AllergyIntolerance/${id}`
    );
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

const loadAllergies = async () => {
  for (const allergy of allergies) {
    const exists = await allergyExists(allergy.id);
    if (!exists) {
      try {
        const response = await axios.put(
          `${fhirServerUrl}/AllergyIntolerance/${allergy.id}`,
          allergy,
          {
            headers: {
              "Content-Type": "application/fhir+json",
            },
          }
        );
        console.log(
          `Alergia ${allergy.id} cargada con éxito: ${response.status}`
        );
      } catch (error) {
        console.error(
          `Error al cargar la alergia ${allergy.id}:`,
          error.response ? error.response.data : error.message
        );
      }
    } else {
      console.log(`Alergia ${allergy.id} ya existe. No se carga nuevamente.`);
    }
  }
};

loadAllergies().then(() => {
  console.log("Proceso de carga de alergias finalizado.");
  process.exit(0);
});
