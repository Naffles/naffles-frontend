import { Button } from "@components/shared/Button";
import { GameContainer } from "@type/GameSection";

export const RockPaperScissors = (props: GameContainer) => {
  const { timeleft } = props;
  return (
    <div className="flex-row flex">
      <div className="flex-col flex gap-4 -mr-4 z-10 pt-4 w-[155px]">
        <Button size="base" variant={"primary"} label="Explore" width="span">
          Rock
        </Button>
        <Button size="base" variant={"primary"} label="Explore" width="span">
          Paper
        </Button>
        <Button size="base" variant={"primary"} label="Explore" width="span">
          Scissors
        </Button>
      </div>
      <div className="flex-col flex bg-nafl-grey-700 w-[500px] rounded-3xl overflow-hidden">
        <div className="h-[188px]"></div>
        <div className="bg-[#DC2ABF] h-50 pb-1 px-4 flex-row flex justify-between">
          <div className="text-md leading-tight">
            Starting in
            <br />
            <div className="text-xl leading-tight">{timeleft} sec</div>
          </div>
          <div className="flex items-center text-lg">PLAY & EARN</div>
        </div>
      </div>
    </div>
  );
};
