export interface BaseGameProps {
  results: string[];
  choices: string[];
  variants: string[] | number[];
  basePath: string;
  extension: string;
  barColor: string;
  triggerUnlock?: () => any;
  gameCall?: (choice?: string) => any;
  onCountdownStart?: () => any;
  onCountdownFinish?: () => any;
  onVideoFinish?: (hasSelected: boolean) => any;
  onChoiceClicked?: () => any;
  onWinNotify?: (result: string) => any;
  onGameReset?: () => any;
  isPaused?: boolean;
  resetToInitial?: boolean;
  hasError?: boolean;
  initialTime: number;
  gameType: string;
}

export interface GameContainerProps {
  handlePlayCount?: (hasSelected?: boolean) => any;
  isPaused?: boolean;
  resetToInitial?: boolean;
  onGameStart?: (choice?: string) => any;
  onGameReset?: () => any;
  onLimitReached: () => any;
  callGameResultModal: (result: string) => any;
}
