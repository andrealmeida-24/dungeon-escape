import Phaser from "phaser";
import { EDirection } from "./types";
import { generateRandomDirection } from "./helpers";
import { DELAY_UNTIL_ENEMY_CHANGE_DIRECTION, LIZARD_SPEED } from "../config";

export default class Lizard extends Phaser.Physics.Arcade.Sprite {
  private direction = EDirection.RIGHT;
  private moveEvent: Phaser.Time.TimerEvent;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.anims.play("lizard-idle");

    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollision,
      this
    );

    this.moveEvent = scene.time.addEvent({
      delay: DELAY_UNTIL_ENEMY_CHANGE_DIRECTION,
      callback: () => {
        this.direction = generateRandomDirection(this.direction);
      },
      loop: true,
    });
  }

  destroy(fromScene?: boolean) {
    this.moveEvent.destroy();

    super.destroy(fromScene);
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);

    const speed = LIZARD_SPEED;

    this.body.offset.y = 5;

    switch (this.direction) {
      case EDirection.UP:
        this.setVelocity(0, -speed);
        break;

      case EDirection.DOWN:
        this.setVelocity(0, speed);
        break;

      case EDirection.LEFT:
        this.setVelocity(-speed, 0);
        break;

      case EDirection.RIGHT:
        this.setVelocity(speed, 0);
        break;
    }
  }

  private handleTileCollision(
    go: Phaser.GameObjects.GameObject,
    tile: Phaser.Tilemaps.Tile
  ) {
    if (go !== this) {
      return;
    }

    this.direction = generateRandomDirection(this.direction);
  }
}
