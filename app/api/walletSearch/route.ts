import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(req: Request) {
    // Parsing the request body to extract walletAddress
    const { walletAddress } = await req.json();

    // Ensuring walletAddress is provided in the request
    if (!walletAddress) {
        return NextResponse.json({ error: "Wallet address is required." });
    }

    try {
        // Establishing a connection to the database
        const client = await clientPromise;
        const db = client.db("WalletWhitelist");

        console.log(`Looking for ${walletAddress}`)
        // Checking if the walletAddress is already in the EarlySigners collection
        const walletCheck = await db.collection("EarlySigners").findOne({ walletAddress: walletAddress });

        // If walletCheck is null, it means the wallet address was not found in the collection
        if (walletCheck === null) {
            // Returning false since the wallet address was not found
            return NextResponse.json({ exists: false });
        } else {
            // Returning true since the wallet address was found
            return NextResponse.json({ exists: true });
        }
    } catch (e: any) {
        // Handling any errors that occur during the database operations
        return NextResponse.json({ error: `Error with DB: ${e.message}` });
    }
}
