/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { TileGrid } from "../TileGrid";
import { BaseUnit } from "./BaseUnit";
import { UnitData, Hero } from "../Hero";
import { SquadUnit } from "./SquadUnit";
import { Animations, GameObjects } from "phaser";
import { FloatingText } from "../FloatingText";
import { SentryUnit } from "./SentryUnit";

export class BuilderUnit extends SquadUnit {

  private static initializedBuilder: boolean = false;

  private hero: Hero;
  private unitsGroup: GameObjects.Group;

  private repairTimer: Phaser.Time.TimerEvent;
  private buildTimer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, hero: Hero, x: number, y: number, grid: TileGrid, conf: UnitData, unitsGroup: GameObjects.Group) {
    super(scene, x, y, grid, conf);
    this.unitsGroup = unitsGroup;
    this.hero = hero;
    this.core.addModules([this.selection]);

    this.playUnitAnim('idle', true);
    this.combat.pacifist = true;

    this.repairTimer = this.scene.time.addEvent({
      delay: 1000,
      callback: this.performRepair,
      callbackScope: this,
      loop: true,
      paused: true
    });
    
    this.buildTimer = this.scene.time.addEvent({
      delay: 1000, 
      callback: this.performBuilding,
      callbackScope: this,
      loop: true,
      paused: true
    });

    this.on('animationcomplete', (anim: Animations.Animation, frame: Animations.AnimationFrame) => {
      if (anim.key == 'builder_build_start') {
        this.anims.play('builder_build', true);
      }
    });
    
    this.experience.events.on('level_up', (level) => {
      this.conf.repairBonus += Hero.expBuilderRepair[level-1];
      this.conf.defenseBonus += Hero.expBuilderDefense[level-1];
      this.conf.armor += Hero.expBuilderArmor[level-1];
      this.conf.health = 1;
    })   
  }

  public static deinit() {
    this.initializedBuilder = false;
  }

  protected isInitialized(): boolean {
    return BuilderUnit.initializedBuilder;
  }
  protected setInitialized(value: boolean) {
    BuilderUnit.initializedBuilder = value;
  }

  protected initializeOnce() {
    var idleAnim = {
      key: 'builder_idle',
      frames: this.scene.anims.generateFrameNumbers('builder_walk_anim_48x48', { start: 0, end: 0 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0
    };
    this.scene.anims.create(idleAnim);

    var walkAnim = {
      key: 'builder_walk',
      frames: this.scene.anims.generateFrameNumbers('builder_walk_anim_48x48', { start: 0, end: 4 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0
    };
    this.scene.anims.create(walkAnim);

    var startAnim = {
      key: 'builder_build_start',
      frames: this.scene.anims.generateFrameNumbers('builder_build_anim_48x48', { start: 0, end: 2 }),
      frameRate: 5,
      repeat: 0,
      repeatDelay: 0
    };
    this.scene.anims.create(startAnim);

    var buildAnim = {
      key: 'builder_build',
      frames: this.scene.anims.generateFrameNumbers('builder_build_anim_48x48', { start: 2, end: 6 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0
    };

    this.scene.anims.create(buildAnim);
  }

  // fight, walk, idle
  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    if (key == "build") {
      this.anims.play('builder_build_start', ignoreIfPlaying);
    } else if (key == "walk") {
      if (this.isBuilding) {
        this.stopBuild();
      }

      this.anims.play('builder_walk', ignoreIfPlaying);
    } else {
      if (!this.isBuilding && !this.isRepairing) {
        this.anims.play('builder_idle', ignoreIfPlaying);
      }
    }
  }

  // Repairs
  public startRepair(target: BaseUnit) {
    this.stopBuild();
    if (!this.isRepairing) {
      this.isRepairing = true;
      this.repairTarget = target;
    
      this.chase.start(target, 1, () => {
        this.repairTimer.paused = false;
      });
      let distance = this.grid.distance(this.tile, target.tile, 'abs');
      if (distance.i <= 1 && distance.j <= 1) {
        this.repairTimer.paused = false;
      }
    } else {
      if (this.repairTarget != target) {
        this.stopRepair();
        this.startRepair(target);
      }
    }
  }

  private stopRepair() {
    if (this.isRepairing) {
      this.chase.stop();
      this.isRepairing = false;
      this.repairTimer.paused = true;
      this.repairTarget = null;
      console.log('clear interval from stopRep: ' + this.repairTimer);
      this.playUnitAnim('idle', true);
    }
  }

  private repairTarget: BaseUnit;
  private isRepairing: boolean;
  private performRepair() {
    if (this.state.isMoving) {
      return
    }

    let rep = this.conf.repair + this.conf.repairBonus + Math.floor(Math.random()*3);

    if (this.hero.resources < rep) {
      return
    }

    if (this.anims.currentAnim.key != 'builder_build_start' && this.anims.currentAnim.key != 'builder_build') {
      this.playUnitAnim('build', true);
    }
    if (this.repairTarget) {
      let target = this.repairTarget;
      if (target.conf.health < 1) {
  
        this.hero.resources -= rep
        this.showFloatyText('+' + rep, 'green', true);
        target.conf.health += (rep) / target.conf.armor;
        this.onRepair(rep);
        if (target.conf.health > 1) {
          target.conf.health = 1;
          this.stopRepair();
        }
      } else {
        this.stopRepair();
      }
    } else {
      this.stopRepair();
    }
  }

  private onRepair(amount: number) {
    this.experience.addExperience(amount);
  }

  // Building

  private isBuilding: boolean;
  private buildProgress: number = 0;
  public startBuild() {
    this.stopRepair();
    if (!this.isBuilding) {
      this.buildProgress = 0;
      this.isBuilding = true;
      this.playUnitAnim('build', true);

      this.progress.show();
      this.buildTimer.paused = false;
    }
  }

  private performBuilding() {
    let rep = 2
    if (this.hero.resources < rep) 
      this.stopBuild();

    let progress = Math.floor(Math.random() * 10) + 1;

    this.showFloatyText('.', 'green');
    this.buildProgress += progress / 100;
    this.progress.progress = this.buildProgress;
    this.hero.resources -= rep
    if (this.buildProgress < 1) {

    } else {
      let conf = Hero.makeSentryConf()
      let from = this.grid.gridToWorld(this.tile);
      let squad = new SentryUnit(this.scene, from.x + 16, from.y + 16, this.grid, conf);
      this.scene.add.existing(squad);
      this.unitsGroup.add(squad);
      this.stopBuild();

      let tile1 = this.tile;
      let tile2 = this.grid.findClosestFreeTile(this.tile, this.tile);
      this.mover.placeToTile(tile2);
      squad.mover.placeToTile(tile1);
    }
  }

  private stopBuild() {
    if (this.isBuilding) {
      this.progress.hide();
      this.isBuilding = false;
      this.buildTimer.paused = true;
      this.playUnitAnim('idle', true);
    }
  }


  // Overrides

  update() {
    this.depth = this.y - 4;

    super.update();

    if (this.isRepairing && this.repairTarget) {
      this.flipX = this.repairTarget.tile.j < this.tile.j;
    } else {
      if (this.mover.speed.x > 0) this.flipX = false;
      if (this.mover.speed.x < 0) this.flipX = true;
    }

    if (this.repairTarget && this.state.isMoving && !this.state.isChasing) {
      this.stopRepair();
    }
  }

  private showFloatyText(text: string, color: string, repair: boolean = false) {
    let x = repair ? this.repairTarget.x : this.x;
    let y = repair ? this.repairTarget.y : this.y; 
    let floatyX = x + Math.random() * 10 - 5;
    let floatyY = y - Math.random() * 10 - 10;

    new FloatingText(this.scene, floatyX, floatyY, text, color);
  }

  destroy() {
    this.stopRepair();
    this.stopBuild();
    if (this.buildTimer) this.buildTimer.destroy()
    if (this.repairTimer) this.repairTimer.destroy();
    this.buildTimer = null;
    this.repairTimer = null;
    this.chase.stop();
    this.combat = null;
    this.progress = null;
    this.selection = null;
    super.destroy()
  }

  public aggressedBy(who: BaseUnit) {
    // this.chase.start(who, this.conf.range, () => { });
  }

}