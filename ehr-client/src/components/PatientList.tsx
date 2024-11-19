import React, { useState, useEffect } from "react";
import { getPatients } from "../services/fhirService";
import "../styles.css";

interface Patient {
  id: string;
  name: { family: string; given: string[] }[];
  gender: string;
  birthDate: string;
}

const PatientList: React.FC<{ onSelectPatient: (id: string) => void }> = ({
  onSelectPatient,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="container">
      <div className="header">Lista de Pacientes</div>
      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <table className="patient-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Género</th>
              <th>Fecha de Nacimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{`${patient.name[0].given.join(" ")} ${
                  patient.name[0].family
                }`}</td>
                <td>{patient.gender}</td>
                <td>{patient.birthDate}</td>
                <td>
                  <button
                    onClick={() => onSelectPatient(patient.id)}
                    className="view-button"
                  >
                    Ver Ficha
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientList;
