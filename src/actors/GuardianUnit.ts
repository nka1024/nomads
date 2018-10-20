/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { TileGrid } from "../TileGrid";
import { UnitData, Hero } from "../Hero";
import { SquadUnit } from "./SquadUnit";

export class GuardianUnit extends SquadUnit {

  private static idleAnim: Phaser.Animations.Animation;
  private static initializedGuardian: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf: UnitData) {
    super(scene, x, y, grid, conf);

    this.playUnitAnim('idle', true);

    
    this.combat.events.on('damage_done', (damage) => {
      this.experience.addExperience(damage);
      
    });
    this.experience.events.on('level_up', (level) => {
      this.conf.attackBonus += Hero.expGuardianAttack[level - 1];
      this.conf.defenseBonus += Hero.expGuardianDefense[level - 1];
      this.conf.armor += Hero.expGuardianArmor[level - 1];
      this.conf.health = 1;
    })   
  }

  protected isInitialized(): boolean {
    return GuardianUnit.initializedGuardian;
  }
  protected setInitialized(value: boolean) {
    GuardianUnit.initializedGuardian = value;
  }

  protected initializeOnce() {
    var idleAnim = {
      key: 'guardian_idle',
      frames: this.scene.anims.generateFrameNumbers('guardian_anim_48x48', { start: 0, end: 4 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0
    };

    GuardianUnit.idleAnim = this.scene.anims.create(idleAnim);
  }

  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    this.anims.play('guardian_idle', ignoreIfPlaying);
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