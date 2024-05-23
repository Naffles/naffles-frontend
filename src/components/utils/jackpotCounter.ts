import axios from "@components/utils/axios";


export const jackpotDetails = async (prizePoolType: string) => {
    const { data } = await axios.get(
        `/admin/jackpot/${prizePoolType}?isGiveaway=true`
    );

    console.log(data, 'data')
    return data;
} 

export const jackpotAmount = async (prizePoolType: string) => {
    const response = await axios.get(
        `/admin/jackpot/${prizePoolType}?isGiveaway=true`
    );

    const jackpotPointsPerTenSeconds = response.data.data.jackpotPointsPerTenSeconds;
    const lastUpdated = response.data.data.jackpot.lastUpdated;
    const jackpotTotal = response.data.data.jackpot.totalAmount;

    const amount = jackpotPointsPerTenSeconds * Math.floor((Date.now() - lastUpdated) / 1000 / 10)

    return {jackpotInitial: jackpotTotal + amount, jackpotPointPerSec: jackpotPointsPerTenSeconds};
}

export const jackpotWinners = async (limit: number) => {
    const response = await axios.get(
        `/raffle/jackpot/history/all?page=1&limit=${limit}`
    );

    console.log(response.data.data.jackpotHistory, 'asd')

    return response.data.data.jackpotHistory;
}

export const getCryptoPrice = async (cryptoName: string, amount: number) => {
    const response = await axios.get(
        `/crypto/price`
    );

    console.log(response.data.data, 'asd')
    switch (cryptoName.toLowerCase()) {
        case 'eth':
            return response.data.data.ethereum.usd * amount;
        case 'sol':
            return response.data.data.solana.usd * amount;
        default:
            return 0;
    }
}