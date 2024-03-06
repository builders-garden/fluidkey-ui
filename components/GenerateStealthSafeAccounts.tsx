import { useAccount, useSignMessage } from "wagmi";
import { FaDownload } from "react-icons/fa";

import {
  StealthAddress,
  fluidkeyMessage,
  generateSafeStealthAccounts,
} from "../lib/fluidkey";
import { useEffect, useState } from "react";
import { Button, Checkbox, Input } from "@nextui-org/react";
import { SafeVersion } from "@fluidkey/stealth-account-kit/lib/predictStealthSafeAddressTypes";
import StealthAddressesTables from "./StealthAddressesTable";
import { downloadAddressesAsCSV } from "../lib/csv";
import { getAddressTokenBalances } from "../lib/lifi";

export default function SafeStealthAccountGenerator() {
  const account = useAccount();
  const { signMessage } = useSignMessage({
    mutation: {
      async onSuccess(data) {
        try {
          const results = await generateSafeStealthAccounts({
            signature: data,
            chainId: account.chainId,
            startNonce,
            endNonce,
            safeVersion: safeVersion as SafeVersion,
            useDefaultAddress,
          });
          setAddresses(results);
        } catch (e) {
          console.error(e);
        }
      },
    },
  });
  const [addresses, setAddresses] = useState<StealthAddress[]>([]); // [ { nonce: bigint, stealthSafeAddress: `0x${string}` }
  const [safeVersion, setSafeVersion] = useState<string>("1.3.0");
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [startNonce, setStartNonce] = useState(BigInt(0));
  const [endNonce, setEndNonce] = useState(BigInt(10));
  const [tokenBalances, setTokenBalances] = useState<
    { [address: string]: { token: string; amount: number } }[]
  >([]);

  useEffect(() => {
    (async () => {
      await fetchTokenBalances();
    })();
  }, [addresses, account]);

  const fetchTokenBalances = async () => {
    const balances = await Promise.all(
      addresses.map(async (stealthAddress: StealthAddress) => {
        return await getAddressTokenBalances(
          stealthAddress.stealthSafeAddress,
          account.chainId!
        );
      })
    );
  };

  return (
    <div className="flex flex-col space-y-4 text-center">
      <h1 className="text-2xl font-bold">Stealth Safe Accounts</h1>
      <p>
        This page demonstrates how to recover stealth safe accounts using the
        FluidKey Stealth Account Kit.
      </p>
      <div className="flex flex-row items-center space-x-4 justify-items-center justify-center">
        <Input
          label="Safe Version"
          className="mt-4 flex-1"
          disabled
          placeholder="Set Safe Version"
          value={safeVersion}
          onValueChange={(e) => setSafeVersion(e)}
          isRequired
        />
        <Input
          type="number"
          label="Start Nonce"
          className="mt-4 flex-1"
          placeholder="Set Start Nonce"
          value={startNonce.toLocaleString()}
          onValueChange={(e) => setStartNonce(BigInt(e))}
          isRequired
        />
        <Input
          type="number"
          label="End Nonce"
          className="mt-4 flex-1"
          placeholder="Set End Nonce"
          value={endNonce.toLocaleString()}
          onValueChange={(e) => setEndNonce(BigInt(e))}
          isRequired
        />
        <Checkbox
          className="flex-1"
          isSelected={useDefaultAddress}
          onValueChange={setUseDefaultAddress}
        >
          Use Default Address
        </Checkbox>
      </div>
      <div className="flex flex-row space-x-4 justify-center">
        <Button
          type="button"
          color="primary"
          onClick={() =>
            signMessage({
              //message: fluidkeyMessage(Math.floor(Math.random() * 9999) + 1),
              message: fluidkeyMessage(1),
            })
          }
        >
          Recover Stealth Safe Accounts
        </Button>
        {addresses?.length > 0 && (
          <Button
            startContent={<FaDownload />}
            color="default"
            onClick={() => downloadAddressesAsCSV(addresses)}
          >
            Download
          </Button>
        )}
      </div>
      {addresses && addresses?.length > 0 ? (
        <StealthAddressesTables stealthSafeAddresses={addresses} />
      ) : null}
    </div>
  );
}
