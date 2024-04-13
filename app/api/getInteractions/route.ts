import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    const { image, title } = await req.json();
    if (!image || !title) {
        return NextResponse.json({ error: "Need more info" });
    }
    try {
        const client = await clientPromise;
        const db = client.db("Memes");
        const collection = db.collection("posts");

        // Check if wallet address already exists in the collection
        // Insert the wallet address and balance into the collection
        const result = await collection.insertOne({ image, title });

        return NextResponse.json({ success: true, message: "Wallet address successfully saved.", result });
    } catch (error: any) {
        return NextResponse.json({ error: `Error with DB: ${error.toString()}` });
    }
}
