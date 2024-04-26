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
}

export interface GameContainerProps {
  handlePlayCount?: (hasSelected?: boolean) => any;
}
