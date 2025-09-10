"use client";

import { useAccount, useBalance, useChainId } from "wagmi";
import { getNetworkById, NETWORKS } from "@/constants/networks";

export default function Balance() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data, isLoading, isError } = useBalance({ address });

  const currentNetwork = getNetworkById(chainId);
  const isSupportedNetwork = NETWORKS.some(network => network.id === chainId);

  if (isLoading) return <p>Fetching balance...</p>;
  if (isError) return <p>Failed to fetch balance</p>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      {!isSupportedNetwork && (
        <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-700">
          ⚠️ <strong>Unsupported Network:</strong> Balance information may not be accurate on this network.
        </div>
      )}
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-lg">{currentNetwork?.icon || "❓"}</span>
        <span className="font-medium text-sm">{currentNetwork?.name || "Unknown Network"}</span>
        {!isSupportedNetwork && (
          <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
            Unsupported
          </span>
        )}
      </div>
      <p className="text-sm">Balance: <strong>{data?.formatted} {data?.symbol}</strong></p>
    </div>
  );
}
