import { siteConfig } from "@/config/site"

export const fetchGameData: any = async (walletAddress: any) => {
    try {

        let call = await fetch('/api/gameData', { method: 'POST', body: JSON.stringify({ contractAddress: siteConfig.contractAddress, walletAddress }) })
            .then(data => data.json())
            .then((resData: any) => { return resData.gameData })
            .finally()

        return call
    } catch (error) {
        return error
    }
}