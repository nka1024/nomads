/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { TileGrid } from "../TileGrid";
import { ScouteeModule } from "../modules/unit/ScouteeModule";
import { BaseUnit } from "./BaseUnit";
import { UnitData } from "../Hero";
import { GameplayRootScene } from "../scenes/GameplayRootScene";
import { SquadUnit } from "./SquadUnit";
import { Animations } from "phaser";
import { FloatingText } from "../FloatingText";
import { Tile } from "../types/Position";

export class SentryUnit extends SquadUnit {

  private static idleAnim: Phaser.Animations.Animation;
  private static initializedSentry: boolean = false;

  private spinTimer: any;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf: UnitData) {

    super(scene, x, y, grid, conf);

    this.playUnitAnim('idle', true);
    this.combat.pacifist = true;
    this.spinTimer = setInterval(() => { this.spinTower() }, 1000);
  }

  private spinTower() {
    if (!this.state.isFighting) {
      let idx = this.anims.currentFrame.index;
      if (idx == 8) idx = 0;
      this.anims.setCurrentFrame(SentryUnit.idleAnim.frames[idx]);
    }
  }

  protected isInitialized(): boolean {
    return SentryUnit.initializedSentry;
  }
  protected setInitialized(value: boolean) {
    SentryUnit.initializedSentry = value;
  }

  protected initializeOnce() {
    var idleAnim = {
      key: 'sentry_idle',
      frames: this.scene.anims.generateFrameNumbers('sentry_idle_anim_48x48', { start: 0, end: 7 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0
    };

    SentryUnit.idleAnim = this.scene.anims.create(idleAnim);
  }


  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {

  }


  // Overrides


  update() {
    this.depth = this.y - 4;

    super.update();

    this.flipX = false;

    if (this.state.isMoving) {
      let frames = SentryUnit.idleAnim.frames;
      let speed = this.mover.speed;

      if (speed.x > 0 && speed.y == 0) this.anims.setCurrentFrame(frames[2])
      if (speed.x > 0 && speed.y > 0) this.anims.setCurrentFrame(frames[1])
      if (speed.x > 0 && speed.y < 0) this.anims.setCurrentFrame(frames[3])
      if (speed.x < 0 && speed.y == 0) this.anims.setCurrentFrame(frames[6])
      if (speed.x < 0 && speed.y < 0) this.anims.setCurrentFrame(frames[5])
      if (speed.x < 0 && speed.y > 0) this.anims.setCurrentFrame(frames[7])
      if (speed.x == 0 && speed.y > 0) this.anims.setCurrentFrame(frames[0])
      if (speed.x == 0 && speed.y < 0) this.anims.setCurrentFrame(frames[4])
    }
  }


  destroy() {
    clearInterval(this.spinTimer);
    super.destroy()
  }


  public aggressedBy(who: BaseUnit) {
    // this.chase.start(who, this.conf.range, () => { });
  }

}