import { siteConfig } from '@/config/site';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const halvingBlockHeight = siteConfig.halvingBlockHeight;
  const averageBlockTimeMinutes = 10; // Average time to mine a block in minutes
  try {
    const response = await fetch('https://blockchain.info/latestblock');
    const data = await response.json();
    const currentBlockHeight = data.height;
    // Calculate the number of blocks until the halving
    const blocksUntilHalving = halvingBlockHeight - currentBlockHeight;
    // Estimate the time until the halving in minutes
    const minutesUntilHalving = blocksUntilHalving * averageBlockTimeMinutes;
    // Convert minutes into days, hours, and minutes
    const days = Math.floor(minutesUntilHalving / 1440);
    const hours = Math.floor((minutesUntilHalving % 1440) / 60);
    const minutes = minutesUntilHalving % 60;
    return NextResponse.json({
      currentBlockHeight,
      blocksUntilHalving,
      timeUntilHalving: `${days} days, ${hours} hours, and ${minutes} minutes`
    });
  } catch (error) {
    console.error("Failed to fetch current block height:", error);
    return NextResponse.json({ error: "Failed to fetch current block height" });
  }
}
