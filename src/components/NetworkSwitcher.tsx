"use client";

import { useChainId, useSwitchChain } from "wagmi";
import { useState } from "react";
import { NETWORKS } from "@/constants/networks";

interface NetworkSwitcherProps {
  variant?: "header" | "full";
}

export default function NetworkSwitcher({ variant = "full" }: NetworkSwitcherProps) {
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

  // Header variant - compact design
  if (variant === "header") {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
            isSupportedNetwork 
              ? "bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#333333] shadow-sm hover:shadow-md hover:shadow-blue-500/10" 
              : "bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 shadow-sm hover:shadow-md hover:shadow-red-500/10"
          }`}
        >
          <span className="text-lg">{currentNetworkDisplay.icon}</span>
          <div className="hidden sm:block text-left">
            <div className={`text-sm font-medium ${!isSupportedNetwork ? "text-red-400" : "text-white"}`}>
              {currentNetworkDisplay.name.length > 12 ? 
                `${currentNetworkDisplay.name.substring(0, 12)}...` : 
                currentNetworkDisplay.name
              }
            </div>
            <div className={`text-xs ${!isSupportedNetwork ? "text-red-300" : "text-[#a0a0a0]"}`}>
              {currentNetworkDisplay.symbol}
            </div>
          </div>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${
              !isSupportedNetwork ? "text-red-400" : "text-[#a0a0a0]"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-80 sm:w-80 network-dropdown-mobile bg-[#1f1f1f] border border-[#333333] rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b border-[#333333]">
              <h3 className="font-bold text-white text-lg">Select Network</h3>
              <p className="text-sm text-[#a0a0a0] mt-1">Choose the network you want to connect to</p>
              {!isSupportedNetwork && (
                <div className="mt-3 p-3 bg-red-600/20 border border-red-600/30 rounded-lg">
                  <div className="text-xs text-red-400 font-medium">
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
                  className={`w-full flex items-center space-x-3 p-3 hover:bg-[#2a2a2a] transition-all duration-200 ${
                    chainId === network.id 
                      ? isSupportedNetwork 
                        ? "bg-blue-600/20 border-l-4 border-blue-500" 
                        : "bg-red-600/20 border-l-4 border-red-500"
                      : ""
                  } ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span className="text-xl">{network.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white flex items-center space-x-2">
                      <span>{network.name}</span>
                      {network.isTestnet && (
                        <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded-full font-medium">
                          Testnet
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[#a0a0a0]">{network.symbol}</div>
                  </div>
                  {chainId === network.id && (
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isSupportedNetwork ? "bg-blue-500" : "bg-red-500"
                    }`}>
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="p-3 border-t border-[#333333] bg-[#1a1a1a]">
              <p className="text-xs text-[#a0a0a0]">
                Note: Switching networks may require wallet approval
              </p>
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
    );
  }

  // Full variant - original design for settings page
  return (
    <div className="space-y-4">
      {/* Current Network Status */}
      {isConnected && (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isSupportedNetwork 
            ? "bg-green-600/20 text-green-400 border border-green-600/30" 
            : "bg-red-600/20 text-red-400 border border-red-600/30"
        }`}>
          <span className="mr-2">{isSupportedNetwork ? "✅" : "❌"}</span>
          {isSupportedNetwork ? "Supported Network" : "Unsupported Network"}
        </div>
      )}

      {/* Network Status Indicator */}
      {!isSupportedNetwork && (
        <div className="p-6 bg-red-600/20 border-2 border-red-600/30 rounded-2xl">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">Unsupported Network</h3>
              <p className="text-sm text-red-300 mb-4">
                You&apos;re connected to an unsupported network (Chain ID: {chainId}). 
                This application only supports the networks listed below.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {NETWORKS.slice(0, 4).map((network) => (
                  <span key={network.id} className="inline-flex items-center px-3 py-1 bg-red-600/30 text-red-400 text-sm rounded-full border border-red-600/30">
                    {network.icon} {network.name}
                  </span>
                ))}
                {NETWORKS.length > 4 && (
                  <span className="inline-flex items-center px-3 py-1 bg-red-600/30 text-red-400 text-sm rounded-full border border-red-600/30">
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
              ? "bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#333333] shadow-lg hover:shadow-xl hover:shadow-blue-500/10" 
              : "bg-red-600/20 hover:bg-red-600/30 border-2 border-red-600/30 shadow-lg hover:shadow-xl hover:shadow-red-500/10"
          }`}
        >
          <span className="text-2xl">{currentNetworkDisplay.icon}</span>
          <div className="flex-1 text-left">
            <div className={`font-semibold text-lg ${!isSupportedNetwork ? "text-red-400" : "text-white"}`}>
              {currentNetworkDisplay.name}
            </div>
            <div className={`text-sm ${!isSupportedNetwork ? "text-red-300" : "text-[#a0a0a0]"}`}>
              {currentNetworkDisplay.symbol}
            </div>
          </div>
          {!isSupportedNetwork && (
            <span className="text-red-400 text-xs bg-red-600/30 px-3 py-1 rounded-full font-medium">
              Unsupported
            </span>
          )}
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${
              !isSupportedNetwork ? "text-red-400" : "text-[#a0a0a0]"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-3 w-full max-w-sm bg-[#1f1f1f] border border-[#333333] rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-6 border-b border-[#333333]">
              <h3 className="font-bold text-white text-lg">Select Network</h3>
              <p className="text-sm text-[#a0a0a0] mt-1">Choose the network you want to connect to</p>
              {!isSupportedNetwork && (
                <div className="mt-3 p-3 bg-red-600/20 border border-red-600/30 rounded-xl">
                  <div className="text-xs text-red-400 font-medium">
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
                  className={`w-full flex items-center space-x-4 p-4 hover:bg-[#2a2a2a] transition-all duration-200 ${
                    chainId === network.id 
                      ? isSupportedNetwork 
                        ? "bg-blue-600/20 border-l-4 border-blue-500" 
                        : "bg-red-600/20 border-l-4 border-red-500"
                      : ""
                  } ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span className="text-2xl">{network.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white flex items-center space-x-2">
                      <span>{network.name}</span>
                      {network.isTestnet && (
                        <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded-full font-medium">
                          Testnet
                        </span>
                      )}
                      {chainId === network.id && !isSupportedNetwork && (
                        <span className="text-xs bg-red-600/30 text-red-400 px-2 py-1 rounded-full font-medium">
                          Current (Unsupported)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[#a0a0a0]">{network.symbol}</div>
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
            
            <div className="p-4 border-t border-[#333333] bg-[#1a1a1a]">
              <p className="text-xs text-[#a0a0a0]">
                Note: Switching networks may require wallet approval
              </p>
              {!isSupportedNetwork && (
                <p className="text-xs text-red-400 mt-2 font-medium">
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