"use client";

import { useAccount, useBalance, useChainId } from "wagmi";
import { getNetworkById, NETWORKS } from "@/constants/networks";

export default function Balance() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data, isLoading, isError } = useBalance({ address });

  const currentNetwork = getNetworkById(chainId);
  const isSupportedNetwork = NETWORKS.some(network => network.id === chainId);

  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-600 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-2xl">💰</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Loading balance...</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Fetching balance data</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">❌</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-red-700 dark:text-red-300">Failed to fetch balance</div>
            <div className="text-xs text-red-500 dark:text-red-400">Unable to load balance information</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-600 shadow-lg card-hover">
      {!isSupportedNetwork && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
            <span className="text-sm">⚠️</span>
            <span className="text-xs font-medium">Unsupported Network:</span>
          </div>
          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
            Balance information may not be accurate on this network.
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-2xl">{currentNetwork?.icon || "❓"}</span>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-900 dark:text-white text-lg">
            {currentNetwork?.name || "Unknown Network"}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {currentNetwork?.symbol || "Unknown"}
          </div>
        </div>
        {!isSupportedNetwork && (
          <span className="text-xs bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded-full font-medium">
            Unsupported
          </span>
        )}
      </div>
      
      <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Balance</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {data?.formatted} {data?.symbol}
        </div>
      </div>
    </div>
  );
}
