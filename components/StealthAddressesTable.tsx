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
export default function StealthAddressesTables({
  stealthSafeAddresses,
  tokenBalances,
}: {
  stealthSafeAddresses: StealthAddress[];
  tokenBalances: TokenBalance[][];
}) {
  return (
    <Table isStriped>
      <TableHeader>
        <TableColumn>Nonce</TableColumn>
        <TableColumn>Address</TableColumn>
        <TableColumn>ETH</TableColumn>
        <TableColumn>USDC</TableColumn>
        <TableColumn>USDT</TableColumn>
        <TableColumn>DAI</TableColumn>
      </TableHeader>
      <TableBody>
        {stealthSafeAddresses.map((address, index) => (
          <TableRow key={address.nonce}>
            <TableCell>{address.nonce.toLocaleString()}</TableCell>
            <TableCell>{address.stealthSafeAddress}</TableCell>
            <TableCell>
              {tokenBalances[index].find((t) => t.token === "USDC")?.balance}
            </TableCell>
            <TableCell>{tokenBalances[index].find((t) => t.token === "USDC")?.balance}</TableCell>
            <TableCell>{tokenBalances[index].find((t) => t.token === "USDT")?.balance}</TableCell>
            <TableCell>{tokenBalances[index].find((t) => t.token === "DAI")?.balance}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
