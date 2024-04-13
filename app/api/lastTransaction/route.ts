import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' })
  }

  // Extract the contract address from the request body
  const { contractAddress } = await req.json();
  if (!contractAddress) {
    return NextResponse.json({ error: `Contract address is required, Got: ${contractAddress}` })
  }

  try {
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    const contractPubKey = new PublicKey(contractAddress)
    const signatures = await connection.getSignaturesForAddress(contractPubKey, { limit: 10 });
    const transactions = await Promise.all(
      signatures.map(async (signatureInfo) =>
        connection.getTransaction(signatureInfo.signature, {
          maxSupportedTransactionVersion: 0,
        },))
    );
    return NextResponse.json({ transactions })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: `Failed to fetch token balances: ${error}` })
  }
}
