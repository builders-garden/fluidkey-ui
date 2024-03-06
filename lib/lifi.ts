import { LiFi, TokenAmount, Token } from "@lifi/sdk";

const lifi = new LiFi({
  integrator: "Builders Garden X FluidKey",
});

interface TokenBalance {
  token: string;
  balance: number;
}

export const whitelist = ["USDC", "USDT", "DAI", "ETH", "MATIC", "XDAI"]; // Whitelisted token symbols
export const chainIds = [1, 137, 10, 8453, 42161, 100]; // Ethereum, Polygon, OP, Arbitrum, Base, Gnosis

export async function getAddressTokenBalances(
  address: string,
  chainId: number
): Promise<TokenBalance[]> {
  try {
    const tokenBalances: TokenBalance[] = [];

    const tokensResponse = await lifi.getTokens();
    const tokens = tokensResponse.tokens;
    for (const symbol of whitelist) {
      const token = tokens[chainId].find((token) => token.symbol === symbol);
      if (token) {
        const balancesResult = await lifi.getTokenBalancesForChains(
          address,
          { [chainId]: [token] } // Pass token as an array to match expected format
        );
        tokenBalances.push({
          token: symbol,
          balance: parseFloat(balancesResult[chainId][0].amount),
        });
      }
    }

    return tokenBalances;
  } catch (error) {
    // Handle errors appropriately
    console.error("Error fetching user token balances:", error);
    throw error;
  }
}
