/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { IUnit } from "../actors/IUnit"
import { IScoutable } from "./IScouteable";

import { TileGrid } from "../TileGrid";

import { UnitMoverModule } from "../modules/unit/UnitMoverModule";
import { ProgressModule } from "../modules/unit/ProgressModule";
import { ScouteeModule } from "../modules/unit/ScouteeModule";
import { UnitModuleCore } from "../modules/UnitModuleCore";
import { BaseUnit } from "./BaseUnit";
import { UnitData, Hero } from "../Hero";
import { CONST } from "../const/const";

export class HeroUnit extends BaseUnit implements IUnit, IScoutable {

  // gameobject can only be destroyed at the end of update()
  public toDestroy: boolean;

  public mover: UnitMoverModule;
  public progress: ProgressModule;
  public scoutee: ScouteeModule;
  public core: UnitModuleCore;
  
  private idleAnim: Phaser.Animations.Animation;
  private walkAnim: Phaser.Animations.Animation;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf: UnitData) {
    super(scene, x, y, CONST.HERO_SPEED, grid, conf, "mothership_48x48");

    this.scoutee = new ScouteeModule(this.progress);
    this.core.addModule(this.scoutee)

    this.shoot.spread = 2;

    var idleAnim = {
      key: 'player_idle',
      frames: scene.anims.generateFrameNumbers('mothership_48x48', { start: 0, end: 7 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0
    };
    
    this.idleAnim = scene.anims.create(idleAnim);
    var walkAnim = {
      key: 'player_walk',
      frames: scene.anims.generateFrameNumbers('mothership_48x48', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
      repeatDelay: 0
    };
    this.walkAnim = scene.anims.create(walkAnim);

    this.anims.setCurrentFrame(this.idleAnim.frames[4]);

    this.combat.events.on('damage_done', (damage) => {
      this.experience.addExperience(damage);
      
    });
    this.experience.events.on('level_up', (level) => {
      this.conf.attackBonus += Hero.expHeroAttack[level-1];
      this.conf.defenseBonus += Hero.expHeroDefense[level-1];
      this.conf.armor += Hero.expHeroArmor[level-1];
      this.conf.health = 1;
    })   
  }

  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    
  }

  update() {
    this.depth = this.y - 4;
    
    let frames = this.idleAnim.frames;
    let speed = this.mover.speed;

    if(speed.x > 0 && speed.y == 0) this.anims.setCurrentFrame(frames[3])
    if(speed.x > 0 && speed.y > 0) this.anims.setCurrentFrame(frames[2])
    if(speed.x > 0 && speed.y < 0) this.anims.setCurrentFrame(frames[4])
    if(speed.x < 0 && speed.y == 0) this.anims.setCurrentFrame(frames[7])
    if(speed.x < 0 && speed.y < 0) this.anims.setCurrentFrame(frames[6])
    if(speed.x < 0 && speed.y > 0) this.anims.setCurrentFrame(frames[0])
    if(speed.x == 0 && speed.y > 0) this.anims.setCurrentFrame(frames[1])
    if(speed.x == 0 && speed.y < 0) this.anims.setCurrentFrame(frames[5])
    super.update();
  }

  destroy() {
    super.destroy();
    this.core.destroy();
    this.core = null;
    this.mover = null;
    this.progress = null;
    this.scoutee = null;
    super.destroy()
  }

}