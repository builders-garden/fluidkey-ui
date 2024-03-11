import { privateKeyToAccount } from "viem/accounts";

import {
  generateKeysFromSignature,
  extractViewingPrivateKeyNode,
  generateEphemeralPrivateKey,
  generateStealthAddresses,
  predictStealthSafeAddressWithClient,
  predictStealthSafeAddressWithBytecode,
} from "@fluidkey/stealth-account-kit";
import { SafeVersion } from "@fluidkey/stealth-account-kit/lib/predictStealthSafeAddressTypes";
import { http, keccak256, toHex } from "viem";
import { delay } from "./utils";

export const fluidkeyMessage = (address: `0x${string}`, secret: string) => {
  const nonce = keccak256(toHex(address + secret)).replace("0x", "");

  return `Sign this message to generate your Fluidkey private payment keys.

WARNING: Only sign this message within a trusted website or platform to avoid loss of funds.

Secret: ${nonce}`;
};

export interface StealthAddress {
  nonce: bigint;
  stealthSafeAddress: `0x${string}`;
  ephemeralPrivateKey: `0x${string}`;
}

export async function generateSafeStealthAccounts({
  signature,
  viewingPrivateKeyNodeNumber = 0,
  startNonce = BigInt(0),
  endNonce = BigInt(10),
  chainId = 1,
  useDefaultAddress = true,
  safeVersion = "1.3.0",
  setProgress,
}: {
  signature: `0x${string}`;
  customRpc?: string;
  viewingPrivateKeyNodeNumber?: number;
  startNonce?: bigint;
  endNonce?: bigint;
  chainId?: number;
  useDefaultAddress?: boolean;
  safeVersion?: SafeVersion;
  setProgress: (progress: number) => void;
}): Promise<StealthAddress[]> {
  // Create an empty array to store the results
  const results: StealthAddress[] = [];

  // Generate the private keys from the signature
  const { spendingPrivateKey, viewingPrivateKey } =
    generateKeysFromSignature(signature);

  // Extract the node required to generate the pseudo-random input for stealth address generation
  const privateViewingKeyNode = extractViewingPrivateKeyNode(
    viewingPrivateKey,
    viewingPrivateKeyNodeNumber
  );

  // Get the spending public key
  const spendingAccount = privateKeyToAccount(spendingPrivateKey);
  const spendingPublicKey = spendingAccount.publicKey;

  // Loop through the nonce range and predict the stealth Safe address
  for (let nonce = startNonce, i = 0; nonce <= endNonce; nonce++, i++) {
    // Generate the ephemeral private key
    const { ephemeralPrivateKey } = generateEphemeralPrivateKey({
      viewingPrivateKeyNode: privateViewingKeyNode,
      nonce,
      chainId,
    });

    // Generate the stealth owner address
    const { stealthAddresses } = generateStealthAddresses({
      spendingPublicKeys: [spendingPublicKey],
      ephemeralPrivateKey,
    });

    // Predict the corresponding stealth Safe address, both passing the client and using
    // the CREATE2 option with bytecode, making sure the addresses generated are the same
    console.log(`predicting Safe for signer ${stealthAddresses}`);
    const { stealthSafeAddress: stealthSafeAddressWithBytecode } =
      predictStealthSafeAddressWithBytecode({
        threshold: 1,
        stealthAddresses,
        safeVersion,
        safeProxyBytecode:
          "0x608060405234801561001057600080fd5b506040516101e63803806101e68339818101604052602081101561003357600080fd5b8101908080519060200190929190505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156100ca576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806101c46022913960400191505060405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060ab806101196000396000f3fe608060405273ffffffffffffffffffffffffffffffffffffffff600054167fa619486e0000000000000000000000000000000000000000000000000000000060003514156050578060005260206000f35b3660008037600080366000845af43d6000803e60008114156070573d6000fd5b3d6000f3fea2646970667358221220d1429297349653a4918076d650332de1a1068c5f3e07c5c82360c277770b955264736f6c63430007060033496e76616c69642073696e676c65746f6e20616464726573732070726f7669646564",
        useDefaultAddress,
      });
    console.log(
      "stealthSafeAddressWithBytecode",
      stealthSafeAddressWithBytecode
    );

    // Add the result to the results array
    results.push({
      nonce,
      stealthSafeAddress: stealthSafeAddressWithBytecode,
      ephemeralPrivateKey,
    });
    console.log(i);
    setProgress(i);
    // Wait for a short delay to avoid rate limiting
    await delay(50);
  }

  // Return the results
  return results;
}
