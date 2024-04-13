export const fetchBalance: any = async (publicKey: any) => {
    try {
        let call = await fetch('/api/mememeBalance', {
            method: 'POST',
            body: JSON.stringify({ walletAddress: publicKey })
        }).then(data => data.json())
            .then((balanceData: any) => {
                return balanceData
            }).finally()
        return call
    } catch (error) {
        return error
    }
}