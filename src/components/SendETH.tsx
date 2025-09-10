"use client";

import { useState } from "react";
import { useAccount, useSendTransaction, useChainId, useBalance } from "wagmi";
import { parseEther, formatEther } from "viem";
import { getNetworkById, NETWORKS } from "@/constants/networks";

export default function SendETH() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");

  const currentNetwork = getNetworkById(chainId);
  const isSupportedNetwork = NETWORKS.some(network => network.id === chainId);

  const {
    sendTransaction,
    isPending: isSending,
    isSuccess,
    isError,
    error,
    data: hash,
  } = useSendTransaction();

  const validateForm = async () => {
    setIsValidating(true);
    setValidationError("");

    // Check if connected
    if (!isConnected) {
      setValidationError("Please connect your wallet first");
      setIsValidating(false);
      return false;
    }

    // Check if on supported network
    if (!isSupportedNetwork) {
      setValidationError("Please switch to a supported network");
      setIsValidating(false);
      return false;
    }

    // Validate recipient address
    if (!recipient.trim()) {
      setValidationError("Please enter a recipient address");
      setIsValidating(false);
      return false;
    }

    // Basic address validation (42 characters, starts with 0x)
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient.trim())) {
      setValidationError("Please enter a valid Ethereum address");
      setIsValidating(false);
      return false;
    }

    // Validate amount
    if (!amount.trim()) {
      setValidationError("Please enter an amount");
      setIsValidating(false);
      return false;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setValidationError("Please enter a valid amount greater than 0");
      setIsValidating(false);
      return false;
    }

    // Check if user has enough balance
    if (balance) {
      const balanceInEth = parseFloat(formatEther(balance.value));
      if (amountNum > balanceInEth) {
        setValidationError(`Insufficient balance. You have ${balanceInEth.toFixed(6)} ${balance.symbol}`);
        setIsValidating(false);
        return false;
      }
    }

    setIsValidating(false);
    return true;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      await sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  const getEtherscanUrl = (txHash: string) => {
    if (!currentNetwork) return "";
    
    const baseUrls: Record<number, string> = {
      1: "https://etherscan.io",
      11155111: "https://sepolia.etherscan.io",
      137: "https://polygonscan.com",
      80001: "https://mumbai.polygonscan.com",
      42161: "https://arbiscan.io",
      421614: "https://sepolia.arbiscan.io",
      10: "https://optimistic.etherscan.io",
      11155420: "https://sepolia-optimism.etherscan.io",
    };

    const baseUrl = baseUrls[chainId] || "https://etherscan.io";
    return `${baseUrl}/tx/${txHash}`;
  };

  const resetForm = () => {
    setRecipient("");
    setAmount("");
    setValidationError("");
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          💸 Send Native ETH
        </h2>
        <div className="text-center py-8 text-gray-500">
          <p>Please connect your wallet to send ETH</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        💸 Send Native ETH
      </h2>
      
      {!isSupportedNetwork && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-sm text-red-700">
          ⚠️ <strong>Unsupported Network:</strong> Please switch to a supported network to send ETH.
        </div>
      )}

      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSending || !isSupportedNetwork}
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount ({currentNetwork?.symbol || "ETH"})
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.000001"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSending || !isSupportedNetwork}
            />
            {balance && (
              <div className="absolute right-3 top-2 text-xs text-gray-500">
                Max: {parseFloat(formatEther(balance.value)).toFixed(6)}
              </div>
            )}
          </div>
        </div>

        {validationError && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-sm text-red-700">
            {validationError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSending || isValidating || !isSupportedNetwork}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSending ? "Sending..." : isValidating ? "Validating..." : `Send ${currentNetwork?.symbol || "ETH"}`}
        </button>
      </form>

      {/* Transaction Status */}
      {isSuccess && hash && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-md">
          <h3 className="font-semibold text-green-800 mb-2">✅ Transaction Sent Successfully!</h3>
          <div className="space-y-2">
            <p className="text-sm text-green-700">
              <strong>Transaction Hash:</strong>
            </p>
            <p className="font-mono text-xs bg-green-50 p-2 rounded border break-all">
              {hash}
            </p>
            <div className="flex space-x-2">
              <a
                href={getEtherscanUrl(hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                View on Etherscan
                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <button
                onClick={resetForm}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
              >
                Send Another
              </button>
            </div>
          </div>
        </div>
      )}

      {isError && error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-md">
          <h3 className="font-semibold text-red-800 mb-2">❌ Transaction Failed</h3>
          <p className="text-sm text-red-700">
            {error.message || "An error occurred while sending the transaction"}
          </p>
        </div>
      )}
    </div>
  );
}
