export interface GameContainer {
  timeleft: number;
  result: string;
  isLocked: boolean;
  onChoice: (x?: any) => any;
  choices: string[];
  triggerUnlock?: () => any;
}
