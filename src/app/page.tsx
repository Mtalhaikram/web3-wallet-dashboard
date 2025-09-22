"use client";

import { useChainId } from "wagmi";
import { NETWORKS } from "@/constants/networks";
import { useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import TokenSelector from "@/components/TokenSelector";
import SendETH from "@/components/SendETH";

export default function Home() {
  const chainId = useChainId();
  const isSupportedNetwork = NETWORKS.some(network => network.id === chainId);
  const isConnected = chainId !== undefined;
  const [isWarningDismissed, setIsWarningDismissed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Global Network Warning */}
      {isConnected && !isSupportedNetwork && !isWarningDismissed && (
        <div className="fixed top-4 left-4 right-4 z-50 p-4 bg-red-500/90 backdrop-blur-md text-white rounded-xl shadow-2xl network-warning-banner border border-red-400/20">
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

      <main className={`container mx-auto px-4 py-8 ${
        isConnected && !isSupportedNetwork ? 'main-content-with-banner' : ''
      }`}>
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Web3 Wallet Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect your wallet, manage your assets, and interact with multiple blockchain networks
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Wallet Connection Card */}
          <div className="animate-fade-in">
            <WalletConnect />
          </div>
          
          {/* Connected State Content */}
          {isConnected && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
              {/* Send ETH Section */}
              <div className="lg:col-span-1">
                <SendETH />
              </div>
              
              {/* Token Balance Section */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8 card-hover">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Token Balances
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Manage your ERC-20 tokens
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    Select tokens to view your ERC-20 token balances on the current network.
                  </p>
                  <TokenSelector />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Small reminder when warning is dismissed */}
        {isConnected && !isSupportedNetwork && isWarningDismissed && (
          <div className="fixed bottom-4 left-4 right-4 z-40 animate-fade-in">
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-3 text-center backdrop-blur-sm">
              <span className="text-sm text-red-700 dark:text-red-300">
                ⚠️ You&apos;re still on an unsupported network. 
                <button 
                  onClick={() => setIsWarningDismissed(false)}
                  className="ml-2 underline hover:no-underline font-medium"
                >
                  Show warning again
                </button>
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
