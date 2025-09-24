export interface Token {
  address: `0x${string}` | 'native';
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  icon?: string;
  isNative?: boolean;
}

// Token addresses for different networks
export const TOKENS: Record<number, Token[]> = {
  // Ethereum Mainnet
  1: [
    {
      address: "native",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
      icon: "🔷",
      isNative: true
    },
    {
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      icon: "💵"
    },
    {
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      symbol: "DAI",
      name: "Dai Stablecoin",
      decimals: 18,
      icon: "🟡"
    },
    {
      address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
      symbol: "MATIC",
      name: "Polygon",
      decimals: 18,
      icon: "🟣"
    },
    {
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      symbol: "LINK",
      name: "Chainlink",
      decimals: 18,
      icon: "🔗"
    },
    {
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      symbol: "UNI",
      name: "Uniswap",
      decimals: 18,
      icon: "🦄"
    }
  ],
  // Polygon Mainnet
  137: [
    {
      address: "native",
      symbol: "MATIC",
      name: "Polygon",
      decimals: 18,
      icon: "🟣",
      isNative: true
    },
    {
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      icon: "💵"
    },
    {
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      symbol: "DAI",
      name: "Dai Stablecoin",
      decimals: 18,
      icon: "🟡"
    },
    {
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      symbol: "WMATIC",
      name: "Wrapped Matic",
      decimals: 18,
      icon: "🟣"
    },
    {
      address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
      symbol: "LINK",
      name: "Chainlink",
      decimals: 18,
      icon: "🔗"
    }
  ],
  // Arbitrum One
  42161: [
    {
      address: "native",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
      icon: "🔵",
      isNative: true
    },
    {
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      icon: "💵"
    },
    {
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      symbol: "DAI",
      name: "Dai Stablecoin",
      decimals: 18,
      icon: "🟡"
    },
    {
      address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
      symbol: "ARB",
      name: "Arbitrum",
      decimals: 18,
      icon: "🔵"
    }
  ],
  // Optimism
  10: [
    {
      address: "native",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
      icon: "🔴",
      isNative: true
    },
    {
      address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      icon: "💵"
    },
    {
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      symbol: "DAI",
      name: "Dai Stablecoin",
      decimals: 18,
      icon: "🟡"
    },
    {
      address: "0x4200000000000000000000000000000000000042",
      symbol: "OP",
      name: "Optimism",
      decimals: 18,
      icon: "🔴"
    }
  ],
  // Testnets - using common testnet tokens
  11155111: [ // Sepolia
    {
      address: "native",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
      icon: "🧪",
      isNative: true
    },
    {
      address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
      symbol: "LINK",
      name: "Chainlink Token",
      decimals: 18,
      icon: "🔗"
    }
  ],
  80001: [ // Polygon Mumbai
    {
      address: "native",
      symbol: "MATIC",
      name: "Polygon",
      decimals: 18,
      icon: "🧪",
      isNative: true
    },
    {
      address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      symbol: "WMATIC",
      name: "Wrapped Matic",
      decimals: 18,
      icon: "🟣"
    }
  ]
};

export const getTokensForNetwork = (chainId: number): Token[] => {
  return TOKENS[chainId] || [];
};

export const getTokenByAddress = (chainId: number, address: `0x${string}`): Token | undefined => {
  const tokens = getTokensForNetwork(chainId);
  return tokens.find(token => token.address.toLowerCase() === address.toLowerCase());
};
