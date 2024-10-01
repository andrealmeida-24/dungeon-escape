import Phaser from "phaser";
import Chest from "../items/chest";
import { sceneEvents } from "../events/eventsHub";
import { EGameEvents } from "../events/types";
import { EEnemyType } from "../enemies/types";
import Potions from "../items/potions";
import {
  COINS_TO_INCREASE_AFTER_ENEMY_KILL,
  FAUNE_DAMAGE_TIME,
  FAUNE_SPEED,
  INITIAL_COINS_COUNT,
  INITIAL_HEALTH_COUNT,
  MINIMUM_COINS_TO_FINISH_GAME,
} from "../config";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      faune(
        x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Faune;
    }
  }
}

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD,
}

export default class Faune extends Phaser.Physics.Arcade.Sprite {
  private healthState: HealthState;
  private damageTime: number;
  private speed: number;
  private knives!: Phaser.Physics.Arcade.Group;
  private movePath: Phaser.Math.Vector2[] = [];
  private moveToTarget?: Phaser.Math.Vector2;
  private activePotion?: Potions;
  private _coins: number;
  private _health: number;
  private activeChest?: Chest;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.healthState = HealthState.IDLE;
    this.damageTime = FAUNE_DAMAGE_TIME;
    this._health = INITIAL_HEALTH_COUNT;
    this._coins = INITIAL_COINS_COUNT;
    this.speed = FAUNE_SPEED;
    this.anims.play("faune-idle-down");
  }

  moveAlong(path: Phaser.Math.Vector2[]) {
    if (!path || path.length <= 0) {
      return;
    }

    this.movePath = path;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.moveTo(this.movePath.shift()!);
  }

  moveTo(target: Phaser.Math.Vector2) {
    this.moveToTarget = target;
  }

  increaseCoinsForLizardKill(): void {
    this._coins += COINS_TO_INCREASE_AFTER_ENEMY_KILL;
    sceneEvents.emit(EGameEvents.PLAYER_INCREASE_COINS, this._coins);
  }

  setKnives(knives: Phaser.Physics.Arcade.Group): void {
    this.knives = knives;
  }

  setChest(chest: Chest): void {
    this.activeChest = chest;
  }

  setPotion(potion: Potions): void {
    this.activePotion = potion;
  }

  handleDamage(dir: Phaser.Math.Vector2, enemy: EEnemyType): void {
    if (this.healthState === HealthState.DAMAGE || this._health <= 0) {
      return;
    }

    enemy === EEnemyType.LIZARD ? --this._health : (this._health -= 2);

    if (this._health <= 0) {
      // game over
      this.healthState = HealthState.DEAD;
      this.anims.play("faune-faint");
      this.setVelocity(0, 0);
      sceneEvents.emit(EGameEvents.PLAYER_DEAD);
    } else {
      this.setVelocity(dir.x, dir.y);
      this.setTint(0xff0000);
      this.healthState = HealthState.DAMAGE;
      this.damageTime = 0;
    }
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    switch (this.healthState) {
      case HealthState.IDLE:
        break;
      case HealthState.DAMAGE:
        this.damageTime += delta;
        if (this.damageTime >= 100) {
          this.clearTint();
          this.healthState = HealthState.IDLE;
          this.damageTime = 0;
        }
        break;
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (
      this.healthState === HealthState.DAMAGE ||
      this.healthState === HealthState.DEAD ||
      !cursors
    ) {
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      if (this.activeChest) {
        const coins = this.activeChest.openChest();
        this._coins += coins;
        sceneEvents.emit(EGameEvents.PLAYER_INCREASE_COINS, this._coins);

        if (this._coins >= MINIMUM_COINS_TO_FINISH_GAME) {
          sceneEvents.emit(EGameEvents.READY_TO_EXIT);
        }
      } else if (this.activePotion) {
        if (this._health !== INITIAL_HEALTH_COUNT) {
          this._health += 1;
          this.activePotion.takePotion();
          sceneEvents.emit(EGameEvents.PLAYER_INCREASE_HEALTH, this.health);
        }
        this.activePotion = undefined;
      } else {
        this.throwKnife();
      }
      return;
    }

    this.handleFauneMovements(cursors);
  }

  get health(): number {
    return this._health;
  }

  private handleFauneMovements(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys
  ): void {
    // path finding logic
    let dx = 0;
    let dy = 0;

    if (this.moveToTarget) {
      dx = this.moveToTarget.x - this.x;
      dy = this.moveToTarget.y - this.y;

      if (Math.abs(dx) < 5) {
        dx = 0;
      }
      if (Math.abs(dy) < 5) {
        dy = 0;
      }

      if (dx === 0 && dy === 0) {
        if (this.movePath.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.moveTo(this.movePath.shift()!);
          return;
        }

        this.moveToTarget = undefined;
      }
    }

    const pathFindingLeftDown = dx < 0;
    const pathFindingRightDown = dx > 0;
    const pathFindingUpDown = dy < 0;
    const pathFindingDownDown = dy > 0;

    // cursors based logic
    const leftDown = cursors.left?.isDown;
    const rightDown = cursors.right?.isDown;
    const upDown = cursors.up?.isDown;
    const downDown = cursors.down?.isDown;

    if (leftDown || pathFindingLeftDown) {
      this.anims.play("faune-run-side", true);
      this.setVelocity(-this.speed, 0);

      this.scaleX = -1;
      this.body.offset.x = 24;
    } else if (rightDown || pathFindingRightDown) {
      this.anims.play("faune-run-side", true);
      this.setVelocity(this.speed, 0);

      this.scaleX = 1;
      this.body.offset.x = 8;
    } else if (upDown || pathFindingUpDown) {
      this.anims.play("faune-run-up", true);
      this.setVelocity(0, -this.speed);
    } else if (downDown || pathFindingDownDown) {
      this.anims.play("faune-run-down", true);
      this.setVelocity(0, this.speed);
    } else {
      const parts = this.anims.currentAnim.key.split("-");
      parts[1] = "idle";
      this.anims.play(parts.join("-"));
      this.setVelocity(0, 0);
    }

    if (leftDown || rightDown || upDown || downDown) {
      this.activeChest = undefined;
    }
  }

  private throwKnife(): void {
    if (!this.knives) {
      return;
    }

    const direction = this.anims.currentAnim.key.split("-")[2];
    const vector = new Phaser.Math.Vector2(0, 0);

    switch (direction) {
      case "up":
        vector.y = -1;
        break;
      case "down":
        vector.y = 1;
        break;
      default:
      case "side":
        if (this.scaleX < 0) {
          vector.x = -1;
        } else {
          vector.x = 1;
        }
        break;
    }

    const angle = vector.angle();
    const knife = this.knives.get(
      this.x,
      this.y,
      "weapon_knife"
    ) as Phaser.Physics.Arcade.Image;

    knife.setActive(true);
    knife.setVisible(true);

    knife.setRotation(angle);

    knife.x += vector.x * 16;
    knife.y += vector.y * 16;

    knife.setVelocity(vector.x * 300, vector.y * 300);
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "faune",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    const sprite = new Faune(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8);

    return sprite;
  }
);
