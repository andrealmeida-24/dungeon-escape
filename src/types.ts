export type MenuItem = {
  scene: string;
  text: string;
};

export type Menu = MenuItem[];

export enum GameDifficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export enum EGameExitState {
  OPEN = "open",
  CLOSED = "closed",
}
