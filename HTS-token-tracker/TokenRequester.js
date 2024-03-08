async function getUSD(URL){
    try {
        const response = await fetch(URL);
        const data = await response.json();
        const priceUSD = data.openUsd;
        return priceUSD;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function getLiquidityUSD(URL){
    try {
        const response = await fetch(URL);
        const data = await response.json();
        const liquidityUsd = data.openUsd;
        return liquidityUsd;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

module.exports = { getUSD, getLiquidityUSD };