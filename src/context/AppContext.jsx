
import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  initialPonds,
  initialGrowthRecords,
} from "../utils/data.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [ponds, setPonds] = useState(initialPonds);
  const [growthRecords, setGrowthRecords] = useState(
    initialGrowthRecords
  );

  function addPond(pondData) {
    const newPond = {
      ...pondData,
      id: Date.now(),
      area: Number(pondData.area),
      fishCount: Number(pondData.fishCount),
      ph: null,
      averageWeight: null,
      feedToday: 0,
    };

    setPonds((previous) => [...previous, newPond]);
  }

  function updatePond(id, updatedData) {
    setPonds((previous) =>
      previous.map((pond) =>
        pond.id === id
          ? {
              ...pond,
              ...updatedData,
              area: Number(updatedData.area),
              fishCount: Number(updatedData.fishCount),
            }
          : pond
      )
    );
  }

  function deletePond(id) {
    setPonds((previous) =>
      previous.filter((pond) => pond.id !== id)
    );
  }

  function addGrowthRecord(recordData) {
    const newRecord = {
      ...recordData,
      id: Date.now(),
      ph: Number(recordData.ph),
      weight: Number(recordData.weight),
      mortality: Number(recordData.mortality),
      createdAt: Date.now(),
    };

    setGrowthRecords((previous) => [
      newRecord,
      ...previous,
    ]);
  }

  function updateGrowthRecord(id, updatedData) {
    const record = growthRecords.find(
      (item) => item.id === id
    );

    if (!record) return;

    const elapsed = Date.now() - record.createdAt;

    // Data tidak boleh diubah setelah 1 jam.
    if (elapsed >= 60 * 60 * 1000) return;

    setGrowthRecords((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedData,
              ph: Number(updatedData.ph),
              weight: Number(updatedData.weight),
              mortality: Number(updatedData.mortality),
            }
          : item
      )
    );
  }

  function deleteGrowthRecord(id) {
    setGrowthRecords((previous) =>
      previous.filter((item) => item.id !== id)
    );
  }

  return (
    <AppContext.Provider
      value={{
        ponds,
        addPond,
        updatePond,
        deletePond,
        growthRecords,
        addGrowthRecord,
        updateGrowthRecord,
        deleteGrowthRecord,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppContext harus digunakan di dalam AppProvider"
    );
  }

  return context;
}