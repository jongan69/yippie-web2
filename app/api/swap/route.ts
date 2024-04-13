import { performSwap } from "@/lib/performSwap";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const { userWalletAddress, inputMint, outputMint, amount, slippageBps } = await req.json();
        // Make sure all required parameters are provided
        if (!userWalletAddress || !inputMint || !outputMint || !amount || !slippageBps) {
            return NextResponse.json({ error: "Missing or invalid parameters." });
        }

        const tx = await performSwap(userWalletAddress, inputMint, outputMint, amount, slippageBps);
        console.log(`Success ${tx?.status !== 500}`)
        if (tx?.status !== 500) {
            return Response.json({ status: tx.status, transaction: tx });
        } else {
            return Response.json({ error: tx });
        }
    } catch (error) {
        console.error("Error:", error);
        return Response.json({ error: "Internal Server Error", errors: [JSON.stringify(error)] });
    }
}
