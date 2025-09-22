"use client";

import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { injected } from "wagmi/connectors";
import { useEffect, useState } from "react";
import Balance from "./Balance";
import NetworkSwitcher from "./NetworkSwitcher";
import { NETWORKS } from "@/constants/networks";

export default function ConnectWallet() {
  const { connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const [hasWallet, setHasWallet] = useState(false);
  const [isWalletUnlocked, setIsWalletUnlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  console.log("WalletConnect render:", { isConnected, address, isPending, error, hasWallet, isWalletUnlocked, isChecking });

  // Check if current network is supported
  const isSupportedNetwork = NETWORKS.some(network => network.id === chainId);

  useEffect(() => {
    // Check if MetaMask or another wallet is installed
    const checkWallet = async () => {
      setIsChecking(true);
      
      if (typeof window !== "undefined" && window.ethereum) {
        setHasWallet(true);
        
        // Check if wallet is unlocked by trying to get accounts
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
          setIsWalletUnlocked(accounts && accounts.length > 0);
        } catch (err) {
          console.log("Wallet check error:", err);
          // If there's an error, assume wallet might be locked or not ready
          setIsWalletUnlocked(false);
        }
      } else {
        setHasWallet(false);
        setIsWalletUnlocked(false);
      }
      
      setIsChecking(false);
    };

    checkWallet();
  }, []);

  const handleConnect = async () => {
    console.log("Connect button clicked");
    
    if (!hasWallet) {
      console.log("No wallet detected");
      return;
    }

    try {
      console.log("Attempting to connect with injected connector");
      connect({ connector: injected() });
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  const handleDisconnect = () => {
    console.log("Disconnect button clicked");
    disconnect();
  };

  const installMetaMask = () => {
    window.open("https://metamask.io/download/", "_blank");
  };

  const refreshWalletStatus = async () => {
    console.log("Refreshing wallet status...");
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        setIsWalletUnlocked(accounts && accounts.length > 0);
        console.log("Wallet status refreshed:", { accounts: accounts?.length || 0 });
      } catch (err) {
        console.log("Error refreshing wallet status:", err);
        setIsWalletUnlocked(false);
      }
    }
  };

  if (isChecking) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8 max-w-md mx-auto text-center card-hover">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-2xl">🔍</span>
          </div>
          <div className="text-gray-600 dark:text-gray-300 font-medium">Checking wallet...</div>
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Prominent Unsupported Network Warning */}
      {isConnected && !isSupportedNetwork && (
        <div className="mb-6 p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-2xl shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">Unsupported Network Detected</h3>
              <p className="text-red-700 dark:text-red-300 mb-4">
                You&apos;re currently connected to an unsupported network (Chain ID: {chainId}). 
                Please switch to a supported network to use this application.
              </p>
              <div>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-2">Supported Networks:</p>
                <div className="flex flex-wrap gap-2">
                  {NETWORKS.map((network) => (
                    <span key={network.id} className="inline-flex items-center px-3 py-1 bg-red-100 dark:bg-red-800/50 text-red-800 dark:text-red-200 text-sm rounded-full border border-red-200 dark:border-red-700">
                      {network.icon} {network.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <NetworkSwitcher />
      </div>
      
      {isConnected && (
        <div className="mt-6 space-y-4">
          {!isSupportedNetwork && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
              <div className="flex items-center space-x-3 text-yellow-700 dark:text-yellow-300">
                <span className="text-lg">⚠️</span>
                <span className="text-sm font-medium">Network Limitation</span>
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                You&apos;re on an unsupported network. Some features may not work correctly. 
                Consider switching to a supported network for the best experience.
              </p>
            </div>
          )}
          <Balance />
        </div>
      )}
      
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8 max-w-md mx-auto card-hover">
        {isConnected ? (
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <div className="text-green-600 dark:text-green-400 font-bold text-lg">Wallet Connected!</div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Successfully connected to your wallet
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Wallet Address:</p>
              <p className="font-mono text-sm bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border break-all text-gray-900 dark:text-gray-100">
                {address}
              </p>
            </div>
            
            <button 
              onClick={handleDisconnect}
              className="btn-destructive w-full py-3"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            {!hasWallet ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🔌</span>
                  </div>
                  <div>
                    <div className="text-orange-600 dark:text-orange-400 font-bold text-lg">No Wallet Found</div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Install a wallet extension to get started
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  You need to install a wallet extension like MetaMask to connect and use this application.
                </p>
                
                <button 
                  onClick={installMetaMask}
                  className="btn-primary w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  Install MetaMask
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💳</span>
                  </div>
                  <div>
                    <div className="text-blue-600 dark:text-blue-400 font-bold text-lg">Wallet Detected</div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {isWalletUnlocked 
                        ? "Your wallet is ready to connect!" 
                        : "Please unlock your wallet extension to connect."
                      }
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={handleConnect}
                    disabled={isPending}
                    className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      "Connect Wallet"
                    )}
                  </button>
                  
                  <button 
                    onClick={refreshWalletStatus}
                    className="btn-secondary w-full py-2 text-sm"
                  >
                    🔄 Refresh Status 
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-lg">❌</span>
                  <div className="text-left">
                    <div className="font-medium text-red-800 dark:text-red-200 text-sm">Connection Error:</div>
                    <div className="text-red-700 dark:text-red-300 text-sm mt-1">{error.message}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
  
    </>
  );
}
