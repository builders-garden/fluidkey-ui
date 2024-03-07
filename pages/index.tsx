import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import GenerateStealthSafeAccounts from "../components/GenerateStealthSafeAccounts";
import { useAccount } from "wagmi";
import { Button } from "@nextui-org/react";

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  return (
    <div className="h-screen">
      <Head>
        <title>Stealth Account Recovery</title>
        <meta
          content="Recover your stealth accounts with ease from a simple UI."
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className="flex flex-col items-center justify-between min-h-screen py-8 h-full relative">
        <div className="flex flex-col space-y-4 text-center pb-4">
          {isConnected && <ConnectButton />}
          <h1 className="text-2xl font-bold">Stealth Safe Accounts</h1>
          <p>Recover your stealth safe accounts with ease.</p>
        </div>
        <div className="flex flex-col space-y-12 justify-center items-center">
          {isConnected && <GenerateStealthSafeAccounts />}
          {!isConnected && (
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => (
                <Button color="primary" onClick={openConnectModal}>
                  Connect Wallet
                </Button>
              )}
            </ConnectButton.Custom>
          )}
        </div>

        <footer className="py-4">
          <a
            href="https://builders.garden"
            rel="noopener noreferrer"
            target="_blank"
          >
            Made with ❤️ by builders garden 🌳
          </a>
        </footer>
      </main>
    </div>
  );
};

export default Home;
