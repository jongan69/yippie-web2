import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { siteConfig } from "@/config/site";

export async function POST(req: Request) {
    const { contractAddress } = await req.json();
    const key = process.env.BURNER_KEY;
    if (!key) {
        return NextResponse.json({ success: false, error: "Server configuration error." });
    }
    if (!contractAddress || contractAddress !== siteConfig.contractAddress) {
        return NextResponse.json({ success: false, error: "Matching contractAddress is required." });
    }
    try {
        const client = await clientPromise;
        const db = client.db("WalletWhitelist");
        const users = await db.collection("EarlySigners").find().toArray();

        if (!users || users.length === 0) {
            return NextResponse.json({ success: false, error: "No users found" });
        }

        const walletAddresses = users.map(user => user.walletAddress);

        return NextResponse.json({ success: true, message: `Found ${users.length}`, walletAddresses });
    } catch (error) {
        console.error(error); // For debugging
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "An unknown error occurred." });
    }
}
