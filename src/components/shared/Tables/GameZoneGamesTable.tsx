"use client";

import { useUser } from "@blockchain/context/UserContext";
import useGame from "@components/utils/gamezone";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

interface tableRow {
  id: string;
  game: string;
  player: string;
  playerId: string;
  image: string;
  buyin: number;
  payout: number;
  odds: number;
  currency: string | null;
  allowJoin: boolean;
  myId: string | null | undefined;
  myUsername: string | null | undefined;
}

interface gamezoneReturnArr {
  _id: string;
  gameType: string;
  creator: { profileImage: string; username: string; _id: string };
  betAmount: { $numberDecimal: number };
  odds: { $numberDecimal: number };
  coinType: string;
  status: string;
}

const GameZoneGamesTable = () => {
  const { user, socket } = useUser();
  const setCurrentScreen = useGame((state) => state.setScreen);
  const setGameType = useGame((state) => state.setType);
  const setCoinType = useGame((state) => state.setCoinType);
  const setBetAmount = useGame((state) => state.setBetAmount);
  const setBetOdds = useGame((state) => state.setBetOdds);
  const setGameId = useGame((state) => state.setGameId);
  const setChallengerId = useGame((state) => state.setChallengerId);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<tableRow[]>([]);

  let sample_games_json = [
    {
      id: 1,
      game: "COIN TOSS",
      player: "You",
      image: "/static/sample-account-image-1.png",
      buyin: 10.0,
      payout: 19.7,
      currency: "USDC",
      allowJoin: false,
    },
    {
      id: 2,
      game: "COIN TOSS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-2.png",
      buyin: 1.0,
      payout: 1.97,
      currency: "SOL",
      allowJoin: true,
    },
    {
      id: 3,
      game: "ROCK, PAPER, SCISSORS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-3.png",
      buyin: 6.0,
      payout: 17.75,
      currency: "NAFF",
      allowJoin: true,
    },
    {
      id: 4,
      game: "ROCK, PAPER, SCISSORS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-1.png",
      buyin: 6.0,
      payout: 17.75,
      currency: "NAFF",
      allowJoin: true,
    },
    {
      id: 5,
      game: "COIN TOSS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-2.png",
      buyin: 1.0,
      payout: 1.97,
      currency: "SOL",
      allowJoin: true,
    },
    {
      id: 6,
      game: "COIN TOSS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-2.png",
      buyin: 1.0,
      payout: 1.97,
      currency: "SOL",
      allowJoin: true,
    },
    {
      id: 7,
      game: "COIN TOSS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-3.png",
      buyin: 1.0,
      payout: 1.97,
      currency: "SOL",
      allowJoin: true,
    },
    {
      id: 8,
      game: "ROCK, PAPER, SCISSORS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-2.png",
      buyin: 6.0,
      payout: 17.75,
      currency: "NAFF",
      allowJoin: true,
    },
    {
      id: 9,
      game: "COIN TOSS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-3.png",
      buyin: 1.0,
      payout: 1.97,
      currency: "SOL",
      allowJoin: true,
    },
  ];

  useEffect(() => {
    socket && fetchTableData(user?.id, user?.name);
  }, [socket, user]);

  useEffect(() => {
    const gameJoinRequest = (data: any) => {
      console.log("gameJoinRequest data: ", data);
      setCurrentScreen("accepting");
      setGameType(
        data.game.gameType == "rockPaperScissors"
          ? "Rock, Paper, Scissors"
          : "Coin Toss"
      );
      setCoinType(data.game.coinType);
      setBetAmount(data.game.betAmount.$numberDecimal);
      setBetOdds(data.game.odds.$numberDecimal);
      setGameId(data.game._id);
      setChallengerId(data.challengerId);
    };

    socket?.on("gameJoinRequest", gameJoinRequest);

    return () => {
      socket?.off("gameJoinRequest", gameJoinRequest);
    };
  }, [socket]);

  const fetchTableData = async (
    userId: string | null | undefined,
    userName: string | null | undefined
  ) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}game`, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        console.log("RESULT :", result);
        console.log("userName :", userName);
        result && tableDataSetter(result.data.games, userId, userName);
        result && setIsLoading(false);
        // socket.emit("notificationRoom", { data: userId });
      } else {
        console.error("Failed to create game: ", result.message);
      }
    } catch (error) {
      console.error("Error creating game: ", error);
    }
  };

  const shortenWalletAddress = (address: string) => {
    if (address?.length > 30) {
      return address.slice(0, 5) + "..." + address.slice(-7, -1);
    } else if (address?.length > 15) {
      return address.slice(0, 15) + "...";
    } else return address;
  };

  const tableDataSetter = (
    apiData: gamezoneReturnArr[],
    userId: string | null | undefined,
    userName: string | null | undefined
  ) => {
    let tableData = apiData?.map((item) => {
      return {
        id: item._id,
        game: item.gameType,
        player: item.creator.username,
        playerId: item.creator._id,
        image: item.creator.profileImage,
        buyin: item.betAmount.$numberDecimal,
        payout: item.betAmount.$numberDecimal * item.odds.$numberDecimal,
        odds: item.odds.$numberDecimal,
        currency: item.coinType,
        allowJoin: item.status == "waiting" ? true : false,
        myId: userId,
        myUsername: userName,
      };
    });
    console.log("tableData: ", tableData);
    setTableData(tableData);
  };

  const joinGame = (
    gameId: string,
    userId: string | null,
    gameData: tableRow
  ) => {
    // console.log("joined a game start");
    var currentDate = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + 10);

    console.log("currentDate", currentDate);
    socket?.emit("joinGame", {
      userId: userId,
      gameId: gameId,
      timeout: currentDate,
    });

    setGameType(
      gameData.game == "rockPaperScissors"
        ? "Rock, Paper, Scissors"
        : "Coin Toss"
    );
    setCoinType(gameData.currency);
    setBetAmount(gameData.buyin.toString());
    setBetOdds(gameData.odds.toString());
    setCurrentScreen("joining");
  };

  return (
    <div className="flex flex-col w-full px-[20px] bg-[#383838] mt-[30px]">
      <Table
        aria-label="Gamezone games table"
        removeWrapper
        classNames={{
          th: "bg-[#383838] border-y-[1px] border-[#fff] text-[#fff] font-face-roboto",
          base: "h-[800px] w-full overflow-scroll balance-scrollbar",
        }}
        isHeaderSticky
      >
        <TableHeader>
          <TableColumn>GAME</TableColumn>
          <TableColumn>PLAYER</TableColumn>
          <TableColumn>Buy-in</TableColumn>
          <TableColumn>Payout</TableColumn>
        </TableHeader>
        <TableBody
          items={tableData}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {tableData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex flex-row items-center gap-[7px] h-[70px]">
                  <img
                    src=""
                    alt="Game Icon"
                    className="w-[33px] h-[33px] bg-[#D9D9D9] border-[1px] border-[#DC2ABF] rounded-full"
                  />{" "}
                  <p className="text-[16px] font-bold text-[#fff]">
                    {item.game}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-center gap-[7px]">
                  <img
                    src={item.image}
                    alt="Game Icon"
                    className="w-[33px] h-[33px] bg-[#D9D9D9] rounded-full"
                  />{" "}
                  <p className="text-[16px] font-bold text-[#fff]">
                    {item.myUsername == item.player
                      ? "You"
                      : shortenWalletAddress(item.player)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-center gap-[6px]">
                  <p className="text-[16px] font-bold text-[#fff]">
                    {item.buyin}
                  </p>
                  <p className="text-[16px] font-bold text-[#fff]">
                    {item.currency}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-row items-center justify-between gap-[7px]">
                  <div className="flex flex-row items-center justify-center gap-[6px]">
                    <p className="text-[16px] font-bold text-[#fff]">
                      {item.payout}
                    </p>
                    <p className="text-[16px] font-bold text-[#fff]">
                      {item.currency}
                    </p>
                  </div>
                  {item.allowJoin && item.myUsername != item.player && (
                    <button
                      onClick={() =>
                        item.myId
                          ? joinGame(item.id, item.myId, item)
                          : toast.error("You must login first!")
                      }
                      className="flex items-center justify-center w-[110px] h-[40px] rounded-[8px] border-[#DC2ABF] border-[1px] bg-trasparent"
                    >
                      <p className="text-[18px] font-bold">JOIN</p>
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GameZoneGamesTable;
