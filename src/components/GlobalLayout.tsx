"use client";

import { useChainId, useAccount } from "wagmi";
import { NETWORKS } from "@/constants/networks";
import { useState } from "react";
import NetworkSwitcher from "./NetworkSwitcher";

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  const chainId = useChainId();
  const { isConnected, address } = useAccount();
  const isSupportedNetwork = NETWORKS.some(network => network.id === chainId);
  const [isWarningDismissed, setIsWarningDismissed] = useState(false);

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Global Network Warning */}
      {isConnected && !isSupportedNetwork && !isWarningDismissed && (
        <div className="fixed top-4 left-4 right-4 z-50 p-4 bg-red-600/90 backdrop-blur-md text-white rounded-xl shadow-2xl network-warning-banner border border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-xl">⚠️</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg mb-1">Unsupported Network Detected</h2>
                <p className="text-sm opacity-90 mb-3">
                  You&apos;re connected to an unsupported network (Chain ID: {chainId}). 
                  Please switch to a supported network to use this application.
                </p>
                <div className="flex flex-wrap gap-2">
                  <p className="text-xs opacity-75">Supported Networks:</p>
                  {NETWORKS.slice(0, 3).map((network) => (
                    <span key={network.id} className="inline-flex items-center px-2 py-1 bg-red-600/80 text-white text-xs rounded-full">
                      {network.icon} {network.name}
                    </span>
                  ))}
                  {NETWORKS.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 bg-red-600/80 text-white text-xs rounded-full">
                      +{NETWORKS.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsWarningDismissed(true)}
              className="text-white hover:text-red-200 transition-colors p-2 rounded-lg hover:bg-red-600/20"
              title="Dismiss warning"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Global Header */}
      <header className="dashboard-header sticky top-0 z-40">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">Web3 Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isConnected && (
              <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-[#1f1f1f] rounded-lg border border-[#333333]">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-[#e0e0e0] font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
            )}
            <NetworkSwitcher variant="header" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Small reminder when warning is dismissed */}
      {isConnected && !isSupportedNetwork && isWarningDismissed && (
        <div className="fixed bottom-4 left-4 right-4 z-40 animate-fade-in">
          <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-3 text-center backdrop-blur-sm">
            <span className="text-sm text-red-400">
              ⚠️ You&apos;re still on an unsupported network. 
              <button 
                onClick={() => setIsWarningDismissed(false)}
                className="ml-2 underline hover:no-underline font-medium text-red-300 hover:text-red-200"
              >
                Show warning again
              </button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
