"use client";

import { useAccount, useReadContract, useChainId } from "wagmi";
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

  const { data: balance, isLoading, isError } = useReadContract({
    address: token.address, // Token contract address
    abi: ERC20_ABI,
    functionName: "balanceOf", // Call balanceOf function
    args: address ? [address] : undefined, // Pass wallet address as argument
    query: {
      enabled: !!address, // Only fetch if wallet is connected
    },
  });

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
      <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{token.icon}</span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{token.symbol}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
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
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{token.icon}</span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-red-700 dark:text-red-300">{token.symbol}</div>
            <div className="text-xs text-red-500 dark:text-red-400">Failed to load balance</div>
          </div>
        </div>
      </div>
    );
  }

  const formattedBalance = formatBalance(balance, token.decimals);

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 hover:shadow-md card-hover">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{token.icon}</span>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{token.symbol}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{token.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-mono text-gray-900 dark:text-white font-semibold">
            {formattedBalance}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {token.symbol}
          </div>
        </div>
      </div>
    </div>
  );
}
