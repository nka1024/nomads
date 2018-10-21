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
import { StoryModule } from "../modules/scene/StoryModule";

export class TowerUnit extends SquadUnit {

  private static idleAnim: Phaser.Animations.Animation;
  private static initializedTower: boolean = false;

  private story: StoryModule;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf: UnitData, story: StoryModule) {
    super(scene, x, y, grid, conf);

    this.story = story;
    this.playUnitAnim('idle', true);

    this.input.hitArea = new Geom.Rectangle(58, 58, 28, 28);
    this.originY = 0.85
    this.originX = 0.75
  }

  public static deinit() {
    this.initializedTower = false;
    if(this.idleAnim) this.idleAnim.destroy();
    this.idleAnim = null;
  }

  protected isInitialized(): boolean {
    return TowerUnit.initializedTower;
  }
  protected setInitialized(value: boolean) {
    TowerUnit.initializedTower = value;
  }

  protected initializeOnce() {
    var idleAnim = {
      key: 'tower_idle',
      frames: this.scene.anims.generateFrameNumbers('tower_anim_90x90', { start: 0, end: 4 }),
      frameRate: 2,
      repeat: -1,
      repeatDelay: 0
    };

    TowerUnit.idleAnim = this.scene.anims.create(idleAnim);
  }

  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    this.anims.play('tower_idle', ignoreIfPlaying);
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

  death() {
    this.story.startArc(this.story.towerDeathArc);

  }
  public aggressedBy(who: BaseUnit) {
    // this.chase.start(who, this.conf.range, () => { });
  }

}