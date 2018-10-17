/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { TileGrid } from "../TileGrid";
import { UnitData } from "../Hero";
import { SquadUnit } from "./SquadUnit";
import { Geom } from "phaser";
import { BaseUnit } from "./BaseUnit";

export class ReactorUnit extends SquadUnit {

  private static idleAnim: Phaser.Animations.Animation;
  private static initializedReactor: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf: UnitData) {
    super(scene, x, y, grid, conf);

    this.playUnitAnim('idle', true);

    // this.input.hitArea = new Geom.Rectangle(58, 58, 28, 28);
    // this.originY = 0.85
    // this.originX = 0.75
  }

  protected isInitialized(): boolean {
    return ReactorUnit.initializedReactor;
  }
  protected setInitialized(value: boolean) {
    ReactorUnit.initializedReactor = value;
  }

  protected initializeOnce() {
    var idleAnim = {
      key: 'reactor_idle',
      frames: this.scene.anims.generateFrameNumbers('reactor_anim_48x48', { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1,
      repeatDelay: 0
    };

    ReactorUnit.idleAnim = this.scene.anims.create(idleAnim);
  }

  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    this.anims.play('reactor_idle', ignoreIfPlaying);
  }

  protected targetScanUpdate() {
    if (this.state.isFighting && !this.state.isChasing) {
      // this.chase.start(this.state.fightTarget, this.conf.range, () => { });

    }
  }

  // Overrides


  update() {
    this.depth = this.y - 4;

    super.update();
    this.targetScanUpdate();

    this.flipX = false;
  }

  destroy() {
    super.destroy()
  }

  public aggressedBy(who: BaseUnit) {
    // this.chase.start(who, this.conf.range, () => { });
  }

}