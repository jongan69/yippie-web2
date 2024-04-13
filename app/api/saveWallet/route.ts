import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(req: Request) {
    const { walletAddress, balance } = await req.json();
    if (!walletAddress) {
        return NextResponse.json({ error: "Wallet address is required." });
    }
    try {
        const client = await clientPromise;
        const db = client.db("WalletWhitelist");
        // Attempt to insert the wallet address as a document
        const walletCheck = await db.collection("EarlySigners").find({ walletAddress: walletAddress }).toArray();
        if (walletCheck.length === 0) {
            const walletSave = await db.collection("EarlySigners")
                .insertOne({ walletAddress: walletAddress, balance });
            return NextResponse.json({ success: true, message: "Wallet address successfully saved.", walletSave });
        } else {
            return NextResponse.json({ error: "This wallet address has already been registered." });
        }
    } catch (e: any) {
        return NextResponse.json({ error: `Error with DB: ${e.toString()}` });
    }
}