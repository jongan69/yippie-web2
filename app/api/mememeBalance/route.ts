import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

export async function POST(req: Request, res: Response) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' })
  }
  // Extract the wallet address from the request body
  const { walletAddress } = await req.json();
  if (!walletAddress) {
    return NextResponse.json({ error: `Wallet address is required, Got: ${walletAddress}` })
  }

  try {
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    const walletPubKey = new PublicKey(walletAddress)
    const specificTokenAddress = siteConfig.contractAddress;
    const key = new PublicKey(specificTokenAddress)

    const tokenAccounts = await connection.getTokenAccountsByOwner(
      walletPubKey,
      { programId: TOKEN_PROGRAM_ID }
    );
    let balance = '0'
    tokenAccounts.value.forEach((tokenAccount) => {
      const accountData = AccountLayout.decode(tokenAccount.account.data);
      if (accountData.mint.toString() === key.toString()) {
        // Respond with the balances
        balance = accountData.amount.toString()
        console.log(balance)
      }
    })
    const actualBalance = (Number(balance) / (1000000)).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    const message = `Balance: ${actualBalance} ${siteConfig.name}`
    return NextResponse.json({ balance, actualBalance, message })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: `Failed to fetch token balances: ${error}` })
  }
}