import { getCoinData } from '@/lib/getCoinData';
import { fetchTotalSupply } from '@/lib/getTotalSupply';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch coin data to get the market cap in USD
    const coinData = await getCoinData();
    const usdMarketCap = coinData.usd_market_cap;
    console.log(`USD Market Cap: ${usdMarketCap}`);
    // Fetch the total supply of the token
    const supply = await fetchTotalSupply();
    console.log(`Supply Data: ${supply}`);
    // Return the formatted price in the response
    const formatted = (Number(supply) / 1000000)
    const named = formatted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return NextResponse.json({ supply, formatted, named });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to calculate token price.' });
  }
}