# Token Balance Reading Feature

This wallet dashboard now supports reading ERC-20 token balances for various tokens across multiple networks.

## Features

### Supported Networks
- **Ethereum Mainnet** (Chain ID: 1)
- **Polygon** (Chain ID: 137) 
- **Arbitrum One** (Chain ID: 42161)
- **Optimism** (Chain ID: 10)
- **Sepolia Testnet** (Chain ID: 11155111)
- **Polygon Mumbai** (Chain ID: 80001)

### Supported Tokens

#### Ethereum Mainnet
- USDT (Tether USD) - 6 decimals
- DAI (Dai Stablecoin) - 18 decimals  
- MATIC (Polygon) - 18 decimals
- LINK (Chainlink) - 18 decimals
- UNI (Uniswap) - 18 decimals

#### Polygon Mainnet
- USDT (Tether USD) - 6 decimals
- DAI (Dai Stablecoin) - 18 decimals
- WMATIC (Wrapped Matic) - 18 decimals
- LINK (Chainlink) - 18 decimals

#### Arbitrum One
- USDT (Tether USD) - 6 decimals
- DAI (Dai Stablecoin) - 18 decimals
- ARB (Arbitrum) - 18 decimals

#### Optimism
- USDT (Tether USD) - 6 decimals
- DAI (Dai Stablecoin) - 18 decimals
- OP (Optimism) - 18 decimals

## How to Use

1. **Connect Your Wallet**: Use the wallet connection button to connect MetaMask or another Web3 wallet
2. **Switch Networks**: Use the network switcher to select a supported network
3. **Select Tokens**: In the Token Balances section, click on tokens you want to view
4. **View Balances**: Selected tokens will display your current balance

## Technical Implementation

### Components
- `TokenBalance.tsx`: Displays individual token balance using wagmi's `useReadContract` hook
- `TokenSelector.tsx`: Provides interface for selecting which tokens to view
- Updated `page.tsx`: Integrates token balance functionality into the main dashboard

### Key Features
- **Real-time Balance Reading**: Uses wagmi's `useReadContract` to read ERC-20 `balanceOf` function
- **Proper Decimal Handling**: Correctly formats token balances based on token decimals
- **Error Handling**: Shows loading states and error messages for failed requests
- **Network-aware**: Only shows tokens available on the current network
- **Responsive UI**: Clean, modern interface with hover effects and proper spacing

### ERC-20 ABI
The component uses a minimal ERC-20 ABI that includes:
- `balanceOf(address)`: Returns token balance for an address
- `decimals()`: Returns token decimal places
- `symbol()`: Returns token symbol

## Usage Example

```tsx
import TokenSelector from "@/components/TokenSelector";

// In your component
<TokenSelector />
```

The component automatically:
- Detects the current network
- Shows available tokens for that network
- Allows users to select/deselect tokens
- Displays real-time balances for selected tokens
