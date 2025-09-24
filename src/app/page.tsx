"use client";

import { useChainId, useAccount } from "wagmi";
import { NETWORKS, getNetworkById } from "@/constants/networks";
import { useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import TokenSelector from "@/components/TokenSelector";
import SendETH from "@/components/SendETH";
import Balance from "@/components/Balance";
import NetworkSwitcher from "@/components/NetworkSwitcher";
import GlobalLayout from "@/components/GlobalLayout";

export default function Home() {
  const chainId = useChainId();
  const { isConnected, address } = useAccount();
  const isSupportedNetwork = NETWORKS.some(network => network.id === chainId);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const currentNetwork = getNetworkById(chainId);

  const navigationItems = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "wallet", name: "Wallet", icon: "💳" },
    { id: "send", name: "Send", icon: "💸" },
    { id: "tokens", name: "Tokens", icon: "💰" },
    { id: "settings", name: "Settings", icon: "⚙️" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="dashboard-stats-grid">
              <div className="dashboard-stats-card animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Network</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentNetwork?.name || "Unknown"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{currentNetwork?.icon || "❓"}</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-stats-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isConnected ? "Connected" : "Disconnected"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{isConnected ? "✅" : "❌"}</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-stats-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chain ID</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {chainId || "N/A"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🔗</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-stats-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Network Status</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isSupportedNetwork ? "Supported" : "Unsupported"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{isSupportedNetwork ? "✅" : "⚠️"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-main-grid">
              <div className="lg:col-span-1">
                <Balance />
              </div>
              <div className="lg:col-span-1">
                <div className="dashboard-card">
                  <div className="dashboard-card-content">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab("send")}
                        className="w-full p-4 text-left bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors dashboard-focus"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">💸</span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Send Tokens</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Transfer native tokens</p>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab("tokens")}
                        className="w-full p-4 text-left bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors dashboard-focus"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">💰</span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Manage Tokens</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">View ERC-20 balances</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "wallet":
        return <WalletConnect />;
      case "send":
        return <SendETH />;
      case "tokens":
        return (
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div className="flex items-center space-x-3">
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
            </div>
            <div className="dashboard-card-content">
              <TokenSelector />
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
            </div>
            <div className="dashboard-card-content">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Network Settings</h3>
                  <NetworkSwitcher />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <GlobalLayout>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`dashboard-sidebar fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          
          
          <nav className="mt-6 px-3 dashboard-scrollbar">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`dashboard-nav-item w-full ${
                    activeTab === item.id
                      ? 'dashboard-nav-item-active'
                      : 'dashboard-nav-item-inactive'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Menu Button */}
          <div className="lg:hidden p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 dashboard-focus"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 dashboard-scrollbar">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </GlobalLayout>
  );
}
