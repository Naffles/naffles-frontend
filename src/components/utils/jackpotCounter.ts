import axios from "@components/utils/axios";
import toast from "react-hot-toast";

export const jackpotDetails = async (prizePoolType: string) => {
  const { data } = await axios.get(
    `/admin/jackpot/${prizePoolType}?isGiveaway=true`
  );

  return data;
};

export const jackpotAmount = async (prizePoolType: string) => {
  const response = await axios.get(
    `/admin/jackpot/${prizePoolType}?isGiveaway=true`
  );

  const jackpotPointsPerTenSeconds =
    response.data.data.jackpotPointsPerTenSeconds;
  const lastUpdated = response.data.data.jackpot.lastUpdated;
  const jackpotTotal = response.data.data.jackpot.totalAmount;

  const amount =
    jackpotPointsPerTenSeconds *
    Math.floor((Date.now() - lastUpdated) / 1000 / 10);

  return {
    jackpotInitial: jackpotTotal + amount,
    jackpotPointPerSec: jackpotPointsPerTenSeconds,
  };
};

export const jackpotWinners = async (limit: number) => {
  const response = await axios.get(
    `/raffle/jackpot/history/all?page=1&limit=${limit}`
  );

  return response.data.data.jackpotHistory;
};

export const jackpotGiveawayStartDate = async () => {
  try {
    const response = await axios.get(`/raffle/giveaways`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching jackpot giveaway start date:', error); // Log the error
  }
};

export const recentWinners = async () => {
  try {
    const response = await axios.get(`/game/history/`);
    console.log("recentWinners:", response);
    if (response.status == 200) return response.data.data.gameData;
  } catch (error: any) {
    const errorData = error.response?.data;
    // toast.error(`Error fetching recentWinners: ${errorData.message}`);
    console.log(`Error fetching recentWinners: ${errorData.message}`);
  }
};

export const getCryptoPrice = async (cryptoName: string, amount: any) => {
  const response = await axios.get(`/crypto/price`);

  switch (cryptoName.toLowerCase()) {
    case "eth":
      return response.data.data.ethereum.usd * amount;
    case "sol":
      return response.data.data.solana.usd * amount;
    default:
      return 0;
  }
};
