"use client";

const GameZonePreview = ({
  type,
  userAction,
  enemyAction,
}: {
  type: string | null;
  userAction: string | null;
  enemyAction: string | null;
}) => {
  return (
    <>
      <div className="flex flex-row items-center justify-center h-[200px] w-full">
        {type == "Rock, Paper, Scissors" ? (
          <div className="flex flex-row items-center w-full justify-between px-[40px] h-full">
            <img
              src="/static/rock-hand-cyan.png"
              alt="Rock Hand"
              className="w-[100px] object-contain"
            />
            <img
              src="/static/rock-hand-magenta.png"
              alt="Rock Hand"
              className="w-[100px] object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-row items-center w-full justify-center h-full">
            <img
              src="/static/coin-toss-tail.png"
              alt="Coin Tail"
              className="w-[211px] object-contain"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default GameZonePreview;
