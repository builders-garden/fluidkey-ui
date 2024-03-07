import { TokenBalance } from "../lib/lifi";
import { StealthAddress } from "../lib/fluidkey";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { sliceHex } from "viem";
import { useMemo, useState } from "react";
import { Button, Pagination } from "@nextui-org/react";
import { Key } from "lucide-react";
import { downloadEphemeralPrivateKey } from "../lib/download";
export default function StealthAddressesTables({
  stealthSafeAddresses,
  tokenBalances,
  tokens = ["ETH", "USDC", "USDT", "DAI"],
}: {
  stealthSafeAddresses: StealthAddress[];
  tokenBalances: TokenBalance[][];
  tokens: string[];
}) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const pages = Math.ceil(stealthSafeAddresses.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return stealthSafeAddresses.slice(start, end);
  }, [page, stealthSafeAddresses]);

  console.log(tokenBalances);
  return (
    <div className="overflow-x-scroll flex flex-col items-center justify-center w-screen md:w-auto p-4 md:p-1">
      <Table
        isStriped
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[420px]",
        }}
      >
        <TableHeader>
          <TableColumn>Nonce</TableColumn>
          <TableColumn>Address</TableColumn>
          {tokens.map((token) => (
            <TableColumn key={token}>{token}</TableColumn>
          ))}
          <TableColumn>{""}</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((address, index) => (
            <TableRow key={address.nonce}>
              <TableCell>{address.nonce.toLocaleString()}</TableCell>
              <TableCell>{sliceHex(address.stealthSafeAddress)}</TableCell>
              {tokens.map((token) => (
                <TableCell key={token}>
                  {tokenBalances[index].find((t) => t.token === token)?.balance}
                </TableCell>
              ))}
              <TableCell>
                <Button
                  size="sm"
                  color="primary"
                  isIconOnly
                  onClick={() =>
                    downloadEphemeralPrivateKey(
                      address.stealthSafeAddress,
                      address.ephemeralPrivateKey
                    )
                  }
                >
                  <Key size={12} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
