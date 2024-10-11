import Phaser from "phaser";
import { sceneEvents } from "../events/eventsHub";
import BaseScene from "./BaseScene";
import { EGameEvents } from "../events/types";

export default class GameInterfaceScene extends BaseScene {
  private hearts!: Phaser.GameObjects.Group;
  private _coinsLabel!: Phaser.GameObjects.Text;

  constructor() {
    super("GameInterfaceScene");
  }

  create() {
    this.createHearts();
    this.createCoins();
    this.handleUIEvents();
  }

  private createHearts(): void {
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

  private createCoins(): void {
    this.add.image(6, 26, "treasure", "coin_anim_f0.png");
    this._coinsLabel = this.add.text(12, 20, "0", {
      fontSize: "12px",
    });
  }

  private handleUIEvents(): void {
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

    sceneEvents.on(EGameEvents.PLAYER_DEAD, this.navigateToGameOverScene, this);

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

  private handlePlayerHealthChanged(health: number): void {
    this.hearts.children.each((heart, index) => {
      const heartImage = heart as Phaser.GameObjects.Image;
      if (index < health) {
        heartImage.setTexture("ui-heart-full");
      } else {
        heartImage.setTexture("ui-heart-empty");
      }
    });
  }

  private navigateToGameOverScene(): void {
    this.physics.pause();
    this.scene.start("GameOver");
  }
}
