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
      <div className="p-6 bg-yellow-600/20 rounded-2xl border border-yellow-600/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-lg">⚠️</span>
          </div>
          <div className="text-yellow-400 text-sm">
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
            className="px-4 py-2 text-sm bg-blue-600/20 text-blue-400 rounded-full hover:bg-blue-600/30 transition-colors font-medium"
          >
            Select All
          </button>
          <button
            onClick={clearAllTokens}
            className="px-4 py-2 text-sm bg-[#2a2a2a] text-[#e0e0e0] rounded-full hover:bg-[#333333] transition-colors font-medium"
          >
            Clear All
          </button>
        </div>
        <div className="text-sm text-[#a0a0a0] font-medium">
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
                    ? 'bg-blue-600/20 border-blue-500 text-blue-100 shadow-lg shadow-blue-500/10'
                    : 'bg-[#1f1f1f] border-[#333333] text-[#e0e0e0] hover:bg-[#2a2a2a] hover:shadow-md hover:shadow-blue-500/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <span className="text-2xl">{token.icon}</span>
                    {token.isNative && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-[#1f1f1f]"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate flex items-center gap-2">
                      {token.symbol}
                      {token.isNative && (
                        <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-full">
                          Native
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#a0a0a0] truncate">
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
          <h3 className="text-lg font-semibold text-white">Token Balances</h3>
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
