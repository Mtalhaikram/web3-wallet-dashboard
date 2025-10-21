"use client";

import { useState, useEffect } from "react";
import { useAccount, useSendTransaction, useChainId, useBalance } from "wagmi";
import { parseEther, formatEther, isAddress } from "viem";
import { getNetworkById, NETWORKS } from "@/constants/networks";

export default function SendETH() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [recipientError, setRecipientError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [isRecipientValid, setIsRecipientValid] = useState(false);
  const [isAmountValid, setIsAmountValid] = useState(false);

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

  // Real-time recipient validation
  const validateRecipient = (address: string) => {
    if (!address.trim()) {
      setRecipientError("");
      setIsRecipientValid(false);
      return;
    }

    const trimmedAddress = address.trim();
    
    // Check if it's a valid Ethereum address using viem's isAddress
    if (!isAddress(trimmedAddress)) {
      setRecipientError("Please enter a valid Ethereum address (0x...)");
      setIsRecipientValid(false);
      return;
    }

    // Check if it's the same as sender address
    if (address && trimmedAddress.toLowerCase() === address?.toLowerCase()) {
      setRecipientError("Cannot send to your own address");
      setIsRecipientValid(false);
      return;
    }

    setRecipientError("");
    setIsRecipientValid(true);
  };

  // Real-time amount validation
  const validateAmount = (amountValue: string) => {
    if (!amountValue.trim()) {
      setAmountError("");
      setIsAmountValid(false);
      return;
    }

    const amountNum = parseFloat(amountValue);
    
    if (isNaN(amountNum)) {
      setAmountError("Please enter a valid number");
      setIsAmountValid(false);
      return;
    }

    if (amountNum <= 0) {
      setAmountError("Amount must be greater than 0");
      setIsAmountValid(false);
      return;
    }

    // Check if user has enough balance
    if (balance) {
      const balanceInEth = parseFloat(formatEther(balance.value));
      if (amountNum > balanceInEth) {
        setAmountError(`Insufficient balance. You have ${balanceInEth.toFixed(6)} ${balance.symbol}`);
        setIsAmountValid(false);
        return;
      }
    }

    setAmountError("");
    setIsAmountValid(true);
  };

  // Real-time validation effects
  useEffect(() => {
    validateRecipient(recipient);
  }, [recipient, address]);

  useEffect(() => {
    validateAmount(amount);
  }, [amount, balance]);

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

    // Check if recipient is valid (real-time validation should have caught this)
    if (!isRecipientValid || recipientError) {
      setValidationError(recipientError || "Please enter a valid recipient address");
      setIsValidating(false);
      return false;
    }

    // Check if amount is valid (real-time validation should have caught this)
    if (!isAmountValid || amountError) {
      setValidationError(amountError || "Please enter a valid amount");
      setIsValidating(false);
      return false;
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
    setRecipientError("");
    setAmountError("");
    setIsRecipientValid(false);
    setIsAmountValid(false);
  };

  if (!isConnected) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8 card-hover">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl">💸</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Send Native ETH
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Transfer native tokens
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Please connect your wallet to send ETH</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8 card-hover">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
          <span className="text-2xl">💸</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Send Native ETH
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Transfer native tokens
          </p>
        </div>
      </div>
      
      {!isSupportedNetwork && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
          <div className="flex items-center space-x-3">
            <span className="text-red-500 text-lg">⚠️</span>
            <div>
              <div className="font-medium text-red-800 dark:text-red-200 text-sm">Unsupported Network</div>
              <div className="text-red-700 dark:text-red-300 text-sm">Please switch to a supported network to send ETH.</div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Recipient Address
          </label>
          <div className="relative">
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className={`input-field pr-10 ${
                recipient && recipientError 
                  ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                  : recipient && isRecipientValid 
                  ? 'border-green-300 dark:border-green-600 focus:border-green-500 focus:ring-green-500'
                  : ''
              }`}
              disabled={isSending || !isSupportedNetwork}
            />
            {recipient && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isRecipientValid ? (
                  <span className="text-green-500 text-lg">✓</span>
                ) : recipientError ? (
                  <span className="text-red-500 text-lg">✗</span>
                ) : null}
              </div>
            )}
          </div>
          {recipientError && (
            <p className="text-red-600 dark:text-red-400 text-sm">{recipientError}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
              className={`input-field pr-20 ${
                amount && amountError 
                  ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                  : amount && isAmountValid 
                  ? 'border-green-300 dark:border-green-600 focus:border-green-500 focus:ring-green-500'
                  : ''
              }`}
              disabled={isSending || !isSupportedNetwork}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {amount && (
                <div>
                  {isAmountValid ? (
                    <span className="text-green-500 text-lg">✓</span>
                  ) : amountError ? (
                    <span className="text-red-500 text-lg">✗</span>
                  ) : null}
                </div>
              )}
              {balance && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Max: {parseFloat(formatEther(balance.value)).toFixed(6)}
                </div>
              )}
            </div>
          </div>
          {amountError && (
            <p className="text-red-600 dark:text-red-400 text-sm">{amountError}</p>
          )}
        </div>

        {validationError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="text-red-500 text-lg">❌</span>
              <div className="text-red-700 dark:text-red-300 text-sm">{validationError}</div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSending || isValidating || !isSupportedNetwork || !isRecipientValid || !isAmountValid}
          className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </div>
          ) : isValidating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Validating...</span>
            </div>
          ) : (
            `Send ${currentNetwork?.symbol || "ETH"}`
          )}
        </button>
      </form>

      {/* Transaction Status */}
      {isSuccess && hash && (
        <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-green-800 dark:text-green-200 text-lg mb-3">Transaction Sent Successfully!</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-2">Transaction Hash:</p>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="font-mono text-xs break-all text-gray-900 dark:text-gray-100">
                      {hash}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={getEtherscanUrl(hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    View on Etherscan
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <button
                    onClick={resetForm}
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    Send Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isError && error && (
        <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">❌</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-800 dark:text-red-200 text-lg mb-2">Transaction Failed</h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                {error.message || "An error occurred while sending the transaction"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
