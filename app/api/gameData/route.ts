import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb"; // Needed to convert string IDs to MongoDB ObjectIds
import { siteConfig } from "@/config/site";

export async function POST(req: Request) {
    const { contractAddress, walletAddress } = await req.json();
    const key = process.env.BURNER_KEY;

    if (!key) {
        return NextResponse.json({ success: false, error: "Server configuration error." });
    }
    if (!contractAddress || contractAddress !== siteConfig.contractAddress) {
        return NextResponse.json({ success: false, error: "Matching contractAddress is required." });
    }
    if (!walletAddress) {
        return NextResponse.json({ success: false, error: "walletAddress is required." });
    }

    try {
        const client = await clientPromise;
        // Connect to the Users database
        const usersDb = client.db("Users");
        const usersCollection = usersDb.collection("walletAddresses");

        // Attempt to find the user by walletAddress. If not found, upsert creates the user with an empty previouslySeen array
        const user: any = await usersCollection.findOneAndUpdate(
            { walletAddress: walletAddress },
            { $setOnInsert: { previouslySeen: [] } },
            { upsert: true, returnDocument: 'after' }
        );
        // Use the previouslySeen array from the user document to filter out game data
        const previouslySeenIds = user.previouslySeen.map((id: number) => new ObjectId(id));
        console.log(previouslySeenIds)
        const db = client.db("Memes");
        if (previouslySeenIds.length > 0) {
            const gameData = await db.collection("posts")
                .find({ _id: { $nin: previouslySeenIds } }) // Filter out posts the user has seen
                .toArray();
            if (!gameData || gameData.length === 0) {
                return NextResponse.json({ success: false, error: "No new game data found" });
            }
            return NextResponse.json({ success: true, gameData });
        } else {
            const gameData = await db.collection("posts").find().toArray();
            return NextResponse.json({ success: true, gameData });
        }
    } catch (error) {
        console.error(error); // For debugging
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "An unknown error occurred." });
    }
}
