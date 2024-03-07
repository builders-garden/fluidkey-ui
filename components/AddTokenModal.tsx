import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { chainIds, lifi } from "../lib/lifi";
import { checksumAddress } from "viem";

export default function AddTokenModal({
  isOpen,
  onOpenChange,
  onAddToken,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddToken: (token: string) => void;
}) {
  const [contractAddress, setContractAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const checkToken = async () => {
    setLoading(true);
    try {
      if (contractAddress.length !== 42) {
        setError("Invalid address length");
        return;
      }
      if (!contractAddress.startsWith("0x")) {
        setError("Invalid address format");
        return;
      }
      const { tokens } = await lifi.getTokens();
      let symbol = "";
      for (const chainId of chainIds) {
        const chainToken = tokens[chainId].find(
          (token) =>
            checksumAddress(token.address as `0x${string}`) ===
            checksumAddress(contractAddress as `0x${string}`)
        );
        if (chainToken) {
          symbol = chainToken.symbol;
          break;
        }
      }
      if (!symbol) {
        setError("Token not found, try another address.");
      } else {
        onAddToken(symbol);
        onOpenChange(false);
        setContractAddress("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} placement={"center"} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Add token</ModalHeader>
            <ModalBody>
              <Input
                label="ERC-20 Contract address"
                onValueChange={setContractAddress}
                value={contractAddress}
                placeholder="0x1234...7890"
                errorMessage={error}
                onFocus={() => setError("")}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                isLoading={loading}
                isDisabled={!contractAddress}
                color="primary"
                onPress={() => checkToken()}
              >
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
