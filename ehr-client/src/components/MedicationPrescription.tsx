import React, { useState } from "react";
import MedicationSearch from "./MedicationSearch";
import axios from "axios";

interface MedicationPrescriptionProps {
  patientId: string;
  onBackToDetails: () => void;
}

const MedicationPrescription: React.FC<MedicationPrescriptionProps> = ({
  patientId,
  onBackToDetails,
}) => {
  const [selectedMedication, setSelectedMedication] = useState<any | null>(
    null
  );
  const [cdsCards, setCdsCards] = useState<any[]>([]);
  const cdsServiceUrl =
    process.env.REACT_APP_CDS_SERVICE_URL_3 ||
    "http://localhost:3001/cds-services/check-allergy";

  const handleMedicationSelect = (medication: any) => {
    setSelectedMedication(medication);
  };

  const handleSubmit = async () => {
    if (!selectedMedication) {
      console.warn("No se ha seleccionado ningún medicamento.");
      return;
    }

    const draftOrders = {
      resourceType: "Bundle",
      entry: [
        {
          resource: {
            resourceType: "MedicationRequest",
            status: "draft",
            intent: "order",
            subject: { reference: `Patient/${patientId}` },
            medicationCodeableConcept: selectedMedication.code,
          },
        },
      ],
    };

    try {
      const response = await axios.post(cdsServiceUrl, {
        hook: "order-select",
        context: {
          userId: "Practitioner/123",
          patientId: patientId,
          draftOrders,
        },
        fhirServerUrl: process.env.REACT_APP_FHIR_SERVER_URL,
      });

      setCdsCards(response.data.cards);
    } catch (error) {
      console.error("Error al enviar los draftOrders:", error);
    }
  };

  return (
    <div>
      <h2>Prescripción de Medicamentos</h2>
      <button onClick={onBackToDetails} className="back-button">
        Volver a Detalles del Paciente
      </button>
      <MedicationSearch onSelectMedication={handleMedicationSelect} />

      <button onClick={handleSubmit} className="submit-button">
        Enviar órdenes al CDS
      </button>
      {cdsCards.length > 0 && (
        <div>
          <h3>Recomendaciones CDS</h3>
          {cdsCards.map((card, index) => (
            <div key={index}>
              <p>{card.summary}</p>
              {card.detail && <p>{card.detail}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationPrescription;
