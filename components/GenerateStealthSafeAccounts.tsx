import { useAccount, useSignMessage } from "wagmi";

import {
  StealthAddress,
  fluidkeyMessage,
  generateSafeStealthAccounts,
} from "../lib/fluidkey";
import { useState } from "react";
import { SafeVersion } from "@fluidkey/stealth-account-kit/lib/predictStealthSafeAddressTypes";
import { TokenBalance, getAddressTokenBalances } from "../lib/lifi";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Checkbox,
  Input,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import PinInput from "./PinInput";
import StealthAddressesTables from "./StealthAddressesTable";
import { CoinsIcon, DownloadCloud, Info } from "lucide-react";
import { downloadAddressesAsCSV } from "../lib/download";
import AddTokenModal from "./AddTokenModal";
import { Progress } from "@nextui-org/react";

export default function SafeStealthAccountGenerator() {
  const account = useAccount();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const { signMessage } = useSignMessage({
    mutation: {
      async onSuccess(data) {
        try {
          setLoading(true);
          setLoadingText("Recovering addresses...");
          const results = await generateSafeStealthAccounts({
            signature: data,
            chainId,
            startNonce,
            endNonce,
            safeVersion: safeVersion as SafeVersion,
            useDefaultAddress,
            setProgress,
          });
          setLoadingText("Fetching token balances...");
          await fetchTokenBalances(results, tokens);
          setLoadingText("");
          setAddresses(results);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      },
    },
  });
  const [addresses, setAddresses] = useState<StealthAddress[]>([]); // [ { nonce: bigint, stealthSafeAddress: `0x${string}` }
  const [arbitraryMessage, setArbitraryMessage] = useState<string>("");
  const [chainId, setChainId] = useState<number>(0);
  const [safeVersion, setSafeVersion] = useState<string>("1.3.0");
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [startNonce, setStartNonce] = useState(BigInt(0));
  const [endNonce, setEndNonce] = useState(BigInt(10));
  const [customRpc, setCustomRpc] = useState<string>("");
  const [tokens, setTokens] = useState<string[]>([
    "ETH",
    "USDC",
    "USDT",
    "DAI",
  ]);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[][]>([]);
  const [pin, setPin] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<"" | "standard" | "advanced">("");
  const { isOpen, onOpenChange } = useDisclosure();

  const recoverAddresses = async () => {
    setLoading(true);
    try {
      let messageToSign = arbitraryMessage;
      if (mode === "standard") {
        messageToSign = fluidkeyMessage(account?.address!, pin);
      }
      signMessage({ message: messageToSign });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenBalances = async (
    addresses: StealthAddress[],
    tokens: string[]
  ) => {
    const balances = await Promise.all(
      addresses.map(async (stealthAddress: StealthAddress) => {
        return await getAddressTokenBalances(
          stealthAddress.stealthSafeAddress,
          account.chainId!,
          tokens
        );
      })
    );
    setTokenBalances(balances);
  };

  const onAddToken = async (token: string) => {
    await fetchTokenBalances(addresses, [...tokens, token]);
    setTokens([...tokens, token]);
  };

  const reset = () => {
    setAddresses([]);
    setTokenBalances([]);
    setMode("");
  };

  return (
    <div className="flex flex-col justify-evenly text-center w-3xl">
      {mode === "" && (
        <div className="flex flex-col items-center justify-center space-y-2">
          <Button color="primary" onClick={() => setMode("standard")}>
            Generate keys
          </Button>
          <p className="text-xs text-default-500">
            Experienced user? Try the{" "}
            <Link
              href={"/"}
              onClick={(e) => {
                e.preventDefault();
                setMode("advanced");
              }}
              className="text-primary font-semibold hover:text-primary-700"
            >
              advanced keys generation
            </Link>
            .
          </p>
        </div>
      )}
      {mode !== "" && addresses.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-4">
          {mode === "standard" && (
            <Card className="w-full">
              <CardBody className="flex flex-col items-center justify-center space-y-4">
                <p className="font-semibold text-center">
                  Enter your 4-digit pin
                </p>
                <PinInput onInsertedPin={(pin: string) => setPin(pin)} />
              </CardBody>
            </Card>
          )}
          {mode === "advanced" && (
            <>
              <Textarea
                label="Arbitrary message"
                value={arbitraryMessage}
                onValueChange={setArbitraryMessage}
                placeholder="Set an arbitrary message to sign yourself..."
              />
            </>
          )}
          <Accordion variant="shadow" isCompact>
            <AccordionItem
              aria-label="Custom parameters"
              title={
                <p className="text-xs font-semibold w-[250px]">
                  Custom parameters
                </p>
              }
            >
              <div className="pb-2 flex flex-col space-y-2">
                <Input
                  type="number"
                  label="Chain ID"
                  value={chainId.toString()}
                  min={0}
                  onValueChange={(val: string) => setChainId(parseInt(val))}
                  isRequired
                  endContent={
                    <Tooltip content="ID of the chain. (Default: 0)">
                      <Info className="cursor-pointer" size={16} />
                    </Tooltip>
                  }
                />
                <Input
                  label="Safe Version"
                  value={safeVersion}
                  // disabled because right now they support only 1.3.0
                  isDisabled
                  onValueChange={(e) => setSafeVersion(e)}
                  isRequired
                  endContent={
                    <Tooltip content="Version of the Safe Smart Contracts. (Default and only supported version: 1.3.0)">
                      <Info className="cursor-pointer" size={16} />
                    </Tooltip>
                  }
                />
                <Input
                  type="number"
                  label="Start Nonce"
                  value={startNonce.toString()}
                  onValueChange={(e) => setStartNonce(BigInt(e))}
                  isRequired
                  endContent={
                    <Tooltip content="Starting nonce for the keys generation. (Default: 0)">
                      <Info className="cursor-pointer" size={16} />
                    </Tooltip>
                  }
                />
                <Input
                  type="number"
                  label="End Nonce"
                  value={endNonce.toString()}
                  onValueChange={(e) => setEndNonce(BigInt(e))}
                  isRequired
                  endContent={
                    <Tooltip content="Ending nonce for the keys generation. (Default: 10)">
                      <Info className="cursor-pointer" size={16} />
                    </Tooltip>
                  }
                />
                <Input
                  label="Custom RPC"
                  value={customRpc}
                  type="text"
                  onValueChange={setCustomRpc}
                  endContent={
                    <Tooltip content="Custom RPC to generate keys or scan balances. (Defaults to your wallet one)">
                      <Info className="cursor-pointer" size={16} />
                    </Tooltip>
                  }
                />
                <Checkbox
                  isSelected={useDefaultAddress}
                  onValueChange={setUseDefaultAddress}
                >
                  <p className="text-sm">Use default address</p>
                </Checkbox>
              </div>
            </AccordionItem>
          </Accordion>
          <div className="flex flex-row space-x-2 items-center justify-center">
            <Button
              color="primary"
              isDisabled={
                (mode === "standard" && pin.length !== 4) ||
                (mode === "advanced" && arbitraryMessage.length === 0)
              }
              isLoading={loading}
              onClick={() => recoverAddresses()}
            >
              {loadingText ? loadingText : "Recover addresses"}
            </Button>
            <Button variant="flat" onClick={() => setMode("")}>
              Back
            </Button>
          </div>
        </div>
      )}
      {loading && (
        <Progress
          aria-label="Loading..."
          value={progress}
          maxValue={parseFloat(endNonce.toLocaleString())}
          color="primary"
          className="w-full mt-4"
        />
      )}
      {addresses && addresses.length > 0 && (
        <>
          <div className="flex flex-row items-center justify-between mb-4 px-4 md:px-0">
            <Button
              color="primary"
              variant="flat"
              startContent={<CoinsIcon />}
              onPress={() => onOpenChange()}
            >
              Add token
            </Button>
            <div className="flex flex-row space-x-2 items-center justify-end">
              <Button
                color="primary"
                isDisabled={pin.length !== 4}
                isLoading={loading}
                onClick={() => downloadAddressesAsCSV(addresses)}
                startContent={<DownloadCloud />}
              >
                Download
              </Button>
              <Button variant="flat" onClick={() => reset()}>
                Back
              </Button>
            </div>
          </div>
          <StealthAddressesTables
            stealthSafeAddresses={addresses}
            tokenBalances={tokenBalances}
            tokens={tokens}
          />
        </>
      )}
      <AddTokenModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onAddToken={onAddToken}
      />
    </div>
  );
}
