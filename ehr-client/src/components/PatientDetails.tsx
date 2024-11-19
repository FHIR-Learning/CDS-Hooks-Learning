import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css";

interface PatientDetailsProps {
  id: string;
  onBack: () => void; // Prop para manejar la acción de volver
}

const fhirServerUrl =
  process.env.REACT_APP_FHIR_SERVER_URL || "http://localhost:8080/fhir";
const cdsServiceUrls = [
  process.env.REACT_APP_CDS_SERVICE_URL_1 ||
    "http://localhost:3001/cds-services/patient-view-service",
  process.env.REACT_APP_CDS_SERVICE_URL_2 ||
    "http://localhost:3001/cds-services/patient-view-reminder",
];

const PatientDetails: React.FC<PatientDetailsProps> = ({ id, onBack }) => {
  const [patient, setPatient] = useState<any>(null);
  const [cdsResponses, setCdsResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`${fhirServerUrl}/Patient/${id}`);
        setPatient(response.data);

        // Llamar a ambos hooks y combinar las respuestas
        const cdsResponsesPromises = cdsServiceUrls.map((url) =>
          axios.post(url, {
            hookInstance: "12345-uuid",
            hook: "patient-view",
            context: {
              patientId: id,
              userId: "Practitioner/123",
            },
            prefetch: {
              patient: response.data,
            },
          })
        );

        const responses = await Promise.all(cdsResponsesPromises);
        const combinedResponses = responses.flatMap(
          (res) => res.data.cards || []
        );
        setCdsResponses(combinedResponses);
      } catch (error) {
        console.error("Error fetching patient details or CDS response:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientDetails();
  }, [id]);

  return (
    <div className="details-card">
      <button onClick={onBack} className="back-button">
        Volver a la lista de pacientes
      </button>
      {loading ? (
        <div className="loading">Cargando detalles del paciente...</div>
      ) : patient ? (
        <>
          <h3>Detalles del Paciente</h3>
          <p>
            <strong>ID:</strong> {patient.id}
          </p>
          <p>
            <strong>Nombre:</strong> {patient.name[0].given.join(" ")}{" "}
            {patient.name[0].family}
          </p>
          <p>
            <strong>Género:</strong> {patient.gender}
          </p>
          <p>
            <strong>Fecha de Nacimiento:</strong> {patient.birthDate}
          </p>

          {cdsResponses.length > 0 && (
            <div className="cds-response-container">
              <h4>Recomendaciones del CDS</h4>
              {cdsResponses.map((card, index) => (
                <div
                  className={`cds-card cds-card-${card.indicator}`}
                  key={index}
                >
                  <h5>{card.summary}</h5>
                  {card.detail && <p>{card.detail}</p>}
                  {card.source && (
                    <div className="cds-card-source">
                      <small>
                        <strong>Fuente:</strong> {card.source.label}
                      </small>
                      {card.source.url && (
                        <a
                          href={card.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver más
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="loading">No se encontraron detalles del paciente.</div>
      )}
    </div>
  );
};

export default PatientDetails;
