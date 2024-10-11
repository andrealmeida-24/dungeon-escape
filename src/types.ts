export type MenuItem = {
  scene: string;
  text: string;
};

export type Menu = MenuItem[];

export enum EGameExitState {
  OPEN = "open",
  CLOSED = "closed",
}
