import Phaser from "phaser";
import { sceneEvents } from "../events/eventsHub";
import BaseScene from "./BaseScene";
import { EGameEvents } from "../events/types";
import { CHESTS_TO_FINISH_GAME, INITIAL_CHESTS_OPENED } from "../config";

export default class GameInterfaceScene extends BaseScene {
  private hearts!: Phaser.GameObjects.Group;
  private gameOverImage!: Phaser.GameObjects.Image;
  private _coinsLabel!: Phaser.GameObjects.Text;
  private chestsOpened = INITIAL_CHESTS_OPENED;

  constructor() {
    super("GameInterfaceScene");
  }

  create() {
    this.createHearts();
    this.createCoins();
    this.handleUIEvents();
  }

  private createHearts() {
    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    });

    this.hearts.createMultiple({
      key: "ui-heart-full",
      setXY: {
        x: 10,
        y: 10,
        stepX: 16,
      },
      quantity: 3,
    });
  }

  private createCoins() {
    this.add.image(6, 26, "treasure", "coin_anim_f0.png");
    this._coinsLabel = this.add.text(12, 20, "0", {
      fontSize: "12px",
    });
  }

  private handleUIEvents() {
    sceneEvents.on(
      EGameEvents.PLAYER_LIZARD_COLLISION,
      this.handlePlayerHealthChanged,
      this
    );

    sceneEvents.on(
      EGameEvents.PLAYER_WIZARD_COLLISION,
      this.handlePlayerHealthChanged,
      this
    );

    sceneEvents.on(EGameEvents.PLAYER_DEAD, this.createGameOverText, this);

    sceneEvents.on(
      EGameEvents.CHEST_OPENED,
      this.handleOpenedChestsCount,
      this
    );

    sceneEvents.on(
      EGameEvents.PLAYER_INCREASE_COINS,
      (coins: number) => {
        this._coinsLabel.text = coins.toLocaleString();
      },
      this
    );

    sceneEvents.on(
      EGameEvents.PLAYER_INCREASE_HEALTH,
      this.handlePlayerHealthChanged,
      this
    );

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(EGameEvents.PLAYER_INCREASE_COINS);
      sceneEvents.off(EGameEvents.PLAYER_DEAD);
      sceneEvents.off(
        EGameEvents.PLAYER_LIZARD_COLLISION,
        this.handlePlayerHealthChanged,
        this
      );
      sceneEvents.off(
        EGameEvents.PLAYER_WIZARD_COLLISION,
        this.handlePlayerHealthChanged,
        this
      );

      sceneEvents.off(
        EGameEvents.PLAYER_INCREASE_HEALTH,
        this.handlePlayerHealthChanged,
        this
      );
    });
  }

  private handlePlayerHealthChanged(health: number) {
    this.hearts.children.each((heart, index) => {
      const heartImage = heart as Phaser.GameObjects.Image;
      if (index < health) {
        heartImage.setTexture("ui-heart-full");
      } else {
        heartImage.setTexture("ui-heart-empty");
      }
    });
  }

  private handleOpenedChestsCount() {
    if (this.chestsOpened === CHESTS_TO_FINISH_GAME) {
      console.log("Game Over");
      return;
    }
    this.chestsOpened += 1;
  }

  private createGameOverText() {
    this.gameOverImage = this.add.image(
      this.screenCenter[0],
      this.screenCenter[1],
      "gameOverImage"
    );

    const scaleX = this.cameras.main.width / this.gameOverImage.width;
    const scaleY = this.cameras.main.height / this.gameOverImage.height;
    const scale = Math.max(scaleX, scaleY);
    this.gameOverImage.setScale(scale).setScrollFactor(0);

    super.handleNavigateToMenu();
  }
}
