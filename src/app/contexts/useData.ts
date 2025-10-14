import { useContext } from "react";
import { DataContext, type LandingDataValue } from "./DataContext";

export const useData = (): LandingDataValue => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within <DataProvider>");
  }
  return ctx;
};









