import React, { useMemo, useState, PropsWithChildren } from "react";
import { DataContext, LandingDataValue } from "./DataContext";

export const DataProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [opacity, setOpacity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const value = useMemo<LandingDataValue>(
    () => ({
      opacity,
      setOpacity,
      isLoading,
      setIsLoading,
    }),
    [opacity, isLoading],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
