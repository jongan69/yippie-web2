export const fetchBtc: any = async () => {
    try {
        return await fetch('/api/btcBlockHeight').then(data => data.json())
    } catch (error) {
        return error
    }
}