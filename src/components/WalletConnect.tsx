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
      <div className="p-6 border rounded-lg bg-white shadow-sm max-w-md mx-auto text-center">
        <div className="text-gray-600">🔍 Checking wallet...</div>
      </div>
    );
  }

  return (
    <>
      {/* Prominent Unsupported Network Warning */}
      {isConnected && !isSupportedNetwork && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800">Unsupported Network Detected</h3>
              <p className="text-red-700 mt-1">
                You&apos;re currently connected to an unsupported network (Chain ID: {chainId}). 
                Please switch to a supported network to use this application.
              </p>
              <div className="mt-3">
                <p className="text-sm text-red-600 font-medium">Supported Networks:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {NETWORKS.map((network) => (
                    <span key={network.id} className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      {network.icon} {network.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <NetworkSwitcher />
      </div>
      
      {isConnected && (
      <div className="mt-4 space-y-4">
        {!isSupportedNetwork && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-700">
              <span>⚠️</span>
              <span className="text-sm font-medium">Network Limitation</span>
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              You&apos;re on an unsupported network. Some features may not work correctly. 
              Consider switching to a supported network for the best experience.
            </p>
          </div>
        )}
        <Balance />
      </div>
    )}
    <div className="p-6 border rounded-lg bg-white shadow-sm max-w-md mx-auto">
      {isConnected ? (
        <div className="space-y-4 text-center">
          <div className="text-green-600 font-medium">✅ Wallet Connected!</div>
          <p className="text-sm text-gray-600">
            Address: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded break-all">{address}</span>
          </p>
          <button 
            onClick={handleDisconnect}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer w-full"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          {!hasWallet ? (
            <div className="space-y-3">
              <div className="text-yellow-600 font-medium">🔌 No Wallet Found</div>
              <p className="text-sm text-gray-600">
                You need to install a wallet extension like MetaMask to connect.
              </p>
              <button 
                onClick={installMetaMask}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer font-medium w-full"
              >
                Install MetaMask
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-blue-600 font-medium">💳 Wallet Detected</div>
              <p className="text-sm text-gray-600">
                {isWalletUnlocked 
                  ? "Your wallet is ready to connect!" 
                  : "Please unlock your wallet extension to connect."
                }
              </p>
              
              <div className="space-y-2">
                <button 
                  onClick={handleConnect}
                  disabled={isPending}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer font-medium w-full"
                >
                  {isPending ? "Connecting..." : "Connect Wallet"}
                </button>
                
                <button 
                  onClick={refreshWalletStatus}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  🔄 Refresh Status 
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm p-3 bg-red-50 rounded border border-red-200">
              <div className="font-medium">Connection Error:</div>
              <div>{error.message}</div>
            </div>
          )}
        </div>
      )}
    </div>
  
    </>
  );
}
