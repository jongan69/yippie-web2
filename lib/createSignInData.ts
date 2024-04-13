import { SolanaSignInInput } from "@solana/wallet-standard-features";

export const createSignInData = async (): Promise<SolanaSignInInput> => {
  const now: Date = new Date();
  const uri = window.location.href
  const currentUrl = new URL(uri);
  const domain = currentUrl.host;

  // Convert the Date object to a string
  const currentDateTime = now.toISOString();
  const signInData: SolanaSignInInput = {
    domain,
    statement: "Welcome to MEMEME, the MEME Betting Marketplace and AI Meme coin trading firm, funance if you will.",
    chainId: "mainnet",
    issuedAt: currentDateTime,
    resources: ["https://mememe.ooo", "https://phantom.app/"],
  };

  return signInData;
};