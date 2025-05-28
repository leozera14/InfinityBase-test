export const SUPPORTED_NETWORKS = [
  {
    name: "Fuel Sepolia Testnet",
    url: "https://testnet.fuel.network/v1/graphql",
    explorer: "https://app-testnet.fuel.network",
    contractId: import.meta.env.VITE_CONTRACT_ID_SEPOLIA!,
  },
  {
    name: "Beta-2 Testnet",
    url: "https://devnet.fuel.network/v1/graphql",
    explorer: "https://app-devnet.fuel.network",
    contractId: import.meta.env.VITE_CONTRACT_ID_BETA2!,
  },
  {
    name: "Fuel Mainnet",
    url: "https://mainnet.fuel.network/v1/graphql",
    explorer: "https://app.fuel.network",
    contractId: "",
  },
];
