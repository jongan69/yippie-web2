export type SiteConfig = typeof siteConfig

export const siteConfig: any = {
  name: "MEMEME Token",
  description: "The best token on Solana",
  about: "The MEMEME TOKEN is a unique and innovative addition to the meme coin space, serving as an Exchange Traded Fund (ETF) for meme coins on the Solana blockchain. It brings the novelty and fun of meme coins together with the sophistication of ETFs, providing investors with an automated, diversified exposure to the meme coin market. The team aims to capture the essence of meme culture, combining elements of Solana transaction speed, the playful nature of meme coins, and the profitability of bot managed assets with a roadmap as the ecosystems primary currency.",
  shortAbout: "An SPL Token being designed to capture exposure to the dankest meme coins on the Solana blockchain using auto bot rebalancing with utility being engineered for the MEMEME ecosystem.",
  aboutRemarks: "This token is beining designed to balance the supply and demand effectively via ecosystem burns and airdrops, offering a significant portion of the tokens to early adopters while retaining enough supply to ensure long-term viability and liquidity in the market. Feel free to join the whitelist within the app.",
  baseUrl: "mememe.ooo",
  tokenDecimals: 6, // For MVP This is fine but perhaps this can be dynamically read from chain
  mintedSupply: 1_000_000_000_000_000n, // For MVP This is fine but perhaps this can be dynamically read from chain
  rpcProvider: "alchemy",
  isDev: true, // set to block expirimental features
  isAlchemy: true,
  rpcEndpoint: "https://solana-mainnet.g.alchemy.com/v2",
  defaultrpcEndpoint: "https://api.mainnet-beta.solana.com",
  coinBaseUrl: "https://client-api-2-74b1891ee9f9.herokuapp.com/coins", // Maybe pump likes to change this?
  pumpUrl: "https://www.pump.fun/7Q8Q6QbxsgiwAgfGMWWm2wU4bi1sWELCC4Vt3ypw3BM2",
  solscanUrl: "https://solscan.io/token/7Q8Q6QbxsgiwAgfGMWWm2wU4bi1sWELCC4Vt3ypw3BM2",
  burnerAddress: "4cjrPocxTryHXka56qSnNPqJY5METi3UQKMs7EwwPKfs",
  devAddress: "9ex8SZWhb2X5MRmqZt4Uu9UEbWtRbJDnMozbyN5sCU7N",
  contractAddress: "7Q8Q6QbxsgiwAgfGMWWm2wU4bi1sWELCC4Vt3ypw3BM2",
  tokenAddress: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  halvingBlockHeight: 840000,
  airdropPercentage: 0.00000000000001,
  waitTime: 15000, // Max Weight time for api calls to resolve
  whitelistEndDate: null,
  mainNav: [
    {
      title: "",
      href: "/",
    },
    {
      title: "Home",
      href: "/home",
    },
    {
      title: "About",
      href: "/about",
    },
  ],
  links: {
    twitter: "https://twitter.com/mememe69696969",
    github: "https://docs.mememe.ooo"
  },
}
