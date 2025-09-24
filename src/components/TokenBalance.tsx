"use client";

import { useAccount, useReadContract, useChainId, useBalance } from "wagmi";
import { getTokensForNetwork, Token } from "@/constants/tokens";
import { useState } from "react";

// ERC-20 ABI for balanceOf function
const ERC20_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

interface TokenBalanceProps {
  token: Token; // Token object containing address, symbol, name, etc.
}

export default function TokenBalance({ token }: TokenBalanceProps) {
  const { address } = useAccount();
  const chainId = useChainId();

  // For native tokens, use useBalance hook
  const { data: nativeBalance, isLoading: isNativeLoading, isError: isNativeError } = useBalance({
    address: address,
    query: {
      enabled: !!address && token.isNative,
    },
  });

  // For ERC-20 tokens, use useReadContract hook
  const { data: erc20Balance, isLoading: isErc20Loading, isError: isErc20Error } = useReadContract({
    address: token.address as `0x${string}`, // Token contract address
    abi: ERC20_ABI,
    functionName: "balanceOf", // Call balanceOf function
    args: address ? [address] : undefined, // Pass wallet address as argument
    query: {
      enabled: !!address && !token.isNative && token.address !== 'native',
    },
  });

  const isLoading = token.isNative ? isNativeLoading : isErc20Loading;
  const isError = token.isNative ? isNativeError : isErc20Error;
  const balance = token.isNative ? nativeBalance?.value : erc20Balance;

  const formatBalance = (balance: bigint | undefined, decimals: number) => {
    if (!balance) return "0";
    
    // Convert from wei-like units to actual token units
    const divisor = BigInt(10 ** decimals); // e.g., 10^18 for ETH
    const wholePart = balance / divisor; // Integer part
    const fractionalPart = balance % divisor; // Decimal part
    
    // Handle cases where there's no fractional part
    if (fractionalPart === 0n) {
      return wholePart.toString();
    }
    
    // Format fractional part, removing trailing zeros
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const trimmedFractional = fractionalStr.replace(/0+$/, '');
    
    return `${wholePart}.${trimmedFractional}`;
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-[#1f1f1f] rounded-xl border border-[#333333]">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className="text-2xl">{token.icon}</span>
            {token.isNative && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-[#1f1f1f]"></div>
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              {token.symbol}
              {token.isNative && (
                <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-full">
                  Native
                </span>
              )}
            </div>
            <div className="text-xs text-[#a0a0a0] flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading balance...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-600/20 rounded-xl border border-red-600/30">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className="text-2xl">{token.icon}</span>
            {token.isNative && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-[#1f1f1f]"></div>
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-red-400 flex items-center gap-2">
              {token.symbol}
              {token.isNative && (
                <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-full">
                  Native
                </span>
              )}
            </div>
            <div className="text-xs text-red-300">Failed to load balance</div>
          </div>
        </div>
      </div>
    );
  }

  const formattedBalance = formatBalance(balance, token.decimals);

  return (
    <div className="p-4 bg-[#1f1f1f] rounded-xl border border-[#333333] hover:bg-[#2a2a2a] transition-all duration-200 hover:shadow-md hover:shadow-blue-500/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className="text-2xl">{token.icon}</span>
            {token.isNative && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-[#1f1f1f]"></div>
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              {token.symbol}
              {token.isNative && (
                <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-full">
                  Native
                </span>
              )}
            </div>
            <div className="text-xs text-[#a0a0a0]">{token.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-mono text-white font-semibold">
            {formattedBalance}
          </div>
          <div className="text-xs text-[#a0a0a0]">
            {token.symbol}
          </div>
        </div>
      </div>
    </div>
  );
}
