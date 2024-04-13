import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    const { memeId, action, user } = await req.json();

    if (!memeId || !action || !['like', 'dislike'].includes(action) || !user) {
        return NextResponse.json({ error: "Missing or invalid parameters." });
    }

    try {
        const client = await clientPromise;
        const db = client.db("Memes");
        const postsCollection = db.collection("posts");

        // Convert memeId to ObjectId for MongoDB operations
        const objectId = new ObjectId(memeId);

        // Update the meme based on the action
        const updateField = action === 'like' ? 'likes' : 'dislikes';
        const updateRes = await postsCollection.findOneAndUpdate(
            { _id: objectId },
            { $inc: { [updateField]: 1 } },
            { returnDocument: 'after' }
        );

        if (!updateRes) {
            return NextResponse.json({ error: "Meme with the provided ID not found." });
        }

        // Now, handle the user document for previously seen memes
        const usersDb = client.db("Users");
        const usersCollection = usersDb.collection("walletAddresses");

        // Check if the user exists; if not, create the user with the memeId in previouslySeen
        const userUpdate = await usersCollection.findOneAndUpdate(
            { walletAddress: user },
            { $addToSet: { previouslySeen: objectId } }, // Use $addToSet to avoid duplicates
            { upsert: true, returnDocument: 'after' } // Upsert: true creates the document if it doesn't exist
        );

        return NextResponse.json({ message: `Successfully updated ${action} for meme ID: ${memeId} and user ${userUpdate}.` });
    } catch (e: any) {
        console.error(e); // For debugging
        return NextResponse.json({ error: `Error with DB: ${e.message || e.toString()}` });
    }
}
