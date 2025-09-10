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
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="text-yellow-800 text-sm">
          <strong>No tokens available</strong> for the current network. Switch to a supported network to view token balances.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Token Selection Controls */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={selectAllTokens}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={clearAllTokens}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            Clear All
          </button>
        </div>
        <div className="text-xs text-gray-500">
          {selectedTokens.length} of {availableTokens.length} tokens selected
        </div>
      </div>

      {/* Available Tokens List */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Available Tokens:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {availableTokens.map((token) => {
            const isSelected = selectedTokens.some(t => t.address === token.address);
            return (
              <button
                key={token.address}
                onClick={() => toggleToken(token)}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  isSelected
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{token.icon}</span>
                  <div>
                    <div className="text-sm font-medium">{token.symbol}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[120px]">
                      {token.name}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="ml-auto text-blue-600">✓</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Token Balances */}
      {selectedTokens.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Token Balances:</h3>
          <div className="space-y-2">
            {selectedTokens.map((token) => (
              <TokenBalance key={token.address} token={token} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
