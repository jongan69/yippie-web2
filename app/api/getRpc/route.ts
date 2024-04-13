import { NextResponse } from 'next/server'
import { siteConfig } from '@/config/site'

export async function GET(request: Request) {
  if (siteConfig.isAlchemy) {
    const endpoint = `${siteConfig.rpcEndpoint}/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    return NextResponse.json({ endpoint })
  } else {
    const endpoint = `${siteConfig.defaultrpcEndpoint}/`
    return NextResponse.json({ endpoint })
  }
}