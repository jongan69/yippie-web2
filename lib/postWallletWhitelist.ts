export const postWhitelist = async (publicKey: string, balance: any) => {
    try {
        return await fetch("/api/saveWallet", {
            method: "POST",
            body: JSON.stringify({ walletAddress: publicKey, balance: balance })
        }).then(data => data.json())
            .then((response) => {
                if (response.success === true) {
                    return "Congrats! you've been added to the whitelist!"
                } else {
                    return response
                }
            })
    } catch (error) {
        return error
    }
}