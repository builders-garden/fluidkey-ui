import { LiFi } from "@lifi/sdk";

const lifi = new LiFi({
  integrator: "Builders Garden X FluidKey",
});

export interface TokenBalance {
  token: string;
  balance: number;
}

export const chainIds = [1, 137, 10, 8453, 42161, 100]; // Ethereum, Polygon, OP, Arbitrum, Base, Gnosis

export async function getAddressTokenBalances(
  address: string,
  chainId: number,
  inputTokens: string[]
): Promise<TokenBalance[]> {
  try {
    const tokenBalances: TokenBalance[] = [];

    const tokensResponse = await lifi.getTokens();
    const tokens = tokensResponse.tokens;
    for (const symbol of inputTokens) {
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
