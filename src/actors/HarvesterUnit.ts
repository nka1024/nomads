/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { IScoutable } from "./IScouteable";

import { TileGrid } from "../TileGrid";
import { ScouteeModule } from "../modules/unit/ScouteeModule";
import { ISelectable } from "./ISelectable";
import { BaseUnit } from "./BaseUnit";
import { UnitData } from "../Hero";
import { CONST } from "../const/const";
import { GameplayRootScene } from "../scenes/GameplayRootScene";
import { SquadUnit } from "./SquadUnit";
import { Animations } from "phaser";
import { FloatingText } from "../FloatingText";

export class HarvesterUnit extends SquadUnit {

  public scoutee: ScouteeModule;

  private static initializedGathger: boolean = false;
  private static idleAnimGather: Phaser.Animations.Animation;
  private static walkAnimGather: Phaser.Animations.Animation;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf: UnitData) {

    super(scene, x, y, grid, conf);

    this.scoutee = new ScouteeModule(this.progress);
    this.core.addModules([this.scoutee, this.selection]);

    this.onFightEnd = () => {
      // this.chase.restartIfHasTarget();
    };
    this.combat.events.on('fight_end', this.onFightEnd);

    this.playUnitAnim('idle', true);
    this.combat.pacifist = true;
  }
  
  protected isInitialized():boolean {
    return HarvesterUnit.initializedGathger;
  }
  protected setInitialized(value: boolean) {
    HarvesterUnit.initializedGathger = value;
  }

  protected initializeOnce() {
      var idleAnim = {
        key: 'harvester_idle',
        frames: this.scene.anims.generateFrameNumbers('gatherer_gather_anim_48x48', { start: 0, end: 0 }),
        frameRate: 5,
        repeat: -1,
        repeatDelay: 0
      };
      HarvesterUnit.idleAnimGather = this.scene.anims.create(idleAnim);
      
      var walkAnim = {
        key: 'harvester_walk',
        frames: this.scene.anims.generateFrameNumbers('gatherer_walk_anim_48x48', { start: 0, end: 4 }),
        frameRate: 5,
        repeat: -1,
        repeatDelay: 0
      };
      HarvesterUnit.walkAnimGather = this.scene.anims.create(walkAnim);

      var mineStartAnim = {
        key: 'harvester_mine_start',
        frames: this.scene.anims.generateFrameNumbers('gatherer_gather_anim_48x48', { start: 0, end: 4 }),
        frameRate: 5,
        repeat: 0,
        repeatDelay: 0
      };
      this.scene.anims.create(mineStartAnim);

      var mineAnim = {
        key: 'harvester_mine',
        frames: this.scene.anims.generateFrameNumbers('gatherer_gather_anim_48x48', { start: 5, end: 9 }),
        frameRate: 5,
        repeat: -1,
        repeatDelay: 0
      };

      this.scene.anims.create(mineAnim);

      this.on('animationcomplete', (anim: Animations.Animation, frame: Animations.AnimationFrame) => {
        if (anim.key == 'harvester_mine_start') {
          this.anims.play('harvester_mine', true);
        }
      });
    }


  // fight, walk, idle
  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    if (key == "mine") {
      this.anims.play('harvester_mine_start', ignoreIfPlaying);
    } else if (key == "walk"){
      if (this.isMining) {
        this.stopMine();
      }
      this.anims.play('harvester_walk', ignoreIfPlaying);
    } else {
      if (!this.isMining) {
        this.anims.play('harvester_idle', ignoreIfPlaying);
      }
    }
  }

  private mineTimer: any;
  private isMining: boolean;
  private startMine() {
    if (!this.isMining){
      this.isMining = true;
      this.playUnitAnim('mine', true);

      this.mineTimer = setInterval(() => { this.performMining() }, 1000);
    }
  }

  private performMining() {
    this.showFloatyText(Math.floor(Math.random() * 10) + 1);
  }

  private stopMine() {
    this.isMining = false;
    clearInterval(this.mineTimer);
  }

  update() {
    this.depth = this.y - 4;

    super.update();

    if (this.mover.speed.x > 0) this.flipX = false;
    if (this.mover.speed.x < 0) this.flipX = true;

    this.targetScanUpdate();
    if (this.tile.i == 10 && this.tile.j == 10 && !this.state.isMoving) {
      this.startMine();
    }
  }

  private showFloatyText(damage: number) {
    let floatyX = this.x + Math.random() * 10 - 5;
    let floatyY = this.y - Math.random() * 10 - 10;
    
    new FloatingText(this.scene, floatyX, floatyY, '+' + Math.floor(damage).toString(), false);
  }

  destroy() {
    if (this.combat) this.combat.events.removeListener('fight_end', this.onFightEnd);

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
    this.chase.start(who, () => { });
  }

}