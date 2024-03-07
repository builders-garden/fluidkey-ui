import { StealthAddress } from "./fluidkey";

export const downloadAddressesAsCSV = (addresses: StealthAddress[]) => {
  const csv = addresses.map((address) => {
    return `${address.nonce},${address.stealthSafeAddress}`;
  });
  const csvContent = `data:text/csv;charset=utf-8,${csv.join("\n")}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "stealth-safe-addresses.csv");
  document.body.appendChild(link);
  link.click();
};

export const downloadEphemeralPrivateKey = (
  address: `0x${string}`,
  ephemeralPrivateKey: `0x${string}`
) => {
  const element = document.createElement("a");
  const file = new Blob([ephemeralPrivateKey], {
    type: "text/plain",
  });
  element.href = URL.createObjectURL(file);
  element.download = `${address}-ephemeral-private-key.txt`;
  document.body.appendChild(element);
  element.click();
};
