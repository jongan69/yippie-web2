import { createBurnCheckedInstruction, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import bs58 from "bs58";

export async function POST(req: NextRequest) {
  const key = process.env.BURNER_KEY;
  if (req.method !== 'POST' || !key) {
    return new NextResponse(JSON.stringify({ error: 'Method Not Allowed Or Missing Key' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { amount } = await req.json();
    const mintAddress = siteConfig.contractAddress;
    const secretKey = bs58.decode(key);
    const uint8Array = new Uint8Array(secretKey);

    if (!amount || !mintAddress || !secretKey) {
      return new NextResponse(JSON.stringify({ success: false, error: "Amount, mintAddress, and key are required." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const keypair = Keypair.fromSecretKey(uint8Array);
    const connection = new Connection(clusterApiUrl('mainnet-beta'),
      { commitment: 'confirmed', disableRetryOnRateLimit: true, confirmTransactionInitialTimeout: siteConfig.waitTime },
    );
    const mintPublicKey = new PublicKey(mintAddress);
    const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, keypair, mintPublicKey, keypair.publicKey, true);

    const balance = await connection.getTokenAccountBalance(tokenAccount.address);
    const availableSPLTokenBalance: number | null = balance.value.uiAmount;

    if (availableSPLTokenBalance && availableSPLTokenBalance < amount) {
      return new NextResponse(JSON.stringify({ success: false, message: `Amount is greater than burner wallet balance! ${availableSPLTokenBalance} < ${amount}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const burnIx = createBurnCheckedInstruction(tokenAccount.address, mintPublicKey, keypair.publicKey, amount * (10 ** siteConfig.tokenDecimals), siteConfig.tokenDecimals);
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
    let transaction = new Transaction().add(burnIx);
    transaction.recentBlockhash = blockhash;
    transaction.sign(keypair);
    const serializedTransaction = transaction.serialize();
    const txid = await connection.sendRawTransaction(serializedTransaction, { skipPreflight: true });

    const waitForConfirmation = async () => {
      try {
        const confirmation = await connection.confirmTransaction({
          signature: txid,
          blockhash: blockhash,
          lastValidBlockHeight: lastValidBlockHeight
        });
        return { success: true, confirmation };
      } catch (error) {
        console.log(error)
        return { success: false, error };
      }
    };

    // const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ timeout: true }), siteConfig.waitTime));
    // const result: any = await Promise.race([
    //   waitForConfirmation(), 
    //   timeoutPromise
    // ]);

    const result = await waitForConfirmation()

    if (result) {
      return new NextResponse(JSON.stringify({ success: true, message: `Burned ${amount} tokens.`, txid, url: `https://solana.fm/tx/${txid}?cluster=mainnet-beta`, result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Transaction sent but not confirmed within the timeout or an error occurred
      return new NextResponse(JSON.stringify({ success: false, message: `Transaction sent but not confirmed within ${siteConfig.waitTime} milliseconds.`, txid, url: `https://solana.fm/tx/${txid}?cluster=mainnet-beta`, result }), {
        status: 202, // Accepted but not completed
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new NextResponse(JSON.stringify({ success: false, error: error instanceof Error ? error.message : `An unknown error occurred: ${error}`, message: `An error occurred while processing your transaction: ${error}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}