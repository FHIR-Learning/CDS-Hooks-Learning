import React, { useState } from "react";
import PatientList from "./components/PatientList";
import PatientDetails from "./components/PatientDetails";
import "./styles.css";

const App: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );

  return (
    <div>
      {!selectedPatientId ? (
        <PatientList onSelectPatient={setSelectedPatientId} />
      ) : (
        <PatientDetails
          id={selectedPatientId}
          onBack={() => setSelectedPatientId(null)}
        />
      )}
    </div>
  );
};

export default App;
