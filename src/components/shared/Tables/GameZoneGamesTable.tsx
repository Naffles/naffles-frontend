"use client";

import { useUser } from "@blockchain/context/UserContext";
import useGame from "@components/utils/gamezone";
import { tokenValueConversion } from "@components/utils/tokenTypeConversion";
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
  creatorBuyin: string;
  challengerBuyin: string;
  payout: string;
  odds: string;
  currency: string;
  allowJoin: boolean;
  myId: string | null | undefined;
  myUsername: string | null | undefined;
}

interface gamezoneReturnArr {
  _id: string;
  gameType: string;
  creator: { profileImage: string; username: string; _id: string };
  challengerBuyInAmount: string;
  payout: string;
  betAmount: string;
  odds: string;
  coinType: string;
  status: string;
}

interface Props {
  search: string;
  gameType: string;
  odds: string;
  min: string;
  max: string;
}

const GameZoneGamesTable = (props: Props) => {
  const { user, socket } = useUser();
  const setCurrentScreen = useGame((state) => state.setScreen);
  const setGameType = useGame((state) => state.setType);
  const setCoinType = useGame((state) => state.setCoinType);
  const setCurrentCreatorBuyIn = useGame((state) => state.setCreatorBuyIn);
  const setCurrentChallengerBuyIn = useGame(
    (state) => state.setChallengerBuyIn
  );
  // const setBetOdds = useGame((state) => state.setBetOdds);
  const setGameId = useGame((state) => state.setGameId);
  const setChallengerId = useGame((state) => state.setChallengerId);
  const setCurrentPayout = useGame((state) => state.setPayout);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<tableRow[]>([]);

  const [attemptGameId, setAttemptGameId] = useState<string>("");
  const [allowAttempt, setAllowAttempt] = useState<boolean>(true);

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
    socket &&
      fetchTableData(
        user?.id,
        user?.name,
        props.search,
        props.gameType,
        props.odds,
        props.min,
        props.max
      );

    const gameCreated = (data: any) => {
      console.log("gameCreated data", data);
      if (data) {
        fetchTableData(
          user?.id,
          user?.name,
          props.search,
          props.gameType,
          props.odds,
          props.min,
          props.max
        );
      }
    };

    const joinRequestErrorHandler = (data: any) => {
      if (data) {
        toast.error(data);
      }
    };

    socket?.on("newGameCreated", gameCreated);
    socket?.on("errorJoinRequest", joinRequestErrorHandler);

    return () => {
      socket?.off("newGameCreated", gameCreated);
      socket?.off("errorJoinRequest", joinRequestErrorHandler);
    };
  }, [
    socket,
    user,
    props.search,
    props.gameType,
    props.odds,
    props.min,
    props.max,
  ]);

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
      setCurrentChallengerBuyIn(data.game.challengerBuyInAmount);
      setCurrentCreatorBuyIn(data.game.betAmount);
      setCurrentPayout(data.game.payout);
      setGameId(data.game._id);
      setChallengerId(data.challengerId);
    };

    socket?.on("gameJoinRequest", gameJoinRequest);

    const checkRoomOpen = (data: any) => {
      console.log("roomstatus data:", data);
      if (!data) {
        toast.dismiss();
        toast.error(
          "Sorry room is currently occupied, try requesting again later"
        );
        // setCurrentScreen("main");
      } else {
        setCurrentScreen("joining");
      }
    };

    socket?.on("roomStatus", checkRoomOpen);

    return () => {
      socket?.off("gameJoinRequest", gameJoinRequest);
      socket?.off("roomStatus", checkRoomOpen);
    };
  }, [socket]);

  const fetchTableData = async (
    userId: string | null | undefined,
    userName: string | null | undefined,
    search: string,
    gameType: string,
    odds: string,
    min: string,
    max: string
  ) => {
    try {
      let gameTypeText = "";
      if (gameType == "ALL GAMES") {
        gameTypeText = "all";
      } else if (gameType == "ROCK, PAPERS, SCISSORS") {
        gameTypeText = "rockPaperScissors";
      } else if (gameType == "COIN TOSS") {
        gameTypeText = "coinToss";
      }
      console.log(
        "table fetch URL:",
        `${process.env.NEXT_PUBLIC_ENDPOINT}game/${gameTypeText ? "?gameType=" + gameTypeText : ""}${odds ? "&odds=" + odds : ""}${min ? "&minBet=" + min : ""}${max ? "&maxBet=" + max : ""}`
      );
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ENDPOINT}game/${gameTypeText ? "?gameType=" + gameTypeText : ""}${odds ? "&odds=" + odds : ""}${min ? "&minBet=" + min : ""}${max ? "&maxBet=" + max : ""}`,
        {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
          },
        }
      );

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
      return address.slice(0, 5) + "..." + address.slice(-7, address.length);
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
        creatorBuyin: item.betAmount,
        challengerBuyin: item.challengerBuyInAmount,
        payout: item.payout,
        odds: item.odds,
        currency: item.coinType,
        allowJoin: item.status == "waiting" ? true : false,
        myId: userId,
        myUsername: userName,
      };
    });
    console.log("tableData: ", tableData);
    setTableData(tableData);
  };

  const joinGame = (gameId: string, gameData: tableRow) => {
    console.log("joined a game start");
    var currentDate = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + 10);

    setAttemptGameId(gameId);
    setAllowAttempt(true);

    socket?.emit("joinRequest", {
      gameId: gameId,
    });

    setGameType(
      gameData.game == "rockPaperScissors"
        ? "Rock, Paper, Scissors"
        : "Coin Toss"
    );

    setCoinType(gameData.currency);
    setCurrentChallengerBuyIn(gameData.challengerBuyin.toString());
    // setBetOdds(gameData.odds.toString());
    setCurrentPayout(gameData.payout.toString());
    setGameId(gameId);
  };

  const deleteGame = async (gameId: string, gameData: tableRow) => {
    console.log("delete game with id:", gameId);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ENDPOINT}game/${gameId}`,
        {
          method: "DELETE",
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user?.jwt,
            "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log(result);
        fetchTableData(
          user?.id,
          user?.name,
          props.search,
          props.gameType,
          props.odds,
          props.min,
          props.max
        );
      } else {
        console.error("Failed to create game: ", result.message);
      }
    } catch (error) {
      console.error("Error creating game: ", error);
    }
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
          {tableData.map((item) => {
            const onImageError = (e: any) => {
              e.target.src = "/static/no-image-account.png";
            };
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-row items-center gap-[11px] h-[70px]">
                    <div className="w-[33px] h-[33px] rounded-full overflow-hidden">
                      <img
                        src={
                          item.game == "rockPaperScissors"
                            ? "/static/rock-hand-magenta.png"
                            : "/static/naffles-jackpot-token.png"
                        }
                        alt="Game Icon"
                        className="w-full h-full object-cover"
                      />{" "}
                    </div>
                    <p
                      className={`text-[16px] font-bold ${item.myUsername == item.player ? "text-nafl-sponge-500" : "text-[#fff]"}`}
                    >
                      {item.game == "rockPaperScissors"
                        ? "ROCK, PAPER, SCISSORS"
                        : "COIN TOSS"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row items-center gap-[7px]">
                    <img
                      src={item.image ?? "/static/no-image-account.png"}
                      aria-placeholder=""
                      alt="Game Icon"
                      className="w-[33px] h-[33px] rounded-full"
                      onError={onImageError}
                    />{" "}
                    <p
                      className={`text-[16px] font-bold ${item.myUsername == item.player ? "text-nafl-sponge-500" : "text-[#fff]"}`}
                    >
                      {item.myUsername == item.player
                        ? "You"
                        : shortenWalletAddress(item.player)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row items-center gap-[6px]">
                    <p
                      className={`text-[16px] font-bold ${item.myUsername == item.player ? "text-nafl-sponge-500" : "text-[#fff]"}`}
                    >
                      {item.myUsername == item.player
                        ? item.currency &&
                          tokenValueConversion(item.creatorBuyin, item.currency)
                        : item.currency &&
                          tokenValueConversion(
                            item.challengerBuyin,
                            item.currency
                          )}
                    </p>
                    {item.currency != "points" ? (
                      <p
                        className={`text-[16px] font-bold uppercase ${item.myUsername == item.player ? "text-nafl-sponge-500" : "text-[#fff]"}`}
                      >
                        {item.currency}
                      </p>
                    ) : (
                      <img
                        src="/nafflings/three-group.png"
                        alt="Nafflings"
                        className="w-[60px] object-contain"
                      />
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-row items-center justify-between gap-[7px]">
                    <div className="flex flex-row items-center justify-center gap-[6px]">
                      <p
                        className={`text-[16px] font-bold ${item.myUsername == item.player ? "text-nafl-sponge-500" : "text-[#fff]"}`}
                      >
                        {item.currency &&
                          tokenValueConversion(item.payout, item.currency)}
                      </p>

                      {item.currency != "points" ? (
                        <p
                          className={`text-[16px] font-bold uppercase ${item.myUsername == item.player ? "text-nafl-sponge-500" : "text-[#fff]"}`}
                        >
                          {item.currency}
                        </p>
                      ) : (
                        <img
                          src="/nafflings/three-group.png"
                          alt="Nafflings"
                          className="w-[60px] object-contain"
                        />
                      )}
                    </div>
                    {item.allowJoin &&
                      (item.myUsername != item.player ? (
                        item.myId && (
                          <button
                            onClick={() => joinGame(item.id, item)}
                            className="flex items-center justify-center w-[110px] h-[40px] rounded-[8px] border-[#DC2ABF] border-[1px] bg-trasparent"
                          >
                            <p className="text-[18px] font-bold">JOIN</p>
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => deleteGame(item.id, item)}
                          className="flex items-center justify-center w-[110px] h-[40px] rounded-[8px] bg-[#ff3636] bg-trasparent"
                        >
                          <p className="text-[18px] font-bold text-nafl-white">
                            DELETE
                          </p>
                        </button>
                      ))}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default GameZoneGamesTable;
