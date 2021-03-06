/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { TileGrid } from "../../TileGrid";
import { UI_DEPTH } from "../../const/const";

export class SceneCursorModule {

  public cursor: Phaser.GameObjects.Sprite;
  public onClick: (cursor: Phaser.GameObjects.Sprite) => void;

  private scene: Phaser.Scene;
  private grid: TileGrid;

  constructor(scene: Phaser.Scene, grid: TileGrid) {
    this.scene = scene;
    this.grid = grid;

    this.cursor = this.scene.add.sprite(0, 0, "cursor_grid_2x_32x32");
    this.cursor.depth = UI_DEPTH.CURSOR;
    this.cursor.originX = 1;
    this.cursor.originY = 1;
    this.cursor.disableInteractive();
  }

  public update() {
    if (!this.scene) {
      return;
    }
    this.cursorFollow();
    this.cursorTouchHandler();
  }

  private clickedThisTime: boolean = true;
  private cursorTouchHandler() {
    if (!this.scene.input.activePointer.isDown) {
      if (!this.scene.input.activePointer.justUp) {
        if (!this.clickedThisTime) {
          this.clickedThisTime = true;
          if (this.onClick != null) {
            this.onClick(this.cursor);
          }
        }
      }
    } else {
      this.clickedThisTime = false;
    }
  }

  private cursorFollow() {
    let ptrX = Math.round(this.scene.input.activePointer.x / 2) * 2;
    let ptrY = Math.round(this.scene.input.activePointer.y / 2) * 2;
    let worldPtr = this.scene.cameras.main.getWorldPoint(ptrX, ptrY)

    
    let snap = this.grid.snapToGrid(worldPtr);
    this.cursor.x = snap.x + 16;
    this.cursor.y = snap.y + 16;
    this.cursor.scaleX = 1;
    this.cursor.scaleY = 1;


    this.cursor.visible = this.grid.isWalkable(this.grid.worldToGrid(snap));
  }

  public destroy() {
    this.scene = null;
    this.cursor = null;
    this.grid = null;
    this.onClick = null;
  }
}