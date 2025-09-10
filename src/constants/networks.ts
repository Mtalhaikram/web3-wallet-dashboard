export const NETWORKS = [
  { id: 1, name: "Ethereum Mainnet", symbol: "ETH", icon: "🔷", isTestnet: false },
  { id: 11155111, name: "Sepolia Testnet", symbol: "ETH", icon: "🧪", isTestnet: true },
  { id: 137, name: "Polygon", symbol: "MATIC", icon: "🟣", isTestnet: false },
  { id: 80001, name: "Polygon Mumbai", symbol: "MATIC", icon: "🧪", isTestnet: true },
  { id: 42161, name: "Arbitrum One", symbol: "ETH", icon: "🔵", isTestnet: false },
  { id: 421614, name: "Arbitrum Sepolia", symbol: "ETH", icon: "🧪", isTestnet: true },
  { id: 10, name: "Optimism", symbol: "ETH", icon: "🔴", isTestnet: false },
  { id: 11155420, name: "Optimism Sepolia", symbol: "ETH", icon: "🧪", isTestnet: true },
] as const;

export type NetworkId = typeof NETWORKS[number]['id'];
export type Network = typeof NETWORKS[number];

export const getNetworkById = (id: number): Network | undefined => {
  return NETWORKS.find(network => network.id === id);
};

export const getNetworkName = (id: number): string => {
  return getNetworkById(id)?.name || "Unknown Network";
};

export const getNetworkSymbol = (id: number): string => {
  return getNetworkById(id)?.symbol || "Unknown";
};

export const getNetworkIcon = (id: number): string => {
  return getNetworkById(id)?.icon || "❓";
}; 