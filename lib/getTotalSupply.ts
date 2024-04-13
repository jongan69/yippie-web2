import { getMint } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { siteConfig } from '@/config/site';

// Function to fetch the total supply of an SPL token
export async function fetchTotalSupply(endpoint?: any) {
    try {
        // Create a new connection to the Solana blockchain
        const connection = new Connection(
            endpoint ?? clusterApiUrl('mainnet-beta'), // You can change 'mainnet-beta' to another cluster (devnet or testnet) if needed
            'confirmed'
        );

        // Convert the mint address from a string to a PublicKey
        const mintPublicKey = new PublicKey(siteConfig.contractAddress);

        // Fetch the mint account information
        const mintAccountInfo = await getMint(
            connection,
            mintPublicKey,
        );

        // The total supply of the SPL token is stored in the mintAccountInfo object
        const totalSupply = mintAccountInfo.supply;

        // Convert the total supply from a BN (BigNumber) to a string for easy reading
        // Note: You may want to convert it differently depending on how you wish to display/use the total supply
        return totalSupply.toString();
    } catch (error) {
        console.error("Failed to fetchTotalSupply:", error);
        return error
    }
}