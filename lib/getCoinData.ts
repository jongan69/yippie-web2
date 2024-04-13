import { siteConfig } from "@/config/site";

export const getCoinData = async () => {
    try {
      return await fetch(`${siteConfig.coinBaseUrl}/${siteConfig.contractAddress}`).then(data => data.json())
    } catch (error) {
      console.error("Failed to fetch coin data:", error);
      return error
    }
  };