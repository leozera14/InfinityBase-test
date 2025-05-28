import React from "react";
import { FuelProvider } from "@fuels/react";
import { defaultConnectors } from "@fuels/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SUPPORTED_NETWORKS } from "../constants/supported-networks";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <FuelProvider
        fuelConfig={{
          connectors: defaultConnectors({ devMode: true }),
        }}
        networks={SUPPORTED_NETWORKS}
        ui={false}
      >
        {children}
      </FuelProvider>
    </QueryClientProvider>
  );
}
