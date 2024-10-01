import { Menu } from "./types";

export const SCREEN_CONFIG = {
  width: 400,
  height: 250,
};

export const GAME_MENU: Menu = [
  { scene: "GameScene", text: "Play Game" },
  { scene: "ControlsScene", text: "Controls" },
];

export const LIZARD_SPEED = 50;
export const WIZARD_SPEED = 75;
export const FAUNE_SPEED = 100;

export const DELAY_UNTIL_ENEMY_CHANGE_DIRECTION = 2000;
export const DELAY_UNTIL_WIZARDS_CHANGE_DIRECTION = 1000;

export const INITIAL_COINS_COUNT = 0;
export const INITIAL_HEALTH_COUNT = 3;

export const FAUNE_DAMAGE_TIME = 0;

export const COINS_TO_INCREASE_AFTER_ENEMY_KILL = 10;

export const MINIMUM_COINS_TO_FINISH_GAME = 350;

export const Z_INDEXES = {
  faune: 1,
  pillars: 2,
};
