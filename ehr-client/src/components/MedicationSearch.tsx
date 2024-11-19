import React, { useState, ChangeEvent } from "react";
import { getMedications } from "../services/fhirService";

interface MedicationSearchProps {
  onSelectMedication: (medication: any) => void;
}

const MedicationSearch: React.FC<MedicationSearchProps> = ({
  onSelectMedication,
}) => {
  const [query, setQuery] = useState("");
  const [medications, setMedications] = useState<any[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<any | null>(
    null
  );

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 2) {
      const results = await getMedications(e.target.value);
      setMedications(results);
    } else {
      setMedications([]);
    }
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedMed = medications.find((med) => med.id === selectedId);
    setSelectedMedication(selectedMed);
    if (selectedMed) {
      onSelectMedication(selectedMed); // Llamada al callback para manejar el medicamento seleccionado
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar medicación"
        value={query}
        onChange={handleSearch}
      />
      {medications.length > 0 && (
        <select value={selectedMedication?.id || ""} onChange={handleSelect}>
          <option value="" disabled>
            Seleccione un medicamento
          </option>
          {medications.map((med, index) => (
            <option key={index} value={med.id}>
              {med.code?.text || med.code?.coding[0]?.display}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default MedicationSearch;
