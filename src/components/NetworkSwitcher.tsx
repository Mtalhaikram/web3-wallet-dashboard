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
    <div className="space-y-2">
      {/* Current Network Status */}
      {isConnected && (
        <div className={`text-xs px-2 py-1 rounded-full inline-block ${
          isSupportedNetwork 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {isSupportedNetwork ? "✅ Supported Network" : "❌ Unsupported Network"}
        </div>
      )}

      {/* Network Status Indicator */}
      {!isSupportedNetwork && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700 mb-2">
            <span className="text-xl">⚠️</span>
            <span className="text-sm font-semibold">Unsupported Network</span>
          </div>
          <p className="text-sm text-red-600 mb-3">
            You&apos;re connected to an unsupported network (Chain ID: {chainId}). 
            This application only supports the networks listed below.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {NETWORKS.slice(0, 4).map((network) => (
              <span key={network.id} className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                {network.icon} {network.name}
              </span>
            ))}
            {NETWORKS.length > 4 && (
              <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                +{NETWORKS.length - 4} more
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            Switch to Supported Network
          </button>
        </div>
      )}

      {/* Network Switcher Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
            isSupportedNetwork 
              ? "bg-gray-100 hover:bg-gray-200" 
              : "bg-red-100 hover:bg-red-200 border-2 border-red-300"
          }`}
        >
          <span className="text-lg">{currentNetworkDisplay.icon}</span>
          <span className={`font-medium ${!isSupportedNetwork ? "text-red-700" : ""}`}>
            {currentNetworkDisplay.name}
          </span>
          <span className={`text-sm ${!isSupportedNetwork ? "text-red-600" : "text-gray-500"}`}>
            ({currentNetworkDisplay.symbol})
          </span>
          {!isSupportedNetwork && (
            <span className="text-red-500 text-xs bg-red-200 px-2 py-1 rounded-full">
              Unsupported
            </span>
          )}
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Select Network</h3>
              <p className="text-sm text-gray-500">Choose the network you want to connect to</p>
              {!isSupportedNetwork && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  <strong>Current network not supported.</strong> Please select one of the supported networks below.
                </div>
              )}
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {NETWORKS.map((network) => (
                <button
                  key={network.id}
                  onClick={() => handleNetworkSwitch(network.id)}
                  disabled={isPending || chainId === network.id}
                  className={`w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors ${
                    chainId === network.id 
                      ? isSupportedNetwork 
                        ? "bg-blue-50 border-l-4 border-blue-500" 
                        : "bg-red-50 border-l-4 border-red-500"
                      : ""
                  } ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span className="text-xl">{network.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 flex items-center space-x-2">
                      <span>{network.name}</span>
                      {network.isTestnet && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Testnet
                        </span>
                      )}
                      {chainId === network.id && !isSupportedNetwork && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          Current (Unsupported)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{network.symbol}</div>
                  </div>
                  {chainId === network.id && (
                    <span className={isSupportedNetwork ? "text-blue-500" : "text-red-500"}>✓</span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500">
                Note: Switching networks may require wallet approval
              </p>
              {!isSupportedNetwork && (
                <p className="text-xs text-red-600 mt-1 font-medium">
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