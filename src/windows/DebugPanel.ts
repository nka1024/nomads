/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";
import { Hero } from "../Hero";
import { Scene } from "phaser";
import { TileGrid } from "../TileGrid";
import { SceneCursorModule } from "../modules/scene/SceneCursorModule";

export class DebugPanel extends BaseWindow {
  // static
  static innerHtml: string;

  // public
  public titleText: HTMLElement;
  public volumeText: HTMLElement;


  private scene: Scene;
  private grid: TileGrid;
  private cursor: SceneCursorModule;

  constructor(scene: Scene, grid: TileGrid, cursor: SceneCursorModule) {
    super();

    this.cursor = cursor;
    this.scene = scene;
    this.grid = grid;
    this.titleText = this.element.querySelector(".text_title");
    this.volumeText = this.element.querySelector(".text_volume");
    
    this.startDataSyncLoop();
  }

  private dataSyncIntervalHandler: any;
  private startDataSyncLoop() {
    this.dataSyncIntervalHandler = setInterval(() => {
      this.dataSync()
    }, 100);
  }

  private stopDataSyncLoop() {
    clearInterval(this.dataSyncIntervalHandler);
  }

  private dataSync() {
    this.titleText.innerHTML = (Math.round(this.scene.game.loop.actualFps * 10)/10).toString();
    
    
    let tile = this.grid.worldToGrid(this.cursor.cursor);
    this.volumeText.innerHTML = tile.j + ' : ' + tile.i;
  }


  // Window HTML properties
  protected getWindowName(): string { return "debug_panel" }
  protected getInnerHTML(): string { return DebugPanel.innerHtml }
  static initialize() {
    DebugPanel.innerHtml = BaseWindow.getPrefab(".debug_panel_prefab").innerHTML;
  }

}