"use client";

import { useChainId, useSwitchChain } from "wagmi";
import { useState } from "react";
import { NETWORKS } from "@/constants/networks";

export default function NetworkSwitcher() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const [isOpen, setIsOpen] = useState(false);

  // Check if current network is supported - declare this first
  const isSupportedNetwork = NETWORKS.some(network => network.id === chainId);
  const isConnected = chainId !== undefined;

  const currentNetwork = NETWORKS.find(network => network.id === chainId) || NETWORKS[0];

  // Get current network display info
  const getCurrentNetworkDisplay = () => {
    if (isSupportedNetwork) {
      return {
        name: currentNetwork.name,
        symbol: currentNetwork.symbol,
        icon: currentNetwork.icon,
        isTestnet: currentNetwork.isTestnet
      };
    } else {
      return {
        name: `Unknown Network (${chainId})`,
        symbol: "???",
        icon: "❓",
        isTestnet: false
      };
    }
  };

  const currentNetworkDisplay = getCurrentNetworkDisplay();

  const handleNetworkSwitch = (networkChainId: number) => {
    if (switchChain) {
      switchChain({ chainId: networkChainId });
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Network Status */}
      {isConnected && (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isSupportedNetwork 
            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" 
            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
        }`}>
          <span className="mr-2">{isSupportedNetwork ? "✅" : "❌"}</span>
          {isSupportedNetwork ? "Supported Network" : "Unsupported Network"}
        </div>
      )}

      {/* Network Status Indicator */}
      {!isSupportedNetwork && (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-2xl">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">Unsupported Network</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                You&apos;re connected to an unsupported network (Chain ID: {chainId}). 
                This application only supports the networks listed below.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {NETWORKS.slice(0, 4).map((network) => (
                  <span key={network.id} className="inline-flex items-center px-3 py-1 bg-red-100 dark:bg-red-800/50 text-red-800 dark:text-red-200 text-sm rounded-full border border-red-200 dark:border-red-700">
                    {network.icon} {network.name}
                  </span>
                ))}
                {NETWORKS.length > 4 && (
                  <span className="inline-flex items-center px-3 py-1 bg-red-100 dark:bg-red-800/50 text-red-800 dark:text-red-200 text-sm rounded-full border border-red-200 dark:border-red-700">
                    +{NETWORKS.length - 4} more
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="btn-destructive px-6 py-3"
              >
                Switch to Supported Network
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Network Switcher Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-200 cursor-pointer w-full ${
            isSupportedNetwork 
              ? "bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600 shadow-lg hover:shadow-xl" 
              : "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border-2 border-red-300 dark:border-red-700 shadow-lg hover:shadow-xl"
          }`}
        >
          <span className="text-2xl">{currentNetworkDisplay.icon}</span>
          <div className="flex-1 text-left">
            <div className={`font-semibold text-lg ${!isSupportedNetwork ? "text-red-700 dark:text-red-200" : "text-gray-900 dark:text-white"}`}>
              {currentNetworkDisplay.name}
            </div>
            <div className={`text-sm ${!isSupportedNetwork ? "text-red-600 dark:text-red-300" : "text-gray-500 dark:text-gray-400"}`}>
              {currentNetworkDisplay.symbol}
            </div>
          </div>
          {!isSupportedNetwork && (
            <span className="text-red-500 dark:text-red-400 text-xs bg-red-200 dark:bg-red-800 px-3 py-1 rounded-full font-medium">
              Unsupported
            </span>
          )}
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${
              !isSupportedNetwork ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-3 w-full max-w-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-slate-600">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Select Network</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose the network you want to connect to</p>
              {!isSupportedNetwork && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
                  <div className="text-xs text-red-700 dark:text-red-300 font-medium">
                    <strong>Current network not supported.</strong> Please select one of the supported networks below.
                  </div>
                </div>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {NETWORKS.map((network) => (
                <button
                  key={network.id}
                  onClick={() => handleNetworkSwitch(network.id)}
                  disabled={isPending || chainId === network.id}
                  className={`w-full flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 ${
                    chainId === network.id 
                      ? isSupportedNetwork 
                        ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500" 
                        : "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500"
                      : ""
                  } ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span className="text-2xl">{network.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <span>{network.name}</span>
                      {network.isTestnet && (
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full font-medium">
                          Testnet
                        </span>
                      )}
                      {chainId === network.id && !isSupportedNetwork && (
                        <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded-full font-medium">
                          Current (Unsupported)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{network.symbol}</div>
                  </div>
                  {chainId === network.id && (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isSupportedNetwork ? "bg-blue-500" : "bg-red-500"
                    }`}>
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Note: Switching networks may require wallet approval
              </p>
              {!isSupportedNetwork && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
                  ⚠️ You&apos;re currently on an unsupported network. Switch to a supported network to use all features.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Backdrop to close dropdown when clicking outside */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
} 