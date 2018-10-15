/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { TileGrid } from "../TileGrid";
import { ISelectable } from "./ISelectable";
import { BaseUnit } from "./BaseUnit";
import { UnitData } from "../Hero";
import { CONST } from "../const/const";
import { GameplayRootScene } from "../scenes/GameplayRootScene";

export class SquadUnit extends BaseUnit implements ISelectable {

  private squadType: number = 1;

  private static initialized: boolean = false;

  protected onFightEnd: () => void;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf: UnitData) {

    super(scene, x, y, CONST.SQUAD_SPEED, grid, conf, 'infantry_1_idle_48x48');

    this.squadType = this.side == "attack" ? 2 : 1;
    this.core.addModules([this.selection]);

    this.onFightEnd = () => {
      // this.chase.restartIfHasTarget();
    };
    this.combat.events.on('fight_end', this.onFightEnd);
    
    if(!this.isInitialized()) {
      this.setInitialized(true);
      this.initializeOnce();
    }

    this.playUnitAnim('idle', true);
  }

  protected isInitialized():boolean {
    return SquadUnit.initialized;
  }
  protected setInitialized(value: boolean) {
    SquadUnit.initialized = value;
  }

  protected initializeOnce() {
    var idleAnim = {
      key: 'squad_idle',
      frames: this.scene.anims.generateFrameNumbers('gatherer_gather_anim_48x48', { start: 0, end: 0 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0
    };
    this.scene.anims.create(idleAnim);
    
    var walkAnim = {
      key: 'squad_walk',
      frames: this.scene.anims.generateFrameNumbers('gatherer_walk_anim_48x48', { start: 0, end: 4 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0
    };
    this.scene.anims.create(walkAnim);
  }

  // fight, walk, idle
  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    // let anim = "";
    // if (key == 'fight' && this.conf.type == "archers") {
    //   anim = "archers_fight";
    // } else {
    //   anim = 'unit_' + this.squadType + '_' + key;
    // }

    this.anims.play(key == 'walk' ? 'squad_walk' : 'squad_idle', ignoreIfPlaying);
  }

  update() {
    this.depth = this.y - 4;

    super.update();

    if (this.mover.speed.x > 0) this.flipX = false;
    if (this.mover.speed.x < 0) this.flipX = true;
  
    this.targetScanUpdate();
  }

  destroy() {
    if (this.combat) this.combat.events.removeListener('fight_end', this.onFightEnd);

    this.combat = null;
    this.progress = null;
    this.selection = null;
    super.destroy()
  }


  protected targetScanUpdate() {
    if (!this.state.isChasing && this.side == 'attack') {
      let player = (this.scene as GameplayRootScene).player;
      let distToPlayer = this.grid.distanceXY(player, this, 'abs');
      if (distToPlayer.i <= 2 && distToPlayer.j <= 2) {
        this.chase.start(player, this.conf.range, () => { });
      }
    }
  }


  public aggressedBy(who: BaseUnit) {
    this.chase.start(who, this.conf.range, () => { });
  }

}