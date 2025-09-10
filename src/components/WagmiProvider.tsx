"use client";

import { WagmiProvider as WagmiProviderBase, createConfig, http } from "wagmi";
import { mainnet, sepolia, polygon, polygonMumbai, arbitrum, arbitrumSepolia, optimism, optimismSepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const config = createConfig({
  chains: [mainnet, sepolia, polygon, polygonMumbai, arbitrum, arbitrumSepolia, optimism, optimismSepolia],
  connectors: [
    injected(),
    walletConnect({ projectId: "YOUR_PROJECT_ID" }),
  ],
  transports: {
    [mainnet.id]: http("https://eth-mainnet.g.alchemy.com/v2/demo"),
    [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/demo"),
    [polygon.id]: http("https://polygon-rpc.com"),
    [polygonMumbai.id]: http("https://rpc-mumbai.maticvigil.com"),
    [arbitrum.id]: http("https://arb1.arbitrum.io/rpc"),
    [arbitrumSepolia.id]: http("https://sepolia-rollup.arbitrum.io/rpc"),
    [optimism.id]: http("https://mainnet.optimism.io"),
    [optimismSepolia.id]: http("https://sepolia.optimism.io"),
  },
});

const queryClient = new QueryClient();

export default function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProviderBase config={config}>
        {children}
      </WagmiProviderBase>
    </QueryClientProvider>
  );
} 