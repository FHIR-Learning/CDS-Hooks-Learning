import axios from "axios";

const fhirServerUrl =
  process.env.REACT_APP_FHIR_SERVER_URL || "http://localhost:8080/fhir";

export const getPatients = async () => {
  const response = await axios.get(`${fhirServerUrl}/Patient`);
  return response.data.entry.map((entry: any) => entry.resource);
};

export const getPatientById = async (id: string) => {
  const response = await axios.get(`${fhirServerUrl}/Patient/${id}`);
  return response.data;
};

export const getMedications = async (query: string) => {
  try {
    const response = await axios.get(`${fhirServerUrl}/Medication`, {
      params: {
        _content: query,
      },
    });
    return response.data.entry
      ? response.data.entry.map((entry: any) => entry.resource)
      : [];
  } catch (error) {
    console.error("Error al obtener medicamentos:", error);
    throw error;
  }
};
