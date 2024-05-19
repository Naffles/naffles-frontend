export interface BaseGameProps {
  results: string[];
  choices: string[];
  variants: string[] | number[];
  basePath: string;
  extension: string;
  barColor: string;
  triggerUnlock?: () => any;
  gameCall?: () => any;
  onCountdownFinish?: () => any;
  onVideoFinish?: (hasSelected: boolean) => any;
  onChoiceClicked?: () => any;
  onWinNotify?: () => any;
  onGameReset?: () => any;
  isPaused?: boolean;
  hasError?: boolean;
  initialTime: number;
  gameType: string;
}

export interface GameContainerProps {
  handlePlayCount?: (hasSelected?: boolean) => any;
  isPaused?: boolean;
  onGameStart?: () => any;
  onGameReset?: () => any;
  onLimitReached: () => any;
}
