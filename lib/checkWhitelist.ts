export const checkWhitelist = async (publicKey: any) => {
    try {
        const wlData = await fetch("/api/walletSearch", {
            method: "POST",
            body: JSON.stringify({ walletAddress: publicKey })
        }).then(async data => (await data.json()).exists)
        console.log(wlData)
        return wlData
    } catch (error) {
        return error
    }
}