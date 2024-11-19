import React, { useState } from "react";
import PatientList from "./components/PatientList";
import PatientDetails from "./components/PatientDetails";
import MedicationPrescription from "./components/MedicationPrescription";
import "./styles.css";

const App: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );

  const [showPrescription, setShowPrescription] = useState<boolean>(false);

  const handlePrescribePatient = (id: string) => {
    setSelectedPatientId(id);
    setShowPrescription(true);
  };

  return (
    <div>
      {!selectedPatientId ? (
        <PatientList onSelectPatient={setSelectedPatientId} />
      ) : showPrescription ? (
        <MedicationPrescription
          patientId={selectedPatientId}
          onBackToDetails={() => setShowPrescription(false)}
        />
      ) : (
        <PatientDetails
          id={selectedPatientId}
          onBack={() => setSelectedPatientId(null)}
          onPrescribe={handlePrescribePatient} // Pasar la función onPrescribe
        />
      )}
    </div>
  );
};

export default App;
