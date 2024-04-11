export interface GameContainer {
  timeleft: number;
  winningChoice: string;
  isLocked: boolean;
  onChoice: (x?: any) => any;
}
