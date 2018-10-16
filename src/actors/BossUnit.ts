/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { TileGrid } from "../TileGrid";
import { UnitData } from "../Hero";
import { SquadUnit } from "./SquadUnit";

export class BossUnit extends SquadUnit {

  private static idleAnim: Phaser.Animations.Animation;
  private static initializedBoss: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf: UnitData) {
    super(scene, x, y, grid, conf);

    this.playUnitAnim('idle', true);
this.originX = 0.5;
this.originY = 0.5;
  }

  protected isInitialized(): boolean {
    return BossUnit.initializedBoss;
  }
  protected setInitialized(value: boolean) {
    BossUnit.initializedBoss = value;
  }

  protected initializeOnce() {
    var idleAnim = {
      key: 'boss_idle',
      frames: this.scene.anims.generateFrameNumbers('boss_anim_100x100', { start: 0, end: 6 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0
    };

    BossUnit.idleAnim = this.scene.anims.create(idleAnim);
  }

  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    this.anims.play('boss_idle', ignoreIfPlaying);
  }

  protected targetScanUpdate() {
    if (this.state.isFighting && !this.state.isChasing) {
      this.chase.start(this.state.fightTarget, this.conf.range, () => { });
    }
  }

  // Overrides


  update() {
    this.depth = this.y - 4;

    super.update();
    this.targetScanUpdate();

    this.flipX = this.mover.speed.x < 0;
  }

  destroy() {
    super.destroy()
  }

  // public aggressedBy(who: BaseUnit) {
  // this.chase.start(who, this.conf.range, () => { });
  // }

}