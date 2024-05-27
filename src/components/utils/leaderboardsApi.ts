import axios from "@components/utils/axios";
import toast from "react-hot-toast";

export const fetchLeaderboard = async (type: string, page: number, limit: number) => {
  const { data } = await axios.get(
    // `user/leaderboards/top-gamers?page=1&limit=10`
    `user/leaderboards/${type}?page=${page}&limit=${limit}`
  );

  return data;
};

export const jackpotWinners = async (limit: number) => {
  const response = await axios.get(
    `/raffle/jackpot/history/all?page=1&limit=${limit}`
  );

  return response.data.data.jackpotHistory;
};

export const recentWinners = async () => {
  try {
    const response = await axios.get(`/game/history/`);
    console.log("recentWinners:", response);
    if (response.status == 200) return response.data.data.gameData;
  } catch (error: any) {
    const errorData = error.response?.data;
    toast.error(`Error fetching recentWinners: ${errorData.message}`);
  }
};
