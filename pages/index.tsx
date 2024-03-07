import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import GenerateStealthSafeAccounts from "../components/GenerateStealthSafeAccounts";
import { useAccount } from "wagmi";
import { Button, Link } from "@nextui-org/react";

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

      <main className="flex flex-col items-center justify-between min-h-screen pb-8 pt-4 h-full relative w-full">
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-4 md:space-y-0 justify-center md:justify-evenly items-center pb-4 w-full px-4 text-center">
          <h1 className="text-2xl font-bold">Stealth Safe Accounts</h1>
          {isConnected && <ConnectButton />}
          {/* <p>Recover your stealth safe accounts with ease.</p> */}
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

        <footer className="py-4 text-sm">
          Made with ❤️ by{" "}
          <Link isExternal href="https://builders.garden" className="text-sm">
            builders garden 🌳
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default Home;
