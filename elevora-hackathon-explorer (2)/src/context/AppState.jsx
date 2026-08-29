import { createContext, useContext, useState } from "react";

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [team, setTeam] = useState([]);
  const [validatorResult, setValidatorResult] = useState(null);
  const [demoCoachResult, setDemoCoachResult] = useState(null);

  const addTeamMember = (student) => {
    setTeam((prev) => (prev.find((m) => m.id === student.id) ? prev : [...prev, student]));
  };

  const removeTeamMember = (id) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <AppStateContext.Provider
      value={{
        selectedHackathon,
        setSelectedHackathon,
        team,
        addTeamMember,
        removeTeamMember,
        validatorResult,
        setValidatorResult,
        demoCoachResult,
        setDemoCoachResult,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
