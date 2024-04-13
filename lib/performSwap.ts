import { Connection, VersionedTransaction } from '@solana/web3.js';
import fetch from 'cross-fetch';

// Function to perform the swap
export async function performSwap(userWallet: any, inputMint: any, outputMint: any, amount: any, slippageBps: any, rpcUrl?: any) {
    try {
        // Set up connection to Solana blockchain
        const connection = new Connection(rpcUrl ?? 'https://neat-hidden-sanctuary.solana-mainnet.discover.quiknode.pro/2af5315d336f9ae920028bbb90a73b724dc1bbed/');
        // Get quote for the swap
        const quoteResponse = await (
            await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`)
        ).json();

        if (!quoteResponse || quoteResponse.error) {
            throw new Error(`Failed to get quote for swap: ${quoteResponse.error}`);
        }

        const bodyData = JSON.stringify({
            quoteResponse,
            userPublicKey: userWallet, // No need for user's private key
            wrapAndUnwrapSol: true
        })
        // console.log(quoteResponse)
        // console.log(bodyData)
        // Get serialized transactions for the swap
        const swapResponse = await (
            await fetch('https://quote-api.jup.ag/v6/swap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: bodyData
            })
        ).json();

        if (!swapResponse || !swapResponse.swapTransaction) {
            throw new Error(`Failed to perform swap: ${JSON.stringify(swapResponse)}`);
        }

        // Deserialize the transaction
        const swapTransactionBuf = Buffer.from(swapResponse.swapTransaction, 'base64');
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

        // Sign the transaction (No need for private key)
        transaction.sign([]); // No need for signer

        // Execute the transaction
        const rawTransaction = transaction.serialize();
        const txid = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            maxRetries: 2
        });
        const confirmation = await connection.confirmTransaction(txid);
        console.log(`Swap transaction successful. Transaction ID: ${confirmation}`);
        return { txid, status: 200 };
    } catch (error: any) {
        const message = error.message
        // console.log('Error performing swap:', error, message);
        return { message, status: 500 }
    }
}
