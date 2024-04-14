export type SiteConfig = typeof siteConfig

export const siteConfig: any = {
  name: "YIPPIE!",
  description: "Having fun is our specialty",
  about: "Yippie!!!!!!!!!!",
  shortAbout: "An SPL Token for fun",
  aboutRemarks: "Yippi!!!",
  baseUrl: "Yippie.ooo",
  tokenDecimals: 6, // For MVP This is fine but perhaps this can be dynamically read from chain
  mintedSupply: 1_000_000_000_000_000n, // For MVP This is fine but perhaps this can be dynamically read from chain
  rpcProvider: "alchemy",
  isDev: true, // set to block expirimental features
  isAlchemy: true,
  rpcEndpoint: "https://solana-mainnet.g.alchemy.com/v2",
  defaultrpcEndpoint: "https://api.mainnet-beta.solana.com",
  coinBaseUrl: "https://client-api-2-74b1891ee9f9.herokuapp.com/coins", // Maybe pump likes to change this?
  pumpUrl: "https://pump.fun/FJAMUG9asFCuhW8TnP6KQzyaUFSvAMTojtTZBMsQEVJc",
  solscanUrl: "https://solscan.io/token/FJAMUG9asFCuhW8TnP6KQzyaUFSvAMTojtTZBMsQEVJc",
  burnerAddress: "4cjrPocxTryHXka56qSnNPqJY5METi3UQKMs7EwwPKfs",
  devAddress: "9ex8SZWhb2X5MRmqZt4Uu9UEbWtRbJDnMozbyN5sCU7N",
  contractAddress: "FJAMUG9asFCuhW8TnP6KQzyaUFSvAMTojtTZBMsQEVJc",
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
