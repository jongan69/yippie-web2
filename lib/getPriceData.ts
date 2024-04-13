export async function getPriceData() {
    try {
        return fetch('/api/getPrice').then(async (data: any) => (await data.json()).price)
    } catch (error) {
        console.error('Error fetching price data:', error);
        return error
    }
}