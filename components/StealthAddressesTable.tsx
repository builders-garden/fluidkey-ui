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
}: {
  stealthSafeAddresses: StealthAddress[];
}) {
  return (
    <Table isStriped>
      <TableHeader>
        <TableColumn>Nonce</TableColumn>
        <TableColumn>Address</TableColumn>
        <TableColumn>NATIVE</TableColumn>
        <TableColumn>USDC</TableColumn>
        <TableColumn>USDT</TableColumn>
        <TableColumn>DAI</TableColumn>
      </TableHeader>
      <TableBody>
        {stealthSafeAddresses.map((address) => (
          <TableRow key={address.nonce}>
            <TableCell>{address.nonce.toLocaleString()}</TableCell>
            <TableCell>{address.stealthSafeAddress}</TableCell>
            <TableCell>0</TableCell>
            <TableCell>0</TableCell>
            <TableCell>0</TableCell>
            <TableCell>0</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
