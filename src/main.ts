import Phaser from "phaser";

import Game from "./scenes/GameScene";
import PreloadScene from "./scenes/PreloadScene";
import GameInterfaceScene from "./scenes/GameInterfaceScene";
import InitGameScene from "./scenes/InitGameScene";
import { SCREEN_CONFIG } from "./config";
import BaseScene from "./scenes/BaseScene";
import ControlsScene from "./scenes/ControlsScene";
import GameOverScene from "./scenes/GameOverScene";
import GameFinishedScene from "./scenes/GameFinishedScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    ...SCREEN_CONFIG,
  },
  transparent: true,
  dom: { createContainer: true },
  render: {
    pixelArt: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [
    PreloadScene,
    BaseScene,
    InitGameScene,
    ControlsScene,
    Game,
    GameInterfaceScene,
    GameFinishedScene,
    GameOverScene,
  ],
};

export default new Phaser.Game(config);
