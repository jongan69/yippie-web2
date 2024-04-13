import { getCoinData } from '@/lib/getCoinData';
import { fetchTotalSupply } from '@/lib/getTotalSupply';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Fetch coin data to get the market cap in USD
    const coinData = await getCoinData();
    const usdMarketCap = coinData.usd_market_cap;
    console.log(`USD Market Cap: ${usdMarketCap}`);

    // Fetch the total supply of the token
    const supplyData = await fetchTotalSupply();
    console.log(`Supply Data: ${supplyData}`);

    // Calculate the price per token in USD
    const pricePerTokenInUsd = usdMarketCap / Number(supplyData);
    const formattedPriceInUsd = pricePerTokenInUsd.toFixed(20); // Format the price to avoid scientific notation

    // Return the formatted price in the response
    return NextResponse.json({ price: formattedPriceInUsd });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to calculate token price.' });
  }
}