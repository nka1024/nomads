/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { Point } from "../../types/Position";
import { Input } from "phaser";

export class CameraDragModule {
  private prevPointerX: number;
  private prevPointerY: number;
  private distance: Number;

  private scene:Phaser.Scene;

  private dragStart: Point;

  private cursorKeys: Input.Keyboard.CursorKeys;
  private wasdKeys: Object;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.wasdKeys = scene.input.keyboard.addKeys('W,A,S,D');
  }


  // Public
  
  public update() {
    this.cameraDrag();
    this.cameraPan();
  }

  public get isDrag():boolean {
    return this.distance > 10;
  }
  

  // Private
  
  private cameraDrag() {
    let ptr = this.scene.input.activePointer;

    if (ptr.isDown) {
      if (!ptr.justDown) {
        this.scene.cameras.main.scrollX -= (ptr.x - this.prevPointerX)
        this.scene.cameras.main.scrollY -= (ptr.y - this.prevPointerY)
        this.distance = Phaser.Math.Distance.Between(this.dragStart.x, this.dragStart.y, ptr.x, ptr.y);
      } else {
        // this.distance = 0;
        this.dragStart = {x: ptr.x, y: ptr.y};
      }
      this.prevPointerX = ptr.x;
      this.prevPointerY = ptr.y
    }

    if (ptr.justUp) {
      this.prevPointerX = 0;
      this.prevPointerY = 0;
    } 

    if (!ptr.isDown && !ptr.justUp) {
      this.distance = 0;
    }
  }

  private cameraPan() {
    let speed = 8;
    if(this.cursorKeys.left.isDown || this.wasdKeys['A'].isDown) {
      this.scene.cameras.main.scrollX -= speed;
    }
    if(this.cursorKeys.right.isDown || this.wasdKeys['D'].isDown) {
      this.scene.cameras.main.scrollX += speed;
    }
    if(this.cursorKeys.up.isDown || this.wasdKeys['W'].isDown) {
      this.scene.cameras.main.scrollY -= speed;
    }
    if(this.cursorKeys.down.isDown || this.wasdKeys['S'].isDown) {
      this.scene.cameras.main.scrollY += speed;
    }
  }
}