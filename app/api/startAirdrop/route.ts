import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { siteConfig } from "@/config/site";
import { getOrCreateAssociatedTokenAccount, createTransferCheckedInstruction } from "@solana/spl-token";
import { Keypair, Connection, clusterApiUrl, PublicKey, Transaction } from "@solana/web3.js";
import bs58 from "bs58";

const timeout = (ms: number | undefined) => new Promise((resolve, reject) => setTimeout(() => reject(new Error("This API Call Timed out, Please try again or call the dev a pussy")), ms));

export async function POST(req: Request) {
    const { contractAddress } = await req.json();
    const key = process.env.BURNER_KEY;
    if (!key) {
        return NextResponse.json({ success: false, error: "Server configuration error." });
    }

    const secretKey = bs58.decode(key);
    const senderKeypair = Keypair.fromSecretKey(secretKey);
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    const mintPublicKey = new PublicKey(siteConfig.contractAddress);
    if (!contractAddress || contractAddress !== siteConfig.contractAddress) {
        return NextResponse.json({ success: false, error: "Matching contractAddress is required." });
    }

    try {
        const client = await clientPromise;
        const db = client.db("WalletWhitelist");
        const users = await db.collection("EarlySigners").find().toArray();

        if (users.length === 0) {
            return NextResponse.json({ success: false, error: "No users found for the airdrop." });
        }

        let totalSPLTokensNeeded = users.reduce((acc, user) => acc + Math.floor(user.balance * siteConfig.airdropPercentage), 0);
        const senderTokenAccount = await getOrCreateAssociatedTokenAccount(connection, senderKeypair, mintPublicKey, senderKeypair.publicKey);
        const tokenBalance = await connection.getTokenAccountBalance(senderTokenAccount.address);
        const availableSPLTokenBalance: number | null = tokenBalance.value.uiAmount;

        if (availableSPLTokenBalance && availableSPLTokenBalance < totalSPLTokensNeeded) {
            const shortfallTokens = totalSPLTokensNeeded - availableSPLTokenBalance;
            return NextResponse.json({ success: false, error: `Insufficient SPL token balance for the airdrop. Needed: ${shortfallTokens} more SPL tokens.` });
        }

        const addresses: any[] = [];
        const txIds: any[] = [];
        // Implementing Promise.race with a timeout
        const operationPromise = async () => {
            for (const user of users) {
                const amount = Math.floor(user.balance * siteConfig.airdropPercentage);
                if (user.walletAddress === senderKeypair.publicKey.toString()) {
                    console.log(`Skipping Airdrop to self ${user.walletAddress}`);
                    continue;
                }
                console.log(`Trying to airdrop ${amount} to ${user.walletAddress}`);
                const destinationPublicKey = new PublicKey(user.walletAddress);
                const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(connection, senderKeypair, mintPublicKey, destinationPublicKey);
                const senderTokenAccount = await getOrCreateAssociatedTokenAccount(connection, senderKeypair, mintPublicKey, senderKeypair.publicKey);
                const transferIx = createTransferCheckedInstruction(
                    senderTokenAccount.address,
                    mintPublicKey,
                    destinationTokenAccount.address,
                    senderKeypair.publicKey,
                    amount,
                    siteConfig.tokenDecimals
                );
                const { blockhash } = await connection.getLatestBlockhash("confirmed");
                let transaction = new Transaction().add(transferIx);
                transaction.recentBlockhash = blockhash;
                transaction.sign(senderKeypair);
                const serializedTransaction = transaction.serialize();
                // Really Ugly and has some minor error but guaratees a tx id is posted
                await connection.sendRawTransaction(serializedTransaction, { skipPreflight: true, preflightCommitment: "confirmed" }).then((txid) => {
                    try {
                        if (txid !== null) {
                            addresses.push(user.walletAddress)
                            console.log("Unconfirmed txId: ", txid)
                            txIds.push(`https://solana.fm/tx/${txid}`);
                        }
                    } catch (error) {
                        txIds.push(`Error airdropping ${user.walletAddress}`);
                    }
                })
            }
            return txIds;
        };
        const result = await Promise.race([
            operationPromise(),
            timeout(siteConfig.waitTime) // 10 seconds timeout
        ]);
        return NextResponse.json({ success: true, message: `Airdrop Attempted but tx's are not confirmed, please verify and contact dev if issue.`, txIds: result, addressesAirdropped: addresses });
    } catch (error) {
        console.error(error); // For debugging
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "An unknown error occurred." });
    }
}
