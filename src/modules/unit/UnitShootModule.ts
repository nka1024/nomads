/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { BaseUnit } from "../../actors/BaseUnit";
import { Scene, GameObjects } from "phaser";
import { IUnitModule } from "../interface/IUnitModule";
import { UnitStateModule } from "./UnitStateModule";
import { UI_DEPTH } from "../../const/const";
import { Point } from "../../types/Position";

export class UnitShootModule implements IUnitModule {

  private owner: BaseUnit;
  private scene: Scene;
  private state: UnitStateModule;
  
  
  private baseDistance: number = 5;
  private tmpSpeed: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
  private bullets: { object: GameObjects.Image, speed: Point, dest: Point, travel: number }[] = [];
  private shootTimer: any;
  private isShooting: boolean;

  constructor(owner: BaseUnit, scene: Scene, state: UnitStateModule) {
    this.owner = owner;
    this.scene = scene;
    this.state = state;
  }

  // private

  private makeBullet() {
    if (!this.state.isFighting) {
      this.stopShooting();
      return;
    }
    let key = this.owner.side == 'attack' ? 'bullet_yellow' : 'bullet_blue';
    let bullet = new GameObjects.Image(this.scene, 0, 0, key);
    bullet.x = this.owner.x;
    bullet.y = this.owner.y;
    bullet.depth = UI_DEPTH.BULLETS;
    this.scene.add.existing(bullet);

    let a = this.owner;
    let b = this.state.fightTarget;
    var angle = Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI);
    bullet.angle = angle;

    let dest = { x: this.state.fightTarget.x, y: this.state.fightTarget.y };
    let speed = this.calculateSpeed(bullet, dest, this.baseDistance);
    this.bullets.push({ object: bullet, speed: speed, dest: dest, travel: 1 });
  }


  private synchronizeShooting() {
    if (this.state.isFighting && !this.isShooting) {
      this.startShooting();
    } else if (!this.state.isFighting && this.isShooting) {
      this.stopShooting();
    }
  }

  private startShooting() {
    this.isShooting = true;
    this.shootTimer = setInterval(() => { this.makeBullet() }, 300);
  }

  private stopShooting() {
    this.isShooting = false;
    clearInterval(this.shootTimer);
  }

  private stepTowards(bullet: GameObjects.Image, speed: Point, dest: Point, travel: number): boolean {
    this.tmpSpeed.x = dest.x - bullet.x;
    this.tmpSpeed.y = dest.y - bullet.y;
    if (this.tmpSpeed.length() <= this.baseDistance) {
      bullet.x = dest.x;
      bullet.y = dest.y;
      return true;
    }
    bullet.x += speed.x * travel;
    bullet.y += speed.y * travel;
    return false;
  }


  private calculateSpeed(bullet: GameObjects.Image, dest: Point, distance: number): Point {
    this.tmpSpeed.x = dest.x - bullet.x;
    this.tmpSpeed.y = dest.y - bullet.y;
    if (this.tmpSpeed.length() <= distance) {
      bullet.x = dest.x;
      bullet.y = dest.y;
      return { x: 0, y: 0 };
    }
    this.tmpSpeed = this.normalize(this.tmpSpeed, distance);
    return { x: this.tmpSpeed.x, y: this.tmpSpeed.y };
  }


  private normalize(vec: Phaser.Math.Vector2, newLen: number): Phaser.Math.Vector2 {
    var len = vec.x * vec.x + vec.y * vec.y;
    if (len > 0) {
      len = newLen / Math.sqrt(len);
      vec.x = vec.x * len;
      vec.y = vec.y * len;
    }
    return vec;
  }


  // overrides

  update() {
    this.synchronizeShooting();

    for (let bullet of this.bullets) {
      if (bullet.object.active) {
        if (this.stepTowards(bullet.object, bullet.speed, bullet.dest, bullet.travel)) {
          bullet.object.destroy();
          bullet.travel += 10;
        }
      }
    }
    this.bullets = this.bullets.filter((o, idx, arr) => {return o.object.active});
  }

  destroy() {
  }
}