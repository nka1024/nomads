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
import { Tile } from "../types/Position";
import { FloatingText } from "../FloatingText";

export class BuilderUnit extends SquadUnit {

  private static initializedBuilder: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf: UnitData) {

    super(scene, x, y, grid, conf);

    this.scoutee = new ScouteeModule(this.progress);
    this.core.addModules([this.scoutee, this.selection]);

    this.playUnitAnim('idle', true);
    this.combat.pacifist = true;
  }
  
  protected isInitialized():boolean {
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
        frames: this.scene.anims.generateFrameNumbers('builder_build_anim_48x48', { start: 5, end: 9 }),
        frameRate: 5,
        repeat: -1,
        repeatDelay: 0
      };

      this.scene.anims.create(buildAnim);

      this.on('animationcomplete', (anim: Animations.Animation, frame: Animations.AnimationFrame) => {
        if (anim.key == 'harvester_mine_start') {
          this.anims.play('harvester_mine', true);
        }
      });
    }


  // fight, walk, idle
  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    if (key == "build") {
      this.anims.play('builder_build_start', ignoreIfPlaying);
    } else if (key == "walk"){
      if (this.isBuilding) {
        this.stopBuild();
      }
      this.anims.play('builder_walk', ignoreIfPlaying);
    } else {
      if (!this.isBuilding) {
        this.anims.play('builder_idle', ignoreIfPlaying);
      }
    }
  }


  // Mining

  private buildTimer: any;
  private isBuilding: boolean;
  private buildProgress: number = 0;
  public startBuild() {
    if (!this.isBuilding){
      this.buildProgress = 0;
      this.isBuilding = true;
      this.playUnitAnim('build', true);

      this.buildTimer = setInterval(() => { this.performBuilding() }, 1000);
    }
  }

  private performBuilding() {
    let progress = Math.floor(Math.random() * 10) + 1;

    this.showFloatyText(progress);
    this.buildProgress += progress / 10;
    if(this.buildProgress >= 1) {

    } else {
        this.stopBuild();
    }
  }

  private stopBuild() {
    this.isBuilding = false;
    clearInterval(this.buildTimer);
    this.playUnitAnim('idle', true);
  }


  // Overrides

  update() {
    this.depth = this.y - 4;

    super.update();

    if (this.mover.speed.x > 0) this.flipX = false;
    if (this.mover.speed.x < 0) this.flipX = true;

    this.targetScanUpdate();
  }

  private showFloatyText(damage: number) {
    let floatyX = this.x + Math.random() * 10 - 5;
    let floatyY = this.y - Math.random() * 10 - 10;
    
    new FloatingText(this.scene, floatyX, floatyY, '+' + Math.floor(damage).toString(), 'yellow');
  }

  destroy() {
    this.combat = null;
    this.scoutee = null;
    this.progress = null;
    this.selection = null;
    super.destroy()
  }


  targetScanUpdate() {
   super.targetScanUpdate();
  }

  public aggressedBy(who: BaseUnit) {
    // this.chase.start(who, this.conf.range, () => { });
  }

}