import Phaser from "phaser";
import { EDirection } from "./types";

export const generateRandomDirection = (exclude: EDirection) => {
  let newDirection = Phaser.Math.Between(0, 3);
  while (newDirection === exclude) {
    newDirection = Phaser.Math.Between(0, 3);
  }

  return newDirection;
};
