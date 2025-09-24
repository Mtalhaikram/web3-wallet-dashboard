"use client";

import { useState } from "react";
import { useChainId } from "wagmi";
import { getTokensForNetwork, Token } from "@/constants/tokens";
import TokenBalance from "./TokenBalance";

export default function TokenSelector() {
  const chainId = useChainId();
  const availableTokens = getTokensForNetwork(chainId);
  const [selectedTokens, setSelectedTokens] = useState<Token[]>([]);

  const toggleToken = (token: Token) => {
    setSelectedTokens(prev => {
      const isSelected = prev.some(t => t.address === token.address);
      if (isSelected) {
        return prev.filter(t => t.address !== token.address);
      } else {
        return [...prev, token];
      }
    });
  };

  const selectAllTokens = () => {
    setSelectedTokens(availableTokens);
  };

  const clearAllTokens = () => {
    setSelectedTokens([]);
  };

  if (availableTokens.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-lg">⚠️</span>
          </div>
          <div className="text-yellow-800 dark:text-yellow-200 text-sm">
            <strong>No tokens available</strong> for the current network. Switch to a supported network to view token balances.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Selection Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={selectAllTokens}
            className="px-4 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors font-medium"
          >
            Select All
          </button>
          <button
            onClick={clearAllTokens}
            className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Clear All
          </button>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {selectedTokens.length} of {availableTokens.length} tokens selected
        </div>
      </div>

      {/* Available Tokens List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold  text-white">Available Tokens</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableTokens.map((token) => {
            const isSelected = selectedTokens.some(t => t.address === token.address);
            return (
              <button
                key={token.address}
                onClick={() => toggleToken(token)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 hover:scale-105 ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100 shadow-lg'
                    : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{token.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{token.symbol}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {token.name}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Token Balances */}
      {selectedTokens.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Token Balances</h3>
          <div className="space-y-3">
            {selectedTokens.map((token) => (
              <TokenBalance key={token.address} token={token} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
