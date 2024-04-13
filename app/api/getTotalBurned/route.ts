import { siteConfig } from "@/config/site";
import { fetchTotalSupply } from "@/lib/getTotalSupply";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Fetch the current supply from your API or database
    const totalSupplyResponse: any = await fetchTotalSupply();
    if (typeof totalSupplyResponse !== 'undefined') {
      // Ensure the total supply is treated as a floating-point number for subtraction
      const currentSupply = parseFloat(totalSupplyResponse);
      // Assuming siteConfig.mintedSupply is in a similar floating-point format
      const mintedSupply = parseFloat(siteConfig.mintedSupply);

      console.log('Current Supply: ', currentSupply)
      console.log('Minted Supply: ', mintedSupply)
      if (isNaN(currentSupply) || isNaN(mintedSupply)) {
        throw new Error('Invalid supply or mintedSupply values');
      }
      // Calculate the burned amount, maintaining it as a float
      const burnedAmount = (mintedSupply - currentSupply) / (1000000);

      const formatted = burnedAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })

      const named = `${formatted} ${siteConfig.name}s Burned`
      // Send the burned amount in the response, formatted to two decimal places
      console.log(named)
      return new NextResponse(JSON.stringify({ burned: burnedAmount.toFixed(2), formatted, named }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      return new NextResponse(JSON.stringify({ error: 'Supply is undefined.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    // Handle errors
    return new NextResponse(JSON.stringify({ error: `An error occurred: ${error instanceof Error ? error.message : error}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

