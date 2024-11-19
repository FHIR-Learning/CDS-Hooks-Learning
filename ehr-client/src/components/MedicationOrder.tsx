import React, { useState } from "react";
import MedicationSearch from "./MedicationSearch";
import axios from "axios";
import { getPatientById } from "../services/fhirService";

const MedicationOrder: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("12345"); // Ejemplo de ID de paciente
  const [selectedMedication, setSelectedMedication] = useState<any>(null);

  const cdsServiceUrls = [
    process.env.REACT_APP_CDS_SERVICE_URL_3 ||
      "http://localhost:3001/cds-services/medication-prescribe-service",
  ];

  const handleMedicationSelect = async (medication: any) => {
    setSelectedMedication(medication);
    try {
      const patient = await getPatientById(selectedPatientId);
      const response = await axios.post(
        "http://localhost:3001/cds-services/order-select-service",
        {
          hookInstance: "unique-hook-instance-id",
          hook: "order-select",
          context: {
            userId: "Practitioner/123",
            patientId: selectedPatientId,
            selections: [`Medication/${medication.id}`],
          },
          prefetch: {
            patient,
          },
        }
      );

      console.log("Respuesta del CDS Service:", response.data);
      // Maneja la respuesta (por ejemplo, mostrar una alerta si hay alergias)
      if (response.data.cards.length > 0) {
        alert(response.data.cards[0].summary);
      }
    } catch (error) {
      console.error("Error al verificar alergias:", error);
    }
  };

  return (
    <div>
      <h2>Buscar y seleccionar medicación para el paciente</h2>
      <MedicationSearch onSelectMedication={handleMedicationSelect} />
      {selectedMedication && (
        <div>
          <h3>Medicamento seleccionado:</h3>
          <p>
            {selectedMedication.code?.text ||
              selectedMedication.code?.coding[0]?.display}
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicationOrder;
