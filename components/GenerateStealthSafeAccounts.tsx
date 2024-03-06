import { useAccount, useSignMessage } from "wagmi";
import {
  StealthAddress,
  fluidkeyMessage,
  generateSafeStealthAccounts,
} from "../lib/fluidkey";
import { useState } from "react";

export default function SafeStealthAccountGenerator() {
  const [addresses, setAddresses] = useState<StealthAddress[]>([]); // [ { nonce: bigint, stealthSafeAddress: `0x${string}` }
  const account = useAccount();
  const { signMessage } = useSignMessage({
    mutation: {
      async onSuccess(data) {
        try {
          const results = await generateSafeStealthAccounts({
            signature: data,
            chainId: account.chainId,
          });
          setAddresses(results);
        } catch (e) {
          console.error(e);
        }
      },
    },
  });
  return (
    <div className="text-center">
      <h1>Generate Stealth Safe Accounts</h1>
      <p>
        This page demonstrates how to generate stealth safe accounts using the
        FluidKey Stealth Account Kit.
      </p>
      <button
        onClick={() =>
          signMessage({
            //message: fluidkeyMessage(Math.floor(Math.random() * 9999) + 1),
            message: fluidkeyMessage(1),
          })
        }
      >
        Generate Stealth Safe Accounts
      </button>
      <button>Recover addresses</button>
      {addresses && addresses?.length > 0 ? (
        <div>
          <h2>Generated Stealth Safe Accounts</h2>
          <ul>
            {addresses.map((address) => (
              <li key={address.nonce}>
                {`Nonce: ${address.nonce} - Address: ${address.stealthSafeAddress}`}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
